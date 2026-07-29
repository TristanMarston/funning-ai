import { cn } from '@/lib/utils';
import { animate, motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { useEffect, useState } from 'react';

const AnimatedGradientContainer = ({
    children,
    className,
    onlyOnHover = false,
    duration = 3,
    defaultBackgroundColor = '#fff',
    gradientOnHover = false,
}: {
    children: React.ReactNode;
    className?: string;
    onlyOnHover?: boolean;
    duration?: number;
    defaultBackgroundColor?: string;
    gradientOnHover?: boolean;
}) => {
    const turn = useMotionValue(0);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        animate(turn, 1, {
            ease: 'linear',
            duration,
            repeat: Infinity,
        });
    }, [duration, turn]);

    const gradient = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 0%, #ec6a0600 5%, #ec6a06 10%, #f04f41 18%, #b66dff 26%, #e6d0f5 34%, #a144f8 42%, #f751a1 46%, #f751a100 52%, transparent 56%)`;

    return (
        <div
            className={cn('relative p-px', className)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                style={{ backgroundImage: gradient }}
                initial={{ opacity: onlyOnHover ? 0 : 1 }}
                animate={{ opacity: onlyOnHover ? (hovered ? 1 : 0) : 1 }}
                className={cn('absolute inset-0 rounded-[inherit]')}
            />
            <motion.div
                style={{ backgroundImage: `linear-gradient(${defaultBackgroundColor}, ${defaultBackgroundColor})` }}
                initial={{ opacity: onlyOnHover ? (hovered ? 0 : 1) : 0 }}
                animate={{ opacity: onlyOnHover ? (hovered ? 0 : 1) : 0 }}
                className='absolute inset-0 rounded-[inherit]'
            />

            <div className={cn('relative rounded-[inherit] overflow-hidden')}>
                <div className='relative'>{children}</div>

                <motion.div
                    style={{ backgroundImage: gradient }}
                    className='ai-glow-spill-mask opacity-70 blur-2xl pointer-events-none absolute inset-[-40%] z-10 overflow-hidden'
                ></motion.div>
            </div>
        </div>
    );
};

export default AnimatedGradientContainer;
