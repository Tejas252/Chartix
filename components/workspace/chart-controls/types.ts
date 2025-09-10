import { ChartType } from "@/types/chart";

export interface ChartSize {
  width: number;
  height: number;
}

export interface ChartSizeControlProps {
  size: ChartSize;
  onSizeChange: (size: ChartSize) => void;
  isMobile?: boolean;
}

export interface ChartControlsProps {
  chartType: ChartType;
  size: ChartSize;
  onChartTypeChange: (type: ChartType) => void;
  onSizeChange: (size: ChartSize) => void;
  isMobile?: boolean;
}

export interface ChartTypeControlProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  isMobile?: boolean;
}

export interface ChartToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  showLabel?: boolean;
  isMobile?: boolean;
}

export const CHART_TYPES: ChartType[] = [
  "bar",
  "line",
  "combo",
  "pie",
  "heatmap",
  "funnel",
  "scatter",
  "candlestick"
];
