import API from '..';
import { TGenericApiResponse, TGenericApiResponseMessage } from '@/types/API/generic';
import { TEnrollment } from '@/schemas/enrollment';

export const enrollUserInCourse = async (courseId: string, userId: string): Promise<TEnrollment> => {
    try {
        const response = await API.post<TGenericApiResponse<TEnrollment>>(
            `/enrollments/course-enroll/${courseId}/user/${userId}`
        );
        return response.data.data;
    } catch (error) {
        console.error('enrollUserInCourse error:', error);
        throw error;
    }
};

export const unenrollUserFromCourse = async (courseId: string, userId: string): Promise<boolean> => {
    try {
        const response = await API.delete<TGenericApiResponseMessage>(`/enrollments/course-unenroll/${courseId}/user/${userId}`);
        return response.data.statusCode === 200 || response.data.statusCode === 201;
    } catch (error) {
        console.error('unenrollUserFromCourse error:', error);
        throw error;
    }
};

export const getUserEnrollments = async (userId: string): Promise<TEnrollment[]> => {
    try {
        const response = await API.get<TGenericApiResponse<TEnrollment[]>>(`/enrollments/user/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('getUserEnrollments error:', error);
        throw error;
    }
};

export const getCourseEnrollments = async (courseId: string): Promise<TEnrollment[]> => {
    try {
        const response = await API.get<TGenericApiResponse<TEnrollment[]>>(`/enrollments/course/${courseId}`);
        return response.data.data;
    } catch (error) {
        console.error('getCourseEnrollments error:', error);
        throw error;
    }
}; 