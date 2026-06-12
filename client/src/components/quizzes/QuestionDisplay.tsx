'use client';

import { useQuizStore } from '@/stores/quiz-store';
import { Card } from '@/components/ui/card';
import { QuizOption } from './QuizOption';

export function QuestionDisplay() {
  const { questions, currentQuestionIndex, answers, setAnswer } = useQuizStore();
  
  const question = questions[currentQuestionIndex];
  const selectedOption = answers[currentQuestionIndex];

  if (!question) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-2">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-8 font-jakarta">
          {question.questionText}
        </h2>

        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <QuizOption
              key={index}
              index={index}
              text={option}
              isSelected={selectedOption === index}
              onClick={() => setAnswer(currentQuestionIndex, index)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
