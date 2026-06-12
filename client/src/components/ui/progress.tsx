"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "linear" | "ring"
  size?: number // for ring
  strokeWidth?: number // for ring
  indicatorClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, indicatorClassName, value, variant = "linear", size = 120, strokeWidth = 12, ...props }, ref) => {
  if (variant === "ring") {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - ((value || 0) / 100) * circumference

    return (
      <div 
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        {/* Inset background ring */}
        <div 
          className="absolute rounded-full shadow-inset-deep"
          style={{ 
            width: size, 
            height: size,
          }}
        />
        {/* SVG Progress Ring */}
        <svg
          className="absolute -rotate-90 transform"
          width={size}
          height={size}
        >
          {/* Track */}
          <circle
            className="text-transparent"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress */}
          <circle
            className="text-accent transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center font-display font-bold text-foreground">
          {value}%
        </div>
      </div>
    )
  }

  // Default Linear Progress
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-background shadow-inset-deep",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-accent transition-all duration-500 ease-out shadow-extruded-sm rounded-full", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
