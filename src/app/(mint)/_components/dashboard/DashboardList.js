"use client";

/* eslint-disable @next/next/no-img-element */
import { Input } from "@nextui-org/react";
import Link from "next/link";
import Spinner from "../elements/Spinner";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import RaribleLogo from "@/assets/logo/rarible-logo.svg";
import Image from "next/image";
import { PROPEX_CONTRACT_ADDRESS } from "../../_configs/web3";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { createRaribleLink } from "@/utils/link";
import { useRouter } from "next/navigation";
import { cnm } from "@/utils/style";
import { X } from "lucide-react";

export const DashboardList = forwardRef(function DashboardList(
  { nfts, isLoading, isValidating, highlightedNft, setHighlightedNft },
  ref
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleSearchChange = useDebounceCallback((event) => {
    setSearchQuery(event.target.value);
  }, 300);

  const filteredNFTs = useMemo(() => {
    if (!searchQuery) return nfts;
    return nfts.filter((nft) =>
      nft.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [nfts, searchQuery]);

  const router = useRouter();

  const nftRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (highlightedNft && nftRefs.current[highlightedNft]) {
      if (timer) clearTimeout(timer);
      nftRefs.current[highlightedNft].scrollIntoView({ behavior: "smooth" });
      timer = setTimeout(() => {
        setHighlightedNft(null);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedNft]);

  return (
    <div className="w-full lg:h-full">
      <div className="px-4 flex flex-col lg:h-full">
        {/* Top Bar */}
        <div className="py-3 flex flex-row items-center gap-4 text-black sticky top-0 z-[60] overflow-hidden">
        <Input
          placeholder="Search location"
          className="h-full"
          classNames={{
            inputWrapper: "h-full bg-white overflow-hidden",
          }}
          variant="bordered"
          size="lg"
          value={searchValue}
          onChange={(e) => {
            handleSearchValueChange(e)
            handleSearchChange(e)
          }}
        />

          {searchQuery ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery(""); 
                setSearchValue("");
              }}
              className="flex absolute right-2 top-1/2 -translate-y-1/2 w-auto bg-white z-22 px-3"
            >
              <X className="size-5" />
            </button>
          ) : (
            <div className="flex absolute right-2 top-1/2 -translate-y-1/2 w-auto bg-white z-20 px-3">
              <img
                src="/assets/icons/search.svg"
                alt="search-icon"
                className="w-5 h-5"
              />
            </div>
          )}

          {/* <Button
            variant="bordered"
            className="bg-white px-2 !py-4 h-full"
            radius="md"
            size="lg"
          >
            <div className="flex flex-row items-center gap-2">
              <img
                src="/assets/icons/filter-vertical.svg"
                alt="filter-icon"
                className="w-6 h-6"
              />

              <div>Filter</div>
            </div>
          </Button> */}

          {/* <div className="w-[1px] h-[3rem] bg-black/10" />

          <div className="flex flex-row items-center">
            <Switch color="primary" size="sm">
              Heatmap
            </Switch>
          </div> */}
        </div>

        {/* NFT List */}
        <div className="mt-2 lg:flex-1 lg:overflow-y-auto flex flex-col">
          {!isLoading && nfts ? (
            <>
              {nfts.length > 0 ? (
                <>
                  {filteredNFTs.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
                        {filteredNFTs.map((nft, index) => {
                          return (
                            <div
                              key={index}
                              ref={(el) => (nftRefs.current[nft.id] = el)}
                            >
                              <NFTCard
                                nft={nft}
                                href={`/details/${nft.id}`}
                                router={router}
                                highlightedNft={highlightedNft}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* infinite fetch observer  */}
                      <div
                        ref={ref}
                        className="w-full h-16 flex items-center justify-center"
                      >
                        {isValidating && (
                          <Spinner className="size-5 fill-lemongrass-200 text-mossgreen" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center min-h-[80vh] text-black">
                      <div className="relative mt-2 size-80 mr-2">
                        <Image
                          src={"/assets/images/no-location-found-icon.png"}
                          alt="maps-card-nft"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-[20rem] flex flex-col items-center justify-center text-black">
                  <div className="text-2xl font-semibold">
                    There is no available location yet
                  </div>
                  <p className="opacity-40 mt-2">
                    Be the first to mint the Propex NFT
                  </p>

                  <div className="mt-8 flex flex-row items-center gap-4">
                    <Link href="/tier-one">
                      <div
                        className={`h-14 px-8 rounded-lg w-fit whitespace-nowrap bg-black text-lemongrass hover:bg-black/90 flex items-center justify-center`}
                      >
                        Mint an Address
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full items-center justify-center py-[10rem] flex-1">
              <div className="flex flex-col items-center text-center">
                <Spinner className="size-8 text-mossgreen-800 fill-lemongrass-400" />
                {/* <div className="mt-4 animate-bounce text-neutral-500">
                  Loading the places...
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default DashboardList;

function NFTCard({ nft, href = "/", router, highlightedNft }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.stopPropagation();
      }}
      passHref
    >
      <div
        className={cnm(
          "font-open-sauce w-full h-full flex flex-col bg-white rounded-2xl p-2.5 text-black border border-black/10 hover:shadow-lg hover:shadow-black/5 hover:border-black/40 transition-all duration-200 active:scale-95",
          highlightedNft === nft.id ? "border-mossgreen" : ""
        )}
      >
        <div className="w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-35%)] lg:w-[calc(100%-45%)] h-5 bg-white z-50 flex items-center justify-center top-0">
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                <div className="relative mt-2 h-4 w-4 mr-2">
                  <Image
                    src={"/assets/logo/propex-icon-logo.png"}
                    alt="maps-card-nft"
                    fill
                    // sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-black text-[10px] font-semibold whitespace-nowrap">
                  Propex Location NFT
                </span>
              </div>

              {/* Rounded inner */}
              <div
                className="bg-white h-5 w-10 absolute top-0 -left-9 -scale-x-100"
                style={{
                  clipPath: "url(#top-left-circle-clip)",
                }}
              ></div>
              <div
                className="bg-white h-5 w-10 absolute top-0 -right-9"
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
            {nft.metadata.image ? (
              <>
                <Image
                  src={nft?.metadata?.image}
                  alt="maps-card-nft"
                  fill
                  sizes="1080px"
                  className="object-cover"
                  loading="lazy"
                  onLoad={() => {
                    URL.revokeObjectURL(nft?.metadata?.image);
                  }}
                />
                <div className="absolute bottom-3 right-3">
                  <RaribleLink
                    onClick={() => {
                      router.push(
                        createRaribleLink(
                          nft.mintedData.chainId || 1135,
                          nft.mintedData.contractAddress ||
                            PROPEX_CONTRACT_ADDRESS,
                          nft.mintedData.tokenId || 0
                        )
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
              </>
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center font-medium text-sm">
                Image not available
              </div>
            )}
          </div>
        </div>
        <div className="card-nft-place-id mt-3 w-full">
          <p className="text-[10px] truncate text-neutral-500">
            ID : {nft?.placeId}
          </p>
          <p className="truncate font-bold mt-1 text-[0.9rem]">
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
    </Link>
  );
}

function RaribleLink({ onClick }) {
  return (
    <motion.button
      target="_blank"
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
