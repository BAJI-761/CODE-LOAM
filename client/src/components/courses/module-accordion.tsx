"use client"

import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Play, FileText, Download, Clock, GraduationCap } from "lucide-react"
import { useQuizzesByCourse } from "@/hooks/use-quizzes"
import Link from "next/link"

export interface Lesson {
  _id: string
  title: string
  type: "video" | "text" | "resource"
  duration?: number
}

export interface Module {
  _id: string
  title: string
  lessons: Lesson[]
}

interface ModuleAccordionProps {
  courseId: string
  modules: Module[]
}

export function ModuleAccordion({ courseId, modules }: ModuleAccordionProps) {
  const { data: quizzes } = useQuizzesByCourse(courseId)

  if (!modules || modules.length === 0) {
    return <div className="text-muted p-4 text-center">No modules available for this course yet.</div>
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4 text-accent" />
      case "text": return <FileText className="h-4 w-4 text-accent-secondary" />
      case "resource": return <Download className="h-4 w-4 text-muted" />
      default: return <FileText className="h-4 w-4 text-muted" />
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0 min"
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
  }

  return (
    <Accordion type="multiple" className="w-full">
      {modules.map((mod, i) => {
        const moduleDuration = mod.lessons.reduce((acc, curr) => acc + (curr.duration || 0), 0)
        
        return (
          <AccordionItem key={mod._id || `mod-${i}`} value={`item-${i}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col sm:flex-row sm:items-center text-left w-full gap-2">
                <span className="font-bold text-foreground">
                  Module {i + 1}: {mod.title}
                </span>
                <div className="flex items-center gap-3 sm:ml-auto mr-4 text-xs font-normal text-muted">
                  <span>{mod.lessons.length} Lessons</span>
                  {moduleDuration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(moduleDuration)}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-1">
                {mod.lessons.map((lesson, j) => (
                  <div 
                    key={lesson._id || `lesson-${j}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-background shadow-inset-sm flex items-center justify-center shrink-0">
                        {getLessonIcon(lesson.type)}
                      </div>
                      <span className="text-foreground font-medium text-sm">
                        {j + 1}. {lesson.title}
                      </span>
                    </div>
                    {lesson.duration && lesson.duration > 0 && (
                      <span className="text-xs text-muted shrink-0 ml-4">
                        {formatDuration(lesson.duration)}
                      </span>
                    )}
                  </div>
                ))}
                
                {/* Module Quizzes */}
                {quizzes?.filter((q: any) => q.moduleIndex === i).map((quiz: any) => (
                  <Link 
                    key={quiz._id}
                    href={`/quizzes/${quiz._id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-background shadow-inset-sm flex items-center justify-center shrink-0">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground font-bold text-sm">
                        Quiz: {quiz.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted shrink-0 ml-4 font-medium">
                      {quiz.questionCount} Questions • {quiz.timeLimit} min
                    </span>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
