"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Sparkles, PlusCircle } from 'lucide-react';
import api from '@/lib/api';

export function AIGenerateQuizButton({ onQuestionsGenerated }: { onQuestionsGenerated: (questions: any[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.post('/ai/generate-quiz', { topic, difficulty, questionCount: count });
      if (res.data.data && res.data.data.questions) {
        onQuestionsGenerated(res.data.data.questions);
        setIsOpen(false);
        setTopic('');
      }
    } catch (error) {
      console.error('Error generating quiz', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Sparkles className="h-4 w-4 mr-2 text-accent" /> Generate Quiz with AI
      </Button>
    );
  }

  return (
    <Card className="p-4 space-y-4 shadow-extruded-sm border-accent/20 border" density="compact">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center"><Sparkles className="h-4 w-4 mr-2 text-accent" /> AI Quiz Generator</h4>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Topic</label>
          <input 
            type="text" 
            placeholder="e.g. React Hooks, Node.js Streams..." 
            className="w-full bg-background border-none rounded-2xl px-3 py-2 text-sm shadow-inset-sm focus:ring-1 focus:ring-accent outline-none"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Difficulty</label>
            <select 
              className="w-full bg-background border-none rounded-2xl px-3 py-2 text-sm shadow-inset-sm outline-none"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Questions</label>
            <input 
              type="number" 
              min={1} 
              max={10} 
              className="w-full bg-background border-none rounded-2xl px-3 py-2 text-sm shadow-inset-sm outline-none"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
            />
          </div>
        </div>

        <Button 
          variant="primary" 
          className="w-full" 
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {isLoading ? 'Generating...' : 'Generate Questions'}
        </Button>
      </div>
    </Card>
  );
}
