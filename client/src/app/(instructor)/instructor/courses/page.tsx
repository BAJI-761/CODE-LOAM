"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, Clock, MoreVertical, Edit, Trash, ExternalLink } from "lucide-react"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: string;
  enrollmentCount: number;
  duration?: string;
  modules?: any[];
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/instructor/courses')
      if (res.success) {
        setCourses(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      toast.error("Failed to load your courses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    try {
      const res = await api.delete(`/instructor/courses/${id}`)
      if (res.success) {
        toast.success("Course deleted successfully")
        setCourses(courses.filter(c => c._id !== id))
      }
    } catch (error) {
      toast.error("Failed to delete course")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Courses
          </h1>
          <p className="text-muted mt-1">Manage your educational content and curriculums.</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button className="shadow-extruded-sm hover:shadow-extruded-hover transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-muted" />}
          title="No Courses Yet"
          description="You haven't created any courses. Start building your first course to share your knowledge."
          action={
            <Link href="/instructor/courses/new">
              <Button variant="default">Create Your First Course</Button>
            </Link>
          }
          className="mt-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} variant="surface" interactive className="flex flex-col h-full overflow-hidden">
              <div className="h-40 bg-muted/20 relative group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent-secondary/20">
                    <BookOpen className="h-12 w-12 text-muted/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium shadow-sm border ${
                    course.status === 'published' 
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-300 dark:border-green-800'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-300 dark:border-yellow-800'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <CardContent className="flex-1 p-5 pt-5">
                <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight">{course.title}</h3>
                <p className="text-muted text-sm line-clamp-2 mb-4">
                  {course.description || "No description provided."}
                </p>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.modules?.length || 0} Modules</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 border-t border-border/50 flex justify-between items-center bg-muted/5">
                <Link href={`/instructor/courses/${course._id}`} className="flex-1 mr-2">
                  <Button variant="inset" className="w-full h-9">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href={`/instructor/courses/${course._id}/analytics`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Analytics</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(course._id);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete Course</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
