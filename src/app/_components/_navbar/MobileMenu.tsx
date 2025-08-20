import { useState, useEffect } from 'react';
import { useAnimate, stagger, motion } from 'framer-motion';
import { NavLink } from './Navbar';
import { GradientBackground } from '../_landing/gradient-background';
import Link from 'next/link';

const useMenuAnimation = (isOpen: boolean) => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const menuAnimations: any = isOpen
            ? [
                  ['nav', { transform: 'translateY(100%)' }, { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.25 }],
                  //   ['li', { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { delay: stagger(0.02), at: '-0.1' }],
              ]
            : [
                  //   ['li', { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' }],
                  ['nav', { transform: 'translateY(0)' }],
              ];

        animate([...menuAnimations]);
    }, [isOpen]);

    return scope;
};

const MobileMenu = ({ isOpen, setIsOpen, links }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; links: NavLink[] }) => {
    const scope = useMenuAnimation(isOpen);

    return (
        <>
            <div ref={scope}>
                <MenuItems links={links} isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </>
    );
};

const MenuItems = ({ links, isOpen, setIsOpen }: { links: NavLink[]; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <nav className='block navbar-md:hidden fixed top-0 bottom-0 right-0 w-full min-h-full translate-y-[-100%] will-change-transform z-[50] overflow-y-auto px-5 pt-26 navbar-sm:pt-28'>
            <GradientBackground className='overflow-y-auto p-6 pb-4 navbar-sm:p-8 navbar-sm:pb-5 h-auto rounded-3xl navbar-sm:rounded-4xl shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary w-full max-w-max-width from-background-light via-[#FFEDDD] to-background-light'>
                <ul className='flex flex-col items-start gap-4'>
                    {links.map(({ name, href }) => (
                        <li key={name} className='text-[22px] leading-[1.4] navbar-sm:text-2xl w-full font-figtree font-semibold text-primary hover:text-primary/80 transition-colors duration-200'>
                            <a href={href} onClick={() => setIsOpen(false)}>
                                {name}
                            </a>
                            <div className='w-full h-[1px] bg-primary mt-4' />
                        </li>
                    ))}
                </ul>
                <span className='w-full flex flex-col navbar-sm:flex-row gap-2 mt-4'>
                    <Link
                        href='/sign-in'
                        className='grid place-items-center rounded-full py-2 w-full font-figtree font-bold text-primary border-2 border-primary hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                    >
                        Sign In
                    </Link>
                    <Link
                        href='/get-started'
                        className='grid place-items-center rounded-full py-2 w-full font-figtree font-bold text-background-light border-2 border-primary bg-primary hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                    >
                        Get Started
                    </Link>
                </span>
            </GradientBackground>
        </nav>
    );
};

export default MobileMenu;
