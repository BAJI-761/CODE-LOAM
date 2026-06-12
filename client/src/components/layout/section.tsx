import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "py-0",
        sm: "py-12",
        md: "py-20",
        lg: "py-32",
        xl: "py-40",
      },
    },
    defaultVariants: {
      spacing: "md", // Default: py-20 md:py-32 in base classes, but handled by cva here
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
}

function Section({ className, spacing, as: Component = "section", ...props }: SectionProps) {
  return (
    <Component
      className={cn(
        sectionVariants({ spacing }), 
        spacing === "md" && "md:py-32", // Maintain default md scaling
        className
      )}
      {...props}
    />
  )
}

export { Section, sectionVariants }
