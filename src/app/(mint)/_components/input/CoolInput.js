"use client";

import { cnm } from "@/utils/style";
import { useEffect, useState } from "react";

export default function CoolInput({
  textArea,
  label,
  toLabel,
  value,
  handleChange,
  name,
  textAreaClassname,
  inputClassname,
  labelClassname,
  containerClassname,
  placeholder = "",
  onFocus,
  onBlur,
  isDisable = false,
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

  function onFocusHandle() {
    setFocus(true);
    onFocus?.();
  }

  function onBlurHandle() {
    setFocus(false);
    onBlur?.();
  }

  return (
    <div
      className={cnm(
        "border rounded-md w-full relative flex items-center",
        textArea ? "p-4" : "px-4 py-3",
        containerClassname
      )}
    >
      <div
        className={cnm(
          "absolute text-black/40 text-sm bg-white py-0.5 transition-all pointer-events-none origin-left",
          labelClassname
            ? (focus || value) && labelClassname
            : (focus || value) &&
                "-translate-y-6 -translate-x-3 px-1.5 scale-[0.85]"
        )}
      >
        {currentLabel}
      </div>
      {textArea ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={onFocusHandle}
          onBlur={onBlurHandle}
          placeholder={focus ? placeholder : ""}
          className={cnm(
            "outline-none placeholder:text-sm w-full bg-transparent max-w-full",
            isDisable && "text-neutral-400",
            textAreaClassname
          )}
          disabled={isDisable}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={focus ? placeholder : ""}
          onFocus={onFocusHandle}
          onBlur={onBlurHandle}
          className={cnm(
            "bg-transparent outline-none placeholder:text-sm w-full max-w-full",
            isDisable && "text-neutral-400",
            inputClassname
          )}
          disabled={isDisable}
        />
      )}
    </div>
  );
}
