"use client";

import dynamic from "next/dynamic";
import { transformToApex } from "@/lib/chart-transformer";
import { UniversalChartFormat, ChartType, ChartAnnotation } from "@/types/chart";
import { useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  type: ChartType;
  data: UniversalChartFormat;
  annotations?: ChartAnnotation[];
  height?: number;
};

export default function ChartRenderer({ type, data, annotations = [], height = 400 }: Props) {
  const { series, options,chartType } = useMemo(() => transformToApex({...data}, type, [...annotations]), [data, type, annotations]);
  console.log("🚀 ~ ChartRenderer ~ chartType:", chartType)
  console.log("🚀 ~ ChartRenderer ~ options:", options)
  console.log("🚀 ~ ChartRenderer ~ series:", series)

  return (
    <div className="w-full p-4">
       <ReactApexChart key={type} options={options} series={series} type={chartType ? chartType : type} height={height} />
    </div>
  );
}
