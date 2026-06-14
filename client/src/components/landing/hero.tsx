import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { NeumorphicOrnament as Ornament } from "@/components/ui/ornament"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 mix-blend-overlay"></div>
      <Ornament variant="circle" size="lg" className="absolute -top-24 -right-24 text-accent/10 opacity-50 blur-3xl" />
      <Ornament variant="square" size="md" className="absolute top-40 -left-12 text-accent-secondary/10 opacity-50 blur-2xl" />
      <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-accent/5 to-transparent rounded-full blur-3xl opacity-50"></div>
      
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide border border-accent/20 mb-4 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              CodeLoom 2.0 is Live
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Master the Future of <br className="hidden sm:block" />
              <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-secondary">AI-Powered</span> Coding
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              CodeLoom is the expert-level platform to learn, practice, and build with real-time AI assistance, immersive courses, and hands-on challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Button size="lg" variant="primary" asChild className="text-lg px-8 shadow-glow transition-transform hover:scale-105">
                <Link href="/register">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 transition-transform hover:scale-105 bg-background/50 backdrop-blur-md border border-border/50">
                <Link href="/courses">Browse Catalog</Link>
              </Button>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="relative aspect-square w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-accent-secondary/20 rounded-full blur-3xl opacity-50 animate-blob"></div>
              <Image 
                src="/assets/hero-character.png" 
                alt="AI Coder Character" 
                fill
                priority
                className="object-contain relative z-10 drop-shadow-2xl animate-float"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

