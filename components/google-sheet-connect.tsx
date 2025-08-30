"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink } from "lucide-react"

export default function GoogleSheetConnect() {
  const [url, setUrl] = useState("")

  const handleConnect = async () => {
    // Placeholder for OAuth / API flow
    // You can wire this to a route handler or server action to store credentials.
    alert("Google Sheets connection flow not implemented yet.")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm">Connect a Google Sheet or paste a share URL (viewer access).</div>
      <Input
        placeholder="https://docs.google.com/spreadsheets/d/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        aria-label="Google Sheets URL"
      />
      <div className="flex items-center gap-2">
        <Button type="button" onClick={handleConnect} className="gap-2">
          <ExternalLink className="size-4" aria-hidden="true" />
          Connect Google Sheets
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        We’ll securely use your sheet to generate charts from your prompt.
      </div>
    </div>
  )
}
