"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Save, Plus, Trash, Code2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from "@monaco-editor/react"
import { useTheme } from "next-themes"

const MONACO_LANGS: Record<string, string> = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export default function CreateChallengePage() {
  const { id } = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [category, setCategory] = useState("arrays")
  const [activeLang, setActiveLang] = useState("javascript")
  
  const [starterCodes, setStarterCodes] = useState<Record<string, string>>({
    javascript: "// Write your JavaScript solution here\n",
    python: "# Write your Python solution here\n",
    cpp: "// Write your C++ solution here\n#include <iostream>\n\nint main() {\n  return 0;\n}\n",
    java: "// Write your Java solution here\npublic class Main {\n  public static void main(String[] args) {\n  }\n}\n"
  })

  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "", isHidden: false }
  ])
  
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveChallenge = async () => {
    if (!title) return toast.error("Challenge title is required")
    
    // Validate test cases
    const validTests = testCases.filter(t => t.expectedOutput.trim() !== "")
    if (validTests.length === 0) {
      return toast.error("You need at least one test case with an expected output")
    }

    setIsSaving(true)
    try {
      const res = await api.post('/challenges', {
        title,
        description,
        difficulty,
        category,
        course: id,
        language: activeLang, // Currently the backend expects a specific language for a challenge
        starterCode: starterCodes,
        testCases: validTests
      })
      
      if (res.success) {
        toast.success("Challenge created successfully!")
        router.push(`/instructor/courses/${id}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save challenge")
    } finally {
      setIsSaving(false)
    }
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }])
  }

  const removeTestCase = (index: number) => {
    if (testCases.length === 1) return toast.error("You must have at least one test case")
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...testCases]
    updated[index] = { ...updated[index], [field]: value }
    setTestCases(updated)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Create Challenge</h1>
            <p className="text-muted mt-1">Design a coding exercise for your students.</p>
          </div>
        </div>
        <Button size="lg" onClick={handleSaveChallenge} disabled={isSaving || !title}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Challenge"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card variant="extruded">
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Reverse a String" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="arrays">Arrays</option>
                  <option value="strings">Strings</option>
                  <option value="linked-lists">Linked Lists</option>
                  <option value="trees">Trees</option>
                  <option value="dynamic-programming">Dynamic Programming</option>
                  <option value="sorting">Sorting</option>
                  <option value="searching">Searching</option>
                  <option value="math">Math</option>
                  <option value="graphs">Graphs</option>
                  <option value="recursion">Recursion</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Problem Description</Label>
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe the problem, input constraints, and expected output."
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card variant="surface">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Test Cases</CardTitle>
              <Button variant="inset" size="sm" onClick={addTestCase}>
                <Plus className="w-4 h-4 mr-2" /> Add Case
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {testCases.map((tc, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-muted/5 space-y-3 relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 text-muted hover:text-red-500"
                    onClick={() => removeTestCase(idx)}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                  <div className="font-bold text-sm">Test Case {idx + 1}</div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Input (stdin)</Label>
                    <Textarea 
                      value={tc.input} 
                      onChange={e => updateTestCase(idx, 'input', e.target.value)} 
                      placeholder="e.g. hello"
                      className="h-16 text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Expected Output (stdout)</Label>
                    <Textarea 
                      value={tc.expectedOutput} 
                      onChange={e => updateTestCase(idx, 'expectedOutput', e.target.value)} 
                      placeholder="e.g. olleh"
                      className="h-16 text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id={`hidden-${idx}`}
                      checked={tc.isHidden}
                      onChange={e => updateTestCase(idx, 'isHidden', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`hidden-${idx}`} className="text-sm font-normal">Hidden test case</Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card variant="extruded" className="h-[800px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" /> Starter Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <Tabs value={activeLang} onValueChange={setActiveLang} className="flex-1 flex flex-col h-full w-full">
                <div className="px-6 border-b border-muted/10">
                  <TabsList className="bg-transparent h-12">
                    <TabsTrigger value="javascript" className="data-[state=active]:bg-muted/10">JavaScript</TabsTrigger>
                    <TabsTrigger value="python" className="data-[state=active]:bg-muted/10">Python</TabsTrigger>
                    <TabsTrigger value="cpp" className="data-[state=active]:bg-muted/10">C++</TabsTrigger>
                    <TabsTrigger value="java" className="data-[state=active]:bg-muted/10">Java</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex-1 w-full bg-[#1e1e1e]">
                  <TabsContent value={activeLang} forceMount className="h-full m-0 p-0 outline-none data-[state=inactive]:hidden">
                    <Editor
                      language={MONACO_LANGS[activeLang]}
                      value={starterCodes[activeLang]}
                      onChange={(v) => setStarterCodes(prev => ({ ...prev, [activeLang]: v || '' }))}
                      theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'} // Force dark for editor usually looks better
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, monospace',
                        padding: { top: 20 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
