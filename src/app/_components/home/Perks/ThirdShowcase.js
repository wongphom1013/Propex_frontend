import { motion } from "framer-motion";
import SvgIcon from "../../utils/SvgIcon";
import Image from "next/image";

export default function ThirdShowcase() {
  return (
    <div className="h-full relative flex items-center justify-center w-full max-w-2xl -top-4">
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 max-w-[240px] translate-x-8">
          <motion.div
            initial={{
              x: 25,
              y: 0,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: 0,
              y: 16,
              opacity: 1,
              rotate: -6,
            }}
            className="w-full bg-white rounded-2xl relative border"
          >
            <div className="w-full h-full flex flex-col gap-2.5 p-4">
              <div className="w-full h-32 bg-blue-400 rounded-lg relative overflow-hidden">
                <Image
                  src={"/assets/images/perks/image-2.jpg"}
                  className="w-full h-full object-cover"
                  fill
                  sizes="400px"
                  alt="house-sample"
                  priority
                />
              </div>
              <p className="font-medium">$150,400</p>
              <p className="font-light text-neutral-500 text-sm">
                Canggu, Bali
              </p>
              <div className="flex items-center gap-3 font-light text-xs">
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/bed.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>4</span>
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
                  <span>300m2</span>
                </div>
              </div>
            </div>
            <div className="rounded-full flex items-center gap-1 px-2 bg-lemongrass absolute left-6 top-6 text-sm">
              <SvgIcon
                src={"/assets/icons/verified.svg"}
                className="w-4 h-4 bg-mossgreen"
              />
              <p>Notarized</p>
            </div>
          </motion.div>
        </div>
        {/* cv pict */}
        <motion.div
          initial={{
            x: 25,
            scale: 1.1,
            opacity: 0,
          }}
          animate={{
            x: 0,
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0.2,
          }}
          className="w-40 md:w-56 aspect-square absolute -bottom-12 right-0"
        >
          <Image
            src={"/assets/images/cv.png"}
            alt="cv-img"
            fill
            priority
            sizes="330px"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
