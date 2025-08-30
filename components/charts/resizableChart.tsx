"use client";

import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import ChartRenderer from "./chartRenderer";
import { UniversalChartFormat, ChartAnnotation } from "@/types/chart";
import { Input } from "../ui/input";

type Props = {
  type: string;
  data: UniversalChartFormat;
  width: number;
  height: number;
  onResize: (size: { width: number; height: number }) => void;
  annotations?: ChartAnnotation[];
};

export default function ResizableChart({
  type,
  data,
  width,
  height,
  onResize,
  annotations,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Center initial position
  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.getBoundingClientRect();
      setPosition({
        x: (parent.width - width) / 2,
        y: (parent.height - height) / 2,
      });
    }
  }, [width, height]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Rnd
        size={{ width, height }}
        position={position}
        disableDragging
        onResize={(e, direction, ref) => {
          onResize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
        }}
        onResizeStop={() => {
          if (containerRef.current) {
            const parent = containerRef.current.getBoundingClientRect();
            setPosition({
              x: (parent.width - width) / 2,
              y: (parent.height - height) / 2,
            });
          }
        }}
        minWidth={300}
        minHeight={250}
        bounds="parent"
        className="border rounded-lg shadow bg-white flex items-center justify-center"
      >
        <div>
            <Input type="text" placeholder="Title" className="border-none" />
        </div>
        <ChartRenderer key={type} type={type as any} data={data} height={height - 60} annotations={annotations} />
      </Rnd>
    </div>
  );
}
