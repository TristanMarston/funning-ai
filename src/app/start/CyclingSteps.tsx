import { motion, Variants } from 'motion/react';
import { PlanData, PrimaryCyclingGoal, RideType, emptyCyclingPlanData } from '../context';
import { CheckCard, DayAvailabilityPicker, PillChoice, RadioCard, RangeSlider, ToggleSwitch, clamp } from './onboardingUI';
import { useEffect, useRef, useState } from 'react';

type StepProps = { data: PlanData; updateData: (nextData: Partial<PlanData>) => void };

const cyclingGoalOptions: { value: PrimaryCyclingGoal; title: string; description: string }[] = [
    { value: 'event', title: "I'm training for an event", description: 'Build toward a specific ride, race, or gran fondo.' },
    { value: 'fitness', title: "I'm building fitness", description: 'Improve aerobic base and overall cycling fitness.' },
    { value: 'complement', title: "I'm complementing other training", description: 'Use cycling as cross-training alongside another sport.' },
];

const rideTypeOptions: { value: RideType; label: string }[] = [
    { value: 'road', label: 'Road' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'indoor', label: 'Indoor' },
];

export const CyclingGoalStep = ({ data, updateData }: StepProps) => {
    const cyclingData = data.cyclingData ?? emptyCyclingPlanData;

    return (
        <div className='@container/cycling-goal'>
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your goal in cycling?</h2>
            <div className='mt-5 grid gap-3'>
                {cyclingGoalOptions.map((goal) => (
                    <RadioCard
                        key={goal.value}
                        selected={cyclingData.primaryGoal === goal.value}
                        title={goal.title}
                        description={goal.description}
                        onClick={() => updateData({ cyclingData: { ...cyclingData, primaryGoal: goal.value } })}
                    />
                ))}
            </div>

            <span className='mb-2 mt-5 block text-sm font-extrabold text-gray-700'>What type of riding do you want to be doing?</span>
            <div className='grid grid-cols-2 @min-[310px]/cycling-goal:grid-cols-3 gap-2'>
                {rideTypeOptions.map((type, i) => (
                    <PillChoice
                        key={type.value}
                        selected={cyclingData.rideType === type.value}
                        onClick={() => updateData({ cyclingData: { ...cyclingData, rideType: type.value } })}
                        className={i === 0 ? 'col-span-2 @min-[310px]/cycling-goal:col-span-1' : ''}
                    >
                        {type.label}
                    </PillChoice>
                ))}
            </div>
        </div>
    );
};

export const CyclingExperienceStep = ({ data, updateData }: StepProps) => {
    const cyclingData = data.cyclingData ?? emptyCyclingPlanData;
    const justStarting = !!cyclingData.justStarting;
    const [justOpened, setJustOpened] = useState(!data.cyclingData?.justStarting && !data.cyclingData?.weeklyMileageMin && !data.cyclingData?.weeklyMileageMax);

    const setJustStarting = (value: boolean) =>
        updateData({
            cyclingData: {
                ...cyclingData,
                justStarting: value,
                ...(value ? { weeklyMileageMin: null, weeklyMileageMax: null } : {}),
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
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your cycling experience?</h2>

            <div className='mt-5'>
                <CheckCard
                    selected={justStarting}
                    label="I'm just starting"
                    onClick={() => {
                        if (justOpened) setJustOpened(false);
                        setJustStarting(!justStarting);
                    }}
                />
            </div>

            <motion.div
                key='experience'
                ref={contentRef}
                variants={experienceVariants}
                initial='closed'
                animate={!justStarting ? 'open' : 'closed'}
                transition={{ duration: justOpened ? 0 : 0.3, ease: 'easeInOut' }}
                className='overflow-hidden'
            >
                <RangeSlider
                    label='Typical weekly mileage'
                    min={0}
                    max={300}
                    valueMin={cyclingData.weeklyMileageMin ?? 20}
                    valueMax={cyclingData.weeklyMileageMax ?? 40}
                    unit='mi'
                    onMinChange={(value) => {
                        if (justOpened) setJustOpened(false);
                        updateData({ cyclingData: { ...cyclingData, weeklyMileageMin: clamp(value, 0, cyclingData.weeklyMileageMax ?? 300) } });
                    }}
                    onMaxChange={(value) => {
                        if (justOpened) setJustOpened(false);
                        updateData({ cyclingData: { ...cyclingData, weeklyMileageMax: clamp(value, cyclingData.weeklyMileageMin ?? 0, 300) } });
                    }}
                />
            </motion.div>
        </div>
    );
};

export const CyclingAvailabilityStep = ({ data, updateData, establishingMinutes, setEstablishingMinutes }: StepProps & { establishingMinutes: boolean; setEstablishingMinutes: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const cyclingData = data.cyclingData ?? emptyCyclingPlanData;
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>When do you want to ride?</h2>

            <div className='mt-5'>
                <span className='mb-2 block text-sm font-extrabold text-gray-700'>What days do you want to ride?</span>
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
                    activity='cycling'
                    establishingMinutes={establishingMinutes}
                    hasOpened={hasOpened}
                    days={cyclingData.trainingDays}
                    onChange={(days) => updateData({ cyclingData: { ...cyclingData, trainingDays: days } })}
                    defaultMinutes={60}
                />
            </div>

            <div className='mt-5'>
                <ToggleSwitch
                    checked={!!cyclingData.powerMeter}
                    onChange={(value) => updateData({ cyclingData: { ...cyclingData, powerMeter: value } })}
                    label='Do you have a power meter?'
                    description="We'll use power as a training metric if you'd like."
                />
            </div>
        </div>
    );
};
