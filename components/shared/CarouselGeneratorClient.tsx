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
  LayoutGrid
} from "lucide-react";

const BotIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-bot ${className}`}
  >
    <path d="M12 8V4H8" />
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <path d="M9 13h.01M15 13h.01" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-instagram ${className}`}
    style={style}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface Slide {
  title: string;
  subtitle: string;
  bullets: string[];
  layout: "title-only" | "bullets" | "quote" | "cta";
  quoteAuthor?: string;
  imageEnabled?: boolean;
  imagePrompt?: string;
  svgCode?: string;
  imageLayout?: "split-right" | "split-left" | "centered";
  customImage?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    title: "5 AI Secrets to Scale Your Software Company",
    subtitle: "How to automate user acquisition and system delivery in 2026",
    bullets: [],
    layout: "title-only"
  },
  {
    title: "1. Automate Lead Scraping",
    subtitle: "Stop spending hours searching for tech buyers manually.",
    bullets: [
      "Use AI agents to identify high-intent target profiles",
      "Draft hyper-personalized product demos instantly",
      "Increase developer pipeline velocity by 3x"
    ],
    layout: "bullets"
  },
  {
    title: "2. Intelligent CRM Syncing",
    subtitle: "Keep all deployment logs and customer notes updated automatically.",
    bullets: [
      "Connect support chats to GPT root-cause analysis",
      "Auto-fill software contract terms and deal stages",
      "Notify your DevOps team instantly via Slack alerts"
    ],
    layout: "bullets"
  },
  {
    title: "3. 'Systems over human sweat' is the new business mantra.",
    subtitle: "AI allows small software companies to operate with the capacity of massive enterprise teams.",
    bullets: [],
    layout: "quote",
    quoteAuthor: "GrowXLabs DevOps Team"
  },
  {
    title: "Ready to Scale Your Product?",
    subtitle: "Let our AI engineers build custom production pipelines and backend systems.",
    bullets: [],
    layout: "cta"
  }
];

function parsePartialSlides(partialJson: string): { themeSuggestion?: string; slides: any[] } {
  let themeSuggestion: string | undefined = undefined;
  
  // Try to extract themeSuggestion
  const themeMatch = /"themeSuggestion"\s*:\s*"([^"]+)"/.exec(partialJson);
  if (themeMatch) {
    themeSuggestion = themeMatch[1];
  }
  
  const slides: any[] = [];
  
  // Find "slides" array
  const slidesStartIndex = partialJson.indexOf('"slides"');
  if (slidesStartIndex === -1) {
    return { themeSuggestion, slides };
  }
  
  const arrayStartIndex = partialJson.indexOf('[', slidesStartIndex);
  if (arrayStartIndex === -1) {
    return { themeSuggestion, slides };
  }
  
  let braceCount = 0;
  let objectStart = -1;
  let inString = false;
  let escape = false;
  
  for (let i = arrayStartIndex + 1; i < partialJson.length; i++) {
    const char = partialJson[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        if (braceCount === 0) {
          objectStart = i;
        }
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && objectStart !== -1) {
          const objStr = partialJson.substring(objectStart, i + 1);
          try {
            const parsedObj = JSON.parse(objStr);
            if (parsedObj && typeof parsedObj.title === 'string') {
              slides.push(parsedObj);
            }
          } catch (e) {
            // Not finished or valid
          }
        }
      } else if (char === ']') {
        if (braceCount === 0) {
          break;
        }
      }
    }
  }
  
  return { themeSuggestion, slides };
}

export function CarouselGeneratorClient() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Customization settings
  const [theme, setTheme] = useState<"cyberpunk" | "cream" | "sunset" | "terminal" | "glass" | "emerald" | "minimal" | "gold">("cyberpunk");
  const [bgPattern, setBgPattern] = useState<"none" | "grid" | "dots" | "glow" | "isometric" | "waves" | "hexagons">("none");
  const [brandName, setBrandName] = useState("GrowXLabs");
  const [instagramHandle, setInstagramHandle] = useState("@growxlabs.tech");
  const [showHandle, setShowHandle] = useState(true);
  const [showPageNumber, setShowPageNumber] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [activeTab, setActiveTab] = useState<"ai" | "edit" | "design">("ai");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"3:4" | "4:5" | "1:1" | "1.91:1">("1:1");
  const [visualMode, setVisualMode] = useState<"svg" | "image">("svg");

  // Dynamic responsive scaling states & ref
  const previewRef = useRef<HTMLDivElement>(null);
  const [responsiveScale, setResponsiveScale] = useState(1);

  // Swipe gesture navigation states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateScale = () => {
      if (previewRef.current) {
        const width = previewRef.current.offsetWidth;
        if (width > 0) {
          setResponsiveScale(width / 338);
        }
      }
    };

    updateScale();

    let resizeObserver: ResizeObserver | null = null;
    if (previewRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateScale();
      });
      resizeObserver.observe(previewRef.current);
    }

    window.addEventListener("resize", updateScale);
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const getDimensions = () => {
    switch (aspectRatio) {
      case "3:4": return { width: 1080, height: 1440 };
      case "4:5": return { width: 1080, height: 1350 };
      case "1.91:1": return { width: 1080, height: 566 };
      case "1:1":
      default:
        return { width: 1080, height: 1080 };
    }
  };
  const { width: svgWidth, height: svgHeight } = getDimensions();

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "3:4": return "aspect-[3/4]";
      case "4:5": return "aspect-[4/5]";
      case "1.91:1": return "aspect-[1.91/1]";
      case "1:1":
      default:
        return "aspect-[1/1]";
    }
  };

  const getScaleMultiplier = () => {
    switch (aspectRatio) {
      case "3:4":
      case "4:5":
        return 1.0;
      case "1:1":
        return 0.85;
      case "1.91:1":
        return 0.55;
      default:
        return 1.0;
    }
  };
  const scaleMultiplier = getScaleMultiplier();
  const liveScaleMultiplier = scaleMultiplier * responsiveScale;


  // Auto-scroll the live token terminal to the bottom
  React.useEffect(() => {
    const terminals = document.querySelectorAll(".custom-scrollbar");
    terminals.forEach(term => {
      term.scrollTop = term.scrollHeight;
    });
  }, [streamBuffer]);

  // Get active slide
  const activeSlide = slides[activeIndex] || slides[0] || {
    title: "",
    subtitle: "",
    bullets: [],
    layout: "title-only"
  };

  // Update active slide field
  const updateActiveSlide = (updatedFields: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[activeIndex] = { ...activeSlide, ...updatedFields };
    setSlides(newSlides);
  };

  // Add bullet to active slide
  const addBullet = () => {
    if (activeSlide.bullets.length >= 3) {
      toast.warning("Maximum of 3 bullet points per slide is recommended for Instagram readability.");
      return;
    }
    updateActiveSlide({
      bullets: [...activeSlide.bullets, "New bullet point"]
    });
  };

  // Remove bullet from active slide
  const removeBullet = (indexToRemove: number) => {
    updateActiveSlide({
      bullets: activeSlide.bullets.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // Update specific bullet text
  const updateBulletText = (idx: number, newText: string) => {
    const newBullets = [...activeSlide.bullets];
    newBullets[idx] = newText;
    updateActiveSlide({ bullets: newBullets });
  };

  // Add a new slide manually
  const addNewSlide = () => {
    const newSlide: Slide = {
      title: "New Slide Header",
      subtitle: "Brief description text",
      bullets: ["First point", "Second point"],
      layout: "bullets"
    };
    setSlides([...slides, newSlide]);
    setActiveIndex(slides.length);
    toast.success("New slide added at the end.");
  };

  // Delete current slide
  const deleteCurrentSlide = () => {
    if (slides.length <= 2) {
      toast.error("A carousel requires at least 2 slides.");
      return;
    }
    const newSlides = slides.filter((_, idx) => idx !== activeIndex);
    setSlides(newSlides);
    setActiveIndex(Math.max(0, activeIndex - 1));
    toast.success("Slide deleted.");
  };

  // Call API to generate carousel content
  const handleGenerateCarousel = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first.");
      return;
    }

    setIsGenerating(true);
    setStreamBuffer("");
    const apiToast = toast.loading("AI is planning and generating your carousel slides...");

    try {
      const response = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, slideCount }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate: ${response.statusText}`);
      }

      let reader = null;
      try {
        reader = response.body ? response.body.getReader() : null;
      } catch (err) {
        console.warn("Streaming reader not available, falling back to full text reading:", err);
      }

      if (!reader) {
        const text = await response.text();
        setStreamBuffer(text);
        const finalData = JSON.parse(text);
        if (finalData.slides && finalData.slides.length > 0) {
          setSlides(finalData.slides);
          setActiveIndex(0);
          if (finalData.themeSuggestion) {
            setTheme(finalData.themeSuggestion);
          }
        }
      } else {
        const decoder = new TextDecoder();
        let done = false;
        let buffer = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            buffer += chunk;
            setStreamBuffer(buffer);
            
            const parsed = parsePartialSlides(buffer);
            if (parsed.slides && parsed.slides.length > 0) {
              setSlides(parsed.slides);
              if (parsed.themeSuggestion && ["cyberpunk", "cream", "sunset", "terminal", "glass", "emerald", "minimal", "gold"].includes(parsed.themeSuggestion)) {
                setTheme(parsed.themeSuggestion as any);
              }
            }
          }
        }

        // Try final full parse
        try {
          const finalData = JSON.parse(buffer);
          if (finalData.slides && finalData.slides.length > 0) {
            setSlides(finalData.slides);
            setActiveIndex(0);
            if (finalData.themeSuggestion) {
              setTheme(finalData.themeSuggestion);
            }
          }
        } catch (e) {
          console.warn("Could not parse final buffer as JSON:", e);
        }
      }

      toast.success("Carousel generated successfully!", { id: apiToast });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong while generating.", { id: apiToast });
    } finally {
      setIsGenerating(false);
    }
  };

  // Call API to refine the carousel content based on instructions (AI Agent loop)
  const handleRefineCarousel = async () => {
    if (!refinementPrompt.trim()) {
      toast.error("Please enter a refinement instruction first.");
      return;
    }

    setIsRefining(true);
    setStreamBuffer("");
    const refineToast = toast.loading("AI Agent is editing your slides...");

    try {
      const response = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic || slides[0]?.title || "Refinement",
          slides,
          instruction: refinementPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to refine: ${response.statusText}`);
      }

      let reader = null;
      try {
        reader = response.body ? response.body.getReader() : null;
      } catch (err) {
        console.warn("Streaming reader not available during refinement, falling back to full text reading:", err);
      }

      if (!reader) {
        const text = await response.text();
        setStreamBuffer(text);
        const finalData = JSON.parse(text);
        if (finalData.slides && finalData.slides.length > 0) {
          setSlides(finalData.slides);
          setActiveIndex(0);
          if (finalData.themeSuggestion) {
            setTheme(finalData.themeSuggestion);
          }
        }
      } else {
        const decoder = new TextDecoder();
        let done = false;
        let buffer = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            buffer += chunk;
            setStreamBuffer(buffer);
            
            const parsed = parsePartialSlides(buffer);
            if (parsed.slides && parsed.slides.length > 0) {
              setSlides(parsed.slides);
              if (parsed.themeSuggestion && ["cyberpunk", "cream", "sunset", "terminal", "glass", "emerald", "minimal", "gold"].includes(parsed.themeSuggestion)) {
                setTheme(parsed.themeSuggestion as any);
              }
            }
          }
        }

        // Try final full parse
        try {
          const finalData = JSON.parse(buffer);
          if (finalData.slides && finalData.slides.length > 0) {
            setSlides(finalData.slides);
            setActiveIndex(0);
            if (finalData.themeSuggestion) {
              setTheme(finalData.themeSuggestion);
            }
          }
        } catch (e) {
          console.warn("Could not parse final refinement buffer as JSON:", e);
        }
      }

      setRefinementPrompt("");
      toast.success("Slides refined successfully by AI Agent!", { id: refineToast });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to refine slides.", { id: refineToast });
    } finally {
      setIsRefining(false);
    }
  };

  // Theme-specific styles dictionary (for live preview and SVG export)
  const getThemeStyles = (slideLayout: string, scale = 1.0) => {
    const rawStyles = (() => {
      switch (theme) {
        case "cyberpunk":
          return {
            wrapperBg: "#05050a",
            wrapperImage: "radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 45%)",
            brandColor: "#06b6d4",
            accentColor: "#9333ea",
            titleColor: "#06b6d4",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "#ffffff",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#e2e8f0",
            bulletIconColor: "#9333ea",
            quoteBorderColor: "#9333ea",
            quoteTextColor: "#ffffff",
            quoteAuthorColor: "#06b6d4",
            progressBarBg: "rgba(255,255,255,0.05)",
            wrapper: "background: #05050a; background-image: radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 45%); color: #ffffff; font-family: 'Outfit', sans-serif; position: relative; border: 1px solid rgba(255,255,255,0.05);",
            title: `color: #06b6d4; text-shadow: 0 0 15px rgba(6, 182, 212, 0.35); font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "68px" : "48px"}; font-weight: 900; line-height: 1.1; margin-bottom: 24px; text-transform: uppercase; font-style: italic;`,
            subtitle: "color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 500; opacity: 0.9; line-height: 1.4;",
            bullets: "color: #e2e8f0; font-family: 'Outfit', sans-serif; font-size: 24px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #9333ea; font-weight: bold; margin-top: 2px;",
            quoteBox: "border-left: 5px solid #9333ea; padding-left: 24px; text-align: left; margin: 40px 0; font-style: italic;",
            quoteText: "color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.4; margin-bottom: 12px;",
            quoteAuthor: "color: #06b6d4; font-size: 20px; font-weight: 600; text-transform: uppercase; tracking-wider;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(255,255,255,0.05); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: linear-gradient(90deg, #9333ea, #06b6d4);"
          };
        case "cream":
          return {
            wrapperBg: "#F9F6F0",
            wrapperImage: "none",
            brandColor: "#5c554c",
            accentColor: "#8c8273",
            titleColor: "#1c1a17",
            titleFont: "'Playfair Display', serif",
            subtitleColor: "#5c554c",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#3d3831",
            bulletIconColor: "#8c8273",
            quoteBorderColor: "#8c8273",
            quoteTextColor: "#1c1a17",
            quoteAuthorColor: "#5c554c",
            progressBarBg: "rgba(0,0,0,0.04)",
            wrapper: "background: #F9F6F0; color: #1c1a17; font-family: 'Outfit', sans-serif; position: relative;",
            title: `color: #1c1a17; font-family: 'Playfair Display', serif; font-size: ${slideLayout === "title-only" ? "64px" : "46px"}; font-weight: 700; line-height: 1.2; margin-bottom: 24px;`,
            subtitle: "color: #5c554c; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 400; line-height: 1.5;",
            bullets: "color: #3d3831; font-family: 'Outfit', sans-serif; font-size: 22px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #8c8273; margin-top: 2px;",
            quoteBox: "border-left: 4px solid #8c8273; padding-left: 24px; text-align: left; margin: 40px 0;",
            quoteText: "color: #1c1a17; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 600; line-height: 1.4; margin-bottom: 12px; font-style: italic;",
            quoteAuthor: "color: #5c554c; font-size: 18px; font-weight: 500; tracking-wider;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(0,0,0,0.04); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: #5c554c;"
          };
        case "sunset":
          return {
            wrapperBg: "none",
            wrapperImage: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)",
            brandColor: "#ffffff",
            accentColor: "#ffffff",
            titleColor: "#ffffff",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "rgba(255,255,255,0.9)",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#ffffff",
            bulletIconColor: "#ffffff",
            quoteBorderColor: "rgba(255,255,255,0.6)",
            quoteTextColor: "#ffffff",
            quoteAuthorColor: "rgba(255,255,255,0.8)",
            progressBarBg: "rgba(255,255,255,0.15)",
            wrapper: "background: linear-gradient(135deg, #FF512F 0%, #DD2476 100%); color: #ffffff; font-family: 'Outfit', sans-serif; position: relative;",
            title: `color: #ffffff; font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "70px" : "48px"}; font-weight: 900; line-height: 1.1; margin-bottom: 24px; text-shadow: 0 4px 12px rgba(0,0,0,0.15);`,
            subtitle: "color: rgba(255,255,255,0.9); font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 500; line-height: 1.4; text-shadow: 0 2px 6px rgba(0,0,0,0.1);",
            bullets: "color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 24px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);",
            bulletIcon: "color: #ffffff; font-weight: bold; margin-top: 2px;",
            quoteBox: "border-left: 4px solid rgba(255,255,255,0.6); padding-left: 24px; text-align: left; margin: 40px 0; font-style: italic;",
            quoteText: "color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.4; margin-bottom: 12px; text-shadow: 0 4px 8px rgba(0,0,0,0.1);",
            quoteAuthor: "color: rgba(255,255,255,0.8); font-size: 18px; font-weight: 600; text-transform: uppercase; tracking-wider;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(255,255,255,0.15); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: #ffffff;"
          };
        case "terminal":
          return {
            wrapperBg: "#090c0f",
            wrapperImage: "linear-gradient(rgba(24, 33, 44, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 33, 44, 0.6) 1px, transparent 1px)",
            brandColor: "#39ff14",
            accentColor: "#8892b0",
            titleColor: "#39ff14",
            titleFont: "'Fira Code', monospace",
            subtitleColor: "#8892b0",
            subtitleFont: "'Fira Code', monospace",
            bulletColor: "#a8b2d1",
            bulletIconColor: "#39ff14",
            quoteBorderColor: "#39ff14",
            quoteTextColor: "#39ff14",
            quoteAuthorColor: "#8892b0",
            progressBarBg: "#18212c",
            wrapper: "background: #090c0f; background-image: linear-gradient(rgba(24, 33, 44, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 33, 44, 0.6) 1px, transparent 1px); background-size: 40px 40px; color: #39ff14; font-family: 'Fira Code', monospace; position: relative; border: 1px solid #18212c;",
            title: `color: #39ff14; font-family: 'Fira Code', monospace; font-size: ${slideLayout === "title-only" ? "54px" : "40px"}; font-weight: 700; line-height: 1.3; margin-bottom: 24px; text-align: left; width: 100%;`,
            subtitle: "color: #8892b0; font-family: 'Fira Code', monospace; font-size: 22px; line-height: 1.5; text-align: left; width: 100%;",
            bullets: "color: #a8b2d1; font-family: 'Fira Code', monospace; font-size: 20px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px; width: 100%;",
            bulletItem: "margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #39ff14; margin-top: 4px; font-weight: bold;",
            quoteBox: "border-left: 3px solid #39ff14; padding-left: 20px; text-align: left; margin: 40px 0; width: 100%;",
            quoteText: "color: #39ff14; font-size: 26px; font-weight: 700; line-height: 1.4; margin-bottom: 12px;",
            quoteAuthor: "color: #8892b0; font-size: 16px;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #18212c; padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: #18212c; position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: #39ff14;"
          };
        case "glass":
          return {
            wrapperBg: "#03001e",
            wrapperImage: "radial-gradient(circle at 50% 50%, #4a0072 0%, #03001e 85%)",
            brandColor: "#a5f3fc",
            accentColor: "#c084fc",
            titleColor: "#ffffff",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "#a5f3fc",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#e2e8f0",
            bulletIconColor: "#c084fc",
            quoteBorderColor: "#c084fc",
            quoteTextColor: "#ffffff",
            quoteAuthorColor: "#a5f3fc",
            progressBarBg: "rgba(255,255,255,0.05)",
            wrapper: "background: #03001e; background-image: radial-gradient(circle at 50% 50%, #4a0072 0%, #03001e 85%); color: #ffffff; font-family: 'Outfit', sans-serif; position: relative;",
            title: `color: #ffffff; font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "62px" : "44px"}; font-weight: 800; line-height: 1.2; margin-bottom: 24px;`,
            subtitle: "color: #a5f3fc; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 500; line-height: 1.4; opacity: 0.95;",
            bullets: "color: #e2e8f0; font-family: 'Outfit', sans-serif; font-size: 22px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #c084fc; margin-top: 2px;",
            quoteBox: "border-left: 4px solid #c084fc; padding-left: 24px; text-align: left; margin: 40px 0;",
            quoteText: "color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.4; margin-bottom: 12px; font-style: italic;",
            quoteAuthor: "color: #a5f3fc; font-size: 18px; font-weight: 600; text-transform: uppercase;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(255,255,255,0.05); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: linear-gradient(90deg, #c084fc, #a5f3fc);"
          };
        case "emerald":
          return {
            wrapperBg: "#041611",
            wrapperImage: "radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(52, 211, 153, 0.12) 0%, transparent 45%)",
            brandColor: "#10b981",
            accentColor: "#34d399",
            titleColor: "#10b981",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "#ffffff",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#e2e8f0",
            bulletIconColor: "#34d399",
            quoteBorderColor: "#10b981",
            quoteTextColor: "#ffffff",
            quoteAuthorColor: "#34d399",
            progressBarBg: "rgba(255,255,255,0.03)",
            wrapper: "background: #041611; background-image: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(52, 211, 153, 0.12) 0%, transparent 45%); color: #ffffff; font-family: 'Outfit', sans-serif; position: relative;",
            title: `color: #10b981; text-shadow: 0 0 15px rgba(16, 185, 129, 0.25); font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "64px" : "44px"}; font-weight: 800; line-height: 1.2; margin-bottom: 24px;`,
            subtitle: "color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 500; opacity: 0.95; line-height: 1.4;",
            bullets: "color: #e2e8f0; font-family: 'Outfit', sans-serif; font-size: 22px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #34d399; margin-top: 2px;",
            quoteBox: "border-left: 4px solid #10b981; padding-left: 24px; text-align: left; margin: 40px 0;",
            quoteText: "color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.4; margin-bottom: 12px; font-style: italic;",
            quoteAuthor: "color: #34d399; font-size: 18px; font-weight: 600; text-transform: uppercase;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(255,255,255,0.03); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: linear-gradient(90deg, #10b981, #34d399);"
          };
        case "minimal":
          return {
            wrapperBg: "#ffffff",
            wrapperImage: "none",
            brandColor: "#0a0a0a",
            accentColor: "#404040",
            titleColor: "#0a0a0a",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "#404040",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#171717",
            bulletIconColor: "#0a0a0a",
            quoteBorderColor: "#0a0a0a",
            quoteTextColor: "#0a0a0a",
            quoteAuthorColor: "#404040",
            progressBarBg: "rgba(0,0,0,0.05)",
            wrapper: "background: #ffffff; color: #0a0a0a; font-family: 'Outfit', sans-serif; position: relative; border: 1px solid #e5e5e5;",
            title: `color: #0a0a0a; font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "66px" : "46px"}; font-weight: 800; line-height: 1.15; margin-bottom: 24px; letter-spacing: -1px;`,
            subtitle: "color: #404040; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 400; line-height: 1.45;",
            bullets: "color: #171717; font-family: 'Outfit', sans-serif; font-size: 22px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #0a0a0a; margin-top: 2px;",
            quoteBox: "border-left: 4px solid #0a0a0a; padding-left: 24px; text-align: left; margin: 40px 0;",
            quoteText: "color: #0a0a0a; font-size: 28px; font-weight: 700; line-height: 1.4; margin-bottom: 12px;",
            quoteAuthor: "color: #404040; font-size: 18px; font-weight: 600; text-transform: uppercase;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(0,0,0,0.05); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: #0a0a0a;"
          };
        case "gold":
          return {
            wrapperBg: "#0a0907",
            wrapperImage: "radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 45%)",
            brandColor: "#d4af37",
            accentColor: "#f59e0b",
            titleColor: "#d4af37",
            titleFont: "'Outfit', sans-serif",
            subtitleColor: "#ffffff",
            subtitleFont: "'Outfit', sans-serif",
            bulletColor: "#f3f4f6",
            bulletIconColor: "#f59e0b",
            quoteBorderColor: "#d4af37",
            quoteTextColor: "#ffffff",
            quoteAuthorColor: "#f59e0b",
            progressBarBg: "rgba(255,255,255,0.03)",
            wrapper: "background: #0a0907; background-image: radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 45%); color: #ffffff; font-family: 'Outfit', sans-serif; position: relative;",
            title: `color: #d4af37; text-shadow: 0 0 15px rgba(212, 175, 55, 0.25); font-family: 'Outfit', sans-serif; font-size: ${slideLayout === "title-only" ? "64px" : "44px"}; font-weight: 800; line-height: 1.2; margin-bottom: 24px;`,
            subtitle: "color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 500; opacity: 0.95; line-height: 1.4;",
            bullets: "color: #f3f4f6; font-family: 'Outfit', sans-serif; font-size: 22px; line-height: 1.6; text-align: left; list-style-type: none; margin-top: 30px;",
            bulletItem: "margin-bottom: 14px; display: flex; align-items: flex-start; gap: 12px;",
            bulletIcon: "color: #f59e0b; margin-top: 2px;",
            quoteBox: "border-left: 4px solid #d4af37; padding-left: 24px; text-align: left; margin: 40px 0;",
            quoteText: "color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.4; margin-bottom: 12px; font-style: italic;",
            quoteAuthor: "color: #f59e0b; font-size: 18px; font-weight: 600; text-transform: uppercase;",
            header: "display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; width: 100%; box-sizing: border-box;",
            footer: "width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; margin-top: auto;",
            progressBarContainer: "height: 6px; width: 100%; background: rgba(255,255,255,0.03); position: absolute; bottom: 0; left: 0;",
            progressBarFill: "height: 100%; background: linear-gradient(90deg, #d4af37, #f59e0b);"
          };
      }
    })();

    if (!rawStyles) return {} as any;

    if (scale !== 1.0) {
      const scaledStyles = { ...rawStyles };
      const regex = /(\d+(?:\.\d+)?)px/g;
      for (const key of Object.keys(scaledStyles)) {
        const val = (scaledStyles as any)[key];
        if (typeof val === "string") {
          (scaledStyles as any)[key] = val.replace(regex, (match, p1) => {
            const num = parseFloat(p1);
            const scaledVal = Math.round(num * scale);
            return `${scaledVal > 0 ? scaledVal : 1}px`;
          });
        }
      }
      return scaledStyles;
    }

    return rawStyles;
  };

  // Convert SVG string to Canvas and trigger download
  const handleDownloadSlide = async (slideIndex: number) => {
    const svgElement = document.getElementById(`svg-slide-${slideIndex}`);
    if (!svgElement) {
      toast.error("Could not find the slide render element.");
      return;
    }

    const downloadToast = toast.loading(`Exporting slide ${slideIndex + 1}...`);

    try {
      // Clone the SVG element to avoid modifying the live DOM
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Set XML namespace on the foreignObject root element so the browser's XML parser handles HTML correctly
      const htmlDiv = clonedSvg.querySelector("foreignObject > div");
      if (htmlDiv) {
        htmlDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      }
      
      // Find all img elements in the cloned SVG
      const imgElements = Array.from(clonedSvg.querySelectorAll("img"));
      
      // Convert all remote images to Base64 data URLs via proxy to bypass CORS
      for (const imgEl of imgElements) {
        const src = imgEl.getAttribute("src");
        if (src && src.startsWith("http") && !src.startsWith("data:")) {
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) {
              throw new Error(`Failed to fetch image via proxy, status: ${response.status}`);
            }
            const blob = await response.blob();
            const base64Data = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            imgEl.setAttribute("src", base64Data);
          } catch (e) {
            console.error("Failed to convert image to base64 during download:", src, e);
          }
        }
      }

      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      const base64Svg = window.btoa(unescape(encodeURIComponent(svgString)));
      const dataURL = `data:image/svg+xml;base64,${base64Svg}`;
 
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const { width: dw, height: dh } = getDimensions();
          canvas.width = dw;
          canvas.height = dh;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(image, 0, 0, dw, dh);
            const pngDataUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngDataUrl;
            downloadLink.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-slide-${slideIndex + 1}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast.success(`Slide ${slideIndex + 1} downloaded successfully!`, { id: downloadToast });
            resolve();
          } else {
            toast.error("Canvas context generation failed.", { id: downloadToast });
            reject(new Error("Canvas context generation failed."));
          }
        };
        image.onerror = () => {
          toast.error("Failed to load slide content for export.", { id: downloadToast });
          reject(new Error("Failed to load slide content for export."));
        };
        image.src = dataURL;
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Error generating slide image file.", { id: downloadToast });
    }
  };

  // Download all slides in order with a minor timeout to bypass popup block triggers
  const handleDownloadAllSlides = async () => {
    toast.success(`Starting download of all ${slides.length} slides sequentially...`);
    for (let i = 0; i < slides.length; i++) {
      try {
        await handleDownloadSlide(i);
        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (err) {
        console.error(`Failed to download slide ${i + 1}:`, err);
      }
    }
  };

  const styles = getThemeStyles(activeSlide.layout, liveScaleMultiplier);

  const getThemePreviewColors = (themeId: string) => {
    switch (themeId) {
      case "cyberpunk":
        return { bg: "#05050a", border: "rgba(255,255,255,0.1)", dots: ["#06b6d4", "#9333ea"] };
      case "cream":
        return { bg: "#F9F6F0", border: "#e5e5e5", dots: ["#5c554c", "#8c8273"] };
      case "sunset":
        return { bg: "linear-gradient(135deg, #FF512F, #DD2476)", border: "transparent", dots: ["#ffffff", "#ffecd2"] };
      case "terminal":
        return { bg: "#090c0f", border: "#18212c", dots: ["#39ff14", "#8892b0"] };
      case "glass":
        return { bg: "linear-gradient(135deg, #03001e, #4a0072)", border: "rgba(255,255,255,0.1)", dots: ["#a5f3fc", "#c084fc"] };
      case "emerald":
        return { bg: "#041611", border: "rgba(255,255,255,0.05)", dots: ["#10b981", "#34d399"] };
      case "minimal":
        return { bg: "#ffffff", border: "#e5e5e5", dots: ["#0a0a0a", "#404040"] };
      case "gold":
        return { bg: "#0a0907", border: "rgba(255,255,255,0.05)", dots: ["#d4af37", "#f59e0b"] };
      default:
        return { bg: "#ffffff", border: "#e5e5e5", dots: ["#000000"] };
    }
  };

  const renderBgPatternMarkup = (suffix = "preview", localStyles = styles) => {
    const color = theme === "cream" ? "#000000" : "#ffffff";
    switch (bgPattern) {
      case "grid":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 overflow-hidden" style={{ mixBlendMode: theme === "cream" ? "multiply" : "screen" }}>
            <svg width="100%" height="100%" style={{ color }}>
              <defs>
                <pattern id={`gridPattern-${suffix}`} width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#gridPattern-${suffix})`} />
            </svg>
          </div>
        );
      case "dots":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-0 overflow-hidden" style={{ mixBlendMode: theme === "cream" ? "multiply" : "screen" }}>
            <svg width="100%" height="100%" style={{ color }}>
              <defs>
                <pattern id={`dotsPattern-${suffix}`} width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dotsPattern-${suffix})`} />
            </svg>
          </div>
        );
      case "glow":
        return (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.15]">
            <div 
              className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[100px]"
              style={{ background: localStyles.accentColor }}
            />
            <div 
              className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] rounded-full blur-[100px]"
              style={{ background: localStyles.brandColor }}
            />
          </div>
        );
      case "isometric":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 overflow-hidden" style={{ mixBlendMode: theme === "cream" ? "multiply" : "screen" }}>
            <svg width="100%" height="100%" style={{ color }}>
              <defs>
                <pattern id={`isoPattern-${suffix}`} width="60" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 60 15 L 30 30 L 0 15 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#isoPattern-${suffix})`} />
            </svg>
          </div>
        );
      case "hexagons":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden" style={{ mixBlendMode: theme === "cream" ? "multiply" : "screen" }}>
            <svg width="100%" height="100%" style={{ color }}>
              <defs>
                <pattern id={`hexPattern-${suffix}`} width="56.28" height="97.48" patternUnits="userSpaceOnUse">
                  <path d="M0 24.37 L28.14 8.12 L56.28 24.37 L56.28 56.87 L28.14 73.12 L0 56.87 Z M28.14 8.12 L28.14 0 M56.28 24.37 L56.28 8.12 M0 24.37 L0 8.12 M28.14 73.12 L28.14 97.48 M56.28 56.87 L56.28 73.12 M0 56.87 L0 73.12" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#hexPattern-${suffix})`} />
            </svg>
          </div>
        );
      case "waves":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] z-0 overflow-hidden" style={{ mixBlendMode: theme === "cream" ? "multiply" : "screen" }}>
            <svg width="100%" height="100%" style={{ color }}>
              <defs>
                <pattern id={`wavePattern-${suffix}`} width="80" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 Q 20 5, 40 20 T 80 20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M 0 30 Q 20 15, 40 30 T 80 30" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#wavePattern-${suffix})`} />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const renderImageOrSvgMarkup = (slide: Slide, className: string, style: React.CSSProperties = {}, svgHeight = "400px") => {
    if (slide.customImage) {
      return (
        <div style={{ position: "relative", overflow: "hidden", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img 
            src={slide.customImage} 
            alt="Slide Graphic" 
            className={className}
            style={style} 
          />
        </div>
      );
    }
    
    if (visualMode === "svg" && slide.svgCode) {
      return (
        <div 
          style={{ 
            position: "relative", 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            maxHeight: svgHeight,
            overflow: "hidden"
          }}
          dangerouslySetInnerHTML={{ __html: slide.svgCode }}
        />
      );
    }

    const src = `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imagePrompt || slide.title)}?width=500&height=500&nologo=true`;
    return (
      <div style={{ position: "relative", overflow: "hidden", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img 
          src={src} 
          alt="Slide Graphic" 
          className={className}
          style={style} 
        />
      </div>
    );
  };

  const renderImageElement = (className = "rounded-xl border border-white/10 w-full object-cover", height = 140) => {
    const scaledHeight = `${Math.round(height * liveScaleMultiplier)}px`;
    return renderImageOrSvgMarkup(activeSlide, className, { height: scaledHeight, objectFit: "cover" }, scaledHeight);
  };

  const renderStreamingWidget = (type: "generation" | "refinement") => {
    if (type === "generation" && !isGenerating) return null;
    if (type === "refinement" && !isRefining) return null;
    
    // Parse whatever slides we have from streamBuffer
    const parsed = parsePartialSlides(streamBuffer);
    const parsedSlides = parsed.slides || [];
    const totalSlidesTarget = type === "generation" ? slideCount : slides.length;
    
    return (
      <div className="mt-4 p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">
              Gemini SSE Pipeline
            </span>
          </div>
          <span className="text-[9px] bg-neutral-200/70 text-neutral-700 font-bold px-2 py-0.5 rounded-full uppercase">
            {type === "generation" ? "Generating" : "Refining"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-neutral-500">
            <span>Slide Stream Progress</span>
            <span>{parsedSlides.length} / {totalSlidesTarget} Slides Compiled</span>
          </div>
          <div className="h-2 w-full bg-neutral-200/70 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0075de] to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.min(100, (parsedSlides.length / totalSlidesTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Slides Checklist */}
        <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
          {Array.from({ length: totalSlidesTarget }).map((_, idx) => {
            const isParsed = idx < parsedSlides.length;
            const isCurrent = idx === parsedSlides.length;
            const slideData = parsedSlides[idx];
            
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border transition-all ${
                  isParsed 
                    ? "bg-[#e0f2fe]/40 border-[#bae6fd] text-neutral-800" 
                    : isCurrent 
                    ? "bg-white border-[#0075de]/30 text-neutral-900 shadow-sm shadow-[#0075de]/5" 
                    : "bg-transparent border-neutral-100/50 text-neutral-400"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isParsed 
                      ? "bg-emerald-500 text-white" 
                      : isCurrent 
                      ? "bg-[#0075de] text-white animate-pulse" 
                      : "bg-neutral-100 text-neutral-400"
                  }`}>
                    {isParsed ? "✓" : idx + 1}
                  </span>
                  <span className="truncate">
                    {slideData ? slideData.title : isCurrent ? "Streaming tokens..." : `Slide ${idx + 1}`}
                  </span>
                </div>
                {slideData && (
                  <span className="text-[9px] bg-neutral-200/60 px-1.5 py-0.5 rounded font-mono text-neutral-600 uppercase shrink-0">
                    {slideData.layout || "layout"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Token Terminal */}
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            Token Event Buffer (JSON Stream)
          </label>
          <div className="bg-[#171717] rounded-xl p-3 font-mono text-[10px] text-[#22c55e] h-[100px] overflow-y-auto whitespace-pre-wrap select-all custom-scrollbar border border-neutral-800 shadow-inner">
            {streamBuffer || "Waiting for stream pipeline initialization..."}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel-creator-panel w-full">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f1f1f;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f3f;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Scoped overrides to bypass global .notion-theme styles */
        .carousel-creator-panel .panel-card {
          background-color: #ffffff !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 16px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          padding: 32px !important;
        }
        
        .carousel-creator-panel input,
        .carousel-creator-panel select,
        .carousel-creator-panel textarea {
          background-color: #ffffff !important;
          color: #171717 !important;
          border: 1px solid #cccccc !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          font-size: 14px !important;
          transition: all 0.15s ease-in-out !important;
        }
        
        .carousel-creator-panel input:focus,
        .carousel-creator-panel select:focus,
        .carousel-creator-panel textarea:focus {
          border-color: #0075de !important;
          box-shadow: 0 0 0 2px rgba(0, 117, 222, 0.15) !important;
          background-color: #ffffff !important;
          outline: none !important;
        }
        
        .carousel-creator-panel .checkbox-pill {
          border: 1px solid #cccccc !important;
          border-radius: 12px !important;
          background-color: #ffffff !important;
          padding: 10px 14px !important;
          transition: all 0.15s ease-in-out !important;
        }
        .carousel-creator-panel .checkbox-pill:hover {
          background-color: #f9fafb !important;
          border-color: #a3a3a3 !important;
        }
        
        .carousel-creator-panel .tab-btn-active {
          background-color: #ffffff !important;
          color: #171717 !important;
          border: 1px solid #a3a3a3 !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.06) !important;
        }
        .carousel-creator-panel .tab-btn-inactive {
          background-color: transparent !important;
          color: #666666 !important;
          border: 1px solid transparent !important;
        }
        .carousel-creator-panel .tab-btn-inactive:hover {
          background-color: rgba(0,0,0,0.04) !important;
          color: #171717 !important;
        }
        
        .carousel-creator-panel .theme-preset-btn {
          border: 1px solid #cccccc !important;
          background-color: #ffffff !important;
          color: #404040 !important;
          border-radius: 12px !important;
          transition: all 0.15s ease-in-out !important;
        }
        .carousel-creator-panel .theme-preset-btn:hover {
          background-color: #f9fafb !important;
          border-color: #a3a3a3 !important;
        }
        .carousel-creator-panel .theme-preset-btn.theme-active {
          border: 2px solid #0075de !important;
          color: #0075de !important;
          font-weight: 700 !important;
          background-color: #ffffff !important;
        }
        
        .carousel-creator-panel .phone-mock-frame {
          background-color: #ffffff !important;
          border: 2px solid #cccccc !important;
          border-radius: 40px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05) !important;
          padding: 16px !important;
        }
        
        .carousel-creator-panel .action-btn-secondary {
          background-color: #ffffff !important;
          color: #404040 !important;
          border: 1px solid #cccccc !important;
          border-radius: 12px !important;
          transition: all 0.15s ease-in-out !important;
        }
        .carousel-creator-panel .action-btn-secondary:hover {
          background-color: #f9fafb !important;
          border-color: #a3a3a3 !important;
          color: #171717 !important;
        }
        
        /* General layout adjustments */
        .carousel-creator-panel .info-pill {
          background-color: rgba(0, 117, 222, 0.04) !important;
          border: 1px solid rgba(0, 117, 222, 0.15) !important;
          border-radius: 12px !important;
          color: #0060b8 !important;
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Editor Panel (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border border-neutral-300 p-1 bg-neutral-100/80 rounded-xl w-full sm:w-fit flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "ai" ? "tab-btn-active" : "tab-btn-inactive"
            }`}
          >
            <BotIcon size={14} />
            AI Generator
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "edit" ? "tab-btn-active" : "tab-btn-inactive"
            }`}
          >
            <Edit3 size={14} />
            Edit Slides
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "design" ? "tab-btn-active" : "tab-btn-inactive"
            }`}
          >
            <Palette size={14} />
            Branding
          </button>
        </div>

        {/* Tab 1: AI Prompt Generator */}
        {activeTab === "ai" && (
          <div className="panel-card space-y-6">
            <div className="space-y-2">
              <div className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <BotIcon size={18} className="text-[#0075de]" />
                Create with Gemini AI
              </div>
              <p className="text-xs text-neutral-500 font-medium">Input your core business topic and let Gemini generate an optimized carousel structure.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Topic / Core Theme</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 5 AI systems that will save 20 hours a week for founders"
                  className="w-full h-14 bg-neutral-50 border border-neutral-200/80 rounded-2xl px-6 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0075de]/50 focus:bg-white transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Slide Count</label>
                  <select
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="w-full h-14 bg-neutral-50 border border-neutral-200/80 rounded-2xl px-6 text-sm text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} className="bg-white text-neutral-900">{num} Slides</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Tone of Voice</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-14 bg-neutral-50 border border-neutral-200/80 rounded-2xl px-6 text-sm text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  >
                    {["Hype", "Professional", "Casual", "Technical", "Minimalist"].map((tStr) => (
                      <option key={tStr} value={tStr} className="bg-white text-neutral-900">{tStr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateCarousel}
              disabled={isGenerating}
              className="w-full h-14 bg-[#0075de] hover:bg-[#0075de]/95 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 group transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  GENERATING SLIDES...
                </>
              ) : (
                <>
                  <BotIcon size={16} />
                  GENERATE WITH GEMINI 2.5 FLASH
                </>
              )}
            </Button>

            {renderStreamingWidget("generation")}
          </div>
        )}

        {/* Tab 2: Manual Slide Editor */}
        {activeTab === "edit" && (
          <div className="panel-card space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-[#0075de]" />
                  Slide Editor
                </div>
                <p className="text-xs text-neutral-500 font-medium">Customize copy, bullet points, and layout structures for Slide {activeIndex + 1}.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={addNewSlide} 
                  className="action-btn-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1 rounded-lg"
                >
                  <Plus size={12} /> Add
                </button>
                <button 
                  onClick={deleteCurrentSlide} 
                  className="action-btn-secondary px-3 py-1.5 text-xs font-bold flex items-center gap-1 rounded-lg"
                  style={{ color: "#dc2626", borderColor: "#fca5a5" }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            {/* Editor fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Visual Layout</label>
                  <select
                    value={activeSlide.layout}
                    onChange={(e) => updateActiveSlide({ layout: e.target.value as any })}
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  >
                    <option value="title-only" className="bg-white text-neutral-900">Title Only (Hook / Transition)</option>
                    <option value="bullets" className="bg-white text-neutral-900">Bullet Points (Value Slide)</option>
                    <option value="quote" className="bg-white text-neutral-900">Quote Highlight</option>
                    <option value="cta" className="bg-white text-neutral-900">Call to Action (CTA)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Slide Title</label>
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => updateActiveSlide({ title: e.target.value })}
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {activeSlide.layout === "quote" ? "Quote Text" : "Description / Subtitle"}
                </label>
                <textarea
                  value={activeSlide.subtitle}
                  onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-medium resize-none"
                />
              </div>

              {/* Slide Image Settings Section */}
              <div className="border border-neutral-200 rounded-xl p-4 space-y-4 bg-neutral-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                    <LayoutGrid size={12} className="text-[#0075de]" />
                    Slide Graphic Layer
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!activeSlide.imageEnabled}
                      onChange={(e) => updateActiveSlide({ imageEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0075de]"></div>
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                      {activeSlide.imageEnabled ? "Active" : "Off"}
                    </span>
                  </label>
                </div>

                {activeSlide.imageEnabled && (
                  <div className="space-y-4 pt-3 border-t border-neutral-200/60">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Graphic Type</label>
                        <select
                          value={activeSlide.customImage ? "upload" : "ai"}
                          onChange={(e) => {
                            if (e.target.value === "ai") {
                              updateActiveSlide({ customImage: undefined });
                            } else {
                              updateActiveSlide({ customImage: "" });
                            }
                          }}
                          className="w-full h-10 bg-white border border-neutral-200 rounded-lg px-3 text-xs focus:outline-none focus:border-[#0075de] font-semibold"
                        >
                          <option value="ai">AI Vector Graphic (SVG)</option>
                          <option value="upload">Custom Image Upload</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Layout Alignment</label>
                        <select
                          value={activeSlide.imageLayout || "split-right"}
                          onChange={(e) => updateActiveSlide({ imageLayout: e.target.value as any })}
                          className="w-full h-10 bg-white border border-neutral-200 rounded-lg px-3 text-xs focus:outline-none focus:border-[#0075de] font-semibold"
                        >
                          <option value="split-right">Split Right</option>
                          <option value="split-left">Split Left</option>
                          <option value="centered">Centered / Inline</option>
                        </select>
                      </div>
                    </div>

                    {!activeSlide.customImage && activeSlide.customImage !== "" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">AI SVG Vector Code</label>
                          <span className="text-[9px] text-[#0075de] font-bold uppercase">Editable</span>
                        </div>
                        <textarea
                          value={activeSlide.svgCode || ""}
                          onChange={(e) => updateActiveSlide({ svgCode: e.target.value })}
                          placeholder="<svg viewBox='0 0 400 400' width='100%' height='100%'>...</svg>"
                          rows={5}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-3 text-[11px] font-mono focus:outline-none focus:border-[#0075de] resize-y custom-scrollbar"
                          style={{ minHeight: "100px" }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Upload Image File</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            id="custom-image-file-input"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateActiveSlide({ customImage: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="custom-image-file-input"
                            className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-bold bg-white text-neutral-700 hover:bg-neutral-50 cursor-pointer select-none"
                          >
                            Choose File
                          </label>
                          {activeSlide.customImage && (
                            <div className="flex items-center gap-2">
                              <img src={activeSlide.customImage} alt="Preview" className="h-10 w-10 object-cover rounded border border-neutral-200" />
                              <button
                                onClick={() => updateActiveSlide({ customImage: "" })}
                                className="text-[10px] text-red-500 hover:underline font-bold"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Layout Specific: Quote Author */}
              {activeSlide.layout === "quote" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Quote Author / Source</label>
                  <input
                    type="text"
                    value={activeSlide.quoteAuthor || ""}
                    onChange={(e) => updateActiveSlide({ quoteAuthor: e.target.value })}
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-medium"
                  />
                </div>
              )}

              {/* Layout Specific: Bullets */}
              {activeSlide.layout === "bullets" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Bullet Points</label>
                    <button onClick={addBullet} className="text-[10px] font-bold uppercase tracking-wider text-[#0075de] hover:underline flex items-center gap-1">
                      <Plus size={10} /> Add Bullet
                    </button>
                  </div>

                  {activeSlide.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#0075de]/10 border border-[#0075de]/20 flex items-center justify-center text-[10px] font-black text-[#0075de] shrink-0">
                        {idx + 1}
                      </div>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBulletText(idx, e.target.value)}
                        className="flex-1 h-11 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all"
                      />
                      <button onClick={() => removeBullet(idx)} className="text-neutral-400 hover:text-red-500 p-1 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {activeSlide.bullets.length === 0 && (
                    <div className="text-center p-6 border border-dashed border-neutral-200 rounded-2xl text-neutral-400 text-xs">
                      No bullet points added. Click "Add Bullet" to include key points.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Agent Loop Refinement */}
            <div className="pt-4 border-t border-neutral-200/85 space-y-3">
              <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <BotIcon size={14} className="text-[#0075de]" />
                Refine slides with AI Agent
              </div>
              <p className="text-[10px] text-neutral-500 font-medium">Type instructions to refine slide contents, formatting, or change specific details across all slides.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                  placeholder="e.g. Make slide 3 focus on email tools, or make all titles shorter"
                  className="flex-1 h-11 px-4 text-xs"
                />
                <button
                  onClick={handleRefineCarousel}
                  disabled={isRefining || slides.length === 0}
                  className="bg-[#0075de] hover:bg-[#0075de]/95 text-white font-bold px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 h-11"
                  style={{ borderRadius: "12px" }}
                >
                  {isRefining ? (
                    <RefreshCw className="animate-spin" size={12} />
                  ) : (
                    <BotIcon size={12} />
                  )}
                  {isRefining ? "Refining..." : "Send"}
                </button>
              </div>

              {renderStreamingWidget("refinement")}
            </div>

            {/* Quick Slide Selector Nav Grid */}
            <div className="pt-4 border-t border-neutral-200">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-3">Slide Index Matrix</label>
              <div className="flex flex-wrap gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-10 w-10 rounded-xl text-xs font-bold transition-all ${
                      activeIndex === idx 
                        ? "bg-[#0075de] text-white shadow-md shadow-[#0075de]/25 scale-105" 
                        : "bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={addNewSlide}
                  className="h-10 w-10 rounded-xl bg-neutral-50 border border-dashed border-neutral-300 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-950 flex items-center justify-center transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Design & Branding Settings */}
        {activeTab === "design" && (
          <div className="panel-card space-y-6">
            <div className="space-y-2">
              <div className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Palette size={18} className="text-[#0075de]" />
                Themes & Branding
              </div>
              <p className="text-xs text-neutral-500 font-medium">Fine-tune the typography, color tones, layout metadata, and user handle visibility.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Theme Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { id: "cyberpunk", name: "Cyberpunk" },
                    { id: "cream", name: "Warm Cream" },
                    { id: "sunset", name: "Neon Sunset" },
                    { id: "terminal", name: "Terminal" },
                    { id: "glass", name: "Glassmorphic" },
                    { id: "emerald", name: "Emerald Forest" },
                    { id: "minimal", name: "Minimal Stark" },
                    { id: "gold", name: "Premium Gold" }
                  ].map((tPreset) => {
                    const preview = getThemePreviewColors(tPreset.id);
                    return (
                      <button
                        key={tPreset.id}
                        onClick={() => setTheme(tPreset.id as any)}
                        className={`h-20 rounded-xl text-[9px] font-bold uppercase tracking-wider flex flex-col justify-center items-center transition-all theme-preset-btn ${
                          theme === tPreset.id ? "theme-active scale-[1.02]" : ""
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full border flex items-center justify-center gap-0.5 shadow-sm" 
                            style={{ background: preview.bg, borderColor: preview.border }}
                          >
                            {preview.dots.map((dotColor, dIdx) => (
                              <div key={dIdx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                            ))}
                          </div>
                        </div>
                        <span>{tPreset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. GrowXLabs"
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="e.g. @growxlabs.tech"
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Background Pattern</label>
                  <select
                    value={bgPattern}
                    onChange={(e) => setBgPattern(e.target.value as any)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  >
                    <option value="none">None (Solid / Gradient)</option>
                    <option value="grid">Futuristic Grid Line</option>
                    <option value="dots">Tech Dot Matrix</option>
                    <option value="glow">Soft Glow Overlays</option>
                    <option value="isometric">Isometric 3D Diamonds</option>
                    <option value="hexagons">Tech Hexagon Grid</option>
                    <option value="waves">Topographic Waves</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Carousel Format</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full h-12 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 text-xs text-neutral-900 focus:outline-none focus:border-[#0075de]/50 transition-all font-semibold"
                  >
                    <option value="3:4">Portrait 3:4 (Recommended - 1080x1440)</option>
                    <option value="4:5">Portrait 4:5 (Classic - 1080x1350)</option>
                    <option value="1:1">Square 1:1 (Classic - 1080x1080)</option>
                    <option value="1.91:1">Landscape 1.91:1 (1080x566)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-3 gap-4">
                <label className="checkbox-pill flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showHandle}
                    onChange={(e) => setShowHandle(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0075de] focus:ring-[#0075de] focus:ring-offset-0"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Show Handle</span>
                </label>
                <label className="checkbox-pill flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPageNumber}
                    onChange={(e) => setShowPageNumber(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0075de] focus:ring-[#0075de] focus:ring-offset-0"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Show Pages</span>
                </label>
                <label className="checkbox-pill flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0075de] focus:ring-[#0075de] focus:ring-offset-0"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Progress Bar</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel (Right 5 Cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-6 items-center">
        
        {/* Toggle Visual Mode */}
        <div className="flex border border-neutral-300 p-1 bg-neutral-100/80 rounded-xl w-full max-w-[370px]">
          <button
            onClick={() => setVisualMode("svg")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              visualMode === "svg" ? "tab-btn-active" : "tab-btn-inactive"
            }`}
          >
            SVG Vector
          </button>
          <button
            onClick={() => setVisualMode("image")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              visualMode === "image" ? "tab-btn-active" : "tab-btn-inactive"
            }`}
          >
            AI Image
          </button>
        </div>

        {/* Instagram Phone Mock Frame */}
        <div className="phone-mock-frame w-full max-w-[370px] pt-10 pb-6 relative overflow-hidden flex flex-col">
          
          {/* Phone Speaker & Camera Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-800 rounded-full flex items-center justify-center gap-1.5 z-20">
            <div className="w-8 h-1.5 bg-zinc-700 rounded-full" />
            <div className="w-2.5 h-2.5 bg-zinc-900 border border-zinc-700 rounded-full" />
          </div>

          {/* Phone Content Canvas Area */}
          <div 
            ref={previewRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`bg-black border border-neutral-200 rounded-[28px] overflow-hidden flex flex-col relative ${getAspectClass()}`}
          >
            
            {/* Live rendered slide inside preview */}
            <div 
              className="w-full h-full flex flex-col justify-between items-center text-center select-none relative box-border"
              style={{
                backgroundColor: styles.wrapperBg,
                backgroundImage: styles.wrapperImage,
                fontFamily: styles.titleFont,
                padding: `${Math.round(24 * scaleMultiplier)}px`
              }}
            >
              {renderBgPatternMarkup()}
              
              {/* BRAND HEADER (Simulated inside live view) */}
              {showHandle && (
                <div 
                  className="flex items-center justify-between border-b w-full box-border"
                  style={{ 
                    borderColor: "rgba(255,255,255,0.06)",
                    paddingBottom: `${Math.round(8 * scaleMultiplier)}px`
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Brand avatar */}
                    <div 
                      className="rounded-full flex items-center justify-center font-black shrink-0"
                      style={{ 
                        background: styles.accentColor, 
                        color: theme === "cream" ? "#ffffff" : "#000000",
                        height: `${Math.round(32 * scaleMultiplier)}px`,
                        width: `${Math.round(32 * scaleMultiplier)}px`,
                        fontSize: `${Math.max(Math.round(12 * scaleMultiplier), 8)}px`
                      }}
                    >
                      {brandName[0] || "G"}
                    </div>
                    <span 
                      className="font-black tracking-tight"
                      style={{ 
                        color: styles.brandColor, 
                        fontFamily: styles.subtitleFont,
                        fontSize: `${Math.max(Math.round(12 * scaleMultiplier), 9)}px`
                      }}
                    >
                      {brandName}
                    </span>
                  </div>
                  <span 
                    className="font-bold opacity-60" 
                    style={{ 
                      color: styles.brandColor, 
                      fontFamily: styles.subtitleFont,
                      fontSize: `${Math.max(Math.round(10 * scaleMultiplier), 8)}px`
                    }}
                  >
                    {instagramHandle}
                  </span>
                </div>
              )}

              {/* SLIDE CONTENT AREA */}
              <div 
                className="flex-1 flex flex-col justify-center items-center w-full box-border overflow-hidden"
                style={{
                  paddingTop: `${Math.round(16 * scaleMultiplier)}px`,
                  paddingBottom: `${Math.round(16 * scaleMultiplier)}px`
                }}
              >
                {activeSlide.layout === "title-only" && (
                  <div className="w-full">
                    <div style={{
                      color: styles.titleColor,
                      fontFamily: styles.titleFont,
                      fontSize: `${Math.round(24 * scaleMultiplier)}px`,
                      fontWeight: 900,
                      lineHeight: 1.15,
                      marginBottom: `${Math.round(12 * scaleMultiplier)}px`,
                      textTransform: theme === "cyberpunk" || theme === "sunset" ? "uppercase" : "none",
                      fontStyle: theme === "cyberpunk" ? "italic" : "normal",
                      textAlign: "center"
                    }}>
                      {activeSlide.title}
                    </div>
                    <div style={{
                      color: styles.subtitleColor,
                      fontFamily: styles.subtitleFont,
                      fontSize: `${Math.max(Math.round(13 * scaleMultiplier), 9)}px`,
                      lineHeight: 1.4,
                      opacity: 0.9,
                      textAlign: "center"
                    }}>
                      {activeSlide.subtitle}
                    </div>
                  </div>
                )}

                {activeSlide.layout === "bullets" && (
                  <div className="w-full text-left">
                    {activeSlide.imageEnabled ? (
                      activeSlide.imageLayout === "centered" ? (
                        <div 
                          className="w-full"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: `${Math.round(10 * scaleMultiplier)}px`
                          }}
                        >
                          <div style={{ 
                            color: styles.titleColor, 
                            fontFamily: styles.titleFont, 
                            fontSize: `${Math.round(16 * scaleMultiplier)}px`, 
                            fontWeight: 800, 
                            lineHeight: 1.2 
                          }}>
                            {activeSlide.title}
                          </div>
                          {renderImageElement("rounded-lg border border-white/10 w-full object-cover", 100)}
                          <ul style={{ display: "flex", flexDirection: "column", gap: `${Math.round(4 * scaleMultiplier)}px` }}>
                            {activeSlide.bullets.map((bullet, index) => (
                              <li 
                                key={index} 
                                className="flex items-start font-semibold" 
                                style={{ 
                                  color: styles.bulletColor, 
                                  fontFamily: styles.subtitleFont,
                                  fontSize: `${Math.max(Math.round(10 * scaleMultiplier), 8)}px`,
                                  gap: `${Math.round(6 * scaleMultiplier)}px`
                                }}
                              >
                                <span style={{ color: styles.bulletIconColor }}>✔</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div 
                          className="grid grid-cols-12 items-center w-full"
                          style={{ gap: `${Math.round(16 * scaleMultiplier)}px` }}
                        >
                          <div className={activeSlide.imageLayout === "split-left" ? "col-span-5" : "col-span-7"}>
                            {activeSlide.imageLayout === "split-left" ? (
                              renderImageElement("rounded-lg border border-white/10 w-full object-cover aspect-square", 130)
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: `${Math.round(8 * scaleMultiplier)}px` }}>
                                <div style={{ 
                                  color: styles.titleColor, 
                                  fontFamily: styles.titleFont, 
                                  fontSize: `${Math.round(15 * scaleMultiplier)}px`, 
                                  fontWeight: 800, 
                                  lineHeight: 1.2 
                                }}>
                                  {activeSlide.title}
                                </div>
                                <ul style={{ display: "flex", flexDirection: "column", gap: `${Math.round(4 * scaleMultiplier)}px` }}>
                                  {activeSlide.bullets.map((bullet, index) => (
                                    <li 
                                      key={index} 
                                      className="flex items-start font-semibold" 
                                      style={{ 
                                        color: styles.bulletColor, 
                                        fontFamily: styles.subtitleFont,
                                        fontSize: `${Math.max(Math.round(10 * scaleMultiplier), 8)}px`,
                                        gap: `${Math.round(6 * scaleMultiplier)}px`
                                      }}
                                    >
                                      <span style={{ color: styles.bulletIconColor }}>✔</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className={activeSlide.imageLayout === "split-left" ? "col-span-7" : "col-span-5"}>
                            {activeSlide.imageLayout === "split-left" ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: `${Math.round(8 * scaleMultiplier)}px` }}>
                                <div style={{ 
                                  color: styles.titleColor, 
                                  fontFamily: styles.titleFont, 
                                  fontSize: `${Math.round(15 * scaleMultiplier)}px`, 
                                  fontWeight: 800, 
                                  lineHeight: 1.2 
                                }}>
                                  {activeSlide.title}
                                </div>
                                <ul style={{ display: "flex", flexDirection: "column", gap: `${Math.round(4 * scaleMultiplier)}px` }}>
                                  {activeSlide.bullets.map((bullet, index) => (
                                    <li 
                                      key={index} 
                                      className="flex items-start font-semibold" 
                                      style={{ 
                                        color: styles.bulletColor, 
                                        fontFamily: styles.subtitleFont,
                                        fontSize: `${Math.max(Math.round(10 * scaleMultiplier), 8)}px`,
                                        gap: `${Math.round(6 * scaleMultiplier)}px`
                                      }}
                                    >
                                      <span style={{ color: styles.bulletIconColor }}>✔</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              renderImageElement("rounded-lg border border-white/10 w-full object-cover aspect-square", 130)
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <>
                        <div style={{
                          color: styles.titleColor,
                          fontFamily: styles.titleFont,
                          fontSize: `${Math.round(18 * scaleMultiplier)}px`,
                          fontWeight: 800,
                          lineHeight: 1.2,
                          marginBottom: `${Math.round(8 * scaleMultiplier)}px`
                        }}>
                          {activeSlide.title}
                        </div>
                        <div style={{
                          color: styles.subtitleColor,
                          fontFamily: styles.subtitleFont,
                          fontSize: `${Math.max(Math.round(12 * scaleMultiplier), 9)}px`,
                          opacity: 0.8,
                          marginBottom: `${Math.round(12 * scaleMultiplier)}px`
                        }}>
                          {activeSlide.subtitle}
                        </div>
                        <ul style={{ display: "flex", flexDirection: "column", gap: `${Math.round(6 * scaleMultiplier)}px` }}>
                          {activeSlide.bullets.map((bullet, index) => (
                            <li 
                              key={index} 
                              className="flex items-start font-semibold" 
                              style={{ 
                                color: styles.bulletColor, 
                                fontFamily: styles.subtitleFont,
                                fontSize: `${Math.max(Math.round(11 * scaleMultiplier), 8.5)}px`,
                                gap: `${Math.round(8 * scaleMultiplier)}px`
                              }}
                            >
                              <span style={{ color: styles.bulletIconColor }}>✔</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {activeSlide.layout === "quote" && (
                  <div 
                    className="w-full text-left" 
                    style={{ 
                      borderLeftWidth: `${Math.max(Math.round(4 * scaleMultiplier), 2)}px`,
                      borderLeftStyle: "solid",
                      borderColor: styles.quoteBorderColor,
                      paddingLeft: `${Math.round(16 * scaleMultiplier)}px`
                    }}
                  >
                    <div style={{
                      fontSize: `${Math.max(Math.round(14 * scaleMultiplier), 9.5)}px`,
                      fontStyle: "italic",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      marginBottom: `${Math.round(6 * scaleMultiplier)}px`,
                      color: styles.quoteTextColor,
                      fontFamily: theme === "cream" ? "'Playfair Display', serif" : styles.titleFont
                    }}>
                      "{activeSlide.subtitle}"
                    </div>
                    <div style={{ 
                      fontSize: `${Math.max(Math.round(9 * scaleMultiplier), 8)}px`, 
                      fontFamily: styles.subtitleFont,
                      fontWeight: 900, 
                      textTransform: "uppercase", 
                      letterSpacing: "1px", 
                      color: styles.quoteAuthorColor 
                    }}>
                      — {activeSlide.quoteAuthor || "Quote Author"}
                    </div>
                  </div>
                )}

                {activeSlide.layout === "cta" && (
                  <div 
                    className="w-full text-center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: `${Math.round(12 * scaleMultiplier)}px`
                    }}
                  >
                    <div 
                      className="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary animate-pulse"
                      style={{
                        height: `${Math.round(40 * scaleMultiplier)}px`,
                        width: `${Math.round(40 * scaleMultiplier)}px`
                      }}
                    >
                      <InstagramIcon size={Math.round(18 * scaleMultiplier)} style={{ color: styles.brandColor }} />
                    </div>
                    <div style={{
                      color: styles.titleColor,
                      fontFamily: styles.titleFont,
                      fontSize: `${Math.round(20 * scaleMultiplier)}px`,
                      fontWeight: 900,
                      lineHeight: 1.2
                    }}>
                      {activeSlide.title}
                    </div>
                    <div style={{
                      color: styles.subtitleColor,
                      fontFamily: styles.subtitleFont,
                      fontSize: `${Math.max(Math.round(12 * scaleMultiplier), 9)}px`,
                      opacity: 0.8
                    }}>
                      {activeSlide.subtitle}
                    </div>
                    <div>
                      <div 
                        className="font-black tracking-widest inline-block uppercase"
                        style={{ 
                          background: styles.accentColor,
                          color: theme === "cream" ? "#ffffff" : "#000000",
                          fontFamily: styles.subtitleFont,
                          padding: `${Math.round(6 * scaleMultiplier)}px ${Math.round(16 * scaleMultiplier)}px`,
                          fontSize: `${Math.max(Math.round(9 * scaleMultiplier), 8)}px`,
                          borderRadius: `${Math.round(8 * scaleMultiplier)}px`
                        }}
                      >
                        SWIPE LEFT TO FOLLOW
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BRAND FOOTER (Simulated inside live view) */}
              <div 
                className="w-full flex items-center justify-between border-t" 
                style={{ 
                  borderColor: "rgba(255,255,255,0.06)",
                  paddingTop: `${Math.round(8 * scaleMultiplier)}px`
                }}
              >
                <span 
                  className="font-black tracking-widest opacity-50 uppercase" 
                  style={{ 
                    color: styles.brandColor, 
                    fontFamily: styles.subtitleFont,
                    fontSize: `${Math.max(Math.round(9 * scaleMultiplier), 8)}px`
                  }}
                >
                  {activeSlide.layout === "cta" ? "SAVE THIS POST" : "SWIPE LEFT ➔"}
                </span>
                {showPageNumber && (
                  <span 
                    className="font-black italic opacity-60" 
                    style={{ 
                      color: styles.brandColor, 
                      fontFamily: styles.subtitleFont,
                      fontSize: `${Math.max(Math.round(12 * scaleMultiplier), 9)}px`
                    }}
                  >
                    {String(activeIndex + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* PROGRESS BAR FILL (Simulated inside live view) */}
              {showProgressBar && (
                <div className="h-1.5 w-full bg-white/5 absolute bottom-0 left-0">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${((activeIndex + 1) / slides.length) * 100}%`,
                      background: theme === "cream" ? "#5c554c" : `linear-gradient(90deg, ${styles.accentColor}, ${styles.brandColor})`
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Swipe controls */}
          <div className="flex justify-between items-center mt-5 px-3">
            <button
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="action-btn-secondary h-10 w-10 rounded-full disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5 items-center">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? "w-5 bg-[#0075de]" : "w-2 bg-neutral-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveIndex(Math.min(slides.length - 1, activeIndex + 1))}
              disabled={activeIndex === slides.length - 1}
              className="action-btn-secondary h-10 w-10 rounded-full disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full max-w-[370px] space-y-3">
          <Button
            onClick={() => handleDownloadSlide(activeIndex)}
            className="w-full h-12 bg-[#0075de] hover:bg-[#0075de]/95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm border-none transition-all"
          >
            <Download size={14} />
            DOWNLOAD SLIDE {activeIndex + 1}
          </Button>

          <button
            onClick={handleDownloadAllSlides}
            className="action-btn-secondary w-full h-12 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <LayoutGrid size={14} />
            DOWNLOAD ALL {slides.length} SLIDES
          </button>

          <div className="info-pill flex gap-2.5 p-4 text-[11px] leading-relaxed font-medium">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              All slides are drawn at high resolution ({svgWidth}x{svgHeight} px). Make sure you allow popups to download all slides together.
            </span>
          </div>
        </div></div>

        {/* ------------------------------------------------------------- */}
        {/* HIDDEN RAW SVG ELEMENTS RENDERED FOR HIGH-RESOLUTION GRAPHICS EXPORT */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden">
          {slides.map((slide, sIdx) => {
            const styles = getThemeStyles(slide.layout, scaleMultiplier);
            return (
              <svg 
                key={sIdx} 
                id={`svg-slide-${sIdx}`} 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                width={svgWidth} 
                height={svgHeight} 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <style>
                    {`
                      .slide-bg { ${styles.wrapper} }
                      .slide-header { ${styles.header} }
                      .slide-title { ${styles.title} }
                      .slide-subtitle { ${styles.subtitle} }
                      .slide-bullets { ${styles.bullets} }
                      .slide-bullet-item { ${styles.bulletItem} }
                      .slide-bullet-icon { ${styles.bulletIcon} }
                      .slide-quote-box { ${styles.quoteBox} }
                      .slide-quote-text { ${styles.quoteText} }
                      .slide-quote-author { ${styles.quoteAuthor} }
                      .slide-footer { ${styles.footer} }
                      .progress-bar-container { ${styles.progressBarContainer} }
                      .progress-bar-fill { ${styles.progressBarFill} }
                    `}
                  </style>
                </defs>
                <foreignObject x="0" y="0" width={svgWidth} height={svgHeight}>
                  <div 
                    className="slide-bg" 
                    style={{ 
                      width: `${svgWidth}px`, 
                      height: `${svgHeight}px`, 
                      boxSizing: "border-box", 
                      display: "flex", 
                      flexDirection: "column", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: `${Math.round(80 * scaleMultiplier)}px 80px`,
                      position: "relative"
                    }}
                  >
                    {renderBgPatternMarkup(String(sIdx), styles)}
                    
                    {/* Header Brand Overlay */}
                    {showHandle && (
                      <div className="slide-header" style={{ paddingBottom: `${Math.round(20 * scaleMultiplier)}px` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <div 
                            style={{ 
                              height: `${Math.round(36 * scaleMultiplier)}px`, 
                              width: `${Math.round(36 * scaleMultiplier)}px`, 
                              borderRadius: "50%", 
                              background: styles.accentColor, 
                              color: theme === "cream" ? "#ffffff" : "#000000",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: `${Math.round(16 * scaleMultiplier)}px`
                            }}
                          >
                            {brandName[0] || "G"}
                          </div>
                          <span style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px`, fontWeight: 900, color: styles.brandColor, textTransform: "uppercase" }}>
                            {brandName}
                          </span>
                        </div>
                        <span style={{ fontSize: `${Math.round(16 * scaleMultiplier)}px`, fontWeight: 700, color: styles.brandColor, opacity: 0.6 }}>
                          {instagramHandle}
                        </span>
                      </div>
                    )}
 
                    {/* Dynamic layouts */}
                    <div style={{ width: "100%", zIndex: 10, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      
                      {slide.layout === "title-only" && (
                        <div style={{ width: "100%" }}>
                          <h1 className="slide-title">{slide.title}</h1>
                          <p className="slide-subtitle">{slide.subtitle}</p>
                        </div>
                      )}
 
                      {slide.layout === "bullets" && (
                        slide.imageEnabled ? (
                          slide.imageLayout === "centered" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: `${Math.round(24 * scaleMultiplier)}px`, width: "100%" }}>
                              <h2 className="slide-title" style={{ fontSize: `${Math.round(38 * scaleMultiplier)}px`, textAlign: "left", marginBottom: "0px" }}>
                                {slide.title}
                              </h2>
                              {renderImageOrSvgMarkup(slide, "rounded-2xl border border-white/10", { width: "100%", height: `${Math.round(300 * scaleMultiplier)}px`, objectFit: "cover" }, `${Math.round(300 * scaleMultiplier)}px`)}
                              <ul className="slide-bullets" style={{ marginTop: "0px" }}>
                                {slide.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="slide-bullet-item" style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px`, display: "flex", gap: `${Math.round(15 * scaleMultiplier)}px`, alignItems: "flex-start", marginBottom: `${Math.round(12 * scaleMultiplier)}px` }}>
                                    <span className="slide-bullet-icon" style={{ color: styles.bulletIconColor }}>✔</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: `${Math.round(30 * scaleMultiplier)}px`, alignItems: "center", width: "100%" }}>
                              {slide.imageLayout === "split-left" ? (
                                <>
                                  <div style={{ width: "40%", flexShrink: 0 }}>
                                    {renderImageOrSvgMarkup(slide, "rounded-2xl border border-white/10", { width: "100%", height: `${Math.round(420 * scaleMultiplier)}px`, objectFit: "cover" }, `${Math.round(420 * scaleMultiplier)}px`)}
                                  </div>
                                  <div style={{ width: "60%", flexGrow: 1 }}>
                                    <h2 className="slide-title" style={{ fontSize: `${Math.round(36 * scaleMultiplier)}px`, textAlign: "left", marginBottom: `${Math.round(15 * scaleMultiplier)}px` }}>
                                      {slide.title}
                                    </h2>
                                    <ul className="slide-bullets" style={{ marginTop: "0px" }}>
                                      {slide.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} className="slide-bullet-item" style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px`, display: "flex", gap: `${Math.round(15 * scaleMultiplier)}px`, alignItems: "flex-start", marginBottom: `${Math.round(12 * scaleMultiplier)}px` }}>
                                          <span className="slide-bullet-icon" style={{ color: styles.bulletIconColor }}>✔</span>
                                          <span>{bullet}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ width: "60%", flexGrow: 1 }}>
                                    <h2 className="slide-title" style={{ fontSize: `${Math.round(36 * scaleMultiplier)}px`, textAlign: "left", marginBottom: `${Math.round(15 * scaleMultiplier)}px` }}>
                                      {slide.title}
                                    </h2>
                                    <ul className="slide-bullets" style={{ marginTop: "0px" }}>
                                      {slide.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx} className="slide-bullet-item" style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px`, display: "flex", gap: `${Math.round(15 * scaleMultiplier)}px`, alignItems: "flex-start", marginBottom: `${Math.round(12 * scaleMultiplier)}px` }}>
                                          <span className="slide-bullet-icon" style={{ color: styles.bulletIconColor }}>✔</span>
                                          <span>{bullet}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div style={{ width: "40%", flexShrink: 0 }}>
                                    {renderImageOrSvgMarkup(slide, "rounded-2xl border border-white/10", { width: "100%", height: `${Math.round(420 * scaleMultiplier)}px`, objectFit: "cover" }, `${Math.round(420 * scaleMultiplier)}px`)}
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        ) : (
                          <div style={{ width: "100%" }}>
                            <h2 className="slide-title" style={{ fontSize: `${Math.round(42 * scaleMultiplier)}px`, textAlign: "left" }}>{slide.title}</h2>
                            <p className="slide-subtitle" style={{ fontSize: `${Math.round(22 * scaleMultiplier)}px`, textAlign: "left", opacity: 0.8, marginBottom: `${Math.round(30 * scaleMultiplier)}px` }}>{slide.subtitle}</p>
                            <ul className="slide-bullets">
                              {slide.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="slide-bullet-item" style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px` }}>
                                  <span className="slide-bullet-icon">✔</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
 
                      {slide.layout === "quote" && (
                        <div className="slide-quote-box">
                          <p className="slide-quote-text" style={{ fontSize: `${Math.round(32 * scaleMultiplier)}px` }}>"{slide.subtitle}"</p>
                          <p className="slide-quote-author" style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px` }}>— {slide.quoteAuthor || "Quote Author"}</p>
                        </div>
                      )}
 
                      {slide.layout === "cta" && (
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <div 
                            style={{ 
                              height: `${Math.round(64 * scaleMultiplier)}px`, 
                              width: `${Math.round(64 * scaleMultiplier)}px`, 
                              borderRadius: `${Math.round(20 * scaleMultiplier)}px`, 
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: `0 auto ${Math.round(30 * scaleMultiplier)}px auto`,
                              color: styles.brandColor
                            }}
                          >
                            <svg width={Math.round(32 * scaleMultiplier)} height={Math.round(32 * scaleMultiplier)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                          </div>
                          <h1 className="slide-title" style={{ fontSize: `${Math.round(52 * scaleMultiplier)}px` }}>{slide.title}</h1>
                          <p className="slide-subtitle" style={{ fontSize: `${Math.round(22 * scaleMultiplier)}px`, marginBottom: `${Math.round(40 * scaleMultiplier)}px` }}>{slide.subtitle}</p>
                          <div 
                            style={{ 
                              display: "inline-block", 
                              padding: `${Math.round(16 * scaleMultiplier)}px ${Math.round(36 * scaleMultiplier)}px`, 
                              borderRadius: `${Math.round(16 * scaleMultiplier)}px`, 
                              background: styles.accentColor, 
                              color: theme === "cream" ? "#ffffff" : "#000000",
                              fontSize: `${Math.round(18 * scaleMultiplier)}px`, 
                              fontWeight: 900, 
                              letterSpacing: "2px", 
                              textTransform: "uppercase" 
                            }}
                          >
                            SWIPE LEFT TO FOLLOW
                          </div>
                        </div>
                      )}
 
                    </div>
 
                    {/* Footer brand / paging overlay */}
                    <div className="slide-footer">
                      <span style={{ fontSize: `${Math.round(16 * scaleMultiplier)}px`, fontWeight: 900, color: styles.brandColor, opacity: 0.6, letterSpacing: "1px" }}>
                        {slide.layout === "cta" ? "SAVE THIS POST" : "SWIPE LEFT ➔"}
                      </span>
                      {showPageNumber && (
                        <span style={{ fontSize: `${Math.round(20 * scaleMultiplier)}px`, fontWeight: 900, fontStyle: "italic", color: styles.brandColor, opacity: 0.7 }}>
                          {String(sIdx + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
                        </span>
                      )}
                    </div>
 
                    {/* Progress Bar Line */}
                    {showProgressBar && (
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill" style={{ width: `${((sIdx + 1) / slides.length) * 100}%` }} />
                      </div>
                    )}
 
                  </div>
                </foreignObject>
              </svg>
            );
          })}
        </div>
 
      </div>
    </div>
  );
}
