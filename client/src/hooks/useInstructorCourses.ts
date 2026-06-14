import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useInstructorCourses() {
  return useQuery({
    queryKey: ['instructorCourses'],
    queryFn: async () => {
      const res = await api.get('/instructor/courses');
      return res.data;
    }
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/instructor/courses', payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useAddModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: any }) => {
      const res = await api.post(`/instructor/courses/${courseId}/modules`, payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useAddLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: any }) => {
      const res = await api.post(`/instructor/courses/${courseId}/lessons`, payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: any }) => {
      const res = await api.put(`/instructor/courses/${courseId}`, payload);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await api.delete(`/instructor/courses/${courseId}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useDeleteModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId }: { courseId: string; moduleId: string }) => {
      const res = await api.delete(`/instructor/courses/${courseId}/modules/${moduleId}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, moduleId, lessonId }: { courseId: string; moduleId: string; lessonId: string }) => {
      const res = await api.delete(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['instructorCourses'] })
  });
}
