'use client';
import React from 'react';
import { RouteNamesEnum } from '@/localConstants';
import type {
  WebWalletLoginButtonPropsType,
  WalletConnectLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  WalletConnectLoginButton,
  WebWalletLoginButton as WebWalletUrlLoginButton,
  CrossWindowLoginButton
} from '@/components';
import { nativeAuth } from '@/config';
import { AuthRedirectWrapper } from '@/wrappers';
import { useRouter } from 'next/navigation';
import AuthWeb2 from './components/AuthWeb2';
import HeaderLogo from './components/HeaderLogo';

type CommonWeb3PropsType =
  | WebWalletLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

// choose how you want to configure connecting to the web wallet
const USE_WEB_WALLET_CROSS_WINDOW = true;

const WebWalletLoginButton = USE_WEB_WALLET_CROSS_WINDOW
  ? CrossWindowLoginButton
  : WebWalletUrlLoginButton;

export default function Unlock() {
  const router = useRouter();

  const commonProps: CommonWeb3PropsType = {
    callbackRoute: RouteNamesEnum.dashboard,
    nativeAuth,
    onLoginRedirect: () => {
      router.push(RouteNamesEnum.dashboard);
    }
  };

  return (
    <AuthRedirectWrapper requireAuth={false}>
      <div className='flex flex-col justify-center items-center'>
        <HeaderLogo />
        <div
          className='flex flex-col p-8 rounded-lg items-center justify-center gap-4 bg-[#f6f8fa]'
          data-testid='unlockPage'
        >
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-2xl'>Login</h2>

            <p className='text-center text-gray-400'>
              Choose a web2 a login method
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
              <AuthWeb2 />
            </div>

            <div className='flex flex-col gap-4'>
              <div className='w-full h-0.5 bg-gray-200' />
              <p className={'text-gray-400 text-center'}>
                Dive into the MultiversX ecosystem
              </p>
              <WalletConnectLoginButton
                loginButtonText='xPortal App'
                {...commonProps}
              />
              <WebWalletLoginButton
                loginButtonText='Web3 mvx Wallet'
                data-testid='webWalletLoginBtn'
                {...commonProps}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthRedirectWrapper>
  );
}
