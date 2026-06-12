import React from "react"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer",
    quote: "CodeLoom completely transformed how I learn. The AI assistant caught my mistakes before I even got frustrated.",
    avatar: "AJ"
  },
  {
    name: "Samantha Lee",
    role: "Data Scientist",
    quote: "The interactive coding challenges are the best I've ever used. Highly recommend for anyone serious about learning.",
    avatar: "SL"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    quote: "I used to jump between videos and my IDE. Having everything in one place with instant feedback is a game changer.",
    avatar: "MC"
  }
]

export function TestimonialsSection() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Students
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            See what our community has to say about their learning experience on CodeLoom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} variant="inset" className="h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar size="md">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted">{testimonial.role}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
