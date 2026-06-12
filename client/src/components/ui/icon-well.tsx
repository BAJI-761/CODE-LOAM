import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconWellVariants = cva(
  "inline-flex items-center justify-center rounded-2xl bg-background shadow-inset-deep text-accent transition-all duration-500",
  {
    variants: {
      size: {
        sm: "h-10 w-10 rounded-xl",
        md: "h-14 w-14 rounded-2xl",
        lg: "h-20 w-20 rounded-[20px]",
        xl: "h-28 w-28 rounded-[28px]",
      },
      interactive: {
        true: "hover:scale-105 cursor-pointer will-change-transform",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      interactive: false,
    },
  }
)

export interface IconWellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconWellVariants> {
  icon?: React.ReactNode;
}

const IconWell = React.forwardRef<HTMLDivElement, IconWellProps>(
  ({ className, size, interactive, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(iconWellVariants({ size, interactive, className }))}
        {...props}
      >
        {/* If we have children, we can render them directly, but typically an icon is passed.
            We add a nested extruded effect to the icon itself for the complex nested depth look. */}
        <div className={cn(
          "transition-transform duration-500",
          interactive && "group-hover:rotate-12"
        )}>
          {icon || children}
        </div>
      </div>
    )
  }
)
IconWell.displayName = "IconWell"

export { IconWell, iconWellVariants }
