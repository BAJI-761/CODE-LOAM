'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz, useSubmitQuiz } from '@/hooks/use-quizzes';
import { useQuizStore } from '@/stores/quiz-store';
import { QuizTimer } from '@/components/quizzes/QuizTimer';
import { QuizProgress } from '@/components/quizzes/QuizProgress';
import { QuestionDisplay } from '@/components/quizzes/QuestionDisplay';
import { QuizNavigation } from '@/components/quizzes/QuizNavigation';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { toast } from 'sonner';

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading, isError, error, refetch } = useQuiz(quizId);
  const { mutate: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();
  
  const { startQuiz, answers, timeRemaining, resetQuiz, activeQuizId } = useQuizStore();

  useEffect(() => {
    if (quiz && (!activeQuizId || activeQuizId !== quizId)) {
      startQuiz(quiz);
    }
  }, [quiz, startQuiz, activeQuizId, quizId]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSubmit = () => {
    if (!quiz) return;

    // Convert Record<number, number> to array of objects
    const formattedAnswers = Object.entries(answers).map(([qIndex, optIndex]) => ({
      questionIndex: parseInt(qIndex, 10),
      selectedOption: optIndex as number,
    }));

    const timeTaken = (quiz.timeLimit * 60) - timeRemaining;

    submitQuiz(
      { id: quizId, answers: formattedAnswers, timeTaken },
      {
        onSuccess: () => {
          resetQuiz();
          toast.success('Quiz submitted successfully!');
          router.replace(`/quizzes/${quizId}/results`);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to submit quiz');
        }
      }
    );
  };

  if (isLoading) return <LoadingState title="Loading quiz..." />;
  if (isError) return <ErrorState title="Failed to load quiz" message={error?.message || "Unknown error"} onRetry={refetch} />;
  if (!quiz) return <ErrorState title="Quiz not found" />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Title and Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold font-jakarta text-slate-800">{quiz.title}</h1>
          <QuizTimer onTimeUp={handleSubmit} />
        </div>

        {/* Progress Bar */}
        <QuizProgress />

        {/* Question Area */}
        <div className="min-h-[400px]">
          <QuestionDisplay />
        </div>

        {/* Navigation Controls */}
        <QuizNavigation onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
