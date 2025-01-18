"use client";

import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function FakeNotification() {
  useEffect(() => {
    const interval = setInterval(() => {
      toast(
        <div>
          A <span className="font-semibold">GROWER</span> has just bought 2 tokens of{" "}
          <span className="underline">Something</span>
        </div>,
        {
          duration: 4000,
          position: "bottom-left",
          style: {
            backgroundColor: "#00272C",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
        }
      );
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return <Toaster />;
}
