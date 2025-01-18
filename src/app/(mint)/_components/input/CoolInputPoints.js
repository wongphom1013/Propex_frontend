"use client";
import PointsStar from "@/assets/account-bar/points-star.svg";
import CoolInput from "./CoolInput";
import { cnm } from "@/utils/style";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMapStore } from "../../_store/maps-store";

export default function CoolInputPoints({
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
  rootClassname,
  placeholder = "",
  absoluteEl,
  points = 20,
  activityName = "Fill Location", // Default activity name
  activitySlug = "fill-location",
  isDisable = false,
  onFocus,
  onBlur,
}) {
  const [isFocus, setFocus] = useState(false);
  const { removePointsActivity, addPointsActivity } = useMapStore();
  const [showGhost, setShowGhost] = useState(false);

  useEffect(() => {
    if (value) {
      addPointsActivity(activityName, activitySlug, points);
    } else {
      removePointsActivity(activitySlug);
    }
  }, [
    value,
    activityName,
    activitySlug,
    points,
    addPointsActivity,
    removePointsActivity,
  ]);

  const handlePointsActivityOnBlur = () => {
    if (value) {
      addPointsActivity(activityName, activitySlug, points);
      setShowGhost(true); // Trigger the ghost animation on blur
    } else {
      removePointsActivity(activitySlug);
    }
  };

  const handleFocus = () => {
    setFocus(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocus(false);
    handlePointsActivityOnBlur();
    onBlur?.();
  };

  return (
    <div
      className={cnm("w-full border rounded-md flex relative", rootClassname)}
    >
      <div
        className={cnm(
          "absolute inset-0 rounded-md transition-colors",
          !isFocus && value ? "bg-neutral-50" : "bg-[#F2FED1]"
        )}
      ></div>
      <CoolInput
        textArea={textArea}
        label={label}
        toLabel={toLabel}
        value={value}
        handleChange={handleChange}
        name={name}
        textAreaClassname={textAreaClassname}
        inputClassname={inputClassname}
        labelClassname={labelClassname}
        containerClassname={cnm(
          "-m-[1px] rounded-md bg-white relative",
          containerClassname
        )}
        placeholder={placeholder}
        onBlur={handleBlur}
        onFocus={handleFocus}
        isDisable={isDisable}
      />
      <div className="relative rounded-r-md grow flex items-center gap-1 px-4 text-mossgreen-800 text-sm font-semibold">
        <PointsStar className="size-3.5" />
        <div className="relative text-mossgreen-800 font-urbanist">
          <motion.div
            className="relative"
            initial={{ y: 0 }}
            animate={showGhost ? { y: [-10, 0] } : { y: 0 }}
            transition={{
              duration: 0.8,
            }}
          >
            {points}
          </motion.div>
          <AnimatePresence>
            {showGhost && (
              <motion.div
                className="absolute flex justify-center items-center inset-0"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -20, opacity: 0 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onAnimationComplete={() => setShowGhost(false)} // Hide the ghost after animation completes
              >
                <p className="text-mossgreen-800/70 font-urbanist">+{points}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {absoluteEl ? absoluteEl(isFocus) : null}
    </div>
  );
}
