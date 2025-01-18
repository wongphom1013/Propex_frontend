"use client";

import { usePathname } from "next/navigation";

export const useIsWhitePage = () => {
  const pathname = usePathname();
  return (
    pathname.includes("tier-two") ||
    pathname.includes("listing") ||
    pathname.includes("details") ||
    pathname.includes("portfolio") ||
    pathname.includes("token-2049") || 
    pathname.includes("leaderboard")
  );
};
