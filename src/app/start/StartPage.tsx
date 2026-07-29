'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession, type ClientSafeProvider } from 'next-auth/react';
import { Loader2, LockKeyhole, Mail, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { scrollVariants } from '../context';
import OnboardingWindow from './OnboardingWindow';

type StartFormData = {
    name: string;
    email: string;
    password: string;
};

type StartMode = 'signin' | 'signup';

const StartPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const passedMode = searchParams.get('mode');
    const initialMode: StartMode = passedMode === 'signin' || passedMode === 'signup' ? passedMode : 'signup';
    const [mode, setMode] = useState<StartMode>(initialMode);
    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
    const [formData, setFormData] = useState<StartFormData>({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const showOnboarding = status === 'authenticated' && session?.user.hasOnboarded === false;

    useEffect(() => {
        if (status === 'authenticated' && session) {
            if (session?.user.hasOnboarded === true) {
                router.push('/dashboard');
            }
        }

        const error = searchParams.get('error');
        if (error === 'AccountNotFound') {
            setErrorMessage('Account not found. Please try again.');
        }
    }, [session, status, searchParams, router]);

    useEffect(() => {
        const nextMode = passedMode === 'signin' || passedMode === 'signup' ? passedMode : 'signup';
        setMode(nextMode);
    }, [passedMode]);

    useEffect(() => {
        if (status === 'authenticated') return;
        router.replace(`/start?mode=${mode}`, { scroll: false });
    }, [mode, router, status]);

    useEffect(() => {
        const loadProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };

        loadProviders();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const switchMode = (nextMode: StartMode) => {
        setErrorMessage('');
        setMode(nextMode);
    };

    const handleOAuthSignIn = (providerId: 'google' | 'apple') => {
        document.cookie = `auth_intent=${mode}; path=/; max-age=300`;

        signIn(providerId, { callbackUrl: '/start?onboarding=true' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const { email: rawEmail, password, name } = formData;
            const email = rawEmail.trim().toLowerCase();

            if (mode === 'signup') {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    let message = 'Signup failed, please try again.';
                    if (data.error === 'email_required') message = 'Please input an email address.';
                    if (data.error === 'password_required') message = 'Please input a password.';
                    if (data.error === 'name_required') message = 'Please enter first and last name.';
                    if (data.error === 'email_invalid') message = 'Please enter a valid email address.';
                    if (data.error === 'existing_user') message = 'Account already exists! Please sign in.';

                    setErrorMessage(message);
                    return;
                }
            }

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                let message = 'Something went wrong. Please try again.';
                if (result.error === 'wrong_password') message = 'Incorrect password.';
                if (result.error === 'no_user') message = 'No user found with that email.';
                if (result.error === 'no_password_set') message = 'This email only has a Google account.';
                setErrorMessage(message);
                return;
            }

            setErrorMessage('');
            router.push('/start?onboarding=true');
        } catch (err: any) {
            console.error(err);
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // relative min-h-full overflow-hidden bg-gradient-to-br from-primary-100 via-white to-secondary-200
    // shadow-[0_28px_90px_rgba(52,17,0,0.18)]
    // 236, 106, 6

    // grid w-full h-full overflow-hidden lg:min-h-[720px] lg:grid-cols-[minmax(430px,0.86fr)_1.14fr] px-8 py-8
    // relative z-10 grid h-full place-items-center gap-16 overflow-hidden

    // grid w-full h-full overflow-hidden grid-cols-[minmax(430px,0.86fr)_1.14fr] p-8 gap-16 place-items-center z-10 relative

    return (
        <div className='relative h-dvh overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 font-figtree text-gray-900'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(236,106,6,0.26),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(104,0,180,0.28),transparent_34%)]' />
            <div className='absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(44,0,81,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(44,0,81,0.18)_1px,transparent_1px)] [background-size:38px_38px]' />

            <main className='relative z-10 grid h-full place-items-center gap-16 overflow-hidden'>
                {showOnboarding ? (
                    <OnboardingWindow />
                ) : (
                    <section className='grid w-full h-fit 5xl:h-full overflow-hidden items-center grid-cols-1 5xl:grid-cols-[1.25fr_2fr] 6xl:grid-cols-[2.75fr_4fr] px-6 py-6 min-[390px]:px-8 min-[390px]:py-8'>
                        <motion.div
                            variants={scrollVariants(0)}
                            initial='hidden'
                            animate='visible'
                            className='@container/start-window relative h-full max-h-[90dvh] 5xl:h-full overflow-y-auto hide-scrollbar shadow-[0_20px_50px_rgba(155,65,240,0.15)] 5xl:shadow-[0_20px_50px_rgba(236,106,6,_0.3)] rounded-[28px] flex flex-col justify-between bg-gradient-to-br from-white via-primary-50/80 to-white min-h-0 px-8 py-7 min-[440px]:px-10 min-[440px]:py-9 border-[1.5px] border-primary-400'
                        >
                            <Link href='/' className='w-fit items-center gap-3 hidden min-[440px]:flex'>
                                <Image
                                    src='/funning-logo-orange.png'
                                    alt='Funning AI logo'
                                    width={44}
                                    height={44}
                                    className='size-12 rounded-xl bg-white/75 p-1 shadow-[0_3px_10px_rgb(0,0,0,0.15)]'
                                    priority
                                />
                                <span className='text-2xl font-extrabold tracking-normal'>Funning AI</span>
                            </Link>

                            <div className='flex w-full flex-1 flex-col justify-start px-2 pt-5 @min-[350px]/start-window:px-5 @min-[295px]/start-window:pt-7 @min-[420px]/start-window:px-8 @min-[420px]/start-window:pt-8'>
                                <div className='mb-5 @min-[420px]/start-window:mb-7'>
                                    <h1 className='text-4xl @min-[295px]/start-window:text-[44px] @min-[350px]/start-window:text-5xl @min-[420px]/start-window:text-[56px] font-extrabold leading-[0.98] tracking-normal text-gray-950'>
                                        {mode === 'signup' ? 'Start training smarter.' : 'Pick your plan back up.'}
                                    </h1>
                                    <p className='mt-4 text-[15px] @min-[350px]/start-window:text-[17px] leading-7 text-gray-600'>
                                        {mode === 'signup'
                                            ? 'Create your account and let Funning shape the next block of your goals, effort, and recovery.'
                                            : 'Sign in to continue your training rhythm, check your plan, and keep the momentum moving.'}
                                    </p>
                                </div>

                                <div className='hidden 5xl:grid mb-5 relative grid-cols-2 rounded-full border border-primary-100 bg-white p-1 shadow-inner shadow-primary-100/70'>
                                    <button
                                        type='button'
                                        onClick={() => switchMode('signup')}
                                        className={cn(
                                            'relative z-20 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all cursor-pointer',
                                            mode === 'signup' ? 'text-white' : 'text-gray-500 hover:text-primary-700',
                                        )}
                                    >
                                        Sign Up
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => switchMode('signin')}
                                        className={cn(
                                            'relative z-20 rounded-full px-4 py-2.5 text-sm font-extrabold transition-all cursor-pointer',
                                            mode === 'signin' ? 'text-white' : 'text-gray-500 hover:text-secondary-700',
                                        )}
                                    >
                                        Sign In
                                    </button>
                                    <div className={`absolute inset-0 z-0 p-1 flex ${mode === 'signin' ? 'justify-end' : 'justify-start'}`}>
                                        <motion.span
                                            layout
                                            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                                            className={cn(
                                                'h-full w-1/2 rounded-full shadow-sm shadow-black/10 bg-gradient-to-br',
                                                mode === 'signup' ? 'from-primary-400 to-primary-500' : 'from-secondary-400 to-secondary-500',
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-row @min-[250px]/start-window:flex-col gap-2.5'>
                                    {/* <button
                                    type='button'
                                    onClick={() => handleOAuthSignIn('apple')}
                                    className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-gray-900 bg-gray-800 px-4 py-2.5 shadow-gray-400 font-extrabold text-gray-200 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                    <span className='grid size-6 place-items-center rounded-full border border-gray-500 text-sm font-black'>A</span>
                                    <span className='hidden @min-[250px]/start-window:block'>Continue with Apple</span>
                                </button> */}
                                    <button
                                        type='button'
                                        onClick={() => handleOAuthSignIn('google')}
                                        disabled={providers !== null && !providers.google}
                                        className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-primary-100 bg-white px-4 py-2.5 shadow-inner shadow-primary-100/70 font-extrabold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
                                    >
                                        <Image src='/google-logo.png' alt='Google Logo' width={24} height={24} />
                                        <span className='hidden @min-[200px]/start-window:inline'>
                                            <span className='hidden @min-[250px]/start-window:inline'>Continue with </span>Google
                                        </span>
                                    </button>
                                </div>

                                <div className='my-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-gray-400'>
                                    <span className='h-px flex-1 bg-gradient-to-r from-transparent to-primary-100' />
                                    <span>or</span>
                                    <span className='h-px flex-1 bg-gradient-to-l from-transparent to-secondary-100' />
                                </div>

                                <form onSubmit={handleSubmit} className='space-y-2.5'>
                                    {errorMessage && (
                                        <p className='rounded-2xl border border-tertiary-200 shadow-inner shadow-tertiary-200/70 bg-tertiary-50 px-4 py-3 text-sm font-bold text-tertiary-700'>
                                            {errorMessage}
                                        </p>
                                    )}

                                    {mode === 'signup' && (
                                        <span className='flex items-center gap-3 rounded-[18px] border border-primary-100 bg-white px-4 py-2.5 shadow-inner shadow-primary-100/70'>
                                            <User className='size-5 text-primary-500' />
                                            <input
                                                name='name'
                                                type='text'
                                                value={formData.name}
                                                onChange={handleChange}
                                                autoComplete='name'
                                                required={mode === 'signup'}
                                                placeholder='Full Name'
                                                className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                                            />
                                        </span>
                                    )}

                                    <span className='flex items-center gap-3 rounded-[18px] border border-primary-100 bg-white px-4 py-2.5 shadow-inner shadow-primary-100/70'>
                                        <Mail className='size-5 text-primary-500' />
                                        <input
                                            name='email'
                                            type='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete='email'
                                            required
                                            placeholder='Email'
                                            className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                                        />
                                    </span>

                                    <span className='flex items-center gap-3 rounded-[18px] border border-primary-100 bg-white px-4 py-2.5 shadow-inner shadow-primary-100/70'>
                                        <LockKeyhole className='size-5 text-primary-500' />
                                        <input
                                            name='password'
                                            type='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                            required
                                            placeholder='Password'
                                            className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                                        />
                                    </span>

                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-600 px-5 py-3.5 text-base font-extrabold text-white shadow-[0_16px_34px_rgba(196,86,0,0.26)] transition-all hover:scale-[1.01] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70'
                                    >
                                        {loading ? <Loader2 className='size-5 animate-spin' /> : <Zap className='size-5' />}
                                        <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                                    </button>
                                </form>

                                <p className='text-center text-sm font-semibold text-gray-500 mt-8'>
                                    {mode === 'signup' ? 'Already training with us?' : 'New to Funning AI?'}{' '}
                                    <button
                                        type='button'
                                        onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}
                                        className='font-extrabold text-primary-700 hover:text-secondary-700 cursor-pointer'
                                    >
                                        {mode === 'signup' ? 'Sign in' : 'Create an account'}
                                    </button>
                                </p>

                                <div className='flex justify-center min-[440px]:hidden mt-4'>
                                    <Link href='/' className='w-fit flex items-center gap-3'>
                                        <Image
                                            src='/funning-logo-orange.png'
                                            alt='Funning AI logo'
                                            width={44}
                                            height={44}
                                            className='size-12 rounded-xl bg-white/75 p-1 shadow-[0_3px_10px_rgb(0,0,0,0.15)]'
                                            priority
                                        />
                                        <span className='text-2xl font-extrabold tracking-normal'>Funning AI</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                        <div className='relative h-full overflow-hidden bg-transparent hidden 5xl:block'>
                            <div className='absolute inset-0 grid place-items-center'>
                                <motion.div variants={scrollVariants(0.1)} initial='hidden' animate='visible' className='relative aspect-square w-[78%] max-w-[620px]'>
                                    <div className='absolute inset-[3%] rounded-full border-[26px] border-primary-300/55 shadow-[0_0_80px_rgba(255,141,75,0.26)]' />
                                    <div className='absolute inset-[13%] rounded-full border-[22px] border-secondary-300/65 shadow-[0_0_90px_rgba(161,68,248,0.22)]' />
                                    <div className='absolute inset-[25%] rounded-full border-[16px] border-primary-200/55 bg-white/35 backdrop-blur-sm' />

                                    <div className='absolute left-[9%] top-[30%] h-[34px] w-[82%] -rotate-[34deg] rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-[0_18px_50px_rgba(134,31,221,0.22)]' />
                                    <div className='absolute left-[17%] top-[44%] h-[24px] w-[66%] -rotate-[34deg] rounded-full bg-gradient-to-r from-primary-300 to-secondary-300' />
                                    <div className='absolute left-[9%] top-[60%] h-[34px] w-[82%] -rotate-[34deg] rounded-full bg-gradient-to-r from-secondary-500 to-primary-400 shadow-[0_18px_50px_rgba(196,86,0,0.2)]' />

                                    {/* <div className='absolute left-1/2 top-[8%] flex -translate-x-1/2 flex-col items-center gap-4'>
                                    {[18, 13, 10, 13, 18].map((size, index) => (
                                        <span
                                            key={`top-dot-${index}`}
                                            className='rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 shadow-sm'
                                            style={{ width: `${size}px`, height: `${size}px` }}
                                        />
                                    ))}
                                </div>
                                <div className='absolute bottom-[8%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-4'>
                                    {[18, 13, 10, 13, 18].map((size, index) => (
                                        <span
                                            key={`bottom-dot-${index}`}
                                            className='rounded-full bg-gradient-to-br from-secondary-500 to-primary-400 shadow-sm'
                                            style={{ width: `${size}px`, height: `${size}px` }}
                                        />
                                    ))}
                                </div> */}

                                    <div className='absolute inset-[36%] grid place-items-center rounded-full bg-white/90 shadow-[0_18px_60px_rgba(44,0,81,0.16)] backdrop-blur'>
                                        <Image src='/funning-logo-orange.png' alt='' width={118} height={118} className='size-3/5 object-contain' />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default StartPage;
