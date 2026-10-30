/* Hallmark · research/page.tsx · modern-minimal · built: redesign */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { DeepfakeSimpleCardDiagram } from "@/components/ailab/DeepfakeSimpleCardDiagram";

interface ResearchSlide {
  src: string;
  alt: string;
  title: string;
  tag: string;
  desc: string;
  fit?: "contain" | "cover";
  isComponent?: boolean;
}

const AILAB_SLIDES: ResearchSlide[] = [
  {
    src: "/images/ailab/deepfake-architecture.png",
    alt: "GrowX Deepfake — Neural Architecture & Pipeline",
    title: "GrowX Deepfake™",
    tag: "Neural architecture",
    desc: "DINOv2 ViT backbone, 768-D latent manifold & verification head",
    fit: "contain",
    isComponent: true,
  },
  {
    src: "/images/ailab/crawl-playground.png",
    alt: "GrowX Crawl — Extraction Playground",
    title: "GrowX Crawl™",
    tag: "Web platforms",
    desc: "Interactive scraping, live scoring & research engine",
    fit: "cover",
  },
  {
    src: "/portfolio/growx-crawl-api.png",
    alt: "GrowX Crawl — RESTful API Specification Suite",
    title: "GrowX Crawl API",
    tag: "API suite",
    desc: "Enterprise endpoints, parameter schemas & cURL integration",
    fit: "cover",
  },
  {
    src: "/images/ailab/pipper-harness.png",
    alt: "Pipper — Multi-Agent Workspace",
    title: "Pipper™",
    tag: "Agent harness",
    desc: "Desktop workspace for parallel AI agent execution & diffing",
    fit: "cover",
  },
];

const ROBOTICS_SLIDES: ResearchSlide[] = [
  {
    src: "/images/robotics/humanoid-embodied-ai.jpg",
    alt: "GrowX Robotics — Humanoid Embodied Intelligence & Kinematics",
    title: "Embodied Humanoid AI",
    tag: "Kinematics",
    desc: "Autonomous spatial perception, neural control & physical actuation",
    fit: "cover",
  },
  {
    src: "/images/robotics/autonomous-manipulation.jpg",
    alt: "GrowX Robotics — Autonomous Precision Manipulation & Real-Time Teleoperation",
    title: "Autonomous Manipulation",
    tag: "Manipulation",
    desc: "Sub-millimeter multi-axis robotic control & dynamic tool calibration",
    fit: "cover",
  },
];

interface ShowcaseWindowProps {
  identifier: string;
  statusText: string;
  slides: ResearchSlide[];
  interval: number;
  showHudBadges?: boolean;
}

function ShowcaseWindow({
  identifier,
  statusText,
  slides,
  interval,
  showHudBadges = false,
}: ShowcaseWindowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [isPaused, slides.length, interval]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div
      className="mt-7 sm:mt-8 flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Technical Window Header */}
      <div className="h-9 px-3.5 bg-black/60 rounded-t-xl border border-[var(--res-border)] border-b-0 flex items-center justify-between select-none">
        {/* Left window control dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-[var(--res-border)] transition-colors duration-200 group-hover:bg-[var(--res-border-lit)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--res-border)] transition-colors duration-200 group-hover:bg-[var(--res-border-lit)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--res-border)] transition-colors duration-200 group-hover:bg-[var(--res-border-lit)]" />
        </div>

        {/* Centered project identifier */}
        <div className="font-mono text-[11px] text-[var(--res-text)] px-2.5 py-0.5 rounded bg-black/70 border border-[var(--res-border)]">
          {identifier}
        </div>

        {/* Right status indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--res-accent)] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--res-accent)]" aria-hidden="true" />
          <span className="hidden sm:inline font-mono text-[10px]">{statusText}</span>
        </div>
      </div>

      {/* Immersive Visual Display */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--res-surface)] border border-[var(--res-border)]">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.src} className="relative w-full h-full shrink-0 bg-[var(--res-surface)]">
              {slide.isComponent ? (
                <DeepfakeSimpleCardDiagram className="w-full h-full" />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={
                      slide.fit === "contain"
                        ? "object-contain object-center p-3"
                        : "object-cover object-center"
                    }
                    priority={idx === 0}
                  />

                  {showHudBadges && idx === 0 && (
                    <>
                      <div className="absolute top-3 left-3.5 text-[10px] text-[var(--res-accent)] bg-black/70 px-2 py-0.5 rounded border border-[var(--res-border)] hidden sm:block">
                        Embodied V2
                      </div>
                      <div className="absolute top-3 right-3.5 text-[10px] text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-[var(--res-border)] hidden sm:block">
                        Calibrated 120Hz
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Technical Metadata Strip */}
      <div className="bg-black/60 rounded-b-xl border border-[var(--res-border)] border-t-0 p-3.5 sm:p-4 flex items-center justify-between gap-4 select-none">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--res-accent)] font-medium">
              {activeSlide.tag}
            </span>
            <span className="text-[var(--res-border)]" aria-hidden="true">·</span>
            <span className="text-sm font-semibold text-[var(--res-heading)] truncate">
              {activeSlide.title}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--res-text)] truncate font-normal">
            {activeSlide.desc}
          </p>
        </div>

        {/* Slide Progress Dots */}
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                i === currentIndex
                  ? "w-4 bg-[var(--res-accent)]"
                  : "w-1.5 bg-[var(--res-border)] hover:bg-[var(--res-border-lit)]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <div className="flex flex-col bg-black text-foreground min-h-screen">
      <PageHero
        title="Research"
        viewingText="R&D"
        exploreText="Our work"
        tagline="AI & robotics labs"
      />

      <section
        aria-label="Research and engineering labs"
        className="w-full bg-black px-6 md:px-10 xl:px-16 2xl:px-24 pb-36 border-t border-[var(--res-border)] pt-16"
      >
        <div className="max-w-7xl xl:max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
          {/* Cards Grid */}
          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 xl:gap-12">
            {/* AI LAB CARD */}
            <AnimatedItem>
              <Link
                href="/ailab"
                className="group block h-full rounded-2xl bg-[var(--res-card)] border border-[var(--res-border)] p-6 sm:p-8 lg:p-9 transition-colors duration-200 hover:border-[var(--res-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--res-accent)] active:scale-[0.99] motion-reduce:transition-none select-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl text-[var(--res-heading)] tracking-tight leading-tight">
                      AI Lab
                    </h3>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[var(--res-border)] bg-black/40 flex items-center justify-center text-[var(--res-text)] transition-colors duration-200 group-hover:border-[var(--res-accent)] group-hover:text-[var(--res-accent)] group-hover:bg-[var(--res-accent)]/10 shrink-0 motion-reduce:transition-none">
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm sm:text-base lg:text-lg text-[var(--res-text)] leading-relaxed max-w-xl font-normal">
                    We research and develop new AI models, methods, and systems in-house.
                  </p>
                </div>

                <ShowcaseWindow
                  identifier="growx/ailab"
                  statusText="Live"
                  slides={AILAB_SLIDES}
                  interval={4000}
                />
              </Link>
            </AnimatedItem>

            {/* ROBOTICS LAB CARD */}
            <AnimatedItem>
              <Link
                href="/robotics"
                className="group block h-full rounded-2xl bg-[var(--res-card)] border border-[var(--res-border)] p-6 sm:p-8 lg:p-9 transition-colors duration-200 hover:border-[var(--res-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--res-accent)] active:scale-[0.99] motion-reduce:transition-none select-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl text-[var(--res-heading)] tracking-tight leading-tight">
                      Robotics Lab
                    </h3>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[var(--res-border)] bg-black/40 flex items-center justify-center text-[var(--res-text)] transition-colors duration-200 group-hover:border-[var(--res-accent)] group-hover:text-[var(--res-accent)] group-hover:bg-[var(--res-accent)]/10 shrink-0 motion-reduce:transition-none">
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm sm:text-base lg:text-lg text-[var(--res-text)] leading-relaxed max-w-xl font-normal">
                    Autonomous systems, embodied intelligence, and physical AI platforms bridging software models with real-world robotics.
                  </p>
                </div>

                <ShowcaseWindow
                  identifier="growx/robotics"
                  statusText="Active R&D"
                  slides={ROBOTICS_SLIDES}
                  interval={4500}
                  showHudBadges={true}
                />
              </Link>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>
    </div>
  );
}
