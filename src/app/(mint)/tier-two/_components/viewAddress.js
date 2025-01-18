"use client";
import { Button, Menu, MenuButton, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { ChevronDown, ChevronLeft } from "lucide-react";

export default function ViewAddressButton({
  userProgress,
  nftMetaData,
  handleBackButton,
}) {
  if (["minting", "mintingSuccess"].includes(userProgress)) return null;
  return (
    <div className="pb-12 lg:pb-20 w-full max-w-[1480px] h-full max-h-[68px] flex flex-col items-center font-open-sauce mt-5 lg:mt-4">
      <div className="w-full h-full sm:px-6">
        <div className="w-full flex justify-between">
          <div className="gap-8">
            <div className="w-full px-4 py-1.5 border border-black/10 rounded-lg flex justify-center items-center gap-2 hover:bg-neutral-100">
              <ChevronLeft className="size-6" />
              <button
                title="Back"
                className="font-medium text-sm"
                onClick={handleBackButton}
              >
                Back
              </button>
            </div>
            {userProgress !== "landingPage" && (
              <h1 className="text-3xl font-semibold text-black translate-y-5 hidden lg:block">
                Upgrade RWA NFT
              </h1>
            )}
          </div>

          <Menu>
            <MenuButton className="border border-black/10 rounded-lg bg-white hover:bg-neutral-100">
              <div className="flex items-center justify-center gap-2 px-4 py-1.5">
                <Button className={`font-medium text-sm`}>View Address</Button>
                <ChevronDown className="size-6" />
              </div>
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="w-64 lg:w-[500px] origin-top-right rounded-lg bg-white p-1 text-sm/6 border border-black/10 text-black transition duration-100 ease-out [--anchor-gap:6px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div className="p-4 flex flex-col lg:flex-row items-start lg:items-center gap-2">
                <div className="relative shrink-0 size-[40px] sm:size-[48px] overflow-hidden border border-black/10 rounded-lg">
                  <Image
                    src={nftMetaData?.metadata?.image}
                    alt="maps-card-nft"
                    fill
                    sizes="100px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-black text-sm">
                  {nftMetaData?.mintDetailsData?.mapsAddress}
                </p>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}
