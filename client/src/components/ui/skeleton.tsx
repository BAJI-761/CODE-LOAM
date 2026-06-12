import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "bg-background motion-safe:animate-pulse-neumorphic shadow-inset",
  {
    variants: {
      variant: {
        text: "rounded-base h-4 w-full",
        card: "rounded-container h-48 w-full",
        avatar: "rounded-full h-12 w-12",
        button: "rounded-base h-10 w-24",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string;
  height?: string;
}

function Skeleton({ className, variant, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...style,
      }}
      {...props}
    />
  )
}

export { Skeleton }
