import * as React from "react"
import { IconWell } from "./icon-well"
import { Skeleton } from "./skeleton"
import { Loader2 } from "lucide-react"

export interface LoadingStateProps {
  preset?: "card-grid" | "list" | "page" | "inline";
  title?: string;
  description?: string;
}

function LoadingState({ preset = "inline", title = "Loading...", description }: LoadingStateProps) {
  if (preset === "card-grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    )
  }

  if (preset === "list") {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-background shadow-inset-sm">
            <Skeleton variant="avatar" className="h-10 w-10" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (preset === "page") {
    return (
      <div className="flex flex-col gap-8 w-full animate-in fade-in-50">
        <div className="flex flex-col gap-4">
          <Skeleton variant="text" className="h-10 w-1/3" />
          <Skeleton variant="text" className="h-4 w-1/4" />
        </div>
        <Skeleton variant="card" className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    )
  }

  // Inline default
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
      <IconWell size="lg" className="mb-6 shadow-inset">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </IconWell>
      {title && <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-muted text-sm max-w-sm">{description}</p>}
    </div>
  )
}

export { LoadingState }
