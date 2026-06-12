import React from 'react';

export function AIChatLoading() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card shadow-extruded-sm rounded-[20px] rounded-bl-sm px-4 py-3 flex items-center gap-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
