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

/**
 * GrowxStatements
 * 
 * One unified sticky section for GROWX.
 * The viewport stays firmly pinned in place on both mobile and desktop while
 * scrolling through G → R → O → W → X. Statements crossfade cleanly with
 * zero layout shift, and the active letter and label synchronize seamlessly.
 */
export function GrowxStatements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollableDistance = container.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Progress from 0 to 1 as container scrolls past top of viewport
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    // 5 clean slices across the pinned track
    let nextIndex = 0;
    if (progress < 0.20) nextIndex = 0;
    else if (progress < 0.40) nextIndex = 1;
    else if (progress < 0.60) nextIndex = 2;
    else if (progress < 0.80) nextIndex = 3;
    else nextIndex = 4;

    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
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

  const scrollToState = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const containerTop = scrollTop + rect.top;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    const targetProgress = (index + 0.5) / 5;
    const targetOffset = containerTop + targetProgress * scrollableDistance;
    window.scrollTo({ top: targetOffset, behavior: "smooth" });
  };

  const currentState = STATEMENTS[activeIndex] || STATEMENTS[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380vh] sm:h-[400vh] bg-black select-none border-b border-white/10 growx-sticky-viewport"
      aria-label="GROWX Interactive Presentation"
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
                  onClick={() => scrollToState(idx)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center leading-none transition-colors duration-200 cursor-pointer bg-transparent border-0",
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

          {/* ═══ CENTER STATEMENT — Crossfade Grid (Zero layout shift) ═══ */}
          <div className="grid grid-cols-1 grid-rows-1 place-items-center w-full max-w-4xl px-4 sm:px-12 z-10">
            {STATEMENTS.map((item, idx) => {
              const isCurrent = activeIndex === idx;
              const isPreceding = idx < activeIndex;

              const translateY = isCurrent ? "0px" : isPreceding ? "-10px" : "10px";
              const opacity = isCurrent ? 1 : 0;

              return (
                <div
                  key={item.letter}
                  className="col-start-1 row-start-1 w-full text-center select-text transition-all duration-300 ease-out"
                  style={{
                    opacity,
                    transform: `translate3d(0, ${translateY}, 0)`,
                    pointerEvents: isCurrent ? "auto" : "none",
                  }}
                  aria-hidden={!isCurrent}
                >
                  {item.statement}
                </div>
              );
            })}
          </div>

          {/* ═══ RIGHT RAIL — Section Label (Desktop) ═══ */}
          <div
            className={cn(
              "hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-4 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase select-none items-end leading-relaxed z-30 transition-all duration-300 ease-out",
              currentState.label
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}
            aria-live="polite"
          >
            <span>{currentState.label || ""}</span>
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
          className={cn(
            "flex sm:hidden w-full items-center justify-between font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase select-none pt-4 transition-opacity duration-300 ease-out",
            activeIndex === 0 ? "opacity-100" : "hidden"
          )}
        >
          <span>SOFTWARE STUDIO</span>
          <span className="text-foreground font-bold">{`{ GROWXLABS }`}</span>
          <span>AI LAB</span>
        </div>

        {/* ═══ Mobile Footer (States R, O, W, X: Label on Left, Synchronized Letters on Right) ═══ */}
        <div
          className={cn(
            "flex sm:hidden w-full items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase select-none pt-4 transition-opacity duration-300 ease-out",
            activeIndex > 0 ? "opacity-100" : "hidden"
          )}
        >
          <span>{currentState.label || ""}</span>
          <span className="flex items-center gap-2">
            {STATEMENTS.map((item, idx) => {
              const isActive = activeIndex === idx;

              if (isActive) {
                return (
                  <button
                    key={item.letter}
                    type="button"
                    onClick={() => scrollToState(idx)}
                    className="text-foreground font-bold transition-all duration-300 bg-transparent border-0 p-0 cursor-pointer"
                  >
                    [{item.letter}]
                  </button>
                );
              }

              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => scrollToState(idx)}
                  className="text-muted-foreground transition-colors duration-200 bg-transparent border-0 p-0 cursor-pointer"
                >
                  {item.letter}
                </button>
              );
            })}
          </span>
        </div>

      </div>
    </div>
  );
}
