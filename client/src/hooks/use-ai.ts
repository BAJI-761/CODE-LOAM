import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ChatContext {
  type: 'general' | 'course' | 'challenge' | 'lesson';
  referenceId?: string;
  referenceName?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Fetch chat history for current context
export function useChatHistory(context: ChatContext) {
  return useQuery({
    queryKey: ['chat-history', context.type, context.referenceId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('type', context.type);
      if (context.referenceId) params.set('referenceId', context.referenceId);
      const res = await api.get(`/ai/chat/history?${params}`);
      return res.data.data?.messages || [];
    },
    staleTime: 30000,
  });
}

// Send chat message with optimistic UI
export function useSendChatMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ message, context }: { message: string; context: ChatContext }) => {
      const res = await api.post('/ai/chat', { message, context });
      return res.data.data;
    },
    onMutate: async ({ message, context }) => {
      const queryKey = ['chat-history', context.type, context.referenceId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ChatMessage[]>(queryKey) || [];
      const optimistic: ChatMessage[] = [
        ...previous,
        { role: 'user' as const, content: message, timestamp: new Date().toISOString() },
      ];
      queryClient.setQueryData(queryKey, optimistic);
      return { previous, queryKey };
    },
    onSuccess: (data, variables, context) => {
      if (context?.queryKey) {
        queryClient.setQueryData(context.queryKey, (old: ChatMessage[] = []) => [
          ...old,
          { role: 'assistant', content: data.response, timestamp: new Date().toISOString() },
        ]);
      }
    },
    onError: (err, variables, context) => {
      if (context?.queryKey && context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
  });
}

// AI Hint for coding challenges
export function useAIHint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ challengeId, code, language }: {
      challengeId: string;
      code: string;
      language: string;
    }) => {
      const res = await api.post('/ai/hint', { challengeId, code, language });
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', 'challenge', variables.challengeId] });
    }
  });
}

// AI Error Explanation
export function useExplainError() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ challengeId, code, error, language }: {
      challengeId: string;
      code: string;
      error: string;
      language: string;
    }) => {
      const res = await api.post('/ai/explain-error', { challengeId, code, error, language });
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', 'challenge', variables.challengeId] });
    }
  });
}

// AI service availability
export function useAIStatus() {
  return useQuery({
    queryKey: ['ai-status'],
    queryFn: async () => {
      try {
        const res = await api.get('/ai/status');
        return res.data.data;
      } catch {
        return { available: false, demoMode: true };
      }
    },
    staleTime: 60000,
  });
}
