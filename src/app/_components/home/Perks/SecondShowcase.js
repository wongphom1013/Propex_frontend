import { motion } from "framer-motion";
import Image from "next/image";
import SvgIcon from "../../utils/SvgIcon";

export default function SecondShowcase() {
  return (
    <div className="h-full relative flex items-center justify-center w-full max-w-2xl">
      <div className="flex gap-3 w-full">
        {/* left card */}
        <div className="flex flex-col items-center gap-3 grow">
          <motion.div
            initial={{
              x: 25,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            className="w-full h-[220px] bg-white rounded-2xl relative border"
          >
            <div className="w-full h-full flex flex-col gap-2.5 p-3">
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
              <p className="font-medium">$120,000</p>
              <p className="font-light text-neutral-500 text-sm">Kuta, Bali</p>
              <div className="flex items-center gap-3 font-light text-xs">
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/bed.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>2</span>
                </div>
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/shower.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>1</span>
                </div>
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/expand.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>230m2</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              x: 25,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_458_15538)">
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#E02828"
                />
                <path
                  d="M13.2222 11.9996L17.0023 8.21955C17.3394 7.88245 17.3394 7.33503 17.0023 6.99794C16.6652 6.66084 16.1178 6.66084 15.7807 6.99794L12.0006 10.778L8.22052 6.99794C7.88343 6.66084 7.33601 6.66084 6.99891 6.99794C6.66182 7.33503 6.66182 7.88245 6.99891 8.21955L10.779 11.9996L6.99891 15.7797C6.66182 16.1168 6.66182 16.6642 6.99891 17.0013C7.1689 17.1713 7.38787 17.2548 7.60972 17.2548C7.83157 17.2548 8.05342 17.1713 8.22052 17.0013L12.0006 13.2212L15.7807 17.0013C15.9507 17.1713 16.1696 17.2548 16.3915 17.2548C16.6133 17.2548 16.8352 17.1713 17.0023 17.0013C17.3394 16.6642 17.3394 16.1168 17.0023 15.7797L13.2222 11.9996Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_458_15538">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </motion.div>

          <motion.p
            initial={{
              scale: 0.8,
              opacity: 0,
              x: 25,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="font-medium"
          >
            Overpriced
          </motion.p>
        </div>
        {/* middle card  */}
        <div className="flex flex-col items-center gap-3 grow">
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="w-full h-[220px] bg-white rounded-2xl border-2 relative border-[#026423] -translate-y-4"
          >
            <div className="w-full h-full flex flex-col gap-2.5 p-3">
              <div className="w-full h-32 bg-blue-400 rounded-lg relative overflow-hidden">
                <Image
                  src={"/assets/images/perks/image-3.jpg"}
                  className="w-full h-full object-cover"
                  fill
                  sizes="400px"
                  alt="house-sample"
                  priority
                />
              </div>
              <p className="font-medium">$325,000</p>
              <p className="font-light text-neutral-500 text-sm">
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
                  <span>310m2</span>
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
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_458_15534)">
                <path
                  d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                  fill="#026423"
                />
                <path
                  d="M13.2141 23.0878C12.8799 23.0878 12.561 22.9418 12.3421 22.6883L8.92311 18.7315C8.50822 18.2513 8.55816 17.5214 9.04219 17.1065C9.52239 16.6916 10.2523 16.7416 10.6672 17.2256L13.1565 20.1068L21.2852 9.37351C21.6693 8.86642 22.3915 8.76654 22.8986 9.1507C23.4057 9.53485 23.5056 10.2571 23.1214 10.7641L14.1322 22.6345C13.9209 22.9111 13.5983 23.0801 13.2525 23.0916C13.2372 23.0878 13.2256 23.0878 13.2141 23.0878Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_458_15534">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </motion.div>

          <motion.p
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: 0.4,
            }}
            className="font-medium"
          >
            Fit Market
          </motion.p>
        </div>
        {/* right card */}
        <div className="flex flex-col items-center gap-3 grow">
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            className="w-full h-[220px] bg-white rounded-2xl relative border"
          >
            <div className="w-full h-full flex flex-col gap-2.5 p-3">
              <div className="w-full h-32 bg-blue-400 rounded-lg relative overflow-hidden">
                <Image
                  src={"/assets/images/perks/image-1.jpg"}
                  className="w-full h-full object-cover"
                  fill
                  sizes="400px"
                  alt="house-sample"
                  priority
                />
              </div>
              <p className="font-medium">$231,000</p>
              <p className="font-light text-neutral-500 text-sm">
                Gianyar, Bali
              </p>
              <div className="flex items-center gap-3 font-light text-xs">
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/bed.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>3</span>
                </div>
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/shower.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>2</span>
                </div>
                <div className="flex items-center gap-1">
                  <SvgIcon
                    src={"/assets/icons/expand.svg"}
                    className="w-4 h-4 bg-black"
                  />
                  <span>460m2</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              x: -25,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_458_15538)">
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#E02828"
                />
                <path
                  d="M13.2222 11.9996L17.0023 8.21955C17.3394 7.88245 17.3394 7.33503 17.0023 6.99794C16.6652 6.66084 16.1178 6.66084 15.7807 6.99794L12.0006 10.778L8.22052 6.99794C7.88343 6.66084 7.33601 6.66084 6.99891 6.99794C6.66182 7.33503 6.66182 7.88245 6.99891 8.21955L10.779 11.9996L6.99891 15.7797C6.66182 16.1168 6.66182 16.6642 6.99891 17.0013C7.1689 17.1713 7.38787 17.2548 7.60972 17.2548C7.83157 17.2548 8.05342 17.1713 8.22052 17.0013L12.0006 13.2212L15.7807 17.0013C15.9507 17.1713 16.1696 17.2548 16.3915 17.2548C16.6133 17.2548 16.8352 17.1713 17.0023 17.0013C17.3394 16.6642 17.3394 16.1168 17.0023 15.7797L13.2222 11.9996Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_458_15538">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </motion.div>
          <motion.p
            initial={{
              scale: 0.8,
              opacity: 0,
              x: -25,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="font-medium"
          >
            Overpriced
          </motion.p>
        </div>
      </div>
    </div>
  );
}
