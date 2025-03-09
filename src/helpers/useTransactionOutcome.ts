import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * Observer Hook: Observes changes in search parameters and reacts accordingly.
 */
export const useTransactionOutcome = () => {
  const searchParams = useSearchParams(); // Observable Subject
  const router = useRouter();

  const [txData, setTxData] = useState({
    status: searchParams.get('status'),
    txHash: searchParams.get('txHash'),
    address: searchParams.get('address'),
  });

  useEffect(() => {
    // Observer: Reacts to changes in the observable state (searchParams)
    if (txData.status && txData.address) {
      console.log('Transaction Complete:', txData);
      router.replace('/'); // Redirect after transaction completion
    }
  }, [searchParams, txData, router]);

  useEffect(() => {
    // Update txData whenever searchParams change
    setTxData({
      status: searchParams.get('status'),
      txHash: searchParams.get('txHash'),
      address: searchParams.get('address'),
    });
  }, [searchParams]);

  return txData;
};
