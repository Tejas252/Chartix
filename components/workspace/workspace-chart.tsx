import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PanelLeftIcon, Share2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChartPreview } from "@/components/workspace/chart-preview"
import { ChatPanel } from "./chat-panel"
import { useWorkspaceChart } from "@/contexts/workspace-chart-context"
import { useScreenSize } from "@/hooks/use-screen-size"

type PreviewShellProps = {
  children: React.ReactNode
  onTogglePanel: () => void
  isPanelOpen: boolean
}

function PreviewShell({ children, onTogglePanel, isPanelOpen }: PreviewShellProps) {
  return (
    <Card className="relative h-full flex flex-col">
      <div className="border-b">
        <CardHeader className="py-2 px-4">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onTogglePanel}
              aria-label={isPanelOpen ? "Hide chat bar" : "Show chat bar"}
              title={isPanelOpen ? "Hide chat bar" : "Show chat bar"}
            >
              <PanelLeftIcon className={`h-4 w-4 ${isPanelOpen ? "" : "opacity-70"}`} />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1 px-4">
              <span className="hover:underline">Home</span>
              <ChevronRight className="h-4 w-4" />
              <span className="truncate font-medium text-foreground">How popular are America&apos;s richest?</span>
            </div>
            <Button variant="secondary" size="sm" className="h-8">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardHeader>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </Card>
  )
}

type WorkspaceChartProps = {
  conversationData: {
    id: string
    messages: any[]
    chartData: any
  }
}

export function WorkspaceChart({ conversationData }: WorkspaceChartProps) {
  const { state, dispatch } = useWorkspaceChart()
  const { isPanelOpen } = state
  const { isMobile, isTablet, isDesktop } = useScreenSize()
  const effectRan = useRef(false)

  // Initialize conversation data
  useEffect(() => {
    if (conversationData) {
      dispatch({ type: 'SET_MESSAGES', payload: conversationData.messages })
      dispatch({ type: 'SET_CHART_DATA', payload: conversationData.chartData })
      dispatch({ type: 'SET_CONVERSATION_ID', payload: conversationData.id })
    }
  }, [conversationData, dispatch])

  // Handle new message from conversationData
  useEffect(() => {
    if (effectRan.current === false && conversationData?.newMessage && !state.loading) {
      // Handle new message if needed
      effectRan.current = true
    }
    
    return () => {
      effectRan.current = false
    }
  }, [conversationData?.newMessage, state.loading])

  const togglePanel = () => {
    dispatch({ type: 'TOGGLE_PANEL' })
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full overflow-hidden gap-3">
      {/* Left column: chat panel */}
      {!isMobile && !isTablet && isPanelOpen && (
        <motion.div
          className="flex-shrink-0 w-full max-w-sm overflow-hidden bg-background rounded-lg shadow-lg md:block h-full flex flex-col"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Card className="flex flex-col h-full">
            <div className="border-b">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base m-0">Ask AI</CardTitle>
              </CardHeader>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatPanel />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Right preview canvas */}
      <div className="flex-1 overflow-hidden h-full">
        <PreviewShell 
          onTogglePanel={togglePanel}
          isPanelOpen={isPanelOpen}
        >
          <ChartPreview chartData={state.chartData} loading={state.loading} />
        </PreviewShell>
      </div>
    </div>
  )
}
