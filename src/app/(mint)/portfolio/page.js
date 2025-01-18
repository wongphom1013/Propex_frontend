"use client";

import { Button, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { propexAPI } from "../_api/propex";
import NFTCard from "../tier-one/components/minting-step/NFTCard";
import Spinner from "../_components/elements/Spinner";
import toast from "react-hot-toast";
import Link from "next/link";
import useSWR from "swr";
import { AxiosError } from "axios";
import { sleep } from "../_utils/process";

const TABS = [
  {
    id: "owned",
    label: "Owned",
    isDisabled: false,
  },
  {
    id: "active",
    label: "Active",
    isDisabled: true,
  },
  {
    id: "locked",
    label: "Locked",
    isDisabled: true,
  },
  {
    id: "sold",
    label: "Sold",
    isDisabled: true,
  },
  {
    id: "collateralized",
    label: "Collateralized",
    isDisabled: true,
  },
  {
    id: "activity",
    label: "Activity",
    isDisabled: true,
  },
];

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState(TABS[0].id);
  const {
    data: nfts,
    error,
    isLoading,
  } = useSWR(
    "/nft/list",
    async (url) => {
      const { data } = await propexAPI.get(url);
      const transformedData = data.map((nft) => ({
        id: nft.id,
        type: nft.type,
        placeId: nft.placeId,
        tier: nft.data.tier,
        isUpgraded: nft.isUpgraded,
        mintedData: nft.mintedData,
        coordinates: {
          lat: nft.mintDetailsData.lat,
          lng: nft.mintDetailsData.lng,
        },
        metadata: {
          name: nft.mintDetailsData.description,
          image: nft.metadata.image || nft.mintDetailsData.imageUrl || "",
          ...nft.metadata,
        },
        tokenId: nft.tokenId,
      }));
      return transformedData;
    },
    {
      fallbackData: null,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (error instanceof AxiosError) {
      toast.error("Error while fetching NFTs metadata");
    }
  }, [error]);

  return (
    <div className="bg-white h-full overflow-y-auto py-8 px-5">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-black">Portfolio</h1>

        <div className="w-full overflow-x-auto overflow-y-hidden mt-6">
          <div className="border-b border-black/10 w-full">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              variant="underlined"
              size="lg"
              className="-mb-[5px]"
            >
              {TABS.map((tab) => {
                return (
                  <Tab
                    key={tab.id}
                    title={tab.label}
                    isDisabled={tab.isDisabled}
                  />
                );
              })}
            </Tabs>
          </div>
        </div>

        <div className="mt-8">
          {!isLoading && nfts ? (
            <>
              {nfts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {nfts.map((nft, index) => {
                    return (
                      <div className="w-full" key={index}>
                        <NFTCard nft={nft} href={`/details/${nft.id}`} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-black text-center">
                  <div className="text-2xl font-semibold">
                    You don't have any available NFTs yet
                  </div>
                  <p className="opacity-40 mt-2">
                    Mint your first location NFT or explore the marketplace to
                    find your dream property
                  </p>

                  <div className="mt-8 flex flex-row items-center gap-4 text-sm">
                    <button
                      className={`h-12 px-4 lg:px-8 rounded-lg whitespace-nowrap bg-white border border-black/10 hover:bg-black/5`}
                    >
                      Buy Property
                    </button>

                    <Link href="/tier-one">
                      <div
                        className={`h-12 px-4 lg:px-8 rounded-lg whitespace-nowrap bg-black text-lemongrass hover:bg-black/90 flex items-center justify-center`}
                      >
                        Mint an Address
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full items-center justify-center py-[10rem]">
              <div className="flex flex-col items-center text-center">
                <Spinner className="size-8 text-mossgreen-800 fill-lemongrass-400" />
                <div className="opacity-40 mt-4 animate-bounce">
                  Loading your NFTs...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
