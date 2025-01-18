"use client";

import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AddressMarker from "@/assets/dashboard/address-map-marker.svg";
import DeedsMarker from "@/assets/dashboard/deeds-map-marker.svg";
import { ChevronDown } from "lucide-react";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";

export default function DashboardMap({ coordinates, onMarkerClick }) {
  if (coordinates.length === 0 || !coordinates) return null;
  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: coordinates[0]?.lng,
          latitude: coordinates[0]?.lat,
          zoom: 9,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        {coordinates.map(({ lat, lng, tier }, index) => (
          <Marker
            key={index}
            longitude={lng}
            latitude={lat}
            anchor="bottom"
            onClick={() => onMarkerClick(lat, lng)}
          >
            {tier === 1 ? (
              <AddressMarker className="size-10" />
            ) : (
              <DeedsMarker />
            )}
          </Marker>
        ))}
      </Map>
      {/* <div className="bg-white absolute z-10 top-5 left-5 p-4 rounded-lg text-black min-w-36 text-xs flex items-center justify-between">
        Nft Type
        <ChevronDown className="size-3" />
      </div> */}
    </div>
  );
}

function NftType() {
  return (
    <Menu>
      <MenuButton>My account</MenuButton>
      <MenuItems anchor="bottom">
        <div></div>
      </MenuItems>
    </Menu>
  );
}
