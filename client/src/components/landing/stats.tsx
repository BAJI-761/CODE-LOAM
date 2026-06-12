import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"

interface StatsProps {
  coursesCount: number
  challengesCount: number
  studentsCount: number
}

export function StatsSection({ coursesCount, challengesCount, studentsCount }: StatsProps) {
  return (
    <Section className="bg-background py-10 md:py-16 border-y border-muted/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-muted/10">
          <div className="flex flex-col pt-4 md:pt-0">
            <span className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
              {coursesCount}+
            </span>
            <span className="text-muted font-medium uppercase tracking-wider text-sm">Active Courses</span>
          </div>
          <div className="flex flex-col pt-8 md:pt-0">
            <span className="font-display text-4xl md:text-5xl font-bold text-accent-secondary mb-2">
              {challengesCount}+
            </span>
            <span className="text-muted font-medium uppercase tracking-wider text-sm">Coding Challenges</span>
          </div>
          <div className="flex flex-col pt-8 md:pt-0">
            <span className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
              {studentsCount}+
            </span>
            <span className="text-muted font-medium uppercase tracking-wider text-sm">Enrolled Students</span>
          </div>
        </div>
      </Container>
    </Section>
  )
}
