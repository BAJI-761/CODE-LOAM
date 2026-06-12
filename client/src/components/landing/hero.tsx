import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ornament } from "@/components/ui/ornament"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
      <Ornament variant="circle" size="lg" className="absolute -top-24 -right-24 text-accent/10 opacity-50 blur-3xl" />
      <Ornament variant="square" size="md" className="absolute top-40 -left-12 text-accent-secondary/10 opacity-50 blur-2xl" />
      
      <Container className="relative z-10 text-center">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
          Master the Future of <br className="hidden sm:block" />
          <span className="text-accent">AI-Powered</span> Coding
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted mb-10">
          CodeLoom is the expert-level platform to learn, practice, and build with real-time AI assistance, immersive courses, and hands-on challenges.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="primary" asChild className="text-lg px-8">
            <Link href="/register">Start Learning</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
