"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Share2 } from "lucide-react"

export default function ShareButton() {
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "The shareable link has been copied to your clipboard.",
        })
      }
    } catch {
      toast({
        title: "Could not copy",
        description: "Please copy the URL from your browser address bar.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button onClick={handleShare} variant="secondary" className="gap-2" aria-label="Share chart">
      <Share2 className="size-4" />
      Share
    </Button>
  )
}
