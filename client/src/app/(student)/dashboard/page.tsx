"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useMyEnrollments } from "@/hooks/useCourses"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnrolledCourseCard } from "@/components/shared/enrolled-course-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Loader2, BookOpen, CheckCircle, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: enrollments, isLoading } = useMyEnrollments()

  const completedCount = enrollments?.filter((e: any) => e.status === 'completed' || e.completionPercentage === 100).length || 0
  const activeCount = (enrollments?.length || 0) - completedCount

  let totalLearningHours = 0
  enrollments?.forEach((e: any) => {
    // Rough estimate based on progress
    if (e.course) {
      const courseTotalMins = (e.course.totalLessons || 10) * 15
      totalLearningHours += (courseTotalMins * ((e.completionPercentage || 0) / 100)) / 60
    }
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-muted/5 rounded-3xl p-8 border border-muted/10">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Welcome back, {user?.name?.split(' ')[0] || "Student"}! 👋
        </h1>
        <p className="text-muted">
          Ready to continue your learning journey? Pick up right where you left off.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="extruded" className="bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Active Courses</p>
              <h3 className="text-2xl font-bold text-foreground">{activeCount}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="extruded" className="bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary shrink-0">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Completed</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl font-bold text-foreground">{completedCount}</h3>
                {completedCount > 0 && (
                  <Link href="/certificates" className="text-xs text-accent font-medium hover:underline flex items-center">
                    View Certificates <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="extruded" className="bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Hours Learned</p>
              <h3 className="text-2xl font-bold text-foreground">{Math.round(totalLearningHours)} hrs</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-foreground">My Courses</h2>
          <Button variant="ghost" asChild>
            <Link href="/my-courses">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.slice(0, 3).map((enrollment: any) => (
              <EnrolledCourseCard key={enrollment._id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No courses yet"
            description="You haven't enrolled in any courses yet. Start your learning journey today!"
            action={
              <Button variant="primary" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
