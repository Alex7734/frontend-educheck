import { z } from 'zod';

// Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int(),
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
