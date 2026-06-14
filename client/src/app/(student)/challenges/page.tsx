"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { PageHeader } from "@/components/layout/page-header"
import { ChallengeCard } from "@/components/challenges/ChallengeCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, Code2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

export default function ChallengesPage() {
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [difficulty, setDifficulty] = React.useState<string>("all")
  const [category, setCategory] = React.useState<string>("all")
  const [status, setStatus] = React.useState<string>("all")
  const [language, setLanguage] = React.useState<string>("all")
  const [sort, setSort] = React.useState<string>("popular")

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const { data, isLoading, error } = useQuery({
    queryKey: ['challenges', debouncedSearch, difficulty, category, status, language, sort],
    queryFn: async () => {
      const params: Record<string, any> = { limit: 50 }
      if (debouncedSearch) params.search = debouncedSearch
      if (difficulty !== 'all') params.difficulty = difficulty
      if (category !== 'all') params.category = category
      // Backend sorting could be handled here or locally
      // Using generic endpoint for now
      const res = await api.get('/challenges', { params })
      return res.data || { items: [], total: 0 }
    }
  })

  // Apply frontend sorting/filtering if backend doesn't support all yet
  const items = React.useMemo(() => {
    if (!data?.items) return []
    let filtered = [...data.items]
    
    if (status === 'solved') filtered = filtered.filter(item => item.completionStatus === 'completed')
    if (status === 'unsolved') filtered = filtered.filter(item => item.completionStatus !== 'completed')
    
    // Sort logic
    if (sort === 'popular') {
      filtered.sort((a, b) => (b.solvedCount || 0) - (a.solvedCount || 0))
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [data?.items, status, sort])

  return (
    <div className="container max-w-7xl mx-auto py-12 px-6">
      <PageHeader 
        title="Coding Challenges" 
        description="Sharpen your skills with our collection of interactive coding problems."
        breadcrumbs={<span className="text-muted flex items-center gap-2"><Code2 className="w-4 h-4" /> Practice</span>}
      />

      {/* Filters Bar */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-background p-4 rounded-3xl shadow-inset-deep">
          
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input 
              placeholder="Search challenges..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={difficulty} onValueChange={setDifficulty} className="w-full lg:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>

        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="arrays">Arrays</SelectItem>
              <SelectItem value="strings">Strings</SelectItem>
              <SelectItem value="linked-lists">Linked Lists</SelectItem>
              <SelectItem value="trees">Trees</SelectItem>
              <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
              <SelectItem value="sorting">Sorting</SelectItem>
              <SelectItem value="searching">Searching</SelectItem>
              <SelectItem value="math">Math</SelectItem>
              <SelectItem value="graphs">Graphs</SelectItem>
              <SelectItem value="recursion">Recursion</SelectItem>
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="solved">Solved</SelectItem>
              <SelectItem value="unsolved">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto hidden sm:block border-l border-muted/20 pl-4">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading challenges...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-danger">
          <p>Failed to load challenges. Please try again.</p>
          <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState 
          icon={<Code2 className="h-8 w-8 text-muted" />}
          title="No challenges found"
          description="Try adjusting your filters or search term to find what you're looking for."
          action={
            <Button variant="default" onClick={() => {
              setSearch(""); setDifficulty("all"); setCategory("all"); setStatus("all"); setLanguage("all");
            }}>Clear Filters</Button>
          }
          className="mt-8"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <ChallengeCard key={item._id} challenge={item} />
          ))}
        </div>
      )}
    </div>
  )
}
