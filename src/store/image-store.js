import { atomWithStorage } from "jotai/utils";

export const imageDataAtom = atomWithStorage("image-data-preview", {
  previewImage: null,
  rawImage: null,
  imageUrl: null,
});
export const imageUploadStateAtom = atomWithStorage("image-upload-process", {
  isConfirmation: false,
  isUploading: false,
  total: 5,
  progress: 0,
});

export const nftMetadataEncryptedAtom = atomWithStorage("nftmetadata", {});
export const nftMetadataAtom = atomWithStorage("nftdata", "");
export const pdfThumbnailList = atomWithStorage("pdfThumbnailData", {
  documentPdf: {
    name: "",
    size: "",
    image: "",
  },
  spptPBB: {
    name: "",
    size: "",
    image: "",
  },
  ownerIdentityCard: {
    name: "",
    size: "",
    image: "",
  },
  ownerFamilyCard: {
    name: "",
    size: "",
    image: "",
  },
});
