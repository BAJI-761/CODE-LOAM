"use client"

import * as React from "react"
import { MarkdownRenderer } from "@/components/shared/markdown-renderer"

export default function ChallengeDescription({ content }: { content: string }) {
  if (!content) return null
  
  return (
    <div className="prose prose-sm max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
      <MarkdownRenderer content={content} />
    </div>
  )
}
