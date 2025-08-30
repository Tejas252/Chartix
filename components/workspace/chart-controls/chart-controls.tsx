import * as React from "react";
import { Palette, Edit3, Database } from "lucide-react";
import { ChartControlsProps } from "./types";
import { ChartToolButton } from "./chart-tool-button";
import { ChartSizeControl } from "./chart-size-control";
import { ChartTypeControl } from "./chart-type-control";

export function ChartControls({
  chartType,
  size,
  onChartTypeChange,
  onSizeChange,
}: ChartControlsProps) {
  return (
    <nav
      aria-label="Chart tools"
      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-2 py-1.5 shadow-md backdrop-blur"
    >
      <ChartSizeControl size={size} onSizeChange={onSizeChange} />
      <ChartTypeControl chartType={chartType} onChartTypeChange={onChartTypeChange} />
      <ChartToolButton icon={<Palette className="h-4 w-4" />} label="Color" />
      <ChartToolButton icon={<Edit3 className="h-4 w-4" />} label="Annotate" />
      <ChartToolButton icon={<Database className="h-4 w-4" />} label="Edit data" />
    </nav>
  );
}
