import { TokenTransfer } from '@multiversx/sdk-core';
import { WALLET_PROVIDER_SEND_TRANSACTION_URL } from '@multiversx/sdk-dapp/constants';
import { getWindowLocation } from '@/utils/sdkDappUtils';

class TransactionUrlFactory {
  private walletAddress: string;
  private readonly baseUrl: string;
  private readonly origin: string;

  constructor(walletAddress: string) {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }
    this.walletAddress = walletAddress;
    this.baseUrl = `${walletAddress}/${WALLET_PROVIDER_SEND_TRANSACTION_URL}`;
    this.origin = getWindowLocation().origin;
  }

  static create(walletAddress: string) {
    return new TransactionUrlFactory(walletAddress);
  }

  buildTransactionParams(receiver: string, amount: string, data: string) {
    if (!receiver || !amount) {
      throw new Error('Receiver address and amount are required');
    }

    const value = TokenTransfer.egldFromAmount(amount).toString();
    const callbackUrl = encodeURIComponent(this?.origin);

    return {
      receiver,
      value,
      data,
      callbackUrl
    };
  }

  buildTransactionUrl(params: Record<string, string>) {
    if (!params.receiver || !params.value) {
      throw new Error('Receiver address and value are required in parameters');
    }

    const search = new URLSearchParams(params).toString();
    return `${this.baseUrl}?${search}`;
  }
}

export default TransactionUrlFactory;