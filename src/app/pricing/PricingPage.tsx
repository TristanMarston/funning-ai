'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GradientText } from '../_components/_landing/gradient-text';
import { motion } from 'motion/react';
import { scrollVariants } from '../context';
import Pricing from './Pricing';
import FAQ from '../_components/_faq/FAQ';

const PricingPage = () => {
    const { ref: h1Ref, controls: h1Controls } = useScrollAnimation();
    const { ref: h4Ref, controls: h4Controls } = useScrollAnimation();

    return (
        <div className='max-w-max-width w-full pt-30 hero-sm:pt-32 hero-md:pt-36 hero-xl:pt-40 pb-16 hero-xs:pb-20 hero-sm:pb-28 hero-md:pb-32 hero-lg:pb-40 6xl:pb-48 9xl:pb-56 px-5 flex flex-col items-center'>
            <motion.h1
                ref={h1Ref}
                initial='hidden'
                animate={h1Controls}
                variants={scrollVariants(0.1)}
                className='font-figtree font-extrabold leading-[1] text-[36px] min-[350px]:text-[40px] cm:text-[46px] min-[450px]:text-[52px] lg:text-[59.5px] 3xl:text-[55px] 4xl:text-[62px] 5xl:text-[70px] min-[1150px]:text-[80px] mb-4 hero-xl:mb-5 text-center'
            >
                Try any plan <br className='block 3xl:hidden' /> <GradientText text='free for 30 days.' />
            </motion.h1>
            <motion.h4
                ref={h4Ref}
                initial='hidden'
                animate={h4Controls}
                variants={scrollVariants(0.15)}
                className='font-figtree text-center text-sm min-[340px]:text-[15px] min-[370px]:text-base hero-xxs:text-[17px] hero-xs:text-[18px] hero-lg:text-[19px] hero-xl:text-[20px] hero-max:text-[22px] text-gray-500 mb-4 hero-xl:mb-5'
            >
                Transparent, simple plans that <GradientText text='match your needs.' />
            </motion.h4>
            <Pricing />
            <FAQ page='pricing' animate />
        </div>
    );
};

export default PricingPage;
