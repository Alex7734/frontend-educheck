import { TUser } from '@/schemas/user';
import {
  AccountInfoSliceNetworkType,
  AccountType
} from '@multiversx/sdk-dapp/types';

type TWeb3User = AccountType & { address: string } & {
  network: AccountInfoSliceNetworkType;
};

export interface TCrossUser {
  userWeb2: TUser | null;
  userWeb3: TWeb3User | null;
  type: 'web2' | 'web3';
}
