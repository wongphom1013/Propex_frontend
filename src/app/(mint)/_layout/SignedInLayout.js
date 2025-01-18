"use client";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { isSigningInAtom } from "../_store/signin-store";
import SignInButton from "../_components/SignInButton";
import WhatIsNFTModal from "../_components/WhatIsNFTModal";
import { AnimatePresence, motion } from "framer-motion";
import { useIsWhitePage } from "../_hooks/useIsWhitePage";
import { cnm } from "@/utils/style";
import Navbar from "../_components/Navbar/Navbar";
import { useAuth } from "@/app/_providers/AuthProvider";
import { Spinner } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useActiveAccount, useIsAutoConnecting } from "thirdweb/react";
import { isDemoModeAtom } from "../_store/demo-store";
import DemoModeButton from "../_components/DemoModeButton";

export default function SignedInLayout({ children }) {
  const { data: session, status } = useSession(); // Destructure status to handle loading state
  const [isSigningIn] = useAtom(isSigningInAtom);
  const [isDemoMode] = useAtom(isDemoModeAtom);
  const { selectedAuthProvider, login } = useAuth(); // Use auth context
  const isWhitePage = useIsWhitePage();
  const activeAccount = useActiveAccount();
  const isAutoConnecting = useIsAutoConnecting();

  const pathname = usePathname();

  const shouldDemo = isDemoMode ? false : !session || !activeAccount;

  if (status === "loading" || isSigningIn || isAutoConnecting) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div
      className={cnm(
        "w-full flex items-center justify-center text-white",
        isWhitePage ? "bg-white" : "bg-mossgreen"
      )}
    >
      <AnimatePresence mode="wait">
        {shouldDemo ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen px-5 w-full">
              <div
                className={cnm(
                  "flex flex-col items-center gap-2 text-center w-full",
                  isWhitePage ? "text-black" : "text-white"
                )}
              >
                <h1 className="text-4xl font-semibold leading-snug">
                  MINT A <br className="inline lg:hidden" /> LOCATION NFT
                </h1>
                <div className="mt-4">
                  <WhatIsNFTModal />
                </div>

                <SignInButton
                  className="mt-7 lg:text-lg px-5 rounded-md w-full max-w-[240px] lg:rounded-lg py-4 lg:px-8 lg:py-6"
                  onClick={() => login(selectedAuthProvider?.id)}
                />
                <DemoModeButton
                  className={cnm(
                    "mt-7 lg:text-lg px-5 rounded-md w-full max-w-[240px] lg:rounded-lg py-4 lg:px-8 lg:py-6",
                    isWhitePage ? "text-mossgreen" : ""
                  )}
                  onClick={() => login(selectedAuthProvider?.id)}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Navbar />
            {/* {typeof session !== "undefined" && isDemoMode ? (
              <div className="fixed z-50 top-14 left-0 right-0 flex">
                <p className="py-2 px-4 rounded-xl text-sm font-semibold bg-lemongrass text-mossgreen max-w-fit mx-auto">You are in Demo Mode</p>
              </div>
            ) : null} */}

            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
