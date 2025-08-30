"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, FileUp, ArrowUpRight, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Accepted MIME types and extensions
const ACCEPT = [
  ".csv",
  ".xls",
  ".xlsx",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export default function IngestBar() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [promptPrimary, setPromptPrimary] = useState("")
  const [promptSecondary, setPromptSecondary] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  const onFiles = useCallback((list: FileList | null) => {
    if (!list || list.length === 0) return
    
    // Only take the first file
    const file = list[0]
    if (isAccepted(file)) {
      setFiles([file])
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      })
    }
  }, [toast])

  function isAccepted(f: File) {
    const name = f.name.toLowerCase()
    const type = f.type
    return (
      name.endsWith(".csv") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx") ||
      type === "text/csv" ||
      type === "application/vnd.ms-excel" ||
      type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
  }


  async function handleUpload() {
    if (!files.length) {
      // allow navigation with only prompts
      router.push(
        `/workspace?prompt=${encodeURIComponent(promptPrimary)}&prompt2=${encodeURIComponent(promptSecondary)}`,
      )
      return
    }
    try {
      setLoading(true)
      const fd = new FormData()
      files.forEach((f) => fd.append("file", f))
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const json = await res.json()
      console.log("🚀 ~ handleUpload ~ json:", json)
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      })
      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Upload failed")
      }
      const keys = (json.files as { key: string }[]).map((f) => f.key).join(",")
      router.push(
        `/workspace?keys=${encodeURIComponent(keys)}&prompt=${encodeURIComponent(
          promptPrimary,
        )}&prompt2=${encodeURIComponent(promptSecondary)}`,
      )
    } catch (e) {
      console.error("[v0] upload error:", e)
      // Optional: use toast if project has it
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-muted-foreground/20">
      <CardContent className="space-y-1">
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files)
            // Reset the input value to allow re-uploading the same file
            if (e.target) e.target.value = ''
          }}
        />

        {/* Dropzone */}
        <div className="space-y-4">
          {/* Combined Input and Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              onFiles(e.dataTransfer.files)
            }}
            className={`relative rounded-lg p-2 transition-colors ${
              dragActive ? "border-primary bg-muted/40" : ""
            }`}
          >
            {/* Main Prompt Input */}
            <div className="relative mb-2">
              <Textarea
                placeholder="Describe what you want to visualize or analyze..."
                className="min-h-[60px] max-h-[120px] resize-none pr-10 text-base"
                value={promptPrimary}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPromptPrimary(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey && promptPrimary.trim()) {
                    e.preventDefault()
                    handleUpload()
                  }
                }}
                rows={1}
                style={{
                  height: 'auto',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              />
              {promptPrimary && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                  onClick={() => promptPrimary && handleUpload()}
                  disabled={!promptPrimary.trim() || loading}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* File Drop Area */}
            <div 
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-2 text-center transition-colors ${
                dragActive ? 'border-primary bg-muted/20' : 'border-muted-foreground/30'
              }`}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {files[0] ? (
                  <span className="font-medium text-foreground">{files[0].name}</span>
                ) : (
                  'Or drag and drop a file here (CSV, Excel)'
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {files[0] ? 'Click to change file' : 'Supports .csv, .xls, .xlsx up to 10MB'}
              </p>
            </div>

            {files[0] && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8 px-2 text-xs text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  setFiles([])
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Remove file
              </Button>
            )}

            <Button
              className="mt-2 w-full rounded-full"
              onClick={handleUpload}
              disabled={(!promptPrimary.trim() && !files[0]) || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Visualization'
              )}
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
