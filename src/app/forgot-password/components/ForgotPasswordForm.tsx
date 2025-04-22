'use client';

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/reset-password.schema";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/services/Queries/auth/useResetPasswordQueries";
import Link from "next/link";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const { mutate: forgotPassword, isPending } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword(data);

            if (isSubmitSuccessful) {
                router.push('/unlock');
            }
        } catch (error) {
            console.error('Forgot password failed:', error);
        }
    };

    return (
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="email"
                        placeholder="Email"
                        required
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="text-center">
                    <Link
                        href="/unlock"
                        className="text-sm text-blue-500 hover:underline cursor-pointer"
                    >
                        Back to Unlock
                    </Link>
                </div>
            </form>
        </CardContent>
    );
}