"use client";

import { useState } from "react";
import SvgIcon from "../../utils/SvgIcon";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function SignIn() {
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState("register");

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <div
        // onClick={openModal}
        className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg bg-mossgreen"
      >
        <SvgIcon
          src={"/assets/icons/login.svg"}
          className="h-4 w-4 bg-lemongrass"
        />
        <p className="text-lemongrass text-sm md:text-base">Sign In</p>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-md bg-white rounded-lg w-full overflow-hidden">
          <div className="flex flex-col w-full">
            <div className="border-b py-3 px-5 flex items-center justify-between">
              <button onClick={closeModal} className="flex items-center">
                <SvgIcon
                  src={"/assets/icons/x.svg"}
                  className={"w-5 h-5 bg-black"}
                />
              </button>
              <p className="font-medium mx-auto">
                {mode === "register" ? "Register" : "Sign In"}
              </p>
            </div>
            {mode === "register" ? (
              <div className="w-full flex flex-col items-center p-6">
                <h1 className="text-2xl font-medium">
                  Create Your Account Today
                </h1>
                <div className="flex w-full flex-col gap-4 max-w-md mt-6">
                  <div className="border rounded-lg w-full">
                    <input
                      placeholder="Full Name"
                      className="outline-none py-2 px-4 bg-transparent"
                    />
                  </div>
                  <div className="border rounded-lg w-full">
                    <input
                      placeholder="Email"
                      className="outline-none py-2 px-4 bg-transparent"
                    />
                  </div>
                  <div className="border rounded-lg w-full flex items-center justify-between pr-4">
                    <input
                      placeholder="Password"
                      className="outline-none py-2 px-4 bg-transparent grow"
                    />
                    <SvgIcon
                      src={"/assets/icons/eye.svg"}
                      className={"w-5 h-5 bg-black"}
                    />
                  </div>
                  <button className="w-full px-4 flex justify-center py-2.5 bg-mossgreen text-lemongrass rounded-lg">
                    Register
                  </button>
                </div>
                <div className="font-light mt-6">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("sign-in");
                    }}
                    className="font-medium"
                  >
                    Sign In here
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center p-6">
                <h1 className="text-2xl font-medium">Welcome back</h1>
                <div className="flex w-full flex-col gap-4 max-w-md mt-6">
                  <div className="border rounded-lg w-full">
                    <input
                      placeholder="Email"
                      className="outline-none py-2 px-4 bg-transparent"
                    />
                  </div>
                  <div className="border rounded-lg w-full pr-4 flex items-center">
                    <input
                      placeholder="Password"
                      className="outline-none py-2 px-4 bg-transparent grow"
                    />
                    <SvgIcon
                      src={"/assets/icons/eye.svg"}
                      className={"w-5 h-5 bg-black"}
                    />
                  </div>

                  <button className="w-full px-4 flex justify-center py-2.5 bg-mossgreen text-lemongrass rounded-lg">
                    Sign In
                  </button>
                </div>
                <div className="font-light mt-6">
                  Do not have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                    }}
                    className="font-medium"
                  >
                    Register here
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
