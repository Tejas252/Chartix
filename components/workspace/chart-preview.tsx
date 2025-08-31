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
  "columns": [
      {
          "id": "Customer & Sales Person",
          "type": "dimension",
          "datatype": "string"
      },
      {
          "id": "Net Sales Total",
          "type": "measure",
          "datatype": "number"
      }
  ],
  "rows": [
    { x: "2019-01", y: 410, series: "Furniture" },
    { x: "2019-01", y: 900, series: "Technology" },
    { x: "2019-01", y: 35,  series: "Office Supplies" },
    { x: "2019-02", y: 120, series: "Furniture" },
    { x: "2019-02", y: 1200, series: "Technology" }
  ]
}

export function ChartPreview({chartData,loading}: {chartData?: UniversalChartFormat, loading?: boolean}) {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [size, setSize] = useState({ width: 650, height: 420 });

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
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
            <ChartControls
              chartType={chartType}
              size={size}
              onChartTypeChange={setChartType}
              onSizeChange={setSize}
            />
          </div>
          <div className="w-full max-w-3xl pb-16">
            <ResponsiveContainer width="100%" height={500}> 
              <div className="p-4 w-full h-[60vh]">
                {chartData ?
                <ResizableChart 
                  type={chartType} 
                  data={chartData} 
                  onResize={(size) => setSize(size)}
                  width={size.width}
                  height={size.height}
                  annotations={[{ x: "Feb", label: "Spike", color: "green" }]} 
                /> : loading ? <p>Loading chart data...</p> :   <p>No chart data available</p>}
              </div>
            </ResponsiveContainer>
          </div>

          
        </Card>
      </div>
    </div>
  )
}

