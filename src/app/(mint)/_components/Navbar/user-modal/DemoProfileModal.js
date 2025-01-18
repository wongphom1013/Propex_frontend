/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import UserProfileIcon from "@/assets/account-bar/user-profile-icon.svg";
import LogoutIcon from "@/assets/account-bar/logout-icon.svg";
import { ChevronDown } from "lucide-react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { cnm } from "@/utils/style";
import { signOut } from "next-auth/react";
import Spinner from "../../elements/Spinner";
import Image from "next/image";
import { shortenAddress } from "@/app/(mint)/_utils/string";
import { useAtom, useSetAtom } from "jotai";
import useSWR from "swr";
import { useOnClickOutside } from "usehooks-ts";
import { propexAPI } from "@/app/(mint)/_api/propex";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { isSigningOutAtom } from "@/app/(mint)/_store/signin-store";
import { editProfileModalAtom } from "../EditProfileModal";
import { useTierOne } from "@/app/(mint)/_hooks/useTierOne";
import { isDemoModeAtom } from "@/app/(mint)/_store/demo-store";

async function getUser(url) {
  const { data } = await propexAPI.get(url);
  return data?.userData;
}

export default function DemoProfileModal() {
  const activeAccount = useActiveAccount();
  // const [, setIsSigningOut] = useAtom(isSigningOutAtom);
  const [, setIsDemoMode] = useAtom(isDemoModeAtom);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR(`/user?address=${activeAccount?.address}`, getUser);
  const [isOpen, setOpen] = useState(false);
  const { restartTierOneMinting } = useTierOne();
  const popupRef = useRef();

  // useOnClickOutside(popupRef, () => {
  //   setOpen(false);
  // });

  // const setEditProfileModal = useSetAtom(editProfileModalAtom);
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  async function logout() {
    // setIsSigningOut(true);
    setIsDemoMode(false);
    setLoggingOut(true);
    // try {
    //   await signOut({
    //     redirect: false,
    //   });
    //   disconnect(activeWallet);
    //   restartTierOneMinting();
    //   window.location.reload();
    // } catch (e) {
    //   toast.error("Error while logging out");
    // } finally {
    //   setLoggingOut(false);
    // }
  }

  useEffect(() => {
    if (isOpen) {
      mutate();
    }
  }, [isOpen]);

  if (isLoading || typeof user === "undefined") {
    return <div className="h-9 w-16 bg-white animate-pulse rounded-lg"></div>;
  }

  return (
    <Menu>
      <MenuButton
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="h-9 px-2 flex items-center rounded-lg bg-white gap-2 hover:bg-neutral-100 border"
      >
        <ChevronDown className="w-4 aspect-square text-neutral-500" />
        <div className="size-6 rounded-full shrink-0 relative bg-neutral-500 overflow-hidden">
          <Image
            src={
              user?.imageUrl
                ? user?.imageUrl
                : "/assets/dashboard/mint-page/profile-pict-placeholder.png"
            }
            alt="Profile Picture"
            sizes="26px"
            fill
            className="rounded-full object-cover w-full h-full"
          />
        </div>
      </MenuButton>
      <Transition show={isOpen}>
        <MenuItems
          anchor="bottom end"
          transition
          static
          ref={popupRef}
          className="origin-top min-w-56 [--anchor-gap:12px] transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-white border rounded-lg z-[99]"
        >
          <div className="px-4 py-4 flex flex-col items-center">
            <div className="flex flex-col items-center px-4">
              <div className="w-12 aspect-square rounded-full bg-neutral-400 relative overflow-hidden">
                <Image
                  src={
                    user?.imageUrl
                      ? user?.imageUrl
                      : "/assets/dashboard/mint-page/profile-pict-placeholder.png"
                  }
                  alt="Profile Picture"
                  sizes="50px"
                  fill
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              {!user?.email || !user?.name ? (
                <div className="text-xs mt-5 bg-neutral-100 px-3 py-2 rounded-full text-mossgreen font-medium">
                  {shortenAddress(activeAccount?.address)}
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium mt-5">{user?.name || ""}</p>
                  <p className="text-xs font-light text-neutral-500">
                    {user?.email || ""}
                  </p>
                </>
              )}
            </div>

            {/* Menu */}
            <div className="flex w-full flex-col items-start text-xs text-neutral-600 mt-4">
              {/* <button
                onClick={() => {
                  setEditProfileModal((prev) => ({
                    ...prev,
                    isOpen: true,
                    type: "edit",
                  }));
                }}
                className="py-3 hover:bg-neutral-100 rounded-md px-2.5 w-full flex justify-start items-center gap-1.5"
              >
                <UserProfileIcon />
                Edit Profile
              </button> */}
              {/* <button className="py-3 hover:bg-neutral-100 rounded-md px-2.5 w-full flex justify-start items-center gap-1.5">
              <SettingsIcon />
              Settings
            </button> */}
              <div className="py-2 w-full">
                <div className="w-full h-[1.5px] bg-neutral-200"></div>
              </div>
              <button
                onClick={logout}
                className={cnm(
                  "group py-3 px-2.5 w-full flex justify-start hover:bg-red-100 hover:text-red-400 rounded-md items-center gap-1.5",
                  isLoggingOut && "bg-red-100"
                )}
              >
                {isLoggingOut ? (
                  <div className="w-full flex justify-center">
                    <Spinner className={"size-4 text-red-200 fill-red-400"} />
                  </div>
                ) : (
                  <>
                    <LogoutIcon className="group-hover:stroke-red-400 stroke-neutral-600" />
                    <p>Log Out</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
