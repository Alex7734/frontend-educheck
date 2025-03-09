import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn, signUp, signOut } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import { SignInData, SignUpData, TTokens } from '@/schemas/auth';
import LocalStorage from '@/services/LocalStorage';
import { TResponseAuth } from '@/types/API/auth';

const useWeb2AuthService = () => {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  const handleSuccess = (response: TResponseAuth) => {
    setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      age: response.user.age,
      // Admin property only
      hasWeb3Access: response.user.hasWeb3Access
        ? response.user.hasWeb3Access
        : undefined
    });
    setToken({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    });
  };

  const signUpMutation = useMutation<TResponseAuth, Error, SignUpData, unknown>(
    {
      mutationFn: async (data: SignUpData) => {
        return await signUp(data);
      },
      onSuccess: (response: TResponseAuth) => {
        handleSuccess(response);
      },
      onError: (error: Error) => {
        console.error('Sign up failed:', error);
      }
    }
  );

  const signInMutation = useMutation<TResponseAuth, Error, SignInData, unknown>(
    {
      mutationFn: async (data: SignInData) => {
        return await signIn(data);
      },
      onSuccess: (response: TResponseAuth) => {
        handleSuccess(response);
      },
      onError: (error: unknown) => {
        console.error('Sign in failed:', error);
      }
    }
  );

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const tokens = LocalStorage.getItem<TTokens>('tokens');
      if (!tokens || !tokens.refreshToken) {
        throw new Error('No refresh token found');
      }
      await signOut({ refreshToken: tokens.refreshToken });
    },
    onSuccess: () => {
      setUser(null);
      setToken(null);
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error('Sign out failed:', error);
    }
  });

  return {
    signUpMutation,
    signInMutation,
    signOutMutation
  };
};

export default useWeb2AuthService;
