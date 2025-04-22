import { z } from 'zod';

// Schemas
export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const signUpSchema = z.object({
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
  password: z
    .string()
    .nonempty('Password must not be empty')
    .regex(/[a-zA-Z0-9]/, 'Password must contain only letters and numbers'),
  age: z
    .union([z.number().min(13, 'You must be at least 13 years old'), z.null()])
    .refine((value) => value === null || !isNaN(value), {
      message: 'Age must be a valid number or null'
    })
    .transform((value) => (value === null || isNaN(value) ? null : value))
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .nonempty('Password must not be empty')
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
