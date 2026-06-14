"use client";

import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';

const auroraDark = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '1A1B26' },
    { token: 'comment', foreground: '565F89', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'BB9AF7' },
    { token: 'string', foreground: '9ECE6A' },
    { token: 'number', foreground: 'FF9E64' },
    { token: 'function', foreground: '7AA2F7' },
    { token: 'variable', foreground: 'C0CAF5' },
    { token: 'type', foreground: '2AC3DE' },
  ],
  colors: {
    'editor.background': '#1A1B2600', // Transparent for glassmorphism
    'editor.foreground': '#C0CAF5',
    'editorLineNumber.foreground': '#3B4261',
    'editorLineNumber.activeForeground': '#737AA2',
    'editorIndentGuide.background': '#292E42',
    'editor.selectionBackground': '#33467C',
    'editorSuggestWidget.background': '#1A1B26',
    'editorSuggestWidget.border': '#292E42',
  }
};

const auroraLight = {
  base: 'vs',
  inherit: true,
  rules: [
    { background: 'F8F9FA' },
    { token: 'comment', foreground: '848CB5', fontStyle: 'italic' },
    { token: 'keyword', foreground: '895DF2' },
    { token: 'string', foreground: '48A14D' },
    { token: 'number', foreground: 'D97736' },
    { token: 'function', foreground: '3B82F6' },
    { token: 'variable', foreground: '1E293B' },
    { token: 'type', foreground: '0EA5E9' },
  ],
  colors: {
    'editor.background': '#F8F9FA00',
    'editor.foreground': '#1E293B',
    'editorLineNumber.foreground': '#CBD5E1',
    'editorLineNumber.activeForeground': '#64748B',
    'editorIndentGuide.background': '#E2E8F0',
    'editor.selectionBackground': '#E2E8F0',
  }
};

export default function CodeEditor({ language, value, onChange }: { language: string; value: string; onChange: (v: string) => void }) {
  const { resolvedTheme } = useTheme();
  
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('aurora-light', auroraLight);
    monaco.editor.defineTheme('aurora-dark', auroraDark);
  };

  const monacoTheme = resolvedTheme === 'dark' ? 'aurora-dark' : 'aurora-light';

  return (
    <Card variant="extruded" density="tight" className="p-3 h-full flex flex-col group transition-all duration-500 hover:shadow-extruded-hover">
      <div className="flex-1 rounded-2xl shadow-inset-deep overflow-hidden bg-background/60 backdrop-blur-md min-h-[320px] relative border border-muted/5">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme={monacoTheme}
          value={value}
          onChange={(v) => onChange(v || '')}
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontLigatures: true,
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 24, bottom: 24 },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
        />
      </div>
    </Card>
  );
}
