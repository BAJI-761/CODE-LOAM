import React from 'react';
import { CodeSurface } from '@/components/ui/code-surface';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AICodeBlockProps {
  language?: string;
  value: string;
}

export function AICodeBlock({ language, value }: AICodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const header = (
    <>
      <span className="text-xs text-muted-foreground uppercase">{language || 'text'}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </>
  );

  return (
    <CodeSurface header={header} className="my-2 max-h-96">
      <pre className="text-xs font-mono bg-transparent m-0 p-0 overflow-x-auto">
        <code className={language ? `language-${language}` : ''}>
          {value}
        </code>
      </pre>
    </CodeSurface>
  );
}
