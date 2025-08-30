import { ChartType } from "@/types/chart";

export interface ChartSize {
  width: number;
  height: number;
}

export interface ChartControlsProps {
  chartType: ChartType;
  size: ChartSize;
  onChartTypeChange: (type: ChartType) => void;
  onSizeChange: (size: ChartSize) => void;
}

export interface ChartToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  showLabel?: boolean;
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
