"use client"

import React from "react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trophy } from "lucide-react"

interface LearningNavbarProps {
  courseTitle: string
  courseId: string
  progressPercent: number
}

export function LearningNavbar({ courseTitle, courseId, progressPercent }: LearningNavbarProps) {
  return (
    <div className="h-16 bg-background border-b border-muted/10 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0 hidden sm:flex">
          <Link href={`/courses/${courseId}`}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to course</span>
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">{courseTitle}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-3">
          <Trophy className="h-4 w-4 text-accent-secondary" />
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-xs font-medium text-muted">
              <span>Your Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" indicatorClassName="bg-accent-secondary" />
          </div>
        </div>
        
        <Button variant="secondary" size="sm" asChild>
          <Link href="/dashboard">
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
