import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlayCircle, Award } from "lucide-react"

export interface EnrolledCourseCardProps {
  enrollment: any
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course, progressPercentage, isCompleted } = enrollment

  if (!course) return null

  return (
    <Card variant="extruded" className="group overflow-hidden flex flex-col h-full hover:shadow-extruded-md transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted/10">
        <Image 
          src={course.thumbnailUrl || "https://picsum.photos/seed/codeloom/600/400"} 
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-accent-secondary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Award className="h-3.5 w-3.5" />
            Completed
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 mb-1 group-hover:text-accent transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-muted">
            {course.instructor?.name || "CodeLoom Instructor"}
          </p>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted">Overall Progress</span>
              <span className={isCompleted ? "text-accent-secondary" : "text-foreground"}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2" 
              indicatorClassName={isCompleted ? "bg-accent-secondary" : "bg-accent"} 
            />
          </div>
          
          <Button 
            variant={isCompleted ? "inset" : "accent"} 
            className="w-full relative overflow-hidden"
            asChild
          >
            <Link href={`/courses/${course._id}/learn`}>
              <PlayCircle className="h-4 w-4 mr-2" />
              {isCompleted ? "Review Course" : progressPercentage > 0 ? "Continue Learning" : "Start Course"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
