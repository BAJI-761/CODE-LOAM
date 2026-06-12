import React, { useEffect, useRef, useState } from 'react';
import { AIChatMessage } from './AIChatMessage';
import { AIChatLoading } from './AIChatLoading';
import { ChatContext, useChatHistory, useSendChatMessage } from '@/hooks/use-ai';

interface AIChatMessagesProps {
  context: ChatContext;
}

export function AIChatMessages({ context }: AIChatMessagesProps) {
  const { data: messages = [], isLoading: isHistoryLoading } = useChatHistory(context);
  const { isPending: isSending } = useSendChatMessage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolled, setIsUserScrolled] = useState(false);

  const { mutate: sendMessage } = useSendChatMessage();

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Check if user has scrolled up from the bottom (with a small 10px threshold)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
    setIsUserScrolled(!isAtBottom);
  };

  useEffect(() => {
    if (!isUserScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolled, isSending]);

  const handleSuggestionClick = (msg: string) => {
    sendMessage({ message: msg, context });
  };

  if (isHistoryLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-muted/10">
        <AIChatLoading />
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10"
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      {messages.length === 0 && !isSending && (
        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
          <div className="h-16 w-16 mb-4 rounded-full bg-card shadow-extruded-sm flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <p className="font-medium text-foreground mb-4">How can I help you today?</p>
          
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {context.type === 'challenge' ? (
              <>
                <SuggestionChip text="How do I approach this?" onClick={handleSuggestionClick} />
                <SuggestionChip text="Explain the problem" onClick={handleSuggestionClick} />
                <SuggestionChip text="Give me a hint" onClick={handleSuggestionClick} />
              </>
            ) : context.type === 'course' ? (
              <>
                <SuggestionChip text="Summarize this course" onClick={handleSuggestionClick} />
                <SuggestionChip text="What are the prerequisites?" onClick={handleSuggestionClick} />
                <SuggestionChip text="What's next?" onClick={handleSuggestionClick} />
              </>
            ) : (
              <>
                <SuggestionChip text="Explain a programming concept" onClick={handleSuggestionClick} />
                <SuggestionChip text="Recommend a course" onClick={handleSuggestionClick} />
                <SuggestionChip text="What should I learn?" onClick={handleSuggestionClick} />
              </>
            )}
          </div>
        </div>
      )}

      {messages.map((msg: any, i: number) => (
        <AIChatMessage key={`${msg.timestamp}-${i}`} role={msg.role} content={msg.content} />
      ))}

      {isSending && <AIChatLoading />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

function SuggestionChip({ text, onClick }: { text: string, onClick: (t: string) => void }) {
  return (
    <button 
      onClick={() => onClick(text)}
      className="text-xs bg-background hover:bg-accent hover:text-accent-foreground border border-border rounded-full py-2 px-3 transition-colors text-left shadow-sm"
    >
      {text}
    </button>
  );
}
