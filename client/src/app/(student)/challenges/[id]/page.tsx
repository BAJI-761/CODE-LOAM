"use client"

import * as React from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { DifficultyBadge } from "@/components/ui/difficulty-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Play, Upload, RotateCcw, Sparkles, CheckCircle2, XCircle } from "lucide-react"
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(() => import('@/components/challenges/CodeEditor'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-background rounded-2xl border border-border"><Loader2 className="w-8 h-8 animate-spin text-muted" /></div>
})
import LanguageSelector from "@/components/challenges/LanguageSelector"
import ChallengeDescription from "@/components/challenges/ChallengeDescription"
import TestCaseResults from "@/components/challenges/TestCaseResults"
import { toast } from "sonner"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useAIStore } from "@/stores/ai-store"
import { useAIHint } from "@/hooks/use-ai"

export default function ChallengeWorkspacePage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = React.useState<string>("javascript")
  const [sourceCode, setSourceCode] = React.useState<string>("")
  const [results, setResults] = React.useState<any>(null)
  
  const { openPanel } = useAIStore()
  const { mutate: getHint, isPending: aiLoading } = useAIHint()

  const { data: challenge, isLoading } = useQuery({
    queryKey: ['challenge', params.id],
    queryFn: async () => {
      const res = await api.get(`/challenges/${params.id}`)
      return res.data.data
    }
  })

  const { data: submissions } = useQuery({
    queryKey: ['challenge-submissions', params.id],
    queryFn: async () => {
      const res = await api.get(`/challenges/${params.id}/submissions`)
      return res.data.data
    }
  })

  // Load starter code and language from localStorage or challenge data
  React.useEffect(() => {
    if (challenge && !sourceCode) {
      const storedLang = localStorage.getItem(`lang-${params.id}`) || challenge.allowedLanguages?.[0] || 'javascript'
      setLanguage(storedLang)
      const storedCode = localStorage.getItem(`code-${params.id}-${storedLang}`)
      if (storedCode) {
        setSourceCode(storedCode)
      } else {
        setSourceCode(challenge.starterCode?.[storedLang] || "")
      }
    }
  }, [challenge]) // only run when challenge loads

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem(`lang-${params.id}`, lang)
    const storedCode = localStorage.getItem(`code-${params.id}-${lang}`)
    setSourceCode(storedCode || challenge?.starterCode?.[lang] || "")
  }

  const handleCodeChange = (code: string) => {
    setSourceCode(code)
    localStorage.setItem(`code-${params.id}-${language}`, code)
  }

  const runMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/challenges/${params.id}/run`, { code: sourceCode, language })
      return res.data.data
    },
    onSuccess: (data) => {
      setResults(data)
      if (data.status === 'accepted') toast.success("Visible test cases passed!")
      else toast.error("Some test cases failed.")
    },
    onError: () => toast.error("Failed to run code")
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/challenges/${params.id}/submit`, { code: sourceCode, language })
      return res.data.data
    },
    onSuccess: (data) => {
      setResults(data)
      if (data.status === 'accepted') {
        toast.success(`Success! +${data.score} points awarded.`)
      } else {
        toast.error("Submission failed on some test cases.")
      }
    },
    onError: () => toast.error("Submission failed")
  })

  const handleAIHint = () => {
    openPanel()
    getHint({ challengeId: params.id, code: sourceCode, language })
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to the starter code?")) {
      const defaultCode = challenge?.starterCode?.[language] || ""
      setSourceCode(defaultCode)
      localStorage.setItem(`code-${params.id}-${language}`, defaultCode)
    }
  }

  const handleSubmitClick = () => {
    if (confirm("Submit your solution?")) {
      submitMutation.mutate()
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-muted" /></div>
  if (!challenge) return <div className="text-center py-20 text-danger">Challenge not found</div>

  return (
    <div className="container max-w-[1600px] mx-auto py-6 px-4 xl:px-8 h-[calc(100vh-80px)] flex flex-col gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-display">{challenge.title}</h1>
          <DifficultyBadge difficulty={challenge.difficulty} />
          <Badge variant="inset">{challenge.category}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-accent" onClick={handleAIHint} disabled={aiLoading}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Hint
          </Button>
        </div>
      </div>

      {/* Split Pane - Stacked on Mobile, Side-by-side on Desktop */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="hidden xl:flex w-full h-full gap-2">
          
          {/* Left Panel */}
          <Panel defaultSize={40} minSize={25} className="flex flex-col gap-4 min-h-0">
            <Card variant="extruded" className="flex-1 flex flex-col overflow-hidden">
              <Tabs defaultValue="description" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start border-b border-muted/10 p-0 h-12 bg-background/50 shrink-0">
                  <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Description</TabsTrigger>
                  <TabsTrigger value="examples" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Examples</TabsTrigger>
                  <TabsTrigger value="testcases" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Test Cases</TabsTrigger>
                  <TabsTrigger value="submissions" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Submissions</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                  <TabsContent value="description" className="m-0 h-full">
                    <ChallengeDescription content={challenge.description} />
                  </TabsContent>
                  <TabsContent value="examples" className="m-0 space-y-4">
                    {challenge.examples?.map((ex: any, i: number) => (
                      <Card key={i} variant="inset" className="p-4 bg-background">
                        <div className="font-semibold mb-2">Example {i + 1}</div>
                        <div className="text-sm"><strong>Input:</strong> <code>{ex.input}</code></div>
                        <div className="text-sm"><strong>Output:</strong> <code>{ex.output}</code></div>
                        {ex.explanation && <div className="text-sm text-muted mt-2"><strong>Explanation:</strong> {ex.explanation}</div>}
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="testcases" className="m-0 space-y-4">
                    {challenge.testCases?.map((tc: any, i: number) => (
                      <Card key={i} variant="inset" className="p-4 bg-background">
                        {tc.isHidden ? (
                          <div className="text-muted italic flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-muted"></div>
                            Hidden Test Case #{i + 1}
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold mb-2">Test Case {i + 1}</div>
                            <div className="text-sm"><strong>Input:</strong> <pre className="bg-muted/10 p-2 rounded mt-1">{tc.input}</pre></div>
                            <div className="text-sm mt-2"><strong>Expected Output:</strong> <pre className="bg-muted/10 p-2 rounded mt-1">{tc.expectedOutput}</pre></div>
                          </>
                        )}
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="submissions" className="m-0 space-y-4">
                    {submissions?.length === 0 && <div className="text-muted">No submissions yet.</div>}
                    {submissions?.map((sub: any) => (
                      <Card key={sub._id} variant="inset" className="p-4 bg-background flex items-center justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {sub.status === 'accepted' ? <CheckCircle2 className="w-4 h-4 text-accent-secondary" /> : <XCircle className="w-4 h-4 text-danger" />}
                            <span className={sub.status === 'accepted' ? 'text-accent-secondary' : 'text-danger'}>{sub.status}</span>
                          </div>
                          <div className="text-sm text-muted mt-1">{new Date(sub.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono">{sub.language}</div>
                          <div className="text-sm">{sub.passedCount}/{sub.totalCount} passed</div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </Panel>

          <PanelResizeHandle className="w-2 hover:bg-accent/20 active:bg-accent/40 rounded transition-colors cursor-col-resize flex flex-col justify-center items-center">
            <div className="w-1 h-8 rounded-full bg-muted/30" />
          </PanelResizeHandle>

          {/* Right Panel */}
          <Panel defaultSize={60} minSize={30} className="flex flex-col gap-4 min-h-0 pl-4">
            
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-background rounded-2xl shadow-inset-deep shrink-0">
              <LanguageSelector 
                value={language} 
                onChange={handleLanguageChange} 
                allowedLanguages={challenge.allowedLanguages || ['javascript', 'python', 'cpp', 'java']} 
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleReset} size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button variant="secondary" onClick={() => runMutation.mutate()} disabled={runMutation.isPending} size="sm">
                  {runMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Run
                </Button>
                <Button variant="primary" onClick={handleSubmitClick} disabled={submitMutation.isPending} size="sm">
                  {submitMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Submit
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-[400px]">
              <CodeEditor language={language} value={sourceCode} onChange={handleCodeChange} />
            </div>

            {/* Test Results Bottom Panel */}
            <Card variant="extruded" className="h-[250px] shrink-0 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-muted/10 px-4 py-2 bg-background/50">
                <h3 className="font-semibold text-sm">Test Results</h3>
                {results && (
                  <div className="text-xs font-bold text-accent">
                    {results.passedCount}/{results.totalCount} Passed
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {!results ? (
                  <div className="text-center text-muted mt-8 text-sm">Run or submit your code to see results here.</div>
                ) : (
                  <TestCaseResults results={results} sourceCode={sourceCode} language={language} challengeId={params.id} />
                )}
              </div>
            </Card>

          </Panel>
        </PanelGroup>

        {/* Mobile View - Fallback to flex column */}
        <div className="xl:hidden flex flex-col gap-6 w-full h-full overflow-y-auto custom-scrollbar">
          {/* Mobile Left Panel Content */}
          <div className="w-full flex flex-col gap-4 min-h-[500px]">
            <Card variant="extruded" className="flex-1 flex flex-col overflow-hidden">
              <Tabs defaultValue="description" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="w-full justify-start border-b border-muted/10 p-0 h-12 bg-background/50 shrink-0">
                  <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Description</TabsTrigger>
                  <TabsTrigger value="examples" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Examples</TabsTrigger>
                  <TabsTrigger value="testcases" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Test Cases</TabsTrigger>
                  <TabsTrigger value="submissions" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">Submissions</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                  <TabsContent value="description" className="m-0 h-full">
                    <ChallengeDescription content={challenge.description} />
                  </TabsContent>
                  <TabsContent value="examples" className="m-0 space-y-4">
                    {challenge.examples?.map((ex: any, i: number) => (
                      <Card key={i} variant="inset" className="p-4 bg-background">
                        <div className="font-semibold mb-2">Example {i + 1}</div>
                        <div className="text-sm"><strong>Input:</strong> <code>{ex.input}</code></div>
                        <div className="text-sm"><strong>Output:</strong> <code>{ex.output}</code></div>
                        {ex.explanation && <div className="text-sm text-muted mt-2"><strong>Explanation:</strong> {ex.explanation}</div>}
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="testcases" className="m-0 space-y-4">
                    {challenge.testCases?.map((tc: any, i: number) => (
                      <Card key={i} variant="inset" className="p-4 bg-background">
                        {tc.isHidden ? (
                          <div className="text-muted italic flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-muted"></div>
                            Hidden Test Case #{i + 1}
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold mb-2">Test Case {i + 1}</div>
                            <div className="text-sm"><strong>Input:</strong> <pre className="bg-muted/10 p-2 rounded mt-1">{tc.input}</pre></div>
                            <div className="text-sm mt-2"><strong>Expected Output:</strong> <pre className="bg-muted/10 p-2 rounded mt-1">{tc.expectedOutput}</pre></div>
                          </>
                        )}
                      </Card>
                    ))}
                  </TabsContent>
                  <TabsContent value="submissions" className="m-0 space-y-4">
                    {submissions?.length === 0 && <div className="text-muted">No submissions yet.</div>}
                    {submissions?.map((sub: any) => (
                      <Card key={sub._id} variant="inset" className="p-4 bg-background flex items-center justify-between">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {sub.status === 'accepted' ? <CheckCircle2 className="w-4 h-4 text-accent-secondary" /> : <XCircle className="w-4 h-4 text-danger" />}
                            <span className={sub.status === 'accepted' ? 'text-accent-secondary' : 'text-danger'}>{sub.status}</span>
                          </div>
                          <div className="text-sm text-muted mt-1">{new Date(sub.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono">{sub.language}</div>
                          <div className="text-sm">{sub.passedCount}/{sub.totalCount} passed</div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Mobile Right Panel Content */}
          <div className="w-full flex flex-col gap-4 min-h-[600px] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-background rounded-2xl shadow-inset-deep shrink-0">
              <LanguageSelector 
                value={language} 
                onChange={handleLanguageChange} 
                allowedLanguages={challenge.allowedLanguages || ['javascript', 'python', 'cpp', 'java']} 
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleReset} size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                </Button>
                <Button variant="secondary" onClick={() => runMutation.mutate()} disabled={runMutation.isPending} size="sm">
                  {runMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Run
                </Button>
                <Button variant="primary" onClick={handleSubmitClick} disabled={submitMutation.isPending} size="sm">
                  {submitMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Submit
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-[400px]">
              <CodeEditor language={language} value={sourceCode} onChange={handleCodeChange} />
            </div>

            <Card variant="extruded" className="h-[250px] shrink-0 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-muted/10 px-4 py-2 bg-background/50">
                <h3 className="font-semibold text-sm">Test Results</h3>
                {results && (
                  <div className="text-xs font-bold text-accent">
                    {results.passedCount}/{results.totalCount} Passed
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {!results ? (
                  <div className="text-center text-muted mt-8 text-sm">Run or submit your code to see results here.</div>
                ) : (
                  <TestCaseResults results={results} sourceCode={sourceCode} language={language} challengeId={params.id} />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
