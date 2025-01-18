/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import Map, { Marker, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AddressMarker from "@/assets/dashboard/address-map-marker.svg";
import useSWR from "swr";
import { propexAPI } from "../_api/propex";
import { Skeleton } from "@nextui-org/react";
import Spinner from "../_components/elements/Spinner";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useMemo, useState } from "react";
import { ImageOff, X } from "lucide-react";
import dayjs from "dayjs";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../_components/ui/ResizeablePanel";
import { useMediaQuery } from "@uidotdev/usehooks";
import { nanoid } from "nanoid";
import Image from "next/image";

dayjs.extend(isTomorrow);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Token2049() {
  const isDesktop = useMediaQuery("(min-width : 1024px)");
  const { data, isLoading } = useSWR(
    "/luma/events/token2049-singapore",
    async (url) => {
      const { data } = await propexAPI.get(url);
      return data;
    }
  );

  const [currentLatLng, setCurrentLatLng] = useState(null);

  const [refreshMapKey, setRefreshMapKey] = useState(nanoid(2));

  return (
    <div className="w-full h-full bg-white text-black">
      {isDesktop ? (
        <ResizablePanelGroup
          direction={"horizontal"}
          className="h-full flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden"
        >
          <ResizablePanel defaultSize={50} minSize={20} collapsible>
            <div className="w-full h-80 lg:flex-1 lg:h-full">
              {isLoading ? (
                <Skeleton className="w-full h-full bg-neutral-200" />
              ) : (
                <Mapbox
                  events={data?.sideEvents}
                  setCurrentLatLng={setCurrentLatLng}
                  currentLatLng={currentLatLng}
                  refreshMapKey={refreshMapKey}
                />
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            onDragging={() => {
              setRefreshMapKey(nanoid(2));
            }}
          />
          <ResizablePanel
            defaultSize={50}
            minSize={40}
            style={{
              overflow: "visible",
            }}
          >
            <div className="flex-1 lg:h-full overflow-y-auto lg:overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Spinner className="text-lemongrass-50 fill-mossgreen" />
                </div>
              ) : (
                <EventList
                  events={data?.sideEvents}
                  currentLatLng={currentLatLng}
                  setCurrentLatLng={setCurrentLatLng}
                />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="w-full h-full overflow-y-auto">
          <div className="w-full h-80">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-neutral-200" />
            ) : (
              <Mapbox
                events={data?.sideEvents}
                setCurrentLatLng={setCurrentLatLng}
                currentLatLng={currentLatLng}
              />
            )}
          </div>

          <div className="">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center min-h-80">
                <Spinner className="text-lemongrass-50 fill-mossgreen" />
              </div>
            ) : (
              <EventList
                events={data?.sideEvents}
                currentLatLng={currentLatLng}
                setCurrentLatLng={setCurrentLatLng}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EventList({ events, currentLatLng, setCurrentLatLng }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = useDebounceCallback((event) => {
    setSearchQuery(event.target.value);
  }, 300);

  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  }

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (currentLatLng) {
      filtered = filtered.filter(
        (event) =>
          event.lat === currentLatLng.lat && event.lng === currentLatLng.lng
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [events, searchQuery, currentLatLng]);

  const selectedEvent = events?.find(
    (event) =>
      currentLatLng &&
      event.lat === currentLatLng.lat &&
      event.lng === currentLatLng.lng
  );

  const formatEventDate = (date, timezone) => {
    const eventDate = dayjs(date).tz(timezone);
    if (eventDate.isTomorrow()) {
      return `Tomorrow, ${eventDate.format("h:mm A")}`;
    }
    return eventDate.format("MMMM D, h:mm A");
  };

  const handleMintClick = (address, placeId) => {
    const encodedAddress = encodeURIComponent(address);
    // const encodedPlaceId = encodeURIComponent(placeId);
    router.push(
      `/tier-one?address=${encodedAddress}&placeId=${placeId}&isBypass=true`
    );
  };

  return (
    <div className="w-full flex flex-col lg:h-full -mt-8 lg:mt-0 relative">
      <div className="w-full px-3 py-3 sticky top-0 z-[50]">
        <div className="w-full border rounded-lg bg-white">
          <input
            placeholder="Search location"
            className="bg-transparent w-full outline-none px-3 py-3"
            value={searchValue}
            onChange={(e) => {
              handleSearchChange(e)
              handleSearchValueChange(e)
            }}
          />

          {searchQuery ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearchQuery(""); 
                setSearchValue("")
              }}
              className="flex absolute right-4 top-1/2 -translate-y-1/2 w-auto bg-white z-22 px-3"
            >
              <X className="size-5" />
            </button>
          ) : (
            <div className="flex absolute right-4 top-1/2 -translate-y-1/2 w-auto bg-white z-20 px-3">
              <img
                src="/assets/icons/search.svg"
                alt="search-icon"
                className="w-5 h-5"
              />
            </div>
          )}
        </div>
      </div>
      {/* Display selected event name */}
      {selectedEvent && (
        <div className="w-full px-3 pb-3">
          <div className="px-3 py-2 flex items-center justify-between rounded-md w-full bg-neutral-100">
            <p className="text-sm font-medium">
              {selectedEvent.addressInfo.address || ""}
            </p>
            <button
              onClick={() => setCurrentLatLng(null)}
              className="font-semibold"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
      <div id="event-list" className="flex-1 w-full lg:overflow-y-auto">
        {filteredEvents.length > 0 ? filteredEvents.map((event) => (
          <div key={event.id} className="flex p-3 gap-3">
            <div className="size-28 rounded-lg bg-neutral-200 overflow-hidden flex items-center justify-center">
              {event.coverUrl ? (
                <img
                  src={event.coverUrl}
                  alt={event.name}
                  height={112}
                  width={112}
                />
              ) : (
                <ImageOff className="size-6" />
              )}
            </div>
            <div className="flex flex-col items-start flex-1 justify-between w-full">
              <div className="flex flex-col lg:flex-row items-start gap-2 w-full">
                <p className="text-xs max-w-[280px]">{event.name}</p>
                <p className="text-[10px] text-neutral-400 font-medium mt-[2px] lg:ml-auto">
                  {formatEventDate(event.startedAt, event.timezone)}
                </p>
              </div>
              <div className="mt-3">
                {event.addressInfo.full_address && (
                  <div className="bg-[#F6FFDC] px-2 py-1 flex items-center gap-1.5 w-full rounded-lg">
                    <AddressMarker className="w-5 shrink-0" />
                    <p className="text-semibold text-[10px]">
                      {event.addressInfo.full_address}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 w-full lg:w-auto">
                <a
                  href={`https://lu.ma/${event.url}`}
                  target="_blank"
                  className="flex-1 lg:flex-auto px-4 py-2 bg-white border text-[10px] font-semibold rounded-lg hover:bg-neutral-100 text-mossgreen flex items-center justify-center"
                >
                  Event Details
                </a>
                <button
                  onClick={() =>
                    handleMintClick(
                      event.addressInfo.full_address ||
                        event.addressInfo.address,
                      event.addressInfo.place_id
                    )
                  }
                  disabled={event.isMinted}
                  className="flex-1 lg:flex-auto px-4 py-2 bg-mossgreen text-lemongrass text-[10px] font-semibold rounded-lg hover:bg-mossgreen/90 flex items-center justify-center disabled:bg-neutral-100 disabled:text-black"
                >
                  {event.isMinted ? "Minted" : "Mint Location"}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="w-full flex items-center justify-center min-h-[80vh] text-black">
            <div className="relative mt-2 size-80 mr-2">
              <Image
                src={"/assets/images/no-location-found-icon.png"}
                alt="maps-card-nft"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Mapbox({ events, setCurrentLatLng, currentLatLng, refreshMapKey }) {
  const [mapCenter, setMapCenter] = useState({
    lng: events?.[0]?.lng || 0,
    lat: events?.[0]?.lat || 0,
  });

  useEffect(() => {
    if (currentLatLng) {
      setMapCenter({
        lng: currentLatLng.lng,
        lat: currentLatLng.lat,
      });
    } else if (events?.[0]) {
      setMapCenter({
        lng: events[0].lng,
        lat: events[0].lat,
      });
    }
  }, [currentLatLng, events]);

  const coordinates = events.map((event) => {
    return {
      lat: event.lat,
      lng: event.lng,
    };
  });
  if (coordinates.length === 0 || !coordinates) return null;
  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: events?.[0]?.lng || 0,
          latitude: events?.[0]?.lat || 0,
          zoom: 9,
        }}
        key={refreshMapKey}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        {coordinates.map(({ lat, lng }, index) => (
          <MarkerButton
            key={index}
            lat={lat}
            lng={lng}
            currentLatLng={currentLatLng}
            setCurrentLatLng={setCurrentLatLng}
          />
        ))}
      </Map>
    </div>
  );
}

function MarkerButton({ lat, lng, currentLatLng, setCurrentLatLng }) {
  const { current: map } = useMap();

  const onClick = () => {
    setCurrentLatLng({ lat, lng });
  };

  useEffect(() => {
    if (currentLatLng) {
      map.flyTo({
        center: [currentLatLng.lng, currentLatLng.lat],
        zoom: 11,
      });
    }
  }, [currentLatLng]);

  return (
    <Marker longitude={lng} latitude={lat} anchor="bottom" onClick={onClick}>
      <div
        className={`relative w-9 h-9 flex items-center justify-center ${
          currentLatLng &&
          currentLatLng.lat === lat &&
          currentLatLng.lng === lng
            ? "border-2 border-blue-500 rounded-full"
            : ""
        }`}
      >
        <AddressMarker className="size-8" />
      </div>
    </Marker>
  );
}
