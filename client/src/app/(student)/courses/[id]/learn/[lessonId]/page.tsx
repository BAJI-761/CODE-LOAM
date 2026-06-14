"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { MarkdownRenderer } from "@/components/shared/markdown-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Loader2, PlayCircle, FileText, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUpdateProgress } from "@/hooks/useCourses"
import { toast } from "sonner"
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-muted/10"><Loader2 className="w-8 h-8 animate-spin text-muted" /></div>
})

export default function LessonPage({ params }: { params: any }) {
  const router = useRouter()
  const resolvedParams = React.use(params as any) as any
  const { id: courseId, lessonId } = resolvedParams
  
  const [isPlaying, setIsPlaying] = useState(false)

  // Fetch course and progress data
  const { data, isLoading } = useQuery({
    queryKey: ['courseLearn', courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/learn`)
      return res.data || null
    }
  })

  const { mutate: updateProgress, isPending: isUpdating } = useUpdateProgress()

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!data || !data.course) {
    return <div>Course not found</div>
  }

  const { course, enrollment: progress } = data
  
  // Find current lesson and adjacent lessons
  let currentLesson = null
  let nextLessonId = null
  let prevLessonId = null
  
  const allLessons = course.modules.flatMap((m: any) => m.lessons)
  const currentIndex = allLessons.findIndex((l: any) => l._id === lessonId)
  
  if (currentIndex !== -1) {
    currentLesson = allLessons[currentIndex]
    if (currentIndex > 0) prevLessonId = allLessons[currentIndex - 1]._id
    if (currentIndex < allLessons.length - 1) nextLessonId = allLessons[currentIndex + 1]._id
  }

  if (!currentLesson) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold">Lesson not found</h2>
        <Button onClick={() => router.push(`/courses/${courseId}/learn`)}>
          Back to Course
        </Button>
      </div>
    )
  }

  const isCompleted = progress?.completedLessons?.includes(currentLesson._id)

  const handleMarkComplete = () => {
    updateProgress(
      { courseId, lessonId: currentLesson._id, completed: true },
      {
        onSuccess: (res: any) => {
          if (res?.isNewlyCompleted) {
            toast.success("🎉 Course Completed! You earned a certificate!", {
              duration: 8000,
              action: {
                label: "View Certificate",
                onClick: () => router.push('/certificates')
              }
            })
          } else {
            toast.success("Lesson marked as complete!")
          }
          if (nextLessonId) {
            router.push(`/courses/${courseId}/learn/${nextLessonId}`)
          }
        },
        onError: () => {
          toast.error("Failed to update progress")
        }
      }
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-accent font-medium uppercase tracking-wider">
          {currentLesson.type === 'video' && <PlayCircle className="h-4 w-4" />}
          {currentLesson.type === 'text' && <FileText className="h-4 w-4" />}
          {currentLesson.type === 'resource' && <Download className="h-4 w-4" />}
          <span>{currentLesson.type} Lesson</span>
          {currentLesson.duration && (
            <>
              <span className="text-muted">•</span>
              <span className="text-muted">{currentLesson.duration} min</span>
            </>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
          {currentLesson.title}
        </h1>
      </div>

      {/* Lesson Content */}
      <Card variant="extruded" className="overflow-hidden">
        {currentLesson.type === "video" && currentLesson.videoUrl && (
          <div className="w-full aspect-video bg-black relative">
            <ReactPlayer 
              url={currentLesson.videoUrl}
              width="100%"
              height="100%"
              controls
              playing={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                if (!isCompleted) {
                  // Auto-mark complete optional
                }
              }}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>
        )}
        
        <CardContent className="p-6 sm:p-8">
          <MarkdownRenderer content={currentLesson.content || "No content provided for this lesson."} />
        </CardContent>
      </Card>

      {/* Navigation & Completion */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-muted/10">
        <Button 
          variant="ghost" 
          onClick={() => prevLessonId && router.push(`/courses/${courseId}/learn/${prevLessonId}`)}
          disabled={!prevLessonId}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Lesson
        </Button>

        <Button 
          variant={isCompleted ? "inset" : "accent"}
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
          onClick={handleMarkComplete}
          disabled={isUpdating || isCompleted}
        >
          {isUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2 text-accent-secondary" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-5 w-5 mr-2" />
              Mark as Complete
            </>
          )}
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => nextLessonId && router.push(`/courses/${courseId}/learn/${nextLessonId}`)}
          disabled={!nextLessonId}
          className="w-full sm:w-auto"
        >
          Next Lesson
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
