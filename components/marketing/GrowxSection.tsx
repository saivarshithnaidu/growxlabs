"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import styles from "./GrowxSection.module.css";

interface StatementItem {
  letter: string;
  label: string | null;
  statement: React.ReactNode;
}

const STATEMENTS: StatementItem[] = [
  {
    letter: "G",
    label: null,
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans text-balance break-words min-w-0">
        India&apos;s AI-native software Company,<br />
        product studio and AI Engineering Lab
      </h2>
    ),
  },
  {
    letter: "R",
    label: "Who we are",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans text-balance break-words min-w-0">
        A group of builders, engineers and product minds obsessed with software, AI and execution.
      </h2>
    ),
  },
  {
    letter: "O",
    label: "Our vision",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans text-balance break-words min-w-0">
        We turn ideas into software, AI agents and scalable products.
      </h2>
    ),
  },
  {
    letter: "W",
    label: "Our philosophy",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans text-balance break-words min-w-0">
        Not as vendors, but as product partners and technical co-founders.
      </h2>
    ),
  },
  {
    letter: "X",
    label: "Get in touch",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans text-balance break-words min-w-0">
        We help legacy enterprises become <span className="whitespace-nowrap">AI-native.</span>
      </h2>
    ),
  },
];

const TOTAL_STEPS = STATEMENTS.length - 1; // 4 transitions between 5 statements

// Fixed height of the statement slot in pixels
const STATEMENT_SLOT_HEIGHT = 280;

/**
 * Computes an eased continuous track value from raw scroll progress:
 * - Each statement holds firmly in place for the first 60% of its scroll window (generous breathing room).
 * - Smoothly transitions across the remaining 40% with a cubic smoothstep curve.
 * - Statements are rendered in separate vertical slots like sections, making text overlay impossible.
 */
function computeEasedTrack(rawTrack: number): number {
  if (rawTrack <= 0) return 0;
  if (rawTrack >= TOTAL_STEPS) return TOTAL_STEPS;

  const k = Math.floor(rawTrack);
  const frac = rawTrack - k;

  const HOLD_THRESHOLD = 0.60;
  if (frac <= HOLD_THRESHOLD) {
    return k;
  }

  // Smoothstep easeInOut: 3t^2 - 2t^3
  const t = (frac - HOLD_THRESHOLD) / (1 - HOLD_THRESHOLD);
  const smoothT = t * t * (3 - 2 * t);
  return k + smoothT;
}

export function GrowxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rawTrack, setRawTrack] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Reduced motion: statements swap in place instead of sliding through the reel
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollableDistance = container.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Scrolled distance from when the top of the container reaches the top of the viewport
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    const track = progress * TOTAL_STEPS;

    setRawTrack(track);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    updateScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateScroll]);

  const scrollToStatement = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = scrollTop + rect.top;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    // Target progress lands right in the stable hold zone of statement `index`
    const targetProgress = index / TOTAL_STEPS;
    const targetOffset = containerTop + targetProgress * scrollableDistance;
    window.scrollTo({ top: targetOffset, behavior: "smooth" });
  };

  const easedTrack = reduceMotion ? Math.round(computeEasedTrack(rawTrack)) : computeEasedTrack(rawTrack);
  const activeIndex = Math.min(Math.max(Math.round(easedTrack), 0), TOTAL_STEPS);
  const activeLabel = STATEMENTS[activeIndex]?.label;

  return (
    <div
      ref={containerRef}
      data-sticky-host="true"
      className="relative w-full h-[380vh] sm:h-[420vh] bg-black select-none border-b border-white/10"
      aria-label="GROWX Interactive Section"
    >
      {/* ═══ One Stable Pinned Pure-Black Viewport ═══ */}
      <div
        role="region"
        aria-label="GROWX Presentation Stage"
        className="sticky top-0 w-full h-dvh bg-black flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-6 md:px-10 xl:px-16 2xl:px-24 overflow-hidden z-20"
      >
        {/* Center Stage Container */}
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full relative flex-grow flex items-center justify-center">
          
          {/* ═══ LEFT RAIL — GROWX Indicator (Desktop) ═══
              The active letter carries its section's label as a nav label (it used to sit
              alone on the right, announcing the statement). 44px targets at the same 44px pitch. */}
          <nav
            aria-label="GROWX Navigation"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center text-xs select-none z-30"
          >
            {STATEMENTS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => scrollToStatement(idx)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "relative grid h-11 w-11 shrink-0 place-items-center leading-none rounded-md transition-colors duration-200 cursor-pointer bg-transparent border-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-foreground/70",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? `[${item.letter}]` : item.letter}
                  {isActive && item.label && (
                    <span className="hidden lg:inline absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap font-normal text-muted-foreground">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ═══ CENTER STATEMENT REEL — Vertical Section Reel (No Text Overlaying) ═══
              The window's edges fade (styles.reel) so moving text never shows a hard cut. */}
          <div
            className={cn("w-full max-w-4xl px-4 sm:px-12 overflow-hidden relative z-10 select-text", styles.reel)}
            style={{ height: `${STATEMENT_SLOT_HEIGHT}px` }}
          >
            <div
              data-growx-track="true"
              className={cn("w-full will-change-transform", styles.track)}
              style={{ transform: `translate3d(0, -${easedTrack * STATEMENT_SLOT_HEIGHT}px, 0)` }}
            >
              {STATEMENTS.map((item, idx) => {
                const isCurrent = activeIndex === idx;
                const distance = Math.abs(easedTrack - idx);
                // Fade leaving/entering statements fully out before they reach the masked window edge
                const opacity = Math.max(0, Math.min(1, 1 - (distance - 0.2) / 0.6));

                return (
                  <div
                    key={item.letter}
                    className="w-full flex items-center justify-center text-center px-2"
                    style={{
                      height: `${STATEMENT_SLOT_HEIGHT}px`,
                      opacity,
                      pointerEvents: isCurrent ? "auto" : "none",
                    }}
                  >
                    {item.statement}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ═══ Desktop Footer ═══ */}
        <div className="hidden sm:flex max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full items-center justify-between text-xs text-muted-foreground select-none pt-4">
          <span>Software studio</span>
          <span className="text-foreground font-semibold">GrowxLabs</span>
          <span>AI lab</span>
        </div>

        {/* ═══ Mobile Footers: both share one grid cell so they crossfade in place ═══ */}
        <div className="grid sm:hidden w-full pt-4">
        {/* State G: Studio / GrowxLabs / AI Lab */}
        <div
          className="col-start-1 row-start-1 flex w-full items-center justify-between text-xs text-muted-foreground select-none transition-opacity duration-200"
          style={{
            opacity: Math.max(0, 1 - easedTrack * 2),
            pointerEvents: easedTrack < 0.5 ? "auto" : "none",
          }}
        >
          <span>Software studio</span>
          <span className="text-foreground font-semibold">GrowxLabs</span>
          <span>AI lab</span>
        </div>

        {/* States R, O, W, X: Label on Left, Synchronized Letters on Right */}
        <div
          className="col-start-1 row-start-1 flex w-full items-center justify-between text-xs text-muted-foreground select-none transition-opacity duration-200"
          style={{
            opacity: Math.min(1, Math.max(0, (easedTrack - 0.5) * 2)),
            pointerEvents: easedTrack >= 0.5 ? "auto" : "none",
          }}
        >
          <span>{activeLabel || ""}</span>
          <span className="flex items-center">
            {STATEMENTS.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => scrollToStatement(idx)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "inline-grid min-h-11 min-w-8 place-items-center rounded-md transition-colors duration-200 bg-transparent border-0 px-1 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:text-foreground/70",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  {isActive ? `[${item.letter}]` : item.letter}
                </button>
              );
            })}
          </span>
        </div>
        </div>

      </div>
    </div>
  );
}
