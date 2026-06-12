"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Trophy, CheckSquare, Users, BarChart, User, LogOut, ChevronDown, ChevronRight } from "lucide-react"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

export function InstructorSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  // Track expanded state for submenus
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    courses: true,
    challenges: false,
    quizzes: false,
  })

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const header = (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary font-semibold text-lg shrink-0">
        {user?.name?.charAt(0) || "I"}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-foreground truncate">{user?.name || "Instructor"}</span>
        <span className="text-xs text-accent-secondary uppercase tracking-wider font-semibold">Instructor</span>
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

  const NavItem = ({ href, label, icon: Icon, isActive, isSubmenuItem = false }: any) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        isSubmenuItem ? "pl-9 py-2 text-xs" : "",
        isActive 
          ? "text-accent shadow-inset-deep bg-background" 
          : "text-muted hover:text-foreground hover:shadow-inset hover:bg-background"
      )}
    >
      {!isSubmenuItem && <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted")} />}
      {label}
    </Link>
  )

  const NavGroup = ({ id, label, icon: Icon, items }: any) => {
    const isAnyActive = items.some((item: any) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    const isExpanded = expanded[id] || isAnyActive

    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={() => toggleExpand(id)}
          className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left",
            isAnyActive && !isExpanded
              ? "text-accent shadow-inset-deep bg-background" 
              : "text-muted hover:text-foreground hover:shadow-inset hover:bg-background"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("h-4 w-4", isAnyActive && !isExpanded ? "text-accent" : "text-muted")} />
            {label}
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
        </button>
        
        {isExpanded && (
          <div className="flex flex-col gap-1 mt-1 animate-in slide-in-from-top-2 duration-200">
            {items.map((item: any) => (
              <NavItem 
                key={item.href} 
                href={item.href} 
                label={item.label} 
                isActive={pathname === item.href} 
                isSubmenuItem 
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Sidebar header={header} footer={footer}>
      <NavItem 
        href="/instructor" 
        label="Dashboard" 
        icon={LayoutDashboard} 
        isActive={pathname === "/instructor"} 
      />
      
      <NavGroup 
        id="courses" 
        label="My Courses" 
        icon={BookOpen} 
        items={[
          { href: "/instructor/courses", label: "Course List" },
          { href: "/instructor/courses/new", label: "Create Course" },
        ]} 
      />
      
      <NavGroup 
        id="challenges" 
        label="Challenges" 
        icon={Trophy} 
        items={[
          { href: "/instructor/challenges", label: "Challenge List" },
          { href: "/instructor/challenges/new", label: "Create Challenge" },
        ]} 
      />
      
      <NavGroup 
        id="quizzes" 
        label="Quizzes" 
        icon={CheckSquare} 
        items={[
          { href: "/instructor/quizzes", label: "Quiz List" },
          { href: "/instructor/quizzes/new", label: "Create Quiz" },
        ]} 
      />
      
      <NavItem 
        href="/instructor/students" 
        label="Students" 
        icon={Users} 
        isActive={pathname.startsWith("/instructor/students")} 
      />
      
      <NavItem 
        href="/instructor/analytics" 
        label="Analytics" 
        icon={BarChart} 
        isActive={pathname.startsWith("/instructor/analytics")} 
      />
      
      <NavItem 
        href="/instructor/profile" 
        label="Profile" 
        icon={User} 
        isActive={pathname.startsWith("/instructor/profile")} 
      />
    </Sidebar>
  )
}
