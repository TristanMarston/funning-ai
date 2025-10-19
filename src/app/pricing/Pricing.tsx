'use client';

import { motion, Variants } from 'motion/react';
import { useState } from 'react';
import { GradientBackground } from '../_components/_landing/gradient-background';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { childVariants, pricing, scrollVariants } from '../context';
import { BadgeCheck } from 'lucide-react';

type PlanType = 'annual' | 'monthly';

const Pricing = () => {
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
    const { ref: planTypeRef, controls: planTypeControls } = useScrollAnimation();
    const { ref: cardsRef, controls: cardsControls } = useScrollAnimation();

    const plansDelay = 0.3;
    const childrenDelay = 0.1;
    const childrenDifference = 0.2;
    const childrenDuration = 0.8;

    return (
        <motion.div ref={planTypeRef} initial='hidden' animate={planTypeControls} variants={scrollVariants(0.2)} className='w-full flex flex-col items-center'>
            <GradientBackground className='flex items-center w-auto p-2 gap-4 rounded-full shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary'>
                {(['annual', 'monthly'] as PlanType[]).map((plan) => (
                    <PricingChip key={plan} text={plan} selected={selectedPlan === plan} setSelected={setSelectedPlan} />
                ))}
            </GradientBackground>
            <motion.div
                ref={cardsRef}
                initial='hidden'
                animate={cardsControls}
                variants={scrollVariants(plansDelay, 1, childrenDifference)}
                className='flex flex-col 3xl:flex-row gap-4 w-full max-w-[1080px] mt-7 3xl:mt-12 font-figtree'
            >
                {/* RUNNER PLAN */}
                <motion.div
                    variants={scrollVariants(plansDelay + childrenDelay, childrenDuration)}
                    className='shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary rounded-2xl p-5 w-full 3xl:w-1/3'
                >
                    <GradientBackground animated={false} className='w-full p-4 rounded-2xl shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary'>
                        <h3 className='font-semibold text-[26px] cm:text-[28px] mb-1'>Runner Plan</h3>
                        <h5 className='font-[500] text-[15px] sm:text-base'>
                            <span className='font-bold text-[19px] sm:text-xl'>${selectedPlan === 'annual' ? pricing.runner.annual : pricing.runner.monthly}</span> per month, billed{' '}
                            {selectedPlan === 'annual' ? 'annually' : 'monthly'}
                        </h5>
                    </GradientBackground>
                    <button className='w-full cursor-pointer font-bold text-lg mt-4 py-2 rounded-2xl border-2 border-primary grid place-items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:bg-background-light transition-colors'>
                        Get Started
                    </button>
                    <div className='flex flex-col gap-3.5 px-2 mt-4'>
                        {pricing.runner.benefits.map((benefit) => (
                            <span key={benefit} className='flex items-center gap-2'>
                                <BadgeCheck className='text-primary h-6' />
                                <p className='font-[500]'>{benefit}</p>
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* PRO PLAN */}
                <motion.div
                    variants={scrollVariants(plansDelay + childrenDelay + childrenDifference, childrenDuration)}
                    className='shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary rounded-2xl w-full 3xl:w-1/3 relative 3xl:-top-3 3xl:scale-[1.02] h-auto'
                >
                    <GradientBackground gradient='from-primary/30 via-secondary-orange/30 to-light-pink/30' className='p-5 rounded-2xl'>
                        <div className='w-full p-4 shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary rounded-2xl'>
                            <h3 className='font-semibold text-[26px] cm:text-[28px] mb-1'>Pro Plan</h3>
                            <h5 className='font-[500] text-[15px] sm:text-base'>
                                <span className='font-bold text-[19px] sm:text-xl'>${selectedPlan === 'annual' ? pricing.pro.annual : pricing.pro.monthly}</span> per month, billed{' '}
                                {selectedPlan === 'annual' ? 'annually' : 'monthly'}
                            </h5>
                        </div>
                        <button className='w-full cursor-pointer font-bold text-lg mt-4 py-2 rounded-2xl text-white bg-gradient-to-br from-[#f04f41] to-[#ec4899] grid place-items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:brightness-[1.25] transition-all'>
                            Start Your Journey
                        </button>
                        <div className='flex flex-col gap-3.5 px-2 mt-4'>
                            {pricing.pro.benefits.map((benefit) => (
                                <span key={benefit} className='flex items-center gap-2'>
                                    <BadgeCheck className='text-primary h-6' />
                                    <p className='font-[500]'>{benefit}</p>
                                </span>
                            ))}
                        </div>
                    </GradientBackground>
                </motion.div>

                {/* COACH PLAN */}
                <motion.div
                    variants={scrollVariants(plansDelay + childrenDelay + childrenDifference * 2, childrenDuration)}
                    className='shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary rounded-2xl p-5 w-full 3xl:w-1/3 relative h-auto'
                >
                    <GradientBackground animated={false} className='w-full p-4 shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary rounded-2xl'>
                        <h3 className='font-semibold text-[26px] cm:text-[28px] mb-1'>Coach Plan</h3>
                        <h5 className='font-[500] text-[15px] sm:text-base'>
                            <span className='font-bold text-[19px] sm:text-xl'>${pricing.coach.annual}</span> per month, billed annually
                        </h5>
                    </GradientBackground>
                    <button className='w-full cursor-pointer font-bold text-lg mt-4 py-2 rounded-2xl border-2 border-primary grid place-items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:bg-background-light transition-colors'>
                        Get Started
                    </button>
                    <div className='flex flex-col gap-3.5 px-2 mt-4'>
                        {pricing.coach.benefits.map((benefit) => (
                            <span key={benefit} className='flex items-center gap-2'>
                                <BadgeCheck className='text-primary h-6' />
                                <p className='font-[500]'>{benefit}</p>
                            </span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const PricingChip = ({ text, selected, setSelected }: { text: PlanType; selected: boolean; setSelected: React.Dispatch<React.SetStateAction<PlanType>> }) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${
                selected ? 'text-white' : 'text-black'
            } font-figtree font-bold text-sm xs:text-[15px] min-[450px]:text-base min-[1150px]:text-[17px] capitalize cursor-pointer transition-colors relative py-1 px-5 rounded-full`}
        >
            <span className='relative z-10'>{text}</span>
            {selected && (
                <motion.span
                    layoutId='pill-tab'
                    transition={{ type: 'spring', duration: 0.5 }}
                    className='absolute inset-0 z-0 rounded-full bg-gradient-to-br from-[#f04f41] to-[#ec4899] w-full'
                ></motion.span>
            )}
        </button>
    );
};

export default Pricing;
