"use client";

import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

/**
 * NOTE: to mitigate deprecation warning from
 * the deprecated <Marker /> which should be replaced by <AdvancedMarker />
 *
 * TODO: Implement the dragging function first before use
 */
export default function MarkerCustom({ map, position, children, onClick }) {
  const markerRef = useRef();
  const rootRef = useRef();
  useEffect(() => {
    if (!rootRef.current) {
      const container = document.createElement("div");
      rootRef.current = createRoot(container);
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position,
        content: container,
      });
    }
  }, [position]);

  useEffect(() => {
    if (!markerRef.current || !rootRef.current) return;
    rootRef.current.render(children);
    markerRef.current.position = position;
    markerRef.current.map = map;
    const clickListener = markerRef.current.addListener("click", onClick);
    return () => {
      clickListener.remove();
    };
  }, [map, position, children, onClick]);

  return <></>;
}
