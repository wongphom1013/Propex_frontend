"use client";

import { formModalOpenAtom } from "@/store/form-modal-store";
import { Checkbox, Dialog, DialogPanel } from "@headlessui/react";
import { useAtom } from "jotai";
import SvgIcon from "../utils/SvgIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import { lenisAtom } from "@/store/lenis-store";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cnm } from "@/utils/style";
import toast from "react-hot-toast";
import { GOOGLE_SHEETS_SCRIPTS } from "../../../../config";

const clientOccupationList = [
  {
    name: "Buyer",
    value: "Buyer",
  },
  {
    name: "Seller",
    value: "Seller",
  },
  {
    name: "Investor",
    value: "Investor",
  },
  {
    name: "Real Estate Professional",
    value: "Real estate professional",
  },
];

const featureList = [
  { name: "Tokenize your property", value: "Tokenize your property" },
  { name: "Sell your property easily", value: "Sell your property easily" },
  {
    name: "Borrow against your property",
    value: "Borrow against your property",
  },
  { name: "Buy property", value: "Buy property" },
  {
    name: "Real-time property value heatmap",
    value: "Real-time property value heatmap",
  },
  {
    name: "Other",
    value: "",
  },
];

export default function FormModal() {
  const [isOpen, setOpen] = useAtom(formModalOpenAtom);
  const [lenis] = useAtom(lenisAtom);
  const scrollRef = useRef(null);
  const [scrollToBottom, setScrollToBottom] = useState(true);

  const handleScroll = () => {
    if (scrollToBottom) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setScrollToBottom(!scrollToBottom);
  };

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isOpen, lenis]);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-200 data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
        <DialogPanel className="max-w-xl bg-white rounded-lg max-h-[90dvh] overflow-hidden relative">
          <div className="border-b py-3 px-5 flex items-center justify-between">
            <button onClick={close} className="flex items-center">
              <SvgIcon
                src={"/assets/icons/x.svg"}
                className={"w-5 h-5 bg-black"}
              />
            </button>
            <p className="font-medium mx-auto">PropEx Interest Form</p>
          </div>
          <div className="relative">
            <div
              className="max-h-[85vh] overflow-y-auto relative w-full"
              data-lenis-prevent
              ref={scrollRef}
            >
              <MainForm closeModal={close} />
            </div>
          </div>
          <button
            onClick={handleScroll}
            className="bg-mossgreen border-2x border-white w-10 aspect-square rounded-full flex items-center justify-center absolute bottom-7 right-7"
          >
            {scrollToBottom ? (
              <ArrowDown className="text-white w-6 h-6" />
            ) : (
              <ArrowUp className="text-white w-6 h-6" />
            )}
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function MainForm({ closeModal }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    occupations: [],
    features: [],
    hearAbout: "",
    improvements: "",
    receiveUpdates: "",
    feedback: "",
  });
  const [isLoading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOccupationChange = (val) => {
    setFormData({
      ...formData,
      occupations: val,
    });
  };

  const handleFeaturesChange = (val) => {
    setFormData({
      ...formData,
      features: val,
    });
  };

  const handleReceiveUpdatesChange = (val) => {
    setFormData({
      ...formData,
      receiveUpdates: val,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
      toast.error("Full Name is required");
    }
    if (!formData.email) {
      newErrors.email = "Email Address is required";
      toast.error("Email Address is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email Address is invalid";
      toast.error("Email Address is invalid");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const dataToSend = {
          fullName: formData.fullName,
          email: formData.email,
          occupations: formData.occupations
            .map((item) => item.value)
            .join(", "),
          features: formData.features.map((item) => item.value).join(", "),
          hearAbout: formData.hearAbout,
          improvements: formData.improvements,
          receiveUpdates: formData.receiveUpdates,
          feedback: formData.feedback,
        };
        const response = await fetch(GOOGLE_SHEETS_SCRIPTS, {
          method: "POST",
          body: JSON.stringify(dataToSend),
        });
        const result = await response.json();
        if (result.result === "success") {
          toast.success("Form submitted successfully");
          setFormData({
            fullName: "",
            email: "",
            occupation: [],
            features: [],
            hearAbout: "",
            improvements: "",
            receiveUpdates: "",
            feedback: "",
          });
        } else {
          toast.error("Form submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Form submission failed");
      } finally {
        closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6 w-full items-center px-4 md:px-12">
      <div className="flex flex-col items-center text-center gap-3">
        <h2 className="font-medium text-2xl">
          Thank you for your interest in PropEx!{" "}
        </h2>
        <p className="text-sm text-balance text-black/60">
          Please complete this form to help us understand your needs and keep
          you updated on our latest developments
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <CoolInput
          name={"fullName"}
          handleChange={handleChange}
          label={"Full Name"}
          value={formData.fullName}
          labelClassname={"-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <CoolInput
          name={"email"}
          handleChange={handleChange}
          label={"Email"}
          value={formData.email}
          labelClassname={"-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-black/50">Are you interested in PropEx as a?</p>
        <OccupationChecklist
          data={clientOccupationList}
          onChange={handleOccupationChange}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-black/50">
          What features of PropEx are you most interested in?
        </p>
        <FeaturesRadioGroup
          data={featureList}
          onChange={handleFeaturesChange}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <CoolInput
          name="hearAbout"
          value={formData.hearAbout}
          handleChange={handleChange}
          label="How did you hear about PropEx?"
          labelClassname={"-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"}
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <CoolInput
          textArea
          name="improvements"
          value={formData.improvements}
          handleChange={handleChange}
          containerClassname={"items-start"}
          toLabel={"Improvements or additional features"}
          label="What improvements or additional features would you like to see in PropEx?"
          labelClassname={"-translate-y-7 -translate-x-2 px-1.5 scale-[0.85]"}
          textAreaClassname="bg-transparent outline-none placeholder:text-sm w-full min-h-36"
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <p className="text-black/50">
          Would you like to receive updates about PropEx?
        </p>
        <ReceiveUpdatesBoolean onChange={handleReceiveUpdatesChange} />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <CoolInput
          textArea
          name="feedback"
          value={formData.feedback}
          handleChange={handleChange}
          containerClassname={"items-start"}
          label="Any additional comments or feedback?"
          labelClassname={"-translate-y-7 -translate-x-2 px-1.5 scale-[0.85]"}
          textAreaClassname="bg-transparent outline-none placeholder:text-sm resize-none min-h-32 w-full"
        />
      </div>
      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-mossgreen text-lemongrass rounded-lg py-3 w-full flex justify-center mb-16"
      >
        {isLoading ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-lemongrass"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          "Send"
        )}
      </button>
    </div>
  );
}

function OccupationChecklist({ data, onChange }) {
  const [selected, setSelected] = useState([]);

  const handleChange = useCallback(
    (item) => {
      const newSelected = selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item];

      setSelected(newSelected);
      if (onChange) {
        onChange(newSelected);
      }
    },
    [selected, onChange]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Checkbox
            checked={selected.includes(item)}
            onChange={() => handleChange(item)}
            className="cursor-pointer group size-6 rounded border border-black flex items-center justify-center"
          >
            <div className="hidden w-3 aspect-square bg-black group-data-[checked]:block rounded-[2px]"></div>
          </Checkbox>
          <p>{item.name}</p>
        </div>
      ))}
      {/* <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllChecked}
          onChange={handleCheckAll}
          className="cursor-pointer group size-6 rounded border border-black flex items-center justify-center"
        >
          <div className="hidden w-3 aspect-square bg-black group-data-[checked]:block rounded-[2px]"></div>
        </Checkbox>
        <p>Check all that apply</p>
      </div> */}
    </div>
  );
}

function FeaturesRadioGroup({ data, onChange }) {
  const [selected, setSelected] = useState([]);
  const [other, setOther] = useState("");

  const handleChange = useCallback(
    (item) => {
      const newSelected = selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item];

      setSelected(newSelected);
      if (onChange) {
        onChange(newSelected);
      }
    },
    [selected, onChange]
  );

  const handleOtherChange = useCallback(
    (e) => {
      const val = e.target.value;
      setOther(val);

      const excludeOther = selected.filter((item) => item.name !== "Other");
      const newVal = { name: "Other", value: val };
      if (onChange && selected.some((item) => item.name === "Other")) {
        onChange([...excludeOther, newVal]);
      }
    },
    [selected, onChange]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {data.map((item, idx) => (
        <div
          key={idx}
          className={cnm(
            "flex items-center gap-2",
            item.name === "Other" && "items-start"
          )}
        >
          <Checkbox
            checked={selected.includes(item)}
            onChange={() => handleChange(item)}
            className="cursor-pointer group size-6 rounded border border-black flex items-center justify-center"
          >
            <div className="hidden w-3 aspect-square bg-black group-data-[checked]:block rounded-[2px]"></div>
          </Checkbox>
          {item.name === "Other" ? (
            <CoolInput
              handleChange={(e) => {
                handleOtherChange(e);
              }}
              label={"Other"}
              value={other}
              labelClassname={
                "-translate-y-6 -translate-x-2 px-1.5 scale-[0.85]"
              }
              textAreaClassname="bg-transparent outline-none placeholder:text-sm w-full resize-none min-h-20"
            />
          ) : (
            <p>{item.name}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ReceiveUpdatesBoolean({ onChange }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <div
          onClick={() => {
            onChange("No");
            setSelected("no");
          }}
          className="cursor-pointer group size-6 rounded border border-black flex items-center justify-center"
        >
          {selected === "no" && (
            <div className="w-3 aspect-square bg-black rounded-[2px]"></div>
          )}
        </div>
        <p>No</p>
      </div>
      <div className="flex items-center gap-2">
        <div
          onClick={() => {
            onChange("Yes");

            setSelected("yes");
          }}
          className="cursor-pointer group size-6 rounded border border-black flex items-center justify-center"
        >
          {selected === "yes" && (
            <div className="w-3 aspect-square bg-black rounded-[2px]"></div>
          )}
        </div>
        <p>Yes</p>
      </div>
    </div>
  );
}

function CoolInput({
  textArea,
  label,
  toLabel,
  value,
  handleChange,
  name,
  textAreaClassname,
  labelClassname,
  containerClassname,
}) {
  const [focus, setFocus] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);

  useEffect(() => {
    if ((focus || value) && toLabel) {
      setCurrentLabel(toLabel);
    } else {
      setCurrentLabel(label);
    }
  }, [focus, label, toLabel, value]);

  return (
    <div
      className={cnm(
        "border rounded-md w-full relative flex items-center",
        textArea ? "p-4" : "px-4 py-3",
        containerClassname
      )}
    >
      <p
        className={cnm(
          "absolute text-black/40 text-sm bg-white py-0.5 transition-all pointer-events-none origin-left",
          labelClassname
            ? (focus || value) && labelClassname
            : (focus || value) &&
                "-translate-y-6 -translate-x-3 px-1.5 scale-[0.85]"
        )}
      >
        {currentLabel}
      </p>
      {textArea ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={cnm(
            "outline-none placeholder:text-sm w-full bg-transparent max-w-full",
            textAreaClassname
          )}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="bg-transparent outline-none placeholder:text-sm w-full max-w-full"
        />
      )}
    </div>
  );
}
