import HeaderLogo from '@/app/unlock/components/HeaderLogo';
import React from 'react';
import AdminSignIn from './components/AdminSignIn';

export default function UnlockAdminPage() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <HeaderLogo />
      <div
        className='flex flex-col p-8 rounded-lg items-center justify-center gap-4 bg-[#f6f8fa]'
        data-testid='unlockPageAdmin'
      >
        <div className='flex flex-col items-center gap-1'>
          <h2 className='text-2xl'>Admin Login</h2>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4'>
            <AdminSignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
