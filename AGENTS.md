<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:hallmark-design-rules -->
# Hallmark Design Standards ("The Floor")

Always use the **Hallmark** design skill (`.agents/skills/hallmark/SKILL.md`) for all frontend, UI, styling, and web page work in this repository:

1. **Tokens Over Magic Values**: Every color and font must go through declared tokens (`:root` in `globals.css` or Tailwind theme). Avoid arbitrary hexes directly in markup when possible.
2. **Transition Restraint**: NEVER use `transition: all`. Never animate `width`, `height`, `top`, or `left`. Animate only hardware-accelerated properties (`transform`, `opacity`).
3. **Typography Hygiene**: Never one italic word inside a roman heading. Labels, badges, captions, table headers, and nav links must use sentence or lowercase, untracked (no tracked all-caps or small caps).
4. **Viewport & Overflow**: Use `overflow-x: clip` on `html` and `body`. Never `overflow-x: hidden`, never `100vw`.
5. **Layout Discipline**: Image-bearing grid tracks must use `minmax(0, 1fr)`. Display heads carry `overflow-wrap: break-word; min-width: 0`.
6. **Accessibility**: Every interactive element must have `:focus-visible` appearing immediately. All motion must respect `@media (prefers-reduced-motion: reduce)` / `motion-reduce:`.
7. **Zero AI Slop / Clichés**:
   - Strictly NO purple-to-blue gradients or glowing purple blobs.
   - NO card-inside-a-card nesting.
   - NO emojis as icons (use Lucide / SVG icons).
   - NO hand-drawn fake OS or browser chrome.
   - NO invented testimonials, fake metrics ("99.9% satisfied"), or fake logos.
   - Containers must be capped and centered (max width capped; at 1920px margins grow, not grid sprawl).
8. **Commands Available**:
   - `/hallmark <prompt>`: Design new sections or pages.
   - `/hallmark redesign <path>`: Redesign an existing page/component while preserving content and wiring.
   - `/hallmark audit <path>`: Audit an existing UI for AI slop patterns and gate compliance.
   - `node .agents/skills/hallmark/scripts/sloplint.mjs <file>`: Run automated design linter.
<!-- END:hallmark-design-rules -->
