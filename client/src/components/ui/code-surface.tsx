import * as React from "react"
import { cn } from "@/lib/utils"

interface CodeSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
}

const CodeSurface = React.forwardRef<HTMLDivElement, CodeSurfaceProps>(
  ({ className, children, header, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col overflow-hidden rounded-[24px] bg-background shadow-inset-deep font-mono",
          className
        )}
        {...props}
      >
        {header && (
          <div className="flex items-center justify-between border-b border-muted/10 bg-background/50 px-4 py-2 shadow-extruded-sm">
            {header}
          </div>
        )}
        <div className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-foreground">
          {children}
        </div>
      </div>
    )
  }
)
CodeSurface.displayName = "CodeSurface"

export { CodeSurface }
