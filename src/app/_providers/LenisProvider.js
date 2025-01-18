"use client";

import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { lenisAtom } from "@/store/lenis-store";

export function LenisProvider(props) {
  const [_lenis, setLenis] = useAtom(lenisAtom);

  useEffect(() => {
    let lenis = new Lenis(props.opts);

    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.opts]);
  return null;
}
