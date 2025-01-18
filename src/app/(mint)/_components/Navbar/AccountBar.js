"use client";

import SignInButton from "../SignInButton";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { isSigningInAtom } from "../../_store/signin-store";
import UserPointsModal from "./user-modal/UserPointsModal";
import UserWalletModal from "./user-modal/UserWalletModal";
import UserProfileModal from "./user-modal/UserProfileModal";
import { useActiveAccount } from "thirdweb/react";

export default function AccountBar() {
  const { data: session } = useSession();
  const [isSigningIn] = useAtom(isSigningInAtom);
  const activeAccount = useActiveAccount();

  return (
    <>
      {!isSigningIn && session && activeAccount ? (
        <WalletConnectedBar />
      ) : (
        <SignInButton
          className={
            "font-medium text-xs lg:text-sm w-20 h-8 lg:w-24 lg:h-9 rounded-md"
          }
          iconClassname={"size-3 lg:size-4"}
        />
      )}
    </>
  );
}
function WalletConnectedBar() {
  return (
    <div className="flex items-center gap-1.5 lg:gap-3">
      <div className="hidden lg:flex items-center gap-1.5 lg:gap-3">
        <UserPointsModal />
        <UserWalletModal />
      </div>
      <UserProfileModal />
    </div>
  );
}
