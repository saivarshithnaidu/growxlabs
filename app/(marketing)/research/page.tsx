"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { DeepfakeSimpleCardDiagram } from "@/components/ailab/DeepfakeSimpleCardDiagram";
import styles from "./research.module.css";

/**
 * A lab item. With `src` it shows that real screenshot or photo; with `isComponent` the live
 * Deepfake diagram; with neither, the panel sets the item's name in type (no stand-in picture).
 */
interface LabItem {
  title: string;
  detail: string;
  src?: string;
  alt?: string;
  fit?: "contain" | "cover";
  isComponent?: boolean;
  caption?: string;
}

// AI Lab: real product screens lead (the most populated first), the Deepfake diagram last
const AILAB_ITEMS: LabItem[] = [
  {
    title: "AI-Native DMS",
    detail: "Distribution management system",
    src: "/portfolio/trionyx-dashboard.png",
    alt: "AI-Native DMS — Distribution Management System",
    fit: "cover",
  },
  {
    title: "Pipper™",
    detail: "Multi-agent workspace",
    src: "/images/ailab/pipper-harness.png",
    alt: "Pipper — Multi-Agent Workspace",
    fit: "cover",
  },
  {
    title: "GrowX Crawl API Suite",
    detail: "RESTful API specification suite",
    src: "/portfolio/growx-crawl-api.png",
    alt: "GrowX Crawl — RESTful API Specification Suite",
    fit: "cover",
  },
  {
    title: "GrowX Crawl™",
    detail: "Extraction playground",
    src: "/images/ailab/crawl-playground.png",
    alt: "GrowX Crawl — Extraction Playground",
    fit: "cover",
  },
  {
    title: "GrowX Deepfake™",
    detail: "Neural architecture & pipeline",
    isComponent: true,
  },
];

// Robotics Lab: concept renders until real photos of the lab's work exist; `caption` labels them
// as such on the panel. Swap `src` for a real photo and drop the caption.
const ROBOTICS_ITEMS: LabItem[] = [
  {
    title: "Embodied Humanoid AI",
    detail: "Humanoid intelligence & kinematics",
    src: "/images/robotics/humanoid-embodied-ai.jpg",
    alt: "Concept render of a humanoid robot beside a robotic arm",
    fit: "cover",
    caption: "Concept render",
  },
  {
    title: "Autonomous Manipulation",
    detail: "Precision manipulation & teleoperation",
    src: "/images/robotics/autonomous-manipulation.jpg",
    alt: "Concept render of a robotic arm machining an engine block",
    fit: "cover",
    caption: "Concept render",
  },
];

/** The media panel for one item: the real picture, the live diagram, or the item set in type. */
function LabPanel({ item, priority }: { item: LabItem; priority: boolean }) {
  if (item.isComponent) {
    return (
      <div className="h-full w-full p-2.5 sm:p-4">
        <DeepfakeSimpleCardDiagram className="h-full w-full overflow-hidden rounded-lg" />
      </div>
    );
  }
  if (item.src) {
    return (
      <Image
        src={item.src}
        alt={item.alt ?? item.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={item.fit === "contain" ? "object-contain object-center p-2.5 sm:p-4" : "object-cover object-left-top"}
        priority={priority}
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col justify-center p-6 sm:p-8">
      <p className="min-w-0 break-words font-serif text-[clamp(26px,3vw,40px)] font-semibold leading-[1.08] tracking-tight text-[var(--svc-heading)]">
        {item.title}
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--svc-text)]">{item.detail}</p>
    </div>
  );
}

/**
 * Lab card: a label and a round arrow link on top, the large title and description, then an
 * inset media frame pinned to the bottom. The frame's top bar holds the lab's projects as tabs
 * that switch the panel; the chosen one's detail sits on the picture. Dot grid from the module.
 */
function LabCard({
  href,
  label,
  title,
  description,
  cta,
  items,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  items: LabItem[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={`${styles.card} flex h-full flex-col rounded-3xl border border-[var(--svc-border)] p-5 sm:p-10`}>
      {/* Label and arrow */}
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-md border border-[var(--svc-border)] bg-[var(--svc-card)] px-2.5 py-1 text-sm text-[var(--svc-text)]">
          {label}
        </span>
        <Link
          href={href}
          aria-label={cta}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--svc-border)] bg-[var(--svc-card)] text-[var(--svc-heading)] outline-none transition-colors duration-200 hover:border-[var(--svc-accent)] hover:bg-[var(--svc-accent)] hover:text-[var(--svc-on-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--svc-accent)] active:opacity-80"
        >
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>

      {/* Title and description */}
      <h3 className="mt-10 min-w-0 break-words font-serif text-[40px] font-semibold leading-[1.05] tracking-tight text-[var(--svc-heading)] sm:mt-14 sm:text-[56px]">
        {title}
      </h3>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--svc-text)] sm:text-lg lg:min-h-[58px]">{description}</p>

      {/* Media frame: project tabs on the bar, the chosen panel under */}
      <div className="flex-1" />
      <div className="mt-10 overflow-hidden rounded-xl border border-[var(--svc-border)] bg-black shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)]">
        <div role="group" aria-label={`${title} projects`} className={`${styles.tabs} flex gap-x-1 overflow-x-auto border-b border-[var(--svc-border)] bg-[var(--svc-card)] px-2 py-1.5`}>
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`min-h-8 shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2.5 text-xs outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--svc-accent)] active:opacity-80 ${
                  isActive
                    ? "bg-[var(--svc-border)] text-[var(--svc-accent)]"
                    : "text-[var(--svc-text)] hover:text-[var(--svc-heading)]"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Items stacked in one cell, the chosen one fades in */}
        <div className="relative grid aspect-[16/10] w-full">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`${styles.panel} relative col-start-1 row-start-1 h-full w-full ${
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== active}
            >
              <LabPanel item={item} priority={i === 0} />
              <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-md bg-black/75 px-2 py-1 text-xs text-[var(--svc-text)]">
                {item.caption ? `${item.detail} (${item.caption.toLowerCase()})` : item.detail}
              </span>
            </div>
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

          <AnimatedStagger className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 xl:gap-10">
            <AnimatedItem className="h-full">
              <LabCard
                href="/ailab"
                label="growx/ailab"
                title="AI Lab"
                description="We research and develop new AI models, neural methods, and autonomous agent workflows in-house."
                cta="Explore AI Lab"
                items={AILAB_ITEMS}
              />
            </AnimatedItem>

            <AnimatedItem className="h-full">
              <LabCard
                href="/robotics"
                label="growx/robotics"
                title="Robotics Lab"
                description="Autonomous systems, embodied humanoid intelligence, and physical AI platforms bridging software models with real-world robotics."
                cta="Explore robotics"
                items={ROBOTICS_ITEMS}
              />
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </div>
    </div>
  );
}
