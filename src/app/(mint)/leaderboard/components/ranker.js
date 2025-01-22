/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Confetti from "react-dom-confetti";
import Image from "next/image";
import { trimName, trimAddress } from "../utils/trimmer";
import { cnm } from "@/utils/style";
import { motion } from "framer-motion";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function Ranker({ leaderboardData }) {
  const isMobile = useMediaQuery("(max-width: 680px)");
  const [isActive, setIsActive] = useState("Weekly");

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

  if (!leaderboardData) return null;

  return isMobile ? (
    <MobileVersion
      leaderboardData={leaderboardData}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  ) : (
    <DesktopVersion leaderboardData={leaderboardData} />
  );
}

const MobileVersion = ({ leaderboardData, isActive, setIsActive }) => {
  return (
    <div className="w-full h-full mt-8 flex flex-col items-center font-open-sauce px-4">
      {/* Top Three Ranking */}
      <div className="w-full h-full mt-8 flex justify-center items-end text-black overflow-hidden">
        {/* Second Rank */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* Profile Picture */}
          {leaderboardData?.topThree[1]?.imageUrl?.trim?.() !== "" ? (
            <div className="flex justify-center items-center bg-white rounded-full size-16">
              <div className="relative w-full h-full">
                <img
                  src={leaderboardData?.topThree[1]?.imageUrl}
                  alt="user-profile"
                  className="rounded-full object-cover size-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center bg-white rounded-full shadow-md size-16">
              <img
                src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[1]?.name}`}
                alt="avatar-gradient"
                className="rounded-full object-cover size-full"
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center mb-2">
            <p className="text-sm mt-2 mb-2 text-black">
              @{leaderboardData?.topThree[1]?.name}
            </p>
            <div className="flex justify-center items-center bg-gradient-to-r from-lemongrass-200 to-lemongrass-400 rounded-3xl px-4 py-1 gap-1">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-mossgreen font-semibold text-sm">
                {leaderboardData?.topThree[1]?.points}
              </span>
            </div>
          </div>
          {/* Pillar */}
          <div className="w-24 h-40 bg-gradient-to-b from-lemongrass-300 to-lemongrass-50 rounded-tl-2xl flex items-end justify-center pb-4">
            <p className="mt-2 font-semibold text-mossgreen">2nd</p>
          </div>
        </motion.div>

        {/* First Rank */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center z-10"
        >
          {/* Profile Picture */}
          {leaderboardData?.topThree[0]?.imageUrl?.trim?.() !== "" ? (
            <div className="flex justify-center items-center bg-white rounded-full size-16">
              <div className="relative w-full h-full">
                <img
                  src={leaderboardData?.topThree[0]?.imageUrl}
                  alt="user-profile"
                  className="rounded-full object-cover size-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center bg-white rounded-full shadow-md size-16">
              <img
                src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[0]?.name}`}
                alt="avatar-gradient"
                className="rounded-full object-cover size-full"
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center mb-2 gap-2">
            <p className="text-sm mt-4 text-black">
              @{leaderboardData?.topThree[0]?.name}
            </p>
            <div className="flex justify-center items-center bg-gradient-to-r from-lemongrass-200 to-lemongrass-400 rounded-3xl px-4 py-1 gap-1 mt-2">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-mossgreen font-semibold text-sm">
                {leaderboardData?.topThree[0]?.points}
              </span>
            </div>
          </div>
          {/* Pillar */}
          <div className="w-28 h-60 bg-gradient-to-b from-lemongrass to-lemongrass-50 shadow-xl rounded-tr-2xl rounded-tl-2xl flex items-end justify-center pb-4">
            <p className="mt-2 font-semibold text-mossgreen">1st</p>
          </div>
        </motion.div>

        {/* Third Rank */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Profile Picture */}
          {leaderboardData?.topThree[2]?.imageUrl?.trim?.() !== "" ? (
            <div className="flex justify-center items-center bg-white rounded-full size-16">
              <div className="relative w-full h-full">
                <img
                  src={leaderboardData?.topThree[2]?.imageUrl}
                  alt="user-profile"
                  className="rounded-full object-cover size-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center bg-white rounded-full shadow-md size-16">
              <img
                src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[2]?.name}`}
                alt="avatar-gradient"
                className="rounded-full object-cover size-full"
              />
            </div>
          )}
          <div className="flex flex-col justify-center items-center mb-2 gap-2">
            <p className="text-sm mt-4 text-black">
              @{leaderboardData?.topThree[2]?.name}
            </p>
            <div className="flex justify-center items-center bg-gradient-to-r from-lemongrass-200 to-lemongrass-400 rounded-3xl px-4 py-1 gap-1">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-mossgreen font-semibold text-sm">
                {leaderboardData?.topThree[2]?.points}
              </span>
            </div>
          </div>
          {/* Pillar */}
          <div className="w-24 h-32 bg-gradient-to-b from-lemongrass-200 to-lemongrass-50 rounded-tr-2xl flex items-end justify-center pb-4">
            <p className="mt-2 font-semibold text-mossgreen">3rd</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DesktopVersion = ({ leaderboardData, isActive, setIsActive }) => {
  return (
    <div className="w-[45rem] min-h-[14rem] flex flex-col justify-end pt-20 overflow-hidden shrink-0">
      <div className="w-full min-h-[10rem] flex justify-center items-center bg-gradient-to-b from-lemongrass-300 to-lightgreen border border-lemongrass-600/20 rounded-t-3xl relative">
        {/* Left & Right */}
        <div className="w-full h-full flex justify-between rounded-3xl">
          {/* 2nd Left */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.8 }}
            className="w-[40%] h-full bg-gradient-to-b from-lemongrass-300 to-lightgreen flex flex-col items-center justify-center gap-1 rounded-3xl"
          >
            {/* Image and content */}
            {leaderboardData?.topThree[1]?.imageUrl?.trim?.() !== "" ? (
              <div className="flex justify-center items-center bg-white rounded-full absolute top-0 -translate-y-1/2 shadow-md size-16 shrink-0 border-3 border-white overflow-hidden">
                <img
                  src={leaderboardData?.topThree[1]?.imageUrl}
                  alt="propex-coin"
                  className="object-cover rounded-full size-full"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center bg-white rounded-full p-1 absolute top-0 -translate-y-1/2 shadow-md">
                <div className="size-14 rounded-full">
                  <img
                    src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[1]?.name}`}
                    alt="avatar-gradient"
                    className="rounded-full object-cover size-full"
                  />
                </div>
              </div>
            )}
            <p className="text-sm mt-4 text-black">
              @{leaderboardData?.topThree[1]?.name}
            </p>
            <p className="text-xs text-[#6D6D6D]">
              {trimAddress(leaderboardData?.topThree[1]?.address)}
            </p>
            <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1 mt-2">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-green-600 font-semibold text-sm">
                {leaderboardData?.topThree[1]?.points}
              </span>
            </div>
          </motion.div>

          {/* 3rd Right */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.8, delay: 0.2 }}
            className="w-[40%] h-full bg-gradient-to-b from-lemongrass-300 to-lightgreen text-black flex flex-col items-center justify-center gap-1 rounded-3xl"
          >
            {leaderboardData?.topThree[2]?.imageUrl?.trim?.() !== "" ? (
              <div className="flex justify-center items-center bg-white rounded-full absolute top-0 -translate-y-1/2 shadow-md size-16 shrink-0 border-3 border-white overflow-hidden">
                <img
                  src={leaderboardData?.topThree[2]?.imageUrl}
                  alt="propex-coin"
                  className="object-cover rounded-full size-full"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center bg-white rounded-full p-1 absolute top-0 -translate-y-1/2 shadow-md">
                <div className="size-14 rounded-full">
                  <img
                    src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[2]?.name}`}
                    alt="avatar-gradient"
                    className="rounded-full object-cover size-full"
                  />
                </div>
              </div>
            )}
            <p className="text-sm mt-4">
              @{leaderboardData?.topThree[2]?.name}
            </p>
            <p className="text-xs text-[#6D6D6D]">
              {trimAddress(leaderboardData?.topThree[2]?.address)}
            </p>
            <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1 mt-2">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-green-600 font-semibold text-sm">
                {leaderboardData?.topThree[2]?.points}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Middle */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.8, delay: 0.4 }}
          className="w-64 h-full flex absolute z-10 rounded-3xl -top-4"
        >
          <div className="w-full h-full bg-gradient-to-b from-mossgreen to-mossgreen-800 text-white flex flex-col items-center justify-center gap-1 rounded-3xl shadow-xl">
            {leaderboardData?.topThree[0]?.imageUrl?.trim?.() !== "" ? (
              <div className="flex justify-center items-center bg-white rounded-full absolute top-0 -translate-y-1/2 shadow-md size-16 shrink-0 border-3 border-white overflow-hidden">
                <img
                  src={leaderboardData?.topThree[0]?.imageUrl}
                  alt="propex-coin"
                  className="object-cover rounded-full size-full"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center bg-white rounded-full p-1 absolute top-0 -translate-y-1/2 shadow-md">
                <div className="size-14 rounded-full bg-gradient-to-br">
                  <img
                    src={`https://avatars.jakerunzer.com/${leaderboardData?.topThree[0].name}`}
                    alt="avatar-gradient"
                    className="rounded-full object-cover size-full"
                  />
                </div>
              </div>
            )}

            <p className="text-sm mt-4">
              @{leaderboardData?.topThree[0]?.name}
            </p>
            <p className="text-xs">
              {trimAddress(leaderboardData?.topThree[0]?.address)}
            </p>
            <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1 mt-2">
              <div className="relative w-4 h-4">
                <Image
                  src={"/assets/logo/propex-coin.png"}
                  alt="propex-coin"
                  fill
                  sizes="350px"
                  className="object-contain"
                />
              </div>
              <span className="text-green-600 font-semibold text-sm">
                {leaderboardData?.topThree[0]?.points}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
