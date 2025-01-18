"use client";

import { useAtomValue } from "jotai";
import { mintingStepAtom } from "../../_store/mint-store";
import SelectLocation from "./minting-step/SelectLocation";
import SelectRole from "./minting-step/SelectRole";
import MintNFT from "./minting-step/MintNFT";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function MintingStep() {
  const [isTransitioning, setTransitioning] = useState(false);
  const variants = {
    enter: {
      opacity: 0,
      y: 20,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: 20,
    },
  };

  const step = useAtomValue(mintingStepAtom);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
        onAnimationStart={() => {
          setTransitioning(true);
        }}
        onAnimationComplete={() => {
          setTransitioning(false);
        }}
        className="w-full h-full overflow-y-auto"
      >
        {step === "select-location" && (
          <SelectLocation isTransitioning={isTransitioning} />
        )}
        {step === "select-role" && <SelectRole />}
        {step === "mint-nft" && <MintNFT />}
      </motion.div>
    </AnimatePresence>
  );
}
