import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  description?: React.ReactNode; // To support description alias
}

export function PageHeader({ 
  title, 
  subtitle, 
  description,
  breadcrumbs, 
  actions, 
  className, 
  ...props 
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 mb-6 shadow-inset-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 min-w-0">
        {breadcrumbs && (
          <div className="text-sm text-muted mb-1">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground tracking-tight">
          {title}
        </h1>
        {(subtitle || description) && (
          <p className="text-base text-muted max-w-2xl">
            {subtitle || description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
