import { cn } from '@/lib/utils';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PlanData, PrimaryRunningGoal, RaceDistance, emptyRunningPlanData } from '../context';
import { CheckCard, DayAvailabilityPicker, FieldShell, PillChoice, RadioCard, RangeSlider, DatePickerCalendar, clamp, ToggleSwitch } from './onboardingUI';

type StepProps = { data: PlanData; updateData: (nextData: Partial<PlanData>) => void };

const runningGoalOptions: { value: PrimaryRunningGoal; title: string; description: string }[] = [
    { value: 'race', title: 'Train for a race', description: 'Build toward a specific event with workouts and progression.' },
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

export const RunningGoalStep = ({ data, updateData }: StepProps) => {
    const runningData = data.runningData ?? emptyRunningPlanData;

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your goal in running?</h2>
            <div className='mt-5 grid gap-3'>
                {runningGoalOptions.map((goal) => (
                    <RadioCard
                        key={goal.value}
                        selected={runningData.primaryGoal === goal.value}
                        title={goal.title}
                        description={goal.description}
                        onClick={() =>
                            updateData({
                                runningData: {
                                    ...runningData,
                                    primaryGoal: goal.value,
                                    ...(goal.value !== 'race' ? { raceDistance: [], raceDate: null } : {}),
                                },
                            })
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export const RunningRaceStep = ({ data, updateData }: StepProps) => {
    const runningData = data.runningData ?? emptyRunningPlanData;
    const [showTrackEvents, setShowTrackEvents] = useState(() => trackOptions.some((event) => runningData.raceDistance?.includes(event.value)));

    const setDistance = (value: RaceDistance) => {
        const newDistances = runningData.raceDistance?.some((d) => trackOptions.map((o) => o.value).includes(d))
            ? trackOptions.map((o) => o.value).includes(value)
                ? [...runningData.raceDistance, value]
                : [value]
            : [value];
        updateData({
            runningData: {
                ...runningData,
                raceDistance: runningData.raceDistance?.includes(value) ? newDistances.filter((d) => d !== value) : newDistances,
            },
        });
    };
    const setDate = (date: Date) => updateData({ runningData: { ...runningData, raceDate: date } });

    return (
        <div className='@container/running-race'>
            <h2 className='text-xl font-extrabold text-gray-950'>What race are you preparing for?</h2>
            <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>Pick the event that should anchor your first plan.</p>

            <div className='mt-5 grid grid-cols-2 gap-3 @min-[420px]/running-race:grid-cols-4'>
                {runningRaceOptions.map((race) => (
                    <PillChoice key={race.value} selected={runningData.raceDistance?.includes(race.value) || false} onClick={() => setDistance(race.value)}>
                        {race.label}
                    </PillChoice>
                ))}
            </div>

            <button
                type='button'
                onClick={() => setShowTrackEvents((show) => !show)}
                className={cn(
                    'mt-3 flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left font-extrabold shadow-inner transition-all',
                    showTrackEvents ? 'border-primary-200 bg-primary-50 text-primary-800 shadow-primary-100/80' : 'border-primary-100 bg-white text-gray-700 shadow-primary-100/70',
                )}
            >
                <span>Track & Field Events</span>
                <ChevronDown className={cn('size-5 transition-transform', showTrackEvents ? 'rotate-180' : '')} />
            </button>
            <AnimatePresence initial={false}>
                {showTrackEvents && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden'>
                        <div className='mt-3 grid grid-cols-3 gap-2'>
                            {trackOptions.map((event) => (
                                <PillChoice key={event.value} selected={runningData.raceDistance?.includes(event.value) || false} onClick={() => setDistance(event.value)}>
                                    {event.label}
                                </PillChoice>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='mt-6'>
                <span className='mb-2 block text-sm font-extrabold text-gray-700'>Race Date</span>
                <DatePickerCalendar selected={runningData.raceDate ? new Date(runningData.raceDate) : null} onSelect={setDate} />
            </div>
        </div>
    );
};

export const RunningExperienceStep = ({ data, updateData }: StepProps) => {
    const runningData = data.runningData ?? emptyRunningPlanData;
    const justStarting = !!runningData.justStarting;
    const [justOpened, setJustOpened] = useState(
        !data.runningData?.justStarting && !data.runningData?.weeklyMileageMin && !data.runningData?.weeklyMileageMax && !data.runningData?.longestRunPastMonth,
    );

    const setJustStarting = (value: boolean) =>
        updateData({
            runningData: {
                ...runningData,
                justStarting: value,
                ...(value ? { weeklyMileageMin: null, weeklyMileageMax: null, longestRunPastMonth: null } : {}),
            },
        });

    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const experienceVariants: Variants = {
        closed: {
            opacity: 0,
            height: 0,
            marginTop: 0,
        },
        open: {
            opacity: 1,
            height: contentHeight,
            marginTop: '16px',
        },
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [justStarting]);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your running experience?</h2>

            <div className='mt-5'>
                <ToggleSwitch
                    checked={justStarting}
                    onChange={(value) => {
                        if (justOpened) setJustOpened(false);
                        setJustStarting(value);
                    }}
                    label='Just Starting'
                />
            </div>

            <motion.div
                key='experience'
                ref={contentRef}
                variants={experienceVariants}
                initial='closed'
                animate={!justStarting ? 'open' : 'closed'}
                transition={{ duration: justOpened ? 0 : 0.3, ease: 'easeInOut' }}
                className='overflow-hidden space-y-4'
            >
                <RangeSlider
                    label='Typical weekly mileage'
                    min={0}
                    max={100}
                    valueMin={runningData.weeklyMileageMin ?? 10}
                    valueMax={runningData.weeklyMileageMax ?? 20}
                    unit='mi'
                    onMinChange={(value) => {
                        if (justOpened) setJustOpened(false);
                        updateData({ runningData: { ...runningData, weeklyMileageMin: clamp(value, 0, runningData.weeklyMileageMax ?? 100) } });
                    }}
                    onMaxChange={(value) => {
                        if (justOpened) setJustOpened(false);
                        updateData({ runningData: { ...runningData, weeklyMileageMax: clamp(value, runningData.weeklyMileageMin ?? 0, 100) } });
                    }}
                />

                <label className='block'>
                    <span className='mb-2 block text-sm font-extrabold text-gray-700'>Longest run in the past month</span>
                    <FieldShell>
                        <input
                            type='number'
                            min={0}
                            step={0.1}
                            value={runningData.longestRunPastMonth ?? ''}
                            onChange={(event) => {
                                if (justOpened) setJustOpened(false);
                                updateData({ runningData: { ...runningData, longestRunPastMonth: event.target.value === '' ? null : Number(event.target.value) } });
                            }}
                            placeholder='Miles'
                            className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                        />
                        <span className='text-sm font-extrabold text-gray-400'>mi</span>
                    </FieldShell>
                </label>
            </motion.div>
        </div>
    );
};

export const RunningAvailabilityStep = ({
    data,
    updateData,
    establishingMinutes,
    setEstablishingMinutes,
}: StepProps & { establishingMinutes: boolean; setEstablishingMinutes: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const runningData = data.runningData ?? emptyRunningPlanData;
    const [hasOpened, setHasOpened] = useState(false);

    useLayoutEffect(() => {
        setEstablishingMinutes(data.runningData?.trainingDays.some((d) => d.trainingMinutes && d.trainingMinutes > 0) || false);
    }, []);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>What days do you want to run?</h2>
            <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>
                Pick the days you can run. Add minutes available per day if you know your schedule, or leave it flexible.
            </p>
            <div className='mt-5'>
                <ToggleSwitch
                    checked={establishingMinutes}
                    onChange={(value) => {
                        setEstablishingMinutes(value);
                        if (!hasOpened) setHasOpened(true);
                    }}
                    label='Specify daily training minutes?'
                    className='mb-3'
                />
                <DayAvailabilityPicker
                    activity='running'
                    establishingMinutes={establishingMinutes}
                    hasOpened={hasOpened}
                    days={runningData.trainingDays}
                    onChange={(days) => updateData({ runningData: { ...runningData, trainingDays: days } })}
                    defaultMinutes={30}
                />
            </div>
        </div>
    );
};
