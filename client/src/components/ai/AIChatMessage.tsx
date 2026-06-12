import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AICodeBlock } from './AICodeBlock';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface AIChatMessageProps {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export function AIChatMessage({ role, content }: AIChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] items-end gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
        
        {/* Avatar */}
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-extruded-sm",
          isUser ? "bg-accent/20 text-accent" : "bg-card text-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 text-sm",
          isUser 
            ? "rounded-[20px] rounded-br-sm bg-accent text-accent-foreground shadow-extruded-accent" 
            : "rounded-[20px] rounded-bl-sm bg-card shadow-extruded-sm"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <AICodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, '')}
                  />
                ) : (
                  <code className={cn("bg-black/10 rounded px-1 py-0.5", className)} {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">{children}</a>
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
