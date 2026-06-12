import * as React from "react"
import { Card, CardTitle, CardDescription } from "./card"
import { IconWell } from "./icon-well"
import { Button } from "./button"
import { AlertTriangle } from "lucide-react"

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

function ErrorState({ 
  title = "Something went wrong", 
  message = "We couldn't load this content. Please try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <Card variant="extruded" className="flex flex-col items-center justify-center text-center py-12 px-6 max-w-md mx-auto">
      <IconWell size="lg" className="mb-6 text-red-500 shadow-inset-deep">
        <AlertTriangle className="h-8 w-8" />
      </IconWell>
      <CardTitle className="mb-2 text-xl font-display">{title}</CardTitle>
      <CardDescription className="mb-6">{message}</CardDescription>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Card>
  )
}

export { ErrorState }
