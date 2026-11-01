import test from "node:test";
import assert from "node:assert";
import { applyBrandKit, DEFAULT_BRAND_KIT, normaliseBrandKit, textOn } from "./brandKit.ts";

const el = (extra: Record<string, unknown> = {}) => ({ x: 72, y: 100, width: 900, height: 120, visible: true, locked: false, opacity: 1, rotation: 0, align: "left", fontFamily: "x", fontSize: 40, lineHeight: 1.2, letterSpacing: 0, color: "#123456", fontWeight: "700", zIndex: 1, ...extra });
const slide: any = {
  id: "s1",
  backgroundColor: "#000000",
  category: el({ text: "Services" }),
  headline: el({ text: "Becoming AI-native", maxLines: 3, autoScale: true }),
  featuredImage: el({ mediaUrl: "img.png" }),
  secondaryImage: el({ mediaUrl: "" }),
  body: el({ text: "Body", maxLines: 4, autoScale: true }),
  bullets: el({ items: ["a"], bulletStyle: "dot", spacing: 8 }),
  quote: el({ text: "q", author: "a", borderRadius: 8, borderColor: "#000", backgroundColor: "#fff" }),
  cta: el({ text: "Read", link: "#", backgroundColor: "#000", textColor: "#fff", borderRadius: 8 }),
  logo: el({ logoUrl: "old.png" }),
  divider: el({ thickness: 1 }),
  author: el({ name: "n", avatarUrl: "" }),
  footer: { brandName: "OLD", logoEnabled: true, dividerEnabled: true, pageNumberEnabled: true, opacity: 1, color: "#000", align: "left" },
};

test("applying the brand restyles colours and fonts but never moves or rewrites anything", () => {
  const kit = normaliseBrandKit({ ...DEFAULT_BRAND_KIT, colors: { primary: "#0075de", ink: "#111111", muted: "#777777", paper: "#fafafa" }, fonts: { heading: "Playfair Display", body: "Inter" }, brandName: "GrowxLabs", logoUrl: "logo.svg" });
  const out: any = applyBrandKit(slide, kit);
  assert.strictEqual(out.backgroundColor, "#fafafa");
  assert.strictEqual(out.headline.color, "#111111");
  assert.match(out.headline.fontFamily, /Playfair Display/);
  assert.strictEqual(out.cta.backgroundColor, "#0075de");
  assert.strictEqual(out.footer.brandName, "GrowxLabs");
  assert.strictEqual(out.logo.logoUrl, "logo.svg");
  for (const key of ["headline", "body", "cta", "featuredImage"]) {
    assert.strictEqual(out[key].x, slide[key].x);
    assert.strictEqual(out[key].width, slide[key].width);
  }
  assert.strictEqual(out.headline.text, slide.headline.text);
  assert.strictEqual(out.featuredImage.mediaUrl, "img.png");
});

test("no logo in the kit keeps the slide's own logo", () => {
  const out: any = applyBrandKit(slide, { ...DEFAULT_BRAND_KIT, logoUrl: "" });
  assert.strictEqual(out.logo.logoUrl, "old.png");
});

test("button text stays readable on light and dark brand colours", () => {
  assert.strictEqual(textOn("#ffffff"), "#0a0a0c");
  assert.strictEqual(textOn("#0075de"), "#ffffff");
});

test("invalid stored values fall back to the defaults", () => {
  const kit = normaliseBrandKit({ colors: { primary: "blue", ink: "#12" }, fonts: { heading: "Comic Sans" } });
  assert.strictEqual(kit.colors.primary, DEFAULT_BRAND_KIT.colors.primary);
  assert.strictEqual(kit.colors.ink, DEFAULT_BRAND_KIT.colors.ink);
  assert.strictEqual(kit.fonts.heading, DEFAULT_BRAND_KIT.fonts.heading);
});
