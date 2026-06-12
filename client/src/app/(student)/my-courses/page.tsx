"use client"

import React, { useState } from "react"
import { useMyEnrollments } from "@/hooks/useCourses"
import { EnrolledCourseCard } from "@/components/shared/enrolled-course-card"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useMyEnrollments()
  const [activeTab, setActiveTab] = useState("all")

  const filteredEnrollments = enrollments?.filter((e: any) => {
    if (activeTab === "active") return !e.isCompleted
    if (activeTab === "completed") return e.isCompleted
    return true
  }) || []

  return (
    <div className="bg-background min-h-screen">
      <PageHeader 
        title="My Courses" 
        description="Continue learning and track your progress across all enrolled courses."
        breadcrumbs={
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground">My Courses</span>
          </div>
        }
      />

      <Section className="py-8">
        <Container>
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0 outline-none">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-accent" />
                </div>
              ) : filteredEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEnrollments.map((enrollment: any) => (
                    <EnrolledCourseCard key={enrollment._id} enrollment={enrollment} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No courses yet"
                  description="You haven't enrolled in any courses yet. Explore our catalog to start learning."
                  action={
                    <Link href="/courses">
                      <Button variant="default">Browse Courses</Button>
                    </Link>
                  }
                  className="mt-8"
                />
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </Section>
    </div>
  )
}
