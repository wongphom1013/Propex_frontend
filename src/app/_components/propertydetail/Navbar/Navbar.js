"use client";

import Image from "next/image";
import { useWeb3Auth } from "@/app/_providers/Web3AuthProvider";
import { useEffect, useState, useRef } from "react";
import {
  userPointAtom,
  userSectionAtom,
  userTotalPointAtom,
} from "@/store/user-store";
import SvgIcon from "../../utils/SvgIcon";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

export const initialNavList = [
  {
    name: "Mint",
    sectionId: "tokenize-section",
    choosen: true,
  },
  {
    name: "SmartMap",
    sectionId: "smartmap-section",
    choosen: false,
  },
  {
    name: "Portfolio",
    sectionId: "features-section",
    choosen: false,
  },
  {
    name: "Docs",
    sectionId: "how-it-works-section",
    choosen: false,
  },
];

const dummyPropexPoints = [
  {
    address: "0x9292001a9f340c55d38b7837b5b7e96e23b6d1b8",
    date: "12-08-2024",
    points: 70,
  },
  {
    address: "0x7f8c2f25e6d2d957be3b9e6205bce4f8492c85a1",
    date: "13-08-2024",
    points: 50,
  },
  {
    address: "0x6b64e1d62b6e8c11d1d5478fa5e1e98ec3a7410d",
    date: "14-08-2024",
    points: 30,
  },
  {
    address: "0x4f9c6a8a3b8c9e5295f9b4c7b8e0b3a2b12f65e1",
    date: "15-08-2024",
    points: 90,
  },
];

const dummyWalletLists = [
  {
    name: "Lisk",
    src: "/assets/logo/lisk-icon.png",
    selected: true,
  },
  {
    name: "ETH",
    src: "/assets/logo/eth-coin.png",
    selected: false,
  },
  {
    name: "Base",
    src: "/assets/logo/base-icon.png",
    selected: false,
  },
];

const AuthButton = dynamic(() => import("../../button/authButton"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex w-16 h-8 items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg bg-lemongrass hover:bg-lemongrass animate-pulse"></div>
    );
  },
});

export default function Navbar() {
  const [navList, setNavList] = useState(initialNavList);
  const [userTotalPoint, setUserTotalPoint] = useAtom(userTotalPointAtom);
  const {
    login,
    logout,
    userInfo,
    formattedAddress,
    address,
    dollarBalance,
    walletServicesPlugin,
    handleUserInfoModal,
    isInitializing,
    balance,
  } = useWeb3Auth();
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPropexPopupVisible, setpropexPopupVisible] = useState(false);
  const [isEthereumPopupVisible, setEthereumPopupVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [userSection, setUserSection] = useAtom(userSectionAtom);
  const [userPoint] = useAtom(userPointAtom);
  const [walletList, setWalletList] = useState(dummyWalletLists);
  const [isWalletListVisible, setWalletListVisible] = useState(false);

  const modalRefs = {
    popup: useRef(null),
    propex: useRef(null),
    ethereum: useRef(null),
  };

  useEffect(() => {
    if (userInfo) {
      setProfileImage(
        userInfo.profileImage || "/assets/images/anonymous-user.png"
      );
      setName(userInfo.name || null);
      setEmail(userInfo.email || null);
      setUserTotalPoint(userInfo.propexPoint || 0);
    }
  }, [userInfo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the popup if the click is outside the respective modal
      if (
        isPopupVisible &&
        modalRefs.popup.current &&
        !modalRefs.popup.current.contains(event.target)
      ) {
        setPopupVisible(false);
      }
      if (
        isPropexPopupVisible &&
        modalRefs.propex.current &&
        !modalRefs.propex.current.contains(event.target)
      ) {
        setpropexPopupVisible(false);
      }
      if (
        isEthereumPopupVisible &&
        modalRefs.ethereum.current &&
        !modalRefs.ethereum.current.contains(event.target)
      ) {
        setEthereumPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPopupVisible,
    isPropexPopupVisible,
    isEthereumPopupVisible,
    isWalletListVisible,
  ]);

  const togglePopup = () => {
    setPopupVisible((prevState) => !prevState);
    setpropexPopupVisible(false);
    setEthereumPopupVisible(false);
  };

  const togglePopupPropexCoin = () => {
    setpropexPopupVisible((prevState) => !prevState);
    setPopupVisible(false);
    setEthereumPopupVisible(false);
  };

  const togglePopupEthereumCoin = () => {
    setEthereumPopupVisible((prevState) => !prevState);
    setPopupVisible(false);
    setpropexPopupVisible(false);
  };

  const handleWalletListPopUp = () => {
    setWalletListVisible((prevState) => !prevState);
  };

  const handleSelectWallet = async (name) => {
    const updatedWallets = dummyWalletLists.map((wallet) => ({
      ...wallet,
      selected: wallet.name === name,
    }));
    setWalletList(updatedWallets);
    handleWalletListPopUp();
  };

  const handleUserEdit = () => {
    handleUserInfoModal();
  };

  const handleUserSettings = () => {
    toast("There is no feature for this yet");
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const navigateToSection = (id) => {
    setNavList((prevList) =>
      prevList.map((item) =>
        item.sectionId === id
          ? { ...item, choosen: true }
          : { ...item, choosen: false }
      )
    );

    const chosenSection = initialNavList.find((item) => item.sectionId === id);
    if (chosenSection) {
      setUserSection(chosenSection.name);
    }
  };

  const getSelectedWallet = () => {
    return walletList.find((wallet) => wallet.selected);
  };

  return (
    <>
      <nav className="w-full h-full max-w-[1480px] px-6 flex items-center justify-between max-h-20">
        <div className="h-20 flex justify-center items-center">
          <div className="w-24 h-5 lg:w-28 lg:h-7 relative">
            <Image
              src={"/assets/logo/propex-logo.png"}
              alt="propex-white-logo"
              fill
              sizes="350px"
              className="object-contain overflow-hidden"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center text-black gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {navList.map((item) => (
            <button
              key={item.name}
              onClick={() => navigateToSection(item.sectionId)}
              className={`sm:px-2 px-8 w-full max-w-[120px] py-2 hover:underline font-open-sauce ${
                item.choosen
                  ? "bg-black bg-opacity-10 rounded-lg font-semibold h-10 w-28"
                  : ""
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {!userInfo ? (
          <div className="ml-auto">
            <AuthButton
              login={login}
              logout={logout}
              userInfo={userInfo}
              isInitializing={isInitializing}
            />
          </div>
        ) : (
          <div className="relative h-20 flex items-center justify-center">
            <div className="flex gap-2 lg:gap-4 justify-between items-center py-2">
              <button
                onClick={togglePopupPropexCoin}
                className="propex-balance border border-black border-opacity-10 text-black rounded-md px-4 py-1 flex items-center hover:cursor-pointer hover:bg-lightgreen hover:text-black"
              >
                <div className="relative w-6 h-6">
                  <Image
                    src={"/assets/logo/propex-coin.png"}
                    alt="propex-coin"
                    fill
                    sizes="350px"
                    className="object-contain"
                  />
                </div>
                <span className="ml-2">{userTotalPoint}</span>
              </button>
              <button
                onClick={togglePopupEthereumCoin}
                className="eth-balance border border-black border-opacity-10 max-w-24 text-black rounded-md px-4 py-1 flex items-center hover:cursor-pointer hover:bg-lightgreen hover:text-black"
              >
                <div className="relative w-5 h-5">
                  <Image
                    src={"/assets/logo/eth-coin.png"}
                    alt="eth-coin"
                    fill
                    sizes="350px"
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 overflow-hidden">
                  {Math.trunc(balance)}
                </span>
              </button>
              <div
                className="bg-white hover:cursor-pointer border border-black border-opacity-10 shadow-md rounded-md flex items-center justify-between px-2 py-1"
                onClick={togglePopup}
              >
                <SvgIcon
                  src="/assets/icons/arrow-down-dropdown.svg"
                  className="w-4 h-4 bg-mossgreen mr-2"
                />
                {profileImage && (
                  <div className="relative w-6 h-6">
                    <Image
                      src={profileImage}
                      alt="Profile Image"
                      fill
                      sizes="400px"
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Popup */}
            {isPopupVisible && (
              <div
                ref={modalRefs.popup}
                className="absolute top-16 left-0 w-full bg-white shadow-lg rounded-md mt-2 p-4 z-50"
              >
                <div className="flex flex-col items-center">
                  {/* Profile window content here */}
                  <div className="flex items-center mb-4">
                    {profileImage && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={profileImage}
                          alt="Profile Image"
                          fill
                          sizes="400px"
                          className="object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{name}</p>
                    <p className="text-xs font-normal">{email}</p>
                  </div>
                  <div className="bg-lightgreen relative flex justify-center items-center rounded-2xl px-4 py-2 mt-4 mb-4">
                    <SvgIcon
                      src="/assets/icons/wallet-fill.svg"
                      className="w-6 h-6 bg-mossgreen mr-2"
                    />
                    {formattedAddress}
                    <SvgIcon
                      src="/assets/icons/copy-logo.svg"
                      className="w-4 h-4 bg-mossgreen ml-2 hover:cursor-pointer"
                      onClick={handleCopyClick}
                    />
                    {copySuccess && (
                      <div className="absolute top-10 right-0 bg-white text-mossgreen text-xs py-1 px-2 rounded shadow-md">
                        Address has been copied!
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleUserEdit}
                    className="flex justify-start items-center relative border-t w-full py-4"
                  >
                    <SvgIcon
                      src="/assets/icons/profile-icon.svg"
                      className="w-4 h-4 bg-mossgreen mr-2"
                    />
                    <span className="text-xs font-semibold">Edit Profile</span>
                  </button>
                  <button
                    onClick={handleUserSettings}
                    className="flex justify-start items-center relative border-t w-full py-4"
                  >
                    <SvgIcon
                      src="/assets/icons/settings-gear.svg"
                      className="w-4 h-4 bg-mossgreen mr-2"
                    />
                    <span className="text-xs font-semibold">Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex justify-start items-center relative border-t w-full pt-4"
                  >
                    <SvgIcon
                      src="/assets/icons/log-out-arrow-curved.svg"
                      className="w-4 h-4 bg-mossgreen mr-2"
                    />
                    <span className="text-xs font-semibold">Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Propex Modal */}
            {isPropexPopupVisible && (
              <div
                ref={modalRefs.propex}
                className="absolute top-16 min-w-[280px] lg:min-w-72 right-0 lg:right-[170px] bg-white shadow-lg rounded-md mt-2 p-4 z-50"
              >
                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-semibold mb-1">Propex Points</h1>
                  <p className="text-[10px] text-black/50 mb-3">
                    Earn more points and get rewards!
                  </p>

                  <div className="w-full flex justify-center items-center flex-col">
                    <p className="text-black text-2xl font-bold pt-2">
                      {userTotalPoint}
                    </p>
                    <p className="text-black pb-2 text-sm">points</p>
                  </div>

                  <div className="w-full mt-4">
                    <h1 className="text-sm font-semibold">History</h1>
                  </div>

                  <div className="w-full mt-3 h-60 overflow-y-auto">
                    {dummyPropexPoints.length === 0 ? (
                      <p className="text-sm text-black">No Transaction</p>
                    ) : (
                      dummyPropexPoints.map((el, index) => (
                        <div
                          key={index}
                          className="w-full mb-4 flex justify-between"
                        >
                          <div className="flex flex-col">
                            <p className="text-left text-xs">
                              {formatAddress(el.address)}
                            </p>
                            <p className="text-left text-[10px] text-black/50">
                              {el.date}
                            </p>
                          </div>
                          <span className="text-right text-green-600 text-sm">
                            +{el.points}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Ethereum Modal */}
            {isEthereumPopupVisible && (
              <div
                ref={modalRefs.ethereum}
                className="absolute top-16 lg:min-w-[400px] min-w-[320px] right-0 lg:right-20 bg-white shadow-lg rounded-md mt-2 p-4 z-50"
              >
                <div className="flex flex-col items-center justify-center">
                  {/* Wallet Address and Copy Section */}
                  <div className="flex flex-col md:flex-row justify-between w-full mb-4">
                    <div className="flex items-start mb-4 md:mb-0 gap-2">
                      <SvgIcon
                        src="/assets/icons/wallet-fill.svg"
                        className="w-5 h-5 bg-mossgreen"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-black/50">
                          Wallet Address
                        </p>
                        <div className="flex items-center">
                          <p className="text-sm">{formattedAddress}</p>
                          <SvgIcon
                            src="/assets/icons/copy-logo.svg"
                            className="w-4 h-4 bg-mossgreen ml-2 hover:cursor-pointer"
                            onClick={handleCopyClick}
                          />
                        </div>
                      </div>

                      {copySuccess && (
                        <div className="absolute top-12 left-12 bg-white text-mossgreen text-xs py-1 px-2 rounded shadow-md">
                          Address has been copied!
                        </div>
                      )}
                    </div>

                    {/* Selected Wallet Button */}
                    <button
                      onClick={handleWalletListPopUp}
                      className="relative px-4 rounded-lg border border-black border-opacity-10 flex items-center justify-center gap-2 py-2 hover:bg-black/5"
                    >
                      <div className="flex items-center justify-center rounded-full border relative w-4 h-4">
                        <Image
                          src={getSelectedWallet().src}
                          alt={`${getSelectedWallet().name} Wallet Image`}
                          fill
                          sizes="40px"
                          className="object-cover rounded-full"
                        />
                      </div>
                      <span className="text-xs">
                        {getSelectedWallet().name}
                      </span>
                      <SvgIcon
                        src="/assets/icons/arrow-down-dropdown.svg"
                        className="w-4 h-4 bg-mossgreen"
                      />
                    </button>
                  </div>

                  {/* Wallet List Popup */}
                  {isWalletListVisible && (
                    <div className="absolute w-full md:w-40 py-2 top-14 md:top-16 p-3 right-4 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                      {walletList.map((el, index) => (
                        <div
                          onClick={() => handleSelectWallet(el.name)}
                          key={index}
                          className="flex items-center p-2 rounded-md hover:bg-black/5 cursor-pointer"
                        >
                          <Image
                            src={el.src}
                            alt={`${el.name} Wallet Image`}
                            width={16}
                            height={16}
                            className="object-cover rounded-full"
                          />
                          <span className="ml-2 text-xs">{el.name}</span>
                          {el.selected && (
                            <SvgIcon
                              src="/assets/icons/checked.svg"
                              className="w-3 h-3 bg-mossgreen ml-auto"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Balance and Transaction Info */}
                  <div className="w-full flex justify-center items-center flex-col mt-2">
                    <p className="text-black text-2xl font-bold">
                      ${dollarBalance}
                    </p>
                    <p className="text-black text-sm">{balance} ETH</p>
                  </div>

                  {/* Transaction Section */}
                  <div className="w-full mt-3">
                    <h1 className="text-sm font-semibold">Transaction</h1>
                  </div>
                  <div className="w-full mt-2 h-60 overflow-y-auto">
                    {dummyPropexPoints.length === 0 ? (
                      <div className="text-sm text-black/60 w-full min-h-64 flex items-center justify-center">
                        No Transaction
                      </div>
                    ) : (
                      dummyPropexPoints.map((el, index) => (
                        <div
                          key={index}
                          className="w-full my-4 flex justify-between"
                        >
                          <div className="flex flex-col">
                            <p className="text-left text-xs">
                              {formatAddress(el.address)}
                            </p>
                            <p className="text-left text-[10px]">{el.date}</p>
                          </div>
                          <span className="text-right text-xs text-green-600">
                            +${el.points}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

const formatAddress = (address) => {
  if (!address) return "";
  const start = address.slice(0, 8);
  const end = address.slice(-4);
  return `${start}...${end}`;
};
