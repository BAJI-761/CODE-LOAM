'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuizOptionProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function QuizOption({ text, isSelected, onClick, index }: QuizOptionProps) {
  const letters = ['A', 'B', 'C', 'D'];
  
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    >
      <Card
        className={cn(
          'p-4 flex items-center gap-4 transition-all duration-200 border-2',
          isSelected ? 'border-primary bg-primary/5 shadow-inset-sm' : 'border-transparent hover:scale-[1.01] shadow-extruded-sm'
        )}
      >
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-neumorphic-sm transition-colors',
          isSelected ? 'bg-primary text-white shadow-none' : 'bg-muted text-muted-foreground'
        )}>
          {letters[index]}
        </div>
        
        <span className={cn(
          'flex-1 text-lg',
          isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'
        )}>
          {text}
        </span>
        
        {isSelected ? (
          <CheckCircle2 className="w-6 h-6 text-primary" />
        ) : (
          <Circle className="w-6 h-6 text-slate-300" />
        )}
      </Card>
    </div>
  );
}
