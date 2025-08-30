"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RightMenubar from "@/components/right-menubar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

type ChartData = { label: string; value: number }

const defaultData: ChartData[] = [
  { label: "Q1", value: 420 },
  { label: "Q2", value: 560 },
  { label: "Q3", value: 610 },
  { label: "Q4", value: 480 },
]

export default function RightWorkspace() {
  const [data, setData] = useState<ChartData[]>(defaultData)
  const [title, setTitle] = useState("Revenue by Quarter")

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ prompt: string }>
      const p = ce.detail.prompt.toLowerCase()
      setTitle(ce.detail.prompt || "Chart")
      if (p.includes("month")) {
        setData([
          { label: "Jan", value: 120 },
          { label: "Feb", value: 140 },
          { label: "Mar", value: 180 },
          { label: "Apr", value: 160 },
          { label: "May", value: 190 },
          { label: "Jun", value: 220 },
        ])
      } else {
        setData(defaultData)
      }
    }
    window.addEventListener("v0:generate-chart", handler as any)
    return () => window.removeEventListener("v0:generate-chart", handler as any)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      {/* <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="xl:col-span-9"
      >
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-pretty text-base">{title}</CardTitle>
          </CardHeader>
          <CardContent className="h-[480px]">
            <ChartContainer
              config={{
                value: { label: "Value", color: "hsl(var(--chart-1))" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" name="Value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div> */}

      <motion.aside
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
        className="xl:col-span-3"
      >
        <RightMenubar />
      </motion.aside>
    </div>
  )
}
