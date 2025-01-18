import { LenisProvider } from "../_providers/LenisProvider";
import Perks from "../_components/home/Perks/Perks";
import Navbar from "../_components/home/Navbar/Navbar";
import Hero from "../_components/home/Hero";
import AboutUs from "../_components/home/AboutUs";
import LocationAndJoin from "../_components/home/LocationAndJoin";
import Footer from "../_components/home/Footer";
import Sell from "../_components/home/Sell";
import Features from "../_components/home/Features";
import HowItWorks from "../_components/home/HowItWorks";
import FormModal from "../_components/form/FormModal";
import { Toaster } from "react-hot-toast";
import SmartMap from "../_components/home/SmartMap";

export default function Home() {
  return (
    <>
      <LenisProvider />
      <main className="pb-20 w-full flex flex-col items-center">
        <div className="w-full max-w-[1480px]">
          <Navbar />
        </div>

        <div className="w-full max-w-[1480px]">
          <Hero />
        </div>

        <div className="w-full max-w-[1480px]">
          <SmartMap />
        </div>

        {/* <div className="w-full max-w-[1480px]">
          <Sell />
        </div> */}

        <div className="w-full max-w-[1480px]">
          <AboutUs />
        </div>

        <div className="w-full max-w-[1480px]">
          <Features />
        </div>

        <div className="w-full">
          <HowItWorks />
        </div>

        <div className="w-full max-w-[1480px]">
          <Perks />
        </div>

        <div className="w-full max-w-[1480px]">
          <LocationAndJoin />
        </div>

        <div className="w-full max-w-[1480px]">
          <Footer />
        </div>
      </main>

      {/* Temporary form modal */}
      <FormModal />
      <Toaster />
    </>
  );
}
