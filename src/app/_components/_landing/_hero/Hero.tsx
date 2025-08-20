'use client';

import { GradientBackground } from '../gradient-background';
import Image from 'next/image';
import { GradientText } from '../gradient-text';
import { CircleArrowRight, Sparkles } from 'lucide-react';
import HeroVisualElement from './HeroVisualElement';
import { motion } from 'motion/react';
import { scrollVariants } from '@/app/context';

const Hero = () => {
    return (
        <div className='relative w-full'>
            <GradientBackground className='pt-30 hero-sm:pt-32 hero-md:pt-36 hero-xl:pt-40 pb-16 hero-xs:pb-20 hero-sm:pb-28 hero-md:pb-32 hero-lg:pb-40 6xl:pb-48 9xl:pb-56 px-5 flex flex-col items-center'>
                <div className='flex flex-col items-center px-2 min-[600px]:px-4 hero-md:px-6 hero-lg:px-10 gap-10 max-w-max-width w-full'>
                    <div className='flex flex-col items-center justify-center gap-2 w-full 5xl:w-[95%] 8xl:w-[90%]'>
                        {/* <div className='font-figtree flex items-center cursor-default gap-2 rounded-full w-fit py-1 text-orange-700 px-3 font-medium bg-orange-200 border-1 border-orange-300'>
                            <Sparkles className='w-[22px] h-[22px] text-orange-700' />
                            <span>AI-POWERED</span>
                        </div> */}
                        <motion.h1
                            initial='hidden'
                            whileInView='visible'
                            variants={scrollVariants()}
                            transition={{ ease: 'anticipate', duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                            className='font-figtree font-extrabold leading-[1] text-[32px] hero-min:text-[36px] hero-xxxs:text-[40px] hero-xxs:text-[43px] hero-xs:text-[50px] hero-sm:text-[58px] hero-lg:text-[64px] hero-xl:text-[72px] hero-max:text-[80px] mb-2.5 hero-xl:mb-3 text-center'
                        >
                            <GradientText text='Push your limits' /> without <br className='hidden hero-md:block' /> pushing your luck.
                        </motion.h1>
                        <motion.h4
                            initial='hidden'
                            whileInView='visible'
                            variants={scrollVariants()}
                            transition={{ ease: 'anticipate', duration: 1, delay: 0.15 }}
                            viewport={{ once: true }}
                            className='font-figtree text-center text-base hero-xxs:text-[17px] hero-xs:text-[18px] hero-lg:text-[19px] hero-xl:text-[20px] hero-max:text-[22px] text-gray-500 mb-2 hero-xl:mb-4'
                        >
                            Personalized AI coaching that keeps you <GradientText text='on track and injury free.' />
                        </motion.h4>
                        <motion.div
                            initial='hidden'
                            whileInView='visible'
                            variants={scrollVariants()}
                            transition={{ ease: 'anticipate', duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            className='flex flex-col hero-xs:flex-row gap-3 w-full hero-xs:w-auto'
                        >
                            <button className='flex justify-center hero-xs:justify-start gap-1 py-1.5 hero-xs:py-2 px-4.5 rounded-full bg-primary text-white shadow-[0_4px_30px_rgba(0,0,0,.15)] hover:scale-[1.025] hover:brightness-[1.05] transition-all items-center cursor-pointer'>
                                <span className='font-figtree font-semibold hero-xs:text-[15px] hero-sm:text-base hero-max:text-lg'>Start Your Journey</span>
                                <CircleArrowRight className='w-8' />
                            </button>
                            <button className='flex justify-center hero-xs:justify-start gap-1 py-1.5 hero-xs:py-2 px-4.5 rounded-full bg-transparent text-primary border-2 border-primary shadow-[0_4px_30px_rgba(0,0,0,.15)] hover:scale-[1.025] hover:brightness-[1.05] transition-all items-center cursor-pointer'>
                                <span className='font-figtree font-semibold hero-xs:text-[15px] hero-sm:text-base hero-max:text-lg'>Learn More</span>
                                <CircleArrowRight className='w-8 rotate-90' />
                            </button>
                        </motion.div>
                    </div>
                    <motion.div
                        initial='hidden'
                        whileInView='visible'
                        variants={scrollVariants()}
                        transition={{ ease: 'anticipate', duration: 1, delay: 0.25 }}
                        viewport={{ once: true }}
                        className='grid place-items-center w-full'
                    >
                        <HeroVisualElement />
                    </motion.div>
                </div>
            </GradientBackground>
            <Image className='absolute bottom-0 w-full' src='landing-white-wave.svg' alt='wave' width={1000} height={50} />
        </div>
    );
};

export default Hero;
