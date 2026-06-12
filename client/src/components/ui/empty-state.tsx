import * as React from "react"
import { Card, CardTitle, CardDescription } from "./card"
import { IconWell } from "./icon-well"
import { FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ 
  icon = <FolderOpen className="h-8 w-8" />, 
  title, 
  description, 
  action,
  className
}: EmptyStateProps) {
  return (
    <Card variant="flat" className={cn("flex flex-col items-center justify-center text-center py-16 px-6 border-dashed border-2 border-muted/20 bg-transparent shadow-none", className)}>
      <IconWell size="lg" className="mb-6 bg-background shadow-extruded-sm text-muted">
        {icon}
      </IconWell>
      <CardTitle className="mb-2 text-xl font-display">{title}</CardTitle>
      {description && <CardDescription className="max-w-sm mb-6">{description}</CardDescription>}
      {action && <div>{action}</div>}
    </Card>
  )
}

export { EmptyState }
