import { cn } from '@/lib/utils';
import { PlanData, Activity, Sex, sportsActivities } from '../context';
import { Bike, Dumbbell, Icon, IconNode, LucideProps, SportShoe, Volleyball } from 'lucide-react';
import { basketball, batBall, soccerPitch, tennisBall } from '@lucide/lab';
import { Fragment, useState } from 'react';
import { FieldShell, PillChoice, UnitToggle, WordLimitedTextarea } from './onboardingUI';

export type ActivityMapOption = {
    activity: Activity;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> | null;
    svg: IconNode | null;
    iconColor?: string;
};

export const activityOptions: ActivityMapOption[] = [
    { activity: 'running', icon: SportShoe, svg: null, iconColor: '#0c89c7' },
    { activity: 'cycling', icon: Bike, svg: null, iconColor: '#ab0758' },
    { activity: 'strength', icon: Dumbbell, svg: null, iconColor: '#ef4444' },
    { activity: 'basketball', icon: null, svg: basketball, iconColor: '#ff8200' },
    { activity: 'tennis', icon: null, svg: tennisBall, iconColor: '#22c55e' },
    { activity: 'pickleball', icon: null, svg: batBall, iconColor: '#a600e0' },
    { activity: 'soccer', icon: null, svg: soccerPitch, iconColor: '#199346' },
    { activity: 'volleyball', icon: Volleyball, svg: null, iconColor: '#c9a22c' },
];

export const sportActivityOptions = activityOptions.filter((option) => sportsActivities.includes(option.activity));

export const ActivitySelectionStep = ({ data, updateData }: { data: PlanData; updateData: (nextData: Partial<PlanData>) => void }) => {
    return (
        <div className='@container/activity-selection'>
            <h2 className='text-xl font-extrabold text-gray-950'>What activities do you want to train for?</h2>
            <div className='mt-5 grid @min-[300px]/activity-selection:grid-cols-6 gap-2.5 @min-[380px]/activity-selection:gap-3.5'>
                {activityOptions.map(({ activity, icon: LucideIcon, svg, iconColor }) => (
                    <Fragment key={activity}>
                        <style>
                            {`
                                .${activity} {
                                    --icon-color: ${iconColor};
                                }
                                .${activity}-border-solid {
                                    border: 1px solid var(--icon-color);
                                }
                                .${activity}-shadow-inner {
                                    box-shadow: 0 4px 6px -1px rgb(from var(--icon-color) r g b / 10%), 0 2px 4px -1px rgb(from var(--icon-color) r g b / 20%);
                                }
                                .${activity}-shadow-md {
                                    box-shadow: inset 0 2px 4px 0 rgb(from var(--icon-color) r g b / 30%);
                                }
                                .${activity}-text {
                                    color: var(--icon-color);
                                }
                                .${activity}-background {
                                    background: linear-gradient(90deg, rgb(from var(--icon-color) r g b / 10%) 20%, rgb(from var(--icon-color) r g b / 30%) 100%);
                                }
                                .${activity}-transition {
                                    transition: all 0.5s ease-in-out;
                                }

                            `}
                        </style>
                        <button
                            type='button'
                            onClick={() =>
                                updateData({ activities: data.activities.includes(activity) ? data.activities.filter((a) => activity !== a) : [...data.activities, activity] })
                            }
                            className={cn(
                                'rounded-2xl border px-4 py-2.5 @min-[380px]/activity-selection:py-3 cursor-pointer bg-white text-gray-700 flex items-center gap-2 capitalize text-base @min-[335px]/activity-selection:text-lg font-bold transition-all hover:-translate-y-0.5',
                                activity,
                                `${activity}-transition ${activity}-border-solid`,
                                data.activities.includes(activity) ? `${activity}-shadow-inner ${activity}-background ${activity}-text` : `${activity}-shadow-md bg-white`,
                                ['running', 'cycling'].includes(activity)
                                    ? '@min-[300px]/activity-selection:col-span-3'
                                    : '@min-[300px]/activity-selection:col-span-3 @min-[500px]/activity-selection:col-span-2',
                            )}
                        >
                            {LucideIcon && (
                                <LucideIcon
                                    className='min-w-5 h-5 @min-[335px]/activity-selection:min-w-6.5 @min-[335px]/activity-selection:h-6.5'
                                    strokeWidth={2.25}
                                    color={iconColor || '#000'}
                                />
                            )}
                            {svg && (
                                <Icon
                                    iconNode={svg}
                                    className='min-w-5 h-5 @min-[335px]/activity-selection:min-w-6.5 @min-[335px]/activity-selection:h-6.5'
                                    strokeWidth={2.25}
                                    color={iconColor || '#000'}
                                />
                            )}
                            <span className='truncate'>{activity}</span>
                        </button>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

const sexOptions: { value: Sex; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer_not', label: 'Prefer not to say' },
];

const LBS_PER_KG = 2.20462;

export const UserInfoStep = ({ data, updateData }: { data: PlanData; updateData: (nextData: Partial<PlanData>) => void }) => {
    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');

    const displayWeight = data.weightLbs === null ? '' : weightUnit === 'kg' ? Math.round(data.weightLbs / LBS_PER_KG) : data.weightLbs;

    const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        if (raw === '') {
            updateData({ weightLbs: null });
            return;
        }
        const parsed = Number(raw);
        if (Number.isNaN(parsed)) return;
        updateData({ weightLbs: Math.max(0, weightUnit === 'kg' ? Math.round(parsed * LBS_PER_KG) : Math.round(parsed)) });
    };

    return (
        <div className='@container/user-info'>
            <h2 className='text-xl font-extrabold text-gray-950'>Tell us about yourself.</h2>
            <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>This helps tailor training load, recovery, and pacing to you specifically.</p>

            <div className='mt-5 grid grid-cols-1 gap-3 @min-[420px]/user-info:grid-cols-2 h-full'>
                <label className='block'>
                    <span className='mb-2 block text-sm font-extrabold text-gray-700'>Age</span>
                    <FieldShell>
                        <input
                            type='number'
                            min={5}
                            max={120}
                            value={data.age ?? ''}
                            onChange={(event) => updateData({ age: event.target.value === '' ? null : Math.max(0, Number(event.target.value)) })}
                            placeholder='Years'
                            className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                        />
                    </FieldShell>
                </label>

                <div className='block'>
                    <div className='mb-2 flex items-center justify-between'>
                        <span className='text-sm font-extrabold text-gray-700'>
                            Weight <span className='font-semibold text-gray-400'>(optional)</span>
                        </span>
                    </div>
                    <FieldShell>
                        <input
                            type='number'
                            min={0}
                            value={displayWeight}
                            onChange={handleWeightChange}
                            placeholder='Weight'
                            className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
                        />
                        <UnitToggle
                            options={[
                                { value: 'lbs', label: 'lbs' },
                                { value: 'kg', label: 'kg' },
                            ]}
                            value={weightUnit}
                            onChange={setWeightUnit}
                        />
                    </FieldShell>
                </div>
            </div>

            <div className='mt-3'>
                <span className='mb-2 block text-sm font-extrabold text-gray-700'>Sex</span>
                <div className='grid grid-cols-2 @min-[450px]/user-info:grid-cols-3 gap-2'>
                    {sexOptions.map((option) => (
                        <PillChoice
                            key={option.value}
                            selected={data.sex === option.value}
                            onClick={() => updateData({ sex: option.value })}
                            className={cn(option.value === 'prefer_not' ? 'col-span-2 @min-[450px]/user-info:col-span-1' : 'col-span-1')}
                        >
                            {option.label}
                        </PillChoice>
                    ))}
                </div>
            </div>

            <label className='mt-5 block'>
                <span className='mb-2 block text-sm font-extrabold text-gray-700'>
                    Are you facing any injuries right now? <span className='font-semibold text-gray-400'>(optional)</span>
                </span>
                <WordLimitedTextarea
                    value={data.injuries ?? ''}
                    onChange={(value) => updateData({ injuries: value })}
                    maxWords={150}
                    placeholder='Describe any injuries or areas of concern...'
                />
            </label>
        </div>
    );
};

export const NotesAndFinalizeStep = ({ data, updateData }: { data: PlanData; updateData: (nextData: Partial<PlanData>) => void }) => {
    const summaryLines: string[] = [];

    summaryLines.push(`Training: ${data.activities.length > 0 ? data.activities.join(', ') : 'no activities selected'}`);
    if (data.age) summaryLines.push(`Age: ${data.age}`);
    if (data.injuries) summaryLines.push(`Injuries noted: ${data.injuries.length > 80 ? `${data.injuries.slice(0, 80)}…` : data.injuries}`);

    if (data.runningData) {
        const parts: string[] = [];
        if (data.runningData.primaryGoal === 'race') parts.push('training for a race');
        if (data.runningData.primaryGoal === 'fitness') parts.push('building fitness');
        if (data.runningData.justStarting) parts.push('just starting out');
        summaryLines.push(`Running: ${parts.length > 0 ? parts.join(', ') : 'details pending'}`);
    }
    if (data.cyclingData) {
        const parts: string[] = [];
        if (data.cyclingData.rideType) parts.push(`${data.cyclingData.rideType} riding`);
        if (data.cyclingData.justStarting) parts.push('just starting out');
        summaryLines.push(`Cycling: ${parts.length > 0 ? parts.join(', ') : 'details pending'}`);
    }
    if (data.strengthData) {
        const parts: string[] = [];
        if (data.strengthData.experienceLevel) parts.push(`${data.strengthData.experienceLevel} level`);
        if (data.strengthData.strengthExercises.length > 0) parts.push(data.strengthData.strengthExercises.join(', ').replace(/_/g, ' '));
        summaryLines.push(`Strength: ${parts.length > 0 ? parts.join(', ') : 'details pending'}`);
    }
    if (data.sportsData) {
        const playedSports = sportsActivities.filter((sport) => data.activities.includes(sport));
        if (playedSports.length > 0) summaryLines.push(`Sports: ${playedSports.join(', ')}`);
    }

    return (
        <div className='@container/notes'>
            <h2 className='text-xl font-extrabold text-gray-950'>Anything else we should know?</h2>
            <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>Share any notes about your current fitness and goals — this helps shape your plan.</p>

            <div className='mt-5'>
                <WordLimitedTextarea
                    value={data.notes ?? ''}
                    onChange={(value) => updateData({ notes: value })}
                    maxWords={150}
                    placeholder='Optional notes about your fitness and goals...'
                />
            </div>

            {/* <div className='mt-6 rounded-[22px] border border-primary-100 bg-white px-5 py-4 shadow-inner shadow-primary-100/70'>
                <span className='mb-3 block text-sm font-extrabold text-gray-700'>Here&apos;s what we&apos;ve got so far</span>
                <ul className='space-y-1.5'>
                    {summaryLines.map((line, index) => (
                        <li key={index} className='flex items-start gap-2 text-sm font-semibold capitalize leading-6 text-gray-600'>
                            <span className='mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500' />
                            {line}
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};
