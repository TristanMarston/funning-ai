import { Icon, LucideProps, type IconNode } from 'lucide-react';
import { Activity, PlanData, SportExperienceLevel, SportsPlanData, emptySportsPlanData } from '../context';
import { ActivityMapOption, sportActivityOptions } from './OnboardingSteps';
import { DayAvailabilityPicker, LevelBar, RangeSlider, ToggleSwitch } from './onboardingUI';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, Variants } from 'motion/react';

type StepProps = { data: PlanData; updateData: (nextData: Partial<PlanData>) => void };

type SportFieldSet = {
    level: keyof SportsPlanData;
    daysMin: keyof SportsPlanData;
    daysMax: keyof SportsPlanData;
    trainingDays: keyof SportsPlanData;
};

const sportFields: Record<string, SportFieldSet> = {
    basketball: { level: 'basketballLevel', daysMin: 'basketballDaysMin', daysMax: 'basketballDaysMax', trainingDays: 'basketballTrainingDays' },
    tennis: { level: 'tennisLevel', daysMin: 'tennisDaysMin', daysMax: 'tennisDaysMax', trainingDays: 'tennisTrainingDays' },
    pickleball: { level: 'pickleballLevel', daysMin: 'pickleballDaysMin', daysMax: 'pickleballDaysMax', trainingDays: 'pickleballTrainingDays' },
    soccer: { level: 'soccerLevel', daysMin: 'soccerDaysMin', daysMax: 'soccerDaysMax', trainingDays: 'soccerTrainingDays' },
    volleyball: { level: 'volleyballLevel', daysMin: 'volleyballDaysMin', daysMax: 'volleyballDaysMax', trainingDays: 'volleyballTrainingDays' },
};

const sportLevels: { value: SportExperienceLevel; label: string }[] = [
    { value: 'casual', label: 'Casual' },
    { value: 'recreational', label: 'Recreational' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'professional', label: 'Professional' },
];

const useSelectedSports = (data: PlanData) => sportActivityOptions.filter((option) => data.activities.includes(option.activity));

const SportHeading = ({
    activity,
    iconColor,
    icon: IconComponent,
    svg,
}: {
    activity: Activity;
    iconColor?: string;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> | null;
    svg?: IconNode | null;
}) => (
    <>
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

        <div
            className={cn(
                'flex items-center gap-2.5 px-3 py-1 rounded-[14px] w-full font-semibold',
                activity,
                `${activity}-background ${activity}-text ${activity}-shadow-inner ${activity}-border-solid`,
            )}
        >
            {IconComponent && <IconComponent className='size-5' strokeWidth={2.25} color={iconColor || '#000'} />}
            {svg && <Icon iconNode={svg} className='size-5' strokeWidth={2.25} color={iconColor || '#000'} />}
            <span className={cn('text-base font-extrabold capitalize')}>{activity}</span>
        </div>
        {/* <div className='h-[3px] w-full rounded-full shadow-sm' style={{ background: iconColor }} /> */}
    </>
);

export const SportsLevelStep = ({ data, updateData }: StepProps) => {
    const selectedSports = useSelectedSports(data);
    const sportsData = data.sportsData ?? emptySportsPlanData;

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>How experienced are you {selectedSports.length > 1 ? 'in each sport' : `at playing ${selectedSports[0].activity}`}?</h2>
            <div className='mt-5 space-y-5'>
                {selectedSports.map(({ activity, iconColor, icon, svg }) => {
                    const fields = sportFields[activity];
                    return (
                        <div key={activity}>
                            <SportHeading activity={activity} iconColor={iconColor} icon={icon} svg={svg} />
                            <div className='mt-2.5'>
                                <LevelBar
                                    levels={sportLevels}
                                    selected={(sportsData[fields.level] as SportExperienceLevel | null) ?? null}
                                    onSelect={(value) => updateData({ sportsData: { ...sportsData, [fields.level]: value } as SportsPlanData })}
                                    smallSelectorClassName='@min-[260px]/level-bar-container:grid-cols-2'
                                    smallSelectorChoiceClassName={(i) => 'text-sm'}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const SportsFrequencyStep = ({ data, updateData }: StepProps) => {
    const selectedSports = useSelectedSports(data);
    const sportsData = data.sportsData ?? emptySportsPlanData;
    const [justOpened, setJustOpened] = useState(true);

    useEffect(() => {
        if (!justOpened) return;
        const newSportsData = { ...sportsData };
        let changed = false;

        for (const sport of selectedSports) {
            const fields = sportFields[sport.activity];
            if (newSportsData[fields.daysMin] !== null || newSportsData[fields.daysMax] !== null) return;

            if (newSportsData[fields.daysMin] === null || newSportsData[fields.daysMax] === null) {
                changed = true;
                newSportsData[fields.daysMin] = 1 as never;
                newSportsData[fields.daysMax] = 2 as never;
            }
        }

        if (changed) updateData({ sportsData: newSportsData as SportsPlanData });
    }, [updateData]);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>How often do you play?</h2>
            <div className='mt-5 space-y-6'>
                {selectedSports.map(({ activity, iconColor, icon, svg }) => (
                    <SportFrequencySelector
                        key={activity}
                        activity={activity}
                        iconColor={iconColor}
                        icon={icon}
                        svg={svg}
                        sportsData={sportsData}
                        updateData={updateData}
                        justOpened={justOpened}
                        setJustOpened={setJustOpened}
                    />
                ))}
            </div>
        </div>
    );
};

const SportFrequencySelector = ({
    activity,
    iconColor,
    icon,
    svg,
    sportsData,
    updateData,
    justOpened,
    setJustOpened,
}: ActivityMapOption & {
    sportsData: SportsPlanData;
    updateData: (nextData: Partial<PlanData>) => void;
    justOpened: boolean;
    setJustOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const fields = sportFields[activity];
    const min = sportsData[fields.daysMin] as number | null;
    const max = sportsData[fields.daysMax] as number | null;

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
            marginTop: '8px',
        },
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [min, max]);

    return (
        <div key={activity}>
            <SportHeading activity={activity} iconColor={iconColor} icon={icon} svg={svg} />
            <div className='mt-3'>
                <ToggleSwitch
                    checked={min === null && max === null}
                    onChange={(value) => {
                        if (value) setJustOpened(false);
                        updateData({ sportsData: { ...sportsData, [fields.daysMin]: value ? null : 1, [fields.daysMax]: value ? null : 2 } as SportsPlanData });
                    }}
                    label="I'm just starting out"
                    className='py-2'
                />
            </div>
            <motion.div
                key='experience'
                ref={contentRef}
                variants={experienceVariants}
                initial='closed'
                animate={min === null && max === null ? 'closed' : 'open'}
                transition={{ duration: justOpened ? 0 : 0.3, ease: 'easeInOut' }}
                className='overflow-hidden'
            >
                <RangeSlider
                    label='Days per week'
                    min={1}
                    max={7}
                    valueMin={min || 1}
                    valueMax={max || 2}
                    unit='days'
                    onMinChange={(value) => updateData({ sportsData: { ...sportsData, [fields.daysMin]: max ? Math.min(value, max) : null } as SportsPlanData })}
                    onMaxChange={(value) => updateData({ sportsData: { ...sportsData, [fields.daysMax]: min ? Math.max(value, min) : null } as SportsPlanData })}
                />
            </motion.div>
        </div>
    );
};

export const SportsAvailabilityStep = ({
    data,
    updateData,
    establishingMinutes,
    setEstablishingMinutes,
}: StepProps & { establishingMinutes: boolean; setEstablishingMinutes: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const selectedSports = useSelectedSports(data);
    const sportsData = data.sportsData ?? emptySportsPlanData;
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>Which days do you want to play?</h2>
            <div className='mt-5 space-y-5'>
                <ToggleSwitch
                    checked={establishingMinutes}
                    onChange={(value) => {
                        setEstablishingMinutes(value);
                        if (!hasOpened) setHasOpened(true);
                    }}
                    label='Specify daily training minutes?'
                    className='mb-3'
                />
                {selectedSports.map(({ activity, iconColor, icon, svg }) => {
                    const fields = sportFields[activity];
                    return (
                        <div key={activity}>
                            <SportHeading activity={activity} iconColor={iconColor} icon={icon} svg={svg} />
                            <div className='mt-2.5'>
                                <DayAvailabilityPicker
                                    activity={activity}
                                    days={(sportsData[fields.trainingDays] as SportsPlanData['tennisTrainingDays']) ?? []}
                                    onChange={(days) => updateData({ sportsData: { ...sportsData, [fields.trainingDays]: days } as SportsPlanData })}
                                    defaultMinutes={60}
                                    establishingMinutes={establishingMinutes}
                                    hasOpened={hasOpened}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
