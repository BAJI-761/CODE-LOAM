import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCourses(params = {}) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const res = await api.get('/courses', { params });
      return res.data.data;
    }
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });
}

export function useEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await api.post(`/courses/${courseId}/enroll`);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['myEnrollments'] });
    }
  });
}

interface UpdateProgressPayload {
  courseId: string;
  lessonId: string;
  completed: boolean;
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, lessonId, completed }: UpdateProgressPayload) => {
      const res = await api.put(`/courses/${courseId}/progress`, { lessonId, completed });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['course'] });
      qc.invalidateQueries({ queryKey: ['myEnrollments'] });
    }
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['myEnrollments'],
    queryFn: async () => {
      const res = await api.get('/student/enrollments');
      return res.data.data;
    }
  });
}
