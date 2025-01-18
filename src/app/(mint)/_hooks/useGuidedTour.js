import { driver } from "driver.js";
import { useRef } from "react";
import "driver.js/dist/driver.css";

/**
 *
 * @param {import("driver.js").Config} config
 * @returns
 */
export const useGuidedTour = (config) => {
  const driverObj = useRef(
    driver({
      animate: true,
      overlayOpacity: 0.5,
      showProgress: true,
      doneBtnText: "Finish",
      closeBtnText: "Close",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      popoverClass: "propex-theme",
      ...config,
    })
  );

  return driverObj.current;
};
