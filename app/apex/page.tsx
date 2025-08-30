"use client";

import { useState } from "react";
import ChartRenderer from "@/components/charts/chartRenderer";
import { UniversalChartFormat } from "@/types/chart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResizableChart from "@/components/charts/resizableChart";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ChartType = "bar" | "line" | "combo" | "pie" | "heatmap" | "funnel" | "scatter" | "candlestick";

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


export default function HomePage() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [size, setSize] = useState({ width: 600, height: 400 });


  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chart Demo</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["bar", "line", "combo", "pie", "heatmap", "funnel", "scatter", "candlestick"].map((type) => (
              <DropdownMenuItem 
                key={type}
                onClick={() => setChartType(type as ChartType)}
                className="cursor-pointer"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

       {/* Controls */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            value={size.width}
            className="w-28"
            onChange={(e) => setSize((prev) => ({ ...prev, width: Number(e.target.value) }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={size.height}
            className="w-28"
            onChange={(e) => setSize((prev) => ({ ...prev, height: Number(e.target.value) }))}
          />
        </div>
      </div>
      
      <div className="border rounded-lg p-4 w-full h-[500px]">
        <ResizableChart 
          type={chartType} 
          data={sampleData} 
          onResize={(size) => setSize(size)}
          width={size.width}
          height={size.height}
        //   annotations={[{ x: "Feb", label: "Spike", color: "green" }]} 
        />
      </div>
    </main>
  );
}
