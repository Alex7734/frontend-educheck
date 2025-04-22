'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { signInSchema, SignInData, TTokens } from '@/schemas/auth';
import { Loader } from '../sdkDappComponents';
import { AxiosError } from 'axios';
import { ApiStatus } from '@/localConstants/apiStatus';

interface SignInFormProps {
  onSuccess: () => void;
  onSubmitMutation: (data: SignInData) => Promise<TTokens>;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onSubmitMutation
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading }
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (data: SignInData) => {
    try {
      await onSubmitMutation(data);
      onSuccess();
    } catch (error) {
      const isAxiosErrorWithValidMessage =
        error instanceof AxiosError &&
        error?.message &&
        error?.status !== ApiStatus.UNAUTHORIZED;

      if (isAxiosErrorWithValidMessage) {
        setError('root', {
          type: 'server',
          message: error.message
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Sign in failed. Please try again.'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className='sign-in-form mt-4'
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h2 className='text-xl font-bold'>Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <input
          {...register('email')}
          placeholder='Email'
          className='border p-2'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
        <input
          {...register('password')}
          type='password'
          placeholder='Password'
          className='border p-2'
        />
        {errors.password && (
          <p className='text-red-500'>{errors.password.message}</p>
        )}
        <button
          type='submit'
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Sign In
        </button>
      </form>
      {errors.root && (
        <p className='text-red-500 mt-2'>{errors.root.message}</p>
      )}
    </motion.div>
  );
};

export default SignInForm;
