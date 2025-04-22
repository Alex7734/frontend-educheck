import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    enrollUserInCourse,
    unenrollUserFromCourse,
    getUserEnrollments,
    getCourseEnrollments
} from '@/api/enrollments';
import { TEnrollment } from '@/schemas/enrollment';

export const useEnrollmentCRUD = () => {
    const queryClient = useQueryClient();

    const useGetUserEnrollmentsQuery = (userId: string) =>
        useQuery<TEnrollment[], Error>({
            queryKey: ['enrollments', 'user', userId],
            queryFn: () => getUserEnrollments(userId),
            enabled: !!userId
        });

    const useGetCourseEnrollmentsQuery = (courseId: string) =>
        useQuery<TEnrollment[], Error>({
            queryKey: ['enrollments', 'course', courseId],
            queryFn: () => getCourseEnrollments(courseId),
            enabled: !!courseId
        });

    const enrollMutation = useMutation<TEnrollment, Error, { courseId: string; userId: string }>({
        mutationFn: ({ courseId, userId }) => enrollUserInCourse(courseId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['enrollments', 'user', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['enrollments', 'course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Successfully enrolled in course');
        },
        onError: (error) => {
            console.error('enrollMutation error:', error);
            toast.error('Error enrolling in course');
        }
    });

    const unenrollMutation = useMutation<boolean, Error, { courseId: string; userId: string }>({
        mutationFn: ({ courseId, userId }) => unenrollUserFromCourse(courseId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['enrollments', 'user', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['enrollments', 'course', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Successfully unenrolled from course');
        },
        onError: (error) => {
            console.error('unenrollMutation error:', error);
            toast.error('Error unenrolling from course');
        }
    });

    return {
        getUserEnrollmentsQuery: useGetUserEnrollmentsQuery,
        getCourseEnrollmentsQuery: useGetCourseEnrollmentsQuery,
        enrollMutation,
        unenrollMutation
    };
}; 