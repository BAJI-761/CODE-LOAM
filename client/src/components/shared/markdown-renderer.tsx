import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { CodeSurface } from "@/components/ui/code-surface"
import { cn } from "@/lib/utils"
// Note: We need a highlight.js theme CSS in our globals or layout for syntax highlighting to work
import "highlight.js/styles/github-dark.css"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null

  return (
    <div className={cn("prose prose-zinc dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-accent prose-a:no-underline hover:prose-a:underline", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline ? (
              <div className="my-6">
                <CodeSurface header={match ? <span className="text-muted text-xs uppercase tracking-wider">{match[1]}</span> : null}>
                  <code>{String(children).replace(/\n$/, "")}</code>
                </CodeSurface>
              </div>
            ) : (
              <code className="bg-muted/10 text-accent font-mono px-1.5 py-0.5 rounded-md text-sm" {...props}>
                {children}
              </code>
            )
          },
          // Customizing other elements for our neumorphic design
          h1: ({ children }) => <h1 className="text-3xl font-display font-bold mt-8 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-display font-bold mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-display font-bold mt-6 mb-3">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-foreground/80 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="text-foreground/80">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 italic text-muted my-6 bg-muted/5 py-2 pr-4 rounded-r-xl">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-muted/20">
              <table className="min-w-full text-sm text-left">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="bg-muted/10 px-4 py-3 font-medium text-foreground">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 border-t border-muted/10 text-foreground/80">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
