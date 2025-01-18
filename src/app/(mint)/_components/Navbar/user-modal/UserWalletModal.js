"use client";

import { AVAILABLE_CHAIN_LIST } from "@/app/(mint)/_lib/web3/chains";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ArrowUpRight, Check, ChevronDown, Clock, Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import WalletIcon from "@/assets/account-bar/wallet-icon.svg";
import { shortenAddress } from "@/app/(mint)/_utils/string";
import { cnm } from "@/utils/style";
import { convertEthToUsd } from "@/app/(mint)/_lib/web3/currency";
import { atom, useAtom } from "jotai";
import { useOnClickOutside } from "usehooks-ts";
import Spinner from "../../elements/Spinner";
import useSWR from "swr";
import dayjs from "dayjs";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { useIsWhitePage } from "@/app/(mint)/_hooks/useIsWhitePage";
import {
  useActiveAccount,
  useWalletBalance,
  useWalletDetailsModal,
} from "thirdweb/react";
import { thirdwebClient } from "@/app/(mint)/_lib/web3/thirdweb";
import { THIRDWEB_LISK_CHAIN } from "@/app/(mint)/_lib/web3/chains-new";

export const selectedChainAtom = atom(AVAILABLE_CHAIN_LIST[0]);

export default function UserWalletModal() {
  const [selectedChain, setSelectedChain] = useAtom(selectedChainAtom);
  const [currentChain, setCurrentChain] = useState(selectedChain);
  const activeAccount = useActiveAccount();
  const [isCopied, setCopied] = useState(false);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const popupRef = useRef();
  const listboxRef = useRef();
  const isWhitePage = useIsWhitePage();
  const { data, isLoading: isBalanceLoading } = useWalletBalance({
    chain: THIRDWEB_LISK_CHAIN,
    address: activeAccount?.address,
    client: thirdwebClient,
  });
  const detailsModal = useWalletDetailsModal();
  const balance = parseFloat(data?.displayValue.slice(0, 8));

  async function copyAddress() {
    if (isCopied) return;
    setCopied(true);
    await navigator.clipboard.writeText(activeAccount?.address);
    toast.success("Wallet address copied");
    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  useEffect(() => {
    async function getBalanceUsd(balance) {
      try {
        setBalanceUsd(0);
        const ethInUsd = await convertEthToUsd(balance);
        setBalanceUsd(ethInUsd);
      } catch (e) {
        toast.error("Error while getting USD balance");
      }
    }
    if (balance) {
      getBalanceUsd(balance);
    }
  }, [balance, selectedChain.chainId]);

  // useOnClickOutside(popupRef, (event) => {
  //   const listboxContainsClick =
  //     listboxRef.current && listboxRef.current.contains(event.target);
  //   const popupContainsClick =
  //     popupRef.current && popupRef.current.contains(event.target);
  //   if (!listboxContainsClick && !popupContainsClick) {
  //     setOpen(false);
  //   }
  // });

  return (
    <Menu>
      <MenuButton
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        disabled={isBalanceLoading}
        className={cnm(
          "border min-w-20 h-9 px-2 lg:px-4 flex items-center justify-center rounded-lg gap-2.5 text-white hover:bg-mossgreen-800",
          isBalanceLoading && "bg-mossgreen-800 animate-pulse",
          isWhitePage
            ? "text-black/90 hover:bg-neutral-100"
            : "hover:bg-mossgreen-800 border-mossgreen-800"
        )}
      >
        {isBalanceLoading ? null : (
          <>
            <div className="w-5 aspect-square relative bg-white rounded-full flex items-center justify-center">
              <Image
                src={
                  "/assets/dashboard/mint-page/account-bar/eth-chain-logo.png"
                }
                height={48}
                width={48}
                alt={`eth-logo`}
                className="size-4"
              />
              <div className="size-3.5 border border-mossgreen absolute -bottom-0.5 -right-1.5 bg-white rounded-full flex items-center justify-center">
                <Image
                  src={selectedChain.logoUrl}
                  height={8}
                  width={8}
                  alt={`${selectedChain.name}-logo`}
                />
              </div>
            </div>
            <p className="text-xs lg:text-sm">
              {balance || balance > 0 ? parseFloat(balance).toFixed(3) : 0}
            </p>
          </>
        )}
      </MenuButton>
      <Transition show={isOpen}>
        <MenuItems
          anchor="bottom end"
          static
          ref={popupRef}
          className="origin-top [--anchor-offset:68px] lg:[--anchor-offset:0px] w-[340px] lg:w-[400px] [--anchor-gap:12px] transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-white border rounded-lg z-[99]"
        >
          <div className="py-4 w-full">
            <div className="flex w-full items-center justify-between px-4">
              <div className="flex gap-2">
                <WalletIcon />
                <div className="flex flex-col">
                  <div className="text-neutral-500 text-xs">Wallet Address</div>
                  <div className="flex items-center gap-2 text-sm">
                    <p>{shortenAddress(activeAccount?.address)}</p>
                    <button onClick={copyAddress}>
                      {isCopied ? (
                        <Check className="w-4 aspect-square" />
                      ) : (
                        <Copy className="w-4 aspect-square" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Chains */}
              <Listbox value={selectedChain} onChange={setCurrentChain}>
                <ListboxButton className="px-3 py-2 text-xs border rounded-lg bg-white text-neutral-900 hover:bg-neutral-50 flex items-center gap-2 z-[55]">
                  <div
                    className={cnm(
                      "w-5 aspect-square relative border bg-white rounded-full flex items-center justify-center p-[3px]",
                      selectedChain.name === "Base" && "border-none p-0 w-4",
                      selectedChain.name === "Ethereum" &&
                        "border-none bg-neutral-200"
                    )}
                  >
                    <Image
                      src={selectedChain.logoUrl}
                      height={48}
                      width={48}
                      alt={`${selectedChain.name}-logo`}
                      className="w-full h-full"
                    />
                  </div>
                  {selectedChain.name}
                  <ChevronDown className="w-4 h-4" />
                </ListboxButton>
                <ListboxOptions
                  ref={listboxRef}
                  anchor="bottom end"
                  transition
                  className={cnm(
                    "[--anchor-gap:6px] origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 z-[60]",
                    "bg-white border rounded-lg p-2 min-w-48 text-xs"
                  )}
                >
                  {AVAILABLE_CHAIN_LIST.map((chain) => (
                    <ListboxOption
                      key={chain.id}
                      value={chain}
                      className="group hover:bg-neutral-50 rounded-md px-2 py-2 flex justify-start items-center cursor-pointer"
                    >
                      <div
                        className={cnm(
                          "w-5 aspect-square relative border bg-white rounded-full flex items-center justify-center mr-2 p-[3px]",
                          chain.name === "Base" && "border-none p-0",
                          chain.name === "Ethereum" &&
                            "border-none bg-neutral-200"
                        )}
                      >
                        <Image
                          src={chain.logoUrl}
                          width={32}
                          height={32}
                          alt={`${chain.name}-logo`}
                          className="w-full h-full"
                        />
                      </div>
                      <p>{chain.name}</p>
                      <Check className="invisible size-4 group-data-[selected]:visible ml-auto" />
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>

            {/* Balance */}
            <div className="w-full flex flex-col items-center gap-2 mt-7">
              <div>
                {isBalanceLoading ? (
                  <div className="bg-neutral-200 rounded-md w-28 h-10"></div>
                ) : (
                  <h1 className="text-3xl font-semibold">
                    {balanceUsd
                      ? balanceUsd?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : `$0`}
                  </h1>
                )}
              </div>
              <div>
                {isBalanceLoading ? (
                  <div className="bg-neutral-200 rounded w-20 h-3"></div>
                ) : (
                  <p className="text-xs">
                    {balance || balance > 0
                      ? parseFloat(balance).toFixed(4)
                      : 0}{" "}
                    ETH
                  </p>
                )}
              </div>
            </div>

            {/* Send */}
            <div className="px-4 mt-7">
              <button
                onClick={() => {
                  detailsModal.open({
                    client: thirdwebClient,
                    theme: "light",
                    hideDisconnect: true,
                  });
                }}
                className="w-full py-3 rounded-md bg-mossgreen text-white flex items-center gap-2 justify-center text-sm font-medium hover:bg-mossgreen/90"
              >
                <div className="flex items-center gap-2">
                  Wallet <ArrowUpRight className="size-4" />
                </div>
              </button>
            </div>

            {/* Transaction */}
            <Transactions />
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function Transactions() {
  const activeAccount = useActiveAccount();
  const { data, isLoading } = useSWR(
    `/transaction?address=${activeAccount?.address}`,
    async (url) => {
      const { data } = await propexAPI.get(url);
      return data;
    }
  );

  return (
    <div className="w-full flex flex-col mt-3 px-4">
      <p className="font-semibold">Transaction</p>
      {/* TXeS */}
      {isLoading ? (
        <div className="min-h-64 flex items-center justify-center">
          <Spinner className={"size-5 text-neutral-300 fill-neutral-500"} />
        </div>
      ) : !data?.data || data.data?.transactions?.length === 0 ? (
        <div className="min-h-64 flex items-center justify-center">
          <p className="text-neutral-400 text-sm">No Transactions Available</p>
        </div>
      ) : (
        <div className="min-h-64 max-h-72 overflow-y-auto flex flex-col mt-4">
          {data.data.transactions.map((tx) => (
            <a
              key={tx.id}
              href={tx.txUrl}
              target="_blank"
              className="w-full flex items-center justify-between py-3.5 hover:bg-neutral-100 rounded-md px-3"
            >
              <div>
                <p className="text-xs">{tx.name}</p>
                <p className="text-[10px] text-neutral-500">
                  <Clock className="size-2.5 inline-block" />{" "}
                  {dayjs(tx.createdAt).format("DD - MM - YYYY")}
                </p>
              </div>
              <p className="text-red-500 text-sm font-semibold">
                {tx.totalCharged} ETH
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// function SendForm() {
//   const [web3authProvider] = useWeb3auth((state) => [state.web3authProvider]);
//   const [sendMode, setSendMode] = useState(false);
//   const [isSending, setSending] = useState(false);
//   const [toAddress, setToAddress] = useState("");
//   const [amount, setAmount] = useState("");
//   const { balance } = useWallet();

//   const handleAmountChange = (e) => {
//     const value = e.target.value.replace(/,/g, "");
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       setAmount(value);
//     }
//   };

//   function close() {
//     setAmount("");
//     setToAddress("");
//     setSendMode(false);
//   }

//   async function sendEth() {
//     if (!toAddress) {
//       return toast.error("Please provide the receipent address", {
//         position: "top-center",
//       });
//     }

//     if (!amount) {
//       return toast.error("Please provide some amount", {
//         position: "top-center",
//       });
//     }

//     setSending(true);

//     try {
//       if (balance <= 0) {
//         return toast.error("Insufficient ETH amount", {
//           position: "top-center",
//         });
//       }

//       const { totalCost } = await calculateTotalEstimatedCost(
//         web3authProvider,
//         toAddress,
//         amount
//       );

//       if (balance < totalCost) {
//         return toast.error(
//           `You need at least ${parseFloat(totalCost).toFixed(6)} ETH to send`,
//           {
//             position: "top-center",
//           }
//         );
//       }

//       const receipt = await transferEth(web3authProvider, toAddress, amount);

//       toast.success(`${amount} has been sent to ${shortenAddress(toAddress)}`);
//     } catch (e) {
//       toast.error(`Error while sending ETH to ${shortenAddress(toAddress)}`);
//     } finally {
//       setSending(false);
//     }
//   }

//   return (
//     <div className="w-full px-4 mt-7">
//       {sendMode ? (
//         <div className="w-full flex items-center gap-2">
//           <button
//             onClick={close}
//             className="flex-1 py-3 rounded-md bg-mossgreen/10 text-mossgreen flex items-center gap-2 justify-center text-sm font-medium hover:bg-mossgreen/15"
//           >
//             <div className="flex items-center gap-2">
//               Cancel <X className="size-4" />
//             </div>
//           </button>
//           <button
//             onClick={sendEth}
//             disabled={isSending}
//             className="flex-1 py-3 rounded-md bg-mossgreen text-white flex items-center gap-2 justify-center text-sm font-medium hover:bg-mossgreen/90"
//           >
//             {isSending ? (
//               <Spinner className="size-4 text-neutral-500 fill-mossgreen" />
//             ) : (
//               <div className="flex items-center gap-2">
//                 Send <ArrowUpRight className="size-4" />
//               </div>
//             )}
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => {
//             setSendMode(true);
//           }}
//           className="w-full py-3 rounded-md bg-mossgreen text-white flex items-center gap-2 justify-center text-sm font-medium hover:bg-mossgreen/90"
//         >
//           <div className="flex items-center gap-2">
//             Send <ArrowUpRight className="size-4" />
//           </div>
//         </button>
//       )}

//       <motion.div
//         initial={{
//           height: 0,
//         }}
//         animate={{
//           height: sendMode ? "auto" : 0,
//         }}
//         className={cnm("w-full mt-5 overflow-hidden")}
//       >
//         <div className="w-full flex flex-col lg:flex-row gap-2 py-3">
//           <CoolInput
//             name="to-address"
//             value={toAddress}
//             containerClassname={
//               "items-start rounded-md bg-white relative lg:w-[60%]"
//             }
//             label={"To"}
//             handleChange={(e) => {
//               const value = e.target.value;
//               setToAddress(value);
//             }}
//             placeholder="e.g. 0x4y80A...89m"
//             labelClassname={"-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"}
//           />
//           <CoolInput
//             name="amount"
//             value={amount.toString()}
//             containerClassname={
//               "items-start rounded-md bg-white relative lg:w-[40%]"
//             }
//             label={"Amount (ETH)"}
//             handleChange={handleAmountChange}
//             labelClassname={"-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"}
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// }
