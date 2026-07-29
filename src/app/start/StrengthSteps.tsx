import { useState } from 'react';
import { GymAccessLevel, PlanData, PrimaryStrengthGoal, StrengthExercises, StrengthExperienceLevel, emptyStrengthPlanData } from '../context';
import { DayAvailabilityPicker, LevelBar, PillChoice, RadioCard, ToggleSwitch } from './onboardingUI';

type StepProps = { data: PlanData; updateData: (nextData: Partial<PlanData>) => void };

const strengthGoalOptions: { value: PrimaryStrengthGoal; title: string; description: string }[] = [
    { value: 'muscle', title: 'Build muscle', description: 'Focus on hypertrophy and adding size.' },
    { value: 'athletic', title: 'Athletic performance', description: 'Get stronger, faster, and more explosive for your sport.' },
    { value: 'general', title: 'General fitness', description: 'Stay strong, capable, and consistent overall.' },
    { value: 'weightloss', title: 'Weight loss', description: 'Use strength training to support fat loss goals.' },
    { value: 'rehab', title: 'Rehab / injury recovery', description: 'Rebuild strength safely around an injury.' },
];

const strengthExerciseOptions: { value: StrengthExercises; label: string }[] = [
    { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'free_weights', label: 'Free Weights' },
    { value: 'weight_machines', label: 'Weight Machines' },
    { value: 'core_exercises', label: 'Core Exercises' },
];

const experienceLevels: { value: StrengthExperienceLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'novice', label: 'Novice' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
];

const sessionLengthOptions = [30, 45, 60, 75, 90];

const gymAccessOptions: { value: GymAccessLevel; title: string; description: string }[] = [
    { value: 'full', title: 'Yes', description: 'I have full access to a gym with equipment.' },
    { value: 'limited', title: 'Somewhat', description: 'I have limited equipment or a home setup.' },
    { value: 'unwanted', title: 'No', description: "I don't have or want gym access — bodyweight only." },
];

export const StrengthGoalStep = ({ data, updateData }: StepProps) => {
    const strengthData = data.strengthData ?? emptyStrengthPlanData;

    const toggleExercise = (exercise: StrengthExercises) => {
        const exists = strengthData.strengthExercises.includes(exercise);
        const next = exists ? strengthData.strengthExercises.filter((e) => e !== exercise) : [...strengthData.strengthExercises, exercise];
        updateData({ strengthData: { ...strengthData, strengthExercises: next } });
    };

    return (
        <div className='@container/strength-goal'>
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your goal in strength training?</h2>
            <div className='mt-5 grid gap-3'>
                {strengthGoalOptions.map((goal) => (
                    <RadioCard
                        key={goal.value}
                        selected={strengthData.primaryGoal === goal.value}
                        title={goal.title}
                        description={goal.description}
                        onClick={() => updateData({ strengthData: { ...strengthData, primaryGoal: goal.value } })}
                    />
                ))}
            </div>

            <span className='mb-2 mt-5 block text-sm font-extrabold text-gray-700'>What exercises are you interested in doing?</span>
            <div className='grid grid-cols-1 @min-[310px]/strength-goal:grid-cols-2 gap-2'>
                {strengthExerciseOptions.map((exercise) => (
                    <PillChoice key={exercise.value} selected={strengthData.strengthExercises.includes(exercise.value)} onClick={() => toggleExercise(exercise.value)}>
                        {exercise.label}
                    </PillChoice>
                ))}
            </div>
        </div>
    );
};

export const StrengthExperienceStep = ({ data, updateData }: StepProps) => {
    const strengthData = data.strengthData ?? emptyStrengthPlanData;

    return (
        <div className='@container/strength-experience'>
            <h2 className='text-xl font-extrabold text-gray-950'>What&apos;s your experience with strength training?</h2>
            <div className='mt-5'>
                <LevelBar
                    levels={experienceLevels}
                    selected={strengthData.experienceLevel}
                    onSelect={(value) => updateData({ strengthData: { ...strengthData, experienceLevel: value } })}
                    smallSelectorClassName='grid-cols-2 @min-[340px]/level-bar-container:grid-cols-6'
                    smallSelectorChoiceClassName={(i) =>
                        i <= 1 ? '@min-[340px]/level-bar-container:col-span-3' : i === experienceLevels.length - 1 ? 'col-span-2' : '@min-[340px]/level-bar-container:col-span-2'
                    }
                />
            </div>

            <span className='mb-2 mt-5 block text-sm font-extrabold text-gray-700'>What&apos;s your preferred session length?</span>
            <div className='grid grid-cols-6 @min-[350px]/strength-experience:grid-cols-5 gap-2'>
                {sessionLengthOptions.map((minutes, i) => (
                    <PillChoice
                        key={minutes}
                        selected={strengthData.sessionLengthMinutes === minutes}
                        onClick={() => updateData({ strengthData: { ...strengthData, sessionLengthMinutes: minutes } })}
                        className={i <= 1 ? 'col-span-3 @min-[350px]/strength-experience:col-span-1' : 'col-span-2 @min-[350px]/strength-experience:col-span-1'}
                    >
                        {minutes}m
                    </PillChoice>
                ))}
            </div>
        </div>
    );
};

export const StrengthAvailabilityStep = ({
    data,
    updateData,
    establishingMinutes,
    setEstablishingMinutes,
}: StepProps & { establishingMinutes: boolean; setEstablishingMinutes: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const strengthData = data.strengthData ?? emptyStrengthPlanData;
    const [hasOpened, setHasOpened] = useState(false);

    return (
        <div>
            <h2 className='text-xl font-extrabold text-gray-950'>Do you have a gym available?</h2>
            <div className='mt-5 grid gap-3'>
                {gymAccessOptions.map((option) => (
                    <RadioCard
                        key={option.value}
                        selected={strengthData.gymAccess === option.value}
                        title={option.title}
                        description={option.description}
                        onClick={() => updateData({ strengthData: { ...strengthData, gymAccess: option.value } })}
                    />
                ))}
            </div>
            <div className='mt-5'>
                <span className='mb-2 block text-sm font-extrabold text-gray-700'>What days do you want to work on strength training?</span>
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
                    activity='strength'
                    establishingMinutes={establishingMinutes}
                    hasOpened={hasOpened}
                    days={strengthData.trainingDays}
                    onChange={(days) => updateData({ strengthData: { ...strengthData, trainingDays: days } })}
                    defaultMinutes={strengthData.sessionLengthMinutes ?? 60}
                />
            </div>
        </div>
    );
};
