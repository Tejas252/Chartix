// utils/chartOptionBuilder.ts
export type ChartType =
  | "column"
  | "bar"
  | "line"
  | "combo"
  | "pie"
  | "heatmap"
  | "table"
  | "funnel"
  | "scatter"
  | "waterfall";

interface ChartData {
  columns: { id: string; type: "dimension" | "measure" }[];
  rows: Record<string, any>[];
}

function buildWaterfallOption(rawData: number[], categories: string[]) {
  const help: (number | string)[] = [];
  const positive: (number | string)[] = [];
  const negative: (number | string)[] = [];

  for (let i = 0, sum = 0; i < rawData.length; i++) {
    const value = rawData[i];
    if (value >= 0) {
      positive.push(value);
      negative.push("-");
    } else {
      positive.push("-");
      negative.push(-value);
    }

    if (i === 0) {
      help.push(0);
    } else {
      sum += rawData[i - 1];
      if (value < 0) {
        help.push(sum + value);
      } else {
        help.push(sum);
      }
    }
  }

  return {
    title: { text: "Waterfall" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: categories, splitLine: { show: false } },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        stack: "total",
        itemStyle: {
          color: "rgba(0,0,0,0)",
          borderColor: "rgba(0,0,0,0)",
        },
        emphasis: {
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderColor: "rgba(0,0,0,0)",
          },
        },
        data: help,
      },
      {
        name: "Positive",
        type: "bar",
        stack: "total",
        itemStyle: { color: "#4caf50" },
        data: positive,
      },
      {
        name: "Negative",
        type: "bar",
        stack: "total",
        itemStyle: { color: "#f44336" },
        data: negative,
      },
    ],
  };
}

export function chartOptionBuilder(chartType: ChartType, chartData: ChartData) {
  const dimension = chartData.columns.find((c) => c.type === "dimension")?.id || "x";
  const measure = chartData.columns.find((c) => c.type === "measure")?.id || "y";
  const seriesField = chartData.columns.find((c) => c.id === "series")?.id;

  // categories for x-axis
  const categories = chartData.rows.map((row) => row[dimension]);

  // group by series
  const grouped: Record<string, number[]> = {};
  if (seriesField) {
    chartData.rows.forEach((row) => {
      const key = row[seriesField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row[measure]);
    });
  }

  // default config
  const base = {
    tooltip: { trigger: "axis" },
    legend: seriesField ? {} : undefined,
    grid: { containLabel: true },
  };

  switch (chartType) {
    case "column":
      return {
        ...base,
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value" },
        series: seriesField
          ? Object.keys(grouped).map((key) => ({
              name: key,
              type: "bar",
              data: grouped[key],
              emphasis: { focus: "series" },
            }))
          : [
              {
                type: "bar",
                data: chartData.rows.map((r) => r[measure]),
              },
            ],
      };

    case "bar":
      return {
        ...base,
        xAxis: { type: "value" },
        yAxis: { type: "category", data: categories },
        series: seriesField
          ? Object.keys(grouped).map((key) => ({
              name: key,
              type: "bar",
              data: grouped[key],
            }))
          : [
              {
                type: "bar",
                data: chartData.rows.map((r) => r[measure]),
              },
            ],
      };

    case "line":
      return {
        ...base,
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value" },
        series: seriesField
          ? Object.keys(grouped).map((key) => ({
              name: key,
              type: "line",
              smooth: true,
              data: grouped[key],
            }))
          : [
              {
                type: "line",
                smooth: true,
                data: chartData.rows.map((r) => r[measure]),
              },
            ],
      };

    case "combo":
      return {
        ...base,
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value" },
        series: [
          {
            name: "Bar",
            type: "bar",
            data: chartData.rows.map((r) => r[measure]),
          },
          {
            name: "Line",
            type: "line",
            data: chartData.rows.map((r) => r[measure]),
          },
        ],
      };

    case "pie":
      return {
        tooltip: { trigger: "item" },
        series: [
          {
            type: "pie",
            radius: "60%",
            data: chartData.rows.map((row) => ({
              name: row[dimension],
              value: row[measure],
            })),
          },
        ],
      };

    case "heatmap":
      return {
        tooltip: { position: "top" },
        xAxis: { type: "category", data: categories },
        yAxis: { type: "category", data: [...new Set(chartData.rows.map((r) => r[seriesField!]))] },
        visualMap: { min: 0, max: Math.max(...chartData.rows.map((r) => r[measure])), calculable: true },
        series: [
          {
            type: "heatmap",
            data: chartData.rows.map((r) => [r[dimension], r[seriesField!], r[measure]]),
          },
        ],
      };

    case "table":
      return {
        dataset: {
          source: [chartData.columns.map((c) => c.id), ...chartData.rows.map((r) => Object.values(r))],
        },
        series: [],
      };

    case "funnel":
      return {
        tooltip: { trigger: "item" },
        series: [
          {
            type: "funnel",
            data: chartData.rows.map((r) => ({ name: r[dimension], value: r[measure] })),
          },
        ],
      };

    case "scatter":
      return {
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: "scatter",
            data: chartData.rows.map((r) => [r[dimension], r[measure]]),
          },
        ],
      };

    case "waterfall":
      // needs cumulative calculation

      return buildWaterfallOption(chartData.rows.map((r) => r[measure]), categories);

    //   let sum = 0;
    //   const waterfallData = chartData.rows.map((r) => {
    //     sum += r[measure];
    //     return sum;
    //   });
    //   return {
    //     xAxis: { type: "category", data: categories },
    //     yAxis: { type: "value" },
    //     series: [
    //       {
    //         type: "bar",
    //         stack: "total",
    //         data: chartData.rows.map((r, i) => r[measure]),
    //       },
    //       {
    //         type: "bar",
    //         stack: "total",
    //         itemStyle: { borderColor: "transparent", color: "transparent" },
    //         data: [0, ...waterfallData.slice(0, -1)],
    //       },
    //     ],
    //   };

    default:
      return {};
  }
}
