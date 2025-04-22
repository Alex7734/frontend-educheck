'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { SignInData, SignUpData, signUpSchema } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader/Loader';
import { FormType, useWeb2Login } from '@/app/unlock/hooks/useWeb2Login';
import { cn } from '@/helpers/style/cn';
import SignInForm from '@/components/SignInForm';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';
import { AxiosError } from 'axios';
import Link from 'next/link';

const AuthWeb2: React.FC = () => {
  const { signUpMutation, signInMutation } = useWeb2AuthService();
  const { shownForm, onSelectForm } = useWeb2Login();
  const router = useRouter();

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    setError: setSignUpError,
    formState: { errors: errorsSignUp, isLoading: isLoadingSignUp }
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmitSignUp = async (data: SignUpData) => {
    try {
      await signUpMutation.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        setSignUpError('root', {
          type: 'server',
          message: error.response?.data.message
        });
      } else {
        setSignUpError('root', {
          type: 'server',
          message: 'Sign up failed. Please try again.'
        });
      }
    }
  };

  if (isLoadingSignUp) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader />
      </div>
    );
  }

  const showSignIn = shownForm === FormType.SignIn;
  const showSignUp = shownForm === FormType.SignUp;

  return (
    <div className='auth-container'>
      <div className='flex flex-col items-center gap-4'>
        <button
          className={cn(
            'bg-blue-500 text-white w-60 px-4 py-2 rounded',
            showSignUp && 'hidden'
          )}
          onClick={() => onSelectForm(FormType.SignUp)}
        >
          Sign Up
        </button>
        <button
          className={cn(
            'bg-green-500 text-white w-60 px-4 py-2 rounded',
            showSignIn && 'hidden'
          )}
          onClick={() => onSelectForm(FormType.SignIn)}
        >
          Sign In
        </button>
      </div>

      {showSignUp && (
        <motion.div
          className='sign-up-form mt-4'
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h2 className='text-xl font-bold'>Sign Up</h2>
          <form
            onSubmit={handleSubmitSignUp(onSubmitSignUp)}
            className='flex flex-col gap-2'
          >
            <input
              {...registerSignUp('name')}
              placeholder='Name'
              className='border p-2'
            />
            {errorsSignUp.name && (
              <p className='text-red-500'>{errorsSignUp.name.message}</p>
            )}
            <input
              {...registerSignUp('email')}
              placeholder='Email'
              className='border p-2'
            />
            {errorsSignUp.email && (
              <p className='text-red-500'>{errorsSignUp.email.message}</p>
            )}
            <input
              {...registerSignUp('password')}
              type='password'
              placeholder='Password'
              className='border p-2'
            />
            {errorsSignUp.password && (
              <p className='text-red-500'>{errorsSignUp.password.message}</p>
            )}
            <input
              {...registerSignUp('age', { valueAsNumber: true })}
              type='number'
              placeholder='Age'
              required={false}
              defaultValue={18}
              className='border p-2'
            />
            {errorsSignUp.age && (
              <p className='text-red-500'>{errorsSignUp.age.message}</p>
            )}
            {errorsSignUp.root && (
              <p className='text-red-500'>{errorsSignUp.root.message}</p>
            )}
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Sign Up
            </button>
          </form>
        </motion.div>
      )}

      {showSignIn && (
        <SignInForm
          onSubmitMutation={async (data: SignInData) =>
            signInMutation.mutateAsync(data)
          }
          onSuccess={() => router.push('/dashboard')}
        />
      )}

      <div className='flex flex-col mt-4 items-center gap-4'>
        <Link className='text-blue-500 underline hover:text-blue-600' href='/forgot-password'>Forgot Password?</Link>
      </div>
    </div>
  );
};

export default AuthWeb2;
