import { cnm } from "@/utils/style";
import Image from "next/image";

export default function Footer({
  userProgress,
  isNextAvailable = false,
  userPoints,
  nextHandler,
  previousHandler,
  isPreviousAvailable = false,
  customNextButtonText,
  customPreviousButtonText,
  classname
}) {

   if (['landingPage', 'minting', 'mintingSuccess'].includes(userProgress)) return null;

    return (
        <footer className="fixed bottom-0 left-0 w-full h-[68px] bg-white border-t border-gray-200 z-50 lg:px-8">
            <div className="flex justify-end items-center h-full px-4 max-w-[1440px] mx-auto relative">
                {/* Middle Point */}
                <button className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center mb-2 mt-8 bg-lightgreen rounded-2xl px-2 py-1 gap-1 -translate-y-3">
                    <div className="relative w-4 h-4 lg:w-6 lg:h-6">
                        <Image
                            src={"/assets/logo/propex-coin.png"}
                            alt="propex-coin"
                            fill
                            sizes="350px"
                            className="object-contain"
                        />
                    </div>
                    <span className="text-green-600 font-semibold text-xs lg:text-lg">{userPoints}</span>
                </button>

                {/* Right Side Buttons */}
                <div className="flex gap-2 lg:gap-4 justify-end items-center ml-auto">
                    {isPreviousAvailable && (
                        <button
                            onClick={previousHandler}
                            className={`w-full max-w-[100px] h-full lg:h-[54px] text-black px-2 lg:px-4 py-3 lg:py-2 rounded-lg bg-[#DFE3EC] hover:bg-mossgreen hover:text-lemongrass ${!isPreviousAvailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <p className="text-xs lg:text-base font-semibold">Previous</p>
                        </button>
                    )}
                    <button
                        onClick={nextHandler}
                        disabled={!isNextAvailable}
                        className={cnm(`w-full lg:max-w-[10rem] h-full lg:h-[54px] text-black lg:px-4 py-3 lg:py-2 whitespace-normal rounded-lg ${!isNextAvailable ? 'bg-[#DFE3EC]' : 'bg-mossgreen text-lemongrass'} ${!isNextAvailable ? 'cursor-not-allowed' : 'cursor-pointer'} ${customNextButtonText ? 'lg:min-w-[120px] min-w-[80px]' : 'px-4'}`)}
                    >
                        <p className="text-xs lg:text-base font-semibold">{customNextButtonText ? customNextButtonText : 'Next'}</p>
                    </button>
                    {!isNextAvailable && (
                        <div className="w-40 max-w-[13rem] absolute -top-10 transform -translate-x-20 bg-mossgreen text-white text-xs rounded px-2 py-1 break-words whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Please complete all form with (<span className="text-red-700">*</span>) mark!
                        </div>
                    )}
                </div>
            </div>
        </footer>

    );
}

