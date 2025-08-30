import * as React from "react";
import { PieChart as PieChartIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CHART_TYPES } from "./types";
import { ChartType } from "@/types/chart";

interface ChartTypeControlProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export function ChartTypeControl({ chartType, onChartTypeChange }: ChartTypeControlProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
          <PieChartIcon className="h-3.5 w-3.5" />
          <span>Chart Type</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {CHART_TYPES.map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onChartTypeChange(type)}
            className="cursor-pointer text-xs"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
