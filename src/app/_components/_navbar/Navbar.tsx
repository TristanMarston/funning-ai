'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GradientBackground } from '../_landing/GradientBackground';
import MenuToggle from './MenuToggle';
import MobileMenu from './MobileMenu';
import { motion } from 'motion/react';
import { scrollVariants } from '@/app/context';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
                className='w-dvw fixed top-0 backdrop-blur-sm px-5 z-[100] flex justify-center'
            >
                <div className='flex items-center justify-between h-17 mt-5 rounded-full navbar-gradient-border px-5 w-full max-w-max-width'>
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
                            href='/start?mode=signin'
                            className='grid place-items-center rounded-full py-1 px-4 navbar-lg:px-5 text-[15px] navbar-lg:text-base text-primary-purple border-2 border-primary-purple hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                        >
                            Sign In
                        </Link>
                        <Link
                            href='/start?mode=signup'
                            className='grid place-items-center rounded-full py-1 px-4 navbar-lg:px-5 text-[15px] navbar-lg:text-base text-background border-2 border-primary-purple bg-primary-purple hover:scale-[1.025] hover:brightness-[1.05] transition-all'
                        >
                            Get Started
                        </Link>
                    </div>
                    <MenuToggle className='navbar-md:hidden' toggle={() => setMenuOpen((prev) => !prev)} isOpen={menuOpen} color='#a144f8' />
                </div>
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
