"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import dynamic from 'next/dynamic';

const PerformanceChart = dynamic(
  () => import('@/components/dashboard/PerformanceChart').then((mod) => mod.PerformanceChart),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/5 rounded-2xl"><Loader2 className="w-8 h-8 animate-spin text-muted" /></div> }
);
import { Award, BookOpen, Target, Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await api.get('/progress');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const {
    coursesEnrolled = 0,
    coursesCompleted = 0,
    challengesSolved = 0,
    totalQuizzesTaken = 0,
    averageQuizScore = 0,
    recentActivity = [],
    overallProgress = 0
  } = progressData || {};

  const stats = [
    { label: 'Courses Enrolled', value: coursesEnrolled, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Courses Completed', value: coursesCompleted, icon: Award, color: 'text-yellow-500' },
    { label: 'Challenges Solved', value: challengesSolved, icon: Target, color: 'text-green-500' },
    { label: 'Avg Quiz Score', value: `${Math.round(averageQuizScore)}%`, icon: Award, color: 'text-purple-500' },
  ];

  const chartData = recentActivity.map((activity: any, index: number) => ({
    name: `Quiz ${index + 1}`,
    score: activity.score || 0
  }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Track your learning journey and performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <Card variant="extruded" className="p-8 flex flex-col items-center justify-center text-center h-full">
            <h3 className="font-semibold text-lg mb-6">Overall Progress</h3>
            <ProgressRing progress={overallProgress} size={180} strokeWidth={16} />
            <p className="text-sm text-muted-foreground mt-6">
              Across all enrolled courses
            </p>
          </Card>
        </div>

        <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} variant="inset" className="p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`p-3 rounded-2xl bg-card shadow-extruded-sm ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PerformanceChart data={chartData} type="line" />
        <Card variant="extruded" className="p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                  <div>
                    <div className="font-medium text-sm">{activity.quizTitle || 'Quiz Attempt'}</div>
                    <div className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                  <div className="font-bold text-accent">{activity.score}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No recent activity found.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
