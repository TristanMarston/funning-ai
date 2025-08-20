import Navbar from './_components/_navbar/Navbar';
import Hero from './_components/_landing/_hero/Hero';
import HowItWorks from './_components/_landing/_steps/HowItWorks';

export default function Home() {
    return (
        <>
            <div className='w-full h-fit flex flex-col items-center'>
                <Navbar />
                <Hero />
                <HowItWorks />
            </div>
        </>
    );
}
