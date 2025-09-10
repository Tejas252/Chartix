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

import { ChartTypeControlProps } from "./types";

export function ChartTypeControl({ chartType, onChartTypeChange, isMobile = false }: ChartTypeControlProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={isMobile ? "icon" : "sm"} 
          className={`${isMobile ? 'h-9 w-9' : 'h-8 px-2.5'} gap-1.5 text-xs`}
        >
          <PieChartIcon className={`${isMobile ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
          {!isMobile && <span>Chart Type</span>}
          {!isMobile && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
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
