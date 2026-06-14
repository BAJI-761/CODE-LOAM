"use client"

import React from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { AIChatButton } from "@/components/ai/AIChatButton"
import { AIChatPanel } from "@/components/ai/AIChatPanel"
import { Navbar } from "@/components/layout/navbar"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["instructor"]}>
        <Navbar />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        <AIChatButton />
        <AIChatPanel />
      </RoleGuard>
    </ProtectedRoute>
  )
}
