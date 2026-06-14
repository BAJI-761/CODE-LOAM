"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Sparkles } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Container } from "./container"
import { MobileMenu, MobileMenuTrigger, MobileMenuContent } from "./mobile-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/challenges", label: "Challenges" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-inset-sm border-b-0 h-16 md:h-20">
      <Container className="h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-accent transition-colors">CodeLoom</span>
        </Link>

        {/* Center: Public nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted hover:text-foreground hover:bg-muted/10"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {mounted && (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0 relative">
                      {/* Fallback avatar */}
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold hover:bg-accent/30 transition-colors">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user?.name && <p className="font-medium">{user.name}</p>}
                        {user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                      onClick={() => {
                        logout();
                        window.location.href = '/login';
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button variant="primary" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu open={isOpen} onOpenChange={setIsOpen}>
              <MobileMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </MobileMenuTrigger>
              <MobileMenuContent>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px w-full bg-muted/20 my-2" />
                  {mounted && (
                    isAuthenticated ? (
                      <div className="flex flex-col gap-2">
                        <Button variant="primary" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
                          logout();
                          setIsOpen(false);
                          window.location.href = '/login';
                        }}>
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                          <Link href="/login">Log in</Link>
                        </Button>
                        <Button variant="primary" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                          <Link href="/register">Sign up</Link>
                        </Button>
                      </div>
                    )
                  )}
                </nav>
              </MobileMenuContent>
            </MobileMenu>
          </div>
        </div>
      </Container>
    </header>
  )
}
