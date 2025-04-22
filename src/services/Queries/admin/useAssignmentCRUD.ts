import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '@/services/API';
import { Assignment, CreateAssignmentData } from '@/schemas/assignment.schema';
import { toast } from 'react-hot-toast';

export const useAssignmentCRUD = () => {
    const queryClient = useQueryClient();

    const useAssignmentByCourseId = (courseId: string) => {
        return useQuery({
            queryKey: ['assignment', courseId],
            queryFn: async () => {
                const response = await API.get(`/assignments/course/${courseId}`);
                return response.data.data as Assignment;
            },
            enabled: !!courseId,
        });
    };

    const useCreateAssignment = () => {
        return useMutation({
            mutationFn: async ({ courseId, data }: { courseId: string; data: CreateAssignmentData }) => {
                const response = await API.post(`/assignments/course/${courseId}`, data);
                return response.data.data as Assignment;
            },
            onSuccess: (_, { courseId }) => {
                toast.success('Assignment created successfully');
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['assignment', courseId] });
                queryClient.invalidateQueries({ queryKey: ['assignment-status', courseId] });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to create assignment');
            },
        });
    };

    const useUpdateAssignment = () => {
        return useMutation({
            mutationFn: async ({ courseId, data }: { courseId: string; data: CreateAssignmentData }) => {
                const response = await API.patch(`/assignments/course/${courseId}`, data);
                return response.data.data as Assignment;
            },
            onSuccess: (_, { courseId }) => {
                toast.success('Assignment updated successfully');
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['assignment', courseId] });
                queryClient.invalidateQueries({ queryKey: ['assignment-status', courseId] });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to update assignment');
            },
        });
    };

    const useDeleteAssignment = () => {
        return useMutation({
            mutationFn: async (courseId: string) => {
                await API.delete(`/assignments/course/${courseId}`);
            },
            onSuccess: (_, courseId) => {
                toast.success('Assignment deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                queryClient.invalidateQueries({ queryKey: ['assignment', courseId] });
                queryClient.invalidateQueries({ queryKey: ['assignment-status', courseId] });
                queryClient.removeQueries({ queryKey: ['assignment', courseId] });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to delete assignment');
            },
        });
    };

    return {
        useAssignmentByCourseId,
        useCreateAssignment,
        useUpdateAssignment,
        useDeleteAssignment,
    };
}; 