"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function LearnIndexPage({ params }: { params: any }) {
  const router = useRouter()
  const resolvedParams = React.use(params as any) as any
  const courseId = resolvedParams.id
  
  const { data, isLoading } = useQuery({
    queryKey: ['courseLearn', courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/learn`)
      return res.data || null
    }
  })

  useEffect(() => {
    if (data?.course) {
      // Find first lesson
      let firstLessonId = null
      for (const mod of data.course.modules) {
        if (mod.lessons && mod.lessons.length > 0) {
          firstLessonId = mod.lessons[0]._id
          break
        }
      }
      
      if (firstLessonId) {
        router.replace(`/courses/${courseId}/learn/${firstLessonId}`)
      }
    }
  }, [data, courseId, router])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (data?.course?.modules?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Welcome to {data.course.title}</h2>
        <p className="text-muted">No lessons have been published for this course yet.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
      <span className="ml-3 text-muted">Loading your lesson...</span>
    </div>
  )
}
