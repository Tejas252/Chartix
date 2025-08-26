import ChartRenderer from "@/components/charts/chart-renderer";
import Image from "next/image";

 function transformChartData(universalData: any) {
  const { rows } = universalData;
  return rows.map((row: any) => ({
    name: row.x,   // for X axis
    value: row.y,  // for Y axis
    series: row.series,
  }));
}

export default function Sample() {

  const chartData = {
  columns: [
    { id: "category", type: "dimension" }, // X-axis or label field
    { id: "value", type: "measure" },      // Y-axis numeric value
    { id: "series", type: "dimension" },   // Optional series grouping
  ],
  rows: [
    { category: "Jan", value: 120, series: "Sales" },
    { category: "Feb", value: 200, series: "Sales" },
    { category: "Mar", value: 150, series: "Sales" },
    { category: "Apr", value: 80,  series: "Sales" },
    { category: "May", value: 70,  series: "Sales" },
    { category: "Jun", value: 110, series: "Sales" },

    { category: "Jan", value: 90,  series: "Revenue" },
    { category: "Feb", value: 160, series: "Revenue" },
    { category: "Mar", value: 120, series: "Revenue" },
    { category: "Apr", value: 60,  series: "Revenue" },
    { category: "May", value: 50,  series: "Revenue" },
    { category: "Jun", value: 100, series: "Revenue" },
  ],
};

 
// const data = transformChartData(chartData);


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"> */}
      <div className="w-full h-full">
<ChartRenderer chartType="column" chartData={chartData} />
<ChartRenderer chartType="line" chartData={chartData} />
<ChartRenderer chartType="pie" chartData={chartData} />
<ChartRenderer chartType="funnel" chartData={chartData} />
<ChartRenderer chartType="scatter" chartData={chartData} />
<ChartRenderer chartType="waterfall" chartData={chartData} />

      </div>
      {/* </main> */}
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
