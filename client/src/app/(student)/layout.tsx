"use client"

import React from "react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { AIChatButton } from "@/components/ai/AIChatButton"
import { AIChatPanel } from "@/components/ai/AIChatPanel"
import { Navbar } from "@/components/layout/navbar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["student"]}>
        <Navbar />
        {children}
        <AIChatButton />
        <AIChatPanel />
      </RoleGuard>
    </ProtectedRoute>
  )
}
