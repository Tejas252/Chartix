"use client";
import Plot from "react-plotly.js";

type ChartRendererProps = {
  chartType:
    | "bar"
    | "line"
    | "scatter"
    | "pie"
    | "heatmap"
    | "funnel"
    | "waterfall";
  data: any[];
  xKey?: string;
  yKey?: string;
  colorKey?: string;
  title?: string;
};

export default function ChartRenderer({
  chartType,
  data,
  xKey = "category",
  yKey = "value",
  colorKey,
  title = "Sample Chart",
}: ChartRendererProps) {
  // Base trace (data for plotly)
  let trace: any;

  switch (chartType) {
    case "bar":
      trace = {
        type: "bar",
        x: data.map((d) => d[xKey]),
        y: data.map((d) => d[yKey]),
        marker: {
          color: data.map(
            (d, i) =>
              (colorKey ? d[colorKey] : undefined) ??
              `hsl(${i * 50},70%,50%)`
          ),
          line: { width: 1, color: "#333" },
        },
      };
      break;

    case "line":
      trace = {
        type: "scatter",
        mode: "lines+markers",
        x: data.map((d) => d[xKey]),
        y: data.map((d) => d[yKey]),
        line: { shape: "spline", width: 3, color: "#4f46e5" },
        marker: { size: 8, color: "#4f46e5" },
      };
      break;

    case "scatter":
      trace = {
        type: "scatter",
        mode: "markers",
        x: data.map((d) => d[xKey]),
        y: data.map((d) => d[yKey]),
        marker: {
          size: 12,
          color: data.map((d, i) => i),
          colorscale: "Viridis",
          line: { width: 1, color: "#111" },
        },
      };
      break;

    case "pie":
      trace = {
        type: "pie",
        labels: data.map((d) => d[xKey]),
        values: data.map((d) => d[yKey]),
        textinfo: "label+percent",
        hole: 0.4, // makes it donut
      };
      break;

    case "heatmap":
      trace = {
        type: "heatmap",
        x: [...new Set(data.map((d) => d[xKey]))],
        y: [...new Set(data.map((d) => d[colorKey || "hour"]))],
        z: data.map((d) => d[yKey]),
        colorscale: "YlGnBu",
      };
      break;

    case "funnel":
      trace = {
        type: "funnel",
        y: data.map((d) => d[xKey]),
        x: data.map((d) => d[yKey]),
        textinfo: "value+percent initial",
        marker: { color: ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"] },
      };
      break;

    case "waterfall":
      trace = {
        type: "waterfall",
        x: data.map((d) => d[xKey]),
        y: data.map((d) => d[yKey]),
        connector: { line: { color: "rgba(63,63,63,0.7)" } },
      };
      break;
  }

  // Layout styling
  const layout = {
    title: {
      text: title,
      font: { size: 20, family: "Inter, sans-serif", color: "#111" },
    },
    margin: { l: 40, r: 20, t: 50, b: 40 },
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff",
    xaxis: {
      showgrid: false,
      zeroline: false,
      linecolor: "#aaa",
      tickfont: { family: "Inter", size: 12 },
    },
    yaxis: {
      gridcolor: "rgba(200,200,200,0.3)",
      zeroline: false,
      tickfont: { family: "Inter", size: 12 },
    },
    autosize: true,
    responsive: true,
  };

  // Config (interaction options)
  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
    modeBarButtonsToRemove: [
      "select2d",
      "lasso2d",
      "toggleSpikelines",
      "zoomIn2d",
      "zoomOut2d",
    ],
  };

  return (
    <div className="w-full h-[500px] rounded-2xl shadow-md border p-3 bg-white">
      <Plot
        data={[trace]}
        layout={layout}
        config={config}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </div>
  );
}
