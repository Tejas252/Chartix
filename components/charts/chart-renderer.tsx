"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { chartOptionBuilder, ChartType } from "@/lib/chartOptionBuilder";
// import { chartOptionBuilder, ChartType } from "@/utils/chartOptionBuilder";

interface ChartRendererProps {
  chartType: ChartType;
  chartData: {
    columns: { id: string; type: "dimension" | "measure" }[];
    rows: Record<string, any>[];
  };
}

export default function ChartRenderer({ chartType, chartData }: ChartRendererProps) {
  const option = chartOptionBuilder(chartType, chartData);

  return (
    <div className="w-full h-[500px]">
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
