"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { propexAPI } from "@/app/(mint)/_api/propex";
import Map, {
  Marker,
  Source,
  Layer,
  ScaleControl,
  NavigationControl,
} from "react-map-gl";
import { Card, CardBody, Input, Skeleton, Slider } from "@nextui-org/react";
import { cnm } from "@/utils/style";
import { ArrowRight, ChevronLeft, MapPin, X } from "lucide-react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import "mapbox-gl/dist/mapbox-gl.css";
import { useActiveAccount } from "thirdweb/react";
import { useMapStore } from "@/app/(mint)/_store/maps-store";
import toast from "react-hot-toast";
import { useDebounceCallback } from "usehooks-ts";
import { nanoid } from "nanoid";
import { useAtom } from "jotai";
import { isDemoModeAtom } from "@/app/(mint)/_store/demo-store";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function getUser(url) {
  const { data } = await propexAPI.get(url);
  return data?.userData;
}

async function getGoogleMapSnapshotBlob(
  lat,
  lng,
  zoom = 15,
  size = "800x600",
  scale = 2,
  maptype = "roadmap",
  markerUrl
) {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}&maptype=${maptype}&key=${GOOGLE_MAPS_API_KEY}`;
  const marker = `&markers=icon:${encodeURIComponent(markerUrl)}|${lat},${lng}`;
  const finalUrl = mapUrl + marker;
  try {
    const res = await fetch(finalUrl);
    const data = await res.blob();
    return {
      blob: data,
      url: finalUrl,
    };
  } catch (error) {
    console.error("Error fetching the map snapshot:", error);
    throw error;
  }
}

const ExpandPage = () => {
  const params = useParams();
  const router = useRouter();
  const nftId = params.nftId;
  console.log(nftId);

  const [zoomScale, setZoomScale] = useState(14);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [radiusScale, setRadiusScale] = useState(0.1);
  const [propTokens, setPropTokens] = useState(50);
  const [territoryName, setTerritoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setPreviewUrl, previewUrl } = useMapStore();
  const activeAccount = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [isDemoMode] = useAtom(isDemoModeAtom);

  const mapRef = useRef(null);

  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR(`/user?address=${activeAccount?.address}`, getUser);

  let userImg;
  if (user && !isDemoMode) {
    userImg = user?.imageUrl;
  }
  userImg = "/public/assets/images/anonymous-user.png";

  let radiusInPixel;

  const bondingCurve = (r) => {
    return 50 * Math.pow(r / 100, Math.log(20) / Math.log(10));
  };

  const calculateToken = (radiusScale) => {
    return Math.round(bondingCurve(radiusScale * 1000) * 100) / 100;
  };

  const calculateRadius = (propTokens) => {
    return 100 * Math.pow(propTokens / 50, Math.log(10) / Math.log(20));
  };

  const { data, error } = useSWR(
    nftId ? `/nft/detail/${nftId}` : null,
    async (url) => {
      const { data } = await propexAPI.get(url);
      return data;
    }
  );

  useEffect(() => {
    if (data && data.mintDetailsData) {
      const { lat, lng } = data.mintDetailsData;
      setMarkerCoordinates({ latitude: lat, longitude: lng });
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [lng, lat], duration: 2000 });
      }
    }
  }, [data]);

  const handlerZoom = (value) => {
    setZoomScale(value);
  };

  // Handle slider change with debounce using useDebounceCallback
  const handleSliderChange = (value) => {
    setRadiusScale(value);
    const calculatedTokens = calculateToken(value);
    setPropTokens(calculatedTokens);
  };

  const handlePropTokenChange = (e) => {
    const newPropTokens = e.target.value;
    if (/^\d*\.?\d*$/.test(newPropTokens)) {
      setPropTokens(newPropTokens);
      const newRadius = calculateRadius(newPropTokens);
      setRadiusScale(newRadius / 1000);
    }
  };

  const handleStake = async () => {
    const payload = {
      radius: radiusScale * 1000,
      tokenAmount: propTokens,
      userMintId: nftId,
      name: territoryName,
      imageUrl: previewUrl,
    };
    try {
      await propexAPI.post("/nft/expand-territory", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setIsOpen(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const calculatePixelRadius = (radiusInKm) => {
    const earthCircumference = 40075000;
    const latitudeInRadians = (markerCoordinates?.latitude * Math.PI) / 180;
    const metersPerPixel =
      (earthCircumference * Math.cos(latitudeInRadians)) /
      Math.pow(2, zoomScale + 8);

    const radInPx = (radiusInKm * 1000) / metersPerPixel;
    // if (radInPx !== radiusInPixel) {
    //   setRadiusInPixel(radInPx);
    // }
    radiusInPixel = radInPx;

    return radInPx;
  };

  const handleMapSnapshot = async () => {
    if (loading || !markerCoordinates) return;
    // console.log("Snapshot initiated with coordinates:", markerCoordinates);
    setPreviewUrl(null);
    setLoading(true);
    try {
      const { latitude: lat, longitude: lng } = markerCoordinates;
      console.log("Lat:", lat, "Lng:", lng);

      const emptyUrl = "https://i.ibb.co.com/7z5rh5g/empty-marker.png";
      const { blob } = await getGoogleMapSnapshotBlob(
        lat,
        lng,
        16,
        "600x600",
        2,
        "roadmap",
        emptyUrl
      );

      const formData = new FormData();
      formData.append("file", blob, `${nanoid(8)}.jpg`);
      const { data: cloudinary } = await propexAPI.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = cloudinary?.uploadedFile?.secure_url;

      const payload = {
        mapImageUrl: imageUrl,
        userMintId: nftId,
        radiusInPixels: radiusInPixel,
      };

      console.log(payload);

      const { data } = await propexAPI.post(
        "/nft/expand-territory/generate-image",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setPreviewUrl(data.data.imageUrl);

      console.log("previewImageUrl: ", previewUrl);
    } catch (err) {
      toast.error("Error getting map snapshot, going back");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    handleMapSnapshot();
    if (!loading) {
      setIsOpen(true);
    }
  };

  console.log({
    markerCoordinates,
  });

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (isMapLoaded && markerCoordinates) {
      // Set map ref latitude and longitude
      console.log("Fly to", markerCoordinates);
      mapRef.current.flyTo({
        center: [markerCoordinates.longitude, markerCoordinates.latitude],
        zoom: zoomScale,
        duration: 2000,
      });
    }
  }, [isMapLoaded, markerCoordinates]);

  return (
    <div>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: markerCoordinates ? markerCoordinates.latitude : -8.6725048,
          longitude: markerCoordinates
            ? markerCoordinates.longitude
            : 115.1418715,
          zoom: zoomScale,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onZoom={(e) => handlerZoom(e.viewState.zoom)}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={() => {
          setIsMapLoaded(true);
        }}
      >
        <NavigationControl position="top-right" />
        <ScaleControl />
        <Source
          id="my-data"
          type="geojson"
          data={
            markerCoordinates
              ? {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [
                          markerCoordinates.longitude,
                          markerCoordinates.latitude,
                        ],
                      },
                    },
                  ],
                }
              : { type: "FeatureCollection", features: [] }
          }
        >
          {markerCoordinates && (
            <Marker
              longitude={markerCoordinates.longitude}
              latitude={markerCoordinates.latitude}
              offsetLeft={-20}
              offsetTop={-10}
            />
          )}
          <Layer
            id="point"
            type="circle"
            source="my-data"
            paint={{
              "circle-radius": calculatePixelRadius(radiusScale),
              "circle-color": "#007cbf",
              "circle-opacity": 0.3,
            }}
          />
        </Source>
        <ScaleControl />
      </Map>

      <div className="absolute bottom-0 md:bottom-10 left-0 right-0 z-10 bg-white flex mx-auto w-full max-w-[100vw] rounded-b-none md:rounded-b-lg md:max-w-[80vw] flex-col xl:flex-row text-black h-34 rounded-lg">
        <div className="flex flex-col px-6 py-6 gap-3 max-w-[400px] w-full h-full items-start justify-center">
          <p className="font-semibold text-2xl">Expand Your Territory</p>
          <div className="flex gap-2">
            <MapPin size={22} className="text-gray-400" />
            <p className="text-xs text-gray-400 w-full">
              {data?.mintDetailsData?.mapsAddress}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full h-full gap-4 px-4 py-4 justify-between items-end">
          <Slider
            size="md"
            showTooltip={true}
            aria-label="slider"
            step={0.01}
            maxValue={1}
            minValue={0.1}
            value={radiusScale}
            onChange={handleSliderChange}
            marks={[
              { value: 0.1, label: "100m" },
              { value: 0.5, label: "500m" },
              { value: 1, label: "1km" },
            ]}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-end w-full pb-2 text-[#05C1C7]">
              <p className="text-end self-end font-semibold">Buy Prop Token</p>
              <ArrowRight />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center border-black/30 px-4 h-[54px] w-fit border rounded">
                <input
                  className="border-none min-w-[60px] md:min-w-[100px] outline-none w-full text-left"
                  type="text"
                  value={propTokens}
                  onChange={handlePropTokenChange}
                />
                <span className="">PROP</span>
              </div>
              <button
                onClick={() => handleContinue()}
                className={cnm(
                  "w-full bg-mossgreen text-lemongrass rounded-lg h-[54px] px-6 font-semibold flex items-center justify-center hover:bg-mossgreen/90",
                  "disabled:bg-neutral-100 disabled:text-neutral-400"
                )}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="absolute flex gap-2 top-4 left-4 bg-white text-black items-center font-medium px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Dialog (Modal) */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-lg space-y-2 border bg-white rounded-xl"
          >
            <div className="w-full px-4 pt-4">
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>
            <hr className="border-t border-gray-200" />
            <div className="px-6 py-6 space-y-2">
              <DialogTitle className="font-bold">
                Confirm Your Territory Expansion
              </DialogTitle>
              <Description>
                You are about to stake PROP tokens to expand your territory.
                Please review the details below
              </Description>
              <div className="relative h-full w-full flex justify-center items-center rounded-xl overflow-hidden aspect-[2/1]">
                {loading && !previewUrl ? (
                  <Skeleton className="w-full h-[240px]" />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="maps-card-nft"
                    width={480}
                    height={240}
                    className="object-cover"
                    onLoad={() => {
                      URL.revokeObjectURL(previewUrl);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="mt-4 space-y-4 px-4 pb-4">
              <Input
                type="text"
                label="Name your territory"
                labelPlacement="outside"
                placeholder="Territory name"
                variant="bordered"
                onChange={(e) => setTerritoryName(e.target.value)}
              />
              <Card
                shadow="none"
                classNames={{
                  base: "border-black/30 border",
                }}
              >
                <CardBody className="space-y-2">
                  <div className="flex w-full justify-between">
                    <p className="text-sm text-gray-400">
                      New Territory Radius
                    </p>
                    <p className="text-sm text-gray-400 font-semibold">
                      {radiusScale * 1000} meters
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm text-slate-900 font-bold">
                      Staking Amount
                    </p>
                    <div className="flex flex-col gap-2 items-end">
                      <p className="text-sm text-slate-900 font-bold">
                        {propTokens} PROP
                      </p>
                      <p className="text-xs text-cyan-400">
                        You will get 70 Points
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex w-full gap-3 px-4 pb-4">
              <button
                onClick={() => setIsOpen(false)}
                className={cnm(
                  "w-full bg-inherit text-black rounded-lg h-[54px] px-6 font-semibold flex items-center justify-center hover:bg-gray-100 border border-black/30",
                  "disabled:bg-neutral-100 disabled:text-neutral-400"
                )}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStake()}
                className={cnm(
                  "w-full bg-mossgreen text-lemongrass rounded-lg h-[54px] px-6 font-semibold flex items-center justify-center hover:bg-mossgreen/90",
                  "disabled:bg-neutral-100 disabled:text-neutral-400"
                )}
              >
                Stake now
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={isSuccess}
        onClose={() => router.push(`/details/${nftId}`)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-lg space-y-2 border bg-white rounded-xl"
          >
            <div className="w-full px-4 pt-4">
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>
            <hr className="border-t border-gray-200" />
            <div className="px-6 py-6 space-y-2 flex flex-col items-center">
              <DialogTitle className="font-bold">
                Congrats, your territory expanded!
              </DialogTitle>
              <Description className="space-y-10 flex flex-col items-center">
                <p>You can name your territory and make it your own</p>
                <p className="text-sm font-semibold text-center">
                  {data?.mintDetailsData?.mapsAddress}
                </p>
              </Description>
              <div className="relative h-full w-full flex justify-center items-center rounded-xl overflow-hidden aspect-[2/1]">
                {loading && !previewUrl ? (
                  <Skeleton className="w-[480px] h-[240px]" />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="maps-card-nft"
                    width={480}
                    height={240}
                    className="object-cover"
                    onLoad={() => {
                      URL.revokeObjectURL(previewUrl);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex w-full gap-3 px-4 pb-4">
              <button
                onClick={() => router.push(`/details/${nftId}`)}
                className={cnm(
                  "w-full bg-inherit text-black rounded-lg h-[54px] px-6 font-semibold flex items-center justify-center hover:bg-gray-100 border border-black/30",
                  "disabled:bg-neutral-100 disabled:text-neutral-400"
                )}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ExpandPage;
