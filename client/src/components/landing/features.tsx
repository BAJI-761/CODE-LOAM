import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconWell } from "@/components/ui/icon-well"
import { Video, Code2, Bot, Award } from "lucide-react"

const features = [
  {
    title: "Video Learning",
    description: "High-quality, immersive video lessons with synchronized transcripts and resources.",
    icon: Video,
    color: "accent"
  },
  {
    title: "Code Practice",
    description: "Built-in code execution engine. Solve challenges without leaving your browser.",
    icon: Code2,
    color: "accent-secondary"
  },
  {
    title: "AI Assistant",
    description: "Get real-time hints, code reviews, and explanations from our intelligent AI tutor.",
    icon: Bot,
    color: "accent"
  },
  {
    title: "Certificates",
    description: "Earn verifiable certificates upon completion to showcase your new skills.",
    icon: Award,
    color: "accent-secondary"
  }
]

export function FeaturesSection() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Our platform provides a comprehensive suite of tools designed to accelerate your learning journey from beginner to expert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i} variant="extruded" className="h-full">
              <CardHeader>
                <IconWell 
                  icon={feature.icon} 
                  variant={feature.color as any} 
                  size="lg" 
                  className="mb-4"
                />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
