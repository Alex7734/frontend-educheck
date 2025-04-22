import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { forgotPassword, resetPassword } from '@/services/API/methods/auth';

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success('Password reset successfully');
        },
        onError: (error) => {
            toast.error('Password reset failed');
            console.error('Password reset failed:', error);
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast.success('Password reset link sent');
        },
        onError: (error) => {
            toast.error('Password reset link failed');
            console.error('Password reset link failed:', error);
        },
    });
};
