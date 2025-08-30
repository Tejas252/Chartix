"use client"

import * as React from "react"

import { ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import ResizableChart from "../charts/resizableChart"
import { useState } from "react"
import { ChartType, UniversalChartFormat } from "@/types/chart"
import { ChartControls } from "./chart-controls/chart-controls"

type ChartPreviewProps = {
  onOpenChat?: () => void
}

const data = [
  { name: "Elon Musk", value: 39 },
  { name: "Jeff Bezos", value: 29 },
  { name: "Mark Zuckerberg", value: 13 },
  { name: "Bill Gates", value: 26 },
  { name: "Warren Buffett", value: 52 },
]

// Use theme tokens to keep neutral/light-dark friendly
const COLORS = [
  "hsl(var(--muted-foreground))",
  "hsl(var(--primary))",
  "hsl(var(--secondary-foreground))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--foreground))",
]

const sampleData: UniversalChartFormat ={
  columns: [
    { id: "x", type: "dimension" },
    { id: "y", type: "measure" },
    { id: "series", type: "dimension", optional: true },
  ],
  rows: [
    { x: "Jan", y: 45, series: "2024" },
    { x: "Feb", y: 55, series: "2024" },
    { x: "Mar", y: 60, series: "2024" },
    { x: "Apr", y: 70, series: "2024" },
    { x: "May", y: 65, series: "2024" },
    { x: "Jun", y: 80, series: "2024" },
    { x: "Jan", y: 50, series: "2025" },
    { x: "Feb", y: 60, series: "2025" },
    { x: "Mar", y: 58, series: "2025" },
    { x: "Apr", y: 75, series: "2025" },
    { x: "May", y: 68, series: "2025" },
    { x: "Jun", y: 90, series: "2025" },
  ],
};

export function ChartPreview() {
  const total = data.reduce((a, b) => a + b.value, 0)
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [size, setSize] = useState({ width: 500, height: 300 });

  return (
    <div className="flex h-full w-full flex-col">
      {/* Legend pills */}
      {/* <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        {data.map((d, i) => (
          <span key={d.name} className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {d.name}
          </span>
        ))}
      </div> */}

      <div className="grid flex-1 grid-cols-1 place-items-center px-2 pb-4 md:px-6">
        <Card className="relative flex h-full w-full max-w-5xl items-center justify-center p-4">
          <div className="w-full max-w-3xl pb-16">
            <ResponsiveContainer width="100%" height={360}> 
              <div className="p-4 w-full h-[60vh]">
                <ResizableChart 
                  type={chartType} 
                  data={sampleData} 
                  onResize={(size) => setSize(size)}
                  width={size.width}
                  height={size.height}
                  annotations={[{ x: "Feb", label: "Spike", color: "green" }]} 
                />
              </div>
            </ResponsiveContainer>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <ChartControls
              chartType={chartType}
              size={size}
              onChartTypeChange={setChartType}
              onSizeChange={setSize}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

