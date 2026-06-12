"use client";

import { Code2, FileCode2, Coffee, Braces } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: Braces },
  { value: 'python', label: 'Python', icon: FileCode2 },
  { value: 'cpp', label: 'C++', icon: Code2 },
  { value: 'java', label: 'Java', icon: Coffee },
];

export default function LanguageSelector({ value, onChange, allowedLanguages }: { value: string; onChange: (v: string) => void; allowedLanguages?: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => {
          const Icon = lang.icon;
          const disabled = allowedLanguages ? !allowedLanguages.includes(lang.value) : false;
          return (
            <SelectItem key={lang.value} value={lang.value} disabled={disabled}>
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {lang.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
