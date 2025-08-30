"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function PromptPanel() {
  const [prompt, setPrompt] = useState("Create a bar chart of revenue by quarter.")
  const [submitting, setSubmitting] = useState(false)

  const handleGenerate = async () => {
    setSubmitting(true)
    // Placeholder: send to your API to parse data + generate chart config
    await new Promise((r) => setTimeout(r, 600))
    const ev = new CustomEvent("v0:generate-chart", { detail: { prompt } })
    window.dispatchEvent(ev)
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Prompt</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the chart you want (e.g., 'Monthly signups by plan as a stacked bar')."
            rows={5}
            aria-label="Chart prompt"
          />
          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={submitting} className="gap-2">
              <Sparkles className="size-4" aria-hidden="true" />
              {submitting ? "Generating..." : "Generate Chart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
