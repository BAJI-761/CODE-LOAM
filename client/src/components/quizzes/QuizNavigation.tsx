'use client';

import { useState } from 'react';
import { useQuizStore } from '@/stores/quiz-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QuizNavigationProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function QuizNavigation({ onSubmit, isSubmitting }: QuizNavigationProps) {
  const { questions, currentQuestionIndex, goToQuestion, getProgress } = useQuizStore();
  const [showConfirm, setShowConfirm] = useState(false);
  
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === questions.length - 1;
  const { answered, total } = getProgress();
  const allAnswered = answered === total;

  const handleNext = () => {
    if (!isLast) goToQuestion(currentQuestionIndex + 1);
  };

  const handlePrev = () => {
    if (!isFirst) goToQuestion(currentQuestionIndex - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between mt-8">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={isFirst}
          className="w-32"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {!isLast ? (
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              variant="default"
              className="w-32"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowConfirm(true)}
            variant="default"
            className="w-40"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              {allAnswered 
                ? "You have answered all questions. Are you ready to see your results?"
                : `You have answered ${answered} out of ${total} questions. Are you sure you want to submit? Unanswered questions will be marked incorrect.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
              Keep Reviewing
            </Button>
            <Button 
              onClick={() => {
                setShowConfirm(false);
                onSubmit();
              }}
              disabled={isSubmitting}
            >
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
