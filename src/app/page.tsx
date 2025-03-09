'use client';
import { AuthRedirectWrapper, PageWrapper } from '@/wrappers';
import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { CypressEnums } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuttleSpace } from '@fortawesome/free-solid-svg-icons';
import LoadingLayout from '@/components/Layout/LoadingLayout';

export default function Home({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  useEffect(() => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      router.replace('/');
    }
  }, [router, searchParams]);

  const onUnlockRedirect = () => {
    router.push('/unlock');
  };

  return (
    <Suspense fallback={<LoadingLayout />}>
      <AuthRedirectWrapper requireAuth={false}>
        <PageWrapper>
          <div className='flex flex-col-reverse sm:flex-row items-center h-full w-full'>
            <div className='flex items-start sm:items-center h-full sm:w-1/2 sm:bg-center'>
              <div className='flex flex-col gap-4 max-w-[90sch] text-center sm:text-left text-xl font-medium md:text-2xl lg:text-3xl'>
                <div>
                  <h1 className={'font-semibold text-[3rem]'}>
                    Learn. Verify. Advance.
                  </h1>
                  <p className='text-gray-400 text-[1.5rem] pt-4'>
                    Empowering Your Career on the{' '}
                    <a
                      href='https://multiversx.com/'
                      target='_blank'
                      className='text-gray-400 underline decoration-dotted hover:decoration-solid'
                    >
                      MultiversX
                    </a>{' '}
                    blockchain.
                  </p>
                </div>
                <div className={'max-w-24'}>
                  <Button
                    onClick={onUnlockRedirect}
                    data-testid='btnPingService'
                    data-cy={CypressEnums.transactionBtn}
                  >
                    <FontAwesomeIcon icon={faShuttleSpace} className='mr-1' />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            <div className="h-4/6 bg-[url('/assets/img/multiversx-white.svg')] bg-contain bg-center bg-no-repeat w-1/2" />
          </div>
        </PageWrapper>
      </AuthRedirectWrapper>
    </Suspense>
  );
}
