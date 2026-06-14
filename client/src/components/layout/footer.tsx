import * as React from "react"
import Link from "next/link"
import { Container } from "./container"
import { Globe, MessageSquare, BookOpen } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-background mt-auto">
      {/* Top Divider with insetSm shadow */}
      <div className="w-full h-px shadow-inset-sm" />
      
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/features" className="text-sm text-muted hover:text-accent transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-muted hover:text-accent transition-colors">Pricing</Link>
              <Link href="/enterprise" className="text-sm text-muted hover:text-accent transition-colors">Enterprise</Link>
              <Link href="/changelog" className="text-sm text-muted hover:text-accent transition-colors">Changelog</Link>
            </nav>
          </div>

          {/* Column 2: Learn */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Learn</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/courses" className="text-sm text-muted hover:text-accent transition-colors">All Courses</Link>
              <Link href="/challenges" className="text-sm text-muted hover:text-accent transition-colors">Challenges</Link>
              <Link href="/paths" className="text-sm text-muted hover:text-accent transition-colors">Learning Paths</Link>
              <Link href="/community" className="text-sm text-muted hover:text-accent transition-colors">Community</Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/about" className="text-sm text-muted hover:text-accent transition-colors">About Us</Link>
              <Link href="/careers" className="text-sm text-muted hover:text-accent transition-colors">Careers</Link>
              <Link href="/blog" className="text-sm text-muted hover:text-accent transition-colors">Blog</Link>
              <Link href="/contact" className="text-sm text-muted hover:text-accent transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/privacy" className="text-sm text-muted hover:text-accent transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted hover:text-accent transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-sm text-muted hover:text-accent transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-muted/20 gap-4">
          <p className="text-sm text-muted">
            &copy; {currentYear} CodeLoom. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <span className="sr-only">Twitter</span>
              <MessageSquare className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <span className="sr-only">GitHub</span>
              <Globe className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors">
              <span className="sr-only">LinkedIn</span>
              <BookOpen className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
