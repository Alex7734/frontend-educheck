'use client';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { useGetIsLoggedIn } from '@/hooks';
import { RouteNamesEnum } from '@/localConstants';
import { redirect } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

interface AuthRedirectWrapperPropsType extends PropsWithChildren {
  requireAuth?: boolean;
}

export const AuthRedirectWrapper = ({
  children,
  requireAuth = true
}: AuthRedirectWrapperPropsType) => {
  const isLoggedIn = useGetIsLoggedIn(); // Web3 auth
  const isUserAuthenticated = useAuthStore().isAuthenticated(); //  Web2 auth

  const loggedIn = isLoggedIn || isUserAuthenticated;

  useEffect(() => {
    if (loggedIn && !requireAuth) {
      redirect(RouteNamesEnum.dashboard);
    }

    if (!loggedIn && requireAuth) {
      redirect(RouteNamesEnum.unlock);
    }
  }, [loggedIn, requireAuth]);

  return <>{children}</>;
};
