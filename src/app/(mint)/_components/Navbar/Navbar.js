"use client";

import { cnm } from "@/utils/style";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useIsWhitePage } from "../../_hooks/useIsWhitePage";
import { AnimatePresence, motion } from "framer-motion";
import { useResetTierTwoForm } from "../../_hooks/useTierTwo";
import AccountBar from "./AccountBar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTierOne } from "../../_hooks/useTierOne";
import { useAtom } from "jotai"; // Import useAtom to access jotai atoms
import { isDemoModeAtom } from "../../_store/demo-store";
import DemoProfileModal from "./user-modal/DemoProfileModal";

const LINKS = [
  {
    name: "Mint",
    type: "single",
    route: "/tier-one",
  },
  {
    type: "single",
    name: "Listing",
    route: "/listing",
  },
  {
    type: "single",
    name: "Portfolio",
    route: "/portfolio",
  },
  {
    type: "single",
    name: "Token 2049",
    route: "/token-2049",
  },
  {
    type: "single",
    name: "Leaderboard",
    route: "/leaderboard",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isWhitePage = useIsWhitePage();
  const { data: session } = useSession();
  const [isDemoMode] = useAtom(isDemoModeAtom); // Get the demo mode state from jotai
  const resetTierTwo = useResetTierTwoForm();
  const { restartTierOneMinting } = useTierOne();

  return (
    <AnimatePresence mode="wait">
      {typeof session !== "undefined" ? (
        <>
          {/* Display a red bar at the top when demo mode is active */}
          {/* {isDemoMode && (
            <div className="w-full bg-warning text-black text-center text-xs font-semibold py-1">
              You are in Demo Mode
            </div>
          )} */}
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
            className={cnm(
              "w-full flex items-center justify-between px-5 lg:px-12 h-16 lg:h-20",
              isWhitePage ? "bg-white border-b" : "bg-mossgreen"
            )}
          >
            <Tooltip
              content="All content is primarily for demonstration purposes only and may be subject to change without notice."
              className="max-w-[16rem]"
            >
              <div>
                <Image
                  src={
                    isDemoMode
                      ? isWhitePage
                        ? "/assets/logo/propex-demo-logo.png"
                        : "/assets/logo/propex-demo-logo-white.png"
                      : isWhitePage
                      ? "/assets/logo/propex-logo.png"
                      : "/assets/logo/propex-logo-white.png"
                  }
                  alt="propex-logo"
                  width={200}
                  height={50}
                  priority
                  className="w-[4.7rem] lg:w-[8rem]"
                />
                {!isDemoMode && (
                  <div className="bg-warning text-black text-[10px] text-center font-semibold">
                    ALPHA
                  </div>
                )}
              </div>
            </Tooltip>

            <div className="hidden lg:flex items-center text-sm gap-1 xl:absolute xl:left-1/2 xl:-translate-x-1/2">
              {LINKS.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.route}
                    onClick={() => {
                      resetTierTwo();
                      restartTierOneMinting();
                    }}
                    className={cnm(
                      "px-4 xl:px-6 py-2 text-white rounded-lg",
                      (link.route === "/tier-one" &&
                        (pathname === "/" || pathname === "/tier-one")) ||
                        pathname.includes(link.route)
                        ? isWhitePage
                          ? "text-black/90 bg-black/10 hover:bg-black/10"
                          : "text-white bg-white/10 hover:bg-white/20"
                        : isWhitePage
                        ? "text-black/90 hover:bg-black/10"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>

            {pathname.includes("token-2049") && (
              <div className="text-black flex lg:hidden font-semibold">
                Token 2049
              </div>
            )}

            <div className="flex items-center gap-4">
              {isDemoMode ? (
                <>
                  <DemoProfileModal />
                </>
              ) : (
                <>
                  <AccountBar />
                  <div className="flex lg:hidden">
                    <MobileMenu />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className={cnm(
            "w-full h-20",
            isWhitePage ? "bg-white" : "bg-mossgreen"
          )}
        ></motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu() {
  const [isOpen, setOpen] = useState(false);
  const isWhitePage = useIsWhitePage();
  const router = useRouter();
  const resetTierTwo = useResetTierTwoForm();

  return (
    <>
      <button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="flex flex-col gap-1 z-[100] relative"
      >
        <span
          className={cnm(
            "h-[3px] w-6 transition-transform",
            isWhitePage ? "bg-mossgreen" : "bg-white",
            isOpen ? "rotate-45 bg-white" : "rotate-0"
          )}
        ></span>
        <span
          className={cnm(
            "h-[3px] w-6 transition-transform origin-top-left",
            isWhitePage ? "bg-mossgreen" : "bg-white",
            isOpen
              ? "-rotate-45 translate-x-[1px] translate-y-[1.5px] bg-white"
              : "rotate-0"
          )}
        ></span>
      </button>
      {createPortal(
        <div
          className={cnm(
            "z-[99] fixed inset-0 bg-mossgreen transition-transform ease-in-out duration-300",
            isOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="w-full h-full py-20 px-5 flex flex-col items-end">
            {LINKS.map((link) => (
              <div key={link.name}>
                <button
                  href={link.route}
                  onClick={() => {
                    resetTierTwo();
                    setOpen(false);
                    router.push(link.route);
                  }}
                  className={cnm(
                    "py-5 text-white text-3xl font-medium rounded-lg"
                  )}
                >
                  {link.name}
                </button>
              </div>
            ))}
          </div>
        </div>,
        typeof window !== "undefined" && document.body
      )}
    </>
  );
}

function NestedLink({ name, childrens, className }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={cnm(
            "inline-flex items-center gap-2 rounded-md",
            className
          )}
        >
          Mint
          <ChevronDown className="size-3" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className="w-52 bg-white p-1">
        {childrens.map((item) => (
          <DropdownItem key={item.name}>
            <Link
              href={item.route}
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
            >
              {item.name}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
