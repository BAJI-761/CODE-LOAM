import React from "react"
import { HeroSection } from "@/components/landing/hero"
import { StatsSection } from "@/components/landing/stats"
import { FeaturesSection } from "@/components/landing/features"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { PopularCoursesSection } from "@/components/landing/popular-courses"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { CtaSection } from "@/components/landing/cta"

// In Next.js App Router, this runs on the server
async function getLandingData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
    
    // Fetch courses with limit 4 for popular courses
    const coursesRes = await fetch(`${API_URL}/courses?limit=4`, { next: { revalidate: 60 } })
    const coursesData = await coursesRes.json()
    
    // Fetch challenges to get count
    const challengesRes = await fetch(`${API_URL}/challenges?limit=1`, { next: { revalidate: 60 } })
    const challengesData = await challengesRes.json()
    
    return {
      courses: coursesData.data?.items || [],
      coursesCount: coursesData.data?.total || 0,
      challengesCount: challengesData.data?.total || 0,
      // Mocking student count since we don't have a public endpoint for it
      studentsCount: 1500
    }
  } catch (error) {
    console.error("Failed to fetch landing data:", error)
    return {
      courses: [],
      coursesCount: 0,
      challengesCount: 0,
      studentsCount: 1500
    }
  }
}

export default async function LandingPage() {
  const data = await getLandingData()
  
  return (
    <>
      <HeroSection />
      <StatsSection 
        coursesCount={data.coursesCount} 
        challengesCount={data.challengesCount} 
        studentsCount={data.studentsCount} 
      />
      <FeaturesSection />
      <HowItWorksSection />
      <PopularCoursesSection courses={data.courses} />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
