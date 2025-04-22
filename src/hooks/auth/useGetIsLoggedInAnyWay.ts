import useAuthStore from '@/store/useAuthStore';
import { useGetIsLoggedIn } from '@/hooks/sdkDappHooks';

const useGetIsLoggedInAnyWay = (): boolean => {
  const isLoggedInWeb3: boolean = useGetIsLoggedIn();
  const isUserAuthenticated = useAuthStore().isAuthenticated();

  return isLoggedInWeb3 || isUserAuthenticated;
};

export default useGetIsLoggedInAnyWay;
