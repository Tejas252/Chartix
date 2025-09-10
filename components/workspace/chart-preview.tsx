"use client"

import * as React from "react"  
import { Card } from "@/components/ui/card"
import ResizableChart from "../charts/resizableChart"
import { UniversalChartFormat } from "@/types/chart"
import { ChartType } from "@/types/chart"
import { ChartControls } from "./chart-controls/chart-controls"
import { LoaderPinwheel } from "lucide-react"
import { ResponsiveContainer } from "recharts"
import { useScreenSize } from "@/hooks/use-screen-size"

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

const sampleData: UniversalChartFormat = {
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
    { x: "2019-01", y: 35, series: "Office Supplies" },
    { x: "2019-02", y: 120, series: "Furniture" },
    { x: "2019-02", y: 1200, series: "Technology" }
  ]
}

export function ChartPreview({ chartData, loading }: { chartData?: UniversalChartFormat, loading?: boolean }) {
  const [chartType, setChartType] = React.useState<ChartType>("bar");
  const [size, setSize] = React.useState({ width: 650, height: 420 });
  const { isMobile } = useScreenSize();

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <Card className="w-full max-w-5xl h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              {chartData ? (
                <div className="w-full h-full min-h-[400px] flex items-center justify-center">
                  <ResizableChart
                    type={chartType}
                    data={chartData}
                    onResize={setSize}
                    width={size.width}
                    height={size.height}
                    annotations={[{ x: "Feb", label: "Spike", color: "green" }]}
                  />
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoaderPinwheel className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <p>No chart data available</p>
              )}
            </div>
          </div>
          
          {/* Sticky controls container */}
          <div className={`sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t ${
            isMobile ? 'p-2' : 'p-2'
          }`}>
            <div className={`${isMobile ? 'w-full overflow-x-auto pb-2' : 'flex items-center justify-center'}`}>
              <div className={isMobile ? 'w-max mx-auto' : ''}>
                <ChartControls
                  chartType={chartType}
                  size={size}
                  onChartTypeChange={setChartType}
                  onSizeChange={setSize}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

