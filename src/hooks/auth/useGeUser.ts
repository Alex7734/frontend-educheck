import useAuthStore from '@/store/useAuthStore';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { TCrossUser } from '@/types/User/crossUser';
import { useGetNetworkConfig } from '@/hooks';

const useGeUser = (): TCrossUser | null => {
  const userWeb2 = useAuthStore().getUser();
  const { address, account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();

  if (userWeb2 && userWeb2.id) {
    return {
      userWeb2,
      userWeb3: null,
      type: 'web2'
    };
  }

  if (address && account) {
    return {
      userWeb2: null,
      userWeb3: { ...account, address, network },
      type: 'web3'
    };
  }

  return null;
};

export default useGeUser;
