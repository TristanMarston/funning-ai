import { generateUniquePublicID } from '@/app/actions/generate-public-id';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const prismaAdapter = PrismaAdapter(prisma);

export const authOptions: AuthOptions = {
    adapter: {
        ...prismaAdapter,
        async getUserByEmail(email) {
            const user = await prisma.user.findFirst({
                where: { email: email.trim().toLowerCase() },
                orderBy: { createdAt: 'asc' },
            });

            return user ? { ...user, email: user.email ?? email } : null;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'select_account',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('missing_fields');
                }

                const email = credentials.email.trim().toLowerCase();
                const users = await prisma.user.findMany({
                    where: { email },
                    orderBy: { createdAt: 'asc' },
                });

                if (users.length === 0) throw new Error('no_user');

                const matchedUsers: any[] = [];
                for (const candidate of users) {
                    if (!candidate.password) continue;
                    const isValid = await compare(credentials.password, candidate.password);
                    if (isValid) matchedUsers.push(candidate);
                }

                if (matchedUsers.length === 0) {
                    throw new Error('wrong_password');
                } else if (matchedUsers.length > 1) {
                    throw new Error('multiple_users');
                }

                const user = matchedUsers[0];

                if (!user.password) throw new Error('no_password_set');

                return user;
            },
        }),
    ],
    events: {
        async signIn({ user }) {
            if (user.email) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: user.id },
                        select: {
                            id: true,
                            name: true,
                            publicId: true,
                            email: true,
                            hasOnboarded: true,
                            planData: true,
                        },
                    });

                    if (dbUser && !dbUser.publicId) {
                        const newID = await generateUniquePublicID(dbUser.name, dbUser.email);

                        await prisma.user.update({
                            where: { id: user.id },
                            data: { publicId: newID },
                        });
                    }

                    if (dbUser && !dbUser.planData) {
                        await prisma.planData.create({
                            data: {
                                user: {
                                    connect: { id: dbUser.id },
                                },
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error generating public ID:', error);
                }
            }
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                if (account.refresh_token && user.email) {
                    try {
                        const existingAccount = await prisma.account.findFirst({
                            where: {
                                provider: 'google',
                                user: { email: user.email },
                            },
                        });

                        if (existingAccount && !existingAccount.refresh_token) {
                            await prisma.account.update({
                                where: { id: existingAccount.id },
                                data: { refresh_token: account.refresh_token },
                            });
                        }
                    } catch (err) {
                        console.error('Error updating refresh token:', err);
                    }
                }

                try {
                    const cookieStore = await cookies();
                    const intent = cookieStore.get('auth_intent')?.value;

                    if (intent === 'signin') {
                        const existingUser = await prisma.user.findUnique({
                            where: { id: user.id },
                        });

                        if (!existingUser) {
                            return '/start?mode=signup&error=AccountNotFound';
                        }
                    }
                } catch (error) {
                    console.error('Error during google sign-in check:', error);
                }
            }

            return true;
        },
        async jwt({ token, trigger, user, session, account }) {
            if (trigger === 'update' && session) {
                if (session.name && session.name.length > 0) token.name = session.name;
                if (session.email && session.email.length > 0) token.email = session.email;
                if (session.image && session.image.length > 0) token.image = session.image;
                if (session.hasOnboarded !== undefined) token.hasOnboarded = session.hasOnboarded;
            }
            if (user) {
                token.sub = user.id;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.hasOnboarded = user.hasOnboarded;

                if (account?.provider === 'google') {
                    try {
                        if (user.email) {
                            const updateData: any = {};
                        }
                    } catch (error) {
                        console.error('Error setting role during OAuth sign-in:', error);
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user && token) {
                (session.user as any).id = token.sub as string;
                (session.user as any).image = token.image;
                (session.user as any).hasOnboarded = token.hasOnboarded;
            }
            return session;
        },
    },
    pages: {
        signIn: '/start',
    },
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
};

export const nextAuthHandler = NextAuth(authOptions);
