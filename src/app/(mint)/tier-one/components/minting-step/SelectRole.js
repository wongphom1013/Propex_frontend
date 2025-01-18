"use client";

import Image from "next/image";
import AnimPointsCapsule from "../AnimPointsCapsule";
import { useState } from "react";
import WhatIsNFTModal from "@/app/(mint)/_components/WhatIsNFTModal";
import { cnm } from "@/utils/style";
import { useAtom } from "jotai";
import { mintingStepAtom } from "@/app/(mint)/_store/mint-store";
import { MintingStepEnum } from "../../constants/mint";
import PointsStar from "@/assets/account-bar/points-star.svg";
import CoolInputPoints from "@/app/(mint)/_components/input/CoolInputPoints";
import { useMapStore } from "@/app/(mint)/_store/maps-store";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function SelectRole() {
  return (
    <div className="w-full flex flex-col items-center py-12 px-5">
      <div className="w-full flex flex-col items-center gap-1">
        <h1 className="text-4xl lg:text-[2.5rem] font-semibold leading-none">
          Mint an Address
        </h1>
        <div className="mt-6">
          <WhatIsNFTModal />
        </div>
      </div>
      <div className="mt-8 max-w-2xl w-full">
        <RoleCard />
      </div>
    </div>
  );
}

const rolesCard = [
  {
    id: 1,
    title: "Freehold Owner",
    desc: "Owns the property outright with full ownership rights, including the land and structures.",
    src: "/assets/icons/roles/owner.webp",
    alt: "Home Icon",
  },
  {
    id: 2,
    title: "Leasehold Owner",
    desc: "Holds the right to use the property for a specified period under a lease agreement.",
    src: "/assets/icons/roles/renter.webp",
    alt: "Renter Icon",
  },
  {
    id: 3,
    title: "Agents",
    desc: "Professionals who facilitate property transactions, helping to list, market, and sell properties on behalf of owners.",
    src: "/assets/icons/roles/agent.webp",
    alt: "Agent Icon",
  },
  {
    id: 4,
    title: "Minter",
    desc: `A user who creates or "mints" NFTs of property addresses, engaging in the initial steps of property tokenization on the platform.`,
    src: "/assets/icons/roles/minter.webp",
    alt: "Minter Icon",
  },
];

function RoleCard() {
  const {
    points,
    pointsActivity,
    userRole,
    setUserRole,
    setMarketValue,
    addPointsActivity,
    removePointsActivity,
  } = useMapStore();
  const [, setMintingStep] = useAtom(mintingStepAtom);
  const [marketValueFormatted, setMarketValueFormatted] = useState("");

  function handleCardClick(id, title) {
    if (title === userRole) {
      removePointsActivity("fill_role");
      setUserRole("");
      return;
    }
    setUserRole(title);
    addPointsActivity("Choose Role", "fill_role", 10);
  }

  function handleBack() {
    setMintingStep(MintingStepEnum["select-location"]);
  }
  function handleSubmit() {
    if (!userRole) {
      return toast.error("Select your role first");
    }

    if (
      (userRole === "Owner" || userRole === "Agent") &&
      !marketValueFormatted
    ) {
      return toast.error("Fill out your estimate market value");
    }
    setMintingStep(MintingStepEnum["mint-nft"]);
  }

  function handleInputChange(e) {
    const value = e.target.value;
    const parsedValue = value.replace(/[^0-9.]/g, "");
    const formattedValue = parsedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setMarketValueFormatted(formattedValue);
    setMarketValue(parseInt(value));
  }

  return (
    <div className="bg-white rounded-lg flex flex-col justify-center items-center w-full text-black p-5 lg:p-6">
      <div className="relative w-full">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Your Role</p>
          <div className=" bg-lightgreen p-1 rounded-full flex items-center gap-0.5">
            <PointsStar className="size-4" />
            <span className="text-mossgreen-800 font-urbanist font-medium pr-1 text-sm">
              +10
            </span>
          </div>
        </div>

        <div className="w-full lg:grid-cols-2 grid gap-2 justify-center mt-2">
          {rolesCard.map(({ id, src, alt, title, desc }) => (
            <button
              key={id}
              onClick={() => handleCardClick(id, title)}
              className={cnm(
                `bg-white hover:bg-neutral-50 border rounded-lg p-5 flex flex-col items-center justify-center w-full overflow-hidden max-w-[310px]`,
                userRole === title
                  ? "border-[#E5FD34] bg-[#FBFFF0] hover:bg-[#FBFFF0]"
                  : ""
              )}
            >
              <div className="w-20 lg:w-24 aspect-square relative">
                <Image
                  src={src}
                  alt={alt}
                  width={250}
                  height={250}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center font-semibold mt-2.5 text-sm">
                {title}
              </p>
              <p className="text-neutral-500 text-xs font-medium mt-2 text-pretty">
                {desc}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {(userRole === "Agents" || userRole === "Freehold Owner") && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
            >
              <div className="relative w-full pt-6">
                <CoolInputPoints
                  name="market-value"
                  value={marketValueFormatted}
                  containerClassname={
                    "items-start -m-[1px] rounded-md bg-white relative"
                  }
                  rootClassname={"h-12"}
                  label={"Estimated Market Value"}
                  handleChange={handleInputChange}
                  labelClassname={
                    "-translate-y-6 -translate-x-1 px-1.5 scale-[0.85]"
                  }
                  inputClassname={"font-semibold text-sm pl-6"}
                  absoluteEl={(onFocus) => (
                    <div
                      className={cnm(
                        "absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold",
                        !marketValueFormatted && !onFocus && "hidden"
                      )}
                    >
                      Rp
                    </div>
                  )}
                  points={20}
                  activityName="Fill Estimated Market Value"
                  activitySlug="fill_emv"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 w-full mt-6">
          <button
            onClick={handleBack}
            type="submit"
            className="h-12 rounded-lg border border-black overflow-hidden w-full md:w-11/12 lg:w-9/10 bg-white hover:bg-mossgreen/10 text-black font-semibold"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="h-12 rounded-lg overflow-hidden w-full md:w-11/12 lg:w-9/10 bg-mossgreen hover:bg-mossgreen/90 text-lemongrass font-semibold"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-3 text-center max-w-xl">
        <p className="font-open-sauce text-xs text-black/60 text-balance">
          Your price and role will not be on-chain. The more accurate you are,
          the higher your Propex rating. Any deliberate misconduct will void
          your points
        </p>
      </div>
      <div className="mt-8">
        <AnimPointsCapsule points={points} />
      </div>
    </div>
  );
}
