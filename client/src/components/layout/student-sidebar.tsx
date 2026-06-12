"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Trophy, CheckSquare, LineChart, Award, Medal, User, LogOut } from "lucide-react"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

export function StudentSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/challenges", label: "Challenges", icon: Trophy },
    { href: "/quizzes", label: "Quizzes", icon: CheckSquare },
    { href: "/progress", label: "Progress", icon: LineChart },
    { href: "/certificates", label: "Certificates", icon: Award },
    { href: "/leaderboard", label: "Leaderboard", icon: Medal },
    { href: "/profile", label: "Profile", icon: User },
  ]

  const header = (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-lg shrink-0">
        {user?.name?.charAt(0) || "S"}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-foreground truncate">{user?.name || "Student"}</span>
        <span className="text-xs text-muted uppercase tracking-wider font-semibold">Student</span>
      </div>
    </div>
  )

  const footer = (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted hover:text-red-500" 
      onClick={() => logout()}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  )

  return (
    <Sidebar header={header} footer={footer}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive 
                ? "text-accent shadow-inset-deep bg-background" 
                : "text-muted hover:text-foreground hover:shadow-inset hover:bg-background"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted")} />
            {item.label}
          </Link>
        )
      })}
    </Sidebar>
  )
}
