"use client"

import Link from "next/link"
import IngestBar from "@/components/ingest-bar"
import { FileSpreadsheet } from "lucide-react"

export default function Page() {
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
              <Link href="#" className="inline-flex items-start gap-2 rounded-md p-2 hover:bg-muted/50">
                <FileSpreadsheet className="mt-0.5 h-4 w-4 text-emerald-600" />
                <div>
                  <div className="font-medium">Sheet1</div>
                  <p className="text-sm text-muted-foreground">
                    Sales order data including customer details, order totals, and status information.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
