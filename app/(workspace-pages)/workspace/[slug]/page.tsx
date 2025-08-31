import { getConversation, insertMessage } from "@/server/services/conversation";
import { WorkspaceChart } from "./components/workspace-chart"
import { requireUser } from "@/lib/auth";
import { getChartFromMessage } from "@/server/services/chart";

export default async function WorkspacePage({ params,searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const slug = await params;
  console.log("🚀 ~ WorkspacePage ~ slug:", slug)
  const searchParamsData = await searchParams;
  console.log("🚀 ~ WorkspacePage ~ searchParamsData:", searchParamsData)
  const user = await requireUser()

  const conversation = await getConversation({ id: slug.slug , userId: user.id });

  console.log("🚀 ~ WorkspacePage ~ conversation:", conversation)

  let messages = conversation?.messages;
  let newMessage = undefined;

  if(!messages?.length){
    const insertedMessage = await insertMessage({
      conversationId: conversation?.id as string,
      content: [{
        type: "text",
        text: "Hi there! I'm your AI assistant. I can help you create and customize charts. What would you like to visualize today?",
      }],
      role: "ASSISTANT",
    })
    messages = [insertedMessage]

    newMessage = {
      role: "USER",
      content: [{
        type: "text",
        text: searchParamsData?.prompt as string,
      }],
    }
  }


  const chartData = await getChartFromMessage({ conversationId: conversation?.id as string })
  console.log("🚀 ~ WorkspacePage ~ chartData:", chartData)

  const conversationData = {
    id: conversation?.id,
    title: conversation?.title,
    messages : messages?.reverse(),
    newMessage,
    chartData:chartData?.dataSpec,
  }

  return <WorkspaceChart conversationData={conversationData}/>
}
