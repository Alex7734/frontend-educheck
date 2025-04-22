'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading...</p>
            </motion.div>
        </div>
    );
}; 