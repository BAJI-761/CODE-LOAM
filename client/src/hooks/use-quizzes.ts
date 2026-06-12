import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
});

// Helper to set auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function useQuiz(id: string) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useQuizzesByCourse(courseId: string) {
  return useQuery({
    queryKey: ['course-quizzes', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/course/${courseId}`);
      return data.data;
    },
    enabled: !!courseId,
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, answers, timeTaken }: { id: string, answers: { questionIndex: number, selectedOption: number }[], timeTaken: number }) => {
      const { data } = await api.post(`/quizzes/${id}/attempt`, { answers, timeTaken });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-results', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['course-quizzes'] });
    },
  });
}

export function useQuizResults(id: string) {
  return useQuery({
    queryKey: ['quiz-results', id],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/${id}/results`);
      return data.data;
    },
    enabled: !!id,
  });
}
