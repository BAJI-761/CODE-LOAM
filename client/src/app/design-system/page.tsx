"use client"

import * as React from "react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Navbar } from "@/components/layout/navbar"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge, DifficultyBadge, LanguageBadge, StatusDot } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { IconWell } from "@/components/ui/icon-well"
import { Skeleton, LoadingState, EmptyState, ErrorState } from "@/components/ui/states"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FolderOpen, ArrowRight, BookOpen, Code, Trophy, LayoutDashboard } from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container size="md" className="py-12">
        <PageHeader 
          title="Design System Showcase" 
          subtitle="A complete reference for CodeLoom's neumorphic UI components, typography, and tokens." 
        />
        
        {/* 2. Foundations */}
        <Section spacing="sm">
          <h2 className="text-2xl font-bold font-display mb-6">Foundations</h2>
          
          <div className="space-y-12">
            {/* Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="h-16 rounded-2xl bg-background shadow-inset" />
                  <span className="text-sm font-medium">Background</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 rounded-2xl bg-foreground" />
                  <span className="text-sm font-medium">Foreground</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 rounded-2xl bg-accent" />
                  <span className="text-sm font-medium">Accent</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 rounded-2xl bg-accent-secondary" />
                  <span className="text-sm font-medium">Accent Secondary</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Typography</h3>
              <div className="space-y-4 shadow-inset p-6 rounded-3xl bg-background">
                <h1 className="text-5xl font-bold font-display">Display H1 (Plus Jakarta Sans)</h1>
                <h2 className="text-4xl font-bold font-display">Heading H2</h2>
                <h3 className="text-3xl font-bold font-display">Heading H3</h3>
                <h4 className="text-2xl font-semibold">Heading H4 (DM Sans)</h4>
                <p className="text-base text-muted">Body Text - The quick brown fox jumps over the lazy dog. (DM Sans)</p>
                <p className="font-mono text-sm">Monospace - console.log("Hello World") (JetBrains Mono)</p>
              </div>
            </div>

            {/* Shadows */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Shadow Tokens</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="h-32 rounded-3xl bg-background shadow-extruded flex items-center justify-center font-medium">Extruded</div>
                <div className="h-32 rounded-3xl bg-background shadow-extruded-hover flex items-center justify-center font-medium">Extruded Hover</div>
                <div className="h-32 rounded-3xl bg-background shadow-extruded-sm flex items-center justify-center font-medium">Extruded Sm</div>
                <div className="h-32 rounded-3xl bg-background shadow-inset flex items-center justify-center font-medium">Inset</div>
                <div className="h-32 rounded-3xl bg-background shadow-inset-deep flex items-center justify-center font-medium">Inset Deep</div>
                <div className="h-32 rounded-3xl bg-background shadow-inset-sm flex items-center justify-center font-medium">Inset Sm</div>
              </div>
            </div>
          </div>
        </Section>

        {/* 3. Atoms */}
        <Section spacing="sm">
          <h2 className="text-2xl font-bold font-display mb-6">Atoms (UI Primitives)</h2>
          
          <div className="space-y-12">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="icon"><ArrowRight className="h-5 w-5" /></Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Inputs & Forms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Input</label>
                  <Input placeholder="Enter something..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disabled Input</label>
                  <Input disabled placeholder="Disabled..." />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm font-medium">Accept Terms</label>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Badges & Status</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge variant="default">Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="inset">Inset</Badge>
                
                <DifficultyBadge difficulty="easy" />
                <DifficultyBadge difficulty="medium" />
                <DifficultyBadge difficulty="hard" />

                <LanguageBadge language="javascript" icon={<Code className="h-3 w-3" />} />
                <LanguageBadge language="python" icon={<Code className="h-3 w-3" />} />
              </div>
              <div className="flex flex-wrap gap-4 mt-6 items-center">
                <StatusDot color="success" size="lg" />
                <StatusDot color="warning" size="lg" />
                <StatusDot color="error" size="lg" />
                <StatusDot color="info" size="lg" pulse />
              </div>
            </div>

            {/* Avatars */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Avatars & Progress</h3>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-16 w-16 shadow-extruded">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12 shadow-inset">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-4 max-w-md">
                <Progress value={33} />
                <Progress value={66} />
                <Progress value={100} />
              </div>
            </div>

            {/* Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Skeletons</h3>
              <div className="space-y-4 max-w-md">
                <Skeleton variant="avatar" />
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="button" />
              </div>
            </div>
          </div>
        </Section>

        {/* 4. Molecules & Organisms */}
        <Section spacing="sm">
          <h2 className="text-2xl font-bold font-display mb-6">Molecules & Organisms</h2>
          
          <div className="space-y-12">
            {/* Accordion */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Accordion</h3>
              <Accordion type="single" collapsible className="max-w-lg">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is CodeLoom?</AccordionTrigger>
                  <AccordionContent>CodeLoom is a next-generation AI-powered coding platform.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I start?</AccordionTrigger>
                  <AccordionContent>Just sign up and browse our course catalog to begin learning.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Dialog */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted">Dialog</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogDescription>Are you sure you want to proceed? This action cannot be undone.</DialogDescription>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary">Confirm</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Section>

        {/* 5. States */}
        <Section spacing="sm">
          <h2 className="text-2xl font-bold font-display mb-6">States</h2>
          <div className="space-y-8">
            <EmptyState title="No courses found" description="You haven't enrolled in any courses yet." action={<Button variant="primary">Browse Catalog</Button>} />
            <ErrorState />
            <LoadingState preset="card-grid" />
          </div>
        </Section>

        {/* 6. Combinations */}
        <Section spacing="sm">
          <h2 className="text-2xl font-bold font-display mb-6">Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="extruded">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <IconWell size="lg"><BookOpen className="text-accent" /></IconWell>
                  <DifficultyBadge difficulty="medium" />
                </div>
                <CardTitle>Advanced React Patterns</CardTitle>
                <CardDescription>Master modern React architecture.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={45} className="mb-2" />
                <p className="text-xs text-muted text-right">45% Complete</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full">Continue Learning</Button>
              </CardFooter>
            </Card>

            <Card variant="inset" className="p-6 flex flex-col items-center justify-center text-center gap-4">
              <IconWell size="lg" className="shadow-inset-deep bg-background"><Trophy className="text-accent-secondary" /></IconWell>
              <h3 className="text-xl font-bold font-display">Daily Challenge</h3>
              <p className="text-muted text-sm">Solve today's algorithm to earn 50 XP.</p>
              <Button variant="secondary">Start Challenge</Button>
            </Card>
          </div>
        </Section>

      </Container>
    </div>
  )
}
