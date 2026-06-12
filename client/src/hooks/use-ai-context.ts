import { usePathname, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ChatContext } from './use-ai';

export function useAIContext(): ChatContext {
  const pathname = usePathname();
  const params = useParams();
  
  if (!pathname) return { type: 'general' };
  
  // Challenge page
  if (pathname.startsWith('/challenges/') && params.id) {
    return { 
      type: 'challenge', 
      referenceId: params.id as string 
    };
  }
  
  // Course learning page
  if (pathname.includes('/courses/') && pathname.includes('/learn')) {
    const parts = pathname.split('/');
    const coursesIndex = parts.indexOf('courses');
    if (coursesIndex !== -1 && parts.length > coursesIndex + 1) {
      const courseId = parts[coursesIndex + 1];
      if (courseId) {
        return { 
          type: 'course', 
          referenceId: courseId 
        };
      }
    }
  }
  
  return { type: 'general' };
}

// Optional: fetch the reference name (course title, challenge title) for display
export function useContextName(context: ChatContext) {
  return useQuery({
    queryKey: ['context-name', context.type, context.referenceId],
    queryFn: async () => {
      if (!context.referenceId) return null;
      
      if (context.type === 'challenge') {
        const res = await api.get(`/challenges/${context.referenceId}`);
        return res.data.data?.title;
      }
      
      if (context.type === 'course') {
        const res = await api.get(`/courses/${context.referenceId}`);
        return res.data.data?.title;
      }
      
      return null;
    },
    enabled: !!context.referenceId,
    staleTime: 60000,
  });
}
