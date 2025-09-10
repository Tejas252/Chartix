import * as React from "react";
import { ChartToolButtonProps } from "./types";

export const ChartToolButton = React.forwardRef<HTMLButtonElement, ChartToolButtonProps>(
  ({ icon, label, className = "", showLabel = true, isMobile, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex items-center justify-center gap-1.5 rounded-md ${
          isMobile ? 'h-9 w-9' : 'px-2.5 py-1.5'
        } text-xs font-medium transition-colors
          hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50 ${className}`}
        aria-label={label}
        title={label}
        {...props}
      >
        <span className="flex-shrink-0">{icon}</span>
        {showLabel && !isMobile && <span>{label}</span>}
      </button>
    );
  }
);

ChartToolButton.displayName = "ChartToolButton";
