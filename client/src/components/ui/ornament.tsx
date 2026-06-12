import * as React from "react"
import { cn } from "@/lib/utils"

interface NeumorphicOrnamentProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "circle" | "pill" | "square" | "blob"
  variant?: "extruded" | "inset" | "deep"
  size?: "sm" | "md" | "lg" | "xl"
}

const NeumorphicOrnament = React.forwardRef<HTMLDivElement, NeumorphicOrnamentProps>(
  ({ className, shape = "circle", variant = "extruded", size = "md", ...props }, ref) => {
    
    const shapes = {
      circle: "rounded-full",
      pill: "rounded-full w-auto aspect-video",
      square: "rounded-[24px]",
      blob: "rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%]", // Organic shape
    }
    
    const variants = {
      extruded: "bg-background shadow-extruded",
      inset: "bg-background shadow-inset",
      deep: "bg-background shadow-inset-deep",
    }
    
    const sizes = {
      sm: "h-16 w-16",
      md: "h-32 w-32",
      lg: "h-64 w-64",
      xl: "h-96 w-96",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none transition-all duration-700 ease-in-out",
          shapes[shape],
          variants[variant],
          sizes[size],
          className
        )}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
NeumorphicOrnament.displayName = "NeumorphicOrnament"

export { NeumorphicOrnament }
