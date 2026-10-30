"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Statement {
  letter: string;
  label: string | null;
  text: ReactNode;
}

const STATEMENTS: Statement[] = [
  {
    letter: "G",
    label: null,
    text: (
      <>
        India's AI-native software Company,<br />
        product studio and AI Engineering Lab
      </>
    ),
  },
  {
    letter: "R",
    label: "WHO WE ARE",
    text: "A group of builders, engineers and product minds obsessed with software, AI and execution.",
  },
  {
    letter: "O",
    label: "OUR VISION",
    text: "We turn ideas into software, AI agents and scalable products.",
  },
  {
    letter: "W",
    label: "OUR PHILOSOPHY",
    text: "Not as vendors, but as product partners and technical co-founders.",
  },
  {
    letter: "X",
    label: "GET IN TOUCH",
    text: (
      <>
        We help legacy enterprises become <span className="whitespace-nowrap">AI-native.</span>
      </>
    ),
  },
];

const LAST = STATEMENTS.length - 1;
// Fractions of the pinned scroll spent holding the first (G) and last (X) statements
const LEAD_IN = 0.06;
const LEAD_OUT = 0.1;

/**
 * GrowxStatements
 *
 * One pinned section. While it is stuck to the viewport, scrolling ticks the
 * five G/R/O/W/X statements upward in place: each statement holds while you
 * read it, then slides up as the next one slides in from below. The letter
 * rail stays still and highlights the statement on screen.
 */
export function GrowxStatements() {
  const sectionRef = useRef<HTMLElement>(null);
  // 0 = G … 4 = X; fractional while a statement is sliding
  const [position, setPosition] = useState(0);
  const activeIndex = Math.round(position);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Position is a pure function of scroll progress (no catch-up loop), so the
    // statement on screen always matches where the reader is in the pinned track.
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const pinDistance = section.offsetHeight - window.innerHeight;
      if (pinDistance <= 0) return;
      const progress = Math.min(Math.max(-section.getBoundingClientRect().top / pinDistance, 0), 1);

      // Short hold on G after pinning and on X before release
      const usable = Math.min(Math.max((progress - LEAD_IN) / (1 - LEAD_IN - LEAD_OUT), 0), 1);

      // Hold each statement, then slide during the middle 50% between two letters
      const track = usable * LAST;
      const step = Math.min(Math.floor(track), LAST - 1);
      const local = Math.min(Math.max((track - step - 0.25) / 0.5, 0), 1);
      const value = step + local * local * (3 - 2 * local);
      const next = reduceMotion ? Math.round(value) : value;
      setPosition((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Uses the standalone `translate` property: globals.css "mobile performance mode"
  // forces `transform: none !important` below 768px, which would stack every statement.
  // The short transition smooths wheel steps on desktop (mobile mode strips it; touch scroll is continuous).
  const tickerStyle = (idx: number) => ({
    translate: `0 ${(idx - position) * 100}%`,
    transition: "translate 160ms cubic-bezier(0.22, 0.61, 0.36, 1)",
  });

  const edgeMask = {
    maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
  };

  const activeLabel = STATEMENTS[activeIndex].label;

  return (
    <section
      ref={sectionRef}
      aria-label="GrowxLabs in five statements"
      // !overflow-visible: globals.css forces overflow:hidden on every <section>, which would break sticky
      className="w-full relative h-[500dvh] border-b border-white/10 bg-black flex-none !overflow-visible"
    >
      <div className="sticky top-0 h-dvh overflow-hidden px-6 md:px-10 xl:px-16 2xl:px-24 flex flex-col justify-center pt-20 sm:pt-28 pb-8">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full relative flex items-center justify-center min-h-[300px]">
          {/* Left: fixed letter rail */}
          <div className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-4 font-mono text-xs text-muted-foreground select-none z-10">
            {STATEMENTS.map((item, idx) => (
              <span
                key={item.letter}
                className={cn("transition-colors duration-200", idx === activeIndex && "text-foreground font-bold")}
              >
                {idx === activeIndex ? `[${item.letter}]` : item.letter}
              </span>
            ))}
          </div>

          {/* Center: statement ticker */}
          <div className="relative w-full max-w-4xl h-[300px] overflow-hidden" style={edgeMask}>
            {STATEMENTS.map((item, idx) => (
              <div
                key={item.letter}
                aria-hidden={idx !== activeIndex}
                className="absolute inset-0 flex items-center justify-center text-center px-8 will-change-transform"
                style={tickerStyle(idx)}
              >
                <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] font-medium text-foreground tracking-tight leading-[1.35] font-sans">
                  {item.text}
                </h2>
              </div>
            ))}
          </div>

          {/* Right: section label ticks with its statement */}
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-6 w-40 overflow-hidden font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase select-none">
            {STATEMENTS.map((item, idx) => (
              <span
                key={item.letter}
                className="absolute inset-0 flex items-center justify-end"
                style={tickerStyle(idx)}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom footer on G (all sizes) */}
        <div
          className="absolute bottom-8 left-6 right-6 md:left-10 md:right-10 xl:left-16 xl:right-16 2xl:left-24 2xl:right-24 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-muted-foreground uppercase select-none"
          style={{ opacity: Math.max(0, 1 - position * 2) }}
        >
          <span>SOFTWARE STUDIO</span>
          <span className="text-foreground font-bold">{`{ GROWXLABS }`}</span>
          <span>AI LAB</span>
        </div>

        {/* Mobile footer on R–X: label + letters */}
        <div
          className="flex sm:hidden absolute bottom-8 left-6 right-6 items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase select-none"
          style={{ opacity: Math.min(1, Math.max(0, position * 2 - 1)) }}
        >
          <span>{activeLabel || ""}</span>
          <span className="flex gap-2">
            {STATEMENTS.map((item, idx) => (
              <span key={item.letter} className={cn(idx === activeIndex && "text-foreground font-bold")}>
                {idx === activeIndex ? `[${item.letter}]` : item.letter}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
