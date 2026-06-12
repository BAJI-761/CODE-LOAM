'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, Award, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  attempt: any;
  quiz: any;
}

export function QuizResults({ attempt, quiz }: QuizResultsProps) {
  const router = useRouter();
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to percentage
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easeProgress * attempt.percentage));

      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [attempt.percentage]);

  const passed = attempt.passed;

  return (
    <div className="w-full max-w-4xl mx-auto py-12 space-y-12">
      {/* Score Header */}
      <Card className="p-8 flex flex-col items-center text-center space-y-6">
        <h1 className="text-3xl font-bold font-jakarta text-slate-800">Quiz Results</h1>
        
        <div className="relative flex items-center justify-center w-48 h-48 rounded-full shadow-neumorphic">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              className="stroke-slate-200"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="84"
              className={passed ? "stroke-teal-500" : "stroke-red-500"}
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={2 * Math.PI * 84 * (1 - animatedScore / 100)}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black">{animatedScore}%</span>
            <span className="text-sm font-medium text-slate-500 mt-1">Score</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold",
            passed ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"
          )}>
            {passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {passed ? "Passed!" : "Keep Trying"}
          </div>
          <p className="text-slate-600">
            Passing score: {quiz.passingScore}%
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="secondary" onClick={() => router.push(`/course/${quiz.course}`)}>
            Back to Course
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Card>

      {/* Review Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-jakarta px-2">Detailed Review</h2>
        
        {quiz.questions.map((q: any, i: number) => {
          const userAns = attempt.answers.find((a: any) => a.questionIndex === i);
          const isCorrect = userAns?.selectedOption === q.correctAnswer;
          const skipped = !userAns;

          return (
            <Card key={q._id} className="p-6 md:p-8 space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-500" />
                  ) : skipped ? (
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-500">Question {i + 1}</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{q.questionText}</h3>
                </div>
              </div>

              <div className="pl-10 space-y-3">
                {q.options.map((opt: string, optIndex: number) => {
                  const isUserSelection = userAns?.selectedOption === optIndex;
                  const isActualCorrect = q.correctAnswer === optIndex;
                  
                  let optStyle = "bg-slate-50 border-slate-200 text-slate-700";
                  
                  if (isActualCorrect) {
                    optStyle = "bg-teal-50 border-teal-200 text-teal-800 ring-1 ring-teal-500";
                  } else if (isUserSelection && !isCorrect) {
                    optStyle = "bg-red-50 border-red-200 text-red-800";
                  }

                  return (
                    <div key={optIndex} className={cn("p-4 rounded-xl border-2 flex items-center justify-between", optStyle)}>
                      <span>{opt}</span>
                      {isActualCorrect && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                      {isUserSelection && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="pl-10 mt-6">
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-2">
                      <Award className="w-4 h-4" /> Explanation
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
