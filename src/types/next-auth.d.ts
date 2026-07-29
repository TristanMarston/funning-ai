import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            hasOnboarded: boolean;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        hasOnboarded: boolean;
    }
}

declare module 'next-auth/adapters' {
    interface AdapterUser {
        hasOnboarded?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        hasOnboarded?: boolean;
    }
}
