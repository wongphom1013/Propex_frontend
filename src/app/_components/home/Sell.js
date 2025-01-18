import Image from "next/image";
import SvgIcon from "../utils/SvgIcon";
import FormButton from "../form/FormButton";

export const saleDummyData = [
  {
    image: "/assets/images/sell/canggu-1.png",
    isVerified: true,
    location: "Canggu, Bali",
    priceUsd: 620000,
    detail: {
      bedroomTotal: 4,
      bathroomTotal: 4,
      areaMeterSquareTotal: 240,
    },
  },
  {
    image: "/assets/images/sell/canggu-2.png",
    isVerified: true,
    location: "Canggu, Bali",
    priceUsd: 120000,
    detail: {
      bedroomTotal: 4,
      bathroomTotal: 4,
      areaMeterSquareTotal: 240,
    },
  },
  {
    image: "/assets/images/sell/kuta-1.png",
    isVerified: true,
    location: "Kuta, Bali",
    priceUsd: 450000,
    detail: {
      bedroomTotal: 4,
      bathroomTotal: 4,
      areaMeterSquareTotal: 240,
    },
  },
  {
    image: "/assets/images/sell/kuta-2.png",
    isVerified: true,
    location: "Cemagi, Bali",
    priceUsd: 200000,
    detail: {
      bedroomTotal: 4,
      bathroomTotal: 4,
      areaMeterSquareTotal: 240,
    },
  },
];

export default function Sell() {
  return (
    <section id="sell-property-section" className="mt-32">
      <div className="flex flex-col items-start w-full">
        <div className="w-full px-4 md:px-8 flex flex-col items-start">
          <p className="px-5 py-2 rounded-full border border-black text-sm">
            SELL YOUR PROPERTY
          </p>
          <div className="w-full flex flex-col gap-8 items-start lg:flex-row lg:items-end justify-between mt-2">
            <p className="text-3xl md:text-[40px] font-medium mt-6 max-w-4xl md:leading-snug text-pretty">
              Easily tokenize your property contract and
              <br className="hidden lg:inline" />
              immediately connect with buyers and lenders
            </p>
            <FormButton>
              <div className="bg-mossgreen text-lemongrass rounded-lg px-3 py-2 md:px-8 md:py-3 font-semibold tracking-wide transition-colors hover:bg-mossgreen/90">
                Tokenize Now
              </div>
            </FormButton>
          </div>
        </div>

        <div
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 2%, #000 98%, transparent 100%)",
          }}
          className="w-full overflow-x-auto flex gap-4 mt-8 px-4 md:px-8"
        >
          {saleDummyData.map((item, idx) => (
            <div
              key={idx}
              className="md:grow rounded-2xl shrink-0 min-w-72 overflow-hidden relative h-96 bg-neutral-300 flex flex-col"
            >
              <Image
                src={item.image}
                className="w-full h-full object-cover"
                fill
                sizes="(min-width: 768px) 800px, 450px"
                alt="house-sample"
              />

              <div className="absolute w-full h-[70%] pointer-events-none bg-gradient-to-b from-transparent to-black/90 bottom-0"></div>
              <div className="flex flex-col gap-1 md:gap-2 mt-auto text-white relative p-4">
                <p className="font-light">{item.location}</p>
                <p className="text-3xl font-medium">
                  {item.priceUsd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <div className="flex items-center gap-3 font-light">
                  <div className="flex items-center gap-1">
                    <SvgIcon
                      src={"/assets/icons/bed.svg"}
                      className="w-4 h-4 bg-white"
                    />
                    <span>{item.detail.bedroomTotal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SvgIcon
                      src={"/assets/icons/shower.svg"}
                      className="w-4 h-4 bg-white"
                    />
                    <span>{item.detail.bathroomTotal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SvgIcon
                      src={"/assets/icons/expand.svg"}
                      className="w-4 h-4 bg-white"
                    />
                    <span>{item.detail.areaMeterSquareTotal}m2</span>
                  </div>
                </div>
              </div>
              {item.isVerified && (
                <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass absolute left-4 top-4">
                  <SvgIcon
                    src={"/assets/icons/verified.svg"}
                    className="w-4 h-4 bg-mossgreen"
                  />
                  <p>Notary Verified</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
