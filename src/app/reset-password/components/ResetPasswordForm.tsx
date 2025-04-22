'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { useResetPassword } from '@/services/Queries/auth/useResetPasswordQueries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/reset-password.schema';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const { mutate: resetPassword, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token,
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPassword(data);
            router.push('/unlock');
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="password"
                        placeholder="New Password"
                        {...register('newPassword')}
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                    {isPending ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </form>
        </CardContent>
    );
}