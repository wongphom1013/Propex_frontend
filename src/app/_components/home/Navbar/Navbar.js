"use client";

import Image from "next/image";
import SignIn from "./SignIn";
import FormButton from "../../form/FormButton";
import SvgIcon from "../../utils/SvgIcon";
import { MINT_APP_LINK } from "@/config";

export const navList = [
  {
    name: "TOKENIZE",
    sectionId: "tokenize-section",
  },
  {
    name: "SMARTMAP",
    sectionId: "smartmap-section",
  },
  {
    name: "THE WHY",
    sectionId: "features-section",
  },
  {
    name: "HOW IT WORKS",
    sectionId: "how-it-works-section",
  },
];

export default function Navbar() {
  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
  return (
    <>
      <nav className="w-full flex items-center py-6 px-4 md:px-8">
        <div className="w-32 h-7 relative">
          <Image
            src={"/assets/logo/propex-logo.png"}
            alt="propex-logo"
            fill
            sizes="350px"
            className="object-contain overflow-hidden"
          />
        </div>

        <div className="ml-12 hidden md:flex items-center gap-6">
          {navList.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigateToSection(item.sectionId);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <a href={MINT_APP_LINK}>
            <div
              // onClick={openModal}
              className="flex items-center gap-1.5 px-4 py-2 font-semibold rounded-lg bg-mossgreen"
            >
              <SvgIcon
                src={"/assets/icons/login.svg"}
                className="h-4 w-4 bg-lemongrass"
              />
              <p className="text-lemongrass text-sm md:text-base">Launch App</p>
            </div>
          </a>
        </div>
      </nav>
    </>
  );
}
