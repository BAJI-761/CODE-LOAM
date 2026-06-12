import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground shadow-extruded-sm",
        accent:
          "bg-accent text-white shadow-extruded-sm",
        success:
          "bg-accent-secondary text-white shadow-extruded-sm",
        warning:
          "bg-amber-500 text-white shadow-extruded-sm",
        danger:
          "bg-red-500 text-white shadow-extruded-sm",
        inset:
          "bg-background text-muted shadow-inset-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { DifficultyBadge } from "./difficulty-badge"
export { LanguageBadge } from "./language-badge"
export { StatusDot } from "./status-dot"

export { Badge, badgeVariants }
