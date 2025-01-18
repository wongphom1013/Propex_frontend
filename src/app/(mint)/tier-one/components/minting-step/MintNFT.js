/* eslint-disable @next/next/no-img-element */
"use client";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { useResetTierTwoForm } from "@/app/(mint)/_hooks/useTierTwo";
import { THIRDWEB_LISK_CHAIN } from "@/app/(mint)/_lib/web3/chains-new";
import { thirdwebClient } from "@/app/(mint)/_lib/web3/thirdweb";
import { useRefreshTrigger } from "@/app/(mint)/_providers/RefreshProvider";
import { useMapStore } from "@/app/(mint)/_store/maps-store";
import {
  isPricingOpenAtom,
  mintingStepAtom,
  mintProgressAtom,
} from "@/app/(mint)/_store/mint-store";
import { useAtom, useSetAtom } from "jotai";
import { Checkbox, ListboxOptions } from "@headlessui/react";
import { MintingStepEnum, MintProgressEnum } from "../../constants/mint";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import LocationAnimation from "@/assets/dashboard/mint-page/animations/Location.json";
import { cnm } from "@/utils/style";
import { Listbox, ListboxButton, ListboxOption } from "@headlessui/react";
import useSWR from "swr";
import Confetti from "react-dom-confetti";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Lottie from "lottie-react";
import { RESET } from "jotai/utils";
import RaribleLogo from "@/assets/logo/rarible-logo.svg";
import AnimPointsCapsule from "../AnimPointsCapsule";
import { createRaribleLink } from "@/utils/link";
import { PROPEX_CONTRACT_ADDRESS } from "@/app/(mint)/_configs/web3";
import { ethers } from "ethers";
import { Skeleton, Tooltip } from "@nextui-org/react";
import SvgIcon from "@/app/_components/utils/SvgIcon";
import { isDemoModeAtom } from "@/app/(mint)/_store/demo-store";
import { LISK_MAINNET_CHAIN_ID } from "@/app/(mint)/_lib/web3/chains";
import { privateKeyToAccount } from "thirdweb/wallets";

export default function MintNFT() {
  return (
    <div className="py-12 flex flex-col items-center px-5">
      <MintProgress />
    </div>
  );
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const VALIDITIES = [
  { id: 1, name: "1 Month", value: "1-month" },
  { id: 2, name: "Permanent", value: "permanent" },
];

async function getGoogleMapSnapshotBlob(
  lat,
  lng,
  zoom = 15,
  size = "800x600",
  scale = 2,
  maptype = "roadmap",
  markerUrl
) {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}&maptype=${maptype}&key=${GOOGLE_MAPS_API_KEY}`;
  const marker = `&markers=icon:${encodeURIComponent(markerUrl)}|${lat},${lng}`;
  const finalUrl = mapUrl + marker;
  try {
    const res = await fetch(finalUrl);
    const data = await res.blob();
    return {
      blob: data,
      url: finalUrl,
    };
  } catch (error) {
    console.error("Error fetching the map snapshot:", error);
    throw error;
  }
}

function previewBlob(blob) {
  const url = URL.createObjectURL(blob);
  return url;
}

function MintProgress() {
  const searchQuery = useSearchParams();
  const isBypassQuery = searchQuery.get("isBypass");
  const {
    placeId,
    mapsAddress,
    selectedPosition,
    points,
    previewUrl,
    description,
    userRole,
    pointsActivity,
    marketValue,
    prevPosition,
    validity: _validity,
    districtID,
    setPreviewUrl,
    setValidity,
    setTxHash,
    setMintedId,
    setPrevPosition,
    setDistrictID,
  } = useMapStore();
  const router = useRouter();
  const activeAccount = useActiveAccount();
  const [checked, setChecked] = useState(false);
  const [, setMintingStep] = useAtom(mintingStepAtom);
  const [mintProgress, setMintProgress] = useAtom(mintProgressAtom);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { triggerRefresh } = useRefreshTrigger();
  const [isDemoMode] = useAtom(isDemoModeAtom);
  const { data: freeMintsQuota } = useSWR("/nft/mints/free-quota", (url) =>
    propexAPI.get(url)
  );

  const activeWalletChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();

  const reset = useResetTierTwoForm();

  const handleCheck = () => {
    setChecked(!checked);
  };

  function handleBack() {
    setMintingStep(MintingStepEnum["select-role"]);
  }

  const handleMapSnapshot = async () => {
    if (loading) return;
    const lat = selectedPosition.lat;
    const lng = selectedPosition.lng;
    setPreviewUrl(null);
    setLoading(true);
    try {
      // Step 1: Get the snapshot as a Blob
      const { blob } = await getGoogleMapSnapshotBlob(
        lat,
        lng,
        16,
        "600x600",
        2,
        "roadmap",
        "https://filebucketz.sgp1.cdn.digitaloceanspaces.com/misc/marker_sm.png"
      );
      // const previewUrl = previewBlob(blob);
      const formData = new FormData();
      formData.append("file", blob, `${nanoid(8)}.jpg`);
      const { data: cloudinary } = await propexAPI.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = cloudinary?.uploadedFile?.secure_url;
      setPreviewUrl(imageUrl);
    } catch (err) {
      toast.error("Error getting map snapshot, going back");
      setMintingStep(MintingStepEnum["select-location"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedPosition?.lat !== prevPosition?.lat ||
      selectedPosition?.lng !== prevPosition?.lng
    ) {
      handleMapSnapshot();
      setPrevPosition(selectedPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPosition.lat, selectedPosition.lng]);

  // =================================  MINTING LOGIC ================================= //

  function handleResetMint() {
    setMintProgress(MintProgressEnum["mint-confirmation"]);
  }

  async function handleSubmit() {
    // if (!activeAccount || !isDemoMode) {
    //   return toast.error("Wallet address is not found, try to sign in again");
    // }

    if (!placeId) {
      return toast.error("Place ID not found, try to redo your step");
    }

    if (!previewUrl) {
      return toast.error("Image is not available, please redo your step");
    }

    if (!selectedPosition.lat || !selectedPosition.lng) {
      return toast.error("Position is not available, please redo your step");
    }

    const chainId = activeWalletChain?.id.toString() || LISK_MAINNET_CHAIN_ID;

    if (!chainId) {
      return toast.error("Cannot find chain ID");
    }

    if(!districtID){
      return toast.error("District is not available, please redo your step");
    }

    setMintProgress(MintProgressEnum["mint-processing"]);

    try {
      const imageUrl = previewUrl;

      if (!imageUrl) {
        return toast.error(
          "Failed to retrieve uploaded image url, please try again"
        );
      }

      const mintRequestData = {
        placeId,
        chainId,
        validity: _validity,
        imageUrl,
        isBypass: isBypassQuery ? isBypassQuery : false,
        bypassPayload: {
          mapsAddress,
        },
        districtID,
      };

      // Step 1: ask for a mint request
      const { data } = await propexAPI.post(
        "/nft/mint-request/tier-1",
        mintRequestData
      );

      // DUMP DATA FOR PORTFOLIO DISPLAY

      const { data: mintRequestResponse } = data;
      const { mintData, messageHash, validity } = mintRequestResponse;

      let signature;
      console.log("signature");
      // Step 2: sign the request message
      if (activeWallet && activeWallet.id === "inApp" && !isDemoMode) {
        const signer = await ethers5Adapter.signer.toEthers({
          account: activeAccount,
          client: thirdwebClient,
          chain: THIRDWEB_LISK_CHAIN,
        });

        signature = await signer.signMessage(
          ethers.utils.arrayify(messageHash)
        );
      } else if (isDemoMode) {
        const account = privateKeyToAccount({
          client: thirdwebClient,
          privateKey: process.env.NEXT_PUBLIC_DEMO_WALLET_PK,
        });

        const signer = await ethers5Adapter.signer.toEthers({
          account,
          client: thirdwebClient,
          chain: THIRDWEB_LISK_CHAIN,
        });

        signature = await signer.signMessage(
          ethers.utils.arrayify(messageHash)
        );
      } else {
        signature = await activeAccount.signMessage({
          message: {
            raw: messageHash,
          },
        });
      }

      // Step 3: Mint the nft with requested message hash and metadata
      const mintDetailsData = {
        placeId,
        mapsAddress,
        lat: selectedPosition.lat,
        lng: selectedPosition.lng,
        marketValue,
        description,
        userRole,
        imageUrl,
      };

      const mintFinalData = {
        placeId,
        signature,
        messageHash,
        mintData,
        chainId,
        validity,
        mintDetailsData,
        paymentAmount: 0,
      };
      console.log("mint/tier-1")
      const { data: mintFinalResponse } = await propexAPI.post(
        "/nft/mint/tier-1",
        mintFinalData,
        {
          timeout: 50000,
          timeoutErrorMessage:
            'Minting process took more than 50 seconds. Aborting it. Please check your portfolio to see if the NFT was successfully completed."',
        }
      );
      console.log("pointsActivity");
      // const pointsActivities = pointsActivity.map((val) => ({
      //   pointsToAdd: val.pointsAdded,
      //   activitySlug: val.slug,
      // }));

      // try {
      //   await propexAPI.post("/user/points/update", {
      //     data: {
      //       activities: pointsActivities,
      //     },
      //   });
      // } catch (e) {
      //   toast.error("Error while updating your point");
      // }

      toast.success("NFT successfully minted");  
      setMintProgress(MintProgressEnum["mint-done"]);
      setTxHash(mintFinalResponse.data.txHash);
      setMintedId(mintFinalResponse.data.mintId);
      reset(); // < reset form tier two
      triggerRefresh(); 
      router.replace("/tier-one");
    } catch (e) {
      handleResetMint();
      if (e instanceof AxiosError) {
        if (
          e.response?.data?.error?.reason === "PLACE_ID_ALREADY_MINTED_FOR_TIER"
        ) {
          return toast.error(
            "This NFT has already been minted on-chain please select another location"
          );
        }
        return toast.error(e.response?.data?.message || e.cause.message || "");
      }
      console.log("error while mint", e);
      toast.error("There's an error while requesting mint");
    }
  }

  function handleValiditySelect(val) {
    setValidity(val.value);
  }

  switch (mintProgress) {
    case "mint-confirmation":
      return (
        <div className="bg-white text-black rounded-lg p-5 lg:p-6 flex flex-col justify-center items-center h-full w-full max-w-[678px]">
          {/* Minting Confirmation */}
          <div className="relative w-full flex flex-col items-center lg:mt-4">
            {/* Card and Images */}
            <div className="relative card-nft max-w-[380px] mx-auto rounded-2xl border border-black/10 w-full p-4 min-h-[415px] lg:min-h-[518px]">
              <AnimatePresence mode="wait">
                {loading && !previewUrl ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full rounded-2xl bg-neutral-400 animate-pulse h-full absolute inset-0 z-10"
                  ></motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    {/* Content */}
                    <div className="card-nft-body w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
                      {/* Notch */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-100px)] lg:w-[calc(100%-160px)] h-6 lg:h-7 bg-white z-50 flex items-center justify-center top-0">
                        <div className="relative flex items-center justify-center w-full h-full">
                          <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                            <div className="relative size-4 lg:size-5 mr-2">
                              <Image
                                src={"/assets/logo/propex-icon-logo.png"}
                                alt="maps-card-nft"
                                fill
                                sizes="64px"
                                className="object-contain"
                              />
                            </div>
                            <span className="text-black text-[10px] whitespace-nowrap lg:text-xs font-semibold">
                              Propex Location NFT
                            </span>
                          </div>

                          {/* Rounded inner */}
                          <div
                            className="bg-white h-6 lg:h-7 w-10 absolute top-0 -left-9 -scale-x-100"
                            style={{
                              clipPath: "url(#top-left-circle-clip)",
                            }}
                          ></div>
                          <div
                            className="bg-white h-6 lg:h-7 w-10 absolute top-0 -right-9"
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
                        {previewUrl || previewUrl !== "" ? (
                          <>
                            <img
                              src={previewUrl}
                              alt="maps-card-nft"
                              className="object-cover w-full h-full"
                              onLoad={() => {
                                setImageLoaded(true);
                              }}
                            />
                          </>
                        ) : null}
                        {(loading || !imageLoaded) && (
                          <Skeleton className="w-full h-full absolute inset-0" />
                        )}
                      </div>
                    </div>
                    <div className="card-nft-place-id mt-3 w-full">
                      <p className="text-[10px] truncate text-neutral-500">
                        ID : {placeId}
                      </p>
                      <p className="truncate font-bold mt-1">{mapsAddress}</p>
                    </div>
                    <div className="mt-4 card-nft-gps-coordinates flex flex-col gap-1 justify-center bg-lightgreen p-3 rounded-lg mx-auto">
                      <p className="text-xs text-neutral-500">
                        GPS Coordinates
                      </p>
                      <p className="font-semibold truncate text-sm">
                        {selectedPosition.lat}, {selectedPosition.lng}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Minting Detail */}
            <div className="w-full mt-7 py-4 px-4 border border-black/10 rounded-lg text-sm">
              <div className="flex justify-between items-center">
                <p>
                  Minting Fee{" "}
                  <span className="text-[10px] text-neutral-500">
                    (estimated)
                  </span>
                </p>
                <div className="font-semibold">
                  {_validity === "1-month" ? (
                    <p className="whitespace-nowrap">
                      FREE{" "}
                      <span className="text-[10px]">(for first 10 mint)</span>
                    </p>
                  ) : _validity === "permanent" ? (
                    <p>10 LSK</p>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p>Gas Fee</p>
                <p className="font-semibold text-tealBlue">FREE</p>
              </div>
              <div>
                <AnimatePresence mode="wait">
                  {_validity === "1-month" && (
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
                      className="flex justify-between items-center pt-2"
                    >
                      <p>Free Mint Quota</p>
                      <p className="font-semibold text-tealBlue">
                        {freeMintsQuota?.data?.data?.quota ?? 0}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold">Total</p>
                <div className="text-right">
                  <div className="font-semibold">
                    {_validity === "1-month" ? (
                      <p>
                        FREE{" "}
                        <span className="text-[10px]">(for first 10 mint)</span>
                      </p>
                    ) : _validity === "permanent" ? (
                      <p>10 LSK</p>
                    ) : null}
                  </div>
                  <p className="text-tealBlue text-[10px]">
                    You will get {points} Points
                  </p>
                </div>
              </div>
            </div>

            {/* Validity select */}
            <div className="w-full flex items-center justify-between mt-5">
              <div className="flex flex-col items-start gap-2">
                <p>Validity</p>
                <div className="text-[10px] text-black rounded-md px-2 py-1 bg-mossgreen-800/10 max-w-[150px] lg:max-w-none">
                  {_validity === "1-month"
                    ? "You got only 10 free mint for this validity"
                    : _validity === "permanent"
                    ? "Permanent validity require 10 LSK token to mint"
                    : "You got only 10 free mint for this validity"}
                </div>
              </div>
              <ValiditySelect onSelected={handleValiditySelect} />
            </div>

            {/* Confirmation Box */}
            <button
              onClick={handleCheck}
              className="flex items-center gap-2 mt-6 w-full"
            >
              <Checkbox
                checked={checked}
                onChange={handleCheck}
                className="cursor-pointer group size-5 rounded border border-black flex items-center justify-center shrink-0"
              >
                <div className="hidden size-2.5 bg-black group-data-[checked]:block rounded-[2px]"></div>
              </Checkbox>
              <p className="text-xs lg:text-sm text-neutral-400 text-start">
                Please confirm you&apos;re comfortable linking your wallet to
                this address publicly
              </p>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!checked}
              type="submit"
              className={`h-14 mt-5 rounded-lg overflow-hidden w-full ${
                checked
                  ? "bg-black text-lemongrass hover:bg-black/90"
                  : "bg-gray-200 text-neutral-500 hover:disabled:"
              } font-semibold`}
            >
              Mint Now!{" "}
              {_validity === "permanent"
                ? "(10 LSK)"
                : freeMintsQuota?.data?.data?.isQuotaEmpty
                ? "(2 LSK)"
                : null}
            </button>

            {/* Buttons */}
            <button
              onClick={handleBack}
              type="submit"
              className="mx-auto mt-2 h-14 rounded-lg border border-black/10 overflow-hidden w-full bg-white hover:bg-neutral-100 text-black font-semibold"
            >
              Back
            </button>

            {/* <div className="flex gap-2 mx-auto mt-6 w-full">
              <button
                onClick={handlePaymentByCard}
                disabled={!checked}
                type="submit"
                className={`h-14 rounded-lg overflow-hidden w-full ${
                  checked
                    ? "bg-black text-lemongrass hover:bg-black/90"
                    : "bg-gray-200 text-neutral-500 hover:disabled:"
                } font-semibold`}
              >
                Pay With Card
              </button>
         
            </div> */}
          </div>
          <div className="mt-8">
            <AnimPointsCapsule points={points} />
          </div>
        </div>
      );
    case "mint-processing":
      return <MintProcessing />;
    case "mint-done":
      return <MintDone />;
  }
}

function ValiditySelect({ onSelected }) {
  const [selected, setSelected] = useState(VALIDITIES[0]);

  function handleSelected(val) {
    onSelected && onSelected(val);
    setSelected(val);
  }

  return (
    <Listbox value={selected} onChange={handleSelected}>
      <ListboxButton
        className={cnm(
          "relative flex items-center gap-2 border rounded-lg bg-white/5 px-4 py-2 text-left text-xs lg:text-sm text-black",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
        )}
      >
        {selected.name}
        <ChevronDown
          className="group pointer-events-none size-4 stroke-black/60"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom end"
        transition
        className={cnm(
          "min-w-36 rounded-xl border bg-white p-1 [--anchor-gap:8px] focus:outline-none",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
        )}
      >
        {VALIDITIES.map((validity) => (
          <ListboxOption
            key={validity.name}
            value={validity}
            className="group flex cursor-pointer items-center justify-start w-full gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
          >
            <Check className="invisible size-4 fill-white group-data-[selected]:visible" />
            <div className="text-sm text-black">{validity.name}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

const nftTrivia = [
  "Creating Your NFT—Almost There!",
  "Did you know? NFTs can represent ownership of unique digital items.",
  "NFTs are often used for digital art, but they can also represent virtual real estate, collectibles, and more.",
  "We are still minting it, we will tell joe to make it faster. Please wait in kind... JOE!",
  "Each NFT is unique and cannot be replicated, making it a true one-of-a-kind asset.",
  "NFTs use blockchain technology to verify ownership and authenticity.",
  "The first NFT was created in 2017, but the concept has evolved rapidly since then.",
  "We are almost there, just a little bit further...",
];

function MintProcessing() {
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTriviaIndex((prevIndex) => (prevIndex + 1) % nftTrivia.length);
    }, 5000); // Change trivia every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      }}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
      }}
      className="h-full flex flex-col justify-center items-center p-8 min-h-[60vh]"
    >
      {/* <Lottie
        animationData={loadingAnimations}
        loop={true}
        autoplay={true}
        style={{ width: "10rem", height: "10rem" }}
      /> */}
      <Lottie
        animationData={LocationAnimation}
        loop={true}
        autoplay={true}
        style={{ width: "16rem", height: "16rem" }}
      />
      <div className="text-center opacity-70 animate-pulse text-sm -mt-[2rem]">
        On process to mint your NFT
      </div>
      <p className="font-semibold text-white mt-4 w-full font-open-sauce text-center text-balance max-w-2xl">
        {nftTrivia[triviaIndex]}
      </p>
    </motion.div>
  );
}

function MintDone() {
  const {
    placeId,
    mapsAddress,
    selectedPosition,
    previewUrl,
    reset,
    mintedId,
  } = useMapStore();
  const setMintingStep = useSetAtom(mintingStepAtom);
  const setMintProgress = useSetAtom(mintProgressAtom);
  const router = useRouter();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { data: nftDetail, isLoading: nftDetailLoading } = useSWR(
    `/nft/detail/${mintedId}`,
    async (url) => {
      const { data } = await propexAPI.get(url);
      return data;
    }
  );

  function handleRestart() {
    URL.revokeObjectURL(previewUrl);
    reset();
    setMintingStep(RESET);
    setMintProgress(RESET);
  }

  async function handleUpgradeToRWANft() {
    if (!mintedId) {
      return toast.error(
        "Cannot read minted item ID, upgrade from portolio instead"
      );
    }
    URL.revokeObjectURL(previewUrl);
    reset();
    setMintingStep(RESET);
    setMintProgress(RESET);
    router.push(`/tier-two?id=${mintedId}`);
  }

  async function handleExpandTerritory() {
    router.push(`/details/${mintedId}/expand`);
  }

  function handleComingSoon() {
    toast("This feature is coming soon");
  }

  const confettiConfig = {
    angle: 90, // Angle at which the confetti will explode
    spread: 300, // How much area the confetti will cover
    startVelocity: 20, // Starting speed of the particles
    elementCount: 60, // Number of confetti pieces
    dragFriction: 0.1, // Drag friction applied to particles
    duration: 3000, // How long the confetti effect lasts
    stagger: 3, // Delay between confetti particle launch
    width: "8px", // Width of confetti pieces
    height: "8px", // Height of confetti pieces
    perspective: "500px", // Perspective value for 3D effect
  };

  const [confettiTrigger, setConfettiTrigger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfettiTrigger((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="w-full flex flex-col items-center"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      }}
      // 1 time entry animation
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
      }}
    >
      <div className="absolute inset-0 w-screen h-screen overflow-hidden flex flex-col items-center mx-auto pointer-events-none">
        <Confetti
          active={confettiTrigger}
          config={confettiConfig}
          className="-translate-y-[4rem] translate-x-[0.4rem]"
        />
      </div>

      <div>
        <div className="text-5xl font-semibold text-center">
          Congrats, you just minted your Location NFT!
        </div>
        {/* <div className="text-md text-center opacity-50">
          You have successfully minted your Propex Location NFT
        </div> */}
      </div>

      {/* Card */}
      <div className="font-open-sauce mt-12 w-full max-w-[380px] bg-white rounded-2xl p-4 text-black glow-lemongrass border-2 border-lemongrass">
        <div className="w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-100px)] lg:w-[calc(100%-160px)] h-7 bg-white z-50 flex items-center justify-center top-0">
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                <div className="relative size-4 lg:size-5 mr-2">
                  <Image
                    src={"/assets/logo/propex-icon-logo.png"}
                    alt="maps-card-nft"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <span className="text-black text-[10px] lg:text-xs font-semibold whitespace-nowrap">
                  Propex Location NFT
                </span>
              </div>

              {/* Rounded inner */}
              <div
                className="bg-white h-7 w-10 absolute top-0 -left-9 -scale-x-100"
                style={{
                  clipPath: "url(#top-left-circle-clip)",
                }}
              ></div>
              <div
                className="bg-white h-7 w-10 absolute top-0 -right-9"
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
          {/* TODO Change to iframe */}
          <div className="relative h-full w-full rounded-xl overflow-hidden">
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
              className="w-full h-full"
            >
              <iframe
                src={nftDetail?.metadata?.animation_url}
                className="w-full h-full rounded-xl"
                onLoad={() => {
                  setIframeLoaded(true);
                }}
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {(nftDetailLoading || !iframeLoaded) && (
                <Skeleton className="w-full h-full absolute inset-0 bg-neutral-200" />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="card-nft-place-id mt-3 w-full">
          <p className="text-[10px] truncate text-neutral-500">
            ID : {placeId}
          </p>
          <p className="truncate font-bold mt-1">{mapsAddress}</p>
        </div>
        <div className="mt-4 card-nft-gps-coordinates flex flex-col gap-1 justify-center bg-lightgreen p-3 rounded-lg mx-auto">
          <p className="text-xs text-neutral-500">GPS Coordinates</p>
          <p className="font-semibold truncate text-sm">
            {selectedPosition.lat}, {selectedPosition.lng}
          </p>
        </div>
        {nftDetailLoading ? (
          <Skeleton className="w-full h-12 rounded-lg bg-neutral-200 animate-pulse mt-4" />
        ) : (
          <div className="w-full mt-4">
            <motion.a
              href={createRaribleLink(
                nftDetail?.mintedData?.chainId || 1135,
                nftDetail?.mintedData?.contractAddress ||
                  PROPEX_CONTRACT_ADDRESS,
                nftDetail?.mintedData?.tokenId || 0
              )}
              className="h-12 w-full flex justify-center rounded-lg items-center gap-2 hover:bg-neutral-100 border"
              target="_blank"
              initial="initial"
              whileHover="hover"
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
                className="flex justify-start w-6"
              >
                <ArrowUpRight className="size-5" />
              </motion.div>
              <RaribleLogo className="w-5" />
              <motion.div
                variants={{
                  initial: {
                    opacity: 0,
                    width: 0,
                  },
                  hover: {
                    opacity: 1,
                    width: 101 + 4,
                  },
                }}
                className="overflow-hidden h-5 flex justify-end items-center"
              >
                <motion.p className="text-sm whitespace-nowrap font-medium">
                  See on Rarible
                </motion.p>
              </motion.div>
            </motion.a>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl grid lg:grid-cols-2 gap-3 mt-12">
          {/* <Tooltip content="Coming soon!"> */}
          <button
            onClick={() => handleUpgradeToRWANft()}
            // className="bg-lemongrass rounded-lg px-8 py-4 font-semibold font-urbanist w-full text-black"
            className="border border-white rounded-lg px-6 py-4 text-white hover:bg-white hover:text-black font-semibold w-full"
            // disabled
          >
            Upgrade to RWA NFT
          </button>
          {/* </Tooltip> */}

          <button
            onClick={() => handleExpandTerritory()}
            className="bg-lemongrass rounded-lg px-8 py-4 font-semibold font-urbanist w-full text-black hover:bg-lemongrass-600 transition-colors"
          >
            Expand Territory
          </button>

          {/* <BuyMoreMintsButton /> */}
        </div>
      </div>

      <div className="flex flex-row items-center gap-8 mt-12">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleRestart()}
            className="border border-white rounded-full group items-center justify-center flex text-white hover:bg-white hover:text-black font-semibold aspect-square relative w-[48px]"
          >
            <SvgIcon
              src="/assets/icons/plus-icon.svg"
              className="w-[24px] h-[24px] bg-lemongrass"
            />
          </button>
          <p className="text-sm w-full">Mint new Address</p>
        </div>
        <div className="flex flex-col items-center gap-2 px-8">
          <button
            onClick={() => router.push(`/details/${mintedId}`)}
            className="border border-white rounded-full group items-center justify-center flex text-white hover:bg-white hover:text-black font-semibold aspect-square relative w-[48px]"
          >
            <SvgIcon
              src="/assets/icons/eye.svg"
              className="w-[24px] h-[24px] bg-lemongrass"
            />
          </button>
          <p className="text-sm w-full">View Details</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleComingSoon()}
            className="border border-white rounded-full group items-center justify-center flex text-white hover:bg-white hover:text-black font-semibold aspect-square relative w-[48px]"
          >
            <SvgIcon
              src="/assets/icons/share-icon.svg"
              className="w-[24px] h-[24px] bg-lemongrass"
            />
            <div className="bg-lightgreen absolute p-[2px] flex items-center rounded-2xl -right-5 -top-2">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-green-600 font-semibold text-xs ml-1">
                +1
              </span>
            </div>
          </button>
          <p className="text-sm w-full">Share & Get Points</p>
          {/* <button
                onClick={() => handleComingSoon()}
                className="border border-white rounded-lg px-6 py-3.5 text-white hover:bg-white hover:text-black font-semibold flex whitespace-nowrap items-center justify-center gap-2 w-full"
              >
                <span>Share & Get Points</span>
                <div className="bg-lightgreen py-1 flex items-center rounded-2xl px-2">
                  <div className="relative w-4 h-4">
                    <Image
                      src={"/assets/logo/propex-coin.png"}
                      alt="propex-coin"
                      fill
                      sizes="350px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-green-600 font-semibold text-xs ml-1">
                    +1
                  </span>
                </div>
              </button> */}
        </div>
      </div>
    </motion.div>
  );
}

function BuyMoreMintsButton() {
  const [, setPricingOpen] = useAtom(isPricingOpenAtom);

  function onClick() {
    setPricingOpen(true);
  }

  return (
    <div
      onClick={onClick}
      className="border cursor-pointer border-white rounded-lg px-6 py-4 text-white hover:bg-white hover:text-black font-semibold w-full justify-center flex"
    >
      Buy more mints
    </div>
  );
}
