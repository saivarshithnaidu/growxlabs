"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

import { memo } from "react";

export const ServiceCard = memo(function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="h-full flex flex-col space-y-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(0,168,107,0.3)] hover:border-l-2 hover:border-l-[#00A86B]">
        <div className="w-10 h-10 rounded-lg bg-[#00A86B]/10 flex items-center justify-center mb-1">
          <Icon className="text-[#00A86B] w-8 h-8" />
        </div>
        <h3 className="text-[20px] font-semibold text-white">{title}</h3>
        <p className="text-[#A0A0A0] text-[15px] leading-[1.7]">
          {description}
        </p>
      </div>
    </motion.div>
  );
});
