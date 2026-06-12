import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIStore } from '@/stores/ai-store';
import { useAIStatus } from '@/hooks/use-ai';
import { ChatContext } from '@/hooks/use-ai';
import { useContextName } from '@/hooks/use-ai-context';

export function AIChatHeader({ context }: { context: ChatContext }) {
  const { closePanel } = useAIStore();
  const { data: status } = useAIStatus();
  const { data: contextName } = useContextName(context);

  let contextLabel = 'General';
  if (context.type === 'course') contextLabel = 'Course';
  if (context.type === 'challenge') contextLabel = 'Challenge';
  if (context.type === 'lesson') contextLabel = 'Lesson';

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-bold text-lg">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">CodeLoom AI</h3>
          </div>
          
          {status?.demoMode && (
            <div 
              className="ml-2 flex items-center gap-1 bg-amber-500/10 text-amber-500 text-xs font-medium px-2 py-0.5 rounded-full shadow-extruded-sm border border-amber-500/20"
              title="Configure GEMINI_API_KEY in .env for full AI features"
            >
              <AlertTriangle className="h-3 w-3" />
              Demo Mode
            </div>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
          <span className="bg-muted px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            {contextLabel} Context
          </span>
          {contextName && (
            <span className="truncate max-w-[200px]">
              {contextName}
            </span>
          )}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={closePanel} 
        className="rounded-full hover:bg-muted"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
