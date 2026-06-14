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
        "relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 md:p-10 mb-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-muted/20 shadow-glass",
        className
      )}
      {...props}
    >
      {/* Decorative background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-secondary/5 -z-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col gap-3 min-w-0 z-10">
        {breadcrumbs && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 text-xs font-medium text-muted-foreground mb-2 border border-muted/20 w-fit backdrop-blur-md shadow-inset-sm">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70 pb-1">
          {title}
        </h1>
        {(subtitle || description) && (
          <p className="text-base md:text-lg text-muted max-w-2xl mt-1">
            {subtitle || description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0 z-10 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  )
}
