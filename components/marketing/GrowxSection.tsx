"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

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
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
        India&apos;s AI-native software Company,<br />
        product studio and AI Engineering Lab
      </h2>
    ),
  },
  {
    letter: "R",
    label: "WHO WE ARE",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
        A group of builders, engineers and product minds obsessed with software, AI and execution.
      </h2>
    ),
  },
  {
    letter: "O",
    label: "OUR VISION",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
        We turn ideas into software, AI agents and scalable products.
      </h2>
    ),
  },
  {
    letter: "W",
    label: "OUR PHILOSOPHY",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
        Not as vendors, but as product partners and technical co-founders.
      </h2>
    ),
  },
  {
    letter: "X",
    label: "GET IN TOUCH",
    statement: (
      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
        We help legacy enterprises become <span className="whitespace-nowrap">AI-native.</span>
      </h2>
    ),
  },
];

const TOTAL_STEPS = STATEMENTS.length - 1; // 4 transitions between 5 statements

// Fixed height of the statement slot in pixels
const STATEMENT_SLOT_HEIGHT = 280;
// Fixed height of the right rail label slot in pixels
const LABEL_SLOT_HEIGHT = 28;

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

  const easedTrack = computeEasedTrack(rawTrack);
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
        className="sticky top-0 w-full h-screen min-h-dvh bg-black flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-6 md:px-10 xl:px-16 2xl:px-24 overflow-hidden z-20"
      >
        {/* Center Stage Container */}
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full relative flex-grow flex items-center justify-center">
          
          {/* ═══ LEFT RAIL — GROWX Indicator (Desktop) ═══ */}
          <nav
            aria-label="GROWX Navigation"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-4 font-mono text-xs select-none z-30"
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
                    "grid h-7 w-7 shrink-0 place-items-center leading-none transition-all duration-200 cursor-pointer bg-transparent border-0",
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? `[${item.letter}]` : item.letter}
                </button>
              );
            })}
          </nav>

          {/* ═══ CENTER STATEMENT REEL — Vertical Section Reel (No Text Overlaying) ═══ */}
          <div
            className="w-full max-w-4xl px-4 sm:px-12 overflow-hidden relative z-10 select-text"
            style={{ height: `${STATEMENT_SLOT_HEIGHT}px` }}
          >
            <div
              data-growx-track="true"
              className="w-full will-change-transform"
              style={{
                transform: `translate3d(0, -${easedTrack * STATEMENT_SLOT_HEIGHT}px, 0)`,
                transition: "transform 0.05s linear",
              }}
            >
              {STATEMENTS.map((item, idx) => {
                const isCurrent = activeIndex === idx;
                const distance = Math.abs(easedTrack - idx);
                // Subtle opacity fade on leaving/entering slots (never double-overlaying)
                const opacity = Math.max(0.15, Math.min(1, 1 - (distance - 0.2) / 0.8));

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

          {/* ═══ RIGHT RAIL — Vertical Label Reel (Desktop) ═══ */}
          <div
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-48 overflow-hidden z-30 pointer-events-none"
            style={{ height: `${LABEL_SLOT_HEIGHT}px` }}
          >
            <div
              data-growx-track="true"
              className="w-full will-change-transform"
              style={{
                transform: `translate3d(0, -${easedTrack * LABEL_SLOT_HEIGHT}px, 0)`,
                transition: "transform 0.05s linear",
              }}
            >
              {STATEMENTS.map((item) => (
                <div
                  key={item.letter}
                  className="w-full flex items-center justify-end font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase"
                  style={{ height: `${LABEL_SLOT_HEIGHT}px` }}
                >
                  {item.label || ""}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ═══ Desktop Footer ═══ */}
        <div className="hidden sm:flex max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-muted-foreground uppercase select-none pt-4">
          <span>SOFTWARE STUDIO</span>
          <span className="text-foreground font-bold">{`{ GROWXLABS }`}</span>
          <span>AI LAB</span>
        </div>

        {/* ═══ Mobile Footer (State G: Studio / GrowxLabs / AI Lab) ═══ */}
        <div
          className="flex sm:hidden w-full items-center justify-between font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase select-none pt-4 transition-opacity duration-200"
          style={{
            opacity: Math.max(0, 1 - easedTrack * 2),
            pointerEvents: easedTrack < 0.5 ? "auto" : "none",
          }}
        >
          <span>SOFTWARE STUDIO</span>
          <span className="text-foreground font-bold">{`{ GROWXLABS }`}</span>
          <span>AI LAB</span>
        </div>

        {/* ═══ Mobile Footer (States R, O, W, X: Label on Left, Synchronized Letters on Right) ═══ */}
        <div
          className="flex sm:hidden w-full items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase select-none pt-4 transition-opacity duration-200"
          style={{
            opacity: Math.min(1, Math.max(0, (easedTrack - 0.5) * 2)),
            pointerEvents: easedTrack >= 0.5 ? "auto" : "none",
          }}
        >
          <span>{activeLabel || ""}</span>
          <span className="flex items-center gap-2">
            {STATEMENTS.map((item, idx) => {
              const isActive = activeIndex === idx;

              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => scrollToStatement(idx)}
                  className={cn(
                    "transition-all duration-200 bg-transparent border-0 p-0 cursor-pointer",
                    isActive ? "text-foreground font-bold" : "text-muted-foreground"
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
  );
}
