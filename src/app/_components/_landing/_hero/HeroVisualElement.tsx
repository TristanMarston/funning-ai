import React, { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

const HeroVisualElement = () => {
    return <TiltCard />;
};

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

const TiltCard = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    // useEffect(() => {
    //     let directionX = 1;
    //     let directionY = 1;
    //     let currentX = 0;
    //     let currentY = 0;

    //     const interval = setInterval(() => {
    //         if (Math.abs(currentX) === 5) {
    //             currentY += directionY;
    //             if (currentY >= 5 || currentY <= -5) directionY *= -1;
    //         } else if (Math.abs(currentY) === 5) {
    //             currentX += directionX;
    //             if (currentX >= 5 || currentX <= -5) directionX *= -1;
    //         }

    //         x.set(currentX);
    //         y.set(currentY);
    //     }, 500);

    //     return () => clearInterval(interval);
    // }, [x, y]);

    return (
        <motion.div
            ref={ref}
            // onMouseMove={handleMouseMove}
            // onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                transform,
            }}
            className='w-full 5xl:w-[95%] 8xl:w-[90%] h-full min-h-[40vh] rounded-xl bg-gradient-to-br from-primary to-tertiary'
        >
            <div
                style={{
                    transform: 'translateZ(75px)',
                    transformStyle: 'preserve-3d',
                }}
                className='absolute inset-3 grid place-content-center rounded-xl bg-white shadow-lg'
            ></div>
        </motion.div>
    );
};

const CalendarPlanView = () => {
    return (
        <div>
            <div></div>
        </div>
    );
};

const GraphView = () => {
    return (
        <div>
            <div></div>
        </div>
    );
};

const PerceivedEffortView = () => {
    return (
        <div>
            <div></div>
        </div>
    );
};

export default HeroVisualElement;
