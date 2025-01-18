import { atom } from "jotai";
import { atomWithReset, atomWithStorage } from "jotai/utils";

/**
 * @typedef {{ url: string, public_id: string }} ImageData
 * @typedef {{ url: string, description: string, sellingPrice: string }} rwaCardDetail
 * @typedef {{ propertyType: string, furnishingType: string, propertyDescription: string, landArea: string, buildingSize: string, numberOfBedrooms: string, numberOfBathrooms: string, startDateOfLease: string, endDateOfLease: string, sellingPrice: string, amenities: string[], thumbnail: ImageData, images: ImageData[] }} PropertyForm
 * @typedef {{ documentType: string, documentPdf: ImageData, spptPBB: ImageData, ownerIdentityCard: ImageData, ownerFamilyCard: ImageData, ownerType: string, ownerName: string, ownerEmail: string, ownerPhoneNumber: string }} OwnershipForm
 * @typedef { 'landingPage' | 'ownershipForm' | 'propertyForm' | 'minting-process' } FormStep
 */

/**
 * @type { import('jotai').Atom<FormStep>}
 * @type { import('jotai').Atom<rwaCardDetail>}
 */
export const formStepAtom = atomWithStorage('formStepAtom', 'landingPage');
export const rwaCardDetailAtom = atomWithStorage('rwaCardDetailAtom', '');

export const formModalOpenAtom = atom(false);

export const nftModalOpenAtom = atom(false);

/**
 * @type { import('jotai').Atom<PropertyForm> }
 */
export const propertyForm = atomWithStorage('propertyForm', {
    propertyType: "",
    furnishingType: "",
    propertyDescription: "",
    landArea: "",
    buildingSize: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    startDateOfLease: "",
    endDateOfLease: "",
    sellingPrice: "",
    amenities: [],
    thumbnail: {
      url: "",
      public_id: ""
    },
    images: []
});

/**
 * @type { import('jotai').Atom<number> }
 */
export const propertyFormPoint = atomWithStorage('propertyFormPoint', 0);

/**
 * @type { import('jotai').Atom<string[]> }
 */
export const formAddedPoint = atomWithStorage('formAddedPoint', []);

/**
 * @type { import('jotai').Atom<boolean> }
 */
export const userHasStartedRWAForm = atomWithStorage('userHasStartedRWAForm', true);

/**
 * @type { import('jotai').Atom<OwnershipForm> }
 */

export const ownershipForm = atomWithStorage('ownershipForm', {
    documentType: "",
    documentPdf: {
      url: "",
      public_id: ""
    },
    spptPBB: {
      url: "",
      public_id: ""
    },
    ownerIdentityCard: {
      url: "",
      public_id: ""
    },
    ownerFamilyCard: {
      url: "",
      public_id: ""
    },
    ownerType: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
});

/**
 * @typedef {Object} Amenity
 * @property {number} id 
 * @property {string} name
 * @property {string} src 
 * @property {boolean} selected
 */

/**
 * @typedef {Amenity[]} AmenitiesOption
 */

export const amenitiesOptionAtom = atomWithStorage('amenities-option', /** @type {AmenitiesOption} */ ([
  {
    id: 1,
    name: 'Private Pool',
    src: '/assets/icons/amenities/pool-ladder.svg',
    selected: false,
  },
  {
    id: 2,
    name: 'Shared Pool',
    src: '/assets/icons/amenities/shared-pool.svg',
    selected: false,
  },
  {
    id: 3,
    name: 'Kitchen',
    src: '/assets/icons/amenities/kitchen.svg',
    selected: false,
  },
  {
    id: 4,
    name: 'Carport',
    src: '/assets/icons/amenities/carport.svg',
    selected: false,
  },
  {
    id: 5,
    name: 'Garage',
    src: '/assets/icons/amenities/garage.svg',
    selected: false,
  },
  {
    id: 6,
    name: 'Bathtub',
    src: '/assets/icons/amenities/bathtub.svg',
    selected: false,
  },
  {
    id: 7,
    name: 'Shower',
    src: '/assets/icons/amenities/shower.svg',
    selected: false,
  },
  {
    id: 8,
    name: 'Jacuzzi',
    src: '/assets/icons/amenities/jacuzzi.svg',
    selected: false,
  },
  {
    id: 9,
    name: '24H Security',
    src: '/assets/icons/amenities/24-hours-protection.svg',
    selected: false,
  },
  {
    id: 10,
    name: 'CCTV',
    src: '/assets/icons/amenities/cctv.svg',
    selected: false,
  },
  {
    id: 11,
    name: 'Laundry',
    src: '/assets/icons/amenities/laundry.svg',
    selected: false,
  },
  {
    id: 12,
    name: 'Smart TV',
    src: '/assets/icons/amenities/smart-tv.svg',
    selected: false,
  }
]));



