import { z } from 'zod';

// Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]*$/, {
      message: 'Name can only contain letters and spaces'
    }),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' }),
  age: z
    .union([
      z.number().int().min(13, 'You must be at least 13 years old'),
      z.null()
    ])
    .refine((value) => value === null || !isNaN(value), {
      message: 'Age must be a valid number or null'
    })
    .transform((value) => (value === null || isNaN(value) ? null : value)),
  hasWeb3Access: z.boolean().optional()
});

export const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string({ required_error: 'Password is required' }),
  age: z.number().nullable().optional()
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  age: z.number().nullable().optional()
});

// Infer types
export type TUser = z.infer<typeof userSchema>;
export type TCreateUser = z.infer<typeof createUserSchema>;
export type TUpdateUser = z.infer<typeof updateUserSchema>;
