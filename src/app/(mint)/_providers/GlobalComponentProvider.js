import { Toaster } from "react-hot-toast";
import CreateProfileModal from "../_components/Navbar/CreateProfileModal";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { isPricingOpenAtom } from "../_store/mint-store";
import { Check, X } from "lucide-react";
import EditProfileModal from "../_components/Navbar/EditProfileModal";

export default function GlobalComponentProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0E4E53",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
      <CreateProfileModal />
      <EditProfileModal />
      <PricingModal />
    </>
  );
}

function PricingModal() {
  const [isPricingOpen, setPricingOpen] = useAtom(isPricingOpenAtom);
  return (
    <AnimatePresence mode="wait">
      {isPricingOpen && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          className="w-full flex items-center justify-center h-screen fixed z-[100] inset-0 bg-mossgreen"
        >
          <div className="w-full h-full overflow-y-auto">
            <div className="flex flex-col items-center px-5 py-12">
              <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold leading-none text-white">
                Minting Packages
              </h1>
              <p className="text-lemongrass mt-6">What is Mints?</p>

              {/* Cards */}
              <div className="flex flex-wrap items-center justify-center gap-10 mt-14">
                {/* Cards 1 */}
                <div className="min-h-[417px] rounded-2xl bg-[#F5FAD2] min-w-[288px] relative flex flex-col items-center">
                  <div className="flex flex-col items-center p-6 w-full">
                    <p className="font-extrabold text-xl">Starter</p>
                    <p className="font-extrabold text-[4rem] mt-2">$40</p>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold ">$4/mint</p>
                      <div className="bg-lemongrass rounded-xl px-2.5 py-2 text-xs font-extrabold">
                        SAVE 20%
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 items-start text-xs font-medium w-full mt-5">
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>10 Mint Quota</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Total Price $40</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Mint Any Address</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>Pay With Stripe or Crypto</p>
                      </div>
                    </div>
                    <button className="mt-5 w-full flex items-center justify-center h-[70px] bg-mossgreen text-lemongrass rounded-xl">
                      Get Starter Plan
                    </button>
                  </div>
                </div>
                {/* Cards 3 */}
                <div className="min-h-[417px] rounded-2xl bg-lemongrass min-w-[288px] relative flex flex-col items-center">
                  <div className="flex flex-col items-center p-6 w-full">
                    <p className="font-extrabold text-xl">Growth</p>
                    <p className="font-extrabold text-[4rem] mt-2">$70</p>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold ">$3.5/mint</p>
                      <div className="bg-white text-mossgreen rounded-xl px-2.5 py-2 text-xs font-extrabold">
                        SAVE 30%
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 items-start text-xs font-medium w-full mt-5">
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>20 Mint Quota</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Total Price $70</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Mint Any Address</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>Pay With Stripe or Crypto</p>
                      </div>
                    </div>
                    <button className="mt-5 w-full flex items-center justify-center h-[70px] bg-mossgreen text-lemongrass rounded-xl">
                      Get Growth Plan
                    </button>
                  </div>
                </div>
                {/* Cards 3 */}
                <div className="min-h-[417px] rounded-2xl bg-[#F5FAD2] min-w-[288px] relative flex flex-col items-center">
                  <div className="flex flex-col items-center p-6 w-full">
                    <p className="font-extrabold text-xl">Pro</p>
                    <p className="font-extrabold text-[4rem] mt-2">$150</p>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold ">$3/mint</p>
                      <div className="bg-lemongrass rounded-xl px-2.5 py-2 text-xs font-extrabold">
                        SAVE 40%
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 items-start text-xs font-medium w-full mt-5">
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>50 Mint Quota</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Total Price $150</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>{" "}
                        <p>Mint Any Address</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-5 rounded-full bg-mossgreen flex items-center justify-center">
                          <Check className="text-[#F5FAD2] size-3 stroke-2 shrink-0" />
                        </div>
                        <p>Pay With Stripe or Crypto</p>
                      </div>
                    </div>
                    <button className="mt-5 w-full flex items-center justify-center h-[70px] bg-mossgreen text-lemongrass rounded-xl">
                      Get Pro Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full h-full flex justify-center items-center">
                <button
                  onClick={() => {
                    setPricingOpen(false);
                  }}
                  className="w-14 aspect-square rounded-full text-black hover:scale-90 transition-all flex items-center justify-center bg-white mt-14 mb-8"
                >
                  <X className="size-7" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
