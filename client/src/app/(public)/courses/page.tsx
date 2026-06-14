import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { PageHeader } from "@/components/layout/page-header"
import { CourseFilters } from "@/components/courses/course-filters"
import { CourseSearch } from "@/components/courses/course-search"
import { CourseCard, Course } from "@/components/shared/course-card"
import { EmptyState } from "@/components/ui/empty-state"

// Wait, do I have a pagination component?
// Let's create a simple local pagination or rely on a link if it doesn't exist
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getCourses(searchParams: any) {
  try {
    const params = new URLSearchParams()
    
    if (searchParams.search) params.set("search", searchParams.search as string)
    if (searchParams.difficulty) params.set("difficulty", searchParams.difficulty as string)
    if (searchParams.page) params.set("page", searchParams.page as string)
    
    // Handle multiple categories
    if (searchParams.category) {
      if (Array.isArray(searchParams.category)) {
        searchParams.category.forEach((c: string) => params.append("category", c))
      } else {
        params.set("category", searchParams.category as string)
      }
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
    const res = await fetch(`${API_URL}/courses?${params.toString()}`, { 
      cache: 'no-store' // We want fresh data for search/filters
    })
    
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch (error) {
    console.error("Error fetching courses:", error)
    return { data: { items: [], total: 0, page: 1, limit: 10 } }
  }
}

export default async function CoursesPage({ searchParams }: { searchParams: any }) {
  // Await searchParams for Next.js 15+ compatibility
  const resolvedSearchParams = await searchParams
  
  const response = await getCourses(resolvedSearchParams)
  const { items: courses, total, page, limit } = response.data
  const currentPage = Number(page) || 1
  
  const totalPages = Math.ceil(total / limit)

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams()
    Object.keys(resolvedSearchParams).forEach(key => {
      if (key === 'page') return
      const value = resolvedSearchParams[key]
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value) {
        params.set(key, value)
      }
    })
    params.set('page', newPage.toString())
    return `/courses?${params.toString()}`
  }

  return (
    <div className="bg-background min-h-screen">
      <Container className="pt-8 md:pt-12">
        <PageHeader 
          title="Course Catalog" 
          description="Browse our collection of expert-led AI and coding courses."
          breadcrumbs={
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">Courses</span>
            </div>
          }
        />
      </Container>
      
      <Section className="pb-8 md:pb-12 pt-0 md:pt-0">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 lg:w-72 shrink-0">
              <CourseFilters />
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CourseSearch />
                <div className="text-sm font-medium text-muted shrink-0">
                  Showing {courses.length} of {total} courses
                </div>
              </div>
              
              {courses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course: Course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="pt-8 flex justify-center gap-2">
                      {currentPage > 1 && (
                        <Button variant="secondary" asChild>
                          <Link href={createPageUrl(currentPage - 1)}>Previous</Link>
                        </Button>
                      )}
                      <span className="flex items-center px-4 font-medium text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      {currentPage < totalPages && (
                        <Button variant="secondary" asChild>
                          <Link href={createPageUrl(currentPage + 1)}>Next</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="No courses found"
                  description="We couldn't find any courses matching your filters."
                  action={
                    <Link href="/courses">
                      <Button variant="primary">Clear Filters</Button>
                    </Link>
                  }
                  className="mt-12"
                />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
