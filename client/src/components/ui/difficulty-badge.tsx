import * as React from "react"
import { Badge } from "./badge"
import { StatusDot } from "./status-dot"
import { cn } from "@/lib/utils"

export interface DifficultyBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  difficulty: "easy" | "medium" | "hard";
}

function DifficultyBadge({ difficulty, className, ...props }: DifficultyBadgeProps) {
  const config = {
    easy: { color: "text-accent-secondary", dot: "success", bgClass: "bg-accent-secondary/10" },
    medium: { color: "text-amber-500", dot: "warning", bgClass: "bg-amber-500/10" },
    hard: { color: "text-red-500", dot: "error", bgClass: "bg-red-500/10" },
  } as const;

  const current = config[difficulty];

  return (
    <Badge 
      variant="default" 
      className={cn(
        "gap-1.5 uppercase tracking-wider text-[10px] font-semibold shadow-extruded-sm",
        current.color,
        current.bgClass,
        className
      )}
      {...props}
    >
      <StatusDot color={current.dot} size="sm" />
      {difficulty}
    </Badge>
  )
}

export { DifficultyBadge }
