import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useWorkspaceChart } from "@/contexts/workspace-chart-context"
import { useEffect, useRef } from "react"

export function ChatPanel() {
  const { state } = useWorkspaceChart()
  const { messages } = state
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isLastMessage={index === messages.length - 1}
                messageEndRef={index === messages.length - 1 ? messagesEndRef : undefined}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  )
}
