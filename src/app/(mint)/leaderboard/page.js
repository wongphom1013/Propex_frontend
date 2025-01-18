"use client";

import { useEffect, useMemo, useState } from "react";
import { propexAPI } from "../_api/propex";
import useSWR from "swr";
import { formatTimestamp } from "./utils/trimmer";
import dynamic from "next/dynamic";
import { Skeleton, Spinner } from "@nextui-org/react";

const Ranker = dynamic(() => import("./components/ranker"), {
  ssr: false,
  loading: () => <RankerSkeleton />,
});

const TableMapper = dynamic(() => import("./components/TableMap"), {
  ssr: false,
  loading: () => <TableMapperSkeleton />,
});

export default function Leaderboard() {
  const [date, setDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [incrementSize, setIncrementSize] = useState(10);

  const {
    data: leaderboardData,
    error,
    isLoading,
  } = useSWR(
    [`/user/leaderboard?page=${pageIndex + 1}&limit=${incrementSize}`],
    async ([url]) => {
      const { data } = await propexAPI.get(url);
      setTotalPages(Math.ceil(data.total / incrementSize));
      setDate(formatTimestamp(data?.lastFetched));
      return data;
    },
    { revalidateOnFocus: false }
  );

  const rankingData = useMemo(() => {
    return leaderboardData ? [].concat(...leaderboardData.leaderboard) : [];
  }, [leaderboardData]);

  const fetchData = ({ pageIndex, pageSize }) => {
    setPageIndex(pageIndex);
    setIncrementSize(pageSize);
  };

  if (!rankingData) return null;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-mossgreen text-center font-semibold">
          <Spinner />
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-mossgreen text-center font-semibold">
          Error fetching data
        </h1>
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-mossgreen text-center font-semibold">
          No data available
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col items-center w-full font-open-sauce min-h-screen overflow-y-auto pb-20">
      <div className="w-full flex flex-col justify-center items-center mt-8">
        <h1 className="text-2xl text-mossgreen text-center font-semibold">
          Top 100 Leaderboard
        </h1>
        <p className="text-neutral-500 text-sm mt-2">Last updated at: {date}</p>
      </div>

      {/* Rankers */}
      <Ranker leaderboardData={leaderboardData} />

      {/* Custom Tables */}
      <TableMapper
        data={rankingData}
        currentUser={leaderboardData.currentUser}
        pageSize={incrementSize}
        pageCount={totalPages}
        fetchData={fetchData}
        page={page}
        setPage={setPage}
        setPageSize={setIncrementSize}
      />
    </div>
  );
}

const RankerSkeleton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MobileVersion = () => {
    return (
      <div className="w-full h-full mt-8 flex flex-col items-center font-open-sauce px-4">
        {/* Top Three Ranking */}
        <div className="w-full h-full mt-8 flex justify-center items-end text-black">
          {/* Second Rank */}
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <Skeleton className="flex justify-center items-center bg-neutral-400 mb-4 rounded-full shadow-md w-20 h-20"></Skeleton>

            {/* Pillar */}
            <Skeleton className="w-24 h-40 bg-gray-400 rounded-tl-2xl flex items-end justify-center pb-4">
              <p className="mt-2 font-semibold text-white">2nd</p>
            </Skeleton>
          </div>

          {/* First Rank */}
          <div className="flex flex-col items-center">
            <Skeleton className="flex justify-center items-center bg-neutral-400 mb-4 rounded-full shadow-md w-20 h-20"></Skeleton>

            {/* Pillar */}
            <Skeleton className="w-28 h-60 bg-gray-400 rounded-tr-2xl rounded-tl-2xl flex items-end justify-center pb-4"></Skeleton>
          </div>

          {/* Third Rank */}
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <Skeleton className="flex justify-center items-center bg-neutral-400 mb-4 rounded-full shadow-md w-20 h-20"></Skeleton>

            {/* Pillar */}
            <Skeleton className="w-24 h-32 bg-gray-400 rounded-tr-2xl flex items-end justify-center pb-4">
              <p className="mt-2 font-semibold text-white"></p>
            </Skeleton>
          </div>
        </div>
      </div>
    );
  };

  const WindowVersion = () => {
    return (
      <>
        <div className="w-[45rem] h-full sm:min-h-[9rem] max-h-[10rem] flex justify-center items-center bg-neutral-200 animate-pulse rounded-3xl mt-20 relative">
          {/* Left & Right */}
          <div className="w-full h-full flex justify-between rounded-3xl">
            {/* 2nd Left */}
            <Skeleton className="w-[40%] h-full bg-neutral-400 flex flex-col items-center justify-center gap-2 rounded-3xl">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="w-40 h-8 bg-gray-300 rounded-lg"></div>
            </Skeleton>

            {/* 3rd Right */}
            <Skeleton className="w-[40%] h-full bg-neutral-400 text-black flex flex-col items-center justify-center gap-1 rounded-3xl">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="w-40 h-8 bg-gray-300 rounded-lg"></div>
            </Skeleton>
          </div>

          {/* Middle */}
          <div className="w-64 h-52 flex absolute z-10 rounded-3xl -translate-y-6">
            <Skeleton className="w-full h-full bg-neutral-400 text-white flex flex-col items-center justify-center gap-1 rounded-3xl">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="w-40 h-8 bg-gray-300 rounded-lg"></div>
            </Skeleton>
          </div>
        </div>
      </>
    );
  };

  return isMobile ? <MobileVersion /> : <WindowVersion />;
};

const TableMapperSkeleton = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MobileVersion = () => {
    return (
      <div className="w-full h-full">
        <div className="w-full h-[32rem] border border-black border-opacity-10 rounded-2xl overflow-hidden bg-white">
          {/* <div className="w-full flex justify-between mt-4 px-2">
            <div className="w-[30%] h-12 bg-neutral-400 animate-pulse rounded-lg"></div>
            <div className="w-[40%] h-12 bg-neutral-400 animate-pulse rounded-lg"></div>
          </div> */}

          <div className="w-full h-full bg-neutral-400 rounded-lg animate-pulse mt-2">
            {/* Table header */}
            <div className="flex justify-between mb-4">
              <div className="w-full h-14 bg-neutral-300 rounded"></div>
            </div>

            {/* Table rows */}
            <div className="space-y-4 overflow-y-auto h-[40rem]">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex justify-between">
                  <div className="w-full h-10 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WindowVersion = () => {
    return (
      <div className="w-[calc(100%-6rem)] max-w-[70rem] mb-20 relative -translate-y-3 text-black bg-white">
        <div className="w-full h-full border border-black border-opacity-10 rounded-2xl overflow-hidden p-6">
          {/* Table and Search Bar Container */}
          {/* <div className="flex justify-between items-center p-4">
            <div className="w-[20%] h-10 bg-neutral-400 animate-pulse rounded-lg"></div>

            <div className="w-[40%] h-10 bg-neutral-400 animate-pulse rounded-lg"></div>
          </div> */}

          {/* Table Skeleton */}
          <Skeleton className="w-full h-[47.5rem] bg-neutral-400 rounded-lg p-4">
            {/* Table header */}
            <div className="flex justify-between mb-4 gap-2">
              <Skeleton className="w-1/4 h-20 bg-neutral-300 rounded"></Skeleton>
              <Skeleton className="w-1/4 h-20 bg-neutral-300 rounded"></Skeleton>
              <Skeleton className="w-1/4 h-20 bg-neutral-300 rounded"></Skeleton>
              <Skeleton className="w-1/4 h-20 bg-neutral-300 rounded"></Skeleton>
            </div>

            {/* Table rows */}
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex justify-between gap-2">
                  <div className="w-1/4 h-12 bg-neutral-200 rounded"></div>
                  <div className="w-1/4 h-12 bg-neutral-200 rounded"></div>
                  <div className="w-1/4 h-12 bg-neutral-200 rounded"></div>
                  <div className="w-1/4 h-12 bg-neutral-200 rounded"></div>
                </div>
              ))}
            </div>
          </Skeleton>
        </div>
      </div>
    );
  };

  return isMobile ? <MobileVersion /> : <WindowVersion />;
};
