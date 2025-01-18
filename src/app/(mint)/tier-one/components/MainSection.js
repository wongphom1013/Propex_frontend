/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAtom, useSetAtom } from "jotai";
import { useJsApiLoader } from "@react-google-maps/api";
import { useEffect } from "react";
import { isGoogleMapsReadyAtom } from "../../_store/maps-store";
import { Spinner } from "@nextui-org/react";
import MintingStep from "./MintingStep";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import CoinsAnimation from "@/assets/dashboard/mint-page/animations/Coins.json";
import useSWR from "swr";
import { propexAPI } from "../../_api/propex";
import { isPricingOpenAtom } from "../../_store/mint-store";

export default function MainSection() {
  return <SignedInSection />;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LIBRARIES = ["places"];

function SignedInSection() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    id: "google-map-script",
  });
  // const { isLoaded } = true;
  const setGoogleMapsReady = useSetAtom(isGoogleMapsReadyAtom);

  useEffect(() => {
    if (isLoaded) {
      setGoogleMapsReady(true);
    }
  }, [isLoaded]);

  return (
    <AnimatePresence mode="wait">
      {isLoaded ? (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full flex flex-col items-center justify-center h-full"
        >
          <MintingStep />
          <BuyMintsPill />
        </motion.div>
      ) : (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full flex items-center justify-center h-full"
        >
          <Spinner color="primary" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BuyMintsPill() {
  const { data: freeMintsQuota } = useSWR("/nft/mints/free-quota", (url) =>
    propexAPI.get(url)
  );
  const [, setPricingOpen] = useAtom(isPricingOpenAtom);

  return (
    <motion.div
      initial={{
        scale: 1,
        rotate: 0,
      }}
      whileHover={{
        scale: 1.1,
        rotate: -2,
      }}
      className="rounded-xl pointer-events-none bg-lemongrass px-5 py-2.5 font-semibold bottom-5 right-5 text-mossgreen fixed flex items-center group z-50"
    >
      <button
        onClick={() => {
          setPricingOpen(true);
        }}
        className="relative pointer-events-auto"
      >
        <Lottie
          animationData={CoinsAnimation}
          loop={true}
          autoplay={true}
          className="size-8 absolute -top-6 -right-5"
        />
        <div className="relative overflow-hidden rounded-xl text-sm">
          {/* <div className="bg-lemongrass-50 h-20 w-5 absolute -left-12 -top-4 transition-all group-hover:translate-x-[210px] skew-x-[20deg]"></div> */}
          <p className="relative">
            {freeMintsQuota?.data?.data?.quota ?? 0} free mints left
          </p>
        </div>
      </button>
    </motion.div>
  );
}
