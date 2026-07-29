'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard = () => {
    const router = useRouter();
    const {
        data: session,
        status,
        update,
    } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/start?mode=signin');
        },
    });

    useEffect(() => {
        if (status === 'authenticated' && session && session?.user.hasOnboarded === false) {
            router.push('/start?onboarding=true');
        }
    }, [status, session, router]);

    return (
        <>
            <div>{session?.user?.name}</div>
            <div>{status}</div>
            <button onClick={() => signOut({ callbackUrl: '/start?mode=signin' })}>Log Out</button>
        </>
    );
};

export default Dashboard;
