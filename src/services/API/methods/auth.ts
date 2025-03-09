import type {
  SignInData,
  SignOutData,
  SignUpData,
  TTokens
} from '@/schemas/auth';
import API from '..';
import { TResponseAuth } from '@/types/API/auth';

export const signUp = async (data: SignUpData): Promise<TResponseAuth> => {
  const response = await API.post('/auth/sign-up', data);
  return response.data;
};

export const signIn = async (data: SignInData): Promise<TResponseAuth> => {
  const response = await API.post('/auth/sign-in', data);
  return response.data;
};

export const signInAdmin = async (data: SignInData): Promise<TResponseAuth> => {
  const response = await API.post('/auth/sign-in/admin', data);
  return response.data;
};

export const signOut = async (data: SignOutData): Promise<void> => {
  await API.post('/auth/sign-out', data);
};

export const refreshToken = async (data: SignOutData): Promise<TTokens> => {
  const response = await API.post('/auth/refresh-token', data);
  return response.data;
};
