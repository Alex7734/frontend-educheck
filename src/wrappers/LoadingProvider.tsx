'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { PageLoader } from '@/components/Loaders/PageLoader';

interface LoadingContextType {
    setLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    return (
        <LoadingContext.Provider value={{ setLoading }}>
            {children}
            {isLoading && <PageLoader />}
        </LoadingContext.Provider>
    );
}; 