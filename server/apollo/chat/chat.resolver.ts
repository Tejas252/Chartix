import { getGenerativeModel } from "@/lib/ai/models";
import builder from "@/lib/pothos-builder";
import { prisma } from "@/lib/prisma";
import { supabaseClient } from "@/lib/supabase";
import { extractDataFromFileBuffer, getFirstFiveRowsAsString } from "@/lib/utils/file-utils";
import { markDownToJson } from "@/lib/utils/json-parser";
import { SYSTEM_PROMPT } from "@/prompts/system";
import { createChart } from "@/server/services/chart";
import { getMessages, insertMessage, parseMessagesForAI } from "@/server/services/conversation";
import { processDataToChartFormat } from "@/server/services/generationStep";
import { createClient } from "@supabase/supabase-js";
import { generateText, ModelMessage } from "ai";
import { DateTimeResolver, GraphQLJSON } from "graphql-scalars";


builder.addScalarType('JSON', GraphQLJSON, {});
builder.addScalarType('DateTime', DateTimeResolver, {});

builder.prismaObject("Message", {
    name: "Message",
    fields: (t) => ({
        id: t.exposeID("id"),
        content: t.expose("content", { type: "JSON" }),
        role: t.expose("role", { type: "String" }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
    })
})

const ChatInput = builder.inputType("ChatInput", {
    fields: (t) => ({
        prompt: t.string({ required: true }),
        conversationId: t.id({ required: true })
    })
})

interface ChatResponse {
    aiResponse: string;
    steps: any[];
    chartData: any[];
    chartId: string;
}

const chatResponseType = builder.objectRef<ChatResponse>("ChatResponse");

chatResponseType.implement({
    fields: (t) => ({
        aiResponse: t.exposeString("aiResponse"),
        steps: t.expose("steps", { type: "JSON" }),
        chartData: t.expose("chartData", { type: "JSON" }),
        chartId: t.exposeString("chartId"),
    })
})

builder.prismaObject("File", {
    name: "File",
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        kind: t.exposeString("kind"),
        mimeType: t.exposeString("mimeType"),
        size: t.exposeInt("size"),
        url: t.exposeString("url"),
        provider: t.exposeString("provider"),
        bucket: t.exposeString("bucket"),
        key: t.exposeString("key"),
        checksum: t.exposeString("checksum"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    })
})

builder.prismaObject("Conversation", {
    name: "Conversation",
    fields: (t) => ({
        id: t.exposeID("id"),
        title: t.exposeString("title"),
        messages: t.relation("messages"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        file: t.relation("file"),
    })
})

builder.queryType({
    fields: (t) => ({
        chat: t.prismaField({
            name: "chat",
            type: ["Message"],
            args: {
                input: t.arg({ type: ChatInput })
            },
            resolve: async (query, root, args, context, info) => {
                return await prisma.message.findMany({
                    where: { conversationId: args?.input?.conversationId },
                })
            }
        }),
        getConversation: t.prismaField({
            type: "Conversation",
            args: {
                id: t.arg({ type: "String", required: true })
            },
            authScopes:{
                isAuthenticated: true
            },
            resolve: async (query, root, args, context, info) => {
                return await prisma.conversation.findUnique({
                    where: { id: args?.id,userId: context?.me?.id },
                })
            }
        })
    })
})


builder.mutationType({
    fields: (t) => ({
        chat: t.prismaField({
            name: "chat",
            type: chatResponseType,
            args: {
                input: t.arg({ type: ChatInput, required: true })
            },
            authScopes:{
                isAuthenticated: true
            },
            resolve: async (query, root, args, context, info) => {

                const { prompt, conversationId } = args.input
                try {
                    if (!prompt || !conversationId) {
                        throw new Error('Prompt and Conversation ID are required')
                    }

                    // 1. Get the conversation and associated file
                    const conversation = await prisma.conversation.findUnique({
                        where: { id: conversationId },
                        include: { file: true },
                    });

                    if (!conversation || !conversation.file) {
                        throw new Error('Conversation or file not found')
                    }

                    console.log(process.env.SUPABASE_S3_BUCKET)

                    const supabaseAdmin = createClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
                      )

                    const { data: buckets, error } = await supabaseAdmin
                        .storage
                        .listBuckets()

                    console.log("🚀 ~ buckets:", buckets)

                    const { data: publicUrl } = await supabaseAdmin.storage.from(process.env.SUPABASE_S3_BUCKET as string).createSignedUrl(conversation?.file?.key as string,60)
                    console.log("🚀 ~ publicUrl:", publicUrl)
                    const fileBuffer = await fetch(publicUrl?.signedUrl as string).then(res => res.arrayBuffer()).catch((error) => {
                        console.log("🚀 ~ error:", error)
                        throw error
                    })
                    const data = extractDataFromFileBuffer(fileBuffer)
                    // console.log("🚀 ~ data:", data)

                    const fiveRowsData = getFirstFiveRowsAsString(data);

                    // 5. Construct the final prompt
                    const finalPrompt = `
                      Table Data:
                      ${fiveRowsData}
                
                      User Query:
                      ${prompt}
                    `;

                    const userMessage = await insertMessage({
                        conversationId,
                        content: [
                            {
                                type: "reference",
                                reference: fiveRowsData
                            },
                            {
                                type: "text",
                                text: prompt,
                            }],
                        role: "USER",
                    })

                    const messages = await getMessages({
                        conversationId,
                    })

                    console.log("🚀 ~ messages:", messages)

                    const parsedMessages = parseMessagesForAI({ messages })

                    const model = getGenerativeModel();

                    // 6. Send the response with stream
                    const result = await generateText({
                        model: model,
                        system: SYSTEM_PROMPT,
                        prompt: finalPrompt,
                        // messages: parsedMessages as ModelMessage[],
                    });

                    console.log("🚀 ~ result:", result?.text)

                    const parsedData = markDownToJson(result.text);

                    if(!parsedData?.steps?.length > 0 || !parsedData?.columns?.length > 0){
                        const assistantMessage = await insertMessage({
                            conversationId,
                            content: [
                                {
                                    type: "realMessage",
                                    realMessage: result.text,
                                },
                                {
                                    type: "text",
                                    text: "User query is not related to data",
                                }
                            ],
                            role: "ASSISTANT",
                        })

                        return {
                            aiResponse: "User query is not related to data",
                            steps: [],
                            chartData: [],
                            chartId: "",
                        }
                    }

                    if(parsedData?.text){
                        const assistantMessage = await insertMessage({
                            conversationId,
                            content: [
                                {
                                    type: "realMessage",
                                    realMessage: result.text,
                                },
                                {
                                    type: "text",
                                    text: parsedData?.text,
                                }
                            ],
                            role: "ASSISTANT",
                        })

                        return {
                            aiResponse: parsedData?.text,
                            steps: [],
                            chartData: [],
                            chartId: "",
                        }
                    }

                    const assistantMessage = await insertMessage({
                        conversationId,
                        content: [
                            {
                                type: "realMessage",
                                realMessage: result.text,
                            },
                            ...(parsedData?.steps?.map((step) => step?.humanReadableFormat || "")?.map((step: string) => {
                                return {
                                    type: "text",
                                    text: step,
                                }
                            }) || []),
                        ],

                        role: "ASSISTANT",
                    })
                    console.log("🚀 ~ assistantMessage:", assistantMessage)

                    const formattedData: Record<string, any[]> = {}

                   

                    // data = data.slice(2)

                    data[0].forEach((column, index) => {
                        formattedData[column] = data?.slice(1)?.map((row) => row?.[index])
                    })

                    const transformedData = processDataToChartFormat(formattedData, parsedData?.steps ? parsedData?.steps : parsedData, parsedData?.columns ? parsedData?.columns : []);
                    console.log("🚀 ~ transformedData:", transformedData)

                    const newChart =  await createChart({
                        dataSpec: transformedData?.normalized,
                        generationSteps: parsedData?.steps,
                        message: {
                            connect: {
                                id: assistantMessage?.id,
                            }
                        },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        user: {
                            connect: {
                                id: context?.me?.id,
                            }
                        },
                        file: {
                            connect: {
                                id: conversation?.file?.id,
                            }
                        },
                        conversation:{
                            connect:{
                                id: conversation?.id,
                            }
                        },
                        title: parsedData?.slug,
                        visibility: "PRIVATE",
                        slug: parsedData?.slug,
                        config:{
                            type:'bar'
                        }
                    })

                    return {
                        aiResponse: assistantMessage?.content?.filter((content: any) => content.type === "text")?.map((content: any) => content.text)?.join("\n"),
                        steps: parsedData?.steps,
                        chartData: transformedData,
                        chartId: newChart?.id,
                    }


                } catch (error) {
                    console.log("🚀 ~ error:", error)
                    throw error
                }
            }
        })
    })
})