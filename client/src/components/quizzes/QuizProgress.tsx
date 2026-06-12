'use client';

import { useQuizStore } from '@/stores/quiz-store';
import { Progress } from '@/components/ui/progress';

export function QuizProgress() {
  const { getProgress, questions, answers } = useQuizStore();
  const { percentage } = getProgress();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-3" />
      
      {/* Optional dot indicators */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {questions.map((_, index) => {
          const isAnswered = answers[index] !== undefined;
          return (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                isAnswered ? 'bg-primary' : 'bg-slate-200'
              }`}
              title={isAnswered ? `Question ${index + 1} answered` : `Question ${index + 1} unanswered`}
            />
          );
        })}
      </div>
    </div>
  );
}
