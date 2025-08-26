import PlotChartRenderer from "@/components/charts/plotly-chart-renderer";


const sampleData = [
  { category: "A", value: 30 },
  { category: "B", value: 55 },
  { category: "C", value: 43 },
];

export default function Page() {
  return (
    <div className="w-full h-[500px]">
      <PlotChartRenderer
        chartData={{
          type: "column", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "funnel", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "pie", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "waterfall", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "combo", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "heatmap", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
      <PlotChartRenderer
        chartData={{
          type: "scatter", // change to "pie", "scatter", etc.
          data: sampleData,
          xKey: "category",
          yKey: "value",
        }}
      />
    </div>
  );
}
