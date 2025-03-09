'use client';
import SignInForm from '@/components/SignInForm';
import { SignInData } from '@/schemas/auth';
import React, { Suspense } from 'react';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';
import { useRouter } from 'next/navigation';
import LoadingLayout from '@/components/Layout/LoadingLayout';

const AdminSignIn = () => {
  const { signInMutation } = useWeb2AuthService({
    isAdminService: true
  });
  const router = useRouter();

  return (
    <Suspense fallback={<LoadingLayout />}>
      <div className='flex flex-col gap-4'>
        <SignInForm
          onSubmitMutation={async (data: SignInData) =>
            signInMutation.mutateAsync(data)
          }
          onSuccess={() => router.push('/dashboard')}
        />
      </div>
    </Suspense>
  );
};

export default AdminSignIn;
