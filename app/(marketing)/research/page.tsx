"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { DeepfakeSimpleCardDiagram } from "@/components/ailab/DeepfakeSimpleCardDiagram";

interface Slide {
  src: string;
  alt: string;
  title: string;
  fit: "contain" | "cover";
  isComponent?: boolean;
}

const AILAB_SLIDES: Slide[] = [
  {
    src: "/images/ailab/deepfake-architecture.png",
    alt: "GrowX Deepfake — Neural Architecture & Pipeline",
    title: "GrowX Deepfake™ Architecture",
    fit: "contain",
    isComponent: true,
  },
  {
    src: "/images/ailab/crawl-playground.png",
    alt: "GrowX Crawl — Extraction Playground",
    title: "GrowX Crawl™",
    fit: "cover",
  },
  {
    src: "/portfolio/growx-crawl-api.png",
    alt: "GrowX Crawl — RESTful API Specification Suite",
    title: "GrowX Crawl API Suite",
    fit: "cover",
  },
  {
    src: "/images/ailab/pipper-harness.png",
    alt: "Pipper — Multi-Agent Workspace",
    title: "Pipper™",
    fit: "cover",
  },
];

const ROBOTICS_SLIDES: Slide[] = [
  {
    src: "/images/robotics/humanoid-embodied-ai.jpg",
    alt: "GrowX Robotics — Humanoid Embodied Intelligence & Kinematics",
    title: "Embodied Humanoid AI",
    fit: "cover",
  },
  {
    src: "/images/robotics/autonomous-manipulation.jpg",
    alt: "GrowX Robotics — Autonomous Precision Manipulation & Real-Time Teleoperation",
    title: "Autonomous Manipulation",
    fit: "cover",
  },
];

/**
 * Deep Petroleum frame (#0A1B22) with midnight cyan border (#16323B).
 * Grounds both dark UI dashboards and bright white schematics.
 */
function FramedSlideshow({ slides, currentIndex }: { slides: Slide[]; currentIndex: number }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-[#0A1B22] border border-[#16323B] transition-colors duration-300 group-hover:border-[#234E5D]">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#05070E]">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.src} className="relative w-full h-full shrink-0 bg-[#05070E]">
              {slide.isComponent ? (
                <DeepfakeSimpleCardDiagram className="w-full h-full" />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={
                    slide.fit === "contain"
                      ? "object-contain object-center p-2.5 sm:p-4"
                      : "object-cover object-top"
                  }
                  priority={idx === 0}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Overlapping solid graphite card (#111315) with subtle border (#252525),
 * white heading, muted grey text (#A5A5A5), and a solid white action button.
 */
function ResearchCardTile({
  href,
  title,
  description,
  cta,
  slides,
  interval,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
  slides: Slide[];
  interval: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, interval]);

  return (
    <Link
      href={href}
      className="group flex flex-col h-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <FramedSlideshow slides={slides} currentIndex={currentIndex} />

      <div className="relative z-10 flex-1 flex flex-col -mt-12 mx-3 sm:mx-5 rounded-2xl border border-[#252525] bg-[#111315] shadow-[0_-12px_40px_rgba(0,0,0,0.65)] p-6 sm:p-8 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="font-sans font-medium text-[26px] sm:text-[30px] text-white tracking-tight leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-[#A5A5A5] text-base sm:text-[17px] leading-relaxed max-w-xl font-normal">
          {description}
        </p>
        <span className="mt-7 self-start inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-md bg-white text-black text-[15px] font-medium transition-colors duration-200 group-hover:bg-neutral-200">
          {cta}
        </span>
      </div>
    </Link>
  );
}

export default function ResearchPage() {
  return (
    <div className="flex flex-col bg-black text-foreground min-h-screen">
      <PageHero
        title="Research"
        viewingText="R&D"
        exploreText="OUR WORK"
        tagline="AI & ROBOTICS LABS"
      />

      <div className="w-full bg-black px-6 md:px-10 xl:px-16 2xl:px-24 pb-36 border-t border-white/10 pt-16">
        <div className="max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
          <AnimatedSection className="mb-8 sm:mb-10">
            <h2 className="text-[clamp(30px,3.4vw,42px)] font-sans font-medium text-white tracking-tight">
              Proprietary Labs & Engineering Research
            </h2>
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 xl:gap-12">
            <AnimatedItem className="h-full">
              <ResearchCardTile
                href="/ailab"
                title="AI Lab"
                description="We research and develop new AI models, neural methods, and autonomous agent workflows in-house."
                cta="Explore AI Lab"
                slides={AILAB_SLIDES}
                interval={4200}
              />
            </AnimatedItem>

            <AnimatedItem className="h-full">
              <ResearchCardTile
                href="/robotics"
                title="Robotics Lab"
                description="Autonomous systems, embodied humanoid intelligence, and physical AI platforms bridging software models with real-world robotics."
                cta="Explore robotics"
                slides={ROBOTICS_SLIDES}
                interval={4000}
              />
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </div>
    </div>
  );
}
