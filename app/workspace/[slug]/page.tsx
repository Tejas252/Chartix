"use client"

import { useState } from "react"

import type React from "react"
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
} from "lucide-react"
import { ChartPreview } from "@/components/workspace/chart-preview"
import NavAuth from "@/components/auth/nav-auth"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion } from "framer-motion"

const chatMessages = [
  {
    text: "Hi there! I'm your AI assistant. I can help you create and customize charts. What would you like to visualize today?",
    bgColor: "primary",
    opacity: 20,
    textColor: "primary",
    role: "assistant",
  },
  {
    text: "Hi, I want a pie chart with the top 5 richest people.",
    bgColor: "secondary",
    opacity: 10,
    textColor: "secondary",
    role: "user",
  },
  {
    text: "I'll help you create that pie chart. Here's what I'll do:",
    bgColor: "primary",
    opacity: 20,
    textColor: "primary",
    list: [
      "Extract the top 5 richest people from the dataset",
      "Create a pie chart showing their relative wealth",
      "Add appropriate labels and styling",
    ],
    role: "assistant",
  },
]

export default function WorkspacePage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

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
            {/* <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Imported data</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <ScrollArea className="h-56">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="[&>th]:px-3 [&>th]:py-2">
                        <th className="text-left">Name</th>
                        <th className="text-right">Favorable</th>
                        <th className="text-right">Unfavorable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.name} className="border-b last:border-0 [&>td]:px-3 [&>td]:py-2">
                          <td className="font-medium">{r.name}</td>
                          <td className="text-right">{r.fav}%</td>
                          <td className="text-right">{r.unfav}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card> */}

            <Card className="flex flex-col h-[calc(100vh-2rem)]">
              {/* Fixed Header */}
              <div className="border-b">
                <CardHeader className="py-1">
                  <CardTitle className="text-base">Ask AI</CardTitle>
                </CardHeader>
              </div>
              
              {/* Scrollable Chat Area */}
              <ScrollArea className="flex-1 p-4 space-y-4">
                {/* AI Message */}
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "assistant" ? "" : "flex-row-reverse"}`}>
                    <div className="flex-1">
                      <div className={`bg-${message.bgColor}/${message.opacity} rounded-lg p-3 max-w-[80%] ${message.role === "assistant" ? "mr-auto" : "ml-auto"}`}>
                        <p className="text-sm">
                          {message.text}
                        </p>
                        {message.list && (
                          <ul className={`mt-2 space-y-1 list-disc pl-4 text-sm`}>
                            {message.list.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <p className={`text-xs text-${message.textColor}-foreground mt-1 ${message.role === "assistant" ? "ml-1" : "mr-1"}`}>Just now</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              {/* Sticky Input Area */}
              <div className="border-t p-4 bg-background">
                <div className="relative">
                  <Textarea 
                    placeholder="Type your message here..."
                    className="min-h-[60px] pr-12 resize-none"
                    rows={2}
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-2 bottom-2 h-8 w-8"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </motion.div>)}

      {/* Right preview canvas */}
      <div className="flex-1 overflow-hidden h-[calc(100vh-2rem)]">
        <PreviewShell 
          onTogglePanel={() => setIsPanelOpen((v) => !v)} 
          isPanelOpen={isPanelOpen}
        >
          <ChartPreview />
        </PreviewShell>
      </div>
    </div>
  )
}

function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} title={label}>
      {icon}
    </Button>
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
      <CardContent className="relative h-[70dvh] p-0 md:h-[76dvh]">{children}</CardContent>
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

const rows = [
  { name: "Elon Musk", fav: 39, unfav: 26 },
  { name: "Jeff Bezos", fav: 29, unfav: 31 },
  { name: "Mark Zuckerberg", fav: 13, unfav: 38 },
  { name: "Bill Gates", fav: 26, unfav: 18 },
  { name: "Warren Buffett", fav: 52, unfav: 14 },
]
