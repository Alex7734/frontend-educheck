'use client';
import { PropsWithChildren } from 'react';
import { AuthenticatedRoutesWrapper } from '@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper/AuthenticatedRoutesWrapper';
import { RouteNamesEnum } from '@/localConstants';
import { routes } from '@/routes';
import { Header } from '@/components/Layout/Header';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex min-h-screen flex-row bg-slate-200'>
      <Header />
      <main
        className={'flex flex-grow items-stretch bg-[#E2F4EF] justify-center'}
      >
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${RouteNamesEnum.unlock}`}
        >
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
    </div>
  );
};
