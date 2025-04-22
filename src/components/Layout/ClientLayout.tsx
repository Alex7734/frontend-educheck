'use client';

import React from 'react';
import { LoadingProvider } from '@/wrappers/LoadingProvider';
import { Toaster } from 'react-hot-toast';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <LoadingProvider>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        minWidth: '200px',
                    },
                }}
            />
        </LoadingProvider>
    );
}; 