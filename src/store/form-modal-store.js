import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const formModalOpenAtom = atom(false);
export const nftModalOpenAtom = atom(false);
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
  
export const propertyFormPoint = atomWithStorage('propertyFormPoint', 0);
export const formAddedPoint = atomWithStorage('formAddedPoint', []);
export const userFormProgress = atomWithStorage('userFormProgress', 'landingPage');
export const userHasStartedRWAForm = atomWithStorage('userHasStartedRWAForm', true);

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
})
