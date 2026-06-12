import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create an account in seconds and unlock access to our extensive catalog of AI-powered coding courses."
  },
  {
    number: "2",
    title: "Learn & Practice",
    description: "Watch interactive videos, read expert material, and immediately practice your skills in our browser-based IDE."
  },
  {
    number: "3",
    title: "Achieve mastery",
    description: "Earn certificates, track your progress on the leaderboard, and build a portfolio of real-world coding projects."
  }
]

export function HowItWorksSection() {
  return (
    <Section className="bg-background relative">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Your journey to becoming an expert developer is simple and straightforward.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-muted/20 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background shadow-extruded flex items-center justify-center mb-6 text-2xl font-bold font-display text-accent">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted px-4">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
