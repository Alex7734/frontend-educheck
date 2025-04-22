import { TGenericApiResponse, TGenericApiResponseMessage } from '@/types/API/generic';
import API from '..';
import {
  TCreateCourseData,
  TCourse,
  courseSchema,
} from '@/schemas/course';
import { ADMIN_SECRET } from '@/config';
import { SubmitAssignmentAnswers, SubmitAssignmentResult } from '@/types/assignment';

export interface AssignmentQuestion {
  id?: string;
  questionText: string;
  answer?: string;
}

export interface Assignment {
  id: string;
  questions: AssignmentQuestion[];
}

export const createCourse = async (
  courseData: TCreateCourseData
): Promise<TCourse> => {
  try {
    const response = await API.post<TGenericApiResponse<TCourse>>('/courses', courseData);
    const parsedResponse = courseSchema.parse(response.data.data);
    return parsedResponse;
  } catch (error) {
    console.error('createCourse error:', error);
    throw error;
  }
};

export const getCourses = async (search?: string, isActive?: boolean): Promise<TCourse[]> => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await API.get<TGenericApiResponse<TCourse[]>>(`/courses?${params.toString()}`);
    const parsedResponse = courseSchema.array().parse(response.data.data);
    return parsedResponse;
  } catch (error) {
    console.error('getCourses error:', error);
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<TCourse> => {
  try {
    const response = await API.get<TGenericApiResponse<TCourse>>(`/courses/${id}`);
    const parsedResponse = courseSchema.parse(response.data.data);
    return parsedResponse;
  } catch (error) {
    console.error('getCourseById error:', error);
    throw error;
  }
};

export const updateCourse = async (
  id: string,
  courseData: Partial<TCreateCourseData>
): Promise<TCourse> => {
  try {
    const response = await API.patch<TGenericApiResponse<TCourse>>(`/courses/${id}`, courseData);
    const parsedResponse = courseSchema.parse(response.data.data);
    return parsedResponse;
  } catch (error) {
    console.error('updateCourse error:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string): Promise<TGenericApiResponseMessage> => {
  try {
    const response = await API.delete<TGenericApiResponseMessage>(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('deleteCourse error:', error);
    throw error;
  }
};

export const enrollUserInCourse = async (courseId: string, userId: string): Promise<TCourse> => {
  try {
    const response = await API.post<TGenericApiResponse<TCourse>>(
      `/enrollments/course-enroll/${courseId}/user/${userId}`
    );
    const parsedResponse = courseSchema.parse(response.data.data);
    return parsedResponse;
  } catch (error) {
    console.error('enrollUserInCourse error:', error);
    throw error;
  }
};

export const unenrollUserFromCourse = async (
  courseId: string,
  userId: string
): Promise<TGenericApiResponseMessage> => {
  try {
    const response = await API.delete<TGenericApiResponseMessage>(
      `/enrollments/course-unenroll/${courseId}/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('unenrollUserFromCourse error:', error);
    throw error;
  }
};

export const getCourseAssignment = async (
  courseId: string): Promise<Assignment> => {
  try {
    const url = `/assignments/course/${courseId}?adminSecret=${ADMIN_SECRET}`;

    const response = await API.get<TGenericApiResponse<Assignment>>(url);
    return response.data.data;
  } catch (error) {
    console.error('getCourseAssignment error:', error);
    throw error;
  }
};

export const createCourseAssignment = async (
  courseId: string,
  questions: AssignmentQuestion[]
): Promise<Assignment> => {
  try {
    const response = await API.post<TGenericApiResponse<Assignment>>(
      `/assignments/course/${courseId}`,
      {
        courseId,
        questions
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('createCourseAssignment error:', error);
    throw error;
  }
};

export const updateCourseAssignment = async (
  courseId: string,
  questions: AssignmentQuestion[]
): Promise<Assignment> => {
  try {
    const response = await API.patch<TGenericApiResponse<Assignment>>(
      `/assignments/course/${courseId}`,
      {
        courseId,
        questions
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('updateCourseAssignment error:', error);
    throw error;
  }
};

export const submitAssignmentAnswers = async (
  courseId: string,
  userId: string,
  answers: SubmitAssignmentAnswers[]
): Promise<SubmitAssignmentResult> => {
  try {
    const response = await API.post<TGenericApiResponse<SubmitAssignmentResult>>(
      `/enrollments/submit-assignment/${courseId}/user/${userId}`,
      answers
    );
    return response.data.data;
  } catch (error) {
    console.error('submitAssignmentAnswers error:', error);
    throw error;
  }
};
