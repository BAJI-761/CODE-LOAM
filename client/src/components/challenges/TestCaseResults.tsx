"use client";

import { CheckCircle2, XCircle, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIStore } from '@/stores/ai-store';
import { useExplainError } from '@/hooks/use-ai';

interface TestCaseResultsProps {
  results: any[];
  sourceCode?: string;
  language?: string;
  challengeId?: string;
}

export default function TestCaseResults({ results, sourceCode, language, challengeId }: TestCaseResultsProps) {
  const { openPanel } = useAIStore();
  const { mutate: explainError, isPending: isLoading } = useExplainError();

  if (!results || results.length === 0) {
    return <div className="text-sm text-muted">No results yet. Run or submit to see details.</div>;
  }

  const handleExplainError = (actualOutput: string) => {
    if (!sourceCode || !language || !challengeId) return;
    openPanel();
    explainError({ challengeId, code: sourceCode, error: actualOutput, language });
  };

  return (
    <div className="space-y-3">
      {results.map((r, idx) => (
        <Card
          key={idx}
          variant="inset"
          density="compact"
          className={r.passed ? 'ring-1 ring-accent-secondary/50 shadow-inset' : 'ring-1 ring-red-500/60 shadow-inset'}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-medium text-sm flex items-center gap-2">
                Test Case {idx + 1} {r.isHidden ? '(Hidden)' : '(Sample)'}
                {!r.passed && !r.isHidden && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleExplainError(r.output || r.error || 'Failed')}
                    disabled={isLoading}
                  >
                    <Bot className="h-3 w-3 mr-1" /> Explain Error
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted mt-1">Status: {r.passed ? 'Passed' : 'Failed'}</div>
              <pre className="text-xs mt-2 whitespace-pre-wrap">Expected: {r.expectedOutput ?? 'N/A'}{'\n'}Actual: {r.output ?? 'N/A'}</pre>
              {r.error && <pre className="text-xs mt-2 text-danger whitespace-pre-wrap">Error: {r.error}</pre>}
            </div>
            <div className="flex items-center gap-2">
              {r.passed ? <CheckCircle2 className="h-5 w-5 text-teal-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            </div>
          </div>
          <div className="text-xs text-muted mt-2">Time: {r.executionTime || '0'}s</div>
        </Card>
      ))}
    </div>
  );
}
