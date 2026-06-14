import React, { KeyboardEvent, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSendChatMessage, ChatContext } from '@/hooks/use-ai';
import { useAuthStore } from '@/stores/auth-store';

interface AIChatInputProps {
  context: ChatContext;
}

export function AIChatInput({ context }: AIChatInputProps) {
  const [input, setInput] = useState('');
  const { mutate: sendMessage, isPending } = useSendChatMessage();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleSend = () => {
    if (!input.trim() || isPending) return;
    sendMessage({ message: input.trim(), context });
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="flex items-end gap-2 bg-background p-2 rounded-[24px] shadow-inset-sm focus-within:ring-2 focus-within:ring-accent/50 transition-all">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAuthenticated ? "Ask me anything..." : "Please log in to use AI"}
          className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          disabled={isPending || !isAuthenticated}
        />
        <Button 
          size="icon" 
          className={cn(
            "rounded-full h-10 w-10 shrink-0 transition-all shadow-extruded-sm",
            input.trim() ? "bg-accent hover:bg-accent/90" : "bg-muted text-muted-foreground shadow-none"
          )}
          onClick={handleSend}
          disabled={!input.trim() || isPending || !isAuthenticated}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
        </Button>
      </div>
    </div>
  );
}
