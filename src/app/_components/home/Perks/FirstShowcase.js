import { motion } from "framer-motion";
import Image from "next/image";
import SvgIcon from "../../utils/SvgIcon";
import { useMediaQuery } from "react-responsive";

export default function FirstShowcase() {
  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });
  return (
    <motion.div
      initial={{
        y: 0,
      }}
      whileInView={{
        y: isDesktop ? 40 : 10,
      }}
      transition={{
        delay: 0.1,
      }}
      viewport={{
        once: true,
      }}
      className="h-full relative flex items-center justify-center w-full max-w-xl left-1 md:left-0 -top-8 md:top-0"
    >
      <motion.div
        initial={{
          rotate: 0,
        }}
        whileInView={{
          rotate: 6,
          top: isDesktop ? "12px" : "-40px",
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.2,
        }}
        className="w-full max-w-[200px] md:max-w-[280px] bg-white rounded-2xl border absolute"
      >
        <div className="w-full h-full flex flex-col gap-1.5 md:gap-2.5 p-3">
          <div className="w-full h-28 md:h-32 bg-blue-400 rounded-lg relative overflow-hidden">
            <Image
              src={"/assets/images/perks/image-1.jpg"}
              className="w-full h-full object-cover"
              fill
              sizes="400px"
              alt="house-sample"
              priority
            />
          </div>
          <p className="text-sm md:text-xl font-medium">Rp 12.000.000.000</p>
          <p className="font-light text-neutral-500 text-xs md:text-base">
            Canggu, Bali
          </p>
          <div className="flex items-center gap-3 font-light text-xs">
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/bed.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>6</span>
            </div>
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/shower.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>3</span>
            </div>
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/expand.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>500m2</span>
            </div>
          </div>
        </div>
        <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass absolute left-4 top-4 text-sm">
          <SvgIcon
            src={"/assets/icons/verified.svg"}
            className="w-4 h-4 bg-mossgreen"
          />
          <p>Notarized</p>
        </div>
      </motion.div>
      <motion.div
        initial={{
          rotate: 0,
          x: 0,
        }}
        whileInView={{
          rotate: -6,
          x: -30,
        }}
        transition={{
          delay: 0.3,
        }}
        viewport={{
          once: true,
        }}
        className="w-full max-w-[200px] md:max-w-[280px] bg-white rounded-2xl border absolute origin-bottom-left"
      >
        <div className="w-full h-full flex flex-col gap-1.5 md:gap-2.5 p-3">
          <div className="w-full h-28 md:h-32 bg-blue-400 rounded-lg relative overflow-hidden">
            <Image
              src={"/assets/images/perks/image-2.jpg"}
              className="w-full h-full object-cover"
              fill
              sizes="400px"
              alt="house-sample"
              priority
            />
          </div>
          <p className="text-sm md:text-xl font-medium">$145,000</p>
          <p className="font-light text-neutral-500 text-xs md:text-base">
            Canggu, Bali
          </p>
          <div className="flex items-center gap-3 font-light text-xs">
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/bed.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>6</span>
            </div>
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/shower.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>3</span>
            </div>
            <div className="flex items-center gap-1">
              <SvgIcon
                src={"/assets/icons/expand.svg"}
                className="w-4 h-4 bg-black"
              />
              <span>500m2</span>
            </div>
          </div>
        </div>
        <motion.div
          initial={{
            scale: 0,
          }}
          whileInView={{
            scale: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          viewport={{
            once: true,
          }}
          className="rounded-full flex items-center gap-1 px-2 py-1 bg-lemongrass absolute -left-4 md:-left-8 top-4 text-xs md:text-sm"
        >
          <SvgIcon
            src={"/assets/icons/verified.svg"}
            className="w-6 h-6 bg-mossgreen"
          />
          <p>Notarized</p>
        </motion.div>
      </motion.div>

      {/* List */}
      <div className="flex flex-col gap-4 absolute right-0 md:right-14 text-xs">
        <motion.div
          initial={{
            x: 20,
            y: 10,
            opacity: 0,
          }}
          whileInView={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.6,
          }}
          className="w-36 md:w-44 border rounded-lg md:rounded-xl bg-[#F2FED1] p-2 md:p-3 flex items-center justify-between"
        >
          <p className="font-medium">Price</p>
          <div className="px-2 bg-[#026423] flex items-center rounded gap-1 py-0.5">
            <p className="text-[#F3FFC5] text-[10px]">Verified</p>
          </div>
        </motion.div>
        <motion.div
          initial={{
            x: 20,
            y: 10,
            opacity: 0,
          }}
          whileInView={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.7,
          }}
          className="w-40 md:w-44 border rounded-lg md:rounded-xl bg-[#F2FED1] p-2 md:p-3 flex items-center justify-between ml-6"
        >
          <p className="font-medium">Certificate</p>
          <div className="px-2 bg-[#026423] flex items-center rounded gap-1 py-0.5">
            <p className="text-[#F3FFC5] text-[10px]">Verified</p>
          </div>
        </motion.div>
        <motion.div
          initial={{
            x: 20,
            y: 10,
            opacity: 0,
          }}
          whileInView={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.8,
          }}
          className="w-40 md:w-44 border rounded-lg md:rounded-xl bg-[#F2FED1] p-2 md:p-3 flex items-center justify-between"
        >
          <p className="font-medium">Location</p>
          <div className="px-2 bg-[#026423] flex items-center rounded gap-1 py-0.5">
            <p className="text-[#F3FFC5] text-[10px]">Verified</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
