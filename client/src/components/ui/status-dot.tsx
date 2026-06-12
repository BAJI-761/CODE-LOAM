import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusDotVariants = cva(
  "inline-block rounded-full shadow-inset-sm shrink-0",
  {
    variants: {
      color: {
        success: "bg-accent-secondary", // teal
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-accent", // violet
        neutral: "bg-muted", // cool grey
      },
      size: {
        sm: "h-1.5 w-1.5",
        md: "h-2 w-2",
        lg: "h-3 w-3",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      }
    },
    defaultVariants: {
      color: "neutral",
      size: "md",
      pulse: false,
    },
  }
)

export interface StatusDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof statusDotVariants> {}

function StatusDot({ className, color, size, pulse, ...props }: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ color, size, pulse }), className)}
      {...props}
    />
  )
}

export { StatusDot, statusDotVariants }
