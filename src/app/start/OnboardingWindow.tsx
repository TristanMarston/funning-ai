'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bike, ChevronDown, DoorOpen, Loader2, LogOut, ShieldHalf, Sparkles, SportShoe, Volleyball } from 'lucide-react';
import { getOnboardingData, updateOnboardingData } from '../actions/onboarding';
import { emptyPlanData, emptySportsPlanData, failToast, OnboardingStep, PlanData, PrimaryRunningGoal, RaceDistance, Sex, validateOnboardingStep } from '../context';
import { ActivitySelectionStep, UserInfoStep } from './OnboardingSteps';

const sports = ['tennis', 'pickleball', 'soccer', 'volleyball', 'basketball'];

const defaultRunningData = {
    weeklyMileageMin: 10,
    weeklyMileageMax: 15,
    trainingDaysMin: 3,
    trainingDaysMax: 5,
};

const runningGoalOptions: { value: PrimaryRunningGoal; title: string; description: string }[] = [
    { value: 'race', title: 'Train for a race', description: 'Build toward a specific event with workouts and progression.' },
    // { value: 'start', title: 'Start running', description: 'Create a gentle plan that makes consistency feel doable.' },
    { value: 'fitness', title: 'Build my fitness', description: 'Improve aerobic base, strength, and weekly rhythm.' },
];

const runningRaceOptions: { value: RaceDistance; label: string }[] = [
    { value: 'dist_5k', label: '5K' },
    { value: 'dist_10k', label: '10K' },
    { value: 'dist_half', label: 'Half' },
    { value: 'dist_marathon', label: 'Marathon' },
];

const trackOptions: { value: RaceDistance; label: string }[] = [
    { value: 'dist_100m', label: '100m' },
    { value: 'dist_200m', label: '200m' },
    { value: 'dist_400m', label: '400m' },
    { value: 'dist_800m', label: '800m' },
    { value: 'dist_1600m', label: '1600m' },
    { value: 'dist_3200m', label: '3200m' },
];

const getSteps = (planData: PlanData): OnboardingStep[] => {
    if (!planData.activities) return ['activity_selection', 'user_info', 'running_goal', 'running_race', 'running_experience', 'running_availability', 'notes_and_finalize'];

    const steps: OnboardingStep[] = ['activity_selection', 'user_info'];

    if (planData.activities.includes('running')) steps.push('running_goal', 'running_race', 'running_experience', 'running_availability');
    if (planData.activities.includes('cycling')) steps.push('cycling_goal', 'cycling_experience', 'cycling_availability');
    if (planData.activities.includes('strength')) steps.push('strength_goal', 'strength_experience', 'strength_availability');
    if (planData.activities.some((activity) => sports.includes(activity))) steps.push('sports_level', 'sports_frequency', 'sports_availability');

    steps.push('notes_and_finalize');
    return steps;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const OnboardingWindow = () => {
    const router = useRouter();
    const { update } = useSession();

    const [planData, setPlanData] = useState<PlanData>(emptyPlanData);
    const [step, setStep] = useState<OnboardingStep>('activity_selection');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [steps, setSteps] = useState<OnboardingStep[]>(getSteps(planData));

    const [warnedAboutDiscarding, setWarnedAboutDiscarding] = useState(false);

    useEffect(() => {
        console.log(step, steps);
        console.log(`${((step === 'activity_selection' ? 0 : steps.indexOf(step) + 1) / steps.length) * 100}%`);
    }, [step, steps]);

    useEffect(() => {
        const loadOnboarding = async () => {
            try {
                const res = await getOnboardingData();
                if (res.error || !res.user) {
                    setErrorMessage('Could not load. Please reload the page.');
                    return;
                }

                if (res.user.planData) {
                    const nextData: PlanData = emptyPlanData;

                    nextData.activities = [...res.user.planData.activitiesSelected];

                    if (res.user.planData.age !== undefined) nextData.age = res.user.planData.age;
                    if (res.user.planData.sex !== undefined) nextData.sex = res.user.planData.sex;
                    if (res.user.planData.weightLbs !== undefined) nextData.weightLbs = res.user.planData.weightLbs;
                    if (res.user.planData.injuries !== undefined) nextData.injuries = res.user.planData.injuries;

                    if (res.user.planData.runningData) nextData.runningData = { ...res.user.planData.runningData, trainingDays: [] };
                    if (res.user.planData.cyclingData) nextData.cyclingData = { ...res.user.planData.cyclingData, trainingDays: [] };
                    if (res.user.planData.strengthData) nextData.strengthData = { ...res.user.planData.strengthData, trainingDays: [] };
                    if (res.user.planData.sportsData) nextData.sportsData = { ...res.user.planData.sportsData, ...emptySportsPlanData };

                    for (const trainingDay of res.user.planData.availableTrainingDays) {
                        if (nextData.runningData && trainingDay.runningMinutes && trainingDay.runningMinutes > 0) {
                            nextData.runningData.trainingDays.push({ dayOfWeek: trainingDay.dayOfWeek, activity: 'running', trainingMinutes: trainingDay.runningMinutes });
                        }
                        if (nextData.cyclingData && trainingDay.cyclingMinutes && trainingDay.cyclingMinutes > 0) {
                            nextData.cyclingData.trainingDays.push({ dayOfWeek: trainingDay.dayOfWeek, activity: 'cycling', trainingMinutes: trainingDay.cyclingMinutes });
                        }
                        if (nextData.strengthData && trainingDay.strengthMinutes && trainingDay.strengthMinutes > 0) {
                            nextData.strengthData.trainingDays.push({ dayOfWeek: trainingDay.dayOfWeek, activity: 'strength', trainingMinutes: trainingDay.strengthMinutes });
                        }
                        if (nextData.sportsData && trainingDay.basketballMinutes && trainingDay.basketballMinutes > 0) {
                            nextData.sportsData.basketballTrainingDays.push({
                                dayOfWeek: trainingDay.dayOfWeek,
                                activity: 'basketball',
                                trainingMinutes: trainingDay.basketballMinutes,
                            });
                        }
                        if (nextData.sportsData && trainingDay.tennisMinutes && trainingDay.tennisMinutes > 0) {
                            nextData.sportsData.tennisTrainingDays.push({ dayOfWeek: trainingDay.dayOfWeek, activity: 'tennis', trainingMinutes: trainingDay.tennisMinutes });
                        }
                        if (nextData.sportsData && trainingDay.pickleballMinutes && trainingDay.pickleballMinutes > 0) {
                            nextData.sportsData.pickleballTrainingDays.push({
                                dayOfWeek: trainingDay.dayOfWeek,
                                activity: 'pickleball',
                                trainingMinutes: trainingDay.pickleballMinutes,
                            });
                        }
                        if (nextData.sportsData && trainingDay.soccerMinutes && trainingDay.soccerMinutes > 0) {
                            nextData.sportsData.soccerTrainingDays.push({ dayOfWeek: trainingDay.dayOfWeek, activity: 'soccer', trainingMinutes: trainingDay.soccerMinutes });
                        }
                        if (nextData.sportsData && trainingDay.volleyballMinutes && trainingDay.volleyballMinutes > 0) {
                            nextData.sportsData.volleyballTrainingDays.push({
                                dayOfWeek: trainingDay.dayOfWeek,
                                activity: 'volleyball',
                                trainingMinutes: trainingDay.volleyballMinutes,
                            });
                        }
                    }

                    setPlanData(nextData);
                    setStep(res.user.onboardingStep);
                    setSteps(getSteps(nextData));
                }
            } catch (error) {
                console.error(error);
                setErrorMessage('We could not load your saved onboarding progress.');
            } finally {
                setLoading(false);
            }
        };

        loadOnboarding();
    }, []);

    const updateData = (nextData: Partial<PlanData>) => {
        setPlanData((prev) => ({ ...prev, ...nextData }));
        setErrorMessage('');
    };

    const saveProgress = async (nextStepIndex: number, completed = false) => {
        setSaving(true);
        setErrorMessage('');

        try {
            const res = await updateOnboardingData({ onboardingStep: steps[nextStepIndex], onboardingData: planData, hasOnboarded: completed });

            if (res.error) setErrorMessage('We could not save that step. Please try again.');
        } catch (error) {
            console.error(error);
            setErrorMessage('We could not save that step. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const goToStep = async (nextStepIndex: number) => {
        const forward = nextStepIndex > steps.indexOf(step);

        const { message: validationMessage, enteredInfo } = validateOnboardingStep(step, planData);
        if (validationMessage && forward) {
            setErrorMessage(validationMessage);
            return;
        } else if (validationMessage && !forward && enteredInfo) {
            if (warnedAboutDiscarding) {
                setWarnedAboutDiscarding(false);
                setStep(steps[nextStepIndex]);
                setErrorMessage('');
                return;
            } else {
                setErrorMessage(`${validationMessage} Click back again to discard these changes.`);
                setWarnedAboutDiscarding(true);
                return;
            }
        }

        if (forward) await saveProgress(nextStepIndex, false);
        setStep(steps[nextStepIndex]);
        setSteps(getSteps(planData));
    };

    const finishOnboarding = async () => {
        const { message: validationMessage } = validateOnboardingStep(step, planData);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        await saveProgress(steps.indexOf(step), true);
        await update({ hasOnboarded: true });
        router.push('/dashboard');
    };

    // const setMileageMin = (value: number) => {
    //     const nextMin = clamp(value, 0, planData.weeklyMileageMax);
    //     updateData({
    //         weeklyMileageMin: nextMin,
    //         weeklyMileageMax: clamp(planData.weeklyMileageMax, nextMin, nextMin + 5),
    //     });
    // };

    // const setMileageMax = (value: number) => {
    //     const nextMax = clamp(value, planData.weeklyMileageMin, 120);
    //     updateData({
    //         weeklyMileageMax: nextMax,
    //         weeklyMileageMin: clamp(planData.weeklyMileageMin, nextMax - 5, nextMax),
    //     });
    // };

    // const setTrainingDaysMin = (value: number) => {
    //     const nextMin = clamp(value, 1, planData.trainingDaysMax);
    //     updateData({ trainingDaysMin: nextMin });
    // };

    // const setTrainingDaysMax = (value: number) => {
    //     const nextMax = clamp(value, planData.trainingDaysMin, 7);
    //     updateData({ trainingDaysMax: nextMax });
    // };

    return (
        <motion.section
            variants={{
                hidden: { opacity: 0, y: 18, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1 },
            }}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className='@container/onboarding relative overflow-y-auto overflow-x-hidden hide-scrollbar w-[calc(100%-2rem)] max-h-[90dvh] max-w-[680px] rounded-[28px] border-[1.5px] border-primary-400 bg-gradient-to-br from-white via-primary-50/80 to-white px-6 py-6 shadow-[0_20px_50px_rgba(155,65,240,0.16)] min-[440px]:px-9 min-[440px]:py-8'
        >
            <div
                className={cn(
                    'absolute inset-0 w-full h-full rounded-[28px] border-[1.5px] border-transparent',
                    saving ? 'animate-pulse bg-white/80 block pointer-events-none' : 'bg-transparent hidden',
                )}
            />
            <motion.div
                className='pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-tertiary-400 to-secondary-500'
                animate={{ width: `${((step === 'activity_selection' ? 0 : steps.indexOf(step) + 1) / steps.length) * 100}%` }}
            />

            {loading ? (
                <div className='grid min-h-[360px] place-items-center'>
                    <Loader2 className='size-8 animate-spin text-primary-500' />
                </div>
            ) : (
                <div>
                    <h1 className='text-3xl font-extrabold leading-tight text-gray-950 @min-[420px]/onboarding:text-4xl'>Let&apos;s shape your plan.</h1>
                    <p className='mb-6 mt-1 max-w-xl text-[15px] leading-7 text-gray-600'>A few details help Funning tune your training load, recovery, and recommendations.</p>

                    {/* <div className='mb-7 h-2 overflow-hidden rounded-full bg-white shadow-inner shadow-primary-100/80'>
                        <motion.div className='h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-500' animate={{ width: `${progress}%` }} />
                    </div> */}

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -18 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className='min-h-[100px]'
                        >
                            {step === 'activity_selection' && <ActivitySelectionStep data={planData} updateData={updateData} />}
                            {step === 'user_info' && <UserInfoStep data={planData} updateData={updateData} />}
                        </motion.div>
                    </AnimatePresence>

                    {errorMessage && (
                        <p className='mt-4 rounded-2xl border border-tertiary-200 shadow-inner shadow-tertiary-200/70 bg-tertiary-50 px-4 py-3 text-sm font-bold text-tertiary-700'>
                            {errorMessage}
                        </p>
                    )}

                    <div className='mt-7 flex flex-col-reverse @min-[380px]/onboarding:flex-row items-center justify-between gap-2 @min-[240px]/onboarding:gap-3'>
                        <div className='grid grid-cols-1 @min-[240px]/onboarding:grid-cols-2 items-center w-full gap-2'>
                            <div className={cn('block @min-[380px]/onboarding:hidden', steps.indexOf(step) === 0 || saving ? 'cursor-not-allowed' : '')}>
                                <button
                                    type='button'
                                    onClick={() => goToStep(steps.indexOf(step) - 1)}
                                    disabled={steps.indexOf(step) === 0 || saving}
                                    className='cursor-pointer w-full @min-[380px]/onboarding:w-fit inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-extrabold text-gray-600 shadow-inner shadow-primary-100/70 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md hover:text-primary-700 disabled:pointer-events-none disabled:opacity-40'
                                >
                                    <ArrowLeft className='size-4' />
                                    Back
                                </button>
                            </div>
                            <button
                                type='button'
                                onClick={() => signOut()}
                                disabled={saving}
                                className='cursor-pointer w-full @min-[380px]/onboarding:w-fit text-nowrap inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-extrabold text-gray-600 shadow-inner shadow-primary-100/70 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40'
                            >
                                <DoorOpen className='min-w-4 h-4' />
                                Sign Out
                            </button>
                        </div>

                        <div className='w-full @min-[380px]/onboarding:w-fit @min-[380px]/onboarding:flex justify-center items-center gap-2'>
                            <div className={cn('hidden @min-[380px]/onboarding:block', steps.indexOf(step) === 0 || saving ? 'cursor-not-allowed' : '')}>
                                <button
                                    type='button'
                                    onClick={() => goToStep(steps.indexOf(step) - 1)}
                                    disabled={steps.indexOf(step) === 0 || saving}
                                    className='cursor-pointer w-full @min-[380px]/onboarding:w-fit inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-extrabold text-gray-600 shadow-inner shadow-primary-100/70 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md hover:text-primary-700 disabled:pointer-events-none disabled:opacity-40'
                                >
                                    <ArrowLeft className='size-4' />
                                    Back
                                </button>
                            </div>
                            <div className={cn(saving ? 'cursor-not-allowed' : '')}>
                                <button
                                    type='button'
                                    onClick={() => (steps.indexOf(step) === steps.length - 1 ? finishOnboarding() : goToStep(steps.indexOf(step) + 1))}
                                    disabled={saving}
                                    className='cursor-pointer w-full @min-[380px]/onboarding:w-fit relative inline-flex min-w-[150px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold shadow-inner gradient-shadow-box gradient-shadow-box-border transition-all hover:-translate-y-0.5 disabled:pointer-events-none hover:shadow-sm disabled:opacity-70'
                                >
                                    {saving ? <Loader2 className='size-4 animate-spin' /> : null}
                                    <span>{steps.indexOf(step) === steps.length - 1 ? 'Create My Plan' : 'Continue'}</span>
                                    {!saving ? <ArrowRight className='size-4' /> : null}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    );
};

export default OnboardingWindow;
