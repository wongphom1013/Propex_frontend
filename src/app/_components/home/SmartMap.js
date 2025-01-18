import Image from "next/image";
import FormButton from "../form/FormButton";
import RedirectButton from "../button/RedirectButton";
import { MINT_APP_LINK } from "@/config";

export default function SmartMap() {
  return (
    <section id="tokenize-section" className="px-4 md:px-8 mt-24">
      <div className="w-full flex flex-col items-center">
        <p className="px-5 py-2 rounded-full border border-black text-xs">
          TOKENIZE
        </p>
        <h2 className="text-3xl md:text-[40px] font-medium mt-6 max-w-5xl text-center md:leading-snug text-balance">
          Tokenize your property and sell it or borrow against it thanks to
          Decentralized Finance
        </h2>

        <div className="relative h-[200px] md:h-[400px] w-full max-w-6xl mt-12">
          <Image
            src={"/assets/images/smart-map/step.png"}
            fill
            sizes="(min-width: 768px) 2000px, 800px"
            alt="smart-map-step"
            className="object-contain"
          />
        </div>

        <div className="mt-7 w-full max-w-6xl flex flex-col gap-5 md:flex-row justify-between items-center">
          <p className="text-neutral-500 max-w-xl text-center md:text-start text-lg md:text-xl">
            Put your deed on-chain and leverage DeFi. Connect with buyers if you
            want to sell your property, or turn it into collateral and borrow
            instant cash.
          </p>
          {/* <FormButton>
            <div className="bg-mossgreen text-lemongrass rounded-lg px-3 py-2 md:px-8 md:py-3 font-semibold tracking-wide transition-colors hover:bg-mossgreen/90">
              Tokenize Now
            </div>
          </FormButton> */}
          <RedirectButton
            title={"Tokenize Now"}
            redirectTo={MINT_APP_LINK}
            className={
              "bg-mossgreen text-lemongrass rounded-lg px-3 py-2 md:px-8 md:py-3 font-semibold tracking-wide transition-colors hover:bg-mossgreen/90"
            }
          />
        </div>
      </div>
    </section>
  );
}
