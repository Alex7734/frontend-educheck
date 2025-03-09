import API from '..';
import { z } from 'zod';
import {
  TCreateCourseData,
  TCourse,
  TUnenrollSuccess,
  courseSchema,
  unenrollSuccessSchema
} from '@/schemas/course';

export const createCourse = async (
  courseData: TCreateCourseData
): Promise<TCourse> => {
  try {
    const response = await API.post('/courses', courseData);
    return courseSchema.parse(response.data);
  } catch (error) {
    console.error('createCourse error:', error);
    throw error;
  }
};

export const getCourses = async (): Promise<TCourse[]> => {
  try {
    const response = await API.get('/courses');
    return z.array(courseSchema).parse(response.data);
  } catch (error) {
    console.error('getCourses error:', error);
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<TCourse> => {
  try {
    const response = await API.get(`/courses/${id}`);
    return courseSchema.parse(response.data);
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
    const response = await API.patch(`/courses/${id}`, courseData);
    return courseSchema.parse(response.data);
  } catch (error) {
    console.error('updateCourse error:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    await API.delete(`/courses/${courseId}`);
  } catch (error) {
    console.error('deleteCourse error:', error);
    throw error;
  }
};

export const enrollUserInCourse = async (
  courseId: string,
  userId: string
): Promise<TCourse> => {
  try {
    const response = await API.post(
      `/courses/${courseId}/enroll/user/${userId}`
    );
    return courseSchema.parse(response.data);
  } catch (error) {
    console.error('enrollUserInCourse error:', error);
    throw error;
  }
};

export const unenrollUserFromCourse = async (
  courseId: string,
  enrollmentId: string
): Promise<TUnenrollSuccess> => {
  try {
    const response = await API.post(
      `/courses/${courseId}/enroll/${enrollmentId}`
    );
    return unenrollSuccessSchema.parse(response.data);
  } catch (error) {
    console.error('unenrollUserFromCourse error:', error);
    throw error;
  }
};
