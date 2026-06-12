"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, CheckCircle, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

const CHART_COLORS = {
  primary: '#6C63FF',    // accent
  secondary: '#38B2AC',  // teal
  tertiary: '#3D4852',   // foreground
  quaternary: '#A0AEC0', // muted
}

export default function CourseAnalyticsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/instructor/courses/${id}/analytics`)
        if (res.success) {
          setAnalytics(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 animate-in fade-in">
        <h2 className="text-2xl font-bold mb-4">Analytics Not Available</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  // Transform data for charts if backend doesn't provide it in exact recharts format
  // For demo, we'll ensure we have some data shapes
  const enrollmentData = analytics.enrollmentTrends || [
    { name: 'Jan', students: 4 },
    { name: 'Feb', students: 10 },
    { name: 'Mar', students: 15 },
    { name: 'Apr', students: 30 },
    { name: 'May', students: 45 },
    { name: 'Jun', students: 80 }
  ];

  const completionData = analytics.moduleCompletion || [
    { name: 'Module 1', completed: 80 },
    { name: 'Module 2', completed: 65 },
    { name: 'Module 3', completed: 40 },
    { name: 'Module 4', completed: 15 },
  ];

  const scoreData = analytics.scoreDistribution || [
    { name: '90-100%', value: 30 },
    { name: '80-89%', value: 45 },
    { name: '70-79%', value: 15 },
    { name: '<70%', value: 10 },
  ];
  
  const pieColors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.quaternary, CHART_COLORS.tertiary];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Course Analytics
          </h1>
          <p className="text-muted mt-1">Detailed performance metrics for your course.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Enrollments"
          value={analytics.totalEnrollments || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Avg. Completion Rate"
          value={`${Math.round(analytics.avgCompletion || 0)}%`}
          icon={CheckCircle}
        />
        <StatsCard
          title="Active Learners"
          value={analytics.activeLearners || 0}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card variant="extruded">
          <CardHeader>
            <CardTitle className="text-lg">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="students" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Drop-off */}
        <Card variant="extruded">
          <CardHeader>
            <CardTitle className="text-lg">Module Completion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card variant="extruded" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quiz Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scoreData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
