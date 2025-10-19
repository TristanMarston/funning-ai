import Footer from '../_components/_footer/Footer';
import Navbar from '../_components/_navbar/Navbar';
import PricingPage from './PricingPage';


const page = () => {
    return (
        <>
            <div className='w-full h-fit flex flex-col items-center'>
                <Navbar />
                <PricingPage />
            </div>
            <Footer />
        </>
    );
}

export default page;
