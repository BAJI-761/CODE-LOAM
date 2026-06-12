"use client"

import React, { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Users, Search, ChevronDown, ChevronUp, Mail } from "lucide-react"

interface Progress {
  courseId: string;
  courseTitle: string;
  completionPercentage: number;
  lastAccessed: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  joinedAt: string;
  progress: Progress[];
}

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<{_id: string, title: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filtering & Pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get('/instructor/students'),
          api.get('/instructor/courses')
        ])
        
        if (studentsRes.success) {
          // Backend returns array of enrollments populated with student and course
          const enrollments = studentsRes.data || [];
          const studentMap = new Map<string, Student>();
          
          enrollments.forEach((e: any) => {
            if (!e.student) return;
            
            if (!studentMap.has(e.student._id)) {
              studentMap.set(e.student._id, {
                _id: e.student._id,
                name: e.student.name,
                email: e.student.email,
                joinedAt: e.student.createdAt || new Date().toISOString(),
                progress: []
              });
            }
            
            const student = studentMap.get(e.student._id)!;
            student.progress.push({
              courseId: e.course?._id || "",
              courseTitle: e.course?.title || "Unknown Course",
              completionPercentage: e.completionPercentage || 0,
              lastAccessed: e.lastAccessedAt || new Date().toISOString()
            });
          });
          
          setStudents(Array.from(studentMap.values()));
        }
        if (coursesRes.success) {
          setCourses(coursesRes.data)
        }
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudentsAndCourses()
  }, [])

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    
    if (selectedCourse === "all") return matchesSearch
    
    // Check if student is enrolled in selected course
    const isInCourse = student.progress.some(p => p.courseId === selectedCourse)
    return matchesSearch && isInCourse
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Student Management
        </h1>
        <p className="text-muted mt-1">Monitor progress and manage all enrolled students.</p>
      </div>

      <Card variant="extruded">
        <CardHeader className="border-b border-muted/10 pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5" /> All Students ({filteredStudents.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input 
                  placeholder="Search name or email..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(c => (
                    <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted uppercase bg-muted/5 border-b border-muted/10">
                <tr>
                  <th className="px-6 py-4 font-medium w-8"></th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <React.Fragment key={student._id}>
                      <tr 
                        className={`hover:bg-muted/5 transition-colors cursor-pointer ${expandedRows.has(student._id) ? 'bg-muted/5' : ''}`}
                        onClick={() => toggleRow(student._id)}
                      >
                        <td className="px-6 py-4">
                          {expandedRows.has(student._id) ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                        <td className="px-6 py-4 text-muted">{student.email}</td>
                        <td className="px-6 py-4">{new Date(student.joinedAt || Date.now()).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href=`mailto:${student.email}` }}>
                            <Mail className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                      {expandedRows.has(student._id) && (
                        <tr className="bg-muted/5 border-t-0">
                          <td colSpan={5} className="px-14 py-4 pb-6">
                            <h4 className="font-bold text-xs uppercase text-muted mb-3">Course Progress</h4>
                            {student.progress.length === 0 ? (
                              <p className="text-sm text-muted">No course enrollments found.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {student.progress.map((prog, i) => (
                                  <div key={i} className="bg-background border rounded-lg p-3 space-y-2">
                                    <div className="font-medium text-sm truncate">{prog.courseTitle}</div>
                                    <div className="flex items-center justify-between text-xs text-muted">
                                      <span>{prog.completionPercentage}% Complete</span>
                                      <span>Last active: {new Date(prog.lastAccessed).toLocaleDateString()}</span>
                                    </div>
                                    <div className="w-full bg-muted/20 rounded-full h-1.5 mt-2">
                                      <div 
                                        className="bg-accent h-1.5 rounded-full" 
                                        style={{ width: `${prog.completionPercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
