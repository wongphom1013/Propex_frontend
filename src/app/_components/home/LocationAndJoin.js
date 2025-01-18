import { cnm } from "@/utils/style";
import Image from "next/image";
import SvgIcon from "../utils/SvgIcon";
import FormButton from "../form/FormButton";

export const locationHighlightDummy = [
  {
    location: "Canggu, Bali",
    image: "/assets/images/location-join/image-1.png",
    startingPriceUsd: 200000,
  },
  {
    location: "Seminyak, Bali",
    image: "/assets/images/location-join/image-2.png",
    startingPriceUsd: 200000,
  },
  {
    location: "Ubud, Bali",
    image: "/assets/images/location-join/image-3.png",
    startingPriceUsd: 200000,
  },
  {
    location: "Kuta, Bali",
    image: "/assets/images/location-join/image-4.png",
    startingPriceUsd: 200000,
  },
  {
    location: "Cemagi, Bali",
    image: "/assets/images/location-join/image-5.png",
    startingPriceUsd: 200000,
  },
];

export default function LocationAndJoin() {
  return (
    <section className="mt-20 px-4 md:px-8">
      <div>
        {/* Location */}
        <div className="w-full p-6 md:p-7 bg-mossgreen rounded-2xl flex flex-col">
          <div className="w-full flex flex-col gap-6 md:flex-row md:items-center justify-between">
            <h1 className="font-medium text-white text-2xl md:text-[40px] md:leading-snug max-w-lg">
              Buy verified on-chain properties in one click
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 font-semibold w-full md:w-auto">
              <FormButton className={"w-full md:w-auto"}>
                <div className="px-4 py-3 md:px-8 border rounded-lg border-white text-white text-sm md:text-base transition-colors hover:bg-white hover:text-black whitespace-nowrap">
                  List My Property
                </div>
              </FormButton>
              <FormButton className={"w-full md:w-auto"}>
                <div className="px-4 py-3 md:px-8 rounded-lg bg-lemongrass text-mossgreen text-sm md:text-base transition-colors hover:bg-lemongrass/90">
                  Buy Property
                </div>
              </FormButton>
            </div>
          </div>

          <div className="w-full flex gap-4 mt-20 overflow-x-auto">
            {locationHighlightDummy.map((item, idx) => (
              <div
                key={idx}
                className={cnm(
                  "shrink-0 rounded-2xl overflow-hidden relative h-96 lg:w-44 bg-neutral-300 flex flex-col group",
                  "lg:card-location"
                )}
              >
                <Image
                  src={item.image}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(min-width: 768px) 900px, 500px"
                  alt="house-sample"
                />

                <div className="absolute w-full h-[40%] pointer-events-none bg-gradient-to-b from-transparent via-[#008192]/60 to-black/80 bottom-0"></div>
                <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:items-center justify-between w-full mt-auto bg-red-300 p-4">
                  <div className="flex flex-col gap-1 mt-auto text-white relative items-start">
                    <p className="font-semibold text-lg">{item.location}</p>
                    <p className="h-0 font-light overflow-hidden opacity-0 group-hover:opacity-100 group-hover:h-10 transition-all duration-300 ease-in-out whitespace-nowrap">
                      Start from{" "}
                      {item.startingPriceUsd.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>
                  <FormButton>
                    <div
                      className={cnm(
                        "w-10 shrink-0 aspect-square rounded-full bg-lemongrass relative opacity-0 flex items-center justify-center",
                        "translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-opacit duration-300 ease-in-out"
                      )}
                    >
                      <SvgIcon
                        src={"/assets/icons/arrow-up-right.svg"}
                        className="w-7 h-7 bg-black"
                      />
                    </div>
                  </FormButton>
                </div>
              </div>
            ))}
          </div>
          {/* spacer */}
          <div className="w-full h-44"></div>
        </div>

        {/* Join */}
        <div className="w-full px-2 md:px-7 -mt-40">
          <div className="w-full min-h-[400px] bg-neutral-100 rounded-2xl flex flex-col lg:flex-row overflow-hidden">
            <div className="flex flex-col items-start w-full max-w-xl p-6 md:p-10">
              <p className="text-3xl md:text-[40px] font-medium md:leading-snug">
                Join our community and be the first to know about new listings,
                updates, and exclusive offers.
              </p>
              <p className="text-lg md:text-xl font-light mt-10">
                Sign Up with your email today!
              </p>
              <div className="flex border rounded-lg bg-white overflow-hidden mt-6 p-0 w-full md:w-auto">
                <input
                  type="text"
                  className="outline-none pl-4 md:px-4 py-3 grow lg:min-w-80 placeholder:text-sm"
                  placeholder="Enter your email"
                />
                <FormButton>
                  <p className="text-sm md:text-base px-3 md:px-5 py-3 bg-mossgreen text-lemongrass rounded-md font-semibold tracking-wide transition-colors hover:bg-mossgreen/90">
                    Submit
                  </p>
                </FormButton>
              </div>
            </div>
            <div className="w-full h-80 md:h-auto md:grow relative">
              <Image
                src="/assets/images/holding-house.png"
                alt="holding-house"
                fill
                sizes="(min-width: 768px) 1000px, 600px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
