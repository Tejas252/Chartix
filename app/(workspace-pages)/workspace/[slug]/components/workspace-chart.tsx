"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Share2,
  ChevronRight,
  Palette,
  PieChartIcon,
  Ruler,
  Edit3,
  Database,
  Send,
  PanelLeftIcon,
  Loader,
} from "lucide-react"
import { motion } from "framer-motion"
import { ChartPreview } from "@/components/workspace/chart-preview"
import { useMutation } from "@apollo/client/react"
import { CHAT_MUTATION } from "@/client/graphql/chat.mutation"
import moment from "moment"
import { UniversalChartFormat } from "@/types/chart"
import { error } from "console"
import { toast } from "@/hooks/use-toast"

type MessageContent = {
  type: string;
  text: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
};

type Message = {
  role: string;
  content: string | MessageContent | MessageContent[];
  createdAt: string;
  // Optional fields for backward compatibility with existing code
  text?: string;
  bgColor?: string;
  opacity?: number;
  textColor?: string;
};

const chatMessages: Message[] = [
  {
    role: "assistant",
    content: [
      { type: 'text', text: "Hi there! I'm your AI assistant. I can help you create and customize charts. What would you like to visualize today?" }
    ],
    createdAt: new Date().toISOString(),
    // Legacy fields for demo
    text: "Hi there! I'm your AI assistant. I can help you create and customize charts. What would you like to visualize today?",
    bgColor: "primary",
    opacity: 20,
    textColor: "primary"
  },
  {
    role: "user",
    content: [
      { type: 'text', text: "Hi, I want a pie chart with the top 5 richest people." }
    ],
    createdAt: new Date().toISOString(),
    // Legacy fields for demo
    text: "Hi, I want a pie chart with the top 5 richest people.",
    bgColor: "secondary",
    opacity: 100,
    textColor: "secondary"
  },
  {
    role: "assistant",
    content: [
      { type: 'text', text: "I'll help you create that pie chart. Here's what I'll do:" },
      { type: 'text', text: 'Extract the top 5 richest people from the dataset' },
      { type: 'text', text: 'Create a pie chart showing their relative wealth' },
      { type: 'text', text: 'Add appropriate labels and styling' },
    ],
    createdAt: new Date().toISOString(),
    // Legacy fields for demo
    text: "I'll help you create that pie chart. Here's what I'll do:",
    bgColor: "primary",
    opacity: 20,
    textColor: "primary"
  },
]

export function WorkspaceChart({ conversationData }: { conversationData: any }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>(conversationData.messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  console.log("🚀 ~ WorkspaceChart ~ messages:", messages)
  const [chartData, setChartData] = useState<UniversalChartFormat>(conversationData.chartData)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const effectRan = useRef(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages])

  // Handle new message from conversationData
  useEffect(() => {
    if (effectRan.current === false && conversationData?.newMessage && !loading) {
      handleSendMessage(conversationData.newMessage.content[0].text);
      effectRan.current = true;
    }
    
    return () => {
      effectRan.current = false;
    };
  }, [conversationData?.newMessage]);

  const [chat] = useMutation(CHAT_MUTATION)

  const handleSendMessage = (prompt: string) => {
    if(!conversationData?.id || loading){
      return;
    }

    setPrompt("")

    setMessages((prev) => [...prev, { role: "USER", content: [{ type: "text", text: prompt }], createdAt: moment().calendar() }])

    setLoading(true)
    chat({
      variables:{
        input:{
          conversationId: conversationData.id,
          prompt,
        }
      },
      fetchPolicy: "network-only",
    })
    .then((res) => {
      console.log("🚀 ~ handleSendMessage ~ res:", res)
      const message = res?.data?.chat;
      
      const aiMessage = {
        role: "ASSISTANT",
        content:[{
          type: "text",
          text: message?.aiResponse,
        }],
        createdAt: moment().calendar(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setChartData(message?.chartData?.normalized)

    })
    .catch((err) => {
      console.log("🚀 ~ handleSendMessage ~ err:", err)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    })
    .finally(() => {
      setLoading(false)
    })
  }


  return (
    <div className="flex h-screen w-full overflow-hidden gap-3">
      {/* Left column: data + prompt */}
      {isPanelOpen && (
        <motion.div
          className="fixed inset-y-0 left-0 z-50 w-full max-w-sm overflow-y-auto bg-background shadow-lg md:relative md:block"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: -100 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Card className="flex flex-col h-[calc(100vh-2rem)]">
            <div className="border-b">
              <CardHeader className="py-1">
                <CardTitle className="text-base">Ask AI</CardTitle>
              </CardHeader>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-4 space-y-4 overflow-y-auto" ref={messagesEndRef}>
              {messages.map((message: Message, index: number) => {
                const isLastMessage = index === messages.length - 1;
                const isAssistant = message.role === 'ASSISTANT';
                const bgColor = isAssistant ? 'bg-muted' : 'bg-primary';
                const textColor = isAssistant ? 'text-muted-foreground' : 'text-primary-foreground';
                
                return (
                  <div 
                    key={index} 
                    className={`flex ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div className="flex-1">
                      <div className={`${bgColor} rounded-lg p-3 max-w-[80%] ${isAssistant ? 'mr-auto' : 'ml-auto'}`}>
                        {Array.isArray(message.content) ? (
                          message.content.map((content: MessageContent, contentIndex: number) => (
                            content.type === 'text' && (
                              <p key={contentIndex} className={`text-sm ${textColor}`}>
                                {content.text}
                              </p>
                            )
                          ))
                        ) : (
                          <p className={`text-sm ${textColor}`}>
                            {typeof message.content === 'string' ? message.content : ''}
                          </p>
                        )}
                        {Array.isArray(message.content) && message.content.some(c => c.toolCalls) && (
                          message.content.flatMap(content => 
                            content.toolCalls?.map((call, callIndex) => (
                              <div key={callIndex} className="mt-2 p-2 bg-background/50 rounded text-xs">
                                <div className="font-mono">{call.name}</div>
                                <pre className="whitespace-pre-wrap mt-1">
                                  {JSON.stringify(call.arguments, null, 2)}
                                </pre>
                              </div>
                            ))
                          ) || []
                        )}
                      </div>
                      <p className={`text-xs text-muted-foreground mt-1 ${isAssistant ? 'ml-1' : 'mr-1'}`}>
                        {moment(message.createdAt).isValid() ? moment(message.createdAt).calendar() : message.createdAt}
                      </p>
                    </div>
                  </div>
                );
              })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="border-t p-4 bg-background">
              <div className="relative">
                <Textarea 
                  placeholder="Type your message here..."
                  className="min-h-[60px] pr-12 resize-none"
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === "Enter" && !e.shiftKey){
                      handleSendMessage(prompt)
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 bottom-2 h-8 w-8"
                  onClick={() => handleSendMessage(prompt)}
                >
                  {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Right preview canvas */}
      <div className="flex-1 overflow-hidden h-[calc(100vh-2rem)]">
        <PreviewShell 
          onTogglePanel={() => setIsPanelOpen((v) => !v)} 
          isPanelOpen={isPanelOpen}
        >
          <ChartPreview chartData={chartData} loading={loading}/>
        </PreviewShell>
      </div>
    </div>
  )
}

function PreviewShell({
  children,
  onTogglePanel,
  isPanelOpen,
}: {
  children: React.ReactNode
  onTogglePanel: () => void
  isPanelOpen: boolean
}) {
  return (
    <Card className="relative h-full">
      <CardHeader className="flex items-center justify-between space-y-0 py-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePanel}
          aria-label={isPanelOpen ? "Hide chat bar" : "Show chat bar"}
          title={isPanelOpen ? "Hide chat bar" : "Show chat bar"}
        >
          <PanelLeftIcon className={`h-4 w-4 ${isPanelOpen ? "" : "opacity-70"}`} />
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:underline">Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate font-medium text-foreground">How popular are America&apos;s richest?</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="relative h-[70dvh] p-0 md:h-[76dvh]">
        {children}
      </CardContent>
    </Card>
  )
}

function Tool({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="pointer-events-auto inline-flex items-center gap-2 rounded-md border bg-background/80 px-2 py-1 text-xs shadow-sm backdrop-blur"
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </div>
  )
}

function ToolsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-base">Tools</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 p-3">
        <Tool icon={<Ruler className="h-4 w-4" />} label="Size" />
        <Tool icon={<PieChartIcon className="h-4 w-4" />} label="Graph" />
        <Tool icon={<Palette className="h-4 w-4" />} label="Color" />
        <Tool icon={<Edit3 className="h-4 w-4" />} label="Annotate" />
        <Tool icon={<Database className="h-4 w-4" />} label="Edit data" />
      </CardContent>
    </Card>
  )
}