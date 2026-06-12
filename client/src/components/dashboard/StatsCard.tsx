import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card variant="surface" density="compact" className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-extruded-sm">
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-bold font-display">{value}</div>
        {description && (
          <p className="text-sm text-muted mt-1">{description}</p>
        )}
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
