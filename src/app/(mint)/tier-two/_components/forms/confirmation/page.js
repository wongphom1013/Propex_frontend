"use client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  propertyForm,
  rwaCardDetailAtom,
} from "@/app/(mint)/_store/form-store";
import SvgIcon from "@/app/_components/utils/SvgIcon";
import Image from "next/image";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import { imageDataAtom } from "@/store/image-store";
import "../../../style/custom-line-steps.css";
import { motion } from "framer-motion";
import ViewAddressButton from "../../viewAddress";
import { useRouter } from "next/navigation";
import { useResetTierTwoForm } from "@/app/(mint)/_hooks/useTierTwo";
import { useFormsStore } from "@/app/(mint)/_store/form-store-zustand";
import LocationAnimation from "@/assets/dashboard/mint-page/animations/Location.json";
import Confetti from "react-dom-confetti";

const nftTrivia = [
  "Did you know? NFTs can represent ownership of unique digital items.",
  "Creating Your NFT—Almost There!",
  "NFTs are often used for digital art, but they can also represent virtual real estate, collectibles, and more.",
  "We are still minting it, we will tell joe to make it faster. Please wait in kind... JOE!",
  "Each NFT is unique and cannot be replicated, making it a true one-of-a-kind asset.",
  "NFTs use blockchain technology to verify ownership and authenticity.",
  "The first NFT was created in 2017, but the concept has evolved rapidly since then.",
  "We are almost there, just a little bit further...",
];

export default function ConfirmationPage({
  userProgress,
  handleBackButton,
  nftMetaData,
}) {
  const router = useRouter();

  const { propertyFormZustand, points, pointsActivity } = useFormsStore();

  const [formData] = useAtom(propertyForm);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [estimatedMintUsdFee] = useState(200);
  // State for building detail
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(null);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState(null);
  const [buildingSize, setBuildingSize] = useState(null);
  const [rwaCardDetail] = useAtom(rwaCardDetailAtom);

  const [loading] = useState(false);

  // State for set and upload the image data to ipfs
  const [, setImageData] = useAtom(imageDataAtom);
  const reset = useResetTierTwoForm();

  const handleShareNFT = () => {
    toast("We have yet implement this features");
  };

  const handleViewProperty = () => {
    reset();
    router.push("/portfolio");
  };

  useEffect(() => {
    const {
      buildingSize: size,
      numberOfBedrooms: bedrooms,
      numberOfBathrooms: bathrooms,
    } = propertyFormZustand;

    const formattedBuildingSize = size ? `${size} m²` : null;

    const extractNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? match[0] : null;
    };

    const formattedNumberOfBedrooms = extractNumber(bedrooms);
    const formattedNumberOfBathrooms = extractNumber(bathrooms);

    // Check if these fields are present in pointsActivity
    const buildingSizeInPoints = pointsActivity.some(
      (activity) => activity.name === "buildingSize"
    );
    const numberOfBedroomsInPoints = pointsActivity.some(
      (activity) => activity.name === "numberOfBedrooms"
    );
    const numberOfBathroomsInPoints = pointsActivity.some(
      (activity) => activity.name === "numberOfBathrooms"
    );

    // Update state based on pointsActivity
    if (buildingSizeInPoints) {
      setBuildingSize(formattedBuildingSize);
    }

    if (numberOfBedroomsInPoints) {
      setNumberOfBedrooms(formattedNumberOfBedrooms);
    }

    if (numberOfBathroomsInPoints) {
      setNumberOfBathrooms(formattedNumberOfBathrooms);
    }

    // Update image preview
    setImageData((prevState) => ({
      ...prevState,
      previewImage: formData.thumbnail.url,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        setTriviaIndex((prevIndex) => (prevIndex + 1) % nftTrivia.length);
      }, 8000);

      return () => clearInterval(intervalId);
    }
  }, [loading]);

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

  if (
    !["mintingConfirmation", "minting", "mintingSuccess"].includes(userProgress)
  )
    return null;

  switch (userProgress) {
    case "mintingConfirmation":
      return (
        <div className="pb-24 lg:pb-32 w-full flex flex-col items-center bg-white font-open-sauce">
          <div className="w-full h-full mb-8 px-4">
            <ViewAddressButton
              userProgress={userProgress}
              nftMetaData={nftMetaData}
              handleBackButton={handleBackButton}
            />
          </div>

          <div className="w-full max-w-[1480px] h-full px-5 lg:px-12">
            <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center mt-8">
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center justify-center w-8 h-8 bg-mossgreen text-white rounded-full">
                  <SvgIcon
                    src="/assets/icons/checked.svg"
                    className="w-4 h-4 bg-lemongrass"
                  />
                  <span className="absolute -bottom-6 font-semibold text-mossgreen text-sm">
                    Ownership
                  </span>
                </div>
                <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-mossgreen rounded-lg"></div>
                <div className="relative flex items-center justify-center w-8 h-8 bg-mossgreen text-white rounded-full">
                  <SvgIcon
                    src="/assets/icons/checked.svg"
                    className="w-4 h-4 bg-lemongrass"
                  />
                  <span className="absolute -bottom-6 font-semibold text-mossgreen text-sm">
                    Property
                  </span>
                </div>
                <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-mossgreen rounded-lg"></div>
                <div className="relative flex items-center justify-center w-8 h-8 p-[2px] bg-mossgreen text-white rounded-full">
                  <div className="w-full h-full rounded-full border border-white flex items-center justify-center">
                    <span className="font-semibold text-lemongrass text-sm">
                      3
                    </span>
                    <span className="absolute -bottom-6 font-semibold text-mossgreen text-sm">
                      Confirmation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center mt-20 mb-8">
              <p className="text-2xl text-black font-semibold">
                Create Listing: Confirmation
              </p>
            </div>
            <NFTCard
              mintingProgress={userProgress}
              mapsImage={propertyFormZustand?.thumbnail?.url}
              numberOfBedrooms={numberOfBedrooms}
              numberOfBathrooms={numberOfBathrooms}
              buildingSize={buildingSize}
              sellingPrice={propertyFormZustand?.sellingPrice}
              placeDescription={nftMetaData?.mintDetailsData?.mapsAddress}
            />

            <div className="bg-mossgreen/10 text-mossgreen/80 text-sm p-5 rounded-lg mx-auto mt-7 max-w-[628px] border border-mossgreen">
              Please note that all uploaded documents will be manually reviewed
              and verified by our notary to ensure authenticity and compliance.
              The verification process is crucial for the successful upgrade of
              your listing to a Tier 2 NFT. Only documents that pass the
              notary's review will be approved. Thank you for your cooperation
              and understanding.
            </div>
            <div className="w-full h-full max-w-[628px] mx-auto">
              <div className="w-full h-full mx-auto mt-7 py-2 px-4 border border-black border-opacity-10 rounded-lg text-sm">
                <div className="flex justify-between items-center my-2">
                  <p className="text-[#6D6D6D]">Minting Fee (estimated)</p>
                  <p>${estimatedMintUsdFee}</p>
                </div>
                <div className="flex justify-between items-center my-2">
                  <p className="text-[#6D6D6D]">Gas Fee</p>
                  <p className="font-bold text-tealBlue">FREE</p>
                </div>
                <div className="flex justify-between items-start my-2">
                  <p className="font-semibold text-black">Total</p>
                  <div className="text-right">
                    <p>${estimatedMintUsdFee}</p>
                    <p className="font-bold text-tealBlue text-[10px]">
                      You will get {points} Points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "minting":
      return (
        <div className="w-full h-[calc(100vh-82px)] bg-white flex flex-col items-center overflow-hidden font-open-sauce">
          <div className="w-full max-w-[1480px] h-full px-5 lg:px-12">
            <div className="h-full w-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center px-4 -mt-6">
                <Lottie
                  animationData={LocationAnimation}
                  loop={true}
                  autoplay={true}
                  className="mb-0 size-64"
                />
                <p className="font-semibold text-black w-full text-center font-open-sauce -mt-6">
                  {nftTrivia[triviaIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    case "mintingSuccess":
      return (
        <div className="w-full h-[calc(100vh-82px)] bg-white flex flex-col items-center overflow-y-auto font-open-sauce pb-20">
          <div className="absolute inset-0 w-screen min-h-screen overflow-hidden flex flex-col items-center mx-auto pointer-events-none">
            <Confetti
              active={confettiTrigger}
              config={confettiConfig}
              className="-translate-y-[4rem] translate-x-[0.4rem]"
            />
          </div>

          <div className="w-full max-w-[676px] flex flex-col justify-start items-center mx-auto mt-12">
            <p className="text-black font-semibold text-4xl max-w-[470px] text-center mb-12">
              Your property has been minted successfully!
            </p>
            <div className="w-full h-full px-4">
              <NFTCard
                mintingProgress={userProgress}
                mapsImage={rwaCardDetail?.url}
                numberOfBedrooms={numberOfBedrooms}
                numberOfBathrooms={numberOfBathrooms}
                buildingSize={buildingSize}
                sellingPrice={rwaCardDetail?.sellingPrice}
                placeDescription={rwaCardDetail?.description}
              />
            </div>
            <div className="w-full h-full flex flex-col sm:flex-row justify-center items-center mt-8 gap-4 font-bold px-4">
              <button
                onClick={handleViewProperty}
                className="w-full max-w-[150px] h-14 text-black rounded-lg border border-[#DFE3EC] flex justify-center items-center px-2 py-2 hover:bg-black/5"
              >
                View Property
              </button>
              <button
                onClick={handleShareNFT}
                className="w-full max-w-[244px] h-14 bg-mossgreen text-lemongrass rounded-lg px-2 py-2 flex justify-center items-center hover:bg-mossgreen/90"
              >
                Share & Get Points
                <div className="bg-lightgreen py-1 flex items-center rounded-2xl px-1 ml-2">
                  <div className="relative w-4 h-4">
                    <Image
                      src={"/assets/logo/propex-coin.png"}
                      alt="propex-coin"
                      fill
                      sizes="350px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-green-600 font-semibold text-xs">
                    +10
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
  }
}

const NFTCard = ({
  mintingProgress,
  mapsImage,
  numberOfBedrooms,
  numberOfBathrooms,
  buildingSize,
  sellingPrice,
  placeDescription,
}) => {
  if (
    mintingProgress !== "mintingConfirmation" &&
    mintingProgress !== "mintingSuccess"
  )
    return null;

  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-full max-w-[628px] mx-auto"
    >
      <div className="relative w-full">
        <div className="relative card-nft max-w-[380px] max-h-[443px] mx-auto rounded-2xl border border-black border-opacity-10 w-full p-5">
          {/* Content */}
          <div className="card-nft-body w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
            {/* Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-100px)] lg:w-[calc(100%-160px)] h-7 bg-white z-50 flex items-center justify-center top-0">
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="-translate-y-2 flex items-center justify-center w-full h-full">
                  <div className="relative size-4 lg:size-5 mr-2">
                    <Image
                      src={"/assets/logo/propex-icon-logo.png"}
                      alt="maps-card-nft"
                      fill
                      sizes="348px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-black text-[10px] lg:text-xs font-semibold whitespace-nowrap">
                    Propex RWA NFT
                  </span>
                </div>

                {/* Rounded inner */}
                <div
                  className="bg-white h-7 w-10 absolute top-0 -left-10 -scale-x-100"
                  style={{ clipPath: "url(#top-left-circle-clip)" }}
                ></div>
                <div
                  className="bg-white h-7 w-10 absolute top-0 -right-10"
                  style={{ clipPath: "url(#top-left-circle-clip)" }}
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
              <Image
                src={mapsImage || ""}
                alt="maps-card-nft"
                fill
                sizes="1080px"
                className="object-cover"
              />

              <div className="absolute bottom-2 px-2 flex justify-end gap-2 w-full h-full max-h-[40px] ">
                {numberOfBedrooms && (
                  <div className="flex justify-center items-center px-2 py-2 max-w-14 w-full h-[37px] bg-lightgreen rounded-lg">
                    <SvgIcon
                      src="/assets/icons/bed.svg"
                      className="w-4 h-4 mr-2 bg-black"
                    />
                    <p className="text-black text-xs">{numberOfBedrooms}</p>
                  </div>
                )}
                {numberOfBathrooms && (
                  <div className="flex justify-center items-center px-2 py-2 max-w-14 w-full h-[37px] bg-lightgreen rounded-lg">
                    <SvgIcon
                      src="/assets/icons/amenities/bathtub.svg"
                      className="w-4 h-4 mr-2 bg-black"
                    />
                    <p className="text-black text-xs">{numberOfBathrooms}</p>
                  </div>
                )}
                {buildingSize && (
                  <div className="flex justify-center items-center px-2 py-2 max-w-[101px] w-full h-[37px] bg-lightgreen rounded-lg">
                    <SvgIcon
                      src="/assets/icons/amenities/resize-square.svg"
                      className="w-4 h-4 mr-2 bg-black"
                    />
                    <p className="text-black text-xs w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                      {buildingSize}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card-nft-place-id mt-2 w-full">
            <p className="text-xl truncate font-semibold mb-1">
              Rp {sellingPrice}
            </p>
            <p className="truncate text-xs text-[#6D6D6D]">
              {placeDescription}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
