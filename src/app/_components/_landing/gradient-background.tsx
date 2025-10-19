'use client';

import * as React from 'react';
import { HTMLMotionProps, motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

type GradientBackgroundProps = HTMLMotionProps<'div'> & {
    animated?: boolean;
    gradient?: string;
    transition?: Transition;
};

function GradientBackground({
    className,
    gradient = 'from-background-light/25 via-secondary-orange/25 to-background-light/25',
    animated = true,
    transition = { duration: 5, ease: 'easeInOut', repeat: Infinity },
    ...props
}: GradientBackgroundProps) {
    return (
        <motion.div
            data-slot='gradient-background'
            className={cn('size-full bg-gradient-to-br', gradient, animated ? 'bg-[length:400%_400%]' : 'w-full h-auto', className)}
            animate={
                animated
                    ? {
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }
                    : {}
            }
            transition={transition}
            {...props}
        />
    );
}

export { GradientBackground, type GradientBackgroundProps };
