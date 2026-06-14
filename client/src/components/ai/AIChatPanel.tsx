'use client';

import React from 'react';
import { useAIStore } from '@/stores/ai-store';
import { useAIContext } from '@/hooks/use-ai-context';
import { AIChatHeader } from './AIChatHeader';
import { AIChatMessages } from './AIChatMessages';
import { AIChatInput } from './AIChatInput';
import { cn } from '@/lib/utils';

export function AIChatPanel() {
  const { isPanelOpen, closePanel } = useAIStore();
  const context = useAIContext();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closePanel}
        />
      )}
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-background border-l border-border shadow-extruded-deep z-50 flex flex-col transition-transform duration-300 ease-out transform",
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <AIChatHeader context={context} />
        <AIChatMessages context={context} />
        <AIChatInput context={context} />
      </div>
    </>
  );
}
