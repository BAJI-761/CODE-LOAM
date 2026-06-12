"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowRight, Image as ImageIcon, Upload, X } from "lucide-react"

export default function CreateCourseWizard() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "beginner",
    price: 0,
    tags: [] as string[],
    thumbnail: ""
  })
  
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Draft persistence
  const DRAFT_KEY = "course-draft"
  
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (confirm("You have an unsaved course draft. Would you like to resume it?")) {
          setFormData(parsed)
        } else {
          localStorage.removeItem(DRAFT_KEY)
        }
      } catch (e) {
        // Ignore invalid draft
      }
    }
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (formData.title || formData.description) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
    }
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value }))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const form = new FormData()
    form.append('file', file)

    try {
      const res = await api.post('/uploads/thumbnail', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.success && res.url) {
        setFormData(prev => ({ ...prev, thumbnail: res.url }))
        toast.success("Image uploaded successfully")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      return toast.error("Course title is required")
    }

    setIsSubmitting(true)
    try {
      const res = await api.post('/instructor/courses', {
        ...formData,
        price: Number(formData.price)
      })

      if (res.success) {
        localStorage.removeItem(DRAFT_KEY)
        toast.success("Course created successfully!")
        // Redirect to curriculum builder
        router.push(`/instructor/courses/${res.data._id}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create course")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Create New Course</h1>
        <p className="text-muted mt-2">Start by providing basic information about your course.</p>
      </div>

      <Card variant="extruded">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Course Title <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              placeholder="e.g. Advanced React Patterns" 
              className="text-lg py-6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="What will students learn in this course?" 
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="level" className="text-base">Difficulty Level</Label>
              <Select value={formData.level} onValueChange={handleLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-base">Price (USD)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                min="0"
                value={formData.price} 
                onChange={handleInputChange} 
                placeholder="0 for free" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-base">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span key={tag} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input 
              id="tags" 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)} 
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Course Thumbnail</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-muted/5">
              {formData.thumbnail ? (
                <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Change Image"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6 text-muted" />
                  </div>
                  <p className="text-sm text-muted mb-4">Upload a high-quality image for your course</p>
                  <Button variant="inset" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? "Uploading..." : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 sm:p-8 pt-0 flex justify-between border-t border-border/50 bg-muted/5 rounded-b-[32px]">
          <Button variant="inset" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title}>
            {isSubmitting ? "Creating..." : "Create Course"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
