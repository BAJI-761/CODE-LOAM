import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLAsideElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({ className, header, footer, children, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.20))] sticky top-16 md:top-20 bg-background shadow-inset-sm",
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-6 pb-4">
          {header}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
        {children}
      </div>

      {footer && (
        <div className="p-4 mt-auto">
          {footer}
        </div>
      )}
    </aside>
  )
}
