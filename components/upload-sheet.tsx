"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload } from "lucide-react"

export default function UploadSheet() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<number>(0)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    // Simulate upload progress for demo
    setUploading(true)
    setProgress(0)
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 60))
      setProgress(i * 10)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="sheet-upload"
        className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 text-center hover:bg-muted/50"
      >
        <Upload className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm">Drag & drop or click to upload .csv or .xlsx</span>
        <span className="text-xs text-muted-foreground">Max 10MB. Supported: CSV, XLSX</span>
      </label>
      <Input
        id="sheet-upload"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={onFileChange}
        className="hidden"
        aria-label="Upload CSV or XLSX file"
      />
      {fileName && (
        <div className="rounded-md border p-3">
          <div className="mb-2 text-sm">Selected: {fileName}</div>
          {uploading ? (
            <Progress value={progress} aria-label="Upload progress" />
          ) : (
            <div className="text-xs text-muted-foreground">
              File ready. You can write a prompt below to generate a chart.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
