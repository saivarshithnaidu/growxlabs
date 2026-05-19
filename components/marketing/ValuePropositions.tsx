"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VALUES = [
  {
    title: "AI-native digital systems",
    subtitle: "for modern businesses.",
  },
  {
    title: "AI systems designed",
    subtitle: "for real-world growth.",
  },
  {
    title: "Young engineers",
    subtitle: "building AI-native systems.",
  },
  {
    title: "More than an agency.",
    subtitle: "A technical growth partner.",
  },
];

export function ValuePropositions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="w-full py-20 px-6 md:px-10 xl:px-16 2xl:px-24 border-y border-[#E8E6E1]">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
      >
        {VALUES.map((val, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="group cursor-default"
          >
            <div className="relative">
              <p className="text-[17px] sm:text-[18px] font-medium text-[#1A1A1A] leading-[1.5]">
                {val.title}
              </p>
              <p className="text-[17px] sm:text-[18px] font-medium text-[#6B7280] leading-[1.5]">
                {val.subtitle}
              </p>
              <motion.div
                className="h-[2px] bg-[#355CFF] mt-4 origin-left"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.12 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
