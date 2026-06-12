"use client";

import React from 'react';

export function GradeBadge({ grade }: { grade: string }) {
  const normalizedGrade = ['A', 'B', 'C', 'D'].includes(grade) ? grade : 'C';
  
  const colors: Record<string, { bg: string, text: string }> = {
    A: { bg: '#D4AF37', text: '#000' },  // gold
    B: { bg: '#C0C0C0', text: '#000' },  // silver  
    C: { bg: '#CD7F32', text: '#FFF' },  // bronze
    D: { bg: '#6B7280', text: '#FFF' },  // gray
  };
  
  const selected = colors[normalizedGrade];
  
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer ring with neumorphic shadow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: selected.bg,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.2)',
        }}
      />
      
      {/* Inner ring for extra depth */}
      <div 
        className="absolute inset-2 rounded-full border border-black/10"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      
      {/* Inner content */}
      <div className="relative z-10 text-center">
        <div className="text-5xl font-bold font-display" style={{ color: selected.text }}>
          {normalizedGrade}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] mt-1 font-sans" style={{ color: selected.text, opacity: 0.9 }}>
          Grade
        </div>
      </div>
    </div>
  );
}
