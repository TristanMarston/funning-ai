import { Variants } from 'motion/react';

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
