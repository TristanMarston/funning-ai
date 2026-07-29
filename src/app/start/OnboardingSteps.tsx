import { cn } from '@/lib/utils';
import { PlanData, Activity } from '../context';
import { Bike, Dumbbell, Icon, IconNode, LucideProps, ShieldHalf, SportShoe, Volleyball } from 'lucide-react';
import { basketball, batBall, soccerPitch, tennisBall } from '@lucide/lab';
import { Fragment } from 'react';

export const activityOptions: {
    activity: Activity;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> | null;
    svg: IconNode | null;
    iconColor?: string;
}[] = [
    { activity: 'running', icon: SportShoe, svg: null, iconColor: '#0c89c7' },
    { activity: 'cycling', icon: Bike, svg: null, iconColor: '#ab0758' },
    { activity: 'strength', icon: Dumbbell, svg: null, iconColor: '#ef4444' },
    { activity: 'basketball', icon: null, svg: basketball, iconColor: '#ff8200' },
    { activity: 'tennis', icon: null, svg: tennisBall, iconColor: '#22c55e' },
    { activity: 'pickleball', icon: null, svg: batBall, iconColor: '#a600e0' },
    { activity: 'soccer', icon: null, svg: soccerPitch, iconColor: '#199346' },
    { activity: 'volleyball', icon: Volleyball, svg: null, iconColor: '#c9a22c' },
];

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

export const UserInfoStep = ({ data, updateData }: { data: PlanData; updateData: (nextData: Partial<PlanData>) => void }) => {
    return (
        <div>
            <div></div>
        </div>
    );
};

const PillChoice = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type='button'
        onClick={onClick}
        className={cn(
            'rounded-2xl border px-4 py-3 text-sm font-extrabold shadow-inner transition-all hover:-translate-y-0.5',
            selected ? 'border-secondary-300 bg-secondary-600 text-white shadow-secondary-200/70' : 'border-primary-100 bg-white text-gray-700 shadow-primary-100/70',
        )}
    >
        {children}
    </button>
);

const RadioCard = ({ selected, title, description, onClick }: { selected: boolean; title: string; description: string; onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className={cn(
            'flex w-full items-start cursor-pointer gap-3 rounded-[18px] border px-4 py-3 text-left shadow-inner! transition-all hover:-translate-y-0.5',
            selected ? 'border-primary-300 bg-primary-50 shadow-primary-100/80' : 'border-primary-100 bg-white shadow-primary-100/70',
        )}
    >
        <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-primary-500' : 'border-gray-300')}>
            <span className={cn('size-2.5 rounded-full bg-primary-500 transition-opacity', selected ? 'opacity-100' : 'opacity-0')} />
        </span>
        <span>
            <span className='block font-extrabold text-gray-900'>{title}</span>
            <span className='mt-1 block text-sm font-semibold leading-5 text-gray-500'>{description}</span>
        </span>
    </button>
);

const RangeSlider = ({
    label,
    min,
    max,
    valueMin,
    valueMax,
    unit,
    onMinChange,
    onMaxChange,
}: {
    label: string;
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    unit: string;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}) => {
    const minPercent = ((valueMin - min) / (max - min)) * 100;
    const maxPercent = ((valueMax - min) / (max - min)) * 100;

    return (
        <div className='mt-6 rounded-[22px] border border-primary-100 bg-white px-4 py-4 shadow-inner shadow-primary-100/70'>
            <div className='mb-5 flex items-center justify-between gap-3'>
                <span className='text-sm font-extrabold text-gray-700'>{label}</span>
                <span className='rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-1 text-sm font-extrabold text-secondary-800'>
                    {valueMin}-{valueMax} {unit}
                </span>
            </div>
            <div className='relative h-9'>
                <div className='absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary-100' />
                <div
                    className='absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-500'
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                />
                <input
                    type='range'
                    min={min}
                    max={max}
                    value={valueMin}
                    onChange={(event) => onMinChange(Number(event.target.value))}
                    className='range-thumb pointer-events-none absolute inset-x-0 top-1/2 z-20 h-2 w-full -translate-y-1/2 appearance-none bg-transparent'
                />
                <input
                    type='range'
                    min={min}
                    max={max}
                    value={valueMax}
                    onChange={(event) => onMaxChange(Number(event.target.value))}
                    className='range-thumb pointer-events-none absolute inset-x-0 top-1/2 z-30 h-2 w-full -translate-y-1/2 appearance-none bg-transparent'
                />
            </div>
            <div className='mt-1 flex justify-between text-xs font-bold text-gray-400'>
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

// const GoalStep = ({ data, updateData }: { data: OnboardingData; updateData: (nextData: Partial<OnboardingData>) => void }) => (
//     <div>
//         <h2 className='text-xl font-extrabold text-gray-950'>What is your primary goal?</h2>
//         <div className='mt-5 grid gap-3'>
//             {runningGoalOptions.map((goal) => (
//                 <RadioCard
//                     key={goal.value}
//                     selected={data.runningData?.primaryGoal === goal.value}
//                     title={goal.title}
//                     description={goal.description}
//                     onClick={() =>
//                         updateData((prev) => ({
//                             ...prev,
//                             runningData: {
//                                 ...prev.runningData,
//                                 primaryGoal: goal.value,
//                                 raceDistance: goal.value === 'race' ? prev.runningData.raceDistance : undefined,
//                             }
//                         }))
//                     }
//                 />
//             ))}
//         </div>
//     </div>
// );

// const RaceStep = ({
//     data,
//     updateData,
//     showTrackEvents,
//     setShowTrackEvents,
// }: {
//     data: OnboardingData;
//     updateData: (nextData: Partial<OnboardingData>) => void;
//     showTrackEvents: boolean;
//     setShowTrackEvents: (show: boolean) => void;
// }) => (
//     <div>
//         <h2 className='text-xl font-extrabold text-gray-950'>What are you training for?</h2>
//         <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>Pick the event that should anchor your first plan.</p>
//         <div className='mt-5 grid grid-cols-2 gap-3 @min-[520px]/onboarding:grid-cols-4'>
//             {raceOptions.map((race) => (
//                 <PillChoice key={race.value} selected={planData.raceDistance === race.value} onClick={() => updateData({ raceDistance: race.value })}>
//                     {race.label}
//                 </PillChoice>
//             ))}
//         </div>
//         <button
//             type='button'
//             onClick={() => setShowTrackEvents(!showTrackEvents)}
//             className={cn(
//                 'mt-4 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left font-extrabold shadow-inner transition-all',
//                 showTrackEvents ? 'border-secondary-200 bg-secondary-50 text-secondary-800 shadow-secondary-100/80' : 'border-primary-100 bg-white text-gray-700 shadow-primary-100/70',
//             )}
//         >
//             <span>Track & Field Events</span>
//             <ChevronDown className={cn('size-5 transition-transform', showTrackEvents ? 'rotate-180' : '')} />
//         </button>
//         <AnimatePresence initial={false}>
//             {showTrackEvents && (
//                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden'>
//                     <div className='mt-3 grid grid-cols-2 gap-3 @min-[520px]/onboarding:grid-cols-3'>
//                         {trackOptions.map((event) => (
//                             <PillChoice key={event.value} selected={planData.raceDistance === event.value} onClick={() => updateData({ raceDistance: event.value })}>
//                                 {event.label}
//                             </PillChoice>
//                         ))}
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     </div>
// );

// const MileageStep = ({
//     data,
//     updateData,
//     setMileageMin,
//     setMileageMax,
// }: {
//     data: OnboardingData;
//     updateData: (nextData: Partial<OnboardingData>) => void;
//     setMileageMin: (value: number) => void;
//     setMileageMax: (value: number) => void;
// }) => (
//     <div>
//         <h2 className='text-xl font-extrabold text-gray-950'>What is your current running base?</h2>
//         <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>Keep the weekly range tight. The max spread is 5 miles.</p>
//         <RangeSlider
//             label='Average miles per week'
//             min={0}
//             max={120}
//             valueMin={planData.weeklyMileageMin}
//             valueMax={planData.weeklyMileageMax}
//             unit='mi'
//             onMinChange={setMileageMin}
//             onMaxChange={setMileageMax}
//         />
//         <label className='mt-6 block'>
//             <span className='mb-2 block text-sm font-extrabold text-gray-700'>Longest run in the past month</span>
//             <span className='flex items-center rounded-[18px] border border-primary-100 bg-white px-4 py-3 shadow-inner shadow-primary-100/70'>
//                 <input
//                     type='number'
//                     min='0'
//                     step='0.1'
//                     value={planData.longestRun ?? ''}
//                     onChange={(event) => updateData({ longestRun: Number(event.target.value) })}
//                     placeholder='Miles'
//                     className='w-full bg-transparent text-base font-semibold outline-none placeholder:text-gray-400'
//                 />
//                 <span className='text-sm font-extrabold text-gray-400'>mi</span>
//             </span>
//         </label>
//     </div>
// );

// const AvailabilityStep = ({
//     data,
//     updateData,
//     setTrainingDaysMin,
//     setTrainingDaysMax,
// }: {
//     data: OnboardingData;
//     updateData: (nextData: Partial<OnboardingData>) => void;
//     setTrainingDaysMin: (value: number) => void;
//     setTrainingDaysMax: (value: number) => void;
// }) => (
//     <div>
//         <h2 className='text-xl font-extrabold text-gray-950'>What can training fit around?</h2>
//         <p className='mt-2 text-sm font-semibold leading-6 text-gray-500'>This helps the plan stay ambitious without overreaching.</p>
//         <RangeSlider
//             label='Training days per week'
//             min={1}
//             max={7}
//             valueMin={planData.trainingDaysMin}
//             valueMax={planData.trainingDaysMax}
//             unit='days'
//             onMinChange={setTrainingDaysMin}
//             onMaxChange={setTrainingDaysMax}
//         />
//         <label className='mt-6 block'>
//             <span className='mb-2 block text-sm font-extrabold text-gray-700'>Any injuries or pain you&apos;re working around?</span>
//             <textarea
//                 value={planData.injuries ?? ''}
//                 onChange={(event) => updateData({ injuries: event.target.value })}
//                 placeholder='Optional'
//                 rows={4}
//                 className='w-full resize-none rounded-[18px] border border-primary-100 bg-white px-4 py-3 text-base font-semibold outline-none shadow-inner shadow-primary-100/70 placeholder:text-gray-400'
//             />
//         </label>
//     </div>
// );
