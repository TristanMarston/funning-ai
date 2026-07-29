'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import StartPage from './StartPage';

const page = () => {
    return (
        <>
            <Toaster
                toastOptions={{
                    success: {
                        iconTheme: {
                            primary: '#69a190',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
            <Suspense fallback={<></>}>
                <SessionProvider>
                    <StartPage />
                </SessionProvider>
            </Suspense>
        </>
    );
};

export default page;