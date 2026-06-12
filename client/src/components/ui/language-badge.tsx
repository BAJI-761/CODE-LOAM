import * as React from "react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export interface LanguageBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  language: "javascript" | "python" | "cpp" | "java" | string;
  icon?: React.ReactNode;
}

function LanguageBadge({ language, icon, className, ...props }: LanguageBadgeProps) {
  // Use a grayscale background wash (muted/10) to keep colors restrained
  return (
    <Badge 
      variant="default" 
      className={cn(
        "gap-1.5 font-mono text-[10px] uppercase tracking-wider shadow-extruded-sm bg-muted/10 text-muted",
        className
      )}
      {...props}
    >
      {icon && <span className="opacity-80 grayscale">{icon}</span>}
      {language}
    </Badge>
  )
}

export { LanguageBadge }
