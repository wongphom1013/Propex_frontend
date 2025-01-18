"use client";

import SvgIcon from "@/app/_components/utils/SvgIcon";
import { Dialog, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { cnm } from "@/utils/style";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Spinner from "../elements/Spinner";
import { ImageUp, X } from "lucide-react";
import { nanoid } from "nanoid";
import CoolInputPoints from "../input/CoolInputPoints";
import { useRefreshTrigger } from "../../_providers/RefreshProvider";
import { propexAPI } from "../../_api/propex";
import { useActiveAccount } from "thirdweb/react";
import { Skeleton } from "@nextui-org/react";

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB

export const editProfileModalAtom = atom({
  isOpen: false,
  userPreData: {
    name: "",
    email: "",
    imageUrl: "",
  },
});

export default function EditProfileModal() {
  const [profileModal, setProfileModal] = useAtom(editProfileModalAtom);
  const [username, setUsername] = useState(profileModal.userPreData.name);
  const [email, setEmail] = useState(profileModal.userPreData.email);
  const [isOpen, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const activeAccount = useActiveAccount();
  const { triggerRefresh } = useRefreshTrigger();
  const [isEditDataLoading, setEditDataLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  function close() {
    if (!username || !email) {
      return toast.error("Username and email is mandatory");
    }

    setProfileModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
    setOpen(false);
  }

  const handleUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NEW
      );
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME_NEW}/image/upload`,
        formData
      );

      return data?.secure_url;
    } catch (error) {
      toast.error("Error while uploading your image, please try again");
      throw error;
    }
  };

  function handleUsername(e) {
    const value = e.target.value;
    setUsername(value);
  }

  function handleEmail(e) {
    const value = e.target.value;
    setEmail(value);
  }

  async function submitProfile() {
    if (!username) {
      return toast.error("Username must be provided");
    }

    if (!email) {
      return toast.error("Email must be provided");
    }

    if (!activeAccount) {
      return toast.error("Wallet is not connected, please connect first");
    }

    setSubmitting(true);
    try {
      const uploadedImage =
        profilePicture && profilePicture.startsWith("https://")
          ? profilePicture
          : profilePictureFile
          ? await handleUpload(profilePictureFile)
          : "";

      const { data } = await propexAPI.post("/user/update", {
        address: activeAccount?.address,
        data: {
          email,
          username,
          imageUrl: uploadedImage,
        },
      });
      if (data?.isEmailUsed) {
        return toast.error(data?.message);
      }
      if (profileModal.type === "create") {
        toast.success("Your profile has been created");
      } else {
        toast.success("Your profile has been updated");
      }
      close();
    } catch (e) {
      toast.error("Error while creating profile");
    } finally {
      setSubmitting(false);
      triggerRefresh();
    }
  }

  useEffect(() => {
    let objectUrl;
    if (profileModal.isOpen) {
      setOpen(true);
      setUsername(profileModal.userPreData.name);
      setEmail(profileModal.userPreData.email || "");

      if (profileModal.userPreData.email.trim() !== "") {
        setIsDisabled(true);
      }

      if (profileModal.userPreData.imageUrl) {
        axios
          .get(profileModal.userPreData.imageUrl, {
            responseType: "blob",
          })
          .then((response) => {
            const file = new File([response.data], `pp-${nanoid(8)}.jpg`, {
              type: response.data.type,
            });
            objectUrl = URL.createObjectURL(file);
            setProfilePicture(objectUrl);
            setProfilePictureFile(file);
          })
          .catch((error) => {
            console.error("Error downloading the image:", error);
          });
      }

      setEditDataLoading(true);
      propexAPI
        .get(`/user?address=${activeAccount?.address}`)
        .then((response) => {
          const { email, name, imageUrl } = response.data?.userData || {};
          setEmail(email || "");
          setUsername(name || "");
          setProfilePicture(imageUrl || "");

          if (email.trim() !== "") {
            setIsDisabled(true);
          }
        })
        .catch((error) => {
          console.error("Error get user data", error);
        })
        .finally(() => {
          setEditDataLoading(false);
        });
    } else {
      setProfilePicture(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    activeAccount?.address,
    profileModal.isOpen,
    profileModal.userPreData.email,
    profileModal.userPreData.imageUrl,
    profileModal.userPreData.name,
  ]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image size should not exceed 1.5 MB");
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setProfilePicture(objectUrl);
      setProfilePictureFile(file);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={close}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
      >
        <DialogPanel className="max-w-[568px] bg-white rounded-xl overflow-hidden w-full">
          <div>
            <div className="border-b py-3 px-5 flex items-center justify-between">
              <button
                onClick={close}
                className="flex items-center hover:opacity-90"
              >
                <SvgIcon
                  src={"/assets/icons/x.svg"}
                  className={"w-5 h-5 bg-black"}
                />
              </button>
              <p className="font-medium mx-auto select">Edit Your Profile</p>
            </div>

            <div className="w-full max-h-[70vh] overflow-y-auto p-4 lg:p-8">
              {/* Profile Picture Dropzone */}
              <div className="w-full flex items-center justify-center">
                {isEditDataLoading ? (
                  <Skeleton className="size-32 rounded-full bg-neutral-200" />
                ) : (
                  <div
                    {...getRootProps()}
                    className={cnm(
                      "group shrink-0 size-32 rounded-full bg-neutral-200 hover:bg-neutral-300 relative flex items-center justify-center cursor-pointer",
                      isDragActive && "bg-gray-300"
                    )}
                  >
                    <input {...getInputProps()} />
                    {profilePicture ? (
                      <>
                        <Image
                          src={profilePicture}
                          alt="Profile Picture"
                          fill
                          sizes="128px"
                          className="w-full h-full rounded-full object-cover"
                          onLoad={() => {
                            setImageLoaded(true);
                          }}
                        />
                        {!isImageLoaded && (
                          <Skeleton
                            className={cnm(
                              "w-full absolute h-full rounded-full bg-neutral-300",
                              "pointer-events-none"
                            )}
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full rounded-full relative flex items-center justify-center">
                        <ImageUp className="size-6 text-neutral-500" />
                      </div>
                    )}

                    {profilePicture && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setProfilePicture(null);
                          setProfilePictureFile(null);
                        }}
                        className="hidden group-hover:flex absolute top-0 right-3 border bg-white rounded-full w-7 aspect-square items-center justify-center"
                      >
                        <X className="size-4 text-black" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="w-full flex flex-col gap-4 mt-8">
                {/* Input with points */}
                <CoolInputPoints
                  name="username"
                  value={username}
                  containerClassname={
                    "items-start -m-[1px] rounded-md bg-white relative"
                  }
                  label={
                    <div className="relative">
                      Username{" "}
                      <span className="absolute -right-[12%] text-xs text-red-500">
                        *
                      </span>
                    </div>
                  }
                  handleChange={handleUsername}
                  labelClassname={
                    "-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"
                  }
                  points={20}
                  absoluteEl={() =>
                    isEditDataLoading ? (
                      <div className="right-20 top-1/2 -translate-y-1/2 absolute">
                        <Spinner
                          className={"size-5 text-neutral-200 fill-neutral-300"}
                        />
                      </div>
                    ) : null
                  }
                />

                {/*  */}
                <CoolInputPoints
                  name="email"
                  value={email}
                  containerClassname={
                    "items-start -m-[1px] rounded-md bg-white relative"
                  }
                  label={
                    <div className="relative">
                      Email{" "}
                      <span className="absolute -right-[8px] text-xs text-red-500">
                        *
                      </span>
                    </div>
                  }
                  handleChange={handleEmail}
                  labelClassname={
                    "-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"
                  }
                  rootClassname={isDisabled ? "bg-gray-400" : ""}
                  points={20}
                  absoluteEl={() =>
                    isEditDataLoading ? (
                      <div className="right-20 top-1/2 -translate-y-1/2 absolute">
                        <Spinner
                          className={"size-5 text-neutral-200 fill-neutral-300"}
                        />
                      </div>
                    ) : null
                  }
                  isDisable={isDisabled}
                />
              </div>

              {/* Save */}
              <button
                onClick={submitProfile}
                disabled={!username || submitting}
                className={cnm(
                  "mt-8 w-full bg-mossgreen text-lemongrass rounded-lg h-[54px] font-semibold flex items-center justify-center hover:bg-mossgreen/90",
                  "disabled:bg-neutral-100 disabled:text-neutral-400"
                )}
              >
                {submitting ? (
                  <div className="w-full flex justify-center">
                    <Spinner
                      className={
                        "size-5 text-lemongrass-200 fill-mossgreen-900"
                      }
                    />
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
