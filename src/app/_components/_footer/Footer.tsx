import { GradientBackground } from '../_landing/gradient-background';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <GradientBackground animated={false} className='relative w-full pb-6 flex flex-col items-center'>
            <Image className='absolute -top-1 w-full rotate-180' src='landing-white-wave.svg' alt='wave' width={1000} height={50} />
            <div className='max-w-max-width w-full px-5 flex flex-col items-center 2xl:flex-row 2xl:justify-between 2xl:items-start 2xl:px-10'>
                <section className='grid gap-2 place-items-center mt-20 2xl:mt-24 5xl:mt-32 8xl:mt-36 10xl:mt-42'>
                    <Image src='/funning-logo-orange.png' alt='Funning Logo' className='w-48 h-48' width={100} height={100} />
                    <h3 className='font-figtree font-extrabold text-4xl text-primary text-center text-shadow-xs'>Funning AI</h3>
                    <h5 className='font-figtree font-bold text-xl text-shadow-xs text-center'>Push your limits without <br className='hidden 2xl:block' /> pushing your luck.</h5>
                </section>
                <div className='block 2xl:hidden w-full lg:w-[90%] h-0.25 rounded-full bg-primary my-5 shadow-sm' />
                <section className='flex flex-col items-center justify-center gap-4 2xl:mt-24 5xl:mt-32 8xl:mt-36 10xl:mt-42 xs:grid xs:grid-cols-2 xs:grid-rows-1 xs:gap-10 xs:items-start'>
                    <div className='font-figtree flex flex-col gap-2 items-center'>
                        <h6 className='text-primary text-lg text-center font-semibold'>Why Funning</h6>
                        {[
                            { title: 'Our Story', href: '#' },
                            { title: 'Blog', href: '#' },
                        ].map(({ title, href }) => (
                            <Link key={title} href={href} className='text-center'>
                                {title}
                            </Link>
                        ))}
                    </div>
                    <div className='font-figtree flex flex-col gap-2 items-center'>
                        <h6 className='text-primary text-lg text-center font-semibold'>Product</h6>
                        {[
                            { title: 'Features', href: '#' },
                            { title: 'Pricing', href: '#' },
                            { title: 'FAQ', href: '#' },
                        ].map(({ title, href }) => (
                            <Link key={title} href={href} className='text-center'>
                                {title}
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
            <div className='px-5 2xl:px-10 max-w-max-width w-full'>
                <div className='w-full lg:w-[90%] 2xl:w-full h-0.25 rounded-full bg-primary my-5 shadow-sm' />
                <p className='text-gray-500 font-figtree text-center 2xl:text-left'>&copy; {new Date().getFullYear()} Funning AI, Inc. All Rights Reserved.</p>
            </div>
        </GradientBackground>
    );
};

export default Footer;
