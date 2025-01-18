import Image from "next/image";

export default function MapsCard({
  mapsImage,
  latitude,
  longitude,
  placeId,
  placeDescription,
}) {
  if (!mapsImage) return null;
  return (
    <div className="relative card-nft max-w-[380px] mx-auto rounded-2xl border border-black border-opacity-10 w-full p-5">
      {/* Content */}
      <div className="card-nft-body w-full aspect-square mx-auto relative rounded-lg flex items-center justify-center">
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-160px)] h-7 bg-white z-50 flex items-center justify-center top-0">
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="-translate-y-2 flex items-center justify-center w-full h-full">
              <div className="relative h-5 w-5 mr-2">
                <Image
                  src={"/assets/logo/propex-icon-logo.png"}
                  alt="maps-card-nft"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <span className="text-black text-xs font-semibold">
                Propex Location NFT
              </span>
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
        <div className="relative h-full w-full rounded-xl overflow-hidden">
          <Image
            src={mapsImage}
            alt="maps-card-nft"
            fill
            sizes="1080px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="card-nft-place-id mt-5 w-full">
        <p className="text-xs truncate">ID: {placeId}</p>
        <p className="truncate font-bold">{placeDescription}</p>
      </div>
      <div className="mt-5 card-nft-gps-coordinates flex flex-col gap-1 justify-center bg-lightgreen p-3 rounded-lg mx-auto">
        <p className="text-xs">GPS Coordinates</p>
        <p className="font-bold truncate text-sm">
          {latitude}, {longitude}
        </p>
      </div>
    </div>
  );
}
