'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAIStore } from '@/stores/ai-store';
import { useAIContext } from '@/hooks/use-ai-context';
import { AIChatHeader } from './AIChatHeader';
import { AIChatMessages } from './AIChatMessages';
import { AIChatInput } from './AIChatInput';
import { cn } from '@/lib/utils';

const MIN_WIDTH = 300;
const MAX_WIDTH = 800;
const DEFAULT_WIDTH = 400;

export function AIChatPanel() {
  const { isPanelOpen, closePanel } = useAIStore();
  const context = useAIContext();
  const [mounted, setMounted] = useState(false);
  
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Load saved width from local storage
    const savedWidth = localStorage.getItem('ai-panel-width');
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
        setWidth(parsed);
      }
    }
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    localStorage.setItem('ai-panel-width', width.toString());
  }, [width]);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        // Calculate new width based on mouse position
        // Since it's attached to the right, width is (window.innerWidth - e.clientX)
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
        if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
        setWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      // Prevent text selection while resizing
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, resize, stopResizing]);

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
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 h-[100dvh] bg-background border-l border-border shadow-extruded-deep z-50 flex flex-col transform",
          isPanelOpen ? "translate-x-0" : "translate-x-full",
          // Only apply transition if not resizing to avoid lag
          !isResizing && "transition-transform duration-300 ease-out"
        )}
        style={{
          // On small screens, force 100% width
          width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : `${width}px`
        }}
      >
        {/* Resizer Handle */}
        <div
          className="absolute top-0 bottom-0 left-0 w-2 cursor-col-resize hover:bg-accent/50 group flex items-center justify-center -ml-1 z-50"
          onMouseDown={startResizing}
        >
          <div className="h-8 w-1 rounded-full bg-border group-hover:bg-accent transition-colors" />
        </div>

        <AIChatHeader context={context} />
        <AIChatMessages context={context} />
        <AIChatInput context={context} />
      </div>
    </>
  );
}
