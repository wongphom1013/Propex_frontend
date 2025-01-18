"use client";
import { nftMetadataAtom } from "@/store/image-store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  formStepAtom,
  propertyFormPoint,
  rwaCardDetailAtom,
} from "../../_store/form-store";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { useRefreshTrigger } from "@/app/(mint)/_providers/RefreshProvider";
import { useRouter } from "next/navigation";
import { useFormsStore } from "../../_store/form-store-zustand";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import { THIRDWEB_LISK_CHAIN } from "../../_lib/web3/chains-new";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ethers } from "ethers";
import { thirdwebClient } from "../../_lib/web3/thirdweb";
import axios, { AxiosError } from "axios";
import { isDemoModeAtom } from "../../_store/demo-store";
import {
  LISK_MAINNET_CHAIN_ID,
  MAINNET_LISK_CONFIG,
} from "../../_lib/web3/chains";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "ethers";
import { SiweMessage } from "siwe";
import { privateKeyToAccount } from "thirdweb/wallets";

// -------------- Components LazyLoading ---------------
const LandingPage = dynamic(() => import("./landingPage"), {
  ssr: false,
  loading: () => <LandingPageSkeleton />,
});

const OwnershipFormPage = dynamic(() => import("./forms/ownership/page"), {
  ssr: false,
  loading: () => <OwnershipFormSkeleton />,
});

const PropertyFormPage = dynamic(() => import("./forms/property/page"), {
  ssr: false,
  loading: () => <PropertyFormSkeleton />,
});

const ConfirmationPage = dynamic(() => import("./forms/confirmation/page"), {
  ssr: false,
  loading: () => <ConfirmationFormSkeleton />,
});

const Footer = dynamic(() => import("./footer/footer"), {
  ssr: false,
});

const Modal = ({ showPopUp, closeModal, handleSaveAndExit, loading }) => {
  if (!showPopUp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-open-sauce px-4">
      <div className="bg-white rounded-2xl shadow-lg mx-auto w-full max-w-[568px]">
        <div className="w-full px-6 py-2 relative border-b border-[#BDBDBD] flex justify-between items-center">
          <button
            onClick={closeModal}
            disabled={loading}
            className="text-gray-600 hover:text-gray-800 text-lg font-bold"
          >
            &#x2715;
          </button>
        </div>
        <div className="w-full flex flex-col justify-between items-center px-4 py-6 sm:p-6">
          <div className="w-full h-full mt-2">
            <div className="w-full text-center">
              <p className="text-lg font-semibold mb-2">
                Are you sure you want to leave?
              </p>
              <div>
                <p className="text-sm text-[#6D6D6D]">
                  If you exit now, your listing will be discarded.{" "}
                </p>
                <p className="text-sm text-[#6D6D6D] mt-2 text-balance">
                  {" "}
                  Choose &apos;Stay&apos; to keep editing or &apos;Exit&apos; to
                  discard and leave.
                </p>
              </div>
            </div>
            <div className="w-full flex gap-4 mt-8">
              <button
                onClick={closeModal}
                disabled={loading}
                className="w-full h-[54px] bg-white border border-[#DFE3EC] rounded-lg flex justify-center items-center hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSaveAndExit}
                className="w-full h-[54px] bg-mossgreen border border-[#DFE3EC] rounded-lg text-lemongrass flex justify-center items-center hover:bg-mossgreen/90"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationFormSkeleton = () => {
  return (
    <>
      <div className="pb-12 lg:pb-20 w-full max-w-[1480px] h-full max-h-[68px] flex flex-col items-center font-open-sauce mt-4">
        <div className="w-full h-full px-6">
          <div className="w-full h-full min-h-[68px] flex justify-between">
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-full max-w-[1480px] min-h-screen px-4">
        {/* Skeleton for Stepper */}
        <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center mt-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 2 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 3 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
          </div>
        </div>

        {/* Skeleton for forms */}
        <div className="w-full h-full flex flex-col justify-center items-center mt-20 gap-4">
          {/* Text Title */}
          <div className="w-full max-w-[300px] h-12 rounded-lg bg-gray-400 animate-pulse mb-4"></div>

          <div className="w-full h-full max-w-[628px] mx-auto">
            <div className="relative w-full">
              <div className="relative card-nft max-w-[380px] max-h-[443px] mx-auto rounded-2xl border border-black border-opacity-10 w-full p-5">
                {/* Content */}
                <div className="card-nft-body w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
                  {/* Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-160px)] h-7 bg-white z-50 flex items-center justify-center top-0">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                        <div className="w-full  h-full rounded-lg bg-gray-400 animate-pulse"></div>
                      </div>

                      {/* Rounded inner */}
                      <div
                        className="bg-white h-7 w-10 absolute top-0 -left-10 -scale-x-100"
                        style={{
                          clipPath: "url(#top-left-circle-clip)",
                        }}
                      ></div>
                      <div
                        className="bg-white h-7 w-10 absolute top-0 -right-10"
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
                  <div className="relative w-full rounded-xl overflow-hidden max-w-[348px] h-[348px]">
                    <div className="w-full h-full bg-gray-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="card-nft-place-id mt-3 w-full">
                  <div className="w-full h-8 bg-gray-400 animate-pulse rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[127px] rounded-lg bg-gray-400 animate-pulse max-w-[628px] mt-8"></div>
        </div>
      </div>
    </>
  );
};

const LandingPageSkeleton = () => {
  return (
    <>
      <div className="pb-12 lg:pb-20 w-full max-w-[1480px] h-full max-h-[68px] flex flex-col items-center font-open-sauce mt-4">
        <div className="w-full h-full px-6">
          <div className="w-full h-full min-h-[68px] flex justify-between">
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-full max-w-[1480px] min-h-screen px-4">
        {/* Skeleton for forms */}
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
          {/* Text Title */}
          <div className="w-full max-w-[300px] h-12 rounded-lg bg-gray-400 animate-pulse"></div>

          <div className="w-full max-w-[420px] h-8 rounded-lg bg-gray-400 animate-pulse mb-4"></div>

          <div className="w-full max-w-[629px] h-[210px] bg-gray-400 animate-pulse rounded-lg mb-8"></div>

          <div className="w-full max-w-[120px] h-8 bg-gray-400 animate-pulse rounded-lg mb-8"></div>

          <div className="w-full h-full max-w-[628px] mx-auto">
            <div className="relative w-full">
              <div className="relative card-nft max-w-[380px] h-full max-h-[520px] mx-auto rounded-2xl border border-black border-opacity-10 w-full p-5">
                {/* Content */}
                <div className="card-nft-body w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
                  {/* Notch */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-160px)] h-7 bg-white z-50 flex items-center justify-center top-0">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                        <div className="w-full  h-full rounded-lg bg-gray-400 animate-pulse"></div>
                      </div>

                      {/* Rounded inner */}
                      <div
                        className="bg-white h-7 w-10 absolute top-0 -left-10 -scale-x-100"
                        style={{
                          clipPath: "url(#top-left-circle-clip)",
                        }}
                      ></div>
                      <div
                        className="bg-white h-7 w-10 absolute top-0 -right-10"
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
                  <div className="relative w-full rounded-xl overflow-hidden max-w-[348px] h-[348px]">
                    <div className="w-full h-full bg-gray-400 animate-pulse"></div>
                  </div>
                </div>
                <div className="card-nft-place-id mt-3 w-full">
                  <div className="w-full h-8 bg-gray-400 animate-pulse rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[160px] h-12 rounded-lg bg-gray-400 animate-pulse mt-8"></div>
        </div>
      </div>
    </>
  );
};

const OwnershipFormSkeleton = () => {
  return (
    <>
      <div className="pb-12 lg:pb-20 w-full max-w-[1480px] h-full max-h-[68px] flex flex-col items-center font-open-sauce mt-4">
        <div className="w-full h-full px-6">
          <div className="w-full h-full min-h-[68px] flex justify-between">
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-full max-w-[1480px] min-h-screen px-4">
        {/* Skeleton for Stepper */}
        <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center mt-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 2 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 3 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
          </div>
        </div>

        {/* Skeleton for forms */}
        <div className="w-full h-full flex flex-col justify-center items-center mt-20 gap-4">
          {/* Text Title */}
          <div className="w-full max-w-[192px] h-12 rounded-lg bg-gray-400 animate-pulse mb-4"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px]">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>
          <div className="w-full h-[168px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>
          <div className="w-full h-[168px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>
          <div className="w-full h-[168px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>
          <div className="w-full h-[168px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>
        </div>
      </div>
    </>
  );
};

const PropertyFormSkeleton = () => {
  const skeletonArrayAmenities = Array(12).fill(0);
  return (
    <>
      <div className="pb-12 lg:pb-20 w-full max-w-[1480px] h-full max-h-[68px] flex flex-col items-center font-open-sauce mt-4">
        <div className="w-full h-full px-6">
          <div className="w-full h-full min-h-[68px] flex justify-between">
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
            <div className="w-full h-12 bg-gray-400 animate-pulse max-w-48 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-full max-w-[1480px] min-h-screen px-4">
        {/* Skeleton for Stepper */}
        <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center mt-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 2 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Step 3 Skeleton */}
            <div className="relative flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-white rounded-full">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="absolute -bottom-6 font-semibold bg-gray-400 text-sm w-16 h-4 rounded-lg"></span>
            </div>
          </div>
        </div>

        {/* Skeleton for forms */}
        <div className="w-full h-full flex flex-col justify-center items-center mt-20 gap-4">
          {/* Text Title */}
          <div className="w-full max-w-[192px] h-12 rounded-lg bg-gray-400 animate-pulse mb-4"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px]">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[120px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>

          <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center gap-4">
            <div className="w-full h-full flex gap-4">
              <div className="w-1/2 h-12 bg-gray-400 animate-pulse rounded-lg"></div>
              <div className="w-1/2 h-12 bg-gray-400 animate-pulse rounded-lg"></div>
            </div>
            <div className="w-full h-full flex gap-4">
              <div className="w-1/2 h-12 bg-gray-400 animate-pulse rounded-lg"></div>
              <div className="w-1/2 h-12 bg-gray-400 animate-pulse rounded-lg"></div>
            </div>
          </div>

          {/* Small Sub-title */}
          <div className="w-full h-full flex justify-start max-w-[628px] mt-4">
            <div className="w-full max-w-[162px] h-8 bg-gray-400 animate-pulse rounded-lg"></div>
          </div>
          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          <div className="w-full h-[56px] rounded-lg bg-gray-400 animate-pulse max-w-[628px]"></div>

          {/* Amenities selects box */}
          <div className="w-full h-full max-w-[628px] flex flex-wrap gap-4 justify-center">
            {skeletonArrayAmenities.map((_, index) => (
              <div
                key={index}
                className="w-[100px] h-[100px] md:w-[138px] md:h-[138px] flex flex-col items-center justify-center border rounded-lg font-open-sauce text-sm cursor-pointer border-gray-300"
              >
                <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-16 h-4 rounded-lg bg-gray-400 animate-pulse mt-2"></div>
              </div>
            ))}
          </div>

          {/* Thumbnail Images */}
          <div className="w-full h-full flex flex-col justify-center items-start max-w-[628px] mt-2">
            <div className="w-[192px] h-[192px] rounded-lg bg-gray-400 animate-pulse mt-2"></div>
          </div>

          {/* General Images box */}
          <div className="w-full h-full flex flex-col justify-center items-start max-w-[628px] mt-2">
            <div className="w-[192px] h-[192px] rounded-lg bg-gray-400 animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const deleteFromCloudinary = async (publicId) => {
  try {
    // change using axios
    const { status, data } = await fetch(
      `${process.env.NEXT_PUBLIC_MAIN_URL}/api/uploads/cloudinary`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      }
    );

    if (status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export default function HomeSection() {
  const router = useRouter();
  const [nftMetaData, setNftMetaData] = useAtom(nftMetadataAtom);
  const [userProgress, setUserProgress] = useAtom(formStepAtom);
  const [userFormPoint] = useAtom(propertyFormPoint);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isPreviousAvailable, setIsPreviousAvailable] = useState(false);
  const [customNextButtonText, setCustomNextButtonText] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [, setRwaCardDetail] = useAtom(rwaCardDetailAtom);
  const [loading, setLoading] = useState(false);
  const [isDemoMode] = useAtom(isDemoModeAtom);

  // State for minting process
  const activeWalletChain = useActiveWalletChain();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const { ownershipFormZustand, propertyFormZustand, pointsActivity, reset } =
    useFormsStore();

  useEffect(() => {
    setIsPreviousAvailable(
      ["propertyForm", "mintingConfirmation"].includes(userProgress)
    );
  }, [userProgress]);

  const handleNext = async () => {
    const progressMap = {
      landingPage: "ownershipForm",
      ownershipForm: "propertyForm",
      propertyForm: "mintingConfirmation",
      mintingConfirmation: "minting",
      minting: "mintingSuccess",
    };

    const nextProgress = progressMap[userProgress];

    setUserProgress(nextProgress);

    if (nextProgress === "minting") {
      handleSubmit();
    }

    if (nextProgress === "mintingConfirmation") {
      setCustomNextButtonText("Mint Now");
    }

    // To ensure that the forms are always empty when first time entering the forms, we reset it first.
    if (nextProgress === "ownershipForm") {
      resetForms();
    }
  };

  const handlePrevious = () => {
    const previousMap = {
      propertyForm: "ownershipForm",
      mintingConfirmation: "propertyForm",
      minting: "mintingConfirmation",
    };

    const newProgress = previousMap[userProgress];
    if (newProgress === "ownershipForm") {
      setIsPreviousAvailable(false);
    }
    if (newProgress === "propertyForm") {
      setCustomNextButtonText(null);
    }
    setUserProgress(newProgress);
  };

  const handleSaveAndExit = async () => {
    setShowPopUp(false);
    toast.loading("loading...", {
      position: "top-center",
      id: "reset-form-loading",
    });
    setLoading(true);
    await hardResetForm();
    setUserProgress("landingPage");
    setLoading(false);
    toast.dismiss("reset-form-loading");
    router.push("/portfolio");
  };

  const handleBackButton = () => {
    setShowPopUp(true);
  };

  const hardResetForm = async () => {
    try {
      const combinedForm = {
        ...propertyFormZustand,
        ...ownershipFormZustand,
      };

      const cloudinaryItems = [
        combinedForm.thumbnail,
        ...(combinedForm.images || []),
        combinedForm.documentPdf,
        combinedForm.spptPBB,
        combinedForm.ownerIdentityCard,
        combinedForm.ownerFamilyCard,
      ];

      const deletePromises = cloudinaryItems
        .filter((item) => item && item.public_id)
        .map((item) => deleteFromCloudinary(item.public_id));

      await Promise.all(deletePromises);
      resetForms();
    } catch (error) {
      console.log(error);
    }
  };

  const { triggerRefresh } = useRefreshTrigger();

  async function handleSubmit() {
    // if (!isDemoMode) {
    //   toast.error("Wallet address is not found, try to sign in again");
    //   setUserProgress("mintingConfirmation");
    //   return false;
    // }

    if (!nftMetaData.mintDetailsData.placeId) {
      toast.error("Place ID not found, try to redo your step");
      setUserProgress("mintingConfirmation");
      return false;
    }

    if (!propertyFormZustand.thumbnail.url) {
      toast.error("Image is not available, please redo your step");
      setUserProgress("mintingConfirmation");
      return false;
    }

    const chainId = activeWalletChain?.id.toString() || LISK_MAINNET_CHAIN_ID;

    if (!chainId) {
      toast.error("Cannot find chain ID");
      setUserProgress("mintingConfirmation");
      return false;
    }

    // Proceed to mint
    const combinedForm = {
      ...propertyFormZustand,
      ...ownershipFormZustand,
    };

    const placeId = nftMetaData.mintDetailsData.placeId;
    const mintRequestData = {
      placeId,
      chainId,
      imageUrl: propertyFormZustand.thumbnail.url,
      data: combinedForm,
    };

    try {
      const { data } = await propexAPI.post(
        "/nft/mint-request/tier-2",
        mintRequestData
      );

      const { data: mintRequestResponse } = data;
      const { mintData, messageHash } = mintRequestResponse;

      let signature;

      if (isDemoMode) {
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
      } else if (activeWallet.id === "inApp") {
        const signer = await ethers5Adapter.signer.toEthers({
          account: activeAccount,
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

      const mintFinalData = {
        placeId,
        signature,
        messageHash,
        mintData,
        chainId,
        paymentAmount: 0,
        combinedForm,
        mintDetailsData: combinedForm,
      };

      await propexAPI.post("/nft/mint/tier-2", mintFinalData, {
        timeout: 50000,
        timeoutErrorMessage:
          "Minting process took more than 50 seconds. Aborting it. Please check your portfolio to see if the NFT was successfully completed.",
      });

      const pointsActivities = pointsActivity.map((val) => ({
        pointsToAdd: val.pointsAdded,
        activitySlug: val.slug,
      }));

      try {
        await propexAPI.post("/user/points/update", {
          data: {
            activities: pointsActivities,
          },
        });
      } catch (e) {
        toast.error("Error while updating your point");
      }

      setRwaCardDetail((prevState) => ({
        ...prevState,
        url: propertyFormZustand.thumbnail.url,
        description: nftMetaData.mintDetailsData?.mapsAddress,
        sellingPrice: propertyFormZustand.sellingPrice,
      }));

      toast.success("NFT successfully minted");
      await resetForms();
      setUserProgress("mintingSuccess");
      triggerRefresh();
      return true;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data?.message || "");
      }
      console.log("Error while requesting mint", e);
      toast.error("There's an error while requesting mint");
      setUserProgress("mintingConfirmation");
      return false;
    }
  }

  const resetForms = async () => {
    reset();
  };

  const renderCurrentStep = () => {
    const stepComponents = {
      landingPage: (
        <LandingPage
          userProgress={userProgress}
          handleBackButton={handleBackButton}
          nextHandler={handleNext}
          setNftMetaData={setNftMetaData}
        />
      ),
      ownershipForm: (
        <OwnershipFormPage
          userProgress={userProgress}
          setIsFormComplete={setIsFormComplete}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      ),
      propertyForm: (
        <PropertyFormPage
          userProgress={userProgress}
          setIsFormComplete={setIsFormComplete}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      ),
      mintingConfirmation: (
        <ConfirmationPage
          userProgress={userProgress}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      ),
      minting: (
        <ConfirmationPage
          userProgress={userProgress}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      ),
      mintingSuccess: (
        <ConfirmationPage
          userProgress={userProgress}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      ),
    };

    return (
      <motion.div
        key={userProgress}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {stepComponents[userProgress] || null}
      </motion.div>
    );
  };

  return (
    <main className="w-full bg-white flex flex-col items-center font-open-sauce">
      <div className="w-full max-w-[1480px]">{renderCurrentStep()}</div>

      <Footer
        userProgress={userProgress}
        isNextAvailable={isFormComplete}
        isPreviousAvailable={isPreviousAvailable}
        previousHandler={handlePrevious}
        userPoints={userFormPoint}
        nextHandler={handleNext}
        customNextButtonText={customNextButtonText}
      />

      {showPopUp && (
        <Modal
          showPopUp={showPopUp}
          closeModal={() => setShowPopUp(false)}
          handleSaveAndExit={handleSaveAndExit}
          loading={loading}
        />
      )}
    </main>
  );
}
