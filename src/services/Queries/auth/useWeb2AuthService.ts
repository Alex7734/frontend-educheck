import {
  UseMutationResult,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { signIn, signUp, signOut, signInAdmin } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import { SignInData, SignUpData } from '@/schemas/auth';
import { TResponseAuth } from '@/types/API/auth';
import { TUser } from '@/schemas/user';
import { useRouter } from 'next/navigation';
import { RouteNamesEnum } from '@/localConstants';
import LocalStorage from '@/services/LocalStorage';

interface IUseWeb2AuthService {
  signUpMutation: UseMutationResult<TResponseAuth, Error, SignUpData, unknown>;
  signInMutation: UseMutationResult<TResponseAuth, Error, SignInData, unknown>;
  signOutMutation: UseMutationResult<void, Error, void, unknown>;
  isAdminValid: boolean;
}

interface IUseWeb2AuthServiceOptions {
  isAdminService?: boolean;
}

const ADMIN_FLAG_KEY = 'isAdmin';

const useWeb2AuthService = (
  options?: IUseWeb2AuthServiceOptions
): IUseWeb2AuthService => {
  const queryClient = useQueryClient();
  const isAdminService = options?.isAdminService || false;
  const { setUser, setToken, getRefreshToken } = useAuthStore();
  const router = useRouter();
  const handleSuccess = (response: TResponseAuth, isAdmin: boolean = false) => {
    const newUserData: TUser = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      age: response.user.age
    };

    if (isAdmin) {
      LocalStorage.setItem(ADMIN_FLAG_KEY, 'true');
      newUserData.hasWeb3Access = true;
    }

    setUser(newUserData);
    setToken({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken
    });
  };

  const signUpMutation = useMutation<TResponseAuth, Error, SignUpData, unknown>(
    {
      mutationFn: async (data: SignUpData) => signUp(data),
      onSuccess: async (response: TResponseAuth) => {
        handleSuccess(response);
        router.push(RouteNamesEnum.dashboard);
      },
      onError: (error: Error) => {
        console.error('Sign up failed:', error);
      }
    }
  );

  const signInMutation = useMutation<TResponseAuth, Error, SignInData, unknown>(
    {
      mutationFn: async (data: SignInData) =>
        isAdminService ? signInAdmin(data) : signIn(data),
      onSuccess: async (response: TResponseAuth) => {
        handleSuccess(response, isAdminService);
      },
      onError: (error: unknown) => {
        console.error('Sign in failed:', error);
        return error;
      }
    }
  );

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      await signOut({ refreshToken });
    },
    onSuccess: () => {
      LocalStorage.removeItem(ADMIN_FLAG_KEY);
      setUser(null);
      setToken(null);
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error('Sign out failed:', error);
      router.replace(RouteNamesEnum.home);
      return error;
    }
  });

  return {
    signUpMutation,
    signInMutation,
    signOutMutation,
    isAdminValid: LocalStorage.getItem(ADMIN_FLAG_KEY) === 'true' 
  };
};

export default useWeb2AuthService;
