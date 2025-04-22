'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import {
  TransactionsToastList,
  NotificationModal,
  SignTransactionsModals,
  DappProvider
  // uncomment this to use the custom transaction tracker
  // TransactionsTracker
} from '@/components';
import {
  apiTimeout,
  walletConnectV2ProjectId,
  environment,
  sampleAuthenticatedDomains
} from '@/config';
import { AxiosInterceptorContext } from '@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext';
import { RouteNamesEnum } from '@/localConstants';
import { ModalProvider } from '@/wrappers/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BatchTransactionsContextProvider } from '@/wrappers/ModalProvider/BatchTransactionsContextProvider';

const AppContent = ({ children }: PropsWithChildren) => {
  return (
    <DappProvider
      environment={environment}
      customNetworkConfig={{
        name: 'customConfig',
        apiTimeout,
        walletConnectV2ProjectId
      }}
      dappConfig={{
        isSSR: true,
        shouldUseWebViewProvider: true,
        logoutRoute: RouteNamesEnum.unlock
      }}
      customComponents={{
        transactionTracker: {
          // uncomment this to use the custom transaction tracker
          // component: TransactionsTracker,
          props: {
            onSuccess: (sessionId: string) => {
              console.log(`Session ${sessionId} successfully completed`);
            },
            onFail: (sessionId: string, errorMessage: string) => {
              console.log(`Session ${sessionId} failed. ${errorMessage ?? ''}`);
            }
          }
        }
      }}
    >
      <AxiosInterceptorContext.Listener>
        <TransactionsToastList />
        <NotificationModal />
        <Toaster position='top-right' gutter={8} />
        <SignTransactionsModals />
        {children}
      </AxiosInterceptorContext.Listener>
    </DappProvider>
  );
};

const queryClient = new QueryClient();

export default function App({ children }: { children: ReactNode }) {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor
        authenticatedDomains={sampleAuthenticatedDomains}
      >
        <BatchTransactionsContextProvider>
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <AppContent>{children}</AppContent>
            </ModalProvider>
          </QueryClientProvider>
        </BatchTransactionsContextProvider>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
}
