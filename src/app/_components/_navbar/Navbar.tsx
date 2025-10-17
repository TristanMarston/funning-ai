'use client';

import { useEffect, useState, forwardRef } from 'react';
import Image from 'next/image';
import { Lora } from 'next/font/google';
import Link from 'next/link';
import { GradientBackground } from '../_landing/gradient-background';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import { motion } from 'motion/react';
import { scrollVariants } from '@/app/context';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
// 'shadow-[0_4px_30px_rgba(0,0,0,.15)]'

export type NavLink = {
    name: string;
    href: string;
};

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { ref: navbarRef, controls: navbarControls } = useScrollAnimation();

    const navLinks: NavLink[] = [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'Features',
            href: '/features',
        },
        {
            name: 'Pricing',
            href: '/pricing',
        },
    ];

    return (
        <>
            <motion.section
                ref={navbarRef}
                initial='hidden'
                animate={navbarControls}
                variants={scrollVariants()}
                transition={{
                    ease: 'anticipate',
                    duration: 1,
                }}
                className='w-screen fixed top-0 backdrop-blur-sm px-5 z-[100] flex justify-center'
            >
                <GradientBackground className='flex items-center justify-between h-16 mt-5 rounded-full shadow-[0px_5px_0px_0px_rgba(240,79,65)] border-2 border-primary px-5 w-full max-w-max-width from-background-light via-[#FFEDDD] to-background-light'>
                    <Link href='/' className='flex items-center gap-2'>
                        <Image src='/funning-logo-orange.png' alt='Funning Logo' className='w-9 h-9 navbar-lg:w-10 navbar-lg:h-10' width={100} height={100} />
                        <h1 className='font-figtree text-[22px] navbar-lg:text-2xl font-extrabold'>Funning AI</h1>
                    </Link>
                    <div className='hidden 4xl:flex gap-6 font-figtree font-semibold text-base'>
                        <NavbarLinks links={navLinks} />
                    </div>
                    <div className='hidden navbar-md:flex gap-2 items-center font-figtree font-bold text-base'>
                        <div className='flex 4xl:hidden gap-6 font-figtree font-semibold text-base mr-3'>
                            <NavbarLinks links={navLinks} />
                        </div>
                        <Link
                            href='/sign-in'
                            className='grid place-items-center rounded-full py-1 px-4 navbar-lg:px-5 text-[15px] navbar-lg:text-base text-primary border-2 border-primary hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                        >
                            Sign In
                        </Link>
                        <Link
                            href='/get-started'
                            className='grid place-items-center rounded-full py-1 px-4 navbar-lg:px-5 text-[15px] navbar-lg:text-base text-background-light border-2 border-primary bg-primary hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                        >
                            Get Started
                        </Link>
                    </div>
                    <MenuToggle className='navbar-md:hidden' toggle={() => setMenuOpen((prev) => !prev)} isOpen={menuOpen} color='#f04f41' />
                </GradientBackground>
            </motion.section>
            <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} links={navLinks} />
        </>
    );
};

const NavbarLinks = ({ links }: { links: NavLink[] }) => {
    return links.map(({ name, href }) => (
        <Link key={name} href={href} className='hover:text-primary transition-all duration-200 text-[15px] navbar-lg:text-base'>
            {name}
        </Link>
    ));
};

export default Navbar;
