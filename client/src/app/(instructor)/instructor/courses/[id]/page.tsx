"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, ArrowUp, ArrowDown, Settings, BookOpen, ExternalLink, Video, FileText, Code, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"

interface Lesson {
  title: string;
  type: string;
  content: string;
  videoUrl?: string;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  status: string;
  modules: Module[];
}

export default function CourseEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)

  // Module creation state
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)

  // Lesson creation state
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [newLesson, setNewLesson] = useState({ title: "", type: "video", content: "", videoUrl: "" })

  const fetchCourse = async () => {
    try {
      // In the real app, we might need a specific instructor GET /course/:id endpoint
      // Using the generic one for now assuming instructor has access
      const res = await api.get(`/courses/${id}`)
      if (res.success) {
        setCourse(res.data)
      }
    } catch (error) {
      toast.error("Failed to load course details")
      router.push('/instructor/courses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  const handleUpdateCourse = async () => {
    if (!course) return
    try {
      const res = await api.put(`/instructor/courses/${id}`, {
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price,
        status: course.status
      })
      if (res.success) {
        toast.success("Course settings saved")
      }
    } catch (error) {
      toast.error("Failed to update course")
    }
  }

  const handleAddModule = async () => {
    if (!newModuleTitle) return toast.error("Module title is required")
    
    try {
      const res = await api.post(`/instructor/courses/${id}/modules`, {
        title: newModuleTitle,
        description: ""
      })
      if (res.success) {
        toast.success("Module added")
        setCourse(res.data)
        setNewModuleTitle("")
        setIsModuleDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to add module")
    }
  }

  const handleAddLesson = async () => {
    if (activeModuleIndex === null) return
    if (!newLesson.title) return toast.error("Lesson title is required")

    try {
      const res = await api.post(`/instructor/courses/${id}/modules/${activeModuleIndex}/lessons`, newLesson)
      if (res.success) {
        toast.success("Lesson added")
        setCourse(res.data)
        setNewLesson({ title: "", type: "video", content: "", videoUrl: "" })
        setIsLessonDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to add lesson")
    }
  }

  // Local state reordering (requires a PUT /courses/:id to save globally)
  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (!course) return
    const newModules = [...course.modules]
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]]
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]]
    }
    setCourse({ ...course, modules: newModules })
    // In a real app, immediately sync or show a "Save Changes" button
  }

  const moveLesson = (modIndex: number, lessonIndex: number, direction: 'up' | 'down') => {
    if (!course) return
    const newModules = [...course.modules]
    const lessons = [...newModules[modIndex].lessons]
    
    if (direction === 'up' && lessonIndex > 0) {
      [lessons[lessonIndex - 1], lessons[lessonIndex]] = [lessons[lessonIndex], lessons[lessonIndex - 1]]
    } else if (direction === 'down' && lessonIndex < lessons.length - 1) {
      [lessons[lessonIndex + 1], lessons[lessonIndex]] = [lessons[lessonIndex], lessons[lessonIndex + 1]]
    }
    
    newModules[modIndex].lessons = lessons
    setCourse({ ...course, modules: newModules })
  }

  const publishCourse = async () => {
    setIsPublishing(true)
    try {
      const res = await api.put(`/instructor/courses/${id}`, { status: 'published' })
      if (res.success) {
        toast.success("Course published successfully!")
        setCourse({ ...course!, status: 'published' })
      }
    } catch (error) {
      toast.error("Failed to publish course")
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading || !course) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Course Editor</h1>
          <p className="text-muted mt-1">{course.title}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/instructor/courses/${id}/analytics`}>
            <Button variant="inset">Analytics</Button>
          </Link>
          <Button 
            onClick={publishCourse} 
            disabled={course.status === 'published' || isPublishing}
            className={course.status === 'published' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
          >
            {course.status === 'published' ? <><CheckCircle2 className="w-4 h-4 mr-2"/> Published</> : "Publish Course"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Curriculum Builder</h2>
            <div className="flex gap-2">
              <Link href={`/instructor/courses/${id}/quiz/new`}>
                <Button variant="inset" size="sm">
                  <FileText className="w-4 h-4 mr-2" /> Add Quiz
                </Button>
              </Link>
              <Link href={`/instructor/courses/${id}/challenges/new`}>
                <Button variant="inset" size="sm">
                  <Code className="w-4 h-4 mr-2" /> Add Challenge
                </Button>
              </Link>
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Module</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Module Title</Label>
                      <Input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} placeholder="e.g. Introduction to React" />
                    </div>
                    <Button onClick={handleAddModule} className="w-full">Save Module</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-4">
            {course.modules.length === 0 ? (
              <Card variant="flat" className="border-dashed bg-transparent py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold">No Modules Yet</h3>
                <p className="text-muted">Start building your course by adding a module.</p>
              </Card>
            ) : (
              course.modules.map((module, mIdx) => (
                <Card key={mIdx} variant="surface" className="overflow-hidden">
                  <div className="bg-muted/10 p-4 border-b flex justify-between items-center">
                    <div className="font-bold flex items-center gap-2">
                      <span className="text-muted">Module {mIdx + 1}:</span>
                      {module.title}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => moveModule(mIdx, 'up')} disabled={mIdx === 0}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveModule(mIdx, 'down')} disabled={mIdx === course.modules.length - 1}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {module.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="flex items-center justify-between p-3 bg-background border rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          {lesson.type === 'video' ? <Video className="w-4 h-4 text-accent" /> : <FileText className="w-4 h-4 text-accent-secondary" />}
                          <span className="font-medium text-sm">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveLesson(mIdx, lIdx, 'up')} disabled={lIdx === 0}>
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveLesson(mIdx, lIdx, 'down')} disabled={lIdx === module.lessons.length - 1}>
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Dialog open={isLessonDialogOpen && activeModuleIndex === mIdx} onOpenChange={(open) => {
                      setIsLessonDialogOpen(open)
                      if (open) setActiveModuleIndex(mIdx)
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="inset" size="sm" className="w-full mt-2 border-dashed">
                          <Plus className="w-4 h-4 mr-2" /> Add Lesson
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Lesson to Module {mIdx + 1}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Lesson Title</Label>
                            <Input value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Lesson Type</Label>
                            <select 
                              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={newLesson.type}
                              onChange={e => setNewLesson({...newLesson, type: e.target.value})}
                            >
                              <option value="video">Video</option>
                              <option value="text">Text/Article</option>
                            </select>
                          </div>
                          {newLesson.type === 'video' && (
                            <div className="space-y-2">
                              <Label>Video URL</Label>
                              <Input value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} placeholder="https://..." />
                            </div>
                          )}
                          {newLesson.type === 'text' && (
                            <div className="space-y-2">
                              <Label>Content</Label>
                              <textarea 
                                className="w-full flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newLesson.content} 
                                onChange={e => setNewLesson({...newLesson, content: e.target.value})} 
                              />
                            </div>
                          )}
                          <Button onClick={handleAddLesson} className="w-full">Save Lesson</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            )}
            
            {course.modules.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleUpdateCourse}>Save Curriculum Order</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card variant="extruded">
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={course.title} onChange={e => setCourse({...course, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  className="w-full flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={course.description} 
                  onChange={e => setCourse({...course, description: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <select 
                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={course.level}
                    onChange={e => setCourse({...course, level: e.target.value})}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input type="number" value={course.price} onChange={e => setCourse({...course, price: Number(e.target.value)})} />
                </div>
              </div>
              <Button onClick={handleUpdateCourse} className="mt-4">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
