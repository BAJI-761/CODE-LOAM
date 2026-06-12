import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { CourseCard, Course } from "@/components/shared/course-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PopularCoursesProps {
  courses: Course[]
}

export function PopularCoursesSection({ courses }: PopularCoursesProps) {
  return (
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trending Courses
            </h2>
            <p className="text-muted max-w-2xl text-lg">
              Explore our most popular AI-powered coding courses.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex gap-2">
            <Link href="/courses">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-background shadow-inset-sm rounded-2xl">
            <p className="text-muted">No courses available at the moment.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/courses">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
