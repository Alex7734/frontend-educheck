'use client';
import { useScrollToElement } from '@/hooks';
import useWeb2AuthService from '@/services/Queries/auth/useWeb2AuthService';

// In order to not make dashboard client side create a client component which uses client hooks
export const ClientHooks = () => {
  useScrollToElement();

  return null;
};
