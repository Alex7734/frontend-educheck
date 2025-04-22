import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '@/api/courses';
import { TCourse, TCreateCourseData } from '@/schemas/course';
import { TGenericApiResponseMessage } from '@/types/API/generic';

export const useCourseCRUD = () => {
    const queryClient = useQueryClient();

    const getCoursesQuery = useQuery<TCourse[], Error>({
        queryKey: ['courses'],
        queryFn: () => getCourses()
    });

    const useCourseById = (id: string) =>
        useQuery<TCourse, Error>({
            queryKey: ['course', id],
            queryFn: () => getCourseById(id),
            enabled: !!id
        });

    const createCourseMutation = useMutation<TCourse, Error, TCreateCourseData>({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course created successfully');
        },
        onError: (error) => {
            console.error('createCourseMutation error:', error);
            toast.error('Error creating course');
        }
    });

    const updateCourseMutation = useMutation<
        TCourse,
        Error,
        { id: string; data: Partial<TCreateCourseData> }
    >({
        mutationFn: ({ id, data }) => updateCourse(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Course updated successfully');
        },
        onError: (error) => {
            console.error('updateCourseMutation error:', error);
            toast.error('Error updating course');
        }
    });

    const deleteCourseMutation = useMutation<TGenericApiResponseMessage, Error, string>({
        mutationFn: deleteCourse,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.removeQueries({ queryKey: ['course', id] });
            toast.success('Course deleted successfully');
        },
        onError: (error) => {
            console.error('deleteCourseMutation error:', error);
            toast.error('Error deleting course');
        }
    });

    return {
        createCourseMutation,
        getCoursesQuery,
        useCourseById,
        updateCourseMutation,
        deleteCourseMutation
    };
}; 