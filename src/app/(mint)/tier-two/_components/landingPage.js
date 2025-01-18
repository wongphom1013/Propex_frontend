/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import SvgIcon from "../../../_components/utils/SvgIcon";
import { Button } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ViewAddressButton from "./viewAddress";
import useSWR from "swr";
import { propexAPI } from "../../_api/propex";
import Image from "next/image";
import RaribleLogo from "@/assets/logo/rarible-logo.svg";
import { motion } from "framer-motion";
import { createRaribleLink } from "@/utils/link";
import { PROPEX_CONTRACT_ADDRESS } from "@/app/(mint)/_configs/web3";
import { ArrowUpRight } from "lucide-react";

export default function LandingPage({
  userProgress,
  nextHandler,
  handleBackButton,
  setNftMetaData,
}) {
  const search = useSearchParams();
  const mintId = search.get("id");
  const { data: nftData, isLoading } = useSWR(
    mintId ? [`/nft/detail`, mintId] : null,
    async ([url, mintId]) => {
      try {
        const { data: nft } = await propexAPI.get(`${url}/${mintId}`);

        return {
          // id: nft.id,
          placeId: nft.mintDetailsData.placeId,
          tier: nft.tier,
          mintedData: nft.mintedData,
          coordinates: {
            lat: nft.mintDetailsData.lat,
            lng: nft.mintDetailsData.lng,
          },
          metadata: {
            ...nft.metadata,
            name: nft.mintDetailsData.description,
            image: nft.metadata.image || nft.mintDetailsData.imageUrl || "",
          },
          mintDetailsData: {
            ...nft.mintDetailsData,
          },
        };
      } catch (error) {
        console.error("error fetching nft", error);
      }
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (nftData) setNftMetaData(nftData);
  }, [nftData]);

  useEffect(() => {
    if (!mintId) {
      router.push("/tier-one");
    }
  }, [mintId]);

  if (userProgress !== "landingPage") return null;

  return (
    <div className="w-full max-w-[1480px] h-full px-5 lg:px-12 flex items-center justify-center pb-20">
      <div className="w-full h-full min-h-screen flex flex-col items-center">
        <div className="w-full h-full mb-8 mx-0">
          <ViewAddressButton
            userProgress={userProgress}
            nftMetaData={nftData}
            handleBackButton={handleBackButton}
          />
        </div>
        {/* Page Title */}
        <div className="w-full h-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold">Upgrade to RWA NFT</h1>
          <p className="text-[#6D6D6D] text-base mt-5 lg:mt-4">
            Securely tokenize your property for hassle-free buying, selling, and
            management.
            <span className="text-black font-bold block">
              Upgrade now for just $100.
            </span>
          </p>
        </div>

        <div className="relative bg-[#F1F2FF] w-full max-w-[629px] mt-8 rounded-lg border border-[#5283F1] pl-14 pr-4 py-4">
          <SvgIcon
            src="/assets/icons/info-icon.svg"
            className="w-6 h-6 bg-[#0F609B] absolute left-5 top-7"
          />

          <div className="w-full h-full max-w-[558px] flex flex-col items-start justify-center py-2">
            <p className="text-black font-bold">
              Get Your Documents Ready for Tier 2 RWA NFT Upgrade!
            </p>
            <p className="text-xs text-[#6D6D6D] mt-4">
              Please ensure you upload original documents only. Our KYC system
              will verify and approve authentic documents only. Make sure you
              have:{" "}
            </p>
            <div className="w-full h-full text-sm flex flex-col justify-center gap-2 mt-4">
              <p>
                1. Original land/house certificate or master leasehold document
              </p>
              <p>2. The latest SPPT PBB</p>
              <p>3. Identity Card of the freehold owner</p>
              <p>4. Family Card of the freehold owner</p>
            </div>
            <p className="text-xs text-[#6D6D6D] mt-4">
              Note: Only original documents will be accepted. Please prepare
              accordingly
            </p>
          </div>
        </div>

        <p className="text-black text-opacity-70 mt-8">Selected address:</p>

        {/* Card for Maps */}
        <div className="mt-5 w-full flex flex-col items-center">
          {isLoading || !nftData ? (
            <div className="h-[400px] w-[340px] sm:h-[440px] sm:w-[380px] flex items-center justify-center bg-neutral-200 animate-pulse rounded-2xl"></div>
          ) : (
            <div className="w-[360px] px-4">
              <NFTCard nft={nftData} />
            </div>
          )}
        </div>

        <Button
          onClick={nextHandler}
          className={`w-full h-full py-4 px-2 mt-8 max-w-[145px] max-h-14 rounded-lg bg-mossgreen text-lemongrass font-semibold hover:bg-mossgreen/90`}
        >
          Start Upgrade
        </Button>
      </div>
    </div>
  );
}

function NFTCard({ nft }) {
  return (
    <div className="w-full">
      <div className="font-open-sauce w-full h-full flex flex-col bg-white rounded-2xl p-3 text-black border border-black/10 hover:shadow-lg hover:shadow-black/5 hover:border-black/40 transition-all duration-200 active:scale-95">
        <div className="w-full aspect-square relative rounded-lg flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-35%)] lg:w-[calc(100%-55%)] h-5 lg:h-7 bg-white z-50 flex items-center justify-center top-0">
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="-translate-y-2 lg:-translate-y-2 flex items-center justify-center w-full h-full">
                <div className="relative mt-2 size-4 mr-2">
                  <Image
                    src={"/assets/logo/propex-icon-logo.png"}
                    alt="maps-card-nft"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-black text-[10px] font-semibold whitespace-nowrap">
                  Propex Location NFT
                </span>
              </div>

              {/* Rounded inner */}
              <div
                className="bg-white h-5 lg:h-7 w-10 absolute top-0 -left-9 -scale-x-100"
                style={{
                  clipPath: "url(#top-left-circle-clip)",
                }}
              ></div>
              <div
                className="bg-white h-5 lg:h-7 w-10 absolute top-0 -right-9"
                style={{
                  clipPath: "url(#top-left-circle-clip)",
                }}
              ></div>
              <div className="cutout-square"></div>
              <svg width="0" height="0">
                <defs>
                  <clipPath
                    id="top-left-circle-clip"
                    clipPathUnits="objectBoundingBox"
                  >
                    <path d="M 1,0 C 0.22,0 0.56,1 0,1 A 0,0 0 0,1 0,10 L 0,0 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="relative h-full w-full rounded-xl overflow-hidden">
            {nft?.metadata?.image ? (
              <>
                <Image
                  src={nft?.metadata?.image}
                  alt="maps-card-nft"
                  fill
                  sizes="1080px"
                  className="object-cover"
                  onLoad={() => {
                    URL.revokeObjectURL(nft?.metadata?.image);
                  }}
                />
                <div className="absolute bottom-2 right-2">
                  <RaribleLink
                    href={createRaribleLink(
                      nft.mintedData.chainId || 1135,
                      nft.mintedData.contractAddress || PROPEX_CONTRACT_ADDRESS,
                      nft.mintedData.tokenId || 0
                    )}
                  />
                </div>

                {/* {nft.tier === 2 && (
                  <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass text-sm absolute bottom-2 left-2">
                    <SvgIcon
                      src={"/assets/icons/verified.svg"}
                      className="w-4 h-4 bg-mossgreen"
                    />
                    <p>Notarized</p>
                  </div>
                )} */}
              </>
            ) : (
              <div className="w-full mt-4 flex flex-col gap-1 justify-center bg-lightgreen p-3 rounded-lg mx-auto">
                <p className="text-xs text-neutral-500">Coordinates</p>
                <p className="font-semibold truncate text-[0.8rem]">
                  {nft?.coordinates?.lat}, {nft?.coordinates?.lng}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 w-full overflow-hidden">
          <p className="text-[10px] truncate text-neutral-500">
            ID : {nft?.placeId}
          </p>
          <p className="truncate font-bold mt-1 text-[0.9rem] max-w-[300px]">
            {nft?.metadata?.name}
          </p>
        </div>
        {!nft?.coordinates?.lat || !nft?.coordinates?.lng ? (
          <div className="w-full min-h-16 text-sm mt-auto flex flex-col gap-1 items-center justify-center bg-lightgreen p-2 rounded-lg mx-auto">
            Coordinates not available
          </div>
        ) : (
          <div className="w-full mt-3 flex flex-col gap-1 justify-center bg-lightgreen p-3 rounded-lg mx-auto">
            <p className="text-xs text-neutral-500">Coordinates</p>
            <p className="font-semibold truncate text-[0.8rem]">
              {nft?.coordinates?.lat}, {nft?.coordinates?.lng}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RaribleLink({ href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      onClick={(e) => {
        e.stopPropagation();
      }}
      initial="initial"
      whileHover={"hover"}
      className="flex items-center bg-black/10 backdrop-blur-xl rounded-lg px-2 py-2 transition-colors hover:bg-black/15"
    >
      <motion.div
        variants={{
          initial: {
            opacity: 1,
          },
          hover: {
            opacity: 0,
            width: 0,
          },
        }}
        className="flex justify-start w-5"
      >
        <ArrowUpRight className="size-4" />
      </motion.div>
      <RaribleLogo className="w-4" />
      <motion.div
        variants={{
          initial: {
            opacity: 0,
            width: 0,
          },
          hover: {
            opacity: 1,
            width: 85 + 8,
          },
        }}
        className="overflow-hidden h-4 flex justify-end"
      >
        <motion.p className="text-xs whitespace-nowrap font-medium">
          See on Rarible
        </motion.p>
      </motion.div>
    </motion.a>
  );
}
