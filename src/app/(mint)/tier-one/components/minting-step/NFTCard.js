import Image from "next/image";
// import Link from "next/link";
import RaribleLogo from "@/assets/logo/rarible-logo.svg";
import { motion } from "framer-motion";
import { createRaribleLink } from "@/utils/link";
import { PROPEX_CONTRACT_ADDRESS } from "@/app/(mint)/_configs/web3";
import { ArrowUpRight, DiamondPlus } from "lucide-react";
// import SvgIcon from "@/app/_components/utils/SvgIcon";
import { useRouter } from "next/navigation";

export default function NFTCard({ nft, href = "/" }) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(href)} className="w-full cursor-pointer">
      <div className="font-open-sauce w-full h-full flex flex-col bg-white rounded-2xl p-3 text-black border border-black/10 hover:shadow-lg hover:shadow-black/5 hover:border-black/40 transition-all duration-200 active:scale-95">
        <div className="w-full aspect-square relative rounded-lg flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-35%)] lg:w-[calc(100%-52%)] h-5 lg:h-7 bg-white z-50 flex items-center justify-center top-0">
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
                  priority
                  onLoad={() => {
                    URL.revokeObjectURL(nft?.metadata?.image);
                  }}
                />
                <div className="absolute bottom-2 right-2">
                  <RaribleLink
                    onClick={() => {
                      window.open(
                        createRaribleLink(
                          nft.mintedData.chainId || 1135,
                          nft.mintedData.contractAddress ||
                            PROPEX_CONTRACT_ADDRESS,
                          nft.mintedData.tokenId || 0
                        ),
                        "_blank"
                      );
                    }}
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

                {nft.tier === 1 && nft.isUpgraded === false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/details/${nft.id}/expand`);
                    }}
                    className="mt-4 p-2 flex items-center gap-1.5 justify-center bg-lemongrass font-medium text-[10px] rounded-lg hover:bg-lemongrass-500 absolute bottom-2 left-2"
                    // disabled
                  >
                    <DiamondPlus className="size-3" />
                    Expand Territory
                  </button>
                )}
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

function RaribleLink({ onClick }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
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
    </motion.button>
  );
}
