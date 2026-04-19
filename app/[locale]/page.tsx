"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import {
  Code,
  Settings,
  TrendingUp,
  Server,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Hero");
  const ts = useTranslations("Services");

  const mainServices = [
    {
      title: ts("items.web_engineering.title"),
      description: ts("items.web_engineering.description"),
      icon: Code,
    },
    {
      title: ts("items.ai_automation.title"),
      description: ts("items.ai_automation.description"),
      icon: Settings,
    },
    {
      title: ts("items.technical_seo.title"),
      description: ts("items.technical_seo.description"),
      icon: TrendingUp,
    },
    {
      title: ts("items.cloud_infra.title"),
      description: ts("items.cloud_infra.description"),
      icon: Server,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 md:pt-56 md:pb-48 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full glass mb-8 border border-white/10"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {t("label")}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.9]"
          >
             {t("title1")} <br />
            <span className="opacity-70">{t("title2")}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-14 leading-relaxed font-light"
          >
            {t("subtitle")}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link href="/contact">
              <Button size="lg" className="h-16 px-12 text-lg rounded-full font-black bg-white text-black hover:bg-neutral-200 transition-all shadow-xl shadow-white/5">
                {t("cta_start")} <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-full font-black border-white/10 hover:bg-white/5 transition-all text-white/60 hover:text-white">
                {t("cta_portfolio")}
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-white/[0.03] blur-[150px] -z-10 rounded-full" />
      </section>

      {/* Services Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">{ts("title")}</h2>
              <p className="text-xl text-white/40 font-light leading-relaxed">
                {ts("subtitle")}
              </p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="text-white/60 hover:text-white font-bold group">
                All Services <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio segment preserved... */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={index} {...project} href={`/portfolio/${project.slug}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
