import * as React from "react";
import { Ruler } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChartToolButton } from "./chart-tool-button";
import { ChartSize } from "./types";

interface ChartSizeControlProps {
  size: ChartSize;
  onSizeChange: (size: ChartSize) => void;
}

export function ChartSizeControl({ size, onSizeChange }: ChartSizeControlProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <ChartToolButton icon={<Ruler className="h-4 w-4" />} label="Size" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Chart Size</h4>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min={100}
                max={2000}
                value={size.width}
                className="col-span-2 h-8"
                onChange={(e) =>
                  onSizeChange({
                    ...size,
                    width: Math.min(2000, Math.max(100, Number(e.target.value))),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min={100}
                max={2000}
                value={size.height}
                className="col-span-2 h-8"
                onChange={(e) =>
                  onSizeChange({
                    ...size,
                    height: Math.min(2000, Math.max(100, Number(e.target.value))),
                  })
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
