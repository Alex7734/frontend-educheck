import { z } from 'zod';

// Schemas
export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const signUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .regex(/[a-zA-Z0-9]/, 'Password must contain only letters and numbers'),
  age: z.number().min(18, 'You must be at least 18 years old')
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .regex(/[a-zA-Z0-9]/, 'Password must contain only letters and numbers')
});

export const signOutSchema = z.object({
  refreshToken: z.string()
});

// Infer types
export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type SignOutData = z.infer<typeof signOutSchema>;
export type TTokens = z.infer<typeof tokensSchema>;
