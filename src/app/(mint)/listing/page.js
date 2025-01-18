"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { propexAPI } from "../_api/propex";
import toast from "react-hot-toast";
import DashboardList from "../_components/dashboard/DashboardList";
import DashboardMap from "../_components/dashboard/DashboardMap";
import useSWRInfinite from "swr/infinite";
import { AxiosError } from "axios";
import useSWR from "swr";

const PAGE_SIZE = 5;
const INCREMENT_SIZE = 5;

const getKey = (pageIndex, previousPageData) => {
  console.log(pageIndex, previousPageData)
  if (previousPageData && !previousPageData.length) return null;
  return `/nft/all?page=${pageIndex + 1}&limit=${
    pageIndex === 0 ? PAGE_SIZE : INCREMENT_SIZE
  }`;
};

const transformNftData = (data) => {
  return data.map((nft) => ({
    id: nft.id,
    placeId: nft.placeId,
    tier: nft.data.tier,
    tokenId: nft.tokenId,
    isUpgraded: nft.isUpgraded,
    mintedData: nft.mintedData,
    coordinates: {
      lat: nft.mintDetailsData.lat || 0,
      lng: nft.mintDetailsData.lng || 0,
    },
    metadata: {
      name: nft.metadata.name,
      image: nft.metadata.image || nft.mintDetailsData.imageUrl || "",
    },
  }));
};

export default function Dashboard() {
  const observerRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedLatLng, setSelectedLatLng] = useState({
    lat: null,
    lng: null,
  });

  const {
    data: paginatedData,
    error,
    setSize,
    isValidating,
    isLoading,
  } = useSWRInfinite(getKey, async (url) => {
    const { data } = await propexAPI.get(url);
    const transformedData = transformNftData(data);
    return transformedData;
  });

  const nfts = useMemo(() => {
    let mergedNfts = paginatedData ? [].concat(...paginatedData) : [];

    return mergedNfts;
  }, [paginatedData]);

  const isReachingEnd =
    paginatedData && paginatedData[paginatedData.length - 1]?.length === 0;

  useEffect(() => {
    if (error instanceof AxiosError) {
      toast.error("Error while fetching NFTs metadata");
    }
  }, [error]);

  const observerCallback = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isValidating && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1);
      }
    },
    [isValidating, setSize, isReachingEnd]
  );

  const lastItemRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(observerCallback);
      if (node) observerRef.current.observe(node);
    },
    [observerCallback]
  );

  const { data: coordinates } = useSWR("/nft/all-map-points", async (url) => {
    const { data } = await propexAPI.get(url);
    return data.map((item) => ({
      tier: item.data.tier || 1,
      lat: item.mintDetailsData.lat || 0,
      lng: item.mintDetailsData.lng || 0,
    }));
  });

  const [highlightedNft, setHighlightedNft] = useState(null);

  const handleMarkerClick = (lat, lng) => {
    const selectedNft = nfts.find(
      (nft) => nft.coordinates.lat === lat && nft.coordinates.lng === lng
    );
    if (selectedNft) {
      setHighlightedNft(selectedNft.id);
    } else {
      setSelectedLatLng({
        lat,
        lng,
      });
    }
  };

  return (
    <div className="bg-white h-full flex w-full">
      <div className="flex flex-col lg:flex-row items-start w-full h-full overflow-y-auto">
        <div className="flex flex-col lg:flex-row items-start w-full lg:h-full">
          <div className="w-full lg:w-[50%] h-80 lg:h-full bg-blue-50 flex">
            <DashboardMap
              coordinates={coordinates || []}
              className="h-full w-full"
              onMarkerClick={handleMarkerClick}
            />
          </div>

          <div className="w-full lg:w-[50%] lg:h-full">
            <DashboardList
              nfts={nfts}
              isLoading={isLoading}
              isValidating={isValidating}
              ref={lastItemRef}
              className="lg:h-full w-full"
              highlightedNft={highlightedNft}
              setHighlightedNft={setHighlightedNft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
