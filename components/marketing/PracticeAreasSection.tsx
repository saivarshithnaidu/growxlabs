"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { DeepfakeSimpleCardDiagram } from "@/components/ailab/DeepfakeSimpleCardDiagram";

interface Slide {
  src: string;
  alt: string;
  title: string;
  fit: string;
  isComponent?: boolean;
}

const PORTFOLIO_SLIDES: Slide[] = [
  {
    src: "/portfolio/trionyx-dashboard.png",
    alt: "TRIONYX — Distributor Management Platform",
    title: "TRIONYX™",
    fit: "cover",
  },
  {
    src: "/portfolio/growx-crawl.png",
    alt: "GrowX Crawl — Enterprise Web Intelligence Runtime",
    title: "GrowX Crawl™",
    fit: "cover",
  },
];

const LABS_SLIDES: Slide[] = [
  {
    src: "/images/ailab/deepfake-architecture.png",
    alt: "GrowX Deepfake — Neural System Architecture",
    title: "GrowX Deepfake™ Architecture",
    fit: "contain",
    isComponent: true,
  },
  {
    src: "/images/robotics/humanoid-embodied-ai.jpg",
    alt: "GrowX Robotics — Humanoid Embodied Intelligence & Kinematics",
    title: "Embodied Humanoid AI",
    fit: "cover",
  },
  {
    src: "/images/robotics/autonomous-manipulation.jpg",
    alt: "GrowX Robotics — Autonomous Precision Manipulation",
    title: "Autonomous Manipulation",
    fit: "cover",
  },
  {
    src: "/images/products/recruitai.png",
    alt: "RecruitAI — Autonomous Talent Acquisition",
    title: "RecruitAI™",
    fit: "cover",
  },
  {
    src: "/images/products/pipper.png",
    alt: "Pipper — Desktop Agent Workspace",
    title: "Pipper™",
    fit: "cover",
  },
];

/**
 * Color system for these tiles: teal image frame (#0F313A / #1E4952), neutral
 * content panel (#111315, border #292D32), off-white type and action (#F7F7F5),
 * muted body copy (#A6ADB4), and the site cyan (#C0F0FB) as the only accent, on hover.
 */

/** Image slideshow inside a neutral frame; driven by the parent tile's index. */
function FramedSlideshow({ slides, currentIndex }: { slides: Slide[]; currentIndex: number }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-[#0F313A] border border-[#1E4952] transition-colors duration-300 group-hover:border-[#2C6470]">
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
                      ? "object-contain object-center p-2.5"
                      : "object-cover object-left-top"
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
 * Framed image on top, dark text panel overlapping its bottom edge,
 * and a solid call-to-action. The whole tile links to `href`.
 */
function WorkTile({
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

      <div className="relative z-10 flex-1 flex flex-col -mt-12 mx-3 sm:mx-5 rounded-2xl border border-[#292D32] bg-[#111315] shadow-[0_-12px_40px_rgba(0,0,0,0.55)] p-6 sm:p-8 transition-[transform,border-color] duration-300 group-hover:-translate-y-1 group-hover:border-[#C0F0FB]/40">
        <h3 className="font-sans font-medium text-[26px] sm:text-[30px] text-[#F7F7F5] tracking-tight leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-[#A6ADB4] text-base sm:text-[17px] leading-relaxed max-w-xl font-normal">
          {description}
        </p>
        {/* Same size/type/hover as the header's Contact button (site cyan on hover) */}
        <span className="mt-7 self-start inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-md bg-[#F7F7F5] text-[#111315] text-[15px] font-medium transition-colors duration-200 group-hover:bg-[#C0F0FB]">
          {cta}
        </span>
      </div>
    </Link>
  );
}

export function PracticeAreasSection() {
  return (
    <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-black border-t border-white/10">
      <div className="max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
        <AnimatedSection className="mb-8 sm:mb-10">
          <h2 className="text-[clamp(30px,3.4vw,42px)] font-sans font-medium text-white tracking-tight">
            Client Solutions & Proprietary Labs
          </h2>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 xl:gap-12">
          <AnimatedItem className="h-full">
            <WorkTile
              href="/portfolio"
              title="Portfolio"
              description="Custom software architectures, autonomous AI workflows, and secure integrations engineered with senior-developer velocity."
              cta="View projects"
              slides={PORTFOLIO_SLIDES}
              interval={4200}
            />
          </AnimatedItem>

          <AnimatedItem className="h-full">
            <WorkTile
              href="/research"
              title="Research"
              description="Explore our AI research, experiments, and open-source tools built at the frontier of intelligence."
              cta="Explore research"
              slides={LABS_SLIDES}
              interval={4000}
            />
          </AnimatedItem>
        </AnimatedStagger>
      </div>
    </section>
  );
}
