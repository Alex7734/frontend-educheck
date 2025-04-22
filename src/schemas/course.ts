import { z } from 'zod';
import { genericSuccessApiResponseSchema } from '@/schemas/api';

// Schemas
export const courseSchema = z.object({
  id: z.string().nonempty({ message: 'Course id is required' }),
  title: z.string().nonempty({ message: 'Course title is required' }),
  description: z
    .string()
    .nonempty({ message: 'Course description is required' }),
  isActive: z.boolean(),
  numberOfStudents: z.number().optional(),
});


export const createCourseSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
  isActive: z.boolean().default(true)
});

const unenrollDataSchema = z.object({
  message: z.string()
});
export const unenrollSuccessSchema =
  genericSuccessApiResponseSchema(unenrollDataSchema);

// Infer types
export type TUnenrollSuccess = z.infer<typeof unenrollSuccessSchema>;
export type TCourse = z.infer<typeof courseSchema>;
export type TCreateCourseData = z.infer<typeof createCourseSchema>;
