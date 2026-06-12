"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function CourseSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) {
        params.set("search", searchTerm)
      } else {
        params.delete("search")
      }
      params.delete("page") // Reset to page 1 on search
      router.push(`${pathname}?${params.toString()}`)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, pathname, router, searchParams])

  // Sync with URL changes if user clears via the Clear All button
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
  }, [searchParams])

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted" />
      </div>
      <Input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-12"
      />
    </div>
  )
}
