import { z } from 'zod';

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(32, 'Password must be at most 32 characters')
        .regex(
            /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,32}$/,
            'Password must contain at least one uppercase letter and one number'
        ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
