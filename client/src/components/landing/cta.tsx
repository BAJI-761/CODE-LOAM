import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Card, CardContent } from "@/components/ui/card"

export function CtaSection() {
  return (
    <Section className="bg-background pb-32">
      <Container>
        <Card className="bg-foreground text-background overflow-hidden relative border-none">
          {/* Subtle dark mode decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-secondary/20 rounded-full blur-3xl" />
          
          <CardContent className="p-12 md:p-20 text-center relative z-10 flex flex-col items-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white dark:text-foreground">
              Ready to start your coding journey?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-10">
              Join thousands of students who have already transformed their careers through our AI-powered interactive platform.
            </p>
            <Button size="lg" variant="primary" asChild className="text-lg px-10 py-6 h-auto">
              <Link href="/register">Create Your Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
