import { Variants } from 'motion/react';
import toast from 'react-hot-toast';

export const scrollVariants = (delay: number = 0, duration: number = 1, staggerChildren: number = 0): Variants => ({
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay,
            duration,
            staggerChildren,
            ease: 'anticipate',
        },
    },
});

export const childVariants = (duration: number = 0.8): Variants => ({
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration,
            ease: 'easeOut',
        },
    },
});

export const loadingToast = (message: string) => {
    return toast.loading(message, {
        position: 'top-center',
        className: 'font-figtree primary-border-important !p-[8px_16px_8px_20px] !rounded-[14px] font-semibold text-lg w-full !max-w-fit',
    });
};

export const failToast = (message: string, id?: string) => {
    toast.error(message, {
        duration: 10000,
        position: 'top-center',
        className: 'font-figtree primary-border-important !p-[8px_16px_8px_20px] !rounded-[14px] font-semibold text-lg w-full !max-w-fit',
        id,
    });
};

export const successToast = (message: string, id?: string) => {
    toast.success(message, {
        duration: 10000,
        position: 'top-center',
        className: 'font-figtree primary-border-important !p-[8px_16px_8px_20px] !rounded-[14px] font-semibold text-lg w-full !max-w-fit',
        id,
    });
};

export const pricing = {
    runner: {
        annual: 6.99,
        monthly: 9.99,
        benefits: [
            'Personalized AI Training Plan',
            '1x / Week Plan Adjustments',
            '3 Week Planning Window',
            'Fitness Tracker Sync',
            'Perceived Exertion Metrics',
            'Race Predictions & Analysis',
            // 'Weekly Progress Summaries',
            // 'Injury Tracking',
        ],
    },
    pro: {
        annual: 9.99,
        monthly: 12.99,
        benefits: ['Everything in Runner Plan', '7x / Week Plan Adjustments', '10 Week Planning Window', 'Early Feature Access', 'Calendar Sync', 'Community Leaderboard'],
    },
    coach: {
        annual: 29.99,
        monthly: -1,
        benefits: [
            'Create and Share AI Training Plans',
            'Add up to 20 athletes',
            'Central Athlete Dashboard',
            'Team Performance Trends',
            'Push Notifications for Athletes',
            'Expand with $5 per extra athlete',
        ],
    },
};

// ONBOARDING & PLAN TYPES

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Sex = 'male' | 'female' | 'prefer_not';
export type Activity = 'running' | 'cycling' | 'strength' | 'basketball' | 'tennis' | 'pickleball' | 'soccer' | 'volleyball';
export type OnboardingStep =
    | 'activity_selection'
    | 'user_info'
    | 'running_goal'
    | 'running_race'
    | 'running_experience'
    | 'running_availability'
    | 'cycling_goal'
    | 'cycling_experience'
    | 'cycling_availability'
    | 'strength_goal'
    | 'strength_experience'
    | 'strength_availability'
    | 'sports_level'
    | 'sports_frequency'
    | 'sports_availability'
    | 'notes_and_finalize';
export type PrimaryRunningGoal = 'race' | 'fitness';
export type RaceDistance = 'dist_5k' | 'dist_10k' | 'dist_half' | 'dist_marathon' | 'dist_100m' | 'dist_200m' | 'dist_400m' | 'dist_800m' | 'dist_1600m' | 'dist_3200m';
export type PrimaryCyclingGoal = 'event' | 'fitness' | 'complement';
export type RideType = 'road' | 'mountain' | 'indoor';
export type PrimaryStrengthGoal = 'muscle' | 'athletic' | 'general' | 'weightloss' | 'rehab';
export type StrengthExercises = 'calisthenics' | 'free_weights' | 'weight_machines' | 'core_exercises';
export type StrengthExperienceLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'expert';
export type GymAccessLevel = 'full' | 'limited' | 'unwanted';
export type SportExperienceLevel = 'casual' | 'recreational' | 'competitive' | 'professional';

export const sportsActivities: Activity[] = ['basketball', 'tennis', 'pickleball', 'soccer', 'volleyball'];

export type PlanData = {
    activities: Activity[];

    age: number | null;
    sex: Sex | null;
    weightLbs: number | null;
    injuries: string | null;
    notes: string | null;

    runningData: RunningPlanData | null;
    cyclingData: CyclingPlanData | null;
    strengthData: StrengthPlanData | null;
    sportsData: SportsPlanData | null;
};

export type RunningPlanData = {
    primaryGoal: PrimaryRunningGoal | null;
    raceDistance: RaceDistance[] | null;
    raceDate: Date | null;
    weeklyMileageMin: number | null;
    weeklyMileageMax: number | null;
    justStarting: boolean | null;
    longestRunPastMonth: number | null;

    trainingDays: AvailableTrainingDay[];
};

export type CyclingPlanData = {
    primaryGoal: PrimaryCyclingGoal | null;
    rideType: RideType | null;
    weeklyMileageMin: number | null;
    weeklyMileageMax: number | null;
    justStarting: boolean | null;
    powerMeter: boolean | null;

    trainingDays: AvailableTrainingDay[];
};

export type StrengthPlanData = {
    primaryGoal: PrimaryStrengthGoal | null;
    strengthExercises: StrengthExercises[];
    experienceLevel: StrengthExperienceLevel | null;
    sessionLengthMinutes: number | null;
    gymAccess: GymAccessLevel | null;

    trainingDays: AvailableTrainingDay[];
};

export type SportsPlanData = {
    tennisDaysMin: number | null;
    tennisDaysMax: number | null;
    tennisLevel: SportExperienceLevel | null;
    tennisTrainingDays: AvailableTrainingDay[];

    basketballDaysMin: number | null;
    basketballDaysMax: number | null;
    basketballLevel: SportExperienceLevel | null;
    basketballTrainingDays: AvailableTrainingDay[];

    pickleballDaysMin: number | null;
    pickleballDaysMax: number | null;
    pickleballLevel: SportExperienceLevel | null;
    pickleballTrainingDays: AvailableTrainingDay[];

    soccerDaysMin: number | null;
    soccerDaysMax: number | null;
    soccerLevel: SportExperienceLevel | null;
    soccerTrainingDays: AvailableTrainingDay[];

    volleyballDaysMin: number | null;
    volleyballDaysMax: number | null;
    volleyballLevel: SportExperienceLevel | null;
    volleyballTrainingDays: AvailableTrainingDay[];
};

export type AvailableTrainingDay = {
    dayOfWeek: DayOfWeek;
    activity: Activity;
    trainingMinutes: number | null;
};

export const emptyRunningPlanData: RunningPlanData = {
    primaryGoal: null,
    raceDistance: [],
    raceDate: null,
    weeklyMileageMin: null,
    weeklyMileageMax: null,
    justStarting: null,
    longestRunPastMonth: null,

    trainingDays: [],
};

export const emptyCyclingPlanData: CyclingPlanData = {
    primaryGoal: null,
    rideType: null,
    weeklyMileageMin: null,
    weeklyMileageMax: null,
    justStarting: null,
    powerMeter: null,

    trainingDays: [],
};

export const emptyStrengthPlanData: StrengthPlanData = {
    primaryGoal: null,
    strengthExercises: [],
    experienceLevel: null,
    sessionLengthMinutes: null,
    gymAccess: null,

    trainingDays: [],
};

export const emptySportsPlanData: SportsPlanData = {
    tennisDaysMin: null,
    tennisDaysMax: null,
    tennisLevel: null,
    tennisTrainingDays: [],

    basketballDaysMin: null,
    basketballDaysMax: null,
    basketballLevel: null,
    basketballTrainingDays: [],

    pickleballDaysMin: null,
    pickleballDaysMax: null,
    pickleballLevel: null,
    pickleballTrainingDays: [],

    soccerDaysMin: null,
    soccerDaysMax: null,
    soccerLevel: null,
    soccerTrainingDays: [],

    volleyballDaysMin: null,
    volleyballDaysMax: null,
    volleyballLevel: null,
    volleyballTrainingDays: [],
};

export const emptyPlanData: PlanData = {
    activities: [],
    age: null,
    sex: null,
    weightLbs: null,
    injuries: null,
    notes: null,
    runningData: null,
    cyclingData: null,
    strengthData: null,
    sportsData: null,
};

export const validateOnboardingStep = (step: OnboardingStep, planData: PlanData): { message: string; enteredInfo: boolean } => {
    let message = '';
    let enteredInfo = false;

    if (step === 'activity_selection' && planData.activities.length === 0) message = 'Please choose at least one activity.';
    if (step === 'user_info') {
        if (planData.age === null) message = 'Please enter your age.';
        if (planData.sex === null) message = 'Please choose your sex or choose not to say.';
        if (planData.age || planData.sex) enteredInfo = true;
    }

    // running

    if (step === 'running_goal' && planData.runningData?.primaryGoal === null) message = 'Please choose a running goal.';
    if (step === 'running_race') {
        if (planData.runningData?.raceDistance?.length === 0) message = 'Please enter the race distance.';
        if (planData.runningData?.raceDate === null) message = 'Please enter the race date.';
        if ((planData.runningData?.raceDistance && planData.runningData?.raceDistance.length > 0) || planData.runningData?.raceDate) enteredInfo = true;
    }
    if (
        step === 'running_experience' &&
        planData.runningData?.weeklyMileageMin === null &&
        planData.runningData?.weeklyMileageMax === null &&
        planData.runningData?.justStarting === null
    )
        message = 'Please enter your running experience.';
    if (step === 'running_availability' && planData.runningData?.trainingDays.length === 0) message = 'Please select at least one training day.';

    // cycling

    if (step === 'cycling_goal') {
        if (planData.cyclingData?.primaryGoal === null) message = 'Please choose a cycling goal.';
        if (planData.cyclingData?.rideType === null) message = 'Please choose a ride type.';
        if (planData.cyclingData?.primaryGoal || planData.cyclingData?.rideType) enteredInfo = true;
    }
    if (
        step === 'cycling_experience' &&
        planData.cyclingData?.weeklyMileageMin === null &&
        planData.cyclingData?.weeklyMileageMax === null &&
        planData.cyclingData?.justStarting === null
    )
        message = 'Please enter your cycling experience.';
    if (step === 'cycling_availability') {
        if (planData.cyclingData?.trainingDays.length === 0) message = 'Please select at least one training day.';
        if (planData.cyclingData?.trainingDays.length !== 0 || planData.cyclingData?.powerMeter !== null) enteredInfo = true;
    }

    // strength

    if (step === 'strength_goal' && planData.strengthData?.primaryGoal === null) message = 'Please choose a strength goal.';
    if (step === 'strength_experience') {
        if (planData.strengthData?.experienceLevel === null) message = 'Please choose a strength experience level.';
        if (planData.strengthData?.sessionLengthMinutes === null) message = 'Please choose a session length.';
        if (planData.strengthData?.experienceLevel || planData.strengthData?.sessionLengthMinutes) enteredInfo = true;
    }
    if (step === 'strength_availability') {
        if (planData.strengthData?.trainingDays.length === 0) message = 'Please seelct at least one training day.';
        if (planData.strengthData?.gymAccess === null) message = 'Please choose whether you have gym access.';
        if (planData.strengthData?.trainingDays.length !== 0 || planData.strengthData?.gymAccess !== null) enteredInfo = true;
    }

    // sports

    if (step === 'sports_level') {
        if (planData.activities.includes('tennis') && planData.sportsData?.tennisLevel === null) message = 'Please enter your tennis experience level.';
        if (planData.activities.includes('pickleball') && planData.sportsData?.pickleballLevel === null) message = 'Please enter your pickleball experience level.';
        if (planData.activities.includes('basketball') && planData.sportsData?.basketballLevel === null) message = 'Please enter your basketball experience level.';
        if (planData.activities.includes('soccer') && planData.sportsData?.soccerLevel === null) message = 'Please enter your soccer experience level.';
        if (planData.activities.includes('volleyball') && planData.sportsData?.volleyballLevel === null) message = 'Please enter your volleyball experience level.';

        if (planData.activities.includes('tennis') && planData.sportsData?.tennisLevel !== null) enteredInfo = true;
        if (planData.activities.includes('pickleball') && planData.sportsData?.pickleballLevel !== null) enteredInfo = true;
        if (planData.activities.includes('basketball') && planData.sportsData?.basketballLevel !== null) enteredInfo = true;
        if (planData.activities.includes('soccer') && planData.sportsData?.soccerLevel !== null) enteredInfo = true;
        if (planData.activities.includes('volleyball') && planData.sportsData?.volleyballLevel !== null) enteredInfo = true;
    }
    if (step === 'sports_frequency') {
        if (planData.activities.includes('tennis') && (planData.sportsData?.tennisDaysMin !== null || planData.sportsData?.tennisDaysMax !== null)) enteredInfo = true;
        if (planData.activities.includes('pickleball') && (planData.sportsData?.pickleballDaysMin !== null || planData.sportsData?.pickleballDaysMax !== null)) enteredInfo = true;
        if (planData.activities.includes('basketball') && (planData.sportsData?.basketballDaysMin !== null || planData.sportsData?.basketballDaysMax !== null)) enteredInfo = true;
        if (planData.activities.includes('soccer') && (planData.sportsData?.soccerDaysMin !== null || planData.sportsData?.soccerDaysMax !== null)) enteredInfo = true;
        if (planData.activities.includes('volleyball') && (planData.sportsData?.volleyballDaysMin !== null || planData.sportsData?.volleyballDaysMax !== null)) enteredInfo = true;
    }
    if (step === 'sports_availability') {
        if (planData.activities.includes('tennis') && planData.sportsData?.tennisTrainingDays.length === 0) {
            message = 'Please indicate the days you would like to play tennis.';
        }
        if (planData.activities.includes('pickleball') && planData.sportsData?.pickleballTrainingDays.length === 0) {
            message = 'Please indicate the days you would like to play pickleball.';
        }
        if (planData.activities.includes('basketball') && planData.sportsData?.basketballTrainingDays.length === 0) {
            message = 'Please indicate the days you would like to play basketball.';
        }
        if (planData.activities.includes('soccer') && planData.sportsData?.soccerTrainingDays.length === 0) {
            message = 'Please indicate the days you would like to play soccer.';
        }
        if (planData.activities.includes('volleyball') && planData.sportsData?.volleyballTrainingDays.length === 0) {
            message = 'Please indicate the days you would like to play volleyball.';
        }

        if (planData.activities.includes('tennis') && planData.sportsData?.tennisTrainingDays.length !== 0) enteredInfo = true;
        if (planData.activities.includes('pickleball') && planData.sportsData?.pickleballTrainingDays.length !== 0) enteredInfo = true;
        if (planData.activities.includes('basketball') && planData.sportsData?.basketballTrainingDays.length !== 0) enteredInfo = true;
        if (planData.activities.includes('soccer') && planData.sportsData?.soccerTrainingDays.length !== 0) enteredInfo = true;
        if (planData.activities.includes('volleyball') && planData.sportsData?.volleyballTrainingDays.length !== 0) enteredInfo = true;
    }

    return { message, enteredInfo };
};
