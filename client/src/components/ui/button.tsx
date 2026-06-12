import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 will-change-transform active:translate-y-[0.5px]",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover active:shadow-inset-sm",
        accent:
          "bg-accent text-white shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover active:shadow-inset-sm",
        primary:
          "bg-accent text-white shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover active:shadow-inset-sm",
        secondary:
          "bg-background text-foreground shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover active:shadow-inset-sm",
        ghost: "hover:bg-background/50 hover:shadow-inset-sm text-foreground",
        danger:
          "bg-red-500 text-white shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover hover:bg-red-600 active:shadow-inset-sm",
        icon: "bg-background text-foreground shadow-extruded hover:-translate-y-1 hover:shadow-extruded-hover active:shadow-inset",
        inset: "bg-background text-foreground shadow-inset hover:bg-background/50 hover:shadow-inset-deep text-muted",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-12 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12", // 48px touch target
      },
      density: {
        comfortable: "",
        compact: "",
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        size: "sm",
        className: "h-9 w-9 px-0",
      },
      {
        variant: "icon",
        size: "lg",
        className: "h-14 w-14 px-0",
      },
      {
        density: "compact",
        size: "md",
        className: "h-10 px-4",
      },
      {
        density: "compact",
        size: "lg",
        className: "h-12 px-6",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "md",
      density: "comfortable",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, density, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, density, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
