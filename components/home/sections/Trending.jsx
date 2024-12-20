"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/utils";
import { GiDna2, GiHoneycomb } from "react-icons/gi";
import { SiThunderstore } from "react-icons/si";
import { TbDeviceLandlinePhone } from "react-icons/tb";

const trendingData = [
  { icon: <GiDna2 size={20} />, text: "Protein" },
  { icon: <GiHoneycomb size={20} />, text: "Collagen" },
  { icon: <SiThunderstore size={20} />, text: "Stamina" },
  { icon: <TbDeviceLandlinePhone size={20} />, text: "Diabetic" },
];

const Trending = () => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
    >
      <div className="w-full h-fit flex flex-col items-center justify-center gap-6 p-8">
        <motion.h2
          variants={fadeIn("up", 0.2, 1)}
          className="text-xl font-semibold"
        >
          Trending searches
        </motion.h2>
        <div className="w-full h-fit flex items-center justify-center gap-4">
          {trendingData.map((item, index) => (
            <motion.div key={index} variants={fadeIn("right", 0.2 * index, 1)}>
              <div className="hover-fill border border-gray-950 hover:text-white hover:border-[#D4A017] w-fit h-fit p-2 px-4 flex items-center justify-center gap-2 text-lg 2xl:text-xl">
                {item.icon}
                <span>{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Trending;
