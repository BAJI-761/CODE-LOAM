"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Play, FileText, Download, CheckCircle2, Circle, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuizzesByCourse } from "@/hooks/use-quizzes"

interface LearningSidebarProps {
  courseId: string
  modules: any[]
  progress: any
}

export function LearningSidebar({ courseId, modules, progress }: LearningSidebarProps) {
  const pathname = usePathname()
  const { data: quizzes } = useQuizzesByCourse(courseId)
  
  if (!modules || modules.length === 0) {
    return <div className="p-4 text-muted text-center">No modules found.</div>
  }

  // Find which module contains the active lesson to keep it open
  const activeModuleIndex = modules.findIndex(mod => 
    mod.lessons?.some((lesson: any) => pathname.includes(lesson._id))
  )
  
  const defaultValue = activeModuleIndex >= 0 ? [`item-${activeModuleIndex}`] : ["item-0"]

  const getLessonIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="h-4 w-4 text-accent-secondary" />
    }
    switch (type) {
      case "video": return <Play className="h-4 w-4 text-accent" />
      case "text": return <FileText className="h-4 w-4 text-accent" />
      case "resource": return <Download className="h-4 w-4 text-muted" />
      default: return <Circle className="h-4 w-4 text-muted" />
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-background/50 border-r border-muted/10 p-4 custom-scrollbar">
      <h2 className="font-display font-bold text-lg mb-4 text-foreground px-2">Course Content</h2>
      
      <Accordion type="multiple" defaultValue={defaultValue} className="w-full space-y-2">
        {modules.map((mod, i) => {
          const completedInModule = mod.lessons?.filter((l: any) => 
            progress?.completedLessons?.includes(l._id)
          ).length || 0
          
          return (
            <AccordionItem key={mod._id || `mod-${i}`} value={`item-${i}`} className="bg-background shadow-extruded-sm border-none mb-3">
              <AccordionTrigger className="px-4 py-3 hover:no-underline rounded-xl data-[state=open]:rounded-b-none">
                <div className="flex flex-col text-left w-full gap-1">
                  <span className="font-bold text-sm text-foreground">
                    Module {i + 1}: {mod.title}
                  </span>
                  <span className="text-xs text-muted font-normal">
                    {completedInModule} / {mod.lessons?.length || 0} completed
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-2 px-2">
                <div className="flex flex-col space-y-1">
                  {mod.lessons?.map((lesson: any, j: number) => {
                    const isActive = pathname.includes(lesson._id)
                    const isCompleted = progress?.completedLessons?.includes(lesson._id)
                    
                    return (
                      <Link 
                        key={lesson._id || `lesson-${j}`}
                        href={`/courses/${courseId}/learn/${lesson._id}`}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-accent/10 shadow-inset-sm" 
                            : "hover:bg-muted/5"
                        )}
                      >
                        <div className="mt-0.5 shrink-0">
                          {getLessonIcon(lesson.type, isCompleted)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-medium leading-tight",
                            isActive ? "text-accent" : "text-foreground/80"
                          )}>
                            {j + 1}. {lesson.title}
                          </span>
                          {lesson.duration && lesson.duration > 0 && (
                            <span className="text-xs text-muted">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                  
                  {/* Module Quizzes */}
                  {quizzes?.filter((q: any) => q.moduleIndex === i).map((quiz: any) => {
                    const isActive = pathname.includes(`/quizzes/${quiz._id}`);
                    // we could check progress for quiz completion, but for now just show icon
                    return (
                      <Link 
                        key={quiz._id}
                        href={`/quizzes/${quiz._id}`}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border border-transparent",
                          isActive 
                            ? "bg-primary/10 border-primary/20 shadow-inset-sm" 
                            : "hover:bg-muted/5 hover:border-muted/20"
                        )}
                      >
                        <div className="mt-0.5 shrink-0 bg-primary/10 p-1.5 rounded-md">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-bold leading-tight",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            Quiz: {quiz.title}
                          </span>
                          <span className="text-xs text-muted">
                            {quiz.questionCount} Questions • {quiz.timeLimit} min
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
