"use client";

import React, { useEffect, useState } from 'react';
import { useAIStore } from '@/stores/ai-store';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

export function AIChatButton() {
  const { togglePanel, isPanelOpen } = useAIStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={togglePanel}
        className={cn(
          "h-14 w-14 rounded-full shadow-extruded-accent bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center transition-all duration-300",
          !isPanelOpen && "animate-pulse" // Subtle pulse when idle
        )}
      >
        {isPanelOpen ? <MessageSquare className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </div>
  );
}
