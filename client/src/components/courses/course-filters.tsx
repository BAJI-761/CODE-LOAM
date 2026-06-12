"use client"

import React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const CATEGORIES = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Fullstack" },
  { id: "devops", label: "DevOps" },
  { id: "ai", label: "AI & Machine Learning" },
]

export function CourseFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentCategories = params.getAll("category")
    
    if (checked && !currentCategories.includes(categoryId)) {
      params.append("category", categoryId)
    } else if (!checked) {
      params.delete("category")
      currentCategories.filter(c => c !== categoryId).forEach(c => params.append("category", c))
    }
    
    // Reset to page 1 when filtering
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleDifficultyChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("difficulty")
    } else {
      params.set("difficulty", value)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push(pathname)
  }

  const currentDifficulty = searchParams.get("difficulty") || "all"
  const currentCategories = searchParams.getAll("category")
  const hasFilters = currentDifficulty !== "all" || currentCategories.length > 0 || searchParams.has("search")

  return (
    <Card variant="inset" className="h-fit sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-8 px-2">
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Category</h4>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${cat.id}`} 
                  checked={currentCategories.includes(cat.id)}
                  onCheckedChange={(checked) => handleCategoryChange(cat.id, checked === true)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="font-medium text-muted cursor-pointer">
                  {cat.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Difficulty</h4>
          <RadioGroup value={currentDifficulty} onValueChange={handleDifficultyChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="diff-all" />
              <Label htmlFor="diff-all" className="font-medium text-muted cursor-pointer">All Levels</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="diff-beg" />
              <Label htmlFor="diff-beg" className="font-medium text-muted cursor-pointer">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="diff-int" />
              <Label htmlFor="diff-int" className="font-medium text-muted cursor-pointer">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="diff-adv" />
              <Label htmlFor="diff-adv" className="font-medium text-muted cursor-pointer">Advanced</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
