import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { cache } from 'react';

export const auth = cache(async () => {
    return await getServerSession(authOptions);
});
