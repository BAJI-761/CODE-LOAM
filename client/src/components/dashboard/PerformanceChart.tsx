"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/card';

interface PerformanceChartProps {
  data: any[];
  type?: 'line' | 'bar';
}

export function PerformanceChart({ data, type = 'line' }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card variant="inset" className="h-64 flex items-center justify-center text-muted-foreground">
        No performance data available yet.
      </Card>
    );
  }

  return (
    <Card variant="extruded" className="p-4 md:p-6 h-80">
      <h3 className="text-lg font-semibold mb-6">Performance History</h3>
      <ResponsiveContainer width="100%" height="80%">
        {type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis dataKey="name" stroke="currentColor" className="text-xs opacity-50" />
            <YAxis stroke="currentColor" className="text-xs opacity-50" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis dataKey="name" stroke="currentColor" className="text-xs opacity-50" />
            <YAxis stroke="currentColor" className="text-xs opacity-50" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
            />
            <Bar dataKey="score" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
