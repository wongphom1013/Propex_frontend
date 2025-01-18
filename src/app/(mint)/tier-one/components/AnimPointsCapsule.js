"use client";

import PointsStar from "@/assets/account-bar/points-star.svg";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimPointsCapsule({ points }) {
  const [previousPoints, setPreviousPoints] = useState(points);
  const [ghosts, setGhosts] = useState([]);

  useEffect(() => {
    const difference = points - previousPoints;

    if (difference !== 0) {
      setGhosts((prevGhosts) => [
        ...prevGhosts,
        { id: Date.now(), value: difference },
      ]);
      setPreviousPoints(points);
    }
  }, [points, previousPoints]);

  const handleAnimationComplete = (id) => {
    setGhosts((prevGhosts) => prevGhosts.filter((ghost) => ghost.id !== id));
  };

  return (
    <div className="relative">
      <div className="rounded-full bg-[#F2FED1] flex items-center p-0.5 relative z-10">
        <PointsStar className="size-5" />
        <motion.div
          className="text-mossgreen-800 font-urbanist px-1 relative"
          key={points} // Trigger animation on points change
          initial={{ scale: 1 }}
          animate={{ scale: [1.2, 1] }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {points}
          <AnimatePresence>
            {ghosts.map((ghost) => (
              <motion.div
                key={ghost.id}
                className="absolute inset-0 flex justify-center"
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -30, opacity: 0, scale: [1.3, 0.95] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                onAnimationComplete={() => handleAnimationComplete(ghost.id)}
              >
                <p className="text-mossgreen-800 font-urbanist pl-1 pr-1">
                  {ghost.value > 0 ? `+${ghost.value}` : `${ghost.value}`}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
