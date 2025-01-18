/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  AutoConnect,
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
  useConnect,
  useDisconnect,
  useIsAutoConnecting,
} from "thirdweb/react";
import { thirdwebClient } from "../_lib/web3/thirdweb";
import { signOut, useSession } from "next-auth/react";
import { isSigningInAtom, isSigningOutAtom } from "../_store/signin-store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { createWallet } from "thirdweb/wallets";
import { useTierOne } from "../_hooks/useTierOne";
import toast from "react-hot-toast";

export const appMetadata = {
  name: "Propex",
  description: "On Chain Real Estate Trade & Loans",
  logoUrl: "",
  url: "https://localhost:3205",
  // url: "https://mint.propex.app",
};

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
];

export default function Web3EventProvider({ children }) {
  const { data: session, status } = useSession();
  const activeAccount = useActiveAccount();
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const [isSigningIn] = useAtom(isSigningInAtom);
  const { isConnecting } = useConnect();
  const [isMounted, setIsMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useAtom(isSigningOutAtom);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const { restartTierOneMinting } = useTierOne();

  // console.log("session", { session });

  const isAutoConnecting = useIsAutoConnecting();

  async function logout() {
    if (isLoggingOut || isSigningOut) return;
    setIsSigningOut(true);
    setLoggingOut(true);
    try {
      await signOut({
        redirect: false,
      });
      disconnect(activeWallet);
      restartTierOneMinting();
      window.location.reload();
    } catch (e) {
      toast.error("Error while logging out");
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    if (!session) return;
    if (Date.now() > Date.parse(session.expires)) {
      logout();
    }
  }, [session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (isSigningIn || isAutoConnecting || status === "loading") return;
    if (activeAccount && activeWallet) {
      if (!session) {
        disconnect(activeWallet);
      }
    }
  }, [
    activeAccount,
    activeWallet,
    session,
    status,
    isSigningIn,
    isAutoConnecting,
    isConnecting,
    isMounted,
  ]);

  return (
    <>
      {children}
      <AutoConnect
        client={thirdwebClient}
        wallets={wallets}
        appMetadata={appMetadata}
        onConnect={(wallet) => {
          console.log("auto connected to", wallet.id);
        }}
      />
    </>
  );
}
