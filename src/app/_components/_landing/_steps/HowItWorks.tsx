'use client';

import { childVariants, scrollVariants } from '@/app/context';
import { motion, Variants } from 'motion/react';
import { GradientText } from '../gradient-text';
import { GradientBackground } from '../gradient-background';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const HowItWorks = () => {
    const { ref: titleRef, controls: titleControls } = useScrollAnimation();
    const { ref: sectionRef, controls: sectionControls } = useScrollAnimation();

    const stepsElements = [
        {
            step: 1,
            title: 'Sync Fitness Data',
            description: 'Link your favorite fitness app or device to sync your workouts automatically.',
        },
        {
            step: 2,
            title: 'Set Your Goals',
            description: "Define your running goals, whether it's distance, pace, or frequency.",
        },
        {
            step: 3,
            title: 'Train Smarter',
            description: 'Receive an AI-powered plan tailored for you that balances effort with recovery.',
        },
        {
            step: 4,
            title: 'Repeat and Refine',
            description: 'Hit the trails and get results fast, adjusting for perceived exertion.',
        },
    ];

    return (
        <div className='w-full'>
            <div className='pt-8 pb-12 px-5 flex flex-col items-center'>
                <motion.h2
                    ref={titleRef}
                    initial='hidden'
                    animate={titleControls}
                    variants={scrollVariants()}
                    className='font-figtree font-extrabold text-[40px] xs:text-[44px] md:text-[48px] lg:text-[52px] xl:text-[60px] 3xl:text-[64px] 5xl:text-[70px] leading-[1] mb-10 text-center'
                >
                    How it Works <GradientText text='in 4 Steps' />
                </motion.h2>
                <motion.section
                    ref={sectionRef}
                    initial='hidden'
                    animate={sectionControls}
                    variants={scrollVariants(0, 1, 0.3)}
                    className='flex flex-col 4xl:grid grid-cols-2 grid-rows-2 gap-6 4xl:gap-8'
                >
                    {stepsElements.map(({ step, title, description }, index) => (
                        <motion.div variants={childVariants()} key={title + index} className='flex flex-col items-start p-4 border-3 border-primary rounded-2xl shadow-[5px_5px_0px_0px_rgba(240,79,65)]'>
                            <span className='flex mb-1 md:mb-0'>
                                <GradientBackground className='font-figtree flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white flex items-center justify-center font-bold text-lg md:text-xl mr-3'>
                                    {step}
                                </GradientBackground>
                                <h3 className='font-figtree font-bold text-2xl flex items-center'>{title}</h3>
                            </span>
                            <div className='font-figtree'>
                                <p className='font-figtree text-gray-700'>{description}</p>
                            </div>
                            <StepElement step={step} />
                        </motion.div>
                    ))}
                </motion.section>
            </div>
        </div>
    );
};

const fitnessTrackerImages = [
    {
        alt: 'Strava-Logo',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Strava_Logo.svg/1200px-Strava_Logo.svg.png',
        customSpacing: 'p-2.5 4xl:py-4',
    },
    {
        alt: 'Coros-Logo',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/COROS_Wearables_Logo.png/1200px-COROS_Wearables_Logo.png',
        customSpacing: 'p-2.5 4xl:py-4 pt-3 4xl:pt-4.5',
    },
    {
        alt: 'Apple-Watch-Logo',
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Apple_Watch_official_logo.svg/1280px-Apple_Watch_official_logo.svg.png',
        customSpacing: 'p-2.5 4xl:py-4 pb-3 4xl:pb-4.5',
    },
];

const distances = ['1MI', '5K', '10K', '13.1', '26.2'];

const sampleTrainingPlan = [
    {
        day: 'Mon',
        workout: 'Easy',
    },
    {
        day: 'Tue',
        workout: 'Hard',
    },
    {
        day: 'Wed',
        workout: 'Easy',
    },
    {
        day: 'Thu',
        workout: 'Tempo',
    },
    {
        day: 'Fri',
        workout: 'Easy',
    },
    {
        day: 'Sat',
        workout: 'Long',
    },
    {
        day: 'Sun',
        workout: 'Rest',
    },
];

const StepElement = ({ step }: { step: number }) => {
    const [selectedExertion, setSelectedExertion] = useState(0);

    return step === 1 ? (
        <div className='relative overflow-hidden w-full h-14 4xl:h-18'>
            <div className='absolute flex w-max animate-scroll-logos'>
                {[...fitnessTrackerImages, ...fitnessTrackerImages].map(({ alt, src, customSpacing }, index) => (
                    <motion.div
                        key={alt + index}
                        initial={{ filter: 'grayscale(100%) brightness(150%)', scale: 1 }}
                        whileHover={{ filter: 'grayscale(0%) brightness(100%)', scale: 1.05 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <img src={src} alt={alt} className={`h-14 4xl:h-18  grid place-items-center object-cover cursor-pointer ${customSpacing}`} />
                    </motion.div>
                ))}
            </div>
        </div>
    ) : step === 2 ? (
        <div className='relative overflow-hidden w-full h-14 4xl:h-18'>
            <div className='absolute flex w-max animate-scroll-plans gap-2'>
                {[...distances, ...distances].map((distance, index) => (
                    <motion.div
                        key={distance + index}
                        initial={{ filter: 'grayscale(100%)', scale: 1 }}
                        whileHover={{ filter: 'grayscale(0%)', scale: 1.05 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='relative cursor-pointer'
                    >
                        <motion.div
                            key={distance + index}
                            className='h-14 4xl:h-18 w-22 bg-gradient-to-br from-[#f04f41] to-[#ec4899] transition-all duration-500 ease-in-out cursor-pointer [mask-image:url(/olive-branches-award.png)] [-webkit-mask-image:url(/olive-branches-award.png)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]'
                        />
                        <span
                            key={index}
                            style={{ backgroundImage: 'linear-gradient(90deg, #f04f41 0%, #f06741 20%, #ec4899 50%, #fc6868 80%, #f04f41 100%)' }}
                            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-figtree font-extrabold text-base text-transparent bg-clip-text'
                        >
                            {distance}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    ) : step === 3 ? (
        <div className='flex justify-between w-full h-14 4xl:h-18 gap-1 pt-1'>
            {sampleTrainingPlan.map(({ day, workout }) => (
                <motion.div key={day} initial='none' whileHover='hover' className='cursor-pointer flex flex-col gap-0.5 w-full font-figtree text-white'>
                    <motion.span
                        variants={{
                            none: { filter: 'grayscale(100%) brightness(120%)', scale: 1, height: '100%' },
                            hover: { filter: 'grayscale(0%) brightness(100%)', scale: 1.05, height: '60%' },
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='font-bold text-base 4xl:text-lg grid place-items-center bg-gradient-to-br from-[#f04f41] to-[#ec4899] rounded-full'
                    >
                        {day}
                    </motion.span>
                    <motion.span
                        variants={{
                            none: { filter: 'grayscale(100%) brightness(120%)', scale: 0.5, height: '0%' },
                            hover: { filter: 'grayscale(0%) brightness(100%)', scale: 1.05, height: '40%' },
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='text-sm 5xl:text-base grid place-items-center bg-gradient-to-br from-[#f04f41] to-[#ec4899] rounded-full'
                    >
                        {workout}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    ) : (
        step === 4 && (
            <div className='flex items-end gap-0.5 h-14 4xl:h-18 w-full pt-1'>
                {Array.from({ length: 10 }, (_, index) => index + 1)
                    .fill(1, 10)
                    .map((level) => (
                        <motion.div
                            key={level}
                            onClick={() => setSelectedExertion(selectedExertion === level ? 0 : level)}
                            initial='none'
                            whileHover='hover'
                            animate={level <= selectedExertion ? 'active' : 'none'}
                            variants={{ none: { filter: 'grayscale(100%)', scale: 1 }, hover: { filter: 'grayscale(0%)', scale: 1.05 }, active: { filter: 'grayscale(0%)' } }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className='cursor-pointer bg-gradient-to-br rounded-lg from-[#f04f41] to-[#ec4899] w-full font-figtree text-white grid place-items-center'
                            style={{ height: `${level * 8 + 20}%` }}
                        ></motion.div>
                    ))}
            </div>
        )
    );
};

export default HowItWorks;
