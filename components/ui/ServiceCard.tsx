"use client";

import { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="text-primary w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
