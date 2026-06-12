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
import { ArrowLeft, Sparkles, Plus, Trash, Save } from "lucide-react"

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export default function CreateQuizPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" }
  ])
  
  // AI Generation State
  const [aiTopic, setAiTopic] = useState("")
  const [aiDifficulty, setAiDifficulty] = useState("medium")
  const [aiCount, setAiCount] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleGenerateAI = async () => {
    if (!aiTopic) return toast.error("Please enter a topic for AI generation")
    
    setIsGenerating(true)
    try {
      const res = await api.post('/ai/generate-quiz', {
        topic: aiTopic,
        difficulty: aiDifficulty,
        count: aiCount
      })
      
      if (res.success && res.data?.questions) {
        setQuestions(res.data.questions)
        toast.success(`Generated ${res.data.questions.length} questions successfully!`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate quiz")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveQuiz = async () => {
    if (!title) return toast.error("Quiz title is required")
    
    // Validate questions
    const validQuestions = questions.filter(q => 
      q.questionText.trim() !== "" && 
      q.options.every(o => o.trim() !== "")
    )
    
    if (validQuestions.length === 0) {
      return toast.error("You need at least one complete question (with all options filled)")
    }

    setIsSaving(true)
    try {
      const res = await api.post('/quizzes', {
        title,
        description,
        course: id,
        questions: validQuestions
      })
      
      if (res.success) {
        toast.success("Quiz saved successfully!")
        router.push(`/instructor/courses/${id}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save quiz")
    } finally {
      setIsSaving(false)
    }
  }

  const addEmptyQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0, explanation: "" }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return toast.error("You must have at least one question")
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[optIndex] = value
    setQuestions(updated)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Create Quiz</h1>
          <p className="text-muted mt-1">Design an assessment for your course.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card variant="extruded">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. JavaScript Basics Quiz" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this quiz about?" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display flex items-center justify-between">
              Questions ({questions.length})
              <Button variant="inset" size="sm" onClick={addEmptyQuestion}>
                <Plus className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </h3>
            
            {questions.map((q, qIndex) => (
              <Card key={qIndex} variant="surface" className="relative border-l-4 border-l-accent">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-muted hover:text-red-500"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Question {qIndex + 1}</Label>
                    <Textarea 
                      value={q.questionText} 
                      onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)}
                      placeholder="Enter your question..."
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Options & Correct Answer</Label>
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`} 
                          checked={q.correctAnswerIndex === oIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', oIndex)}
                          className="w-4 h-4 text-accent"
                        />
                        <Input 
                          value={opt} 
                          onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className={q.correctAnswerIndex === oIndex ? "border-accent/50 bg-accent/5" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Explanation (Optional)</Label>
                    <Textarea 
                      value={q.explanation} 
                      onChange={e => updateQuestion(qIndex, 'explanation', e.target.value)}
                      placeholder="Explain why the answer is correct..."
                      className="h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={handleSaveQuiz} disabled={isSaving || questions.length === 0}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Quiz"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="flat" className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g. React Hooks" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={aiDifficulty}
                  onChange={e => setAiDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Question Count: {aiCount}</Label>
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={aiCount} 
                  onChange={e => setAiCount(parseInt(e.target.value))} 
                  className="w-full accent-accent"
                />
              </div>
              <Button 
                onClick={handleGenerateAI} 
                disabled={isGenerating || !aiTopic} 
                className="w-full bg-gradient-to-r from-accent to-accent-secondary"
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
