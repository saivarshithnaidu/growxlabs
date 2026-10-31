"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
}

// AI Lab: real product screens lead (the most populated first), the Deepfake diagram last
const AILAB_ITEMS: LabItem[] = [
  {
    title: "TRIONYX™",
    detail: "Distributor Management Platform",
    src: "/portfolio/trionyx-dashboard.png",
    alt: "TRIONYX — Distributor Management Platform",
    fit: "cover",
  },
  {
    title: "Pipper™",
    detail: "Multi-Agent Workspace",
    src: "/images/ailab/pipper-harness.png",
    alt: "Pipper — Multi-Agent Workspace",
    fit: "cover",
  },
  {
    title: "GrowX Crawl API Suite",
    detail: "RESTful API Specification Suite",
    src: "/portfolio/growx-crawl-api.png",
    alt: "GrowX Crawl — RESTful API Specification Suite",
    fit: "cover",
  },
  {
    title: "GrowX Crawl™",
    detail: "Extraction Playground",
    src: "/images/ailab/crawl-playground.png",
    alt: "GrowX Crawl — Extraction Playground",
    fit: "cover",
  },
  {
    title: "GrowX Deepfake™ Architecture",
    detail: "Neural Architecture & Pipeline",
    isComponent: true,
  },
];

// Robotics Lab: no photographs yet. Add `src` and `alt` to an item when a real photo of the
// lab's work exists, and the panel shows it instead of the type.
const ROBOTICS_ITEMS: LabItem[] = [
  {
    title: "Embodied Humanoid AI",
    detail: "Humanoid Embodied Intelligence & Kinematics",
  },
  {
    title: "Autonomous Manipulation",
    detail: "Autonomous Precision Manipulation & Real-Time Teleoperation",
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
 * Lab card as a small index: identifier row, a 16:10 media panel, the lab's projects as a
 * list that switches the panel, then the serif heading, description and action. The whole
 * card is one link (stretched from the action); the project buttons sit above it.
 */
function LabCard({
  href,
  identifier,
  title,
  description,
  cta,
  items,
}: {
  href: string;
  identifier: string;
  title: string;
  description: string;
  cta: string;
  items: LabItem[];
}) {
  const [active, setActive] = useState(0);
  const listId = `${identifier.replace("/", "-")}-projects`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--svc-border)] bg-[var(--svc-card)] transition-colors duration-200 hover:border-[var(--svc-accent)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[var(--svc-accent)]">
      {/* Identifier */}
      <div className="flex h-11 items-center border-b border-[var(--svc-border)] px-5 sm:px-6">
        <span className="text-xs text-[var(--svc-text)]">{identifier}</span>
      </div>

      {/* Media panel: items stacked in one cell, the chosen one fades in */}
      <div className="relative grid aspect-[16/10] w-full overflow-hidden bg-[var(--svc-card)]">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`${styles.panel} relative col-start-1 row-start-1 h-full w-full ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <LabPanel item={item} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Project index: switches the panel */}
      {/* Same minimum height on both cards (5 rows) so the headings and descriptions line up */}
      <ul id={listId} aria-label={`${title} projects`} className="relative z-10 border-y border-[var(--svc-border)] lg:min-h-[226px]">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <li key={item.title} className="border-b border-[var(--svc-border)] last:border-b-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 px-5 py-2 text-left outline-none transition-colors duration-200 hover:bg-[var(--svc-border)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--svc-accent)] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
              >
                <span
                  className={`shrink-0 whitespace-nowrap text-sm ${
                    isActive ? "font-semibold text-[var(--svc-accent)]" : "text-[var(--svc-heading)]"
                  }`}
                >
                  {item.title}
                </span>
                {/* Type-led items already name their detail in the panel above */}
                {isActive && (item.src || item.isComponent) && (
                  <span className="hidden min-w-0 truncate text-xs text-[var(--svc-text)] sm:block">{item.detail}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Heading, description, action */}
      <div className="flex flex-1 flex-col px-5 pt-6 pb-6 sm:px-6 sm:pt-7">
        <h3 className="min-w-0 break-words font-serif text-[32px] font-semibold leading-[1.1] tracking-tight text-[var(--svc-heading)] sm:text-[38px]">
          {title}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--svc-text)]">{description}</p>

        <Link
          href={href}
          className="mt-auto flex items-center justify-between gap-4 pt-8 outline-none after:absolute after:inset-0 after:content-['']"
        >
          <span className="text-sm font-medium text-[var(--svc-accent)]">{cta}</span>
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--svc-border)] text-[var(--svc-heading)] transition-colors duration-200 group-hover:border-[var(--svc-accent)] group-hover:bg-[var(--svc-accent)] group-hover:text-[var(--svc-on-accent)]"
          >
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </span>
        </Link>
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

          <AnimatedStagger className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-10 xl:gap-12">
            <AnimatedItem className="h-full">
              <LabCard
                href="/ailab"
                identifier="growx/ailab"
                title="AI Lab"
                description="We research and develop new AI models, neural methods, and autonomous agent workflows in-house."
                cta="Explore AI Lab"
                items={AILAB_ITEMS}
              />
            </AnimatedItem>

            <AnimatedItem className="h-full">
              <LabCard
                href="/robotics"
                identifier="growx/robotics"
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
