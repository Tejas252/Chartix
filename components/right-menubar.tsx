"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, History } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// Only render Clerk if configured
import { UserButton } from "@clerk/nextjs"

type ChatItem = { id: string; title: string }

export default function RightMenubar() {
  const [chats, setChats] = useState<ChatItem[]>([
    { id: "1", title: "Revenue by quarter" },
    { id: "2", title: "Monthly signups by plan" },
    { id: "3", title: "Top 10 customers" },
    { id: "4", title: "Weekly churn trend" },
    { id: "5", title: "ARPU by region" },
  ])

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ prompt: string }>
      const newItem = { id: Date.now().toString(), title: ce.detail.prompt.slice(0, 48) }
      setChats((prev) => [newItem, ...prev].slice(0, 5))
    }
    window.addEventListener("v0:generate-chart", handler as any)
    return () => window.removeEventListener("v0:generate-chart", handler as any)
  }, [])

  const startNew = () => {
    const ev = new CustomEvent("v0:generate-chart", { detail: { prompt: "New chart" } })
    window.dispatchEvent(ev)
  }

  const clerkEnabled = useMemo(() => Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), [])

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Menu</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <Button variant="default" onClick={startNew} className="w-full gap-2">
          <Plus className="size-4" aria-hidden="true" />
          New Chat
        </Button>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <History className="size-4 text-muted-foreground" aria-hidden="true" />
            Recent
          </div>
          <ScrollArea className="h-48 rounded-md border">
            <ul className="divide-y">
              {chats.map((c) => (
                <li key={c.id}>
                  <button
                    className="w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-muted/60"
                    onClick={() => {
                      const ev = new CustomEvent("v0:generate-chart", { detail: { prompt: c.title } })
                      window.dispatchEvent(ev)
                    }}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        <Separator className="my-2" />

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="hidden sm:block">
            <span className="text-sm text-muted-foreground">Signed in as</span>
            <div className="text-sm font-medium">You</div>
          </div>
          <div className="flex items-center">
            {clerkEnabled ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
