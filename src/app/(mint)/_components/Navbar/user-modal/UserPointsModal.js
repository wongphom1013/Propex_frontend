"use client";

import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import PointsStar from "@/assets/account-bar/points-star.svg";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import { useRefreshTrigger } from "@/app/(mint)/_providers/RefreshProvider";
import { cnm } from "@/utils/style";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { useIsWhitePage } from "@/app/(mint)/_hooks/useIsWhitePage";
import { useActiveAccount } from "thirdweb/react";

async function getPoints(url) {
  return propexAPI.get(url);
}

export default function UserPointsModal() {
  const { refreshState } = useRefreshTrigger();
  const activeAccount = useActiveAccount();
  const { data, mutate, isLoading } = useSWR(
    `/user/points?address=${activeAccount?.address}`,
    getPoints
  );
  const popupRef = useRef();
  const [isOpen, setOpen] = useState(false);
  const isWhitePage = useIsWhitePage();

  useEffect(() => {
    if (isOpen) {
      mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // useOnClickOutside(popupRef, () => {
  //   setOpen(false);
  // });

  useEffect(() => {
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshState]);

  return (
    <Menu>
      <MenuButton
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        disabled={isLoading}
        className={cnm(
          "border min-w-16 lg:min-w-20 h-9 px-2 lg:px-4 flex items-center justify-center rounded-lg gap-2 text-white ",
          isLoading && "bg-mossgreen-800 animate-pulse",
          isWhitePage
            ? "text-black/90 hover:bg-neutral-100"
            : "hover:bg-mossgreen-800 border-mossgreen-800"
        )}
      >
        {!isLoading && (
          <>
            <PointsStar className="size-4" />
            <div className="text-xs lg:text-sm">
              <p>{data?.data?.userData?.points || 0}</p>
            </div>
          </>
        )}
      </MenuButton>
      <Transition show={isOpen}>
        <MenuItems
          static
          anchor="bottom end"
          transition
          className="origin-top min-w-72 [--anchor-offset:154px] lg:[--anchor-offset:0px] [--anchor-gap:12px] transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-white border rounded-lg z-[99]"
        >
          <div className="p-4 w-full flex flex-col items-center">
            {/* Balance */}
            <div className="w-full flex flex-col items-center gap-2">
              <h1 className="text-xl font-medium">Propex Points</h1>
              <p className="text-xs text-neutral-500">
                Earn more points and get rewards!
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mt-5 bg-lemongrass p-4 rounded-xl">
              <h1 className="text-3xl font-semibold">
                {isLoading ? (
                  <p>0</p>
                ) : (
                  <p>{data?.data?.userData?.points || 0}</p>
                )}
              </h1>
              <p className="text-xs">Points</p>
            </div>

            {/* Transaction */}

            <div className="w-full flex flex-col mt-10">
              <p className="font-semibold">History</p>
              {/* TXeS */}

              {!data?.data?.userData?.pointActivities ||
              data?.data?.userData?.pointActivities.length <= 0 ? (
                <div className="min-h-64 flex items-center justify-center">
                  <p className="text-neutral-400 text-sm">
                    No History Available
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    maskImage: "linear-gradient(#000 85%, transparent)",
                  }}
                  className="w-full flex flex-col mt-2 h-64 overflow-y-auto"
                >
                  {data?.data?.userData?.pointActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="w-full flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-xs">{activity.name}</p>
                        <p className="text-[10px] text-neutral-500">
                          <Clock className="size-2.5 inline-block" />{" "}
                          {dayjs(activity.createdAt).format("DD - MM - YYYY")}
                        </p>
                      </div>
                      <p className="text-[#00C851] text-sm font-semibold">
                        {activity.pointsAdded}+
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
