"use client"

import React from "react"
import Link from "next/link"
import { NeumorphicOrnament } from "@/components/ui/ornament"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative bg-background overflow-x-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Brand Side (Left) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-background">
        {/* Neumorphic background decoration */}
        <div className="absolute -top-10 -left-10 z-0">
          <NeumorphicOrnament shape="blob" variant="extruded" size="lg" className="opacity-40 animate-[float_4s_ease-in-out_infinite]" />
        </div>
        <div className="absolute bottom-20 -right-20 z-0">
          <NeumorphicOrnament shape="circle" variant="inset" size="xl" className="opacity-30" />
        </div>
        <div className="absolute top-1/3 right-10 z-0">
          <NeumorphicOrnament shape="pill" variant="deep" size="md" className="opacity-20 animate-pulse" />
        </div>

        {/* Header Logo */}
        <div className="z-10">
          <Link href="/" className="flex items-center gap-3 font-display font-bold text-3xl tracking-tight text-accent">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-accent text-white shadow-extruded-sm">
              <span className="text-2xl font-semibold">C</span>
            </div>
            <span className="text-foreground">CodeLoom</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="z-10 max-w-lg my-auto">
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
            Where code meets <br />
            <span className="text-accent">creativity and skill.</span>
          </h1>
          <p className="text-muted text-base lg:text-lg leading-relaxed mb-8">
            Join the Sqrock IT Solutions premier learning environment. Build, debug, compile, and run your code with custom real-time environments, AI-powered assistance, and verified certifications.
          </p>
          
          <div className="flex gap-4">
            <div className="flex flex-col p-4 rounded-2xl bg-background shadow-inset-sm w-36 text-center">
              <span className="text-2xl font-bold text-accent">10+</span>
              <span className="text-xs text-muted">Core Features</span>
            </div>
            <div className="flex flex-col p-4 rounded-2xl bg-background shadow-inset-sm w-36 text-center">
              <span className="text-2xl font-bold text-accent-secondary">Multi</span>
              <span className="text-xs text-muted">Lang Compiler</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-xs text-muted/70">
          &copy; {new Date().getFullYear()} CodeLoom LMS. Designed for Sqrock IT Solutions.
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-background relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
