import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCourses,
    getCourseById,
    enrollUserInCourse,
    unenrollUserFromCourse,
    getCourseAssignment,
    submitAssignmentAnswers
} from '../../API/methods/courses';
import { TCourse } from '../../../schemas/course';
import { TGenericApiResponseMessage } from '../../../types/API/generic';
import { Assignment, SubmitAssignmentAnswers, SubmitAssignmentResult } from '../../../types/assignment';

export const useCourses = (userId: string) => {
    const queryClient = useQueryClient();

    const useGetCoursesQuery = (search?: string, isActive?: boolean) =>
        useQuery<TCourse[], Error>({
            queryKey: ['courses', { search, isActive }],
            queryFn: () => getCourses(search, isActive)
        });

    const useGetCourseByIdQuery = (courseId: string) =>
        useQuery<TCourse, Error>({
            queryKey: ['course', courseId],
            queryFn: () => getCourseById(courseId),
            enabled: !!courseId
        });

    const useGetCourseAssignmentQuery = (courseId: string) =>
        useQuery<Assignment, Error>({
            queryKey: ['course', courseId, 'assignment'],
            queryFn: () => getCourseAssignment(courseId),
            enabled: !!courseId
        });

    const enrollMutation = useMutation<TCourse, Error, string>({
        mutationFn: (courseId: string) => enrollUserInCourse(courseId, userId),
        onSuccess: (_, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Successfully enrolled in course');
        },
        onError: (error) => {
            console.error('enrollMutation error:', error);
            toast.error('Error enrolling in course');
        }
    });

    const unenrollMutation = useMutation<TGenericApiResponseMessage, Error, string>({
        mutationFn: (courseId: string) => unenrollUserFromCourse(courseId, userId),
        onSuccess: (_, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['course', courseId] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            toast.success('Successfully unenrolled from course');
        },
        onError: (error) => {
            console.error('unenrollMutation error:', error);
            toast.error('Error unenrolling from course');
        }
    });

    const submitAssignmentMutation = useMutation<
        SubmitAssignmentResult,
        Error,
        { courseId: string; answers: SubmitAssignmentAnswers[] }
    >({
        mutationFn: ({ courseId, answers }) => submitAssignmentAnswers(courseId, userId, answers),
        onSuccess: (_, { courseId }) => {
            queryClient.invalidateQueries({ queryKey: ['course', courseId, 'assignment'] });
            toast.success('Assignment submitted successfully');
        },
        onError: (error) => {
            console.error('submitAssignmentMutation error:', error);
            toast.error('Error submitting assignment');
        }
    });

    return {
        useGetCoursesQuery,
        useGetCourseByIdQuery,
        useGetCourseAssignmentQuery,
        enrollMutation,
        unenrollMutation,
        submitAssignmentMutation
    };
}; 