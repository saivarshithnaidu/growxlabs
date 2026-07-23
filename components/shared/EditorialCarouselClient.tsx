"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Settings, 
  Palette, 
  Edit3, 
  RefreshCw, 
  Check, 
  Info, 
  Type, 
  LayoutGrid, 
  Upload, 
  Layers, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Grid, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  FileText
} from "lucide-react";
import { toast } from "sonner";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const stripHtmlTags = (str?: string) => {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, "");
};

const renderFormattedText = (text?: string) => {
  if (!text) return "";
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

// ==========================================
// INTERFACES & SCHEMAS
// ==========================================

interface ElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  align: "left" | "center" | "right";
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  fontWeight: string;
  uppercase?: boolean;
}

interface ImageElementStyle extends ElementStyle {
  mediaUrl: string;
  objectFit: "cover" | "contain" | "fill";
  brightness: number;
  contrast: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
}

interface BulletElementStyle extends ElementStyle {
  bulletStyle: "check" | "dot" | "number";
  spacing: number;
  items: string[];
}

interface QuoteElementStyle extends ElementStyle {
  text: string;
  author: string;
  borderRadius: number;
  padding: number;
  borderColor: string;
  backgroundColor: string;
}

interface CtaElementStyle extends ElementStyle {
  text: string;
  link: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  padding: number;
}

interface Slide {
  id: string;
  category: ElementStyle & { text: string };
  headline: ElementStyle & { text: string; maxLines: number; autoScale: boolean };
  featuredImage: ImageElementStyle;
  body: ElementStyle & { text: string; maxLines: number; autoScale: boolean };
  bullets: BulletElementStyle;
  quote: QuoteElementStyle;
  cta: CtaElementStyle;
  footer: {
    brandName: string;
    logoEnabled: boolean;
    dividerEnabled: boolean;
    pageNumberEnabled: boolean;
    opacity: number;
    color: string;
  };
}

type ElementKey = "category" | "headline" | "featuredImage" | "body" | "bullets" | "quote" | "cta";

// ==========================================
// CONSTANTS & INITIAL DATA
// ==========================================

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

// Safe Area margins
const SAFE_TOP = 60;
const SAFE_BOTTOM = 70;
const SAFE_LEFT = 72;
const SAFE_RIGHT = 72;
const SAFE_WIDTH = CANVAS_WIDTH - SAFE_LEFT - SAFE_RIGHT; // 936px

const DEFAULT_FONTS = [
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "SF Mono", value: "'SF Mono', 'Fira Code', monospace" },
  { name: "Outfit", value: "'Outfit', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Neue Haas Grotesk", value: "'Neue Haas Grotesk', sans-serif" }
];

const DEFAULT_SLIDE = (index: number): Slide => ({
  id: `slide-${Date.now()}-${Math.random()}`,
  category: {
    text: "AI NEWS",
    x: SAFE_LEFT,
    y: SAFE_TOP,
    width: SAFE_WIDTH,
    height: 30,
    visible: true,
    locked: true,
    opacity: 1,
    rotation: 0,
    align: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    lineHeight: 1.2,
    letterSpacing: 2,
    color: "#888888",
    fontWeight: "800",
    uppercase: true
  },
  headline: {
    text: "Moonshot built the world's largest open model",
    x: SAFE_LEFT,
    y: 110,
    width: SAFE_WIDTH,
    height: 150,
    visible: true,
    locked: true,
    opacity: 1,
    rotation: 0,
    align: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: 44,
    lineHeight: 1.08,
    letterSpacing: -1.2,
    color: "#000000",
    fontWeight: "900",
    maxLines: 3,
    autoScale: true
  },
  featuredImage: {
    mediaUrl: "",
    objectFit: "cover",
    brightness: 100,
    contrast: 100,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    x: SAFE_LEFT,
    y: 292,
    width: SAFE_WIDTH,
    height: 470,
    visible: true,
    locked: true,
    opacity: 1,
    rotation: 0,
    align: "center",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1.2,
    letterSpacing: 0,
    color: "#000000",
    fontWeight: "normal"
  },
  body: {
    text: `Kimi K3 is a 2.8 trillion parameter Mixture-of-Experts model, the largest open-weight AI system ever released. It runs a 1M token context, handles text and images, and lands close to the Western frontier.`,
    x: SAFE_LEFT,
    y: 802,
    width: SAFE_WIDTH,
    height: 180,
    visible: true,
    locked: true,
    opacity: 1,
    rotation: 0,
    align: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: 22,
    lineHeight: 1.5,
    letterSpacing: -0.2,
    color: "#111827",
    fontWeight: "400",
    maxLines: 6,
    autoScale: true
  },
  bullets: {
    bulletStyle: "check",
    spacing: 12,
    items: [
      "2.8 Trillion parameters Mixture-of-Experts",
      "Native 1 Million token context window",
      "Multi-modal: supports text and image inputs"
    ],
    x: SAFE_LEFT,
    y: 990,
    width: SAFE_WIDTH,
    height: 120,
    visible: false,
    locked: false,
    opacity: 1,
    rotation: 0,
    align: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: 18,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: "#111827",
    fontWeight: "500"
  },
  quote: {
    text: "This model marks a turning point in open-source AI capabilities.",
    author: "GrowXLabs Research Team",
    borderRadius: 16,
    padding: 24,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    x: SAFE_LEFT,
    y: 802,
    width: SAFE_WIDTH,
    height: 160,
    visible: false,
    locked: false,
    opacity: 1,
    rotation: 0,
    align: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: 22,
    lineHeight: 1.4,
    letterSpacing: -0.5,
    color: "#000000",
    fontWeight: "700"
  },
  cta: {
    text: "Read the Full Report",
    link: "https://growxlabs.tech/blog",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    x: SAFE_LEFT,
    y: 1100,
    width: 320,
    height: 56,
    visible: false,
    locked: false,
    opacity: 1,
    rotation: 0,
    align: "center",
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    lineHeight: 1.2,
    letterSpacing: 1,
    color: "#ffffff",
    fontWeight: "700"
  },
  footer: {
    brandName: "GrowxLabs",
    logoEnabled: true,
    dividerEnabled: true,
    pageNumberEnabled: true,
    opacity: 1,
    color: "#000000"
  }
});

// ==========================================
// TEMPLATE PRESETS
// ==========================================

const TEMPLATE_PRESETS = [
  {
    id: "ai-news",
    name: "AI News",
    setup: (slide: Slide): Slide => ({
      ...slide,
      category: { ...slide.category, text: "AI NEWS", visible: true },
      headline: { ...slide.headline, text: "Moonshot built the world's largest open model", visible: true },
      featuredImage: { ...slide.featuredImage, visible: true },
      body: { ...slide.body, text: "Kimi K3 is a 2.8 trillion parameter Mixture-of-Experts model, the largest open-weight AI system ever released.", visible: true },
      bullets: { ...slide.bullets, visible: false },
      quote: { ...slide.quote, visible: false },
      cta: { ...slide.cta, visible: false }
    })
  },
  {
    id: "research",
    name: "Research Report",
    setup: (slide: Slide): Slide => ({
      ...slide,
      category: { ...slide.category, text: "RESEARCH", visible: true },
      headline: { ...slide.headline, text: "Decentralized Training Runs Over Heterogeneous Networks", visible: true },
      featuredImage: { ...slide.featuredImage, visible: false },
      body: { ...slide.body, text: "Our empirical study shows decentralized networks can achieve up to 84% baseline efficiency under model compression pipelines.", visible: true },
      bullets: { ...slide.bullets, visible: true },
      quote: { ...slide.quote, visible: false },
      cta: { ...slide.cta, visible: false }
    })
  },
  {
    id: "statistics",
    name: "Key Statistics",
    setup: (slide: Slide): Slide => ({
      ...slide,
      category: { ...slide.category, text: "PERFORMANCE STATS", visible: true },
      headline: { ...slide.headline, text: "+59.7% Speedup vs Baseline Triton Kernels", visible: true },
      featuredImage: { ...slide.featuredImage, visible: true },
      body: { ...slide.body, text: "This graphic shows the AttnRes GPU Kernel speedup benchmark across varying token limits.", visible: true },
      bullets: { ...slide.bullets, visible: false },
      quote: { ...slide.quote, visible: false },
      cta: { ...slide.cta, visible: false }
    })
  },
  {
    id: "quote",
    name: "Pull Quote",
    setup: (slide: Slide): Slide => ({
      ...slide,
      category: { ...slide.category, text: "EDITORIAL QUOTE", visible: true },
      headline: { ...slide.headline, text: "What our engineers say about agent pipelines:", visible: true },
      featuredImage: { ...slide.featuredImage, visible: false },
      body: { ...slide.body, visible: false },
      bullets: { ...slide.bullets, visible: false },
      quote: { ...slide.quote, visible: true },
      cta: { ...slide.cta, visible: false }
    })
  }
];

export function EditorialCarouselClient() {
  const [slides, setSlides] = useState<Slide[]>([DEFAULT_SLIDE(0)]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<ElementKey | null>(null);
  const [editorMode, setEditorMode] = useState<"fixed" | "free">("fixed");
  
  // Viewport Settings
  const [zoomScale, setZoomScale] = useState(0.4);
  const [showGrid, setShowGrid] = useState(true);
  const [showSafeArea, setShowSafeArea] = useState(true);
  const [showGuides, setShowGuides] = useState(true);

  // Drag-and-Drop / Resize Tracking
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; elemX: number; elemY: number } | null>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; elemW: number; elemH: number } | null>(null);

  const activeSlide = slides[activeIndex] || DEFAULT_SLIDE(0);

  // Auto-fit responsive scale of editor canvas on window size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoomScale(0.22);
      } else if (window.innerWidth < 1200) {
        setZoomScale(0.32);
      } else {
        setZoomScale(0.48);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update layout positions when activeSlide changes or when layout mode toggles
  useEffect(() => {
    if (editorMode === "fixed") {
      // Calculate layout automatically
      const updated = { ...activeSlide };
      
      // Top spacing Category
      updated.category.x = SAFE_LEFT;
      updated.category.y = SAFE_TOP;
      updated.category.width = SAFE_WIDTH;

      // Headline starts below Category with 20px gap
      updated.headline.x = SAFE_LEFT;
      updated.headline.y = SAFE_TOP + updated.category.height + 20;
      updated.headline.width = SAFE_WIDTH;

      // Image is locked at Y = 292px, Width = 936px (or safe width), Height = 470px
      updated.featuredImage.x = SAFE_LEFT;
      updated.featuredImage.y = 292;
      updated.featuredImage.width = SAFE_WIDTH;
      updated.featuredImage.height = 470;

      // Body starts below Image with 40px gap
      updated.body.x = SAFE_LEFT;
      updated.body.y = updated.featuredImage.y + updated.featuredImage.height + 40; // 292 + 470 + 40 = 802px
      updated.body.width = SAFE_WIDTH;

      // Quote inherits same body position if active
      updated.quote.x = SAFE_LEFT;
      updated.quote.y = updated.featuredImage.y + updated.featuredImage.height + 40;
      updated.quote.width = SAFE_WIDTH;

      // Bullets start below body/quote with 20px gap
      updated.bullets.x = SAFE_LEFT;
      updated.bullets.y = updated.body.y + (updated.body.visible ? updated.body.height + 20 : 0);
      updated.bullets.width = SAFE_WIDTH;

      // CTA placement
      updated.cta.x = SAFE_LEFT;
      updated.cta.y = updated.bullets.y + (updated.bullets.visible ? updated.bullets.height + 20 : 40);

      // Save back to state
      setSlides(prev => prev.map((s, i) => i === activeIndex ? updated : s));
    }
  }, [
    activeSlide.category.height, 
    activeSlide.category.visible,
    activeSlide.headline.height, 
    activeSlide.headline.visible,
    activeSlide.featuredImage.height,
    activeSlide.featuredImage.visible,
    activeSlide.body.height,
    activeSlide.body.visible,
    activeSlide.bullets.height,
    activeSlide.bullets.visible,
    editorMode, 
    activeIndex
  ]);

  // ==========================================
  // STATE MANAGEMENT HELPERS
  // ==========================================

  const updateSlideElement = (key: ElementKey, updates: any) => {
    setSlides(prev => prev.map((s, idx) => {
      if (idx !== activeIndex) return s;
      return {
        ...s,
        [key]: {
          ...s[key],
          ...updates
        }
      };
    }));
  };

  const updateSlideFooter = (updates: Partial<Slide["footer"]>) => {
    setSlides(prev => prev.map((s, idx) => {
      if (idx !== activeIndex) return s;
      return {
        ...s,
        footer: {
          ...s.footer,
          ...updates
        }
      };
    }));
  };

  // Add Slide
  const addSlide = () => {
    setSlides(prev => [...prev, DEFAULT_SLIDE(prev.length)]);
    setActiveIndex(prev => prev + 1);
    toast.success("Added new slide");
  };

  // Duplicate Slide
  const duplicateSlide = (idx: number) => {
    const clone = JSON.parse(JSON.stringify(slides[idx]));
    clone.id = `slide-${Date.now()}-${Math.random()}`;
    setSlides(prev => {
      const copy = [...prev];
      copy.splice(idx + 1, 0, clone);
      return copy;
    });
    setActiveIndex(idx + 1);
    toast.success("Duplicated slide");
  };

  // Delete Slide
  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      toast.error("Cannot delete the only remaining slide.");
      return;
    }
    setSlides(prev => prev.filter((_, i) => i !== idx));
    setActiveIndex(prev => Math.max(0, prev - 1));
    toast.success("Deleted slide");
  };

  // Reorder slides
  const moveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const copy = [...slides];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    setSlides(copy);
    setActiveIndex(toIndex);
  };

  // Preset Layout Selector
  const applyPreset = (presetId: string) => {
    const preset = TEMPLATE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSlides(prev => prev.map((s, i) => i === activeIndex ? preset.setup(s) : s));
    toast.success(`Applied ${preset.name} template layout`);
  };

  // ==========================================
  // ELEMENT POINTER HANDLERS (DRAG & RESIZE)
  // ==========================================

  const handleElementMouseDown = (e: React.MouseEvent, key: ElementKey) => {
    if (e.button !== 0) return; // Left click only
    setSelectedElement(key);
    
    if (editorMode === "fixed") return; // Position locked in Fixed Mode
    
    const elem = activeSlide[key];
    if (elem.locked) return;

    e.stopPropagation();
    
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: elem.x,
      elemY: elem.y
    };

    document.addEventListener("mousemove", handleElementMouseMove);
    document.addEventListener("mouseup", handleElementMouseUp);
  };

  const handleElementMouseMove = (e: MouseEvent) => {
    if (!dragStartRef.current || !selectedElement) return;

    const dx = (e.clientX - dragStartRef.current.startX) / zoomScale;
    const dy = (e.clientY - dragStartRef.current.startY) / zoomScale;
    
    let newX = Math.round(dragStartRef.current.elemX + dx);
    let newY = Math.round(dragStartRef.current.elemY + dy);

    // Grid Snapping
    if (showGuides) {
      if (Math.abs(newX - SAFE_LEFT) < 10) newX = SAFE_LEFT;
      if (Math.abs((newX + activeSlide[selectedElement].width) - (CANVAS_WIDTH - SAFE_RIGHT)) < 10) {
        newX = CANVAS_WIDTH - SAFE_RIGHT - activeSlide[selectedElement].width;
      }
    }

    updateSlideElement(selectedElement, { x: newX, y: newY });
  };

  const handleElementMouseUp = () => {
    dragStartRef.current = null;
    document.removeEventListener("mousemove", handleElementMouseMove);
    document.removeEventListener("mouseup", handleElementMouseUp);
  };

  // Resizing Handle drag handler
  const handleResizeMouseDown = (e: React.MouseEvent, key: ElementKey) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedElement(key);

    if (editorMode === "fixed") return;
    
    const elem = activeSlide[key];
    if (elem.locked) return;

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemW: elem.width,
      elemH: elem.height
    };

    document.addEventListener("mousemove", handleResizeMouseMove);
    document.addEventListener("mouseup", handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizeStartRef.current || !selectedElement) return;

    const dx = (e.clientX - resizeStartRef.current.startX) / zoomScale;
    const dy = (e.clientY - resizeStartRef.current.startY) / zoomScale;

    const newW = Math.max(50, Math.round(resizeStartRef.current.elemW + dx));
    const newH = Math.max(20, Math.round(resizeStartRef.current.elemH + dy));

    updateSlideElement(selectedElement, { width: newW, height: newH });
  };

  const handleResizeMouseUp = () => {
    resizeStartRef.current = null;
    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // ==========================================
  // EXPORT ENGINE
  // ==========================================

  const buildSvgString = (slide: Slide, index: number) => {
    // Generate inline style variables matching fonts/colors
    const fontsMarkup = DEFAULT_FONTS.map(f => 
      `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;600;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');`
    ).join("\n");

    const renderTextMarkup = (el: ElementStyle & { text: string }) => {
      if (!el.visible) return "";
      const textTransform = el.uppercase ? "uppercase" : "none";
      const alignClass = el.align === "center" ? "text-center justify-center" : el.align === "right" ? "text-right justify-end" : "text-left justify-start";
      return `
        <div style="
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          width: ${el.width}px;
          height: ${el.height}px;
          display: flex;
          align-items: flex-start;
          text-align: ${el.align};
          font-family: ${el.fontFamily};
          font-size: ${el.fontSize}px;
          font-weight: ${el.fontWeight};
          line-height: ${el.lineHeight};
          letter-spacing: ${el.letterSpacing}px;
          color: ${el.color};
          text-transform: ${textTransform};
          opacity: ${el.opacity};
          transform: rotate(${el.rotation}deg);
          box-sizing: border-box;
          overflow: hidden;
        " class="${alignClass}">
          ${el.text}
        </div>
      `;
    };

    const renderImageMarkup = (el: ImageElementStyle) => {
      if (!el.visible) return "";
      const fallbackColor = "#1f2937";
      const borderStyle = el.borderWidth > 0 ? `border: ${el.borderWidth}px solid ${el.borderColor};` : "";
      
      // If user hasn't uploaded any custom photo, render a sleek tech-pattern gradient
      const imgStyle = `
        width: 100%;
        height: 100%;
        object-fit: ${el.objectFit};
        border-radius: ${el.borderRadius}px;
        filter: brightness(${el.brightness}%) contrast(${el.contrast}%);
      `;

      return `
        <div style="
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          width: ${el.width}px;
          height: ${el.height}px;
          border-radius: ${el.borderRadius}px;
          opacity: ${el.opacity};
          transform: rotate(${el.rotation}deg);
          box-sizing: border-box;
          overflow: hidden;
          background: ${fallbackColor};
          ${borderStyle}
        ">
          ${el.mediaUrl ? `
            <img src="${el.mediaUrl}" style="${imgStyle}" />
          ` : `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a, #1e293b); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); font-family: sans-serif; font-weight: bold; font-size: 24px;">
              ${slide.headline.text ? stripHtmlTags(slide.headline.text).substring(0, 20) : "Featured Asset"}
            </div>
          `}
        </div>
      `;
    };

    const renderBulletsMarkup = (el: BulletElementStyle) => {
      if (!el.visible) return "";
      return `
        <div style="
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          width: ${el.width}px;
          height: ${el.height}px;
          opacity: ${el.opacity};
          font-family: ${el.fontFamily};
          font-size: ${el.fontSize}px;
          color: ${el.color};
          line-height: ${el.lineHeight};
          box-sizing: border-box;
          overflow: hidden;
        ">
          <ul style="list-style: none; margin: 0; padding: 0; display: flex; flexDirection: column; gap: ${el.spacing}px;">
            ${el.items.map((item, idx) => `
              <li style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="color: #000000; font-weight: bold;">${el.bulletStyle === "check" ? "✔" : el.bulletStyle === "number" ? `${idx + 1}.` : "•"}</span>
                <span>${item}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      `;
    };

    const renderQuoteMarkup = (el: QuoteElementStyle) => {
      if (!el.visible) return "";
      return `
        <div style="
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          width: ${el.width}px;
          height: ${el.height}px;
          opacity: ${el.opacity};
          font-family: ${el.fontFamily};
          box-sizing: border-box;
          overflow: hidden;
          background: ${el.backgroundColor};
          border-left: 5px solid ${el.borderColor};
          border-radius: ${el.borderRadius}px;
          padding: ${el.padding}px;
        ">
          <p style="margin: 0 0 10px 0; font-size: ${el.fontSize}px; font-weight: ${el.fontWeight}; line-height: ${el.lineHeight}; color: ${el.color};">
            "${el.text}"
          </p>
          <span style="font-size: ${el.fontSize - 4}px; font-weight: 600; color: #6b7280;">
            — ${el.author}
          </span>
        </div>
      `;
    };

    const renderCtaMarkup = (el: CtaElementStyle) => {
      if (!el.visible) return "";
      return `
        <div style="
          position: absolute;
          left: ${el.x}px;
          top: ${el.y}px;
          width: ${el.width}px;
          height: ${el.height}px;
          opacity: ${el.opacity};
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${el.backgroundColor};
          color: ${el.textColor};
          font-family: ${el.fontFamily};
          font-size: ${el.fontSize}px;
          font-weight: ${el.fontWeight};
          border-radius: ${el.borderRadius}px;
          padding: ${el.padding}px;
          box-sizing: border-box;
          text-align: center;
        ">
          ${el.text}
        </div>
      `;
    };

    const renderFooterMarkup = () => {
      const pageNumStr = String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
      return `
        <div style="
          position: absolute;
          bottom: ${SAFE_BOTTOM}px;
          left: ${SAFE_LEFT}px;
          right: ${SAFE_RIGHT}px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: ${slide.footer.dividerEnabled ? `1px solid ${slide.footer.color}20` : "none"};
          font-family: 'SF Mono', 'Fira Code', monospace;
          opacity: ${slide.footer.opacity};
          color: ${slide.footer.color};
          box-sizing: border-box;
        ">
          <span style="font-weight: 800; font-size: 16px;">
            ${slide.footer.brandName ? `[${slide.footer.brandName}]` : ""}
          </span>
          ${slide.footer.pageNumberEnabled ? `
            <span style="font-weight: 500; font-size: 16px; opacity: 0.6;">
              ${pageNumStr}
            </span>
          ` : ""}
        </div>
      `;
    };

    return `
      <svg 
        viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" 
        width="${CANVAS_WIDTH}" 
        height="${CANVAS_HEIGHT}" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            ${fontsMarkup}
          </style>
        </defs>
        <foreignObject x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            width: ${CANVAS_WIDTH}px;
            height: ${CANVAS_HEIGHT}px;
            background: #ffffff;
            position: relative;
            box-sizing: border-box;
            overflow: hidden;
          ">
            ${renderTextMarkup(slide.category)}
            ${renderTextMarkup(slide.headline)}
            ${renderImageMarkup(slide.featuredImage)}
            ${renderTextMarkup(slide.body)}
            ${renderBulletsMarkup(slide.bullets)}
            ${renderQuoteMarkup(slide.quote)}
            ${renderCtaMarkup(slide.cta)}
            ${renderFooterMarkup()}
          </div>
        </foreignObject>
      </svg>
    `;
  };

  const handleDownloadSlideSvg = (idx: number) => {
    try {
      const svgStr = buildSvgString(slides[idx], idx);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeSlide.footer.brandName.toLowerCase()}-slide-${idx + 1}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported Slide ${idx + 1} as clean vector SVG!`);
    } catch (e) {
      toast.error("SVG generation failed");
    }
  };

  const handleDownloadAllSlidesSvg = () => {
    slides.forEach((_, idx) => {
      handleDownloadSlideSvg(idx);
    });
    toast.success(`Started downloading all ${slides.length} slides!`);
  };

  // ==========================================
  // VIEW RENDER PARTS
  // ==========================================

  const renderCanvasElement = (key: ElementKey, children: React.ReactNode) => {
    const elem = activeSlide[key];
    if (!elem.visible) return null;

    const isSelected = selectedElement === key;
    const scaleFactor = zoomScale;

    // Element styling wrapper
    const containerStyle: React.CSSProperties = {
      position: "absolute",
      left: `${elem.x * scaleFactor}px`,
      top: `${elem.y * scaleFactor}px`,
      width: `${elem.width * scaleFactor}px`,
      height: `${elem.height * scaleFactor}px`,
      opacity: elem.opacity,
      transform: `rotate(${elem.rotation}deg)`,
      cursor: editorMode === "free" && !elem.locked ? "move" : "pointer",
      boxSizing: "border-box",
      userSelect: "none"
    };

    return (
      <div 
        style={containerStyle}
        onMouseDown={(e) => handleElementMouseDown(e, key)}
        className={`group relative ${isSelected ? "ring-2 ring-[#0075de] ring-offset-2" : "hover:outline hover:outline-dashed hover:outline-neutral-400"}`}
      >
        {children}
        
        {/* Resize Handle overlay */}
        {isSelected && editorMode === "free" && !elem.locked && (
          <div 
            onMouseDown={(e) => handleResizeMouseDown(e, key)}
            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-white border border-[#0075de] rounded-full translate-x-1 translate-y-1 cursor-se-resize z-50 flex items-center justify-center shadow"
          >
            <div className="w-1.5 h-1.5 bg-[#0075de] rounded-full" />
          </div>
        )}

        {/* Lock Overlay */}
        {elem.locked && isSelected && (
          <div className="absolute top-1 right-1 bg-white/90 border border-neutral-200 rounded p-1 shadow-sm flex items-center gap-0.5">
            <Lock size={10} className="text-neutral-500" />
            <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-widest">Locked</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
      
      {/* ==========================================
          LEFT PANEL: SLIDE DECK BAR
          ========================================== */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        <div className="panel-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Slides Deck</span>
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
              {slides.length} slides
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[360px] lg:max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {slides.map((slide, sIdx) => (
              <div 
                key={slide.id}
                onClick={() => {
                  setActiveIndex(sIdx);
                  setSelectedElement(null);
                }}
                className={`relative flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  activeIndex === sIdx 
                    ? "bg-[#0075de]/5 border-[#0075de] shadow-sm shadow-[#0075de]/10" 
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-neutral-400">
                    {String(sIdx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-900 truncate w-24">
                      {slide.headline.text ? stripHtmlTags(slide.headline.text) : "Empty Slide"}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">
                      {slide.category.text || "No tag"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 lg:opacity-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(sIdx);
                    }}
                    className="p-1 hover:bg-neutral-200 rounded text-neutral-500"
                    title="Duplicate"
                  >
                    <Copy size={10} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(sIdx);
                    }}
                    className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-neutral-500"
                    title="Delete"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addSlide}
            className="w-full py-2.5 rounded-xl border border-dashed border-neutral-300 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
          >
            <Plus size={14} /> Add New Slide
          </button>
        </div>

        {/* Templates selector */}
        <div className="panel-card space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block pb-2 border-b border-neutral-100">Templates</span>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_PRESETS.map(preset => (
              <button 
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="py-2 px-3 border border-neutral-200 hover:border-neutral-900 rounded-lg text-[10px] font-bold text-neutral-700 bg-white hover:bg-neutral-50 text-center transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================
          CENTER PANEL: CANVAS STAGE
          ========================================== */}
      <div className="lg:col-span-6 flex flex-col items-center">
        
        {/* Canvas Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between w-full max-w-[520px] mb-4 gap-3 bg-white border border-neutral-200 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Mode:</span>
            <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button 
                onClick={() => setEditorMode("fixed")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                  editorMode === "fixed" ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-black"
                }`}
              >
                Fixed Layout
              </button>
              <button 
                onClick={() => setEditorMode("free")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${
                  editorMode === "free" ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-black"
                }`}
              >
                Free Design
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSafeArea(!showSafeArea)}
              className={`p-1.5 rounded-lg border transition-all ${
                showSafeArea ? "bg-[#0075de]/10 border-[#0075de] text-[#0075de]" : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900"
              }`}
              title="Toggle Safe Area Guidelines"
            >
              <Maximize2 size={13} />
            </button>
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg border transition-all ${
                showGrid ? "bg-[#0075de]/10 border-[#0075de] text-[#0075de]" : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900"
              }`}
              title="Toggle Alignment Grid"
            >
              <Grid size={13} />
            </button>
            <div className="h-5 w-px bg-neutral-200 mx-1" />
            <button 
              onClick={() => setZoomScale(prev => Math.max(0.2, prev - 0.05))}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
            >
              <Minimize2 size={13} />
            </button>
            <span className="text-[10px] font-mono font-bold text-neutral-600">
              {Math.round(zoomScale * 100)}%
            </span>
            <button 
              onClick={() => setZoomScale(prev => Math.min(1.2, prev + 0.05))}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Viewport Box container */}
        <div className="w-full flex items-center justify-center overflow-auto p-4 bg-neutral-50 border border-neutral-200 border-dashed rounded-[32px] min-h-[500px]">
          <div 
            ref={canvasRef}
            className="bg-white shadow-2xl relative select-none overflow-hidden shrink-0"
            style={{
              width: `${CANVAS_WIDTH * zoomScale}px`,
              height: `${CANVAS_HEIGHT * zoomScale}px`,
              boxSizing: "border-box"
            }}
          >
            {/* Safe Area guideline overlays */}
            {showSafeArea && (
              <div 
                className="absolute border border-dashed border-[#0075de]/30 pointer-events-none z-40"
                style={{
                  top: `${SAFE_TOP * zoomScale}px`,
                  bottom: `${SAFE_BOTTOM * zoomScale}px`,
                  left: `${SAFE_LEFT * zoomScale}px`,
                  right: `${SAFE_RIGHT * zoomScale}px`
                }}
              />
            )}

            {/* Grid background overlay */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{
                  backgroundImage: "radial-gradient(#000000 1.5px, transparent 1.5px)",
                  backgroundSize: `${30 * zoomScale}px ${30 * zoomScale}px`
                }}
              />
            )}

            {/* Slide Content elements */}
            
            {/* 1. Category element */}
            {renderCanvasElement("category", (
              <div 
                className="w-full h-full font-sans uppercase tracking-widest"
                style={{
                  fontSize: `${activeSlide.category.fontSize * zoomScale}px`,
                  fontWeight: activeSlide.category.fontWeight,
                  color: activeSlide.category.color,
                  letterSpacing: `${activeSlide.category.letterSpacing * zoomScale}px`,
                  textAlign: activeSlide.category.align
                }}
              >
                {activeSlide.category.text}
              </div>
            ))}

            {/* 2. Headline element */}
            {renderCanvasElement("headline", (
              <div 
                className="w-full h-full font-sans tracking-tight"
                style={{
                  fontSize: `${activeSlide.headline.fontSize * zoomScale}px`,
                  fontWeight: activeSlide.headline.fontWeight,
                  color: activeSlide.headline.color,
                  lineHeight: activeSlide.headline.lineHeight,
                  letterSpacing: `${activeSlide.headline.letterSpacing * zoomScale}px`,
                  textAlign: activeSlide.headline.align
                }}
              >
                {renderFormattedText(activeSlide.headline.text)}
              </div>
            ))}

            {/* 3. Featured Image */}
            {renderCanvasElement("featuredImage", (
              <div 
                className="w-full h-full bg-[#050505] overflow-hidden"
                style={{
                  borderRadius: `${activeSlide.featuredImage.borderRadius * zoomScale}px`,
                  border: activeSlide.featuredImage.borderWidth > 0 
                    ? `${activeSlide.featuredImage.borderWidth * zoomScale}px solid ${activeSlide.featuredImage.borderColor}`
                    : "none"
                }}
              >
                {activeSlide.featuredImage.mediaUrl ? (
                  <img 
                    src={activeSlide.featuredImage.mediaUrl}
                    alt="Featured Image Asset"
                    className="w-full h-full"
                    style={{
                      objectFit: activeSlide.featuredImage.objectFit,
                      filter: `brightness(${activeSlide.featuredImage.brightness}%) contrast(${activeSlide.featuredImage.contrast}%)`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-white/50 bg-neutral-900 border border-neutral-800 rounded-2xl">
                    <span className="font-extrabold uppercase tracking-wider text-[11px] mb-1" style={{ fontSize: `${12 * zoomScale}px` }}>
                      Featured Image Placeholder
                    </span>
                    <span className="text-[9px] opacity-60" style={{ fontSize: `${9 * zoomScale}px` }}>
                      Upload custom photo in Right Panel
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* 4. Body Content text */}
            {renderCanvasElement("body", (
              <div 
                className="w-full h-full font-sans whitespace-pre-line text-neutral-800"
                style={{
                  fontSize: `${activeSlide.body.fontSize * zoomScale}px`,
                  fontWeight: activeSlide.body.fontWeight,
                  color: activeSlide.body.color,
                  lineHeight: activeSlide.body.lineHeight,
                  letterSpacing: `${activeSlide.body.letterSpacing * zoomScale}px`,
                  textAlign: activeSlide.body.align
                }}
              >
                {renderFormattedText(activeSlide.body.text)}
              </div>
            ))}

            {/* 5. Bullets List */}
            {renderCanvasElement("bullets", (
              <div 
                className="w-full h-full font-sans text-neutral-800"
                style={{
                  fontSize: `${activeSlide.bullets.fontSize * zoomScale}px`,
                  fontWeight: activeSlide.bullets.fontWeight,
                  color: activeSlide.bullets.color,
                  lineHeight: activeSlide.bullets.lineHeight
                }}
              >
                <ul className="list-none m-0 p-0" style={{ display: "flex", flexDirection: "column", gap: `${activeSlide.bullets.spacing * zoomScale}px` }}>
                  {activeSlide.bullets.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-black font-bold">
                        {activeSlide.bullets.bulletStyle === "check" ? "✔" : activeSlide.bullets.bulletStyle === "number" ? `${idx + 1}.` : "•"}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 6. Quote Area */}
            {renderCanvasElement("quote", (
              <div 
                className="w-full h-full font-sans"
                style={{
                  background: activeSlide.quote.backgroundColor,
                  borderLeft: `${5 * zoomScale}px solid ${activeSlide.quote.borderColor}`,
                  borderRadius: `${activeSlide.quote.borderRadius * zoomScale}px`,
                  padding: `${activeSlide.quote.padding * zoomScale}px`
                }}
              >
                <p 
                  className="m-0 mb-2 font-bold"
                  style={{
                    fontSize: `${activeSlide.quote.fontSize * zoomScale}px`,
                    fontWeight: activeSlide.quote.fontWeight,
                    lineHeight: activeSlide.quote.lineHeight,
                    color: activeSlide.quote.color
                  }}
                >
                  "{activeSlide.quote.text}"
                </p>
                <span className="text-neutral-500 font-semibold" style={{ fontSize: `${(activeSlide.quote.fontSize - 4) * zoomScale}px` }}>
                  — {activeSlide.quote.author}
                </span>
              </div>
            ))}

            {/* 7. CTA Button overlay */}
            {renderCanvasElement("cta", (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: activeSlide.cta.backgroundColor,
                  color: activeSlide.cta.textColor,
                  borderRadius: `${activeSlide.cta.borderRadius * zoomScale}px`,
                  fontSize: `${activeSlide.cta.fontSize * zoomScale}px`,
                  fontWeight: activeSlide.cta.fontWeight,
                  fontFamily: activeSlide.cta.fontFamily,
                  padding: `${activeSlide.cta.padding * zoomScale}px`,
                  letterSpacing: `${activeSlide.cta.letterSpacing * zoomScale}px`
                }}
              >
                {activeSlide.cta.text}
              </div>
            ))}

            {/* 8. Pinned Footer */}
            <div 
              className="absolute w-full flex items-center justify-between border-t border-neutral-100"
              style={{
                bottom: `${SAFE_BOTTOM * zoomScale}px`,
                left: `${SAFE_LEFT * zoomScale}px`,
                width: `${SAFE_WIDTH * zoomScale}px`,
                height: `${50 * zoomScale}px`,
                borderTop: activeSlide.footer.dividerEnabled ? `1.5px solid ${activeSlide.footer.color}20` : "none",
                opacity: activeSlide.footer.opacity,
                color: activeSlide.footer.color,
                fontFamily: "'SF Mono', 'Fira Code', monospace"
              }}
            >
              <span className="font-extrabold uppercase" style={{ fontSize: `${16 * zoomScale}px` }}>
                {activeSlide.footer.brandName ? `[${activeSlide.footer.brandName}]` : ""}
              </span>
              {activeSlide.footer.pageNumberEnabled && (
                <span className="font-bold opacity-60" style={{ fontSize: `${16 * zoomScale}px` }}>
                  {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Global Action buttons */}
        <div className="w-full max-w-[520px] grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick={() => handleDownloadSlideSvg(activeIndex)}
            className="w-full py-3 bg-[#0075de] hover:bg-[#0075de]/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow border-none"
          >
            <Download size={14} /> Export Slide SVG
          </button>
          <button 
            onClick={handleDownloadAllSlidesSvg}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow border-none"
          >
            <LayoutGrid size={14} /> Export All SVG Slides
          </button>
        </div>
      </div>

      {/* ==========================================
          RIGHT PANEL: ELEMENT PROPERTIES
          ========================================== */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* Selection Status pill */}
        <div className="panel-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Selection System</span>
            {selectedElement ? (
              <span className="text-[10px] font-bold bg-[#0075de]/10 text-[#0075de] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {selectedElement}
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Nothing Selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "category", label: "Category Tag" },
              { id: "headline", label: "Headline Title" },
              { id: "featuredImage", label: "Featured Image" },
              { id: "body", label: "Body Text" },
              { id: "bullets", label: "Bullet Items" },
              { id: "quote", label: "Quote Box" },
              { id: "cta", label: "CTA Button" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedElement(item.id as ElementKey)}
                className={`py-2 px-3 border rounded-xl text-xs font-bold text-left transition-all ${
                  selectedElement === item.id 
                    ? "bg-[#0075de]/5 border-[#0075de] text-[#0075de]" 
                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Property Inputs panel */}
        {selectedElement && (
          <div className="panel-card space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-700">Properties</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateSlideElement(selectedElement, { visible: !activeSlide[selectedElement].visible })}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                  title="Toggle Visibility"
                >
                  {activeSlide[selectedElement].visible ? <Eye size={14} /> : <EyeOff size={14} className="text-red-500" />}
                </button>
                <button
                  onClick={() => updateSlideElement(selectedElement, { locked: !activeSlide[selectedElement].locked })}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                  title="Toggle Coordinate Lock"
                >
                  {activeSlide[selectedElement].locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            </div>

            {/* 1. Coordinate / Size Position properties (Free Mode only) */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">X Position (px)</label>
                <input
                  type="number"
                  disabled={editorMode === "fixed" || activeSlide[selectedElement].locked}
                  value={activeSlide[selectedElement].x}
                  onChange={(e) => updateSlideElement(selectedElement, { x: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Y Position (px)</label>
                <input
                  type="number"
                  disabled={editorMode === "fixed" || activeSlide[selectedElement].locked}
                  value={activeSlide[selectedElement].y}
                  onChange={(e) => updateSlideElement(selectedElement, { y: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Width (px)</label>
                <input
                  type="number"
                  disabled={editorMode === "fixed" || activeSlide[selectedElement].locked}
                  value={activeSlide[selectedElement].width}
                  onChange={(e) => updateSlideElement(selectedElement, { width: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Height (px)</label>
                <input
                  type="number"
                  disabled={editorMode === "fixed" || activeSlide[selectedElement].locked}
                  value={activeSlide[selectedElement].height}
                  onChange={(e) => updateSlideElement(selectedElement, { height: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold disabled:opacity-50"
                />
              </div>
            </div>

            {/* Typography and alignment options */}
            {selectedElement !== "featuredImage" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Font Family</label>
                  <select
                    value={activeSlide[selectedElement].fontFamily}
                    onChange={(e) => updateSlideElement(selectedElement, { fontFamily: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  >
                    {DEFAULT_FONTS.map(f => (
                      <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Font Size (px)</label>
                    <input
                      type="number"
                      value={activeSlide[selectedElement].fontSize}
                      onChange={(e) => updateSlideElement(selectedElement, { fontSize: parseInt(e.target.value) || 12 })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Line Height</label>
                    <input
                      type="number"
                      step="0.05"
                      value={activeSlide[selectedElement].lineHeight}
                      onChange={(e) => updateSlideElement(selectedElement, { lineHeight: parseFloat(e.target.value) || 1.0 })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Text Align</label>
                  <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                    {[
                      { align: "left", icon: <AlignLeft size={12} /> },
                      { align: "center", icon: <AlignCenter size={12} /> },
                      { align: "right", icon: <AlignRight size={12} /> }
                    ].map(opt => (
                      <button
                        key={opt.align}
                        onClick={() => updateSlideElement(selectedElement, { align: opt.align as any })}
                        className={`p-1.5 rounded-md ${
                          activeSlide[selectedElement].align === opt.align ? "bg-white text-black shadow-sm" : "text-neutral-500"
                        }`}
                      >
                        {opt.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom fields per element types */}
            {selectedElement === "category" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Category Tag Text</label>
                  <input
                    type="text"
                    value={activeSlide.category.text}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, category: { ...s.category, text: e.target.value } } : s))}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Uppercase</span>
                  <input
                    type="checkbox"
                    checked={!!activeSlide.category.uppercase}
                    onChange={(e) => updateSlideElement("category", { uppercase: e.target.checked })}
                    className="h-4 w-4 text-[#0075de]"
                  />
                </div>
              </div>
            )}

            {selectedElement === "headline" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Headline Text</label>
                  <textarea
                    value={activeSlide.headline.text}
                    rows={3}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, headline: { ...s.headline, text: e.target.value } } : s))}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold resize-none"
                  />
                </div>
              </div>
            )}

            {selectedElement === "featuredImage" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Upload Custom Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={activeSlide.featuredImage.mediaUrl}
                    onChange={(e) => updateSlideElement("featuredImage", { mediaUrl: e.target.value })}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Object Fit</label>
                    <select
                      value={activeSlide.featuredImage.objectFit}
                      onChange={(e) => updateSlideElement("featuredImage", { objectFit: e.target.value as any })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Corner Radius (px)</label>
                    <input
                      type="number"
                      value={activeSlide.featuredImage.borderRadius}
                      onChange={(e) => updateSlideElement("featuredImage", { borderRadius: parseInt(e.target.value) || 0 })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Brightness (%)</label>
                    <input
                      type="number"
                      value={activeSlide.featuredImage.brightness}
                      onChange={(e) => updateSlideElement("featuredImage", { brightness: parseInt(e.target.value) || 100 })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Contrast (%)</label>
                    <input
                      type="number"
                      value={activeSlide.featuredImage.contrast}
                      onChange={(e) => updateSlideElement("featuredImage", { contrast: parseInt(e.target.value) || 100 })}
                      className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedElement === "body" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Body Copy</label>
                  <textarea
                    value={activeSlide.body.text}
                    rows={4}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, body: { ...s.body, text: e.target.value } } : s))}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold resize-none"
                  />
                </div>
              </div>
            )}

            {selectedElement === "bullets" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Bullet Style</label>
                  <select
                    value={activeSlide.bullets.bulletStyle}
                    onChange={(e) => updateSlideElement("bullets", { bulletStyle: e.target.value as any })}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="check">Checkmarks (✔)</option>
                    <option value="dot">Bullet Dots (•)</option>
                    <option value="number">Numeric (1, 2, 3)</option>
                  </select>
                </div>
              </div>
            )}

            {selectedElement === "quote" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Quote Text</label>
                  <textarea
                    value={activeSlide.quote.text}
                    rows={3}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, quote: { ...s.quote, text: e.target.value } } : s))}
                    className="w-full p-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Author</label>
                  <input
                    type="text"
                    value={activeSlide.quote.author}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, quote: { ...s.quote, author: e.target.value } } : s))}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            {selectedElement === "cta" && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">CTA Label</label>
                  <input
                    type="text"
                    value={activeSlide.cta.text}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, cta: { ...s.cta, text: e.target.value } } : s))}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">CTA Link</label>
                  <input
                    type="text"
                    value={activeSlide.cta.link}
                    onChange={(e) => setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, cta: { ...s.cta, link: e.target.value } } : s))}
                    className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* Global Footer Settings */}
        <div className="panel-card space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block pb-2 border-b border-neutral-100 block">Footer Branding</span>
          
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Brand Name</label>
              <input
                type="text"
                value={activeSlide.footer.brandName}
                onChange={(e) => updateSlideFooter({ brandName: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-neutral-600">Show Divider Line</span>
              <input
                type="checkbox"
                checked={activeSlide.footer.dividerEnabled}
                onChange={(e) => updateSlideFooter({ dividerEnabled: e.target.checked })}
                className="h-4 w-4 text-[#0075de]"
              />
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-bold text-neutral-600">Show Page Numbers</span>
              <input
                type="checkbox"
                checked={activeSlide.footer.pageNumberEnabled}
                onChange={(e) => updateSlideFooter({ pageNumberEnabled: e.target.checked })}
                className="h-4 w-4 text-[#0075de]"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
