import Image from "next/image";
import FormButton from "../form/FormButton";
import RedirectButton from "../button/RedirectButton";
import { MINT_APP_LINK } from "@/config";

export default function Hero() {
  return (
    <section className="px-4 md:px-8 mt-4">
      <div className="bg-mossgreen rounded-2xl flex flex-col lg:flex-row md:gap-12 justify-between items-stretch relative overflow-hidden">
        <div
          style={{
            mask: "linear-gradient(to top, #000, transparent 95%)",
          }}
          className="absolute w-full md:w-[80%] h-[60%] md:h-full bottom-0 md:top-0 md:-right-20 overflow-hidden opacity-50"
        >
          <Image
            src="/assets/bg/dots.svg"
            alt="wave-svg"
            fill
            priority
            className="w-full h-full object-cover md:object-contain xl:translate-y-0"
          />
        </div>

        <div className="flex flex-col items-start p-8 md:py-14 md:px-12 relative">
          <h1 className="text-4xl md:text-5xl text-white font-semibold leading-snug md:leading-relaxed max-w-lg">
            The App for Real Estate Tokenization, Trades and Loans
          </h1>
          <p className="text-neutral-400 text-xk md:text-2xl mt-4">
            Turn your property into a tradeable digital asset, buy, sell
            <br className="hidden md:inline" /> and get instant loans on the
            world biggest capital market.
          </p>
          <RedirectButton
            title={"Get Started"}
            redirectTo={MINT_APP_LINK}
            className={
              "bg-lemongrass px-6 py-4 rounded-lg text-mossgreen mt-10 md:mt-12 text-sm md:text-base font-semibold tracking-wide transition-colors hover:bg-lemongrass/90"
            }
          />
        </div>

        <div className="relative max-w-2xl grow h-[320px] lg:h-auto">
          <Image
            src="/assets/images/hero/propex-cards.png"
            alt="propix-house-cards"
            fill
            sizes="(min-width: 768px) 1500px, 768px"
            className="object-contain px-4 md:p-12"
            priority
          />
        </div>
      </div>
    </section>
  );
}
