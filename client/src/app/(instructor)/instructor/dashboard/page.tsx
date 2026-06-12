"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Users, FilePlus, Award, BookOpen, ExternalLink } from "lucide-react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  avgCompletion: number;
  totalContent: number;
}

interface Course {
  _id: string;
  title: string;
  status: string;
  enrollmentCount: number;
}

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          api.get('/instructor/dashboard/stats'),
          api.get('/instructor/courses')
        ])
        
        if (statsRes.success) setStats(statsRes.data)
        if (coursesRes.success) {
          // Calculate mock enrollment counts for the table if not present, and limit to recent
          const fetchedCourses = coursesRes.data.slice(0, 5)
          setCourses(fetchedCourses)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, {user?.name || "Instructor"}
          </h1>
          <p className="text-muted mt-1">Here's what's happening with your courses today.</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="shadow-extruded-sm hover:shadow-extruded-hover transition-all">
            <FilePlus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* 4-Card Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Courses Created"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Students Enrolled"
          value={stats?.totalStudents || 0}
          icon={Users}
        />
        <StatsCard
          title="Average Completion"
          value={`${stats?.avgCompletion || 0}%`}
          icon={Award}
        />
        <StatsCard
          title="Quizzes & Challenges"
          value={stats?.totalContent || 0}
          icon={FilePlus}
        />
      </div>

      {/* Course Performance Table */}
      <Card variant="extruded" className="w-full">
        <CardHeader className="border-b border-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Courses Performance</CardTitle>
            <Link href="/instructor/courses">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted uppercase bg-muted/5 border-b border-muted/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Course Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted">
                      No courses found. Create your first course to see performance data.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{course.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          course.status === 'published' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/instructor/courses/${course._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
