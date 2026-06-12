"use client"

import React from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { AIChatButton } from "@/components/ai/AIChatButton"
import { AIChatPanel } from "@/components/ai/AIChatPanel"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["instructor"]}>
        {children}
        <AIChatButton />
        <AIChatPanel />
      </RoleGuard>
    </ProtectedRoute>
  )
}
