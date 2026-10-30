import type { CSSProperties } from "react";
import styles from "./ServicePixelArt.module.css";

/**
 * ServicePixelArt
 *
 * CSS-only pixel illustrations for the four service cards: every one is the same
 * 16 x 10 grid of square <span> cells (no SVG, canvas or images), so they share
 * bounds, pixel size and spacing. Unused cells stay faintly lit like an LED panel.
 *
 * Legend: "." off · "a" connector (dim blue-grey) · "b" structure (blue-grey) · "c" signal (site cyan)
 * Hovering (or focusing inside) the card lights the pixels in a left-to-right wave.
 */

const ART: Record<string, string[]> = {
  // Custom Software Builds: < / >
  software: [
    "................",
    "....bb....bb....",
    "...bb...cc.bb...",
    "..bb....cc..bb..",
    ".bb....cc....bb.",
    ".bb....cc....bb.",
    "..bb..cc....bb..",
    "...bb.cc...bb...",
    "....bb....bb....",
    "................",
  ],
  // Labs & Platforms: four modules on two buses around a cyan hub, packets in transit
  ai: [
    "................",
    ".bbb........bbb.",
    ".bbbacaaaaaabbb.",
    ".bbb...aa...bbb.",
    "..a....cc....a..",
    "..a....cc....a..",
    ".bbb...aa...bbb.",
    ".bbbaaaaaacabbb.",
    ".bbb........bbb.",
    "................",
  ],
  // Fractional CTO: a layered architecture stack, strategy on top
  cto: [
    "................",
    "......cccc......",
    ".......aa.......",
    "..bbbbbbbbbbbb..",
    "..a....aa....a..",
    ".bbbb.cccc.bbbb.",
    "..a....aa....a..",
    ".aaaaaaaaaaaaaa.",
    ".bbbbbbbbbbbbbb.",
    "................",
  ],
  // Technical Co-founders: two closed links that interlock, the shared span in cyan
  founder: [
    "................",
    "..bbbbbbb.......",
    "..b.....b.......",
    "..b....ccbbbbb..",
    "..b....cc....b..",
    "..b....cc....b..",
    "..bbbbbcc....b..",
    ".......b.....b..",
    ".......bbbbbbb..",
    "................",
  ],
};

const LEVEL: Record<string, string> = { ".": "0", a: "1", b: "2", c: "3" };

export function ServicePixelArt({ type }: { type: string }) {
  const rows = ART[type] ?? ART.software;
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.grid}>
        {rows.flatMap((row, y) =>
          row.split("").map((ch, x) => (
            <span
              key={`${y}-${x}`}
              className={styles.px}
              data-level={LEVEL[ch] ?? "0"}
              style={{ "--x": x } as CSSProperties}
            />
          ))
        )}
      </div>
    </div>
  );
}
