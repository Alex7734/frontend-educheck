import { z } from 'zod';
import { courseSchema } from './course';
import { userSchema } from './user';

export const enrollmentSchema = z.object({
    id: z.string(),
    courseId: z.string(),
    userId: z.string(),
    enrollmentDate: z.string(),
    completed: z.boolean(),
    testPassed: z.boolean(),
    dateLastAttempt: z.string().optional(),
    course: courseSchema.optional(),
    user: userSchema.optional()
});

export const createEnrollmentSchema = z.object({
    courseId: z.string(),
    userId: z.string()
});

export type TEnrollment = z.infer<typeof enrollmentSchema>;
export type TCreateEnrollment = z.infer<typeof createEnrollmentSchema>; 