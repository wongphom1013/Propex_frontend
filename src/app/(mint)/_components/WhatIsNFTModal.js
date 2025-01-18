"use client";

import SvgIcon from "@/app/_components/utils/SvgIcon";
import Image from "next/image";
import { useState } from "react";
import SecurityLogo from "@/assets/dashboard/mint-page/security-logo.svg";
import EcoLogo from "@/assets/dashboard/mint-page/eco-logo.svg";
import PrizeLogo from "@/assets/dashboard/mint-page/prize-logo.svg";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useIsWhitePage } from "../_hooks/useIsWhitePage";
import { cnm } from "@/utils/style";

export default function WhatIsNFTModal() {
  let [isOpen, setIsOpen] = useState(false);
  const isWhitePage = useIsWhitePage();

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={open} className="group">
        <p
          className={cnm(
            "text-sm mt-5",
            isWhitePage
              ? "text-mossgreen-800 hover:text-mossgreen-700"
              : "text-lemongrass group-hover:text-lemongrass-500"
          )}
        >
          I want to know more!
        </p>
      </Button>

      <Dialog
        open={isOpen}
        onClose={close}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
      >
        <DialogPanel className="max-w-[568px] bg-white rounded-xl overflow-hidden">
          <div className="border-b py-3 px-5 flex items-center justify-between">
            <button
              onClick={close}
              className="flex items-center hover:opacity-90"
            >
              <SvgIcon
                src={"/assets/icons/x.svg"}
                className={"w-5 h-5 bg-black"}
              />
            </button>
            <p className="font-medium mx-auto">What is NFT location?</p>
          </div>

          <div className="w-full max-h-[70vh] overflow-y-auto">
            <div className="w-full h-64 relative">
              <Image
                src={"/assets/dashboard/mint-page/nft-address.png"}
                alt="nft-address"
                fill
                sizes="650px"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="py-8 px-5 lg:px-12 flex flex-col gap-4 text-neutral-600">
              <p>
                <span className="inline text-neutral-700 font-semibold">
                Tier 1 Location NFTs are digital records of an address or point of interest (POI) on the blockchain. 
                </span>{" "}
                Minting a Tier 1 NFT creates an immutable record of a location virtually owned by the minter, on the blockchain.{" "}
              </p>
              <p>
              These NFTs serve as verifiable digital records, allowing you to participate in the PROPEX map tokenization and real asset on-ramping endeavor (bringing properties on-chain).
              </p>

              <p>
                <span className="inline text-neutral-700 font-semibold">
                  How to participate?
                </span>{" "}
              </p>

              <p>
                You can participate by minting Tier 1 NFTs, engaging in different challenges or games, referring the platform to other minters, or inviting property owners to on-ramp their assets.
              </p>

              <p>
                <span className="inline text-neutral-700 font-semibold">
                  Why mint NFTs Tier 1?
                </span>{" "}
              </p>
              <p>
                Here are the 3 main benefits of minting a Tier 1 NFT on the PROPEX platform:
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  <SecurityLogo className="shrink-0" />
                  <p>
                    <span className="inline text-neutral-700 font-semibold">
                    Secure pre-ownership:
                    </span>{ " " }
                     Minting map locations as a Tier 1 NFT allows you to virtually own a digital location that can be exchanged or traded on marketplaces and potentially used in DeFi. If you own a property at the minted location, Tier 1 can help you secure the Tier 2 NFT representing your property ownership.
                  </p> 
                </div>
                <div className="flex gap-4">
                  <EcoLogo className="shrink-0" />
                  <p>
                  <span className="inline text-neutral-700 font-semibold">
                    Ecosystem Participation: 
                    </span>{ " " }
                   By minting your Tier 1 NFT, you become part of the growing PROPEX community, contributing to the digitization of global real estate and unlocking future opportunities.
                  </p>
                </div>
                <div className="flex gap-4">
                  <PrizeLogo className="shrink-0" />
                  <p>
                  <span className="inline text-neutral-700 font-semibold">
                  Earn Rewards: 
                    </span>{ " " }
                  PROPEX incentivizes users to mint Tier 1 NFTs for properties they don't own. If the rightful owner then verifies the NFT, you'll potentially earn a reward for your contribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
