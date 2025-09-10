import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader } from "lucide-react"
import { useWorkspaceChart } from "@/contexts/workspace-chart-context"

export function ChatInput() {
  const { state, dispatch, sendMessage } = useWorkspaceChart()
  const { prompt, loading } = state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !loading) {
      sendMessage(prompt)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-background">
      <div className="relative px-4 pb-4">
        <Textarea 
          placeholder="Type your message here..."
          className="min-h-[60px] pr-12 resize-none w-full"
          rows={2}
          value={prompt}
          onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          disabled={loading}
        />
        <Button 
          type="submit"
          size="icon" 
          variant="ghost"
          className="absolute right-6 bottom-6 h-8 w-8 text-muted-foreground hover:text-foreground"
          disabled={!prompt.trim() || loading}
        >
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground pb-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  )
}
