import { atom } from "jotai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const isGoogleMapsReadyAtom = atom(false);

const initialCenter = {
  lat: -8.65557586023694,
  lng: 115.13084025011631,
};

const initialState = {
  mintedId: "",
  mapsAddress: "",
  buildingDetail: "",
  placeId: "",
  description: "",
  txHash: "",
  points: 0,
  pointsActivity: [],
  selectedPosition: initialCenter,
  prevPosition: initialCenter,
  mapsCenter: initialCenter,
  userRole: "",
  imageUrl: "",
  previewUrl: "",
  marketValue: 0,
  validity: "1-month",
  radiusInPixel: 0,
  districtID:0,
};

/**
 * @typedef {Object} PointsActivity
 * @property {string} name
 * @property {string} slug
 * @property {number} pointsAdded
 */

/**
 * @typedef {Object} MapStore
 * @property {string} mintedId
 * @property {string} mapsAddress
 * @property {string} buildingDetail
 * @property {string} placeId
 * @property {string} description
 * @property {number} points
 * @property {PointsActivity[]} pointsActivity
 * @property {{ lat: number, lng: number }} selectedPosition
 * @property {{ lat: number, lng: number }} prevPosition
 * @property {{ lat: number, lng: number }} mapsCenter
 * @property {string} userRole
 * @property {number} marketValue
 * @property {string} imageUrl
 * @property {string} previewUrl
 * @property {string} validity
 * @property {number} radiusInPixel
 * @property {number} districtID
 * @property {(mapsAddress: string) => void} setMapsAddress
 * @property {(buildingDetail: string) => void} setBuildingDetail
 * @property {(placeId: string) => void} setPlaceId
 * @property {(description: string) => void} setDescription
 * @property {(points: number) => void} setPoints
 * @property {(selectedPosition: { lat: number, lng: number }) => void} setSelectedPosition
 * @property {(prevPosition: { lat: number, lng: number }) => void} setPrevPosition
 * @property {(mapsCenter: { lat: number, lng: number }) => void} setMapsCenter
 * @property {(userRole: string) => void} setUserRole
 * @property {(marketValue: number) => void} setMarketValue
 * @property {(imageUrl: string) => void} setImageUrl
 * @property {(previewUrl: previewUrl) => void} setPreviewUrl
 * @property {(validity: validity) => void} setValidity
 * @property {(mintedId: mintedId) => void} setMintedId
 * @property {(radiusInPixel: number) => void} setRadiusInPixel
 * @property {(districtID: districtID) => void} setDistrictID
 * @property {() => void} reset
 *
 * @property {(name: string, slug: string, pointsAdded: number) => void} addPointsActivity
 * @property {(slug: string) => void} removePointsActivity
 */

/**
 * @type {import("zustand").UseBoundStore<import("zustand").StoreApi<MapStore>>}
 */
export const useMapStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      setMapsAddress: (mapsAddress) => set({ mapsAddress }),
      setBuildingDetail: (buildingDetail) => set({ buildingDetail }),
      setPlaceId: (placeId) => set({ placeId }),
      setTxHash: (txHash) => set({ txHash }),
      setDescription: (description) => set({ description }),
      setPoints: (points) => set({ points }),
      setSelectedPosition: (selectedPosition) => set({ selectedPosition }),
      setPrevPosition: (prevPosition) => set({ prevPosition }),
      setMapsCenter: (mapsCenter) => set({ mapsCenter }),
      setUserRole: (userRole) => set({ userRole }),
      setMarketValue: (marketValue) => set({ marketValue }),
      setImageUrl: (imageUrl) => set({ imageUrl }),
      setPreviewUrl: (previewUrl) => set({ previewUrl }),
      setValidity: (validity) => set({ validity }),
      setMintedId: (mintedId) => set({ mintedId }),
      setRadiusInPixel: (radiusInPixel) => set({ radiusInPixel }),
      setDistrictID: (districtID) => set({ districtID }),

      addPointsActivity: (name, slug, pointsAdded) => {
        const pointsActivity = get().pointsActivity;
        const activityExists = pointsActivity.some(
          (activity) => activity.slug === slug
        );
        if (!activityExists) {
          set({
            pointsActivity: [...pointsActivity, { name, slug, pointsAdded }],
            points: get().points + pointsAdded,
          });
        }
      },
      removePointsActivity: (slug) => {
        const pointsActivity = get().pointsActivity;
        const activity = pointsActivity.find(
          (activity) => activity.slug === slug
        );
        if (activity) {
          set({
            pointsActivity: pointsActivity.filter(
              (activity) => activity.slug !== slug
            ),
            points: get().points - activity.pointsAdded,
          });
        }
      },
      reset: () => set({ ...initialState }),
    }),
    {
      name: "maps-store",
    }
  )
);
