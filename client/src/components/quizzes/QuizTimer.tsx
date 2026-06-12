'use client';

import { useEffect } from 'react';
import { useQuizStore } from '@/stores/quiz-store';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  onTimeUp: () => void;
}

export function QuizTimer({ onTimeUp }: QuizTimerProps) {
  const { timeRemaining, tickTimer } = useQuizStore();

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, tickTimer, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 60;

  return (
    <Card 
      className={`sticky top-4 z-10 flex items-center gap-2 px-4 py-2 mx-auto w-fit transition-colors duration-300 ${
        isLowTime 
          ? 'text-red-500 shadow-inset-deep border-red-500/20' 
          : 'text-foreground shadow-inset-sm'
      }`}
    >
      <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-xl font-bold tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </Card>
  );
}