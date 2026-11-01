import type { Slide } from "../inspector/inspectorTypes";

/*
 * The GrowX brand kit for carousels: a handful of colours, two fonts, a logo and the footer
 * name. Applying it restyles a slide's elements (colour, font, CTA, footer) without moving or
 * resizing anything, so layouts stay as designed.
 */

export interface BrandKit {
  brandName: string;
  logoUrl: string;
  colors: {
    primary: string; // buttons, category, bullets
    ink: string; // headings and body text
    muted: string; // secondary text, dividers
    paper: string; // slide background
  };
  fonts: {
    heading: string;
    body: string;
  };
}

/** Fonts the editor actually loads (or the system provides), so the kit never picks a fallback. */
export const BRAND_FONTS: Array<{ name: string; css: string }> = [
  { name: "Inter", css: "'Inter', sans-serif" },
  { name: "Outfit", css: "'Outfit', sans-serif" },
  { name: "Playfair Display", css: "'Playfair Display', serif" },
  { name: "Helvetica", css: "Helvetica, Arial, sans-serif" },
];

export const DEFAULT_BRAND_KIT: BrandKit = {
  brandName: "GrowxLabs",
  logoUrl: "",
  colors: { primary: "#0075de", ink: "#0a0a0c", muted: "#71717a", paper: "#ffffff" },
  fonts: { heading: "Inter", body: "Inter" },
};

const fontCss = (name: string) => BRAND_FONTS.find((f) => f.name === name)?.css || `'${name}', sans-serif`;
const HEX = /^#[0-9a-f]{6}$/i;

/** Accepts stored or edited data and returns a complete, valid kit. */
export function normaliseBrandKit(value: unknown): BrandKit {
  const v = (value && typeof value === "object" ? value : {}) as Partial<BrandKit>;
  const c = (v.colors || {}) as Partial<BrandKit["colors"]>;
  const f = (v.fonts || {}) as Partial<BrandKit["fonts"]>;
  const pick = (hex: unknown, fallback: string) => (typeof hex === "string" && HEX.test(hex) ? hex : fallback);
  const font = (name: unknown, fallback: string) => (typeof name === "string" && BRAND_FONTS.some((x) => x.name === name) ? name : fallback);
  const d = DEFAULT_BRAND_KIT;
  return {
    brandName: typeof v.brandName === "string" ? v.brandName.slice(0, 60) : d.brandName,
    logoUrl: typeof v.logoUrl === "string" ? v.logoUrl.slice(0, 2000) : d.logoUrl,
    colors: {
      primary: pick(c.primary, d.colors.primary),
      ink: pick(c.ink, d.colors.ink),
      muted: pick(c.muted, d.colors.muted),
      paper: pick(c.paper, d.colors.paper),
    },
    fonts: { heading: font(f.heading, d.fonts.heading), body: font(f.body, d.fonts.body) },
  };
}

/** Readable text colour on top of a fill (for the CTA label). */
export function textOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#0a0a0c" : "#ffffff";
}

/** Restyles one slide with the kit. Positions, sizes, text and images are untouched. */
export function applyBrandKit(slide: Slide, kit: BrandKit): Slide {
  const heading = fontCss(kit.fonts.heading);
  const body = fontCss(kit.fonts.body);
  const { primary, ink, muted, paper } = kit.colors;
  return {
    ...slide,
    backgroundColor: paper,
    category: { ...slide.category, fontFamily: body, color: primary },
    headline: { ...slide.headline, fontFamily: heading, color: ink },
    body: { ...slide.body, fontFamily: body, color: ink },
    bullets: { ...slide.bullets, fontFamily: body, color: ink, bulletColor: primary },
    quote: { ...slide.quote, fontFamily: heading, color: ink, borderColor: primary, authorColor: muted },
    cta: { ...slide.cta, fontFamily: body, backgroundColor: primary, textColor: textOn(primary), color: textOn(primary) },
    divider: { ...slide.divider, color: muted },
    author: { ...slide.author, fontFamily: body, color: muted },
    logo: kit.logoUrl ? { ...slide.logo, logoUrl: kit.logoUrl } : slide.logo,
    footer: { ...slide.footer, brandName: kit.brandName || slide.footer.brandName, color: ink },
  };
}

export const brandSwatches = (kit: BrandKit) => [kit.colors.primary, kit.colors.ink, kit.colors.muted, kit.colors.paper];
