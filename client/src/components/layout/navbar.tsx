"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Container } from "./container"
import { MobileMenu, MobileMenuTrigger, MobileMenuContent } from "./mobile-menu"
// import { ThemeToggle } from "@/components/ui/theme-toggle" // To be implemented or used later

export function Navbar() {
  const { isAuthenticated, user } = useAuthStore()
  const [isOpen, setIsOpen] = React.useState(false)

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/challenges", label: "Challenges" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-inset-sm border-b-0 h-16 md:h-20">
      <Container className="h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-foreground">CodeLoom</span>
        </Link>

        {/* Center: Public nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {/* <ThemeToggle /> */}
            {isAuthenticated ? (
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0" asChild>
                <Link href="/dashboard">
                  {/* Fallback avatar */}
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
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
                  {isAuthenticated ? (
                    <Button variant="primary" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button variant="primary" asChild className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </div>
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
