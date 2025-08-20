'use client';

import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { GradientText } from '../gradient-text';
import { scrollVariants } from '@/app/context';
import { useRef, useState } from 'react';

const LINE_HEIGHT = 300;

const HowItWorks = () => {
    return (
        <div className='w-full'>
            <div className='pt-8 pb-[600px] px-5 flex flex-col items-center'>
                <motion.h2
                    initial='hidden'
                    whileInView='visible'
                    variants={scrollVariants()}
                    transition={{ ease: 'anticipate', duration: 1 }}
                    viewport={{ once: true }}
                    className='font-figtree font-extrabold text-[40px] xs:text-[44px] md:text-[48px] lg:text-[52px] xl:text-[60px] 3xl:text-[64px] 5xl:text-[70px] leading-[1] mb-10 text-center'
                >
                    How it Works <GradientText text='in 4 Steps' />
                </motion.h2>
                <section className='flex justify-start w-full p-4 relative'>
                    <NumberLine />
                    <div className='w-full pl-3'>
                        <div style={{ height: `${LINE_HEIGHT + 56}px`}} className='w-full h-full'>
                            <h3 className='font-figtree font-bold text-2xl h-[56px] flex items-center'>Connect Your Running Tracker</h3>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const NumberLine = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const currentStep = useTransform(scrollYProgress, (progress) => {
        progress = progress - 0.05;
        if (progress < 0.25) return 1;
        if (progress < 0.5) return 2;
        if (progress < 0.75) return 3;
        return 4;
    });

    return (
        <div ref={containerRef} className='flex flex-col items-center'>
            {Array.from({ length: 4 }, (_, i) => (
                <Step key={i} index={i} scrollYProgress={scrollYProgress} currentStep={currentStep} />
            ))}
        </div>
    );
};

const Step = ({ index, scrollYProgress, currentStep }: { index: number; scrollYProgress: MotionValue<number>; currentStep: MotionValue<1 | 2 | 3 | 4> }) => {
    const stepRef = useRef<HTMLDivElement>(null);
    const [isStepVisible, setIsStepVisible] = useState(false);

    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    useMotionValueEvent(scrollYProgress, 'change', (current) => {
        if (scrollYProgress === undefined || scrollYProgress === null) return;
        const diff = current - (scrollYProgress.getPrevious() || 0);
        setScrollDirection(diff > 0 ? 'down' : 'up');
    });

    const lineHeight = useTransform(scrollYProgress, (progress) => {
        progress = progress - 0.05;
        const stepStart = index * 0.25;
        const stepEnd = (index + 1) * 0.25;

        if (progress < stepStart) return 0;
        if (progress > stepEnd) return LINE_HEIGHT;

        const stepProgress = (progress - stepStart) / 0.25;
        return stepProgress * LINE_HEIGHT;
    });

    const isVisible = useTransform(currentStep, (step) => {
        const visible = step >= index + 1;
        return visible;
    });

    useMotionValueEvent(isVisible, 'change', (visible) => {
        setIsStepVisible(visible);
    });

    return (
        <>
            <motion.div
                ref={stepRef}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={index === 0 ? { opacity: 1, scale: 1 } : undefined}
                viewport={{ once: scrollDirection === 'down' }}
                animate={isStepVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{
                    scale: { type: 'spring', visualDuration: 0.5, bounce: 0.5 },
                    duration: 0.5,
                }}
                className='font-figtree text-3xl bg-primary text-white p-2 w-14 h-14 flex justify-center items-center rounded-full -mt-1'
            >
                {index + 1}
            </motion.div>

            {/* Only show line if it's not the last step */}
            {index < 3 && <motion.div style={{ height: lineHeight }} className='w-2 rounded-full bg-primary -mt-1' />}
        </>
    );
};

export default HowItWorks;
