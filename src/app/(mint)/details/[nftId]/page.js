/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { propexAPI } from "../../_api/propex";
import SvgIcon from "@/app/_components/utils/SvgIcon";
import { ArrowUpRight } from "lucide-react";
import PropexLogoOnly from "@/assets/propex-logo-only.svg";
import Spinner from "../../_components/elements/Spinner";
import useSWR from "swr";
import { createRaribleLink } from "@/utils/link";
import { PROPEX_CONTRACT_ADDRESS } from "../../_configs/web3";
import RaribleLogo from "@/assets/logo/rarible-logo.svg";
import ImageGallery from "../components/ImageGallery";
import DescriptionBox from "../components/DescriptionBox";
import Amenities from "../components/Amenities";
import Features from "../components/Features";
import { Skeleton } from "@nextui-org/react";
import dayjs from "dayjs";

function formatTimestamp(timestamp) {
  return dayjs(timestamp).format("DD/MM/YY, h:mm A");
}

export default function Page() {
  const params = useParams();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { data: nftDetail, error } = useSWR(
    `/nft/detail/${params.nftId}`,
    async (url) => {
      const { data } = await propexAPI.get(url);
      return data;
    },
    {
      fallbackData: null,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to get NFT Detail");
    }
  }, [error]);

  if (!nftDetail)
    return (
      <div className="bg-white flex items-center justify-center min-h-[90vh] w-full">
        <Spinner className="size-6 fill-neutral-300 text-neutral-600" />
      </div>
    );

  switch (nftDetail?.tier) {
    case 1:
      return (
        <TierOneDetailPage
          nftDetail={nftDetail}
          iframeLoaded={iframeLoaded}
          setIframeLoaded={setIframeLoaded}
        />
      );
    case 2:
      return (
        <TierTwoDetailPage
          nftDetail={nftDetail}
          iframeLoaded={iframeLoaded}
          setIframeLoaded={setIframeLoaded}
        />
      );
  }
}

function TierOneDetailPage({ nftDetail, iframeLoaded, setIframeLoaded }) {
  const timestamp = nftDetail?.mintedData?.timestamp;
  const [formattedDate, setFormattedDate] = useState(null);
  const router = useRouter();
  const params = useParams();

  async function handleUpgradeToRWANft() {
    router.push(`/tier-two?id=${params.nftId}`);
  }

  useEffect(() => {
    const formatDate = formatTimestamp(timestamp);
    setFormattedDate(formatDate);
  }, [timestamp]);

  return (
    <div className="bg-white text-black h-full overflow-y-auto pt-8 px-5 pb-[16rem]">
      <div className="container mx-auto">
        {nftDetail ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl text-mossgreen font-semibold">
                {nftDetail.metadata.name}
              </h1>{" "}
              <div className="flex gap-4 w-fit">
                <button
                  onClick={() => handleUpgradeToRWANft()}
                  // className="bg-lemongrass rounded-lg px-8 py-4 font-semibold font-urbanist w-full text-black"
                  className="bg-lemongrass hover:bg-lemongrass-600 transition-colors rounded-lg px-6 py-4 w-fit font-semibold font-urbanist text-black"
                  // disabled
                >
                  Upgrade to RWA NFT
                </button>
                <button
                  onClick={() => router.push(`/details/${params.nftId}/expand`)}
                  className="bg-lemongrass hover:bg-lemongrass-600 transition-colors rounded-lg px-6 py-4 w-fit font-semibold font-urbanist text-black"
                >
                  Expand Territory
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="w-full flex flex-col lg:flex-row gap-6 mt-4 relative">
              <div className="lg:flex-1 h-[28rem] lg:h-[30rem] overflow-hidden rounded-xl relative">
                <iframe
                  src={nftDetail.metadata.animation_url}
                  className="w-full h-full rounded-xl"
                  style={{ boxSizing: "border-box" }}
                  onLoad={() => {
                    setIframeLoaded(true);
                  }}
                />
                {!iframeLoaded && (
                  <Skeleton className="w-full h-full inset-0 absolute" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-12 gap-4 mt-8">
              {/* Description */}
              <div className="col-span-12 md:col-span-7">
                {/* Activity Box */}
                <div className="p-6 border border-black/10 rounded-xl w-full h-full">
                  <div className="flex w-full gap-2 justify-start items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.8 12.9992C20.6188 12.6849 20.3557 12.4259 20.0386 12.2497C19.7215 12.0736 19.3625 11.987 19 11.9992H17C16.4696 11.9992 15.9609 12.2099 15.5858 12.585C15.2107 12.96 15 13.4687 15 13.9992C15 14.5296 15.2107 15.0383 15.5858 15.4134C15.9609 15.7885 16.4696 15.9992 17 15.9992H19C19.5304 15.9992 20.0391 16.2099 20.4142 16.585C20.7893 16.96 21 17.4687 21 17.9992C21 18.5296 20.7893 19.0383 20.4142 19.4134C20.0391 19.7885 19.5304 19.9992 19 19.9992H17C16.6375 20.0114 16.2785 19.9248 15.9614 19.7486C15.6443 19.5725 15.3812 19.3134 15.2 18.9992M18 11V21M7 5C7 5.53043 6.78929 6.03914 6.41421 6.41421C6.03914 6.78929 5.53043 7 5 7C4.46957 7 3.96086 6.78929 3.58579 6.41421C3.21071 6.03914 3 5.53043 3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3C5.53043 3 6.03914 3.21071 6.41421 3.58579C6.78929 3.96086 7 4.46957 7 5ZM7 5H15M7 5V13C7 13.7956 7.31607 14.5587 7.87868 15.1213C8.44129 15.6839 9.20435 16 10 16H11M15 5C15 5.53043 15.2107 6.03914 15.5858 6.41421C15.9609 6.78929 16.4696 7 17 7C17.5304 7 18.0391 6.78929 18.4142 6.41421C18.7893 6.03914 19 5.53043 19 5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3C16.4696 3 15.9609 3.21071 15.5858 3.58579C15.2107 3.96086 15 4.46957 15 5Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <h2 className="text-lg font-semibold">Activity</h2>
                  </div>
                  {/* <div className="mt-2 text-sm text-center opacity-40 min-h-64 flex items-center justify-center w-full">
                    There is no activity yet
                  </div> */}
                  <div className="flex flex-col items-start gap-2 min-h-32 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <p className="font-semibold text-sm">
                            {nftDetail?.minterData?.name}
                          </p>
                          <p className="text-[#6D6D6D] text-sm">minted</p>
                        </div>
                        <div className="flex gap-1 items-center justify-start">
                          <p className="text-[#6D6D6D] text-xs">
                            {formattedDate}
                          </p>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.46454 12.0358L11.5356 4.96476M11.5356 4.96476L11.7124 10.4448M11.5356 4.96476L6.05553 4.78799"
                              stroke="#6D6D6D"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-12 md:col-span-5">
                {/* Pricing Box */}
                <div className="p-6 border border-black/10 rounded-xl flex flex-col items-start">
                  <div className="flex flex-wrap w-full justify-between items-center gap-2 px-6">
                    <div className="flex flex-col items-start gap-2">
                      <div className="text-xs opacity-60">Owned By</div>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                        <p className="font-semibold">
                          {nftDetail?.minterData?.name}
                        </p>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 2.00195V9.33465C3 10.8872 3.28706 11.3942 4.61835 12.193L6.62801 13.3988C7.29647 13.7998 7.63067 14.0004 8 14.0004C8.36933 14.0004 8.70353 13.7998 9.372 13.3988L11.3817 12.193C12.7129 11.3942 13 10.8872 13 9.33465V2.00195"
                            fill="#00272C"
                          />
                          <path
                            d="M3 2.00195V9.33465C3 10.8872 3.28706 11.3942 4.61835 12.193L6.62801 13.3988C7.29647 13.7998 7.63067 14.0004 8 14.0004C8.36933 14.0004 8.70353 13.7998 9.372 13.3988L11.3817 12.193C12.7129 11.3942 13 10.8872 13 9.33465V2.00195"
                            stroke="#00272C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.66602 2.00195H14.3327"
                            stroke="#00272C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.40249 5.33698L8.81309 6.16501C8.86909 6.28027 9.01842 6.39084 9.14436 6.412L9.88862 6.53667C10.3646 6.61665 10.4766 6.9648 10.1336 7.30827L9.55502 7.8916C9.45702 7.9904 9.40336 8.181 9.43369 8.3174L9.59936 9.0396C9.72996 9.6112 9.42902 9.83233 8.92742 9.5336L8.22982 9.1172C8.10382 9.04194 7.89616 9.04194 7.76789 9.1172L7.07029 9.5336C6.571 9.83233 6.2677 9.60887 6.39835 9.0396L6.564 8.3174C6.59433 8.181 6.54067 7.9904 6.44268 7.8916L5.86408 7.30827C5.52345 6.9648 5.6331 6.61665 6.10905 6.53667L6.85329 6.412C6.97696 6.39084 7.12629 6.28027 7.18229 6.16501L7.59289 5.33698C7.81689 4.88768 8.18082 4.88768 8.40249 5.33698Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse flex items-center justify-center min-h-screen w-full">
            <Spinner className="size-6 fill-neutral-300 text-neutral-600" />
          </div>
        )}
      </div>
    </div>
  );
}

function TierTwoDetailPage({ nftDetail, iframeLoaded, setIframeLoaded }) {
  const timestamp = nftDetail?.mintedData?.timestamp;
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    const formatDate = formatTimestamp(timestamp);
    setFormattedDate(formatDate);
  }, [timestamp]);

  return (
    <div className="bg-white text-black h-full overflow-y-auto pt-8 px-5 pb-[16rem]">
      <div className="container mx-auto">
        {nftDetail ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-4">
              <h1 className="text-3xl text-mossgreen font-semibold">
                {nftDetail.metadata.name}
              </h1>{" "}
              {/* {nftDetail.type === "DEEDS" && (
                <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass text-sm">
                  <SvgIcon
                    src={"/assets/icons/verified.svg"}
                    className="w-4 h-4 bg-mossgreen"
                  />
                  <p>Notarized</p>
                </div>
              )} */}
            </div>

            <Features nftDetail={nftDetail} />

            {/* Image */}
            {/* Iframe https://propex-backend.engowl.studio/map/SVMHQQ7M4XG6T09S1TXWQPXP3V86VHCF */}
            <div className="w-full flex flex-col lg:flex-row gap-6 mt-5 relative">
              <div className="lg:flex-1 h-[28rem] lg:h-[30rem] overflow-hidden rounded-xl relative">
                <iframe
                  src={nftDetail.metadata.animation_url}
                  className="w-full h-full rounded-xl"
                  onLoad={() => {
                    setIframeLoaded(true);
                  }}
                />
                {!iframeLoaded && (
                  <Skeleton className="w-full h-full inset-0 absolute" />
                )}
              </div>
              <ImageGallery nftDetail={nftDetail} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-12 gap-4 mt-8">
              {/* Description */}
              <div className="col-span-12 md:col-span-7">
                {/* Description Box */}
                <DescriptionBox nftDetail={nftDetail} />

                <Amenities nftDetail={nftDetail} />

                {/* Offer Box */}
                <div className="p-6 border border-black/10 rounded-xl mt-5">
                  <h2 className="text-lg font-semibold">Offer</h2>
                  <div className="mt-2 text-sm text-center opacity-40 min-h-56 flex items-center justify-center w-full">
                    There is no offer yet
                  </div>
                </div>

                {/* Activity Box */}
                <div className="p-6 border border-black/10 rounded-xl mt-5">
                  <div className="flex w-full gap-2 justify-start items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.8 12.9992C20.6188 12.6849 20.3557 12.4259 20.0386 12.2497C19.7215 12.0736 19.3625 11.987 19 11.9992H17C16.4696 11.9992 15.9609 12.2099 15.5858 12.585C15.2107 12.96 15 13.4687 15 13.9992C15 14.5296 15.2107 15.0383 15.5858 15.4134C15.9609 15.7885 16.4696 15.9992 17 15.9992H19C19.5304 15.9992 20.0391 16.2099 20.4142 16.585C20.7893 16.96 21 17.4687 21 17.9992C21 18.5296 20.7893 19.0383 20.4142 19.4134C20.0391 19.7885 19.5304 19.9992 19 19.9992H17C16.6375 20.0114 16.2785 19.9248 15.9614 19.7486C15.6443 19.5725 15.3812 19.3134 15.2 18.9992M18 11V21M7 5C7 5.53043 6.78929 6.03914 6.41421 6.41421C6.03914 6.78929 5.53043 7 5 7C4.46957 7 3.96086 6.78929 3.58579 6.41421C3.21071 6.03914 3 5.53043 3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3C5.53043 3 6.03914 3.21071 6.41421 3.58579C6.78929 3.96086 7 4.46957 7 5ZM7 5H15M7 5V13C7 13.7956 7.31607 14.5587 7.87868 15.1213C8.44129 15.6839 9.20435 16 10 16H11M15 5C15 5.53043 15.2107 6.03914 15.5858 6.41421C15.9609 6.78929 16.4696 7 17 7C17.5304 7 18.0391 6.78929 18.4142 6.41421C18.7893 6.03914 19 5.53043 19 5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3C16.4696 3 15.9609 3.21071 15.5858 3.58579C15.2107 3.96086 15 4.46957 15 5Z"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <h2 className="text-lg font-semibold">Activity</h2>
                  </div>
                  {/* <div className="mt-2 text-sm text-center opacity-40 min-h-64 flex items-center justify-center w-full">
                    There is no activity yet
                  </div> */}
                  <div className="flex flex-col items-start gap-2 min-h-32 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                      <div className="flex flex-col">
                        <div className="flex gap-2">
                          <p className="font-semibold text-sm">
                            {nftDetail?.minterData?.name}
                          </p>
                          <p className="text-[#6D6D6D] text-sm">minted</p>
                        </div>
                        <div className="flex gap-1 items-center justify-start">
                          <p className="text-[#6D6D6D] text-xs">
                            {formattedDate}
                          </p>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.46454 12.0358L11.5356 4.96476M11.5356 4.96476L11.7124 10.4448M11.5356 4.96476L6.05553 4.78799"
                              stroke="#6D6D6D"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Box */}
                {/* <div className="p-6 border border-black/10 rounded-xl mt-5">
                  <h2 className="text-lg font-semibold">Location</h2>

                  <p className="mt-4 text-sm font-semibold">
                    {nftDetail?.mintDetailsData?.mapsAddress}
                  </p>

                  {nftDetail?.metadata?.image && (
                    <div className="size-64 rounded-lg overflow-hidden relative mt-5">
                      <img
                        src={nftDetail?.metadata?.image}
                        className="w-full h-full object-cover"
                        alt="location"
                      />
                    </div>
                  )}
                </div> */}
                {/* <div className="mt-2 text-sm text-center opacity-40 min-h-64 w-full flex items-center justify-center"></div> */}

                <div className="p-6 border border-black/10 rounded-xl mt-5">
                  <h2 className="text-lg font-semibold">Details</h2>

                  <div className="mt-4 text-sm text-center flex flex-wrap gap-3 items-center w-full">
                    {/* Rarible */}
                    <a
                      href={createRaribleLink(
                        nftDetail.mintedData.chainId || 1135,
                        nftDetail.mintedData.contractAddress ||
                          PROPEX_CONTRACT_ADDRESS,
                        nftDetail.mintedData.tokenId || 0
                      )}
                      target="_blank"
                      className="flex items-center gap-2 px-2 py-2 rounded-lg border hover:bg-neutral-50"
                    >
                      <RaribleLogo className="w-5" />
                      <p>Rarible</p>
                      <ArrowUpRight className="size-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-12 md:col-span-5">
                {/* Pricing Box */}
                <div className="p-6 border border-black/10 rounded-xl flex flex-col items-start">
                  {/* {nftDetail.type === "DEEDS" && (
                    <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass text-sm">
                      <SvgIcon
                        src={"/assets/icons/verified.svg"}
                        className="w-4 h-4 bg-mossgreen"
                      />
                      <p>Notarized</p>
                    </div>
                  )} */}
                  {nftDetail.tier == 2 && (
                    <>
                      <h2 className="text-2xl font-semibold mt-4">
                        $200,000{" "}
                        <span className="inline-block font-semibold text-base text-neutral-400">
                          ~32 ETH
                        </span>
                      </h2>
                      <div className="h-[1px] w-full bg-black/10 my-6" />
                    </>
                  )}

                  <div className="flex flex-wrap w-full justify-between items-center gap-2 px-6">
                    <div className="flex flex-col items-start gap-2">
                      <div className="text-xs opacity-60">Listed By</div>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                        <p className="font-semibold">
                          {nftDetail?.minterData?.name}
                        </p>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 2.00195V9.33465C3 10.8872 3.28706 11.3942 4.61835 12.193L6.62801 13.3988C7.29647 13.7998 7.63067 14.0004 8 14.0004C8.36933 14.0004 8.70353 13.7998 9.372 13.3988L11.3817 12.193C12.7129 11.3942 13 10.8872 13 9.33465V2.00195"
                            fill="#00272C"
                          />
                          <path
                            d="M3 2.00195V9.33465C3 10.8872 3.28706 11.3942 4.61835 12.193L6.62801 13.3988C7.29647 13.7998 7.63067 14.0004 8 14.0004C8.36933 14.0004 8.70353 13.7998 9.372 13.3988L11.3817 12.193C12.7129 11.3942 13 10.8872 13 9.33465V2.00195"
                            stroke="#00272C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.66602 2.00195H14.3327"
                            stroke="#00272C"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.40249 5.33698L8.81309 6.16501C8.86909 6.28027 9.01842 6.39084 9.14436 6.412L9.88862 6.53667C10.3646 6.61665 10.4766 6.9648 10.1336 7.30827L9.55502 7.8916C9.45702 7.9904 9.40336 8.181 9.43369 8.3174L9.59936 9.0396C9.72996 9.6112 9.42902 9.83233 8.92742 9.5336L8.22982 9.1172C8.10382 9.04194 7.89616 9.04194 7.76789 9.1172L7.07029 9.5336C6.571 9.83233 6.2677 9.60887 6.39835 9.0396L6.564 8.3174C6.59433 8.181 6.54067 7.9904 6.44268 7.8916L5.86408 7.30827C5.52345 6.9648 5.6331 6.61665 6.10905 6.53667L6.85329 6.412C6.97696 6.39084 7.12629 6.28027 7.18229 6.16501L7.59289 5.33698C7.81689 4.88768 8.18082 4.88768 8.40249 5.33698Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    {nftDetail.type === "DEEDS" && (
                      <div className="flex flex-col items-start gap-2">
                        <div className="text-xs opacity-60">Notarized by</div>
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full border flex items-center justify-center">
                            <PropexLogoOnly className="size-4" />
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">Propex Notary</p>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 2.00146V9.33416C3 10.8867 3.28706 11.3937 4.61835 12.1925L6.62801 13.3983C7.29647 13.7993 7.63067 13.9999 8 13.9999C8.36933 13.9999 8.70353 13.7993 9.372 13.3983L11.3817 12.1925C12.7129 11.3937 13 10.8867 13 9.33416V2.00146"
                                fill="#00272C"
                              />
                              <path
                                d="M3 2.00146V9.33416C3 10.8867 3.28706 11.3937 4.61835 12.1925L6.62801 13.3983C7.29647 13.7993 7.63067 13.9999 8 13.9999C8.36933 13.9999 8.70353 13.7993 9.372 13.3983L11.3817 12.1925C12.7129 11.3937 13 10.8867 13 9.33416V2.00146"
                                stroke="#00272C"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1.66797 2.00146H14.3346"
                                stroke="#00272C"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.40444 5.33698L8.81504 6.16501C8.87104 6.28027 9.02038 6.39084 9.14631 6.412L9.89058 6.53667C10.3665 6.61665 10.4785 6.9648 10.1356 7.30827L9.55698 7.8916C9.45898 7.9904 9.40531 8.181 9.43564 8.3174L9.60131 9.0396C9.73191 9.6112 9.43098 9.83233 8.92938 9.5336L8.23178 9.1172C8.10578 9.04194 7.89811 9.04194 7.76984 9.1172L7.07224 9.5336C6.57295 9.83233 6.26965 9.60887 6.4003 9.0396L6.56595 8.3174C6.59628 8.181 6.54262 7.9904 6.44463 7.8916L5.86603 7.30827C5.5254 6.9648 5.63506 6.61665 6.111 6.53667L6.85524 6.412C6.97891 6.39084 7.12824 6.28027 7.18424 6.16501L7.59484 5.33698C7.81884 4.88768 8.18278 4.88768 8.40444 5.33698Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-[1px] w-full bg-black/10 my-6" />
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full h-14 flex items-center justify-center bg-mossgreen text-lemongrass font-semibold text-sm rounded-lg">
                      Buy Property
                    </div>
                    <div className="w-full h-14 flex items-center justify-center border font-semibold text-sm rounded-lg">
                      Make an Offer
                    </div>
                  </div>
                </div>

                {/* Loan */}
                <div className="mt-4 p-6 border border-black/10 rounded-xl flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2287_7801)">
                        <path
                          d="M11.8645 9.70824C12.7106 8.8623 12.7106 7.48589 11.8645 6.6394C11.0173 5.79217 9.64452 5.79198 8.7962 6.6394C7.94842 7.48717 7.94787 8.85992 8.7962 9.70824C9.64526 10.5573 11.0213 10.5516 11.8645 9.70824ZM9.80145 7.6452C10.0929 7.35369 10.5665 7.35241 10.8592 7.6452C11.1507 7.9367 11.1507 8.41113 10.8592 8.703C10.5677 8.9945 10.0933 8.9945 9.80145 8.703C9.50994 8.41167 9.50866 7.93798 9.80145 7.6452Z"
                          fill="black"
                        />
                        <path
                          d="M13.3141 11.1565C12.4682 12.0026 12.4682 13.3788 13.3141 14.225C14.1632 15.0738 15.5363 15.072 16.3826 14.225C17.2315 13.3759 17.2297 12.0028 16.3826 11.1565C15.5374 10.3105 14.1643 10.3065 13.3141 11.1565ZM15.3774 13.2197C15.0853 13.5118 14.6118 13.5119 14.3194 13.2197C14.0279 12.9277 14.0279 12.4532 14.3194 12.1617C14.6115 11.8697 15.085 11.8695 15.3774 12.1617C15.6687 12.4532 15.6702 12.9267 15.3774 13.2197Z"
                          fill="black"
                        />
                        <path
                          d="M9.84882 13.2278C10.1264 13.5054 10.5767 13.5056 10.8542 13.2278L15.385 8.69702C15.6628 8.41925 15.6628 7.96918 15.385 7.69159C15.1074 7.414 14.6573 7.414 14.3798 7.69159L9.84882 12.2224C9.57123 12.5001 9.57123 12.9502 9.84882 13.2278Z"
                          fill="black"
                        />
                        <path
                          d="M23.7614 17.1518C23.274 16.2432 22.151 15.8499 21.1983 16.2733L19.6348 16.9676V10.7768H22.9937C23.6556 10.7768 23.9581 9.94808 23.4509 9.52181L19.6348 6.31361V1.32069C19.6348 0.92775 19.3162 0.609695 18.9238 0.609695H16.155C15.7621 0.609695 15.444 0.92775 15.444 1.32069V2.79121L13.0468 0.775955C12.7828 0.553848 12.3966 0.553848 12.1322 0.775955L1.72797 9.52181C1.22205 9.94716 1.52271 10.7768 2.18536 10.7768H5.5448V13.8982C4.59869 14.193 3.93842 14.8461 3.71155 15.7296H0.710999C0.31842 15.7296 0 16.0481 0 16.4404V22.7056C0 23.0985 0.31842 23.4166 0.710999 23.4166C1.73767 23.4166 14.178 23.4175 14.6724 23.4175C16.0792 23.4175 17.465 23.043 18.6806 22.335L23.0087 19.8136C23.9401 19.2709 24.2704 18.1021 23.7614 17.1518ZM4.13617 9.355L12.5894 2.24904L15.6976 4.8614C16.1592 5.24959 16.8658 4.92055 16.8658 4.3174V2.03151H18.213V6.64485C18.213 6.85487 18.3058 7.05391 18.4664 7.18904L21.0432 9.355H18.9238C18.5308 9.355 18.213 9.67342 18.213 10.0658V17.5988C17.9165 17.7114 17.1077 18.1862 15.819 18.3286C16.3087 16.8594 15.1921 15.4764 13.7772 15.4764H11.4084C11.1013 15.4764 10.8164 15.3096 10.6472 15.03C9.64581 13.3743 7.37604 13.7829 6.96661 13.7228V10.0658C6.96661 9.67342 6.64801 9.355 6.25562 9.355H4.13617ZM1.42181 17.1514H3.62384V21.9948H1.42181V17.1514ZM21.7751 17.5728C22.0461 17.4523 22.368 17.5629 22.5082 17.824C22.6538 18.0955 22.5595 18.4297 22.2931 18.5852L17.965 21.1065C16.9664 21.6881 15.828 21.9957 14.6724 21.9957H5.04565V16.4404C5.04565 14.9707 6.93768 15.1501 6.96661 15.1448C7.63275 15.1699 8.95624 14.982 9.43103 15.7661C9.86005 16.4751 10.5994 16.8984 11.4084 16.8984H13.7772C14.1824 16.8984 14.5122 17.2282 14.5122 17.6334C14.5122 18.0386 14.1824 18.3685 13.7772 18.3685H9.72821C9.33783 18.3685 9.0174 18.6844 9.0174 19.0794C9.0174 19.4723 9.33582 19.7904 9.72821 19.7904H15.0928C17.3939 19.7904 18.7385 18.8552 19.6348 18.5235L21.7751 17.5728Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2287_7801">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="text-lg font-semibold">Loan</p>
                  </div>
                  <p className="mt-6 text-sm text-black/80">
                    Learn about our competitive interest rates for this property
                  </p>
                  <div className="mt-4 w-full h-14 flex items-center justify-center border font-semibold text-sm rounded-lg">
                    Apply for a Loan
                  </div>
                </div>

                {/* Legal */}
                <div className="mt-4 p-6 border border-black/10 rounded-xl flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2287_7812)">
                        <path
                          d="M22.5938 5.67188V4.26562H13.9884C13.7762 3.66731 13.3014 3.19252 12.7031 2.98031V0H11.2969V2.98031C10.6986 3.19252 10.2238 3.66731 10.0116 4.26562H1.40625V5.67188H3.16406L0 13.2656V13.4062C0 15.3448 1.57711 16.9219 3.51562 16.9219H4.92188C6.86039 16.9219 8.4375 15.3448 8.4375 13.4062V13.2656L5.27344 5.67188H10.0116C10.2238 6.27019 10.6986 6.74498 11.2969 6.95719V17.0395C9.90155 17.3239 8.80505 18.4376 8.54437 19.8413C6.91209 20.1444 5.67188 21.5781 5.67188 23.2969V24H18.3282V23.2969C18.3282 21.5781 17.088 20.1444 15.4557 19.8412C15.195 18.4375 14.0985 17.3238 12.7031 17.0395V6.95719C13.3014 6.74498 13.7762 6.27019 13.9884 5.67188H18.7266L15.5625 13.2656V13.4062C15.5625 15.3448 17.1396 16.9219 19.0781 16.9219H20.4844C22.4229 16.9219 24 15.3448 24 13.4062V13.2656L20.8359 5.67188H22.5938ZM4.21875 6.79688L6.67969 12.7031H1.75781L4.21875 6.79688ZM4.92188 15.5156H3.51562C2.59903 15.5156 1.81744 14.9277 1.52719 14.1089H6.91031C6.62006 14.9277 5.83847 15.5156 4.92188 15.5156ZM19.7812 6.79688L22.2422 12.7031H17.3203L19.7812 6.79688ZM20.4844 15.5156H19.0781C18.1615 15.5156 17.3799 14.9277 17.0897 14.1089H22.4728C22.1826 14.9277 21.401 15.5156 20.4844 15.5156ZM16.8014 22.5938H7.19859C7.4888 21.7753 8.27081 21.1875 9.1875 21.1875H14.8125C15.7292 21.1875 16.5112 21.7753 16.8014 22.5938ZM13.9884 19.7812H10.0116C10.3018 18.9629 11.0834 18.375 12 18.375C12.9166 18.375 13.6982 18.9629 13.9884 19.7812ZM12 5.67188C11.6123 5.67188 11.2969 5.35645 11.2969 4.96875C11.2969 4.58105 11.6123 4.26562 12 4.26562C12.3877 4.26562 12.7031 4.58105 12.7031 4.96875C12.7031 5.35645 12.3877 5.67188 12 5.67188Z"
                          fill="black"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2287_7812">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="text-lg font-semibold">Legal</p>
                  </div>
                  <p className="mt-6 text-sm text-black/80">
                    Review the Legal Documents associated with this property to
                    understand its ownership and restrictions
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="w-full p-2 flex items-center justify-center border font-semibold text-sm rounded-lg gap-2">
                      <svg
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.33203 24.5002V21.1668M9.33203 21.1668V19.1668C9.33203 18.5383 9.33203 18.224 9.53706 18.0287C9.74208 17.8335 10.0721 17.8335 10.732 17.8335H11.6654C12.6319 17.8335 13.4154 18.5796 13.4154 19.5002C13.4154 20.4207 12.6319 21.1668 11.6654 21.1668H9.33203ZM27.9987 17.8335H26.2487C25.1487 17.8335 24.5988 17.8335 24.2571 18.159C23.9154 18.4844 23.9154 19.0082 23.9154 20.0558V21.1668M23.9154 21.1668V24.5002M23.9154 21.1668H26.832M20.9987 21.1668C20.9987 23.0078 19.4316 24.5002 17.4987 24.5002C17.0626 24.5002 16.8444 24.5002 16.682 24.4108C16.2931 24.197 16.332 23.7642 16.332 23.3891V18.9446C16.332 18.5695 16.2931 18.1367 16.682 17.9228C16.8444 17.8335 17.0626 17.8335 17.4987 17.8335C19.4316 17.8335 20.9987 19.3259 20.9987 21.1668Z"
                          stroke="#222222"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 29.8332H14.3031C9.95476 29.8332 7.78061 29.8332 6.27076 28.7694C5.83816 28.4646 5.45411 28.1032 5.13027 27.696C4 26.2749 4 24.2286 4 20.1362V16.7422C4 12.7914 4 10.8159 4.62525 9.23817C5.63041 6.70173 7.75619 4.70101 10.4511 3.75497C12.1275 3.1665 14.2264 3.1665 18.4243 3.1665C20.8231 3.1665 22.0224 3.1665 22.9803 3.50277C24.5203 4.04337 25.7349 5.18664 26.3093 6.63602C26.6667 7.5376 26.6667 8.66642 26.6667 10.9241V13.8332"
                          stroke="#222222"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 16.4998C4 14.0453 5.98984 12.0554 8.44444 12.0554C9.33216 12.0554 10.3787 12.2109 11.2418 11.9797C12.0087 11.7742 12.6077 11.1752 12.8132 10.4083C13.0444 9.54522 12.8889 8.49866 12.8889 7.61094C12.8889 5.15634 14.8788 3.1665 17.3333 3.1665"
                          stroke="#222222"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="font-urbanist flex flex-col gap-1">
                        <p className="text-sm">Proof of title.pdf</p>
                        <p className="text-xs text-neutral-400">2.3 MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse flex items-center justify-center min-h-screen w-full">
            <Spinner className="size-6 fill-neutral-300 text-neutral-600" />
          </div>
        )}
      </div>
    </div>
  );
}
