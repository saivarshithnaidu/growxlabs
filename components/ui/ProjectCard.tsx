"use client";

import { motion } from "framer-motion";
import { Card } from "./Card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  href: string;
}

export function ProjectCard({ title, category, description, image, href }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={href}>
        <Card className="p-0 overflow-hidden bg-white/[0.02] border-white/5 hover:border-primary/50 transition-all duration-500 shadow-2xl hover:shadow-primary/20">
          <div className="aspect-[16/10] relative overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
            
            {/* Category Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-white/80">
                {category}
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">{description}</p>
            <div className="pt-2 flex items-center text-primary text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              Read Case Study <ArrowRight size={14} className="ml-2" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
