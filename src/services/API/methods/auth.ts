import type {
  SignInData,
  SignOutData,
  SignUpData,
  TTokens
} from '@/schemas/auth';
import API from '..';
import { TResponseAuth } from '@/types/API/auth';
import { ADMIN_SECRET } from '@/config';
import LocalStorage from '@/services/LocalStorage';
import { ForgotPasswordFormData, ResetPasswordFormData } from '@/schemas/reset-password.schema';

export const signUp = async (data: SignUpData): Promise<TResponseAuth> => {
  try {
    const response = await API.post('/auth/sign-up', data);
    return response.data;
  } catch (error) {
    console.error('signUp error:', error);
    throw error;
  }
};

export const signIn = async (data: SignInData): Promise<TResponseAuth> => {
  try {
    const response = await API.post('/auth/sign-in', data);
    return response.data;
  } catch (error) {
    console.error('signIn error:', error);
    throw error;
  }
};

export const signInAdmin = async (data: SignInData): Promise<TResponseAuth> => {
  try {
    const response = await API.post('/auth/sign-in/admin', data);
    return response.data;
  } catch (error) {
    console.error('signInAdmin error:', error);
    throw error;
  }
};

export const signOut = async (data: SignOutData): Promise<void> => {
  try {
    await API.post('/auth/sign-out', data);
  } catch (error) {
    console.error('signOut error:', error);
    LocalStorage.removeItem('tokens');
    LocalStorage.removeItem('user');
    throw error;
  }
};

export const refreshToken = async (data: SignOutData): Promise<TTokens> => {
  try {
    const response = await API.post('/auth/refresh-token', data);
    return response.data;
  } catch (error) {
    console.error('refreshToken error:', error);
    throw error;
  }
};

export const isAdminValid = async (id: string): Promise<boolean> => {
  try {
    const response = await API.get(`/admin/${id}?secret=${ADMIN_SECRET}`);
    console.log('isAdminValid response:', response);
    return response.data.id === id;
  } catch (error) {
    console.error('isAdminValid error:', error);
    return false;
  }
};

export const forgotPassword = async (data: ForgotPasswordFormData): Promise<void> => {
  try {
    await API.post('/auth/password-reset/request', data);
  } catch (error) {
    console.error('forgotPassword error:', error);
    throw error;
  }
};


export const resetPassword = async (data: ResetPasswordFormData): Promise<void> => {
  try {
    await API.post('/auth/password-reset/reset', data);
  } catch (error) {
    console.error('resetPassword error:', error);
    throw error;
  }
};