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
