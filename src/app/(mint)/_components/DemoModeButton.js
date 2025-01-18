"use client";

import SvgIcon from "@/app/_components/utils/SvgIcon";
import { cnm } from "@/utils/style";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useAuth } from "@/app/_providers/AuthProvider";
import { Button, Input } from "@nextui-org/react";
import { useActiveAccount } from "thirdweb/react";
import { useSession } from "next-auth/react";
import { isDemoModeAtom, selectedAuthProviderAtom } from "../_store/demo-store";
import axios from "axios";
import toast from "react-hot-toast";

export default function DemoModeButton({ className, iconClassname }) {
  const [isDemoMode, setIsDemoMode] = useAtom(isDemoModeAtom);
  const [selectedAuthProvider, setSelectedAuthProvider] = useAtom(
    selectedAuthProviderAtom
  );
  const activeAccount = useActiveAccount();
  const { data: session } = useSession();
  const shouldConnect = session && !activeAccount;
  const { authProviders, login, connect } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;
    return validateEmail(email) ? false : true;
  }, [email]);

  const handleButtonClick = () => {
    setIsOpenSignInDialog(true);
  };

  const startDemoMode = async () => {
    try {
      if (isEmailRegistered) {
        toast.success("You are already registered. Proceeding to demo mode.");
        console.log(setSelectedAuthProvider("DEMO"));
        setSelectedAuthProvider("DEMO");
        login("DEMO");
      } else {
        const { data } = await axios.post(`${backendUrl}/mail/verify`, {
          email,
          otp,
        });

        if (data.success === true) {
          toast.success(data.message);
          setSelectedAuthProvider("DEMO");
          login("DEMO");
        } else {
          toast.error("OTP verification failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSubmitEmail = async () => {
    try {
      setIsSuccess(false);
      setIsSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/mail/request-otp`, {
        email,
      });

      if (
        data.message ===
        "User is already registered. You can proceed to demo mode."
      ) {
        setIsEmailRegistered(true);
        toast.success(data.message);
        setIsSuccess(true);
        setIsSubmitting(false);
      } else {
        toast.success(data.message);
        setIsEmailRegistered(false);
        setIsSubmitting(false);
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        className={cnm("flex flex-row items-center", className)}
        isLoading={isDemoMode}
        isDisabled={isDemoMode}
        onClick={handleButtonClick}
      >
        <p className="font-semibold">Use Demo Account</p>
      </Button>

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
            <p className="font-medium mx-auto text-sm md:text-base">
              Explore Propex with a Demo Account!
            </p>
          </div>

          <div className="w-full max-h-[70vh] overflow-y-auto">
            <div className="py-8 px-5 lg:px-12 flex flex-col gap-4 text-neutral-600">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 text-pretty">
                  Enter your email to get started—don&apos;t worry, we respect
                  your inbox privacy and won&apos;t spam you
                </p>
              </div>

              <div className="flex gap-2 items-end">
                <Input
                  key="outside"
                  type="email"
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter your email"
                  isInvalid={isInvalid}
                  value={email}
                  color={isInvalid ? "danger" : "default"}
                  errorMessage="Please enter a valid email"
                  onValueChange={setEmail}
                />
                <Button
                  color="primary"
                  className="flex flex-row items-center mb-2 w-fit"
                  isDisabled={!isSubmitting || isInvalid || email === ""}
                  onClick={handleSubmitEmail}
                >
                  <p className="font-semibold text-sm px-2">Check Email</p>
                </Button>
              </div>

              {!isEmailRegistered && (
                <Input
                  key="outside"
                  type="text"
                  label="OTP"
                  labelPlacement="outside"
                  placeholder="Enter your OTP"
                  value={otp}
                  onValueChange={(value) => {
                    let numericValue = value.replace(/\D/g, "");
                    setOtp(numericValue);
                  }}
                  className={isSubmitting ? "hidden" : ""}
                />
              )}

              <Button
                color="secondary"
                onClick={startDemoMode}
                className={`mb-6 ${
                  isSuccess ? "opacity-100" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isSuccess}
              >
                Start Demo Mode
              </Button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
