"use client";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { Combobox, ComboboxInput } from "@headlessui/react";
import Image from "next/image";
import { cnm } from "@/utils/style";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { pdfThumbnailList } from "@/store/image-store";
import dynamic from "next/dynamic";
import { useAnimate, motion } from "framer-motion";
import ViewAddressButton from "../../viewAddress";
import { useFormsStore } from "@/app/(mint)/_store/form-store-zustand";
import { propexAPI } from "@/app/(mint)/_api/propex";
import * as pdfjsLib from "pdfjs-dist";
import { isDemoModeAtom } from "@/app/(mint)/_store/demo-store";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

const ownerOption = ["Property Owner", "Leasehold Owner"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const formatPhoneNumber = (value) => {
  const cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 15);
  return cleanedValue.replace(/(\d{4})(?=\d)/g, "$1-");
};

const CoolPDFInput = dynamic(
  () => import("@/app/_components/propertydetail/form/pdfInput"),
  {
    ssr: false,
  }
);

export default function OwnershipFormPage({
  userProgress,
  setIsFormComplete,
  nftMetaData,
  handleBackButton,
}) {
  const {
    ownershipFormZustand,
    setOwnershipFormZustand,
    addPointsActivity,
    removePointsActivity,
    pointsActivity,
    setHasSelectedOptions,
  } = useFormsStore();
  const [focusOwnerType, setFocusOwnerType] = useState(false);
  const [focusOwnerName, setFocusOwnerName] = useState(false);
  const [focusOwnerEmail, setFocusOwnerEmail] = useState(false);
  const [focusOwnerPhoneNumber, setFocusOwnerPhoneNumber] = useState(false);
  const [pdfThumbnail, setPdfThumbnail] = useAtom(pdfThumbnailList);
  const [ownerQuery, setOwnerQuery] = useState("");
  const [isDemoMode] = useAtom(isDemoModeAtom);
  const filteredOwner =
    (ownerQuery || "") === ""
      ? ownerOption
      : ownerOption.filter((option) =>
          option.toLowerCase().includes(ownerQuery?.toLowerCase() || "")
        );

  const comboboxRef = useRef(null);

  const handleSelect = (e) => {
    const { id, value, slug } = e || {};

    setOwnershipFormZustand(id, value);

    if (value) {
      addPointsActivity(id, slug, 20);
      setHasSelectedOptions(id, true);
    }

    console.log(value, id, slug);

    // reset();
  };

  const handleInputChange = (e) => {
    const { id, value = "", slug } = e;

    setOwnershipFormZustand((prev) => ({ ...prev, [id]: value }));
    setOwnerQuery(value);

    if (!value.trim().includes(ownerOption)) {
      removePointsActivity(slug);
      setHasSelectedOptions(id, false);
    }
  };

  const handleChange = (e) => {
    let { id, value, slug } = e;

    if (id === "ownerPhoneNumber") value = formatPhoneNumber(value);

    setOwnershipFormZustand(id, value);

    if (value.trim() === "") {
      removePointsActivity(slug);
    } else if (value.trim() !== "") {
      addPointsActivity(id, slug, 20);
    }
  };

  // =========== Handling Document pdf upload and remove process =================
  const handleDocumentDrop = async (acceptedFiles, field, slug) => {
    toast.loading("Uploading your pdf...", {
      id: "loadingPdf",
      position: "top-center",
    });

    try {
      const file = acceptedFiles[0];
      console.log(file);
      console.log(acceptedFiles);

      console.log(file.size, MAX_FILE_SIZE, file.size > MAX_FILE_SIZE);
      if (file.size > MAX_FILE_SIZE) {
        return toast.error(
          "File size is too large. Maximum allowed size is 10MB."
        );
      }

      if (file && file.type === "application/pdf") {
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
        console.log(cloudinaryResponse);

        if (status === 200) {
          setOwnershipFormZustand(field, {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
            fileName: cloudinaryResponse.fileName,
            mimeType: cloudinaryResponse.fileType,
            fileHash: cloudinaryResponse.fileHash,
          });

          addPointsActivity(field, slug, 10);
          generatePdfThumbnail(file, field);
        } else {
          toast.error("Something is wrong, please try again.");
        }
      } else {
        toast.error("Please import a PDF file type!");
      }
    } catch (error) {
      console.error("Error handling document drop:", error);
    } finally {
      toast.dismiss("loadingPdf");
    }
  };

  const removeDocumentImage = async (data) => {
    toast.loading("Deleting your pdf...", {
      id: "loadingPdf",
      position: "top-center",
    });

    const { field, slug } = data;

    try {
      const { public_id } = ownershipFormZustand[field];

      if (!public_id) {
        console.log("No public_id found for this field");
        return;
      }

      const { status } = await propexAPI.delete("file/delete-file", {
        data: { public_id },
      });

      if (status === 200) {
        setOwnershipFormZustand(field, {
          url: "",
          public_id: "",
          fileName: "",
          mimeType: "",
          fileHash: "",
        });

        removePointsActivity(slug);

        setPdfThumbnail((prevState) => ({
          ...prevState,
          [field]: {
            name: "",
            size: "",
            image: "",
          },
        }));
      } else {
        toast.error("Could not delete this image, please try again");
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss("loadingPdf");
    }
  };

  const generatePdfThumbnail = (file, field) => {
    const reader = new FileReader();
    reader.onload = () => {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib
        .getDocument(typedArray)
        .promise.then((pdf) => {
          renderPageThumbnail(pdf, file.name, file.size, field);
        })
        .catch((error) => {
          console.error("Error loading PDF:", error);
        });
    };
    reader.readAsArrayBuffer(file);
  };

  const renderPageThumbnail = async (pdf, pdfName, pdfSize, field) => {
    try {
      pdfSize = formatFileSize(pdfSize);
      const canvas = document.createElement("canvas");
      const scale = 0.5;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;

      const imageDataUrl = canvas.toDataURL();
      setPdfThumbnail((prevState) => ({
        ...prevState,
        [field]: {
          name: pdfName,
          size: pdfSize,
          image: imageDataUrl,
        },
      }));
    } catch (error) {
      console.error("Error rendering page thumbnail:", error);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const {
    getRootProps: getDocumentImageRootProps,
    getInputProps: getDocumentImageInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) =>
      handleDocumentDrop(acceptedFiles, "documentPdf", "document_pdf_tier_two"),
    accept: "application/pdf",
    multiple: false,
  });

  const {
    getRootProps: getSpptPBBRootProps,
    getInputProps: getSpptPBBInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) =>
      handleDocumentDrop(acceptedFiles, "spptPBB", "sppt_pbb_tier_two"),
    accept: "application/pdf",
    multiple: false,
  });

  const {
    getRootProps: getOwnerIdentityCardRootProps,
    getInputProps: getOwnerIdentityCardInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) =>
      handleDocumentDrop(
        acceptedFiles,
        "ownerIdentityCard",
        "owner_identity_card_tier_two"
      ),
    accept: "application/pdf",
    multiple: false,
  });

  const {
    getRootProps: getOwnerFamilyCardRootProps,
    getInputProps: getOwnerFamilyCardInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) =>
      handleDocumentDrop(
        acceptedFiles,
        "ownerFamilyCard",
        "owner_family_card_tier_two"
      ),
    accept: "application/pdf",
    multiple: false,
  });

  const formValidator = () => {
    let requiredFields = [
      "ownerType",
      "ownerName",
      "documentPdf",
      "spptPBB",
      "ownerIdentityCard",
      "ownerFamilyCard",
    ];

    // Validate that all required fields are present in the pointsActivity by checking the 'name' field
    const isValid = requiredFields.every((field) =>
      pointsActivity.some((activity) => activity.name === field)
    );

    if (isValid) {
      setIsFormComplete(true);
      return true;
    } else {
      setIsFormComplete(false);
      return false;
    }
  };

  useEffect(() => {
    formValidator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownershipFormZustand]);

  useEffect(() => {
    if (focusOwnerType) {
      const combobox = comboboxRef.current;
      if (combobox) {
        const options = combobox.querySelector("ul");
        if (options) {
          options.style.display = "block";
        }
      }
    }
  }, [focusOwnerType]);

  if (userProgress !== "ownershipForm") return null;

  const autoFillFormHandler = async () => {
    toast.loading("Autofilling the form and uploading the PDF...", {
      id: "loadingAutofill",
      position: "top-center",
    });

    handleSelect({
      id: "ownerType",
      value: "Property Owner",
      slug: "owner_type_tier_two",
    });
    handleChange({
      id: "ownerName",
      value: "John Doe",
      slug: "owner_name_tier_two",
    });
    handleChange({
      id: "ownerEmail",
      value: "johndoe@example.com",
      slug: "owner_email_tier_two",
    });
    handleChange({
      id: "ownerPhoneNumber",
      value: "+1234-5678-9012",
      slug: "owner_phone_number_tier_two",
    });

    try {
      const response = await fetch("/assets/pdf/sample.pdf");
      const blob = await response.blob();

      const pdfFile = new File([blob], "sample.pdf", {
        type: "application/pdf",
      });

      // documentPDF
      await handleDocumentDrop(
        [pdfFile],
        "documentPdf",
        "document_pdf_tier_two"
      );

      // spptPBB
      await handleDocumentDrop([pdfFile], "spptPBB", "sppt_pbb_tier_two");

      // ownerIdentityCard
      await handleDocumentDrop(
        [pdfFile],
        "ownerIdentityCard",
        "owner_identity_card_tier_two"
      );

      // ownerFamilyCard
      await handleDocumentDrop(
        [pdfFile],
        "ownerFamilyCard",
        "owner_family_card_tier_two"
      );

      toast.success("Form autofilled and PDF uploaded successfully!");
    } catch (error) {
      console.error("Error in autofill handler:", error);
      toast.error("Autofill failed. Please try again.");
    } finally {
      toast.dismiss("loadingAutofill");
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center overflow-hidden font-open-sauce pb-20">
      <div className="w-full h-full mb-8 px-4">
        <ViewAddressButton
          userProgress={userProgress}
          nftMetaData={nftMetaData}
          handleBackButton={handleBackButton}
        />
      </div>

      {/* Ownership Forms */}
      <div className="w-full max-w-[1480px] h-full px-5 lg:px-12">
        <div className="w-full h-full px-5 lg:px-12 flex justify-center items-center sm:mt-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-8 h-8 p-[2px] bg-mossgreen text-white rounded-full">
              <div className="w-full h-full rounded-full border border-white flex items-center justify-center">
                <span className="font-semibold text-lemongrass text-sm">1</span>
                <span className="absolute -bottom-6 font-semibold text-mossgreen text-sm">
                  Ownership
                </span>
              </div>
            </div>
            <div className="flex-1 h-1 min-w-[50px] w-full lg:w-[200px] bg-black rounded-lg bg-opacity-40"></div>
            <div className="relative flex items-center justify-center w-8 h-8 bg-black bg-opacity-40 text-white rounded-full">
              <span className="font-semibold text-sm">2</span>
              <span className="absolute -bottom-6 font-semibold text-black text-opacity-40 text-sm">
                Property
              </span>
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

        {/* Form */}
        <div className="w-full h-full max-w-[628px] flex flex-col items-center justify-center mt-14 sm:mt-20 mx-auto sm:mb-20">
          <p className="text-2xl text-black font-semibold">Ownership Details</p>
          {isDemoMode && (
            <button
              onClick={autoFillFormHandler}
              className="px-4 py-2 bg-mossgreen text-white rounded-md mt-4"
            >
              Auto Fill
            </button>
          )}

          <div className="w-full mt-4 mb-4">
            <p className="text-black text-left font-semibold">Owner Details</p>
            <CoolSelectInput
              id={"ownerType"}
              formData={ownershipFormZustand?.ownerType}
              focus={focusOwnerType}
              setFocus={setFocusOwnerType}
              handleInputChange={handleInputChange}
              handleSelect={handleSelect}
              placeholder={`Owner's Type`}
              filteredData={filteredOwner}
              slug={"owner_type_tier_two"}
            />
            <CoolInput
              id={"ownerName"}
              formData={ownershipFormZustand?.ownerName}
              focus={focusOwnerName}
              setFocus={setFocusOwnerName}
              handleChange={handleChange}
              placeholder={"Name"}
              isRequiredField={true}
              slug={"owner_name_tier_two"}
            />
            <CoolInput
              id={"ownerEmail"}
              formData={ownershipFormZustand?.ownerEmail}
              focus={focusOwnerEmail}
              setFocus={setFocusOwnerEmail}
              handleChange={handleChange}
              placeholder={"Email"}
              isRequiredField={false}
              slug={"owner_email_tier_two"}
            />
            <CoolInput
              id={"ownerPhoneNumber"}
              formData={ownershipFormZustand?.ownerPhoneNumber}
              focus={focusOwnerPhoneNumber}
              setFocus={setFocusOwnerPhoneNumber}
              handleChange={handleChange}
              placeholder={"Phone Number"}
              isRequiredField={false}
              slug={"owner_phone_number_tier_two"}
            />
          </div>

          <div className="w-full h-full flex flex-col justify-center items-center gap-4 mt-4">
            <div className="w-full h-full max-h-[225px] mb-4">
              <CoolPDFInput
                documentImage={ownershipFormZustand?.documentPdf.url}
                pdfThumbnail={pdfThumbnail?.documentPdf.image}
                pdfName={pdfThumbnail?.documentPdf.name}
                pdfSize={pdfThumbnail?.documentPdf.size}
                field={"documentPdf"}
                removeDocumentImage={removeDocumentImage}
                getDocumentImageRootProps={getDocumentImageRootProps}
                getDocumentImageInputProps={getDocumentImageInputProps}
                title={"Master leasehold / House Certificate"}
                slug={"document_pdf_tier_two"}
              />
            </div>

            <div className="w-full h-full max-h-[225px] mb-4">
              <CoolPDFInput
                documentImage={ownershipFormZustand?.spptPBB.url}
                pdfThumbnail={pdfThumbnail?.spptPBB.image}
                pdfName={pdfThumbnail?.spptPBB.name}
                pdfSize={pdfThumbnail?.spptPBB.size}
                field={"spptPBB"}
                removeDocumentImage={removeDocumentImage}
                getDocumentImageRootProps={getSpptPBBRootProps}
                getDocumentImageInputProps={getSpptPBBInputProps}
                title={"SPPT PBB"}
                slug={"sppt_pbb_tier_two"}
              />
            </div>

            <div className="w-full h-full max-h-[225px] mb-4">
              <CoolPDFInput
                documentImage={ownershipFormZustand?.ownerIdentityCard.url}
                pdfThumbnail={pdfThumbnail?.ownerIdentityCard.image}
                pdfName={pdfThumbnail?.ownerIdentityCard.name}
                pdfSize={pdfThumbnail?.ownerIdentityCard.size}
                field={"ownerIdentityCard"}
                removeDocumentImage={removeDocumentImage}
                getDocumentImageRootProps={getOwnerIdentityCardRootProps}
                getDocumentImageInputProps={getOwnerIdentityCardInputProps}
                title={"Property Owner's Identity Card"}
                slug={"owner_identity_card_tier_two"}
              />
            </div>

            <div className="w-full h-full max-h-[225px] mb-4">
              <CoolPDFInput
                documentImage={ownershipFormZustand?.ownerFamilyCard.url}
                pdfThumbnail={pdfThumbnail?.ownerFamilyCard.image}
                pdfName={pdfThumbnail?.ownerFamilyCard.name}
                pdfSize={pdfThumbnail?.ownerFamilyCard.size}
                field={"ownerFamilyCard"}
                removeDocumentImage={removeDocumentImage}
                getDocumentImageRootProps={getOwnerFamilyCardRootProps}
                getDocumentImageInputProps={getOwnerFamilyCardInputProps}
                title={"Property Owner's Family Card"}
                slug={"owner_family_card_tier_two"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CoolInput = ({
  id,
  formData,
  focus,
  setFocus,
  handleChange,
  placeholder,
  isRequiredField,
  slug,
}) => {
  return (
    <Combobox as="div" className="w-full h-full flex-col">
      <div className="flex w-full h-full gap-2">
        <div className="relative w-full h-14 mt-4">
          <div
            className={`relative w-full h-full border rounded-lg flex overflow-hidden ${
              !focus && formData.trim() !== "" ? "bg-white" : "bg-lightgreen"
            }`}
          >
            <ComboboxInput
              id={id}
              onChange={(e) =>
                handleChange({ id, value: e.target.value, slug })
              }
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              value={formData}
              className="grow w-full h-full border-r py-2 px-3 rounded-lg transition-all duration-300 pl-4 font-semibold text-sm"
            />

            <div
              className={`shrink-0 items-center justify-center w-[61px] px-1 h-14 flex ${
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
          </div>
          <p
            className={cnm(
              `absolute font-normal text-[#B0B0B0] transition-all duration-300 z-[30] pointer-events-none bg-white px-1 inline-block`,
              focus || formData
                ? "text-xs -top-2 left-3"
                : "text-sm top-1/2 -translate-y-1/2 left-4"
            )}
          >
            {placeholder}{" "}
            {isRequiredField && <span className="text-[#F60000]"> *</span>}
          </p>
        </div>
      </div>
    </Combobox>
  );
};

const CoolSelectInput = ({
  id,
  formData,
  focus,
  setFocus,
  handleInputChange,
  handleSelect,
  placeholder,
  filteredData,
  slug,
}) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (scope.current && focus) {
      animate(scope.current, { height: "auto", opacity: 1 }, { duration: 3 });
    } else if (scope.current && !focus) {
      animate(scope.current, { height: 0, opacity: 0 }, { duration: 3 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const { hasSelectedOptions } = useFormsStore();

  return (
    <div className="relative w-full h-14 mt-4">
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
            value={formData}
            onChange={(e) =>
              handleInputChange({ id, value: e.target.value, slug })
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            className="grow w-full h-full border-r py-2 px-4 text-sm rounded-lg transition-all duration-300 font-semibold"
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
                !focus && formData?.trim() !== "" ? "animate-jump" : ""
              }`}
              style={{
                animationPlayState:
                  !focus && hasSelectedOptions[id] ? "running" : "paused",
              }}
            >
              20
            </span>
          </div>
          <div className={`absolute right-[72px] translate-y-1/2`}>
            <Image
              src="/assets/icons/arrow-down-dropdown.svg"
              className={cnm(
                "w-6 h-6 transition-transform duration-300",
                !focus && hasSelectedOptions[id] ? "rotate-180" : "rotate-0"
              )}
              alt="dropdown arrow"
              width={24}
              height={24}
            />
          </div>
        </div>

        <p
          className={`absolute font-normal text-black/40 transition-all duration-300 z-[10] pointer-events-none bg-white inline-block ${
            focus || formData
              ? "text-xs -top-3 left-3 px-1"
              : "text-sm top-1/2 -translate-y-1/2 left-4 px-2"
          }`}
        >
          {placeholder}
          <span className="text-[#F60000]"> *</span>
        </p>

        {focus && (
          <motion.div
            className="absolute bg-white border mt-1 rounded-lg shadow-lg z-50"
            style={{
              overflow: "hidden",
              height: "auto",
              width: "calc(100% - 61px)",
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
                  onClick={() => handleSelect({ id: id, value: option, slug })}
                  className="cursor-pointer h-[54px] text-sm select-none px-4 py-2 hover:bg-[#F7F8F9] hover:text-black flex items-center"
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
