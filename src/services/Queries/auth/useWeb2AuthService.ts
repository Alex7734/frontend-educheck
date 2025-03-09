import {
  UseMutationResult,
  useMutation,
  useQueryClient,
  useQuery
} from '@tanstack/react-query';
import { signIn, signUp, signOut, signInAdmin, isAdminValid } from '@/api/auth';
import useAuthStore from '@/store/useAuthStore';
import { SignInData, SignUpData } from '@/schemas/auth';
import { TResponseAuth } from '@/types/API/auth';
import { TUser } from '@/schemas/user';
import { ONE_MINUTE_MS } from '@/localConstants/duration';

interface IUseWeb2AuthService {
  signUpMutation: UseMutationResult<TResponseAuth, Error, SignUpData, unknown>;
  signInMutation: UseMutationResult<TResponseAuth, Error, SignInData, unknown>;
  signOutMutation: UseMutationResult<void, Error, void, unknown>;
  isAdminValid: boolean;
}

interface IUseWeb2AuthServiceOptions {
  isAdminService?: boolean;
}

const useWeb2AuthService = (
  options?: IUseWeb2AuthServiceOptions
): IUseWeb2AuthService => {
  const queryClient = useQueryClient();
  const isAdminService = options?.isAdminService || false;
  const { setUser, setToken, getRefreshToken } = useAuthStore();

  const user = useAuthStore((state) => state.user);

  const handleSuccess = (response: TResponseAuth) => {
    const newUserData: TUser = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      age: response.user.age
    };

    if (isAdminService) {
      newUserData.hasWeb3Access = response.user.hasWeb3Access;
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

        // Only normal users should be able to sign up
        await queryClient.invalidateQueries({
          queryKey: ['isAdminValid', response.user.id]
        });

        queryClient.setQueryData(['isAdminValid', response.user.id], false);
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
        handleSuccess(response);
        // Invalidate isAdminValid query on new sign in
        await queryClient.invalidateQueries({
          queryKey: ['isAdminValid', response.user.id]
        });

        // Set isAdminValid to true on new sign in admin
        if (isAdminService) {
          queryClient.setQueryData(['isAdminValid', response.user.id], true);
        }
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
      setUser(null);
      setToken(null);
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error('Sign out failed:', error);
      return error;
    }
  });

  const isAdminValidQuery = useQuery<boolean, Error>({
    queryKey: ['isAdminValid', user?.id],
    queryFn: () => isAdminValid(user!.id),
    enabled: !!user?.id,
    initialData: false,
    refetchInterval: ONE_MINUTE_MS,
    staleTime: ONE_MINUTE_MS
  });

  return {
    signUpMutation,
    signInMutation,
    signOutMutation,
    isAdminValid: isAdminValidQuery.data || false
  };
};

export default useWeb2AuthService;
