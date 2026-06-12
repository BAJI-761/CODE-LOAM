'use client';

import { useParams } from 'next/navigation';
import { useQuizResults } from '@/hooks/use-quizzes';
import { QuizResults } from '@/components/quizzes/QuizResults';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.id as string;

  const { data, isLoading, isError, error, refetch } = useQuizResults(quizId);

  if (isLoading) return <LoadingState title="Calculating your results..." />;
  if (isError) return <ErrorState title="Failed to load results" message={error?.message || "Unknown error"} onRetry={refetch} />;
  if (!data || !data.attempts || data.attempts.length === 0) {
    return <ErrorState title="No results found" message="It looks like you haven't taken this quiz yet." />;
  }

  const latestAttempt = data.attempts[0];
  const quiz = data.quiz;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6">
      <QuizResults attempt={latestAttempt} quiz={quiz} />
    </div>
  );
}
