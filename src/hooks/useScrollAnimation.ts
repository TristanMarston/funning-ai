import { useEffect, useState, useRef, RefObject } from 'react';
import { useInView, useAnimation, LegacyAnimationControls, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

export const useScrollAnimation = (): { ref: RefObject<any>; controls: LegacyAnimationControls } => {
    const controls = useAnimation();
    const scrollDirection = useRef('down');
    const ref = useRef(null);

    const inView = useInView(ref, { once: true, amount: 0.3 });
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (current) => {
        const previous: number | undefined = scrollY.getPrevious();
        const diff = current - (previous !== undefined ? previous : 0);
        scrollDirection.current = diff > 0 ? 'down' : 'up';
    });

    useEffect(() => {
        if (inView) {
            if (scrollDirection.current === 'down') {
                controls.start('visible');
            } else {
                controls.start('visible', { duration: 0.01 });
            }
        }
    }, [inView, controls, scrollY]);

    return { ref, controls };
};
