export type UniversalChartFormat = {
  columns: [
    { id: "x"; type: "dimension" },
    { id: "y"; type: "measure" },
    { id: "series"; type: "dimension"; optional?: true }
  ];
  rows: { x: string | number | Date; y: number; series?: string }[];
};

export type ChartType =
  | "bar"
  | "line"
  | "combo"
  | "pie"
  | "heatmap"
  | "funnel"
  | "scatter"
  | "candlestick";

export type ChartAnnotation = {
  x?: number | string | Date;
  y?: number;
  label?: string;
  color?: string;
};
