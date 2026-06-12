"use client"

import * as React from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { StatusDot } from "@/components/ui/status-dot"
import { Users, Award } from "lucide-react"

export interface ChallengeCardProps {
  challenge: {
    _id: string
    title: string
    category: string
    difficulty: "easy" | "medium" | "hard"
    points: number
    solvedCount: number
    completionStatus?: "completed" | "pending"
  }
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isCompleted = challenge.completionStatus === "completed"

  return (
    <Link href={`/challenges/${challenge._id}`} className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[32px]">
      <Card 
        variant="extruded" 
        className="h-full transition-all duration-300 group-hover:shadow-extruded-hover group-hover:-translate-y-1 relative overflow-hidden"
      >
        <div className="absolute top-6 right-6">
          <StatusDot 
            color={isCompleted ? "success" : "neutral"} 
            size="md" 
            pulse={isCompleted ? false : true} 
          />
        </div>
        
        <div className="p-6 flex flex-col h-full gap-4">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <Badge variant="inset" className="uppercase tracking-wider text-[10px] font-semibold">
              {challenge.category}
            </Badge>
          </div>

          <h3 className="font-display font-bold text-xl text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {challenge.title}
          </h3>

          <div className="mt-auto flex items-center justify-between text-sm text-muted pt-4 border-t border-muted/10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" title="Solved Count">
                <Users className="w-4 h-4" />
                {challenge.solvedCount || 0}
              </span>
            </div>
            <span className="flex items-center gap-1.5 font-bold text-accent" title="Points">
              <Award className="w-4 h-4" />
              {challenge.points || 100} pts
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
