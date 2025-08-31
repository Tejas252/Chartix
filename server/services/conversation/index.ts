import { prisma } from "@/lib/prisma";
import { MessageRole } from "@prisma/client";

export const createConversation = async ({
    title,
    userId,
    teamId,
    fileId,
  }: {
    title: string;
    userId?: string;
    teamId?: string;
    fileId: string;
  }) => {
    return await prisma.conversation.create({
      data: {
        title,
        userId,
        teamId,
        fileId,
        status: "active",
      },
    });
  };


  export const getConversation = async ({
    id,
    userId,
  }: {
    id: string;
    userId?: string;
  }) => {
    return await prisma.conversation.findUnique({
      where: {
        id,
        ...(userId ? { userId } : {}),
      },
      include:{
        messages:{
          take:20,
          orderBy:{
            createdAt:"desc"
          }
        }
      }
    });
  };

  export const insertMessage = async ({
    conversationId,
    content,
    role,
    
  }: {
    conversationId: string;
    content: object[];
    role: MessageRole;
  }) => {
    return await prisma.message.create({
      data: {
        conversationId,
        content,
        role,
      },
    });
  };


  export const getMessages = async ({
    conversationId,
    take,
    skip,
    orderBy = {createdAt:"desc"},
  }: {
    conversationId: string;
    take?: number;
    skip?: number;
    orderBy?: {
      createdAt: "asc" | "desc";
    };
  }) => {
    return await prisma.message.findMany({
      where: {
        conversationId,
      },
      take,
      skip,
      orderBy,
    });
  };

  export const parseUserMessageForAI =  ({
    content,
  }: {
    content: any[];
  }) => {

    const fiveRowsData = content?.filter?.((content: any) => content.type === "reference")?.map?.((content: any) => content.reference)?.join("\n") as string
    const prompt = content?.filter?.((content: any) => content.type === "text")?.map?.((content: any) => content.text)?.join("\n") as string

    return {
      role: "user",
      content: `
      Table Data:
      ${fiveRowsData}

      User Query:
      ${prompt}
      `
    };
  };

  export const parseMessagesForAI =  ({
    messages,
  }: {
    messages: any[];
  }) => {
    return messages.map( (message) => {
      if (message.role === "USER") {
        return parseUserMessageForAI({content: message.content});
      } else if (message.role === "ASSISTANT") {
        return {
          role: "assistant",
          content: message.content?.filter?.((content: any) => content.type === "realMessage")?.map?.((content: any) => content.realMessage)?.join("\n") as string,
        };
      }
    }).filter(Boolean);
  };


  