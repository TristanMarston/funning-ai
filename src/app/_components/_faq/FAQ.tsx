'use client';

import { scrollVariants } from '@/app/context';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'motion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

type Page = 'landing' | 'pricing';
type Question = {
    question: string;
    answer: () => ReactNode;
};

const questions = (page: Page): Question[] => {
    if (page === 'landing') {
        return [];
    } else if (page === 'pricing') {
        return [
            {
                question: 'Why is there no free option?',
                answer: () => (
                    <p className='prose prose-sm max-w-none'>
                        We believe that offering free plans can often lead to compromised quality and limited features. By focusing on paid plans, we ensure that our product remains
                        robust and reliable for all users.
                    </p>
                ),
            },
            {
                question: 'Which plan can I try for free?',
                answer: () => (
                    <p className='prose prose-sm max-w-none'>
                        You can try out either our Pro Plan or Coach Plan without any cost for the first 30 days. This allows you to experience the full range of features and benefits
                        before committing to a certain plan.
                        <br />
                        <br />
                        We don&apos;t offer free trials for the Runner Plan because we want you to fully experience the value of our higher-tier plans first.
                    </p>
                ),
            },
            {
                question: 'What payment methods do you accept?',
                answer: () => <p className='prose prose-sm max-w-none'>We accept all major credit and debit cards, including Visa, MasterCard, American Express, and Discover.</p>,
            },
            {
                question: 'What happens if I cancel my plan?',
                answer: () => (
                    <p className='prose prose-sm max-w-none'>
                        If you cancel your plan within the 30-day free trial period, you will not be charged. If you cancel after the trial period, your subscription will remain active
                        until the end of the current billing cycle, and you will not be charged for the next cycle.
                    </p>
                ),
            },
            {
                question: 'Can I pay in other currencies?',
                answer: () => <p className='prose prose-sm max-w-none'>Currently, we only accept payments in USD.</p>,
            },
        ];
    } else return [];
};

const borderVariants: Variants = {
    closed: {
        borderColor: 'rgba(240, 79, 65, 0)',
        transition: { duration: 0.3 },
    },
    open: {
        borderColor: 'rgba(240, 79, 65, 1)',
        transition: { duration: 0.3 },
    },
};

const hoverVariants: Variants = {
    unhovered: {
        boxShadow: '0px 0px 0px rgba(240,79,65,0)',
        transition: { duration: 0.3 },
    },
    hovered: {
        boxShadow: '0px 4px 30px rgba(240,79,65,0.3)',
        transition: { duration: 0.3 },
    },
};

const FAQ = ({ page, animate }: { page: Page; animate: boolean }) => {
    const questionsList = questions(page);
    const [questionsOpen, setQuestionsOpen] = useState<boolean[]>(new Array(questionsList.length).fill(false));

    const toggleQuestion = (index: number) => {
        setQuestionsOpen((prev) => prev.map((isOpen, i) => (i === index ? !isOpen : false)));
    };

    const { ref: titleRef, controls: titleControls } = useScrollAnimation();
    const { ref: questionsRef, controls: questionsControls } = useScrollAnimation();

    return (
        <div className='w-full max-w-[1080px] mt-12 flex flex-col gap-4 3xl:flex-row'>
            <motion.div ref={titleRef} initial='hidden' animate={titleControls} variants={scrollVariants(0.2)} className='font-figtree'>
                <h2 className='text-3xl leading-[1] min-[330px]:text-4xl min-[390px]:text-[44px] lg:text-5xl xl:text-[54px] 3xl:text-[50px] 3xl:leading-[1.2] 4xl:text-[54px] font-extrabold text-center 3xl:text-left'>
                    Frequently Asked Questions
                </h2>
            </motion.div>
            <motion.div ref={questionsRef} initial='hidden' animate={questionsControls} variants={scrollVariants(0.25)} className='flex flex-col gap-2 font-figtree'>
                {questionsList.map((questionObject, index) => (
                    <AccordionItem key={index} questionObject={questionObject} index={index} isOpen={questionsOpen[index]} toggleQuestion={toggleQuestion} />
                ))}
            </motion.div>
        </div>
    );
};

const AccordionItem = ({ questionObject, index, isOpen, toggleQuestion }: { questionObject: Question; index: number; isOpen: boolean; toggleQuestion: (arg0: number) => void }) => {
    const { question, answer } = questionObject;

    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const answerVariants: Variants = {
        closed: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            marginBottom: 0,
        },
        open: {
            opacity: 1,
            height: contentHeight,
            marginTop: '8px',
            marginBottom: '8px',
        },
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [answer]);

    return (
        <motion.div
            key={index}
            variants={borderVariants}
            animate={isOpen ? 'open' : 'closed'}
            initial='closed'
            className='border flex flex-col justify-center rounded-2xl py-2 px-2 cursor-pointer overflow-hidden'
        >
            <motion.div
                variants={hoverVariants}
                initial='unhovered'
                whileHover={isOpen ? 'unhovered' : 'hovered'}
                className='flex justify-between items-center rounded-xl py-2 px-2'
                onClick={() => toggleQuestion(index)}
            >
                <h3 className='text-lg lg:text-xl font-semibold text-gray-900'>{question}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className='w-5 h-5 text-gray-500' />
                </motion.div>
            </motion.div>

            <motion.div
                key='answer'
                ref={contentRef}
                variants={answerVariants}
                initial='closed'
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='text-gray-700 px-2 overflow-hidden text-base lg:text-[17px]'
            >
                {answer()}
            </motion.div>
        </motion.div>
    );
};

export default FAQ;
