"use client"

import Link from "next/link"
import IngestBar from "@/components/ingest-bar"
import { FileSpreadsheet } from "lucide-react"
import { GET_CONVERSATIONS } from "@/client/graphql/conversastion/conversastion.query"
import { useQuery } from "@apollo/client/react"
import { Conversation } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Page() {
    const { data:conData,loading:conLoading,error:conError } = useQuery(GET_CONVERSATIONS)
    console.log("🚀 ~ Page ~ conData:", conData)
    console.log("🚀 ~ Page ~ conLoading:", conLoading)
    console.log("🚀 ~ Page ~ conError:", conError)
  return (
    <main className="flex min-h-dvh flex-col h-full w-full items-center justify-center">
      <section className="flex-1 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">
            What can I help you visualize?
          </h1>

          <IngestBar />

          <div className="space-y-2 pt-6">
            <h2 className="text-center text-sm font-medium text-muted-foreground">Previously imported data</h2>
            <div className="mx-auto max-w-md text-left">
              <ScrollArea className="max-h-72 overflow-y-auto">
                {conData?.getConversations?.map((conversation:Conversation) => (
                  <Link href={`/workspace/${conversation.id}`} className="inline-flex items-start gap-2 rounded-md p-2 hover:bg-muted/50">
                    <FileSpreadsheet className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">{conversation.title}</div>
                      <p className="text-sm text-muted-foreground">
                      {conversation?.file?.name}
                    </p>
                  </div>
                </Link>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
