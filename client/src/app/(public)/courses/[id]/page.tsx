import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { MarkdownRenderer } from "@/components/shared/markdown-renderer"
import { ModuleAccordion } from "@/components/courses/module-accordion"
import { EnrollmentButton } from "@/components/courses/enrollment-button"
import { Card, CardContent } from "@/components/ui/card"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

async function getCourse(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
    const res = await fetch(`${API_URL}/courses/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error("Failed to fetch course")
    }
    const data = await res.json()
    return data.data
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

export default async function CourseDetailPage({ params }: { params: any }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params
  const course = await getCourse(resolvedParams.id)
  
  if (!course) {
    notFound()
  }

  // Calculate total duration
  let totalDurationMins = 0
  course.modules?.forEach((m: any) => {
    m.lessons?.forEach((l: any) => {
      totalDurationMins += (l.duration || 0)
    })
  })
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-muted/10 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <Container className="py-4 flex items-center text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground font-medium truncate">{course.title}</span>
        </Container>
      </div>

      {/* Hero Section */}
      <Section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <DifficultyBadge difficulty={
                    course.difficulty === 'beginner' ? 'easy' : 
                    course.difficulty === 'advanced' ? 'hard' : 'medium'
                  } />
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg md:text-xl text-muted">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage src={course.instructor?.avatar} />
                      <AvatarFallback>{course.instructor?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{course.instructor?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-foreground">{course.rating?.toFixed(1) || "New"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount} enrolled</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full aspect-video relative rounded-3xl overflow-hidden shadow-inset p-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-extruded bg-muted/10">
                  <Image 
                    src={course.thumbnailUrl || "/assets/course-banner.png"} 
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-12 pt-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6">About this course</h2>
                  <MarkdownRenderer content={course.content || course.description} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6">Course Curriculum</h2>
                  <ModuleAccordion courseId={course._id} modules={course.modules || []} />
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card variant="extruded" className="p-1">
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="text-center pb-6 border-b border-muted/10">
                      <div className="text-4xl font-display font-bold text-foreground mb-2">
                        {course.price ? `$${course.price}` : "Free"}
                      </div>
                      <p className="text-sm text-muted">Full lifetime access</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted">
                          <BookOpen className="w-4 h-4" />
                          <span>Modules</span>
                        </div>
                        <span className="font-medium text-foreground">{course.modules?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium text-foreground">{formatDuration(totalDurationMins)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted">
                          <Star className="w-4 h-4" />
                          <span>Skill Level</span>
                        </div>
                        <span className="font-medium text-foreground capitalize">{course.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <EnrollmentButton 
                        courseId={course._id} 
                        price={course.price} 
                      />
                    </div>
                    <p className="text-xs text-center text-muted">
                      30-Day Money-Back Guarantee
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
