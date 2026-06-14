"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { LearningSidebar } from "@/components/courses/learning-sidebar"
import { LearningNavbar } from "@/components/courses/learning-navbar"
import { Loader2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  const resolvedParams = React.use(params as any) as any
  const courseId = resolvedParams.id
  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch course and progress data
  const { data, isLoading, error } = useQuery({
    queryKey: ['courseLearn', courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/learn`)
      return res.data || null
    }
  })

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-muted font-medium">Loading course environment...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="max-w-md p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-muted">You do not have access to this course or an error occurred.</p>
        </div>
      </div>
    )
  }

  const { course, enrollment: progress } = data
  const progressPercent = progress ? progress.completionPercentage : 0

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <LearningNavbar 
        courseTitle={course.title} 
        courseId={course._id} 
        progressPercent={progressPercent} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`absolute lg:relative w-80 h-full z-50 transition-transform duration-300 ease-in-out bg-background ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <LearningSidebar 
            courseId={course._id} 
            modules={course.modules} 
            progress={progress} 
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 left-4 z-30 lg:hidden shadow-extruded bg-background"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
