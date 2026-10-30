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

/**
 * GrowxSection
 * 
 * One unified, scroll-pinned section for GROWX.
 * Generous scroll height gives comfortable breathing room between statements.
 * Each statement holds firmly in view, and cleanly transitions without overlapping.
 */
export function GrowxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState(0);

  const activeIndex = Math.min(Math.max(Math.round(track), 0), TOTAL_STEPS);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollableDistance = container.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Scrolled distance from when the top of the container reaches the top of the viewport
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
    const continuousTrack = progress * TOTAL_STEPS;

    setTrack(continuousTrack);
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

    const targetProgress = index / TOTAL_STEPS;
    const targetOffset = containerTop + targetProgress * scrollableDistance;
    window.scrollTo({ top: targetOffset, behavior: "smooth" });
  };

  const activeLabel = STATEMENTS[activeIndex]?.label;

  return (
    <div
      ref={containerRef}
      data-sticky-host="true"
      className="relative w-full h-[380vh] sm:h-[400vh] bg-black select-none border-b border-white/10"
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

          {/* ═══ CENTER STATEMENT — Clean Hold & Drift Crossfade (No text overlap) ═══ */}
          <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full max-w-4xl px-4 sm:px-12 z-10">
            {STATEMENTS.map((item, idx) => {
              const diff = track - idx;
              
              // Clean non-overlapping animation calculation:
              // - Holds solid opacity: 1 while |diff| <= 0.28 (generous breathing room)
              // - Smoothly exits upwards when diff > 0.28 (opacity 1 -> 0 between diff 0.28 and 0.55)
              // - Smoothly enters from below when diff < -0.28 (opacity 0 -> 1 between diff -0.55 and -0.28)
              let opacity = 0;
              let translateY = 0;

              if (Math.abs(diff) <= 0.28) {
                opacity = 1;
                translateY = 0;
              } else if (diff > 0.28 && diff <= 0.58) {
                // Outgoing (scrolling down): fades out and drifts upward
                const progressOut = (diff - 0.28) / 0.30;
                opacity = Math.max(0, 1 - progressOut);
                translateY = -progressOut * 18;
              } else if (diff < -0.28 && diff >= -0.58) {
                // Incoming (scrolling down): fades in from below
                const progressIn = (-diff - 0.28) / 0.30;
                opacity = Math.max(0, 1 - progressIn);
                translateY = progressIn * 18;
              } else {
                opacity = 0;
                translateY = diff > 0 ? -18 : 18;
              }

              return (
                <div
                  key={item.letter}
                  className="col-start-1 row-start-1 w-full text-center select-text transition-opacity duration-150"
                  style={{
                    opacity,
                    transform: `translate3d(0, ${translateY}px, 0)`,
                    pointerEvents: opacity > 0.6 ? "auto" : "none",
                  }}
                  aria-hidden={opacity < 0.1}
                >
                  {item.statement}
                </div>
              );
            })}
          </div>

          {/* ═══ RIGHT RAIL — Section Label (Desktop) ═══ */}
          <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 h-6 w-44 items-center justify-end font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase select-none z-30">
            {STATEMENTS.map((item, idx) => {
              if (!item.label) return null;
              const diff = track - idx;
              let opacity = 0;
              let translateY = 0;

              if (Math.abs(diff) <= 0.28) {
                opacity = 1;
                translateY = 0;
              } else if (diff > 0.28 && diff <= 0.58) {
                const progressOut = (diff - 0.28) / 0.30;
                opacity = Math.max(0, 1 - progressOut);
                translateY = -progressOut * 10;
              } else if (diff < -0.28 && diff >= -0.58) {
                const progressIn = (-diff - 0.28) / 0.30;
                opacity = Math.max(0, 1 - progressIn);
                translateY = progressIn * 10;
              }

              return (
                <span
                  key={item.letter}
                  className="absolute right-0"
                  style={{
                    opacity,
                    transform: `translate3d(0, ${translateY}px, 0)`,
                    pointerEvents: opacity > 0.6 ? "auto" : "none",
                  }}
                >
                  {item.label}
                </span>
              );
            })}
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
            opacity: Math.max(0, 1 - track * 2),
            pointerEvents: track < 0.5 ? "auto" : "none",
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
            opacity: Math.min(1, Math.max(0, (track - 0.5) * 2)),
            pointerEvents: track >= 0.5 ? "auto" : "none",
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
