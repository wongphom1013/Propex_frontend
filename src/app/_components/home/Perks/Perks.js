"use client";

import { useState } from "react";
import SvgIcon from "../../utils/SvgIcon";
import { cnm } from "@/utils/style";
import FirstShowcase from "./FirstShowcase";
import SecondShowcase from "./SecondShowcase";
import ThirdShowcase from "./ThirdShowcase";
import FormButton from "../../form/FormButton";

const perks = [
  {
    imageUrl: "/assets/icons/verified.svg",
    title: "Trustworthy Listings",
    desc: "Only verified properties are marked with the Notarized badge, ensuring that you can trust the information provided.",
  },
  {
    imageUrl: "/assets/icons/pricing.svg",
    title: "Accurate Pricing",
    desc: "Verification includes a market analysis, ensuring that property prices reflect true market value and preventing overpriced listings.",
  },
  {
    imageUrl: "/assets/icons/legal.svg",
    title: "Legal Compliance",
    desc: "Verified properties meet all legal requirements, reducing the risk of legal issues during transactions.",
  },
];

export default function Perks() {
  const [selectedPerk, setSelectedPerk] = useState(0);
  return (
    <section className="px-4 md:px-8 mt-20">
      <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
        <div className="bg-[#eef5e4] rounded-xl p-4 md:p-6 flex-1 min-h-[380px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
          <AnimatedShowcase selectedPerk={selectedPerk} />
        </div>
        <div className="flex-1 flex-col flex items-start">
          <p className="px-5 py-2 border border-black rounded-full text-xs">
            NOTARY VERIFIED
          </p>
          <p className="font-medium text-3xl md:text-[40px] mt-6 md:leading-snug">
            Become ambassador of our system of trust
          </p>

          <div className="flex flex-col gap-5 mt-10 w-full">
            {perks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPerk(idx);
                }}
                className={cnm(
                  "border p-4 rounded-xl",
                  selectedPerk === idx && "bg-neutral-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <SvgIcon src={item.imageUrl} className="h-7 w-7 bg-black" />
                  <p className="text-xl font-medium">{item.title}</p>
                </div>
                <p
                  className={cnm(
                    "text-start text-sm text-neutral-600 transition-all duration-300 flex items-center overflow-hidden",
                    selectedPerk === idx
                      ? "h-20 md:h-16 opacity-100"
                      : "h-0 opacity-0"
                  )}
                >
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <FormButton>
            <div className="bg-mossgreen text-lemongrass rounded-lg px-3 py-2 md:px-8 md:py-3 mt-7 font-semibold tracking-wide transition-colors hover:bg-mossgreen/90">
              Invite Your Network
            </div>
          </FormButton>
        </div>
      </div>
    </section>
  );
}

function AnimatedShowcase({ selectedPerk }) {
  switch (selectedPerk) {
    case 0:
      return <FirstShowcase />;
    case 1:
      return <SecondShowcase />;
    case 2:
      return <ThirdShowcase />;
  }
}
