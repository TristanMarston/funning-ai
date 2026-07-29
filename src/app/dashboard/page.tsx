'use client';

import { SessionProvider } from 'next-auth/react';
import Dashboard from './Dashboard';

const page = () => {
    return (
        <div>
            <SessionProvider>
                <Dashboard />
            </SessionProvider>
        </div>
    );
};

export default page;
