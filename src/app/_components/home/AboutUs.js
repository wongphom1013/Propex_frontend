import Image from "next/image";
import FormButton from "../form/FormButton";
import RedirectButton from "../button/RedirectButton";
import { MINT_APP_LINK } from "@/config";

export default function AboutUs() {
  return (
    <section id="smartmap-section" className="px-4 md:px-8 mt-24 md:mt-40">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:flex-1 max-w-2xl rounded-xl h-[430px] w-full md:w-auto bg-neutral-400 overflow-hidden relative">
          <Image
            src={"/assets/images/about/smart-map.jpg"}
            alt="about-us"
            fill
            sizes="800px"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:flex-1 flex flex-col items-start">
          <p className="px-5 py-2 rounded-full border border-black text-xs">
            PROPEX SMART MAP
          </p>
          <p className="text-3xl md:text-[40px] font-medium mt-6 max-w-xl md:leading-snug">
            Mint & Earn! Create addresses and help us put real world assets
            on-chain
          </p>

          <p className="text-neutral-400 mt-5 max-w-xl text-lg md:text-xl">
            Whether you own a property or not, you can participate by minting
            addresses (create NFTs), and help us bring properties and point of
            interest on our SmartMap. Every mint gives you future redeemable
            points.
          </p>

          <RedirectButton
            title={"Mint an address"}
            redirectTo={MINT_APP_LINK}
            className="bg-mossgreen text-lemongrass rounded-lg px-3 py-2 md:px-8 md:py-3 mt-6 font-semibold tracking-wide transition-colors hover:bg-mosgreen/90"
          />
        </div>
      </div>
    </section>
  );
}
