"use client";

import SvgIcon from "@/app/_components/utils/SvgIcon";
import { cnm } from "@/utils/style";
import { useAtom } from "jotai";
import { isSigningInAtom } from "../_store/signin-store";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@nextui-org/react";
import { useActiveAccount } from "thirdweb/react";
import { useSession } from "next-auth/react";

export default function SignInButton({ className, iconClassname }) {
  const [isSigningIn] = useAtom(isSigningInAtom);
  const activeAccount = useActiveAccount();
  const { data: session } = useSession();
  const shouldConnect = session && !activeAccount;

  // console.log(activeAccount)
  // console.log(session);
  // console.log(shouldConnect);
  // New Auth
  const { authProviders, login, connect } = useAuth();

  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false);

  return (
    <>
      <Button
        color="primary"
        className={cnm("flex flex-row items-center", className)}
        isLoading={isSigningIn}
        isDisabled={isSigningIn}
        onClick={() => {
          if (shouldConnect) {
            connect();
          } else {
            login("THIRDWEB");
          }
        }}
        startContent={
          !isSigningIn && (
            <SvgIcon
              src={"/assets/icons/login.svg"}
              className={cnm("size-4 bg-mossgreen shrink-0", iconClassname)}
            />
          )
        }
      >
        <p className="text-mossgreen font-semibold">
          {shouldConnect ? "Connect" : "Sign In"}
        </p>
      </Button>

      {/* For testing purposes */}
      <Dialog
        open={isOpenSignInDialog}
        onClose={() => setIsOpenSignInDialog(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
      >
        <DialogPanel className="max-w-[568px] bg-white rounded-xl overflow-hidden">
          <div className="border-b py-3 px-5 flex items-center justify-between">
            <button
              onClick={() => setIsOpenSignInDialog(false)}
              className="flex items-center hover:opacity-90"
            >
              <SvgIcon
                src={"/assets/icons/x.svg"}
                className={"w-5 h-5 bg-black"}
              />
            </button>
            <p className="font-medium mx-auto">
              Which provider would you like to use?
            </p>
          </div>

          <div className="w-full max-h-[70vh] overflow-y-auto">
            <div className="py-8 px-5 lg:px-12 flex flex-col gap-4 text-neutral-600">
              {authProviders.map((provider) => {
                return (
                  <Button
                    variant="bordered"
                    key={provider.id}
                    onClick={() => {
                      login(provider.id);
                    }}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
