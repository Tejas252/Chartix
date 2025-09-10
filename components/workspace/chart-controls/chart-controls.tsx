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
  isMobile = false,
}: ChartControlsProps & { isMobile?: boolean }) {
  return (
    <nav
      aria-label="Chart tools"
      className={`pointer-events-auto inline-flex items-center gap-1.5 ${
        isMobile 
          ? 'rounded-lg border-0 bg-background/90 shadow-lg' 
          : 'rounded-full border bg-background/80 shadow-md'
      } px-2 py-1.5 backdrop-blur`}
    >
      <ChartSizeControl size={size} onSizeChange={onSizeChange} isMobile={isMobile} />
      <ChartTypeControl chartType={chartType} onChartTypeChange={onChartTypeChange} isMobile={isMobile} />
      <ChartToolButton 
        icon={<Palette className="h-4 w-4" />} 
        label="Color" 
        isMobile={isMobile}
      />
      <ChartToolButton 
        icon={<Edit3 className="h-4 w-4" />} 
        label="Annotate" 
        isMobile={isMobile}
      />
      <ChartToolButton 
        icon={<Database className="h-4 w-4" />} 
        label="Edit data" 
        isMobile={isMobile}
      />
    </nav>
  );
}
