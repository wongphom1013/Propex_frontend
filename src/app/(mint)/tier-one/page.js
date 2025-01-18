"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Spinner from "../_components/elements/Spinner";

const MainSection = dynamic(() => import("./components/MainSection"), {
  ssr: false,
});

export default function TierOnePage() {
  const [isLoad, setLoad] = useState(false);
  useEffect(() => {
    const loadComponent = async () => {
      await import("./components/MainSection");
      setLoad(true);
    };

    loadComponent();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoad ? (
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
          transition={{
            ease: "circInOut",
          }}
          className="w-full h-full"
        >
          <MainSection />
        </motion.div>
      ) : (
        <motion.div
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "circInOut",
          }}
          className="bg-mossgreen fixed inset-0 w-full h-screen flex items-center justify-center z-[150]"
        >
          <Spinner className="size-8 text-mossgreen-800 fill-lemongrass-400" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
