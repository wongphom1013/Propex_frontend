"use client";
import { INSTA_LINK, TWITTER_LINK } from "@/config";
import SvgIcon from "../utils/SvgIcon";
import Image from "next/image";
import { navList } from "./Navbar/Navbar";

export default function Footer() {
  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
  return (
    <footer className="w-full flex px-4 md:px-16 justify-start items-start lg:items-end mt-20 py-6 gap-8 lg:gap-24 flex-col md:flex-row">
      <div className="flex flex-col gap-6">
        <div>
          <Image
            src={"/assets/logo/propex-logo-only.svg"}
            alt="propex-logo"
            height={53}
            width={68}
            sizes="68px"
            className="object-contain w-16 h-14"
          />
        </div>
        <div className="flex items-center gap-4">
          <a href={TWITTER_LINK} target="_blank">
            <SvgIcon
              src={"/assets/icons/twitter.svg"}
              className={"w-6 h-6 bg-mossgreen"}
            />
          </a>
          <a href={INSTA_LINK} target="_blank">
            <SvgIcon
              src={"/assets/icons/insta.svg"}
              className={"w-6 h-6 bg-mossgreen"}
            />
          </a>
        </div>
        <p className="font-light">&copy; 2024 Propex. All rights reserved</p>
      </div>
      <div className="flex gap-10 lg:ml-auto">
        <div className="flex flex-col lg:flex-row items-start gap-6">
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
      </div>
    </footer>
  );
}
