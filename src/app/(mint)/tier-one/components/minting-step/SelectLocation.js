/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CoolInputPoints from "@/app/(mint)/_components/input/CoolInputPoints";
import WhatIsNFTModal from "@/app/(mint)/_components/WhatIsNFTModal";
import { useMapStore } from "@/app/(mint)/_store/maps-store";
import SvgIcon from "@/app/_components/utils/SvgIcon";
import { cnm } from "@/utils/style";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useAtom } from "jotai";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { SvgMarkerBase64 } from "../../misc/maps";
import Spinner from "@/app/(mint)/_components/elements/Spinner";

import { mintingStepAtom } from "@/app/(mint)/_store/mint-store";
import { MintingStepEnum } from "../../constants/mint";
import AnimPointsCapsule from "../AnimPointsCapsule";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Locate, X } from "lucide-react";
import { showTierOneMapTourAtom } from "@/app/(mint)/_store/guide-store";
import { useGuidedTour } from "@/app/(mint)/_hooks/useGuidedTour";
import { atomWithStorage } from "jotai/utils";
import Lottie from "lottie-react";
import BlueHouseLottie from "@/assets/animations/blue-house.json";
import { useSearchParams } from "next/navigation";
import { useGeolocation } from "@uidotdev/usehooks";
import axios from "axios";
import { electroneum } from "viem/chains";

export default function SelectLocation({ isTransitioning }) {
  return (
    <div className="w-full flex flex-col items-center h-full">
      <MapCard isTransitioning={isTransitioning} />
    </div>
  );
}

// _______ MAPS _________ //
const mapStyles = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "all",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "all",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

export const isTitleOpenAtom = atomWithStorage("showTitleTierOne", true);

function MapCard({ isTransitioning }) {
  const searchQuery = useSearchParams();
  const addressQuery = searchQuery.get("address");
  const placeIdQuery = searchQuery.get("placeId");

  const { ready, value, setValue, suggestions, clearSuggestions } =
    usePlacesAutocomplete();
  const {
    status,
    data: suggestionData,
    loading: suggestionLoading,
  } = suggestions;
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTitleOpen, setTitleOpen] = useAtom(isTitleOpenAtom);
  const [isLiveLocationEnabled, setIsLiveLocationEnabled] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  const mapsAddress = useMapStore((state) => state.mapsAddress);
  const buildingDetail = useMapStore((state) => state.buildingDetail);
  const points = useMapStore((state) => state.points);
  const selectedPosition = useMapStore((state) => state.selectedPosition);
  const mapsCenter = useMapStore((state) => state.mapsCenter);

  const setMapsAddress = useMapStore((state) => state.setMapsAddress);
  const setBuildingDetail = useMapStore((state) => state.setBuildingDetail);
  const placeId = useMapStore((state) => state.placeId);
  const setPlaceId = useMapStore((state) => state.setPlaceId);
  const setDescription = useMapStore((state) => state.setDescription);
  const setSelectedPosition = useMapStore((state) => state.setSelectedPosition);
  const setMapsCenter = useMapStore((state) => state.setMapsCenter);
  const addPointsActivity = useMapStore((state) => state.addPointsActivity);
  const removePointsActivity = useMapStore(
    (state) => state.removePointsActivity
  );
  const districID = useMapStore((state) => state.districtID);
  const setDistrictID = useMapStore((state) => state.setDistrictID);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [_map, setMap] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(14);

  const [, setMintingStep] = useAtom(mintingStepAtom);

  const reverseGeocode = async ({ lat, lng }) => {
    setLoading(true);
    try {
      const results = await getGeocode({ location: { lat, lng } });
      let address = results[0].formatted_address;
      const placeId = results[0].place_id;
      const description = address.split(",")[0];

      setDescription(description);
      setPlaceId(placeId);
      setMapsAddress(address);
      setValue(address, false);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      toast.error("Failed to retrieve the address");
    } finally {
      setLoading(false);
      setFocus(false);
    }
  };

  const handleMapClick = (event) => {
    const clickedLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedPosition(clickedLatLng);
    if (zoomLevel <= 13) {
      setMapsCenter(clickedLatLng);
      setZoomLevel(14);
    }
    reverseGeocode(clickedLatLng);
  };

  const handleMarkerDragEnd = (event) => {
    const newLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedPosition(newLatLng);
    reverseGeocode(newLatLng);
  };

  const handleSelect = async (item) => {
    if (!item) return;
    const { address, placeName } = item;
    setMapsAddress(address);
    setValue(address, false);
    clearSuggestions();

    setLoading(true);
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const placeId = results[0].place_id;

      setPlaceId(placeId);
      setDescription(placeName);
      setSelectedPosition({ lat, lng });
      setMapsCenter({ lat, lng });
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to retrieve the location");
    } finally {
      setLoading(false);
      setFocus(false);
    }
  };

  const handleZoomChanged = () => {
    if (_map) {
      const newZoomLevel = _map.getZoom();
      setZoomLevel(newZoomLevel);
    }
  };

  const handleAddressInputChange = (e) => {
    const value = e.target.value;
    setMapsAddress(value);

    if (value.trim() === "") {
      setValue("", false);
      clearSuggestions();
      return;
    }

    setValue(value);
  };

  function handleBuildingInputChange(e) {
    const value = e.target.value;
    setBuildingDetail(value);
  }

  function handleSubmit() {
    if (!mapsAddress) {
      return toast.error("Pick your location first before continue");
    }
    if (isPlaceMinted) {
      return toast.error("This place already been minted! Another place select!");
    }
    setMintingStep(MintingStepEnum["select-role"]);
  }

  const handleGetRecommendedPlaces = async ({ lat, lng }) => {
    try {
      setRecommendedLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/places/recommended?latitude=${lat}&longitude=${lng}`
      );

      if (data.recommendedPlaces) {
        setRecommendedLoading(false);
        setRecommendedPlaces(data.recommendedPlaces);
        console.log("places: ", recommendedPlaces);
      }
    } catch (error) {
      toast.error(
        "Please enable your location to get recommended places by us"
      );
    }
  };

  const onGoogleMapLoad = useCallback(async (map) => {
    if (_map) return;
    setMap(map);

    map.data.loadGeoJson('../assets/data/secondlayer.json');

    // "Wait" until GeoJSON is loaded (create a custom promise)
    await new Promise((resolve) => {
      const geoJsonLoadedListener = map.data.addListener('addfeature', () => {
        // Once GeoJSON features are loaded, resolve the promise
        google.maps.event.removeListener(geoJsonLoadedListener);  // Remove listener after it triggers
        resolve();
      });
    });

    map.data.setStyle({
      fillColor: "grey",
      fillOpacity: 0.1,
      strokeColor: "grey",
      strokeWeight: 0.1,
    });

    let districtOwnedInfo;

    try {
      const res = await propexAPI.get("/places/getAlldistrictInfo");
      districtOwnedInfo = res.data.districtOwnedlist;
    } catch (error) {
      toast.error("Error!");
    }

    // if (districtOwnedInfo && districtOwnedInfo.length > 0) {
    //   districtOwnedInfo.forEach((element) => {
    //     const id = element.districtid;

    //     map.data.forEach((feature) => {
    //       if (feature.getProperty("id") === id) {
    //         const geometry = feature.getGeometry();
    //         if (geometry.getType() === 'Polygon') {
    //           const coordinates = geometry.getArray();

    //           const corner1 = coordinates[0].getAt(0);  // First corner
    //           const corner2 = coordinates[0].getAt(2);  // Opposite corner (diagonally opposite)

    //           // Calculate the centroid of the rectangle by averaging the latitudes and longitudes of the two corners
    //           const centroidLat = (corner1.lat() + corner2.lat()) / 2;
    //           const centroidLng = (corner1.lng() + corner2.lng()) / 2;

    //           // The center (centroid) of the rectangle
    //           const center = new google.maps.LatLng(centroidLat, centroidLng);
    //           new google.maps.Marker({
    //             position: center,
    //             map: map,
    //             icon: {
    //               url: "../assets/data/OwnedMark.png",  // Path to your PNG icon file
    //               scaledSize: new google.maps.Size(40, 40),
    //             },
    //           });
    //         }
    //       }

    //     });

    //   });
    // }
    let currentMarker = null; // Variable to hold the current marker
    let infoWindow = null;
    map.data.addListener('mouseover', function (event) {
      map.data.revertStyle();
      map.data.overrideStyle(event.feature, { fillOpacity: 0.3 });
      const feature = event.feature;
      districtOwnedInfo.forEach((element) => {
        const id = element.districtid;
        const address = element.userid;
        const disttoken = element.uidtoken;
        if (feature.getProperty("id") === id) {
          const geometry = feature.getGeometry();
          if (geometry.getType() === 'Polygon') {
            const coordinates = geometry.getArray();

            const corner1 = coordinates[0].getAt(0);  // First corner
            const corner2 = coordinates[0].getAt(2);  // Opposite corner (diagonally opposite)

            // Calculate the centroid of the rectangle by averaging the latitudes and longitudes of the two corners
            const centroidLat = (corner1.lat() + corner2.lat()) / 2;
            const centroidLng = (corner1.lng() + corner2.lng()) / 2;

            // The center (centroid) of the rectangle
            const center = new google.maps.LatLng(centroidLat, centroidLng);
            currentMarker = new google.maps.Marker({
              position: center,
              map: map,
              icon: {
                url: "../assets/data/OwnedMark.png",  // Path to your PNG icon file
                scaledSize: new google.maps.Size(80, 30),
              },
            });
            infoWindow = new google.maps.InfoWindow({
              content: `
                        <div class="info-window">
                            <h3>District Information</h3>
                            <p><strong>District Number : </strong> ${id}</p>
                            <p><strong>Owner :</strong> ${address}</p>
                            <p><strong>District UUID : </strong> ${disttoken}</p>
                        </div>
                    `,
            });
            currentMarker.addListener('click', function () {
              infoWindow.setPosition(center);
              infoWindow.open(map);
            });
          }
        }
      });
    });

    map.data.addListener("click", function (event) {

      const feature = event.feature;
      const id = feature.getProperty("id");
      if (currentMarker) {

        setIsDistrictMinted(true);
        setIsPlaceMinted(true);
      }
      else {
        setIsDistrictMinted(false);
        setIsPlaceMinted(false);
      }
      setDistrictID(id);

      const pos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      const zoom = map.getZoom();
      if (zoom <= 13) {
        setMapsCenter(pos);
        setZoomLevel(14);
      }

      handleMapClick(event);
    });

    map.data.addListener('mouseout', function (event) {
      map.data.revertStyle();
      if (currentMarker) {
        currentMarker.setMap(null); // This will hide the marker
        currentMarker = null; // Reset the marker reference
      }
      if(infoWindow){
        infoWindow.setMap(null);
        infoWindow = null;
      }
    });
  }, []);

  useEffect(() => {
    if (_map) {
      _map.addListener("zoom_changed", handleZoomChanged);
    }
  }, [_map]);

  useEffect(() => {
    if (mapsAddress) {
      addPointsActivity("Fill Location", "fill_location", 20);
    } else {
      removePointsActivity("fill_location");
    }
  }, [mapsAddress]);

  const [isPlaceMinted, setIsPlaceMinted] = useState(false);
  const [isDistrictMinted, setIsDistrictMinted] = useState(false);
  const [checkingMinted, setCheckingMinted] = useState(false);

  const handleCheckIsPlaceMinted = async (placeId) => {
    setCheckingMinted(true);
    try {
      const res = await propexAPI.get("/nft/mints/check-place-minted", {
        params: {
          placeId: placeId,
        },
      });

      setIsPlaceMinted(res.data.isMinted);
    } catch (e) {
      toast.error(e.response.data.message);
    } finally {
      setCheckingMinted(false);
    }
  };

  useEffect(() => {
    if (placeId) {
      handleCheckIsPlaceMinted(placeId);
    }
  }, [placeId]);

  const {
    loading: geoLoading,
    latitude,
    longitude,
    error: geoError,
  } = useGeolocation();

  const [enableLocation, setEnableLocation] = useState(false);
  const [locationPermitted, setLocationPermitted] = useState(true);

  const closeDialog = (enableLocation) => {
    setIsDialogOpen(false);
    if (enableLocation) {
      setEnableLocation(true);
    }
  };

  const handleEnableLocation = () => {
    if (!locationPermitted) {
      return toast.error("Location permission is disabled, please enable it");
    }
    if (!enableLocation) {
      setIsDialogOpen(true);
    } else {
      setEnableLocation(false);
    }
  };

  useEffect(() => {
    if (geoLoading) return;
    if (enableLocation) {
      const userLocation = {
        lat: latitude,
        lng: longitude,
      };
      setSelectedPosition(userLocation);
      setMapsCenter(userLocation);
      reverseGeocode(userLocation);
      handleGetRecommendedPlaces(userLocation);
    }
  }, [enableLocation, latitude, longitude, geoLoading]);

  useEffect(() => {
    if (geoError) {
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setLocationPermitted(false);
        toast.error("Location permission is disabled, please enable it");
      } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
        toast.error("Location is not available, please try again later");
      } else if (geoError.code === geoError.TIMEOUT) {
        toast.error("Location timeout, please try again later");
      } else {
        toast.error(
          geoError.message || "Live location error, please try again later"
        );
      }
    }
  }, [geoError]);

  useEffect(() => {
    if ((addressQuery, placeIdQuery)) {
      setLoading(true);
      getGeocode({
        address: addressQuery,
      })
        .then(async (results) => {
          setMapsAddress(addressQuery);
          const position = await getLatLng(results[0]);
          setSelectedPosition(position);
          setMapsCenter(position);
          setPlaceId(placeIdQuery);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [addressQuery, placeIdQuery]);

  console.log(selectedPosition);

  const [showTierOneMapTour, setShowTierOneMapTour] = useAtom(
    showTierOneMapTourAtom
  );

  const driverObj = useGuidedTour({
    onDestroyStarted() {
      setShowTierOneMapTour(false);
      driverObj.destroy();
    },
    steps: [
      {
        element: "#location-input-1", // The selector of the element
        popover: {
          title: "Location Input",
          description:
            "Type the location you want to mint. It could be any address, any Point of Interest (Eiffel Tower, Starbucks, the Statue of Liberty, etc).",
          align: "start",
          side: "bottom",
        },
      },
      {
        element: "#enable-location-2", // The selector of the element
        popover: {
          title: "Enable Location",
          description:
            "Use your live location to automatically set the minting address.",
          align: "end",
          side: "bottom",
        },
      },
      {
        element: "#live-location-status-6", // The selector of the element
        popover: {
          title: "Live Location Status",
          description: "Check whether your live location is active",
          align: "end",
          side: "bottom",
        },
      },
      {
        element: "#details-location-3", // The selector of the element
        popover: {
          title: "Floor / Unit Details",
          description:
            "Provide specific details about the building or land for minting",
          align: "end",
          side: "top",
        },
      },
      {
        element: "#total-points-4", // The selector of the element
        popover: {
          title: "Total Points",
          description: "The total points you will earn.",
          align: "end",
          side: "top",
        },
      },
      {
        element: "#next-button-5", // The selector of the element
        popover: {
          title: "Proceed to Next Step",
          description:
            "Once you've finished selecting the location, proceed to the next step.",
          align: "end",
          side: "top",
        },
      },
    ],
  });

  useLayoutEffect(() => {
    let timeout;
    if (showTierOneMapTour && !isTransitioning && !isTitleOpen) {
      timeout = setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showTierOneMapTour, isTransitioning, isTitleOpen]);

  // To fix the issue of the roles images loading too late
  const rolesImages = [
    "/assets/icons/roles/owner.webp",
    "/assets/icons/roles/renter.webp",
    "/assets/icons/roles/agent.webp",
    "/assets/icons/roles/minter.webp",
  ];

  const displayOptions = status === "OK" ? suggestionData : recommendedPlaces;

  return (
    <>
      <div className="rounded-t-lg w-full text-black h-full relative overflow-hidden">
        {/* Hidden roles images */}
        <div className="hidden">
          {rolesImages.map((src, index) => (
            <Image key={index} src={src} width={250} height={250} alt="roles" />
          ))}
        </div>

        {/* Google maps */}
        <div className="w-full h-full relative rounded-t-lg overflow-hidden">
          <GoogleMap
            zoom={10}
            center={mapsCenter}
            onClick={handleMapClick}
            mapContainerClassName="h-full outline-none w-full focus:ring-none"
            onLoad={onGoogleMapLoad}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              controlSize: 20,
              zoom: zoomLevel,
              streetViewControl: false,
            }}
          >
            <Marker
              position={selectedPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              animation={"BOUNCE"}
              icon={{
                url: SvgMarkerBase64,
                scaledSize: new window.google.maps.Size(50, 50),
                anchor: new window.google.maps.Point(25, 50),
              }}
            />
          </GoogleMap>

          <AnimatePresence mode="wait">
            {focus && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="absolute inset-0 bg-black/25 backdrop-blur-lg pointer-events-none"
              ></motion.div>
            )}
          </AnimatePresence>

          {/* Combobox input */}
          <div className="absolute w-full top-6 flex justify-center px-5 pointer-events-none">
            <div
              id="location-input-1"
              className="relative w-full max-w-lg h-12 pointer-events-auto"
            >
              <div className="relative w-full h-full">
                <Combobox
                  as="div"
                  onChange={handleSelect}
                  value={value}
                  className={"w-full flex h-full"}
                >
                  <div className="w-full h-full relative">
                    <div
                      className={cnm(
                        "relative w-full h-full border rounded-lg flex justify-between items-center overflow-hidden",
                        focus && "border-black"
                      )}
                    >
                      <div className="bg-[#F2FED1] w-full h-full absolute inset-0"></div>
                      <div className="shrink-0 flex items-center justify-center gap-0.5 px-4 h-full w-20 absolute right-0">
                        <div className="relative size-4">
                          <Image
                            src={"/assets/logo/propex-coin.png"}
                            alt="propex-coin"
                            fill
                            sizes="16px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-deepteal text-xs lg:text-sm font-semibold relative">
                          20
                        </span>
                      </div>
                      <ComboboxInput
                        value={mapsAddress}
                        onChange={handleAddressInputChange}
                        disabled={!ready}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        className={cnm(
                          `w-[calc(100%-76px)] h-full rounded-md pl-5 lg:pl-14 lg:pr-5 font-urbanist border-r -m-1 bg-white outline-none text-sm font-semibold`,
                          "transition-all",
                          focus || mapsAddress ? "w-full m-0 border-none" : ""
                        )}
                        style={{
                          zIndex: 10,
                        }}
                      />

                      {mapsAddress && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMapsAddress("");
                          }}
                          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white z-20 px-3"
                        >
                          <X className="size-5" />
                        </button>
                      )}

                      {/* Mobile loading spinner and erase button */}
                      {loading || suggestionLoading || recommendedLoading ? (
                        <div
                          className={cnm(
                            "absolute right-0 h-full items-center px-3 bg-white top-0 z-20",
                            focus
                              ? mapsAddress
                                ? "flex lg:hidden"
                                : "hidden"
                              : mapsAddress
                                ? "flex lg:hidden"
                                : "hidden"
                          )}
                        >
                          <Spinner
                            className={
                              "size-4 text-neutral-300 fill-neutral-500"
                            }
                          />
                        </div>
                      ) : (
                        <>
                          {mapsAddress && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMapsAddress("");
                              }}
                              className="flex lg:hidden absolute right-0 h-full top-0 items-center bg-white z-20 px-3"
                            >
                              <X className="size-5" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Desktop loading */}
                      <div
                        className={cnm(
                          "absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 mt-1 z-20",
                          focus
                            ? value || mapsAddress
                              ? "hidden lg:inline"
                              : "hidden lg:inline"
                            : value || mapsAddress
                              ? "hidden lg:inline"
                              : "inline"
                        )}
                      >
                        {loading || suggestionLoading ? (
                          <div>
                            <Spinner
                              className={
                                "size-4 text-neutral-300 fill-neutral-500 mb-2 ml-1"
                              }
                            />
                          </div>
                        ) : (
                          <SvgIcon
                            src={"/assets/icons/location-marker.svg"}
                            className={`size-5 bg-black font-bold`}
                          />
                        )}
                      </div>
                      {/* Loading spinner */}
                    </div>
                    <p
                      className={cnm(
                        `absolute text-sm text-black/40 bg-white transition-all rounded-full duration-300 px-2 py-0.5 z-[10] pointer-events-none`,
                        focus || value || mapsAddress
                          ? "text-[10px] -top-3.5 lg:-top-[12px] left-3 lg:left-5 border "
                          : "text-sm top-1/2 -translate-y-1/2 left-10 lg:left-11",
                        focus && "border-black"
                      )}
                    >
                      {focus
                        ? "Location"
                        : value || mapsAddress
                          ? "Location"
                          : "Enter specific location"}
                    </p>
                  </div>

                  {displayOptions && (
                    <ComboboxOptions className="absolute w-full shadow-2xl mt-1 rounded-lg border bg-white top-14 overflow-hidden max-h-72 overflow-y-auto z-[50]">
                      {displayOptions.map(
                        ({
                          placeId,
                          address,
                          name,
                          place_id,
                          description,
                          structured_formatting,
                        }) => (
                          <ComboboxOption
                            key={placeId || place_id}
                            value={{
                              placeName:
                                name || structured_formatting.main_text,
                              address: address || description,
                            }}
                            as="div"
                            className="p-4 hover:cursor-pointer hover:bg-lemongrass-100 font-urbanist"
                          >
                            <p className="font-bold text-sm">
                              {name || structured_formatting.main_text}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {address || description}
                            </p>
                          </ComboboxOption>
                        )
                      )}
                    </ComboboxOptions>
                  )}
                </Combobox>
              </div>
            </div>
          </div>

          <div className="absolute left-5 lg:left-4 top-20 lg:top-4 shadow-2xl">
            <button
              id="enable-location-2"
              onClick={handleEnableLocation}
              className="px-2.5 py-2 bg-lemongrass text-mossgreen rounded-lg text-[10px] flex items-center gap-2 hover:bg-lemongrass-500"
            >
              <Locate className="size-3" />
              {enableLocation ? "Disable Location" : "Enable Location"}
            </button>
          </div>

          <div className="absolute right-5 lg:right-4 top-20 lg:top-5 shadow-xl">
            <div
              id="live-location-status-6"
              className={cnm(
                "text-[10px]  px-3 py-1 rounded-full flex items-center gap-1.5 transition-transform ease-in-out",
                enableLocation ? "bg-lemongrass" : "bg-warning"
              )}
            >
              {enableLocation ? (
                <>
                  <div className="size-2 rounded-full bg-mossgreen relative">
                    <div className="rounded-full bg-mossgreen animate-ping absolute inset-0"></div>
                  </div>
                  Live Location
                </>
              ) : (
                <p>No Live Location</p>
              )}
            </div>
          </div>

          <div className="absolute px-5 left-0 lg:left-4 bottom-20 lg:bottom-4 w-full flex justify-center items-center pointer-events-none">
            {/* Unit/Floor Building */}
            <div className="flex flex-col lg:flex-row items-center pointer-events-auto justify-center gap-2 lg:gap-4 w-full lg:w-auto">
              <div id="total-points-4">
                <AnimPointsCapsule points={points} />
              </div>
              <div id="details-location-3" className="w-full lg:min-w-[380px]">
                <CoolInputPoints
                  name={"building-detail"}
                  rootClassname={"h-12"}
                  handleChange={handleBuildingInputChange}
                  label={"Floor / Unit Building"}
                  labelClassname={
                    "-translate-y-6 -translate-x-1 px-2 scale-[0.85] rounded-full border text-[10px]"
                  }
                  value={buildingDetail}
                  points={20}
                  onFocus={() => {
                    setFocus(true);
                  }}
                  onBlur={() => {
                    setFocus(false);
                  }}
                  activityName="Fill Detail"
                  activitySlug="fill_detail"
                />
              </div>
              <button
                id="next-button-5"
                onClick={handleSubmit}
                disabled={
                  loading || !mapsAddress || isPlaceMinted || checkingMinted || isDistrictMinted
                }
                className="h-11 w-full lg:w-auto rounded-lg overflow-hidden shrink-0 px-4 bg-black hover:bg-black/90 text-lemongrass disabled:bg-black/50 disabled:text-lemongrass/60 disabled:brightness-75 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>

          <div className="absolute bottom-56 lg:bottom-20 left-1/2 -translate-x-1/2 w-full flex justify-center">
            <AnimatePresence mode="popLayout">
              {isPlaceMinted && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="p-4 bg-warning rounded-lg w-full max-w-xs"
                >
                  <div className="text-sm text-center text-warning-800 font-medium">
                    This place has already been minted!
                  </div>
                  <div className="text-xs text-center text-warning-800">
                    Please pick another location.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* TITLE DIALOG */}
      <AnimatePresence mode="wait">
        {isTitleOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50 rounded-t-lg"
          >
            <div className="w-full py-20 max-w-[460px] bg-mossgreen rounded-xl overflow-hidden text-white flex items-center justify-center relative">
              <div className="w-full max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col items-center w-full p-6">
                  <Lottie
                    animationData={BlueHouseLottie}
                    loop={true}
                    autoplay={true}
                    className="size-48"
                  />

                  <div className="w-full flex flex-col items-center gap-1">
                    <h1 className="text-[2.5rem] font-semibold leading-none text-center">
                      MINT A<br /> LOCATION NFT
                    </h1>
                    <div className="mt-2">
                      <WhatIsNFTModal />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-12 w-full max-w-xs justify-center rounded-md border border-transparent bg-lemongrass text-mossgreen px-4 py-3 text-sm font-medium hover:bg-lemongrass-500"
                    onClick={() => setTitleOpen(false)}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live location confirmation */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          closeDialog();
        }}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
      >
        <DialogPanel className="max-w-[568px] bg-white rounded-xl overflow-hidden">
          <div className="border-b py-3 px-5 flex items-center justify-between">
            <button
              onClick={() => {
                closeDialog();
              }}
              className="flex items-center hover:opacity-90"
            >
              <SvgIcon
                src={"/assets/icons/x.svg"}
                className={"w-5 h-5 bg-black"}
              />
            </button>
            <p className="font-medium mx-auto">Enable Live Location</p>
          </div>

          <div className="w-full max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col items-center w-full p-6">
              <div className="mt-2">
                <p className="text-sm text-gray-500 max-w-md text-center text-balance">
                  Do you want to enable live location to automatically set your
                  current location on the map?
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
                  onClick={() => closeDialog(false)}
                >
                  No, thanks
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-lemongrass px-4 py-2 text-sm font-medium hover:bg-lemongrass-500"
                  onClick={() => closeDialog(true)}
                >
                  Yes, enable
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
