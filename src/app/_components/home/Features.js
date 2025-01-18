import { cnm } from "@/utils/style";
import Image from "next/image";

const features = [
  {
    title: "Step into the New Finance",
    desc: "Sell to crypto investors, buy without borders, enjoy transactions with near zero fees executed in seconds",
    image: "/assets/images/features/abstract.png",
  },
  {
    title: "A $16 Trillion Market ",
    desc: "The value of Real World Asset to be tokenized by 2030, according to Boston Consulting Group.",
    image: "/assets/images/features/torus.png",
  },
  {
    title: "Simplify Borrowing",
    desc: "From listing to verification and purchase, every step of the process is streamlined and efficient.",
    image: "/assets/images/features/abstract.png",
  },
  {
    title: "Engage and Reward",
    desc: "Access valuable insights and data on property prices and trends.",
    image: "/assets/images/features/sphere.png",
  },
  {
    title: "Transparency and Security",
    desc: "All properties are thoroughly verified by notaries.",
    image: "/assets/images/features/sphere.png",
  },
  {
    title: "Turn your Asset Liquid",
    desc: "Benefit from a faster network exchanging value without fricition 24/7.",
    image: "/assets/images/features/torus.png",
  },
];

export default function Features() {
  return (
    <section id="features-section" className="px-4 md:px-8 mt-24">
      <div className="w-full flex flex-col items-center">
        <p className="px-5 py-2 rounded-full border border-black text-xs">
          THE WHY
        </p>
        <h2 className="text-3xl md:text-[40px] font-medium mt-6 max-w-xl text-center leading-snug">
          Why tokenizing real estate?
        </h2>

        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={cnm(
                "bg-[#F6F6F6] rounded-md p-5 relative min-h-64 flex flex-col items-start overflow-hidden",
                idx === 0 && "items-end text-end",
                idx === 1 && "justify-end items-start",
                idx === 2 && "items-start",
                idx === 3 && "items-start",
                idx === 4 && "items-end text-end",
                idx === 5 && "items-end justify-end text-end"
              )}
            >
              <div
                className={cnm(
                  "absolute w-[240px] h-[240px]",
                  idx === 0 && "-bottom-20 -left-20",
                  idx === 1 && "-top-20 -right-20",
                  idx === 2 && "top-0 -right-24",
                  idx === 3 && "-bottom-20 -right-20 scale-150",
                  idx === 4 && "-bottom-20 -left-20 scale-150",
                  idx === 5 && "-top-36 -left-14 rotate-[55deg] scale-150"
                )}
              >
                <Image
                  src={item.image}
                  alt="benefit-img"
                  fill
                  sizes="450px"
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-xl relative font-semibold">{item.title}</p>
              <p className="font-light max-w-xs mt-3 relative">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
