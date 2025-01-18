/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import SvgIcon from "@/app/_components/utils/SvgIcon";
import { Combobox, ComboboxInput, Textarea } from "@headlessui/react";
import Image from "next/image";
import { cnm } from "@/utils/style";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import ViewAddressButton from "../../viewAddress";
import DatePicker from "react-datepicker";
import { useAnimate, motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import "../../../style/custom-datepicker.css";
import "../../../style/custom-line-steps.css";
import { useFormsStore } from "@/app/(mint)/_store/form-store-zustand";
import { propexAPI } from "@/app/(mint)/_api/propex";
import { isDemoModeAtom } from "@/app/(mint)/_store/demo-store";
import { useAtom } from "jotai";

const propertyOption = ["Land", "Apartment", "Villa"];
const furnishOption = ["Furnished", "Semi-furnished", "Unfurnished"];
const numberOfBedroomsOption = [
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "4 Bedroom",
  "5 Bedroom",
  "6 Bedroom",
  "+6 Bedroom",
];
const numberOfBathroomsOption = [
  "1 Bathrooms",
  "2 Bathrooms",
  "3 Bathrooms",
  "4 Bathrooms",
  "5 Bathrooms",
  "6 Bathrooms",
  "+6 Bathrooms",
];

const propertyFieldsSet = new Set([
  "propertyType",
  "furnishingType",
  "propertyDescription",
  "landArea",
  // "buildingSize",
  // "numberOfBedrooms",
  // "numberOfBathrooms",
  "startDateOfLease",
  "endDateOfLease",
  "sellingPrice",
  "amenities",
  "thumbnail",
  "images",
]);

const propertyFormConfigurations = {
  leaseholderApartmentAndVilla: [
    "propertyType",
    "furnishingType",
    "propertyDescription",
    "landArea",
    // "buildingSize",
    // "numberOfBedrooms",
    // "numberOfBathrooms",
    "startDateOfLease",
    "endDateOfLease",
    "sellingPrice",
    "amenities",
    "thumbnail",
    "images",
  ],
  leaseholderLand: [
    "propertyType",
    "furnishingType",
    "propertyDescription",
    "landArea",
    "startDateOfLease",
    "endDateOfLease",
    "sellingPrice",
    "thumbnail",
    "images",
  ],
  propertyOwnerApartmentAndVilla: [
    "propertyType",
    "furnishingType",
    "propertyDescription",
    "landArea",
    // "buildingSize",
    // "numberOfBedrooms",
    // "numberOfBathrooms",
    "sellingPrice",
    "amenities",
    "thumbnail",
    "images",
  ],
  propertyOwnerLand: [
    "propertyType",
    "propertyDescription",
    "landArea",
    "sellingPrice",
    "thumbnail",
    "images",
  ],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const formatNumberWithDots = (value) => {
  const cleanedValue = value.replace(/[^0-9]/g, "");
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function PropertyFormPage({
  userProgress,
  setIsFormComplete,
  nftMetaData,
  handleBackButton,
}) {
  const {
    ownershipFormZustand,
    propertyFormZustand,
    setPropertyFormZustand,
    addPointsActivity,
    removePointsActivity,
    amenitiesOption,
    pointsActivity,
    setHasSelectedOptions,
    formSlugList,
  } = useFormsStore();

  const [focusProperty, setFocusProperty] = useState(false);
  const [focusFurnishing, setFocusFurnishing] = useState(false);
  const [focusDescription, setFocusDescription] = useState(false);
  const [focusLandArea, setFocusLandArea] = useState(false);
  const [focusBuildingSize, setFocusBuildingSize] = useState(false);
  const [focusNumberOfBedrooms, setFocusNumberOfBedrooms] = useState(false);
  const [focusNumberOfBathrooms, setFocusNumberOfBathrooms] = useState(false);
  const [focusSellingPrice, setFocusSellingPrice] = useState(false);
  const [focusStartDate, setFocusStartDate] = useState(false);
  const [focusEndDate, setFocusEndDate] = useState(false);
  const [isDemoMode] = useAtom(isDemoModeAtom);

  // ============ State Handling For Forms =============
  const [startDate] = useState(new Date());
  const [endDate] = useState(new Date());
  const [displayedPropertyForm, setDisplayedPropertyForm] = useState(null);

  // For automatic query each select option
  const [propertyQuery, setPropertyQuery] = useState("");
  const filteredProperty =
    propertyQuery === ""
      ? propertyOption
      : propertyOption.filter((option) =>
          option.toLowerCase().includes(propertyQuery.toLowerCase())
        );
  const [furnishQuery, setFurnishQuery] = useState("");
  const filteredFurnished =
    furnishQuery === ""
      ? furnishOption
      : furnishOption.filter((option) =>
          option.toLowerCase().includes(furnishQuery.toLowerCase())
        );
  const [bedRoomQuery, setBedRoomQuery] = useState("");
  const filteredBedrooms =
    bedRoomQuery === ""
      ? numberOfBedroomsOption
      : numberOfBedroomsOption.filter((option) =>
          option.toLowerCase().includes(bedRoomQuery.toLowerCase())
        );
  const [bathRoomQuery, setBathRoomQuery] = useState("");
  const filteredBathrooms =
    bathRoomQuery === ""
      ? numberOfBathroomsOption
      : numberOfBathroomsOption.filter((option) =>
          option.toLowerCase().includes(bathRoomQuery.toLowerCase())
        );

  const handleDateChange = (e) => {
    const { id, value, slug } = e;

    const isValidDate = (date) => {
      return date instanceof Date && !isNaN(date.getTime());
    };

    setPropertyFormZustand(id, value);

    if (isValidDate(value)) {
      addPointsActivity(id, slug, 20);
    } else {
      removePointsActivity(slug);
    }
  };

  const handleSelect = (e) => {
    const { id, value, slug } = e || {};

    if (id) {
      setPropertyFormZustand(id, value);

      if (value.trim()) {
        addPointsActivity(id, slug, 20);
        setHasSelectedOptions(id, true);
      }
    }
  };

  const handleInputChange = (e) => {
    const { id, value, slug } = e;

    const querySetters = {
      propertyType: setPropertyQuery,
      furnishingType: setFurnishQuery,
      numberOfBedrooms: setBedRoomQuery,
      numberOfBathrooms: setBathRoomQuery,
    };

    const optionChecker = {
      propertyType: propertyOption,
      furnishingType: furnishOption,
      numberOfBedrooms: numberOfBedroomsOption,
      numberOfBathrooms: numberOfBathroomsOption,
    };

    if (querySetters[id]) {
      querySetters[id](value);
    }

    setPropertyFormZustand(id, value);

    if (!value.trim().includes(optionChecker[id])) {
      removePointsActivity(slug);
      setHasSelectedOptions(id, false);
    }
  };

  const handleChange = (e) => {
    let { id, value, slug } = e;

    if (id === "sellingPrice" || id === "landArea" || id === "buildingSize") {
      value = formatNumberWithDots(value);
    }

    setPropertyFormZustand(id, value);

    if (value.trim() === "") {
      removePointsActivity(slug);
    } else if (value !== "") {
      addPointsActivity(id, slug, 20);
    }
  };

  const handleThumbnailDrop = async (acceptedFiles) => {
    toast.loading("Uploading your image...", {
      id: "loadingImages",
      position: "top-center",
    });

    try {
      const image = acceptedFiles[0];

      if (image.size > MAX_FILE_SIZE) {
        return toast.error(
          "File size is too large. Maximum allowed size is 5 MB"
        );
      }

      if (
        image &&
        (image.type === "image/jpeg" || image.type === "image/png")
      ) {
        const formData = new FormData();
        formData.append("file", image);

        const { status, data: cloudinaryResponse } = await propexAPI.post(
          "/file/upload-verify-file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (status === 200) {
          setPropertyFormZustand("thumbnail", {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
            fileName: cloudinaryResponse.fileName,
            mimeType: cloudinaryResponse.fileType,
            fileHash: cloudinaryResponse.fileHash,
          });

          addPointsActivity("thumbnail", "thumbnail_tier_two", 10);
        } else {
          toast.error("Something is wrong, please try again.");
        }
      } else {
        toast.error("Please import an image file type!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      toast.dismiss("loadingImages");
    }
  };

  const handleGeneralImagesDrop = async (acceptedFiles) => {
    toast.loading("Uploading your images...", {
      id: "loadingImages",
      position: "top-center",
    });

    try {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            `File ${file.name} is too large. Maximum allowed size is 5 MB.`
          );
          return false;
        }
        return true;
      });

      // Check if the total number of images will exceed the limit
      if (propertyFormZustand.images.length + validFiles.length <= 10) {
        const uploadedImages = await Promise.all(
          validFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const { status, data: cloudinaryResponse } = await propexAPI.post(
              "/file/upload-verify-file",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            // const { status, data: cloudinaryResponse } = await axios.post(
            //   backendUrl + "/file/upload-verify-file",
            //   formData,
            //   {
            //     headers: {
            //       "Content-Type": "multipart/form-data",
            //     },
            //   }
            // );
            // console.log(cloudinaryResponse);

            if (status === 200) {
              return {
                url: cloudinaryResponse.secure_url,
                public_id: cloudinaryResponse.public_id,
                fileName: cloudinaryResponse.fileName,
                mimeType: cloudinaryResponse.fileType,
                fileHash: cloudinaryResponse.fileHash,
              };
            } else {
              toast.error(`Failed to upload ${file.name}.`);
              return null;
            }
          })
        );

        const successfulUploads = uploadedImages.filter(
          (image) => image !== null
        );

        setPropertyFormZustand("images", [
          ...propertyFormZustand.images,
          ...successfulUploads,
        ]);

        addPointsActivity("images", "images_tier_two", 10);
      } else {
        toast.error("You can upload up to 10 images.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading the images.");
    } finally {
      toast.dismiss("loadingImages");
    }
  };

  const removeImage = async (index) => {
    toast.loading("Deleting your image...", {
      id: "loadingImages",
      position: "top-center",
    });

    try {
      const { public_id } = propertyFormZustand.images[index];

      if (!public_id) {
        console.error("No public_id found for this image");
        return;
      }

      const { status } = await propexAPI.delete("file/delete-file", {
        data: { public_id },
      });

      if (status === 200) {
        setPropertyFormZustand(
          "images",
          propertyFormZustand.images.filter((_, i) => i !== index)
        );

        removePointsActivity("images_tier_two");
      } else {
        toast.error("Could not delete this image, please try again");
      }
    } catch (error) {
      console.error("Error deleting the image:", error);
      toast.error("An error occurred while deleting the image.");
    } finally {
      toast.dismiss("loadingImages");
    }
  };

  const removeThumbnail = async () => {
    toast.loading("Deleting your image...", {
      id: "loadingImages",
      position: "top-center",
    });
    try {
      const { public_id } = propertyFormZustand["thumbnail"] || {};

      if (!public_id) {
        console.log("No public_id found for this field");
        return;
      }

      const { status } = await propexAPI.delete("file/delete-file", {
        data: { public_id },
      });

      if (status === 200) {
        setPropertyFormZustand("thumbnail", {
          url: "",
          public_id: "",
          fileName: "",
          mimeType: "",
          fileHash: "",
        });

        removePointsActivity("thumbnail_tier_two");
      } else {
        toast.error("Could not delete this image, please try again");
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss("loadingImages");
    }
  };

  const formValidator = () => {
    const ownersType = ownershipFormZustand.ownerType;
    const propertiesType = propertyFormZustand?.propertyType;

    if (
      ownersType === "Leasehold Owner" &&
      (propertiesType === "Apartment" ||
        propertiesType === "Villa" ||
        propertiesType === "")
    ) {
      setDisplayedPropertyForm("leaseholderApartmentAndVilla");
    } else if (ownersType === "Leasehold Owner" && propertiesType === "Land") {
      setDisplayedPropertyForm("leaseholderLand");
    } else if (
      ownersType === "Property Owner" &&
      (propertiesType === "Apartment" ||
        propertiesType === "Villa" ||
        propertiesType === "")
    ) {
      setDisplayedPropertyForm("propertyOwnerApartmentAndVilla");
    } else if (ownersType === "Property Owner" && propertiesType === "Land") {
      setDisplayedPropertyForm("propertyOwnerLand");
    }

    const requiredFields =
      propertyFormConfigurations[displayedPropertyForm] || [];

    let isValid;
    if (requiredFields.length === 0) {
      isValid = false;
    } else {
      isValid = requiredFields.every((field) =>
        pointsActivity.some((activity) => activity.name === field)
      );
    }

    if (isValid) {
      setIsFormComplete(true);
      return true;
    } else {
      setIsFormComplete(false);
      return false;
    }
  };

  useEffect(() => {
    const requiredFields =
      propertyFormConfigurations[displayedPropertyForm] || [];

    if (requiredFields.length !== 0) {
      pointsActivity.forEach((activity) => {
        if (
          propertyFieldsSet.has(activity.name) &&
          !requiredFields.includes(activity.name)
        ) {
          removePointsActivity(activity.slug);
        }
      });

      requiredFields.forEach((field) => {
        const isFieldInPoints = pointsActivity.some(
          (activity) => activity.name === field
        );

        const fieldValue = propertyFormZustand[field];
        const slug = formSlugList[field];

        const isFieldValid =
          fieldValue &&
          ((field === "images" &&
            Array.isArray(fieldValue) &&
            fieldValue.length > 0) ||
            (field === "thumbnail" &&
              typeof fieldValue === "object" &&
              fieldValue.url) ||
            (field === "documentPdf" &&
              typeof fieldValue === "object" &&
              fieldValue.url) ||
            (field === "spptPBB" &&
              typeof fieldValue === "object" &&
              fieldValue.url) ||
            (field === "ownerIdentityCard" &&
              typeof fieldValue === "object" &&
              fieldValue.url) ||
            (field === "ownerFamilyCard" &&
              typeof fieldValue === "object" &&
              fieldValue.url) ||
            (field === "amenities" &&
              Array.isArray(fieldValue) &&
              fieldValue.some((amenity) => amenity.selected)) ||
            (field !== "images" &&
              field !== "thumbnail" &&
              field !== "documentPdf" &&
              field !== "spptPBB" &&
              field !== "ownerIdentityCard" &&
              field !== "ownerFamilyCard" &&
              field !== "amenities"));

        if (propertyFieldsSet.has(field) && !isFieldInPoints && isFieldValid) {
          if (field === "amenities") {
            addPointsActivity(field, slug, 10);
          } else {
            addPointsActivity(field, slug, 20);
          }
        }
      });
    }

    formValidator();
  }, [displayedPropertyForm]);

  useEffect(() => {
    const selectedAmenityNames = amenitiesOption
      .filter((amenity) => amenity.selected)
      .map((amenity) => amenity.name);

    setPropertyFormZustand("amenities", selectedAmenityNames);

    if (selectedAmenityNames.length > 0) {
      addPointsActivity("amenities", "amenities_tier_two", 10);
    } else {
      removePointsActivity("amenities_tier_two");
    }
  }, [amenitiesOption]);

  useEffect(() => {
    formValidator();
  }, [propertyFormZustand]);

  if (userProgress !== "propertyForm") return null;

  const samplePropertyData = {
    propertyType: "Villa",
    furnishingType: "Furnished",
    propertyDescription: "A beautiful, fully furnished apartment.",
    landArea: "120",
    buildingSize: "100",
    numberOfBedrooms: "3 Bedroom",
    numberOfBathrooms: "2 Bathrooms",
    startDateOfLease: new Date(),
    endDateOfLease: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ),
    sellingPrice: "500000000",
    amenities: ["Private Pool", "Garage", "CCTV"],
    thumbnail: {
      url: "https://res.cloudinary.com/dd9nhl1mn/image/upload/v1730744652/buying-property-in-bali-villa-outdoor_evmhq5.jpg",
      public_id: "buying-property-in-bali-villa-outdoor_evmhq5",
      fileName: "buying-property-in-bali-villa-outdoor.jpg",
      mimeType: "image/jpeg",
      fileHash:
        "d693ec79829d36c18d0763ac360a54a630cf4d345c1b2bb89081ae65449a01fb",
    },
    images: [
      {
        url: "https://res.cloudinary.com/dd9nhl1mn/image/upload/v1730744671/buying-property-in-bali-living_xjfp8f.jpg",
        public_id: "buying-property-in-bali-living_xjfp8f",
        fileName: "buying-property-in-bali-living.jpg",
        mimeType: "image/jpeg",
        fileHash:
          "1ddcc035910a7829fc0bc69e3d2caa946128fac793f7373b157faec7f4702241",
      },
      {
        url: "https://res.cloudinary.com/dd9nhl1mn/image/upload/v1730744671/buying-property-in-bali-villa-interior_jxkpki.jpg",
        public_id: "buying-property-in-bali-villa-interior_jxkpki",
        fileName: "buying-property-in-bali-villa-interior.jpg",
        mimeType: "image/jpeg",
        fileHash:
          "4cd3c2e14a8b718a4feb9b7ed8111a67eb65c42e8e03e72cec24c483d386165d",
      },
    ],
  };

  const autoFillFormHandler = async () => {
    // Fill dropdown/select fields
    handleSelect({
      id: "propertyType",
      value: samplePropertyData.propertyType,
      slug: "property_type_tier_two",
    });
    handleSelect({
      id: "furnishingType",
      value: samplePropertyData.furnishingType,
      slug: "furnishing_type_tier_two",
    });
    handleSelect({
      id: "numberOfBedrooms",
      value: samplePropertyData.numberOfBedrooms,
      slug: "number_of_bedrooms_tier_two",
    });
    handleSelect({
      id: "numberOfBathrooms",
      value: samplePropertyData.numberOfBathrooms,
      slug: "number_of_bathrooms_tier_two",
    });

    // Fill text fields
    handleChange({
      id: "propertyDescription",
      value: samplePropertyData.propertyDescription,
      slug: "property_description_tier_two",
    });
    handleChange({
      id: "landArea",
      value: samplePropertyData.landArea,
      slug: "land_area_tier_two",
    });
    handleChange({
      id: "buildingSize",
      value: samplePropertyData.buildingSize,
      slug: "building_size_tier_two",
    });
    handleChange({
      id: "sellingPrice",
      value: samplePropertyData.sellingPrice,
      slug: "selling_price_tier_two",
    });

    // // Set dates
    // handleDateChange({
    //   id: "startDateOfLease",
    //   value: samplePropertyData.startDateOfLease,
    //   slug: "start_date_of_lease_tier_two",
    // });
    // handleDateChange({
    //   id: "endDateOfLease",
    //   value: samplePropertyData.endDateOfLease,
    //   slug: "end_date_of_lease_tier_two",
    // });

    // Set amenities
    setPropertyFormZustand("amenities", samplePropertyData.amenities);
    addPointsActivity("amenities", "amenities_tier_two", 10);

    // Set thumbnail image
    setPropertyFormZustand("thumbnail", samplePropertyData.thumbnail);
    addPointsActivity("thumbnail", "thumbnail_tier_two", 10);

    // Set general images
    setPropertyFormZustand("images", samplePropertyData.images);
    addPointsActivity("images", "images_tier_two", 10);

    toast.success("Property form auto-filled with sample data!");
  };

  // ========== Forms for different type ===========
  const leaseholdersApartmentAndVilla = () => {
    return (
      <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center mt-14 sm:mt-20 mx-auto mb-28 sm:mb-20">
        <p className="text-2xl text-black font-semibold">Property Details</p>
        <div className="w-full mt-4 mb-4">
          <p className="text-black text-left font-semibold text-base">
            Property Information
          </p>
        </div>

        <CoolSelectInput
          id={"propertyType"}
          formDataValue={propertyFormZustand.propertyType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusProperty}
          setFocus={setFocusProperty}
          filteredData={filteredProperty}
          placeHolder={"Property Type"}
          slug={"property_type_tier_two"}
        />

        <CoolSelectInput
          id={"furnishingType"}
          formDataValue={propertyFormZustand.furnishingType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusFurnishing}
          setFocus={setFocusFurnishing}
          filteredData={filteredFurnished}
          placeHolder={"Furnishing"}
          slug={"furnishing_type_tier_two"}
        />

        <CoolTextarea
          formData={propertyFormZustand.propertyDescription}
          handleChange={handleChange}
          focus={focusDescription}
          setFocus={setFocusDescription}
          placeholder={"Description"}
          slug={"property_description_tier_two"}
        />

        <div className="w-full mt-4 mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Unit Details
          </p>
          <div className="w-full grid md:grid-cols-2 gap-4 lg:gap-2">
            <div className="relative w-full h-14">
              <CoolInputLandArea
                formData={propertyFormZustand.landArea}
                handleChange={handleChange}
                focus={focusLandArea}
                setFocus={setFocusLandArea}
                placeholder={"Land Area"}
                slug={"land_area_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolInputBuildingSize
                formData={propertyFormZustand.buildingSize}
                handleChange={handleChange}
                focus={focusBuildingSize}
                setFocus={setFocusBuildingSize}
                placeholder={"Building Size"}
                slug={"building_size_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolSelectInput
                id={"numberOfBedrooms"}
                formDataValue={propertyFormZustand.numberOfBedrooms}
                handleInputChange={handleInputChange}
                handleSelect={handleSelect}
                focus={focusNumberOfBedrooms}
                setFocus={setFocusNumberOfBedrooms}
                filteredData={filteredBedrooms}
                placeHolder={"Number of Bedrooms"}
                classNameContainer={"mt-0"}
                isOptional={true}
                slug={"number_of_bedrooms_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolSelectInput
                id={"numberOfBathrooms"}
                formDataValue={propertyFormZustand.numberOfBathrooms}
                handleInputChange={handleInputChange}
                handleSelect={handleSelect}
                focus={focusNumberOfBathrooms}
                setFocus={setFocusNumberOfBathrooms}
                filteredData={filteredBathrooms}
                placeHolder={"Number of Bathrooms"}
                classNameContainer={"mt-0"}
                slug={"number_of_bathrooms_tier_two"}
                isOptional={true}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-4 mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Selling Details
          </p>
          <CoolDatePicker
            id={"startDateOfLease"}
            formDataValue={propertyFormZustand.startDateOfLease}
            handleDateChange={handleDateChange}
            startDate={startDate}
            focus={focusStartDate}
            setFocus={setFocusStartDate}
            placeHolder={"Start Date of Lease"}
            slug={"start_date_of_lease_tier_two"}
          />
          <CoolDatePicker
            id={"endDateOfLease"}
            formDataValue={propertyFormZustand.endDateOfLease}
            handleDateChange={handleDateChange}
            startDate={endDate}
            focus={focusEndDate}
            setFocus={setFocusEndDate}
            placeHolder={"End Date of Lease"}
            slug={"end_date_of_lease_tier_two"}
          />
          <CoolInputPrice
            formData={propertyFormZustand.sellingPrice}
            handleChange={handleChange}
            focus={focusSellingPrice}
            setFocus={setFocusSellingPrice}
            placeholder={"Selling Price"}
            slug={"selling_price_tier_two"}
          />
        </div>

        <AmenitiesComponent />

        <ImageUpload
          thumbnail={propertyFormZustand.thumbnail?.url}
          generalImages={propertyFormZustand.images}
          handleThumbnailDrop={handleThumbnailDrop}
          handleGeneralImagesDrop={handleGeneralImagesDrop}
          removeImage={removeImage}
          removeThumbnail={removeThumbnail}
        />
      </div>
    );
  };

  const leaseholderLand = () => {
    return (
      <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center mt-14 sm:mt-20 mx-auto mb-28 sm:mb-20">
        <p className="text-2xl text-black font-semibold">Property Details</p>
        <div className="w-full mt-4 mb-4">
          <p className="text-black text-left font-semibold text-base">
            Property Information
          </p>
        </div>

        <CoolSelectInput
          id={"propertyType"}
          formDataValue={propertyFormZustand.propertyType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusProperty}
          setFocus={setFocusProperty}
          filteredData={filteredProperty}
          placeHolder={"Property Type"}
          slug={"property_type_tier_two"}
        />

        <CoolSelectInput
          id={"furnishingType"}
          formDataValue={propertyFormZustand.furnishingType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusFurnishing}
          setFocus={setFocusFurnishing}
          filteredData={filteredFurnished}
          placeHolder={"Furnishing"}
          slug={"furnishing_type_tier_two"}
        />

        <CoolTextarea
          formData={propertyFormZustand.propertyDescription}
          handleChange={handleChange}
          focus={focusDescription}
          setFocus={setFocusDescription}
          placeholder={"Description"}
          slug={"property_description_tier_two"}
        />

        <div className="w-full mt-4 mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Unit Details
          </p>
          <CoolInputLandArea
            formData={propertyFormZustand.landArea}
            handleChange={handleChange}
            focus={focusLandArea}
            setFocus={setFocusLandArea}
            placeholder={"Land Area"}
            slug={"land_area_tier_two"}
          />
        </div>

        <div className="w-full mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Selling Details
          </p>

          <CoolDatePicker
            id={"startDateOfLease"}
            formDataValue={propertyFormZustand.startDateOfLease}
            handleDateChange={handleDateChange}
            startDate={startDate}
            focus={focusStartDate}
            setFocus={setFocusStartDate}
            placeHolder={"Start Date of Lease"}
            slug={"start_date_of_lease_tier_two"}
          />
          <CoolDatePicker
            id={"endDateOfLease"}
            formDataValue={propertyFormZustand.endDateOfLease}
            handleDateChange={handleDateChange}
            startDate={endDate}
            focus={focusEndDate}
            setFocus={setFocusEndDate}
            placeHolder={"End Date of Lease"}
            slug={"end_date_of_lease_tier_two"}
          />

          <CoolInputPrice
            formData={propertyFormZustand.sellingPrice}
            handleChange={handleChange}
            focus={focusSellingPrice}
            setFocus={setFocusSellingPrice}
            placeholder={"Selling Price"}
            slug={"selling_price_tier_two"}
          />
        </div>

        <ImageUpload
          thumbnail={propertyFormZustand.thumbnail?.url}
          generalImages={propertyFormZustand.images}
          handleThumbnailDrop={handleThumbnailDrop}
          handleGeneralImagesDrop={handleGeneralImagesDrop}
          removeImage={removeImage}
          removeThumbnail={removeThumbnail}
        />
      </div>
    );
  };

  const propertyOwnerApartmentAndVilla = () => {
    return (
      <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center mt-14 sm:mt-20 mx-auto mb-28 sm:mb-20">
        <p className="text-2xl text-black font-semibold">Property Details</p>
        <div className="w-full mt-4 mb-4 flex flex-col items-center gap-4">
          <p className="text-black text-left font-semibold text-base">
            Property Information
          </p>
          {isDemoMode && (
            <button
              onClick={autoFillFormHandler}
              className="px-4 py-2 bg-mossgreen text-white rounded-md"
            >
              Auto Fill
            </button>
          )}
        </div>

        <CoolSelectInput
          id={"propertyType"}
          formDataValue={propertyFormZustand.propertyType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusProperty}
          setFocus={setFocusProperty}
          filteredData={filteredProperty}
          placeHolder={"Property Type"}
          slug={"property_type_tier_two"}
        />

        <CoolSelectInput
          id={"furnishingType"}
          formDataValue={propertyFormZustand.furnishingType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusFurnishing}
          setFocus={setFocusFurnishing}
          filteredData={filteredFurnished}
          placeHolder={"Furnishing"}
          slug={"furnishing_type_tier_two"}
        />

        <CoolTextarea
          formData={propertyFormZustand.propertyDescription}
          handleChange={handleChange}
          focus={focusDescription}
          setFocus={setFocusDescription}
          placeholder={"Description"}
          slug={"property_description_tier_two"}
        />

        <div className="w-full mt-4 mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Unit Details
          </p>
          {/* <div as="div" className="w-full h-full flex-col">
            <div className="flex w-full h-full gap-2 mb-4">
              <div className="relative w-5/10 h-14">
                <CoolInputLandArea
                  formData={propertyFormZustand.landArea}
                  handleChange={handleChange}
                  focus={focusLandArea}
                  setFocus={setFocusLandArea}
                  placeholder={"Land Area"}
                  slug={"land_area_tier_two"}
                />
              </div>

              <div className="relative w-5/10 h-14">
                <CoolInputBuildingSize
                  formData={propertyFormZustand.buildingSize}
                  handleChange={handleChange}
                  focus={focusBuildingSize}
                  setFocus={setFocusBuildingSize}
                  placeholder={"Building Size"}
                  slug={"building_size_tier_two"}
                />
              </div>
            </div>
            <div className="flex w-full h-full gap-2">
              <div className="relative w-5/10 h-14">
                <CoolSelectInput
                  id={"numberOfBedrooms"}
                  formDataValue={propertyFormZustand.numberOfBedrooms}
                  handleInputChange={handleInputChange}
                  handleSelect={handleSelect}
                  focus={focusNumberOfBedrooms}
                  setFocus={setFocusNumberOfBedrooms}
                  filteredData={filteredBedrooms}
                  placeHolder={"Number of Bedrooms"}
                  classNameContainer={"mt-0"}
                  slug={"number_of_bedrooms_tier_two"}
                  isOptional={true}
                />
              </div>

              <div className="relative w-5/10 h-14">
                <CoolSelectInput
                  id={"numberOfBathrooms"}
                  formDataValue={propertyFormZustand.numberOfBathrooms}
                  handleInputChange={handleInputChange}
                  handleSelect={handleSelect}
                  focus={focusNumberOfBathrooms}
                  setFocus={setFocusNumberOfBathrooms}
                  filteredData={filteredBathrooms}
                  placeHolder={"Number of Bathrooms"}
                  classNameContainer={"mt-0"}
                  slug={"number_of_bathrooms_tier_two"}
                  isOptional={true}
                />
              </div>
            </div>
          </div> */}
          <div className="w-full grid md:grid-cols-2 gap-4 lg:gap-2">
            <div className="relative w-full h-14">
              <CoolInputLandArea
                formData={propertyFormZustand.landArea}
                handleChange={handleChange}
                focus={focusLandArea}
                setFocus={setFocusLandArea}
                placeholder={"Land Area"}
                slug={"land_area_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolInputBuildingSize
                formData={propertyFormZustand.buildingSize}
                handleChange={handleChange}
                focus={focusBuildingSize}
                setFocus={setFocusBuildingSize}
                placeholder={"Building Size"}
                slug={"building_size_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolSelectInput
                id={"numberOfBedrooms"}
                formDataValue={propertyFormZustand.numberOfBedrooms}
                handleInputChange={handleInputChange}
                handleSelect={handleSelect}
                focus={focusNumberOfBedrooms}
                setFocus={setFocusNumberOfBedrooms}
                filteredData={filteredBedrooms}
                placeHolder={"Number of Bedrooms"}
                classNameContainer={"mt-0"}
                isOptional={true}
                slug={"number_of_bedrooms_tier_two"}
              />
            </div>

            <div className="relative w-full h-14">
              <CoolSelectInput
                id={"numberOfBathrooms"}
                formDataValue={propertyFormZustand.numberOfBathrooms}
                handleInputChange={handleInputChange}
                handleSelect={handleSelect}
                focus={focusNumberOfBathrooms}
                setFocus={setFocusNumberOfBathrooms}
                filteredData={filteredBathrooms}
                placeHolder={"Number of Bathrooms"}
                classNameContainer={"mt-0"}
                slug={"number_of_bathrooms_tier_two"}
                isOptional={true}
              />
            </div>
          </div>
        </div>

        <div className="w-full mt-4 mb-2">
          <p className="text-black text-left font-semibold mb-4">
            Selling Details
          </p>
          <CoolInputPrice
            formData={propertyFormZustand.sellingPrice}
            handleChange={handleChange}
            focus={focusSellingPrice}
            setFocus={setFocusSellingPrice}
            placeholder={"Selling Price"}
            slug={"selling_price_tier_two"}
          />
        </div>

        <AmenitiesComponent />

        <ImageUpload
          thumbnail={propertyFormZustand.thumbnail?.url}
          generalImages={propertyFormZustand.images}
          handleThumbnailDrop={handleThumbnailDrop}
          handleGeneralImagesDrop={handleGeneralImagesDrop}
          removeImage={removeImage}
          removeThumbnail={removeThumbnail}
        />
      </div>
    );
  };

  const propertyOwnerLand = () => {
    return (
      <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center mt-14 sm:mt-20 mx-auto mb-28 sm:mb-20">
        <p className="text-2xl text-black font-semibold">Property Details</p>
        <div className="w-full mt-4 mb-4">
          <p className="text-black text-left font-semibold text-base">
            Property Information
          </p>
        </div>

        <CoolSelectInput
          id={"propertyType"}
          formDataValue={propertyFormZustand.propertyType}
          handleInputChange={handleInputChange}
          handleSelect={handleSelect}
          focus={focusProperty}
          setFocus={setFocusProperty}
          filteredData={filteredProperty}
          placeHolder={"Property Type"}
          slug={"property_type_tier_two"}
        />

        <CoolTextarea
          formData={propertyFormZustand.propertyDescription}
          handleChange={handleChange}
          focus={focusDescription}
          setFocus={setFocusDescription}
          placeholder={"Description"}
          slug={"property_description_tier_two"}
        />

        <div className="w-full mt-4 mb-4">
          <p className="text-black text-left font-semibold text-base">
            Unit Details
          </p>
        </div>
        <CoolInputLandArea
          formData={propertyFormZustand.landArea}
          handleChange={handleChange}
          focus={focusLandArea}
          setFocus={setFocusLandArea}
          placeholder={"Land Area"}
          slug={"land_area_tier_two"}
        />

        <div className="w-full mt-4 mb-4">
          <p className="text-black text-left font-semibold text-base">
            Selling Details
          </p>
        </div>
        <CoolInputPrice
          formData={propertyFormZustand.sellingPrice}
          handleChange={handleChange}
          focus={focusSellingPrice}
          setFocus={setFocusSellingPrice}
          placeholder={"Selling Price"}
          slug={"selling_price_tier_two"}
        />

        <ImageUpload
          thumbnail={propertyFormZustand.thumbnail?.url}
          generalImages={propertyFormZustand.images}
          handleThumbnailDrop={handleThumbnailDrop}
          handleGeneralImagesDrop={handleGeneralImagesDrop}
          removeImage={removeImage}
          removeThumbnail={removeThumbnail}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center bg-white overflow-hidden font-open-sauce">
      <div className="w-full h-full mb-8 px-4">
        <ViewAddressButton
          userProgress={userProgress}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      </div>

      <div className="w-full max-w-[1480px] h-full px-5 lg:px-12">
        <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center sm:mt-8">
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
            <div className="relative flex items-center justify-center w-8 h-8 p-[2px] bg-mossgreen text-white rounded-full">
              <div className="w-full h-full rounded-full border border-white flex items-center justify-center">
                <span className="font-semibold text-lemongrass text-sm">2</span>
                <span className="absolute -bottom-6 font-semibold text-mossgreen text-sm">
                  Property
                </span>
              </div>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-black rounded-lg bg-opacity-40"></div>
            <div className="relative flex items-center justify-center w-8 h-8 bg-black bg-opacity-40 text-white rounded-full">
              <span className="font-semibold text-sm">3</span>
              <span className="absolute -bottom-6 font-semibold text-black text-opacity-40 text-sm">
                Confirmation
              </span>
            </div>
          </div>
        </div>
        {(displayedPropertyForm === "leaseholderApartmentAndVilla" ||
          displayedPropertyForm == null) &&
          leaseholdersApartmentAndVilla()}

        {displayedPropertyForm === "leaseholderLand" && leaseholderLand()}

        {displayedPropertyForm === "propertyOwnerApartmentAndVilla" &&
          propertyOwnerApartmentAndVilla()}

        {displayedPropertyForm === "propertyOwnerLand" && propertyOwnerLand()}
      </div>
    </div>
  );
}

const ImageUpload = ({
  thumbnail,
  generalImages,
  handleThumbnailDrop,
  handleGeneralImagesDrop,
  removeImage,
  removeThumbnail,
}) => {
  // Dropzone for thumbnail
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    onDrop: handleThumbnailDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  // Dropzone for general images
  const {
    getRootProps: getGeneralImagesRootProps,
    getInputProps: getGeneralImagesInputProps,
  } = useDropzone({
    onDrop: handleGeneralImagesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: true,
  });

  return (
    <div className="w-full h-full">
      {/* Thumbnail Upload */}
      <div className="w-full h-full mt-4 mb-2">
        <div className="w-full h-full flex flex-col justify-center gap-1 mb-4">
          <h1 className="font-semibold">
            Thumbnail<span className="text-[#F60000]"> *</span>
          </h1>
          <p className="text-[#6D6D6D] text-xs font-normal">
            Supported format: PNG, JPG, and JPEG. Maximum file up to 5mb
          </p>
        </div>
        {thumbnail ? (
          <div className="relative h-[192px] w-[162px] sm:w-[192px]">
            <button
              onClick={removeThumbnail}
              className="absolute top-2 right-2 bg-gray-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-2xl"
            >
              &times;
            </button>
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        ) : (
          <div className="w-[162px] h-full sm:w-[192px] max-h-[192px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-[#F7F8F9]">
            <div
              {...getThumbnailRootProps()}
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <input {...getThumbnailInputProps()} />
              <SvgIcon
                src="/assets/icons/add-image-icon.svg"
                className="w-12 h-12 bg-mossgreen mb-4"
              />
              <p className="text-center text-[#222222] font-semibold text-sm">
                Drag or Upload Images
              </p>
              <div className="text-xs text-[#6D6D6D] mt-2 flex items-center gap-1">
                1 Images =
                <div className="flex items-center gap-1 bg-lightgreen rounded-2xl px-2 py-1">
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
                    10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Images Upload */}
      <div className="w-full h-full mt-4 mb-2">
        <div className="w-full flex flex-col justify-center gap-1 mb-4">
          <h1 className="font-semibold">
            Images<span className="text-[#F60000]"> *</span>
          </h1>
          <p className="text-[#6D6D6D] text-xs font-normal">
            Supported format: PNG, JPG, and JPEG. Maximum file size up to 5MB
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Upload area and image previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            {/* Upload area */}
            {generalImages.length < 10 && (
              <div className="h-[192px] w-full sm:w-[192px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-[#F7F8F9]">
                <div
                  {...getGeneralImagesRootProps()}
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <input {...getGeneralImagesInputProps()} />
                  <SvgIcon
                    src="/assets/icons/add-image-icon.svg"
                    className="w-12 h-12 bg-mossgreen mb-4"
                  />
                  <p className="text-center text-[#222222] font-semibold text-sm">
                    Drag or Upload Images
                  </p>
                  <div className="text-xs text-[#6D6D6D] mt-2 flex items-center gap-1">
                    1 Image =
                    <div className="flex items-center bg-lightgreen rounded-2xl px-2 py-1">
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
                        10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview the uploaded general images */}
            {generalImages.length > 0 &&
              generalImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[192px] w-full sm:w-[192px]"
                >
                  {/* X Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-gray-300 text-black rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                  <img
                    src={image?.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CoolSelectInput = ({
  id,
  formDataValue,
  handleInputChange,
  handleSelect,
  focus,
  setFocus,
  filteredData,
  placeHolder,
  classNameContainer,
  slug,
  isOptional,
}) => {
  const [scope, animate] = useAnimate();
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState(placeHolder);
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    if (scope.current && focus) {
      animate(scope.current, { height: "auto", opacity: 1 }, { duration: 3 });
    } else if (scope.current && !focus) {
      animate(scope.current, { height: 0, opacity: 0 }, { duration: 3 });
    }
  }, [focus]);

  const checkSelected = (e) => {
    handleSelect(e);
  };

  const { hasSelectedOptions } = useFormsStore();

  useEffect(() => {
    const handleResizeAndFormValue = () => {
      const isSmallScreen = window.innerWidth < 640;
      const isFormDataNotEmpty = formDataValue.trim() !== "";

      if (isSmallScreen) {
        if (placeHolder === "Number of Bedrooms") {
          setDisplayedPlaceholder("Bedrooms");
        } else if (placeHolder === "Number of Bathrooms") {
          setDisplayedPlaceholder("Bathrooms");
        } else {
          setDisplayedPlaceholder(placeHolder);
        }
      } else {
        setDisplayedPlaceholder(placeHolder);
      }

      if (
        isSmallScreen &&
        isFormDataNotEmpty &&
        (placeHolder === "Number of Bedrooms" ||
          placeHolder === "Number of Bathrooms")
      ) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    handleResizeAndFormValue();

    window.addEventListener("resize", handleResizeAndFormValue);

    return () => {
      window.removeEventListener("resize", handleResizeAndFormValue);
    };
  }, [placeHolder, formDataValue]);

  return (
    <div className={cnm("relative w-full h-14 mt-2 mb-2", classNameContainer)}>
      <div className="relative w-full h-full">
        <div
          className={`relative w-full h-full border rounded-lg flex overflow-hidden ${
            !focus && hasSelectedOptions[id] ? "bg-white" : "bg-lightgreen"
          }`}
        >
          <input
            id={id}
            type="text"
            name={id}
            value={formDataValue}
            onChange={(e) =>
              handleInputChange({ id, value: e.target.value, slug })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            className="grow w-full h-full border-r py-2 px-4 rounded-lg transition-all duration-300 font-semibold text-sm"
          />
          <div
            className={`shrink-0 items-center justify-center w-[61px] px-1 h-14 flex ${
              !focus && hasSelectedOptions[id]
                ? "bg-white bg-opacity-10"
                : "bg-lightgreen"
            }`}
          >
            <div
              className={`relative w-4 h-4 mr-1 ${
                !focus && hasSelectedOptions[id] ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && hasSelectedOptions[id] ? "running" : "paused",
              }}
            >
              <Image
                src="/assets/logo/propex-coin.png"
                alt="propex-coin"
                fill
                sizes="16px"
                className={`object-cover ${
                  !focus && hasSelectedOptions[id]
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              />
            </div>
            <span
              className={`text-deepteal text-xs lg:text-sm font-semibold ${
                !focus && hasSelectedOptions[id] ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && hasSelectedOptions[id] ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>
          {showArrow && (
            <div className={`absolute right-[72px] translate-y-1/2`}>
              <Image
                src="/assets/icons/arrow-down-dropdown.svg"
                className={`w-6 h-6 transition-transform duration-300 ${
                  focus ? "rotate-180" : "rotate-0"
                }`}
                alt="dropdown arrow"
                width={24}
                height={24}
              />
            </div>
          )}
        </div>

        <p
          className={`absolute font-regular text-ellipsis overflow-hidden whitespace-nowrap text-[#6D6D6D] transition-all duration-300 pointer-events-none bg-white inline-block ${
            focus || formDataValue
              ? "text-xs -top-3 left-3 px-1"
              : "text-sm top-1/2 -translate-y-1/2 left-3 px-2"
          }`}
        >
          {displayedPlaceholder}
          {!isOptional && <span className="text-[#F60000]"> *</span>}
        </p>

        {focus && (
          <motion.div
            className="absolute bg-white border mt-1 rounded-lg shadow-lg z-50 w-full sm:w-[calc(100%-61px)]"
            style={{
              overflow: "hidden",
              height: "auto",
              left: 0,
            }}
            ref={scope}
          >
            <motion.ul
              className="max-h-60 overflow-auto"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filteredData.map((option, index) => (
                <motion.li
                  key={index}
                  onClick={() => checkSelected({ id: id, value: option, slug })}
                  className="cursor-pointer font-normal truncate h-[54px] select-none px-4 py-2 text-sm hover:bg-[#F7F8F9] hover:text-black flex items-center"
                >
                  {option}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const CoolTextarea = ({
  formData,
  focus,
  setFocus,
  handleChange,
  placeholder,
  slug,
}) => {
  return (
    <div className="relative w-full h-full mt-4">
      <Combobox as={"div"} className={"w-full h-full flex"}>
        <div
          className={`relative flex-1 h-[120px] flex border border-[#E7E7E7] rounded-lg ${
            !focus && formData?.trim() !== "" ? "bg-white" : "bg-lightgreen"
          } overflow-hidden`}
        >
          <Textarea
            id="propertyDescription"
            value={formData}
            onChange={(e) =>
              handleChange({
                id: "propertyDescription",
                value: e.target.value,
                slug,
              })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="w-full h-full max-h-32 resize-none pl-4 pr-3 py-4 border-r rounded-lg font-semibold text-sm overflow-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />

          <div
            className={`shrink-0 flex items-center justify-center w-[61px] h-[120px] px-1 bg-lightgreen border-black border-opacity-10 rounded-tr-lg rounded-br-lg ${
              !focus && formData?.trim() !== ""
                ? "bg-white bg-opacity-10"
                : "bg-lightgreen"
            }`}
          >
            <div
              className={`relative w-4 h-4 mr-1 ${
                !focus && formData?.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData?.trim() !== "" ? "running" : "paused",
              }}
            >
              <Image
                src="/assets/logo/propex-coin.png"
                alt="propex-coin"
                fill
                sizes="16px"
                className={`object-cover ${
                  !focus && formData?.trim() !== ""
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              />
            </div>
            <span
              className={`text-deepteal text-xs lg:text-sm font-semibold ${
                !focus && formData?.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData?.trim() !== "" ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>
        </div>
        <p
          className={cnm(
            `absolute font-regular text-[#6D6D6D] transition-all duration-300 z-[10] pointer-events-none bg-white px-1 inline-block`,
            focus || formData
              ? "text-xs -top-3 left-3"
              : "text-sm translate-y-2 left-3 top-2"
          )}
        >
          {placeholder}
          <span className="text-[#F60000]"> *</span>
        </p>
      </Combobox>
    </div>
  );
};

const CoolInputLandArea = ({
  formData,
  focus,
  setFocus,
  handleChange,
  placeholder,
  slug,
}) => {
  return (
    <Combobox as="div" className="w-full h-full flex-col">
      <div className="relative flex w-full h-14 gap-2 mb-4">
        <div
          className={`relative w-full h-full border ${
            !focus && formData.trim() !== "" ? "bg-white" : "bg-lightgreen"
          } flex rounded-lg overflow-hidden`}
        >
          <ComboboxInput
            id="landArea"
            onChange={(e) =>
              handleChange({ id: "landArea", value: e.target.value, slug })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={formData}
            className="grow w-full h-full border-r py-2 rounded-lg transition-all duration-300 pl-4 pr-10 sm:px-4 font-semibold text-sm"
          />

          <div
            className={`shrink-0 flex items-center justify-center w-[61px] px-1 h-14 bg-lightgreen border-black border-opacity-10 rounded-tr-lg rounded-br-lg ${
              !focus && formData.trim() !== ""
                ? "bg-white bg-opacity-10"
                : "bg-lightgreen"
            }`}
          >
            <div
              className={`relative w-4 h-4 mr-1 ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              <Image
                src="/assets/logo/propex-coin.png"
                alt="propex-coin"
                fill
                sizes="16px"
                className={`object-cover ${
                  !focus && formData.trim() !== ""
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              />
            </div>
            <span
              className={`text-deepteal text-xs lg:text-sm font-semibold ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>

          <div className={`absolute right-[72px] top-4`}>
            <SvgIcon
              src="/assets/icons/amenities/m2-icon.svg"
              className={cnm(
                "w-5 h-5 bg-mossgreen transition-transform duration-300"
              )}
            />
          </div>
        </div>
        <p
          className={cnm(
            `absolute font-regular text-[#6D6D6D] transition-all duration-300 pointer-events-none bg-white px-1 inline-block`,
            focus || formData
              ? "text-xs -top-2 left-3"
              : "text-sm top-1/2 -translate-y-1/2 left-4"
          )}
        >
          {placeholder}
          <span className="text-red-700">*</span>
        </p>
      </div>
    </Combobox>
  );
};

const CoolInputBuildingSize = ({
  formData,
  focus,
  setFocus,
  handleChange,
  placeholder,
  slug,
}) => {
  return (
    <Combobox as="div" className="w-full h-full flex-col">
      <div className="relative flex w-full h-14 gap-2 mb-4">
        <div
          className={`relative w-full h-full border ${
            !focus && formData.trim() !== "" ? "bg-white" : "bg-lightgreen"
          } flex rounded-lg overflow-hidden`}
        >
          <ComboboxInput
            id="buildingSize"
            onChange={(e) =>
              handleChange({ id: "buildingSize", value: e.target.value, slug })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={formData}
            className="grow w-full h-full border-r py-2 pl-4 pr-11 sm:px-4 rounded-lg transition-all duration-300 font-semibold text-sm"
          />

          <div
            className={`shrink-0 flex items-center justify-center w-[61px] px-1 h-14 bg-lightgreen border-black border-opacity-10 rounded-tr-lg rounded-br-lg ${
              !focus && formData.trim() !== ""
                ? "bg-white bg-opacity-10"
                : "bg-lightgreen"
            }`}
          >
            <div
              className={`relative w-4 h-4 mr-1 ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              <Image
                src="/assets/logo/propex-coin.png"
                alt="propex-coin"
                fill
                sizes="16px"
                className={`object-cover ${
                  !focus && formData.trim() !== ""
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              />
            </div>
            <span
              className={`text-deepteal text-xs lg:text-sm font-semibold ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>

          <div className={`absolute right-[72px] top-4`}>
            <SvgIcon
              src="/assets/icons/amenities/m2-icon.svg"
              className={cnm(
                "w-5 h-5 bg-mossgreen transition-transform duration-300"
              )}
            />
          </div>
        </div>
        <p
          className={cnm(
            `absolute font-regular overflow-hidden text-ellipsis whitespace-nowrap text-[#6D6D6D] transition-all duration-300 z-[30] pointer-events-none bg-white px-1 inline-block`,
            focus || formData
              ? "text-xs -top-2 left-3"
              : "text-sm top-1/2 -translate-y-1/2 left-4"
          )}
        >
          {placeholder}
          {/* <span className="text-red-700">*</span> */}
        </p>
      </div>
    </Combobox>
  );
};

const CoolInputPrice = ({
  formData,
  focus,
  setFocus,
  handleChange,
  placeholder,
  slug,
}) => {
  return (
    <Combobox as="div" className="w-full h-full flex-col">
      <div className="relative flex w-full h-14 gap-2 mb-4">
        <div
          className={`relative w-full h-full border ${
            !focus && formData.trim() !== "" ? "bg-white" : "bg-lightgreen"
          } flex rounded-lg overflow-hidden`}
        >
          <ComboboxInput
            id="sellingPrice"
            onChange={(e) =>
              handleChange({ id: "sellingPrice", value: e.target.value, slug })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={formData}
            className="grow w-full h-full border-r py-2 rounded-lg transition-all duration-300 pl-12 pr-4 font-semibold text-sm"
          />

          <div
            className={`shrink-0 flex items-center justify-center w-[61px] px-1 h-14 bg-lightgreen border-black border-opacity-10 rounded-tr-lg rounded-br-lg ${
              !focus && formData.trim() !== ""
                ? "bg-white bg-opacity-10"
                : "bg-lightgreen"
            }`}
          >
            <div
              className={`relative w-4 h-4 mr-1 ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              <Image
                src="/assets/logo/propex-coin.png"
                alt="propex-coin"
                fill
                sizes="16px"
                className={`object-cover ${
                  !focus && formData.trim() !== ""
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              />
            </div>
            <span
              className={`text-deepteal text-xs lg:text-sm font-semibold ${
                !focus && formData.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && formData.trim() !== "" ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>

          <div className="absolute left-5 top-[18px] transition-transform duration-300">
            <SvgIcon
              src="/assets/icons/rupiah-icon.svg"
              className={cnm(
                "w-[19px] h-[19px] bg-mossgreen transition-transform duration-300"
              )}
            />
          </div>
        </div>
        <p
          className={cnm(
            `absolute font-regular text-[#6D6D6D] transition-all duration-300 pointer-events-none bg-white px-1 inline-block`,
            focus || formData
              ? "text-xs -top-3 left-3"
              : "text-sm top-1/2 -translate-y-1/2 left-12"
          )}
        >
          {placeholder}
          <span className="text-red-700">*</span>
        </p>
      </div>
    </Combobox>
  );
};

const CoolDatePicker = ({
  id,
  formDataValue,
  handleDateChange,
  startDate,
  focus,
  setFocus,
  placeHolder,
  classNameContainer,
  slug,
}) => {
  return (
    <div
      className={cnm("relative w-full h-full mt-2 mb-4", classNameContainer)}
    >
      <div className="relative w-full h-full">
        <div
          className={`relative w-full h-14 border rounded-lg flex justify-start items-center`}
        >
          <DatePicker
            id={id}
            selected={formDataValue || startDate}
            onChange={(date) => handleDateChange({ id, value: date, slug })}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className="flex-1 border rounded-lg h-14 z-10 pl-12 text-sm w-full"
            popperClassName="custom-datepicker-popper"
            popperPlacement="bottom-start"
            wrapperClassName="flex-1"
            portalId=""
          />
          <div className="overflow-hidden h-full rounded-lg">
            <div
              className={`shrink-0 items-center justify-center w-[61px] px-1 h-14 flex ${
                !focus && formDataValue
                  ? "bg-white bg-opacity-10"
                  : "bg-lightgreen"
              }`}
            >
              <div
                className={`relative w-4 h-4 mr-1 ${
                  !focus && formDataValue ? "animate-jump" : ""
                }`}
                style={{
                  animationPlayState:
                    !focus && formDataValue ? "running" : "paused",
                }}
              >
                <Image
                  src="/assets/logo/propex-coin.png"
                  alt="propex-coin"
                  fill
                  sizes="16px"
                  className={`object-cover ${
                    !focus && formDataValue ? "opacity-50" : "opacity-100"
                  }`}
                />
              </div>
              <span
                className={`text-deepteal text-xs lg:text-sm font-semibold ${
                  !focus && formDataValue ? "animate-jump" : ""
                }`}
                style={{
                  animationPlayState:
                    !focus && formDataValue ? "running" : "paused",
                }}
              >
                20
              </span>
            </div>
          </div>

          <div className={`absolute left-4 translate-y-1`}>
            <SvgIcon
              src="/assets/icons/date-icon.svg"
              className={cnm("w-6 h-6 bg-mossgreen")}
            />
          </div>
        </div>

        <p
          className={`absolute font-regular text-[#6D6D6D] transition-all duration-300 pointer-events-none bg-white inline-block ${
            focus || formDataValue
              ? "text-xs -top-3 left-3 px-1"
              : "text-sm top-1/2 -translate-y-1/2 left-12"
          }`}
        >
          {placeHolder}
          <span className="text-[#F60000]">*</span>
        </p>
      </div>
    </div>
  );
};

const AmenitiesComponent = () => {
  const {
    amenitiesOption,
    toggleAmenity,
    setPropertyFormZustand,
    addPointsActivity,
    removePointsActivity,
  } = useFormsStore();

  const [hasSelectAmenities, setHasSelectAmenities] = useState(false);

  // Handle amenity selection
  const handleSelectAmenity = (id) => {
    toggleAmenity(id);
  };

  // Calculate if points should be added or removed based on selected amenities
  useEffect(() => {
    const selectedAmenityNames = amenitiesOption
      .filter((amenity) => amenity.selected)
      .map((amenity) => amenity.name);

    setPropertyFormZustand("amenities", selectedAmenityNames);

    if (selectedAmenityNames.length > 0) {
      addPointsActivity("amenities", "amenities_tier_two", 10);
      setHasSelectAmenities(true);
    } else {
      removePointsActivity("amenities_tier_two");
      setHasSelectAmenities(false);
    }
  }, [
    amenitiesOption,
    setPropertyFormZustand,
    addPointsActivity,
    removePointsActivity,
  ]);

  return (
    <div className="w-full h-full mt-4 mb-2">
      <div className="w-full h-full flex gap-2 items-center mb-4">
        <p className="text-black text-left font-semibold">
          Amenities <span className="text-[#F60000]"> *</span>
        </p>
        <div
          className={`flex items-center gap-1 rounded-2xl px-2 py-1 ${
            hasSelectAmenities ? "bg-white bg-opacity-10" : "bg-lightgreen"
          }`}
        >
          <div
            className={`relative w-4 h-4 mr-1 ${
              hasSelectAmenities ? "animate-jump" : ""
            }`}
            style={{
              animationPlayState: hasSelectAmenities ? "running" : "paused",
            }}
          >
            <Image
              src="/assets/logo/propex-coin.png"
              alt="propex-coin"
              fill
              sizes="16px"
              className={`object-cover ${
                hasSelectAmenities ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>
          <span
            className={`text-deepteal text-xs lg:text-sm font-semibold ${
              hasSelectAmenities ? "animate-jump" : ""
            }`}
            style={{
              animationPlayState: hasSelectAmenities ? "running" : "paused",
            }}
          >
            10
          </span>
        </div>
      </div>

      <div className="w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {amenitiesOption.map(({ id, name, src, selected }) => (
          <div
            key={id}
            className={`w-full h-[105px] sm:h-[138px] py-2 flex flex-col items-center justify-center border rounded-lg font-open-sauce text-sm cursor-pointer ${
              selected ? "bg-[#F7F8F9] border-black" : "border-gray-300"
            }`}
            onClick={() => handleSelectAmenity(id)}
          >
            <SvgIcon src={src} className="w-[48px] h-[67px] mb-2 bg-black" />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
