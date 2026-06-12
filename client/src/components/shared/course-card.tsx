import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star } from "lucide-react"

export interface Course {
  _id: string
  title: string
  description: string
  thumbnailUrl?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  instructor: {
    _id: string
    name: string
    avatar?: string
  }
  enrollmentCount: number
  rating: number
  totalLessons?: number
}

interface CourseCardProps {
  course: Course
  variant?: "default" | "enrolled"
  progress?: number
}

export function CourseCard({ course, variant = "default", progress }: CourseCardProps) {
  return (
    <Link href={variant === "enrolled" ? `/courses/${course._id}/learn` : `/courses/${course._id}`}>
      <Card variant="extruded" className="h-full flex flex-col group transition-all duration-300 hover:-translate-y-1">
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden shadow-inset-sm m-2 w-[calc(100%-16px)]">
          <Image
            src={course.thumbnailUrl || "https://picsum.photos/seed/codeloom/600/400"}
            alt={course.title}
            fill
            className="object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <DifficultyBadge difficulty={
            course.difficulty === 'beginner' ? 'easy' : 
            course.difficulty === 'advanced' ? 'hard' : 'medium'
          } />
          </div>
        </div>

        <CardHeader className="flex-1 pb-2">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">{course.category}</span>
            <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-amber-500" />
              {course.rating?.toFixed(1) || "New"}
            </div>
          </div>
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-accent transition-colors">
            {course.title}
          </h3>
        </CardHeader>

        <CardContent className="py-0">
          <p className="text-sm text-muted line-clamp-2 mb-4">{course.description}</p>
          
          {variant === "enrolled" && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted font-medium">Progress</span>
                <span className="text-foreground font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-background rounded-full shadow-inset overflow-hidden">
                <div 
                  className="h-full bg-accent-secondary rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 pb-4 border-t border-muted/10 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={course.instructor.avatar} />
              <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">{course.instructor.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.enrollmentCount}</span>
            </div>
            {course.totalLessons && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{course.totalLessons} L</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
