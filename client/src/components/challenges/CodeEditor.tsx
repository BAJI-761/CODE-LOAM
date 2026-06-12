"use client";

import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';

const githubLight = {
  base: 'vs',
  inherit: true,
  rules: [
    { background: 'ffffff' },
    { token: 'comment', foreground: '6e7781', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'cf222e' },
    { token: 'string', foreground: '0a3069' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292f',
    'editorLineNumber.foreground': '#8c959f',
    'editorIndentGuide.background': '#d0d7de',
  }
};

const githubDark = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '0d1117' },
    { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'ff7b72' },
    { token: 'string', foreground: 'a5d6ff' },
  ],
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#c9d1d9',
    'editorLineNumber.foreground': '#6e7681',
    'editorIndentGuide.background': '#21262d',
  }
};

export default function CodeEditor({ language, value, onChange }: { language: string; value: string; onChange: (v: string) => void }) {
  const { resolvedTheme } = useTheme();
  
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('github-light', githubLight);
    monaco.editor.defineTheme('github-dark', githubDark);
  };

  const monacoTheme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';

  return (
    <Card variant="extruded" density="tight" className="p-3">
      <div className="rounded-2xl shadow-inset-deep overflow-hidden bg-background min-h-[320px]">
        <Editor
          height="360px"
          language={language === 'cpp' ? 'cpp' : language}
          theme={monacoTheme}
          value={value}
          onChange={(v) => onChange(v || '')}
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontLigatures: true,
            smoothScrolling: true,
            automaticLayout: true,
          }}
        />
      </div>
    </Card>
  );
}
