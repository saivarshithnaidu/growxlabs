"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Download, Edit3, Image as ImageIcon, Plus, Trash2, 
  Palette, Play, Pause, RotateCw, Info, Check, ArrowRight, AlertCircle, Video
} from "lucide-react";
import { toast } from "sonner";

interface Scene {
  sceneNumber: number;
  title: string;
  content: string;
  imagePrompt: string;
  svgCode: string;
  duration: number;
}

export function ReelsGeneratorClient() {
  // Content state
  const [topic, setTopic] = useState("Explain how Rapido uses the same OTP for rides");
  const [tone, setTone] = useState<"Hype" | "Professional" | "Casual" | "Technical" | "Minimalist">("Technical");
  const [sceneCount, setSceneCount] = useState(5);
  const [scenes, setScenes] = useState<Scene[]>([
    {
      sceneNumber: 1,
      title: "Why Rapido Uses The Same OTP",
      content: "Most ride apps change OTPs every ride. Rapido does something completely different.",
      imagePrompt: "Vector illustration of a smartphone screen showing OTP verification code 9999, clean tech graphic",
      svgCode: `<svg viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="phoneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#39ff14" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect x="100" y="50" width="200" height="300" rx="30" fill="url(#phoneGlow)" stroke="#39ff14" stroke-width="4"/>
        <rect x="120" y="100" width="160" height="80" rx="10" fill="#18212c" stroke="#39ff14" stroke-width="1.5"/>
        <text x="200" y="145" fill="#39ff14" font-family="monospace" font-size="28" font-weight="bold" text-anchor="middle">OTP: 5555</text>
        <circle cx="200" cy="325" r="15" fill="none" stroke="#39ff14" stroke-width="2"/>
      </svg>`,
      duration: 5
    },
    {
      sceneNumber: 2,
      title: "The Common Standard",
      content: "Usually, booking systems request new dynamic OTPs to verify riders and prevent spoofing.",
      imagePrompt: "Abstract flow chart showing server sending different OTP keys to riders, dark terminal visual style",
      svgCode: `<svg viewBox="0 0 400 400" width="100%" height="100%">
        <path d="M 50 200 L 150 200 M 250 200 L 350 200" stroke="#8892b0" stroke-width="3" stroke-dasharray="8 4"/>
        <rect x="150" y="160" width="100" height="80" rx="10" fill="#18212c" stroke="#8892b0" stroke-width="2"/>
        <text x="200" y="205" fill="#8892b0" font-family="monospace" font-size="14" text-anchor="middle">OTP GENERATOR</text>
      </svg>`,
      duration: 5
    },
    {
      sceneNumber: 3,
      title: "Rapido's Static Bypass",
      content: "By keeping the OTP constant, Rapido bypasses SMS delivery latency and saves carrier costs.",
      imagePrompt: "Minimal network database server sending speed lanes directly to mobile devices, speed vectors, glowing green",
      svgCode: `<svg viewBox="0 0 400 400" width="100%" height="100%">
        <rect x="50" y="120" width="300" height="160" rx="20" fill="none" stroke="#39ff14" stroke-dasharray="10 5" stroke-width="2"/>
        <circle cx="120" cy="200" r="30" fill="#18212c" stroke="#39ff14" stroke-width="3"/>
        <circle cx="280" cy="200" r="30" fill="#18212c" stroke="#39ff14" stroke-width="3"/>
        <path d="M 150 200 L 250 200" stroke="#39ff14" stroke-width="4"/>
        <text x="200" y="185" fill="#39ff14" font-family="monospace" font-size="16" text-anchor="middle">FAST SYNC</text>
      </svg>`,
      duration: 5
    },
    {
      sceneNumber: 4,
      title: "Is it Secure?",
      content: "They rely on background GPS matching. The ride only starts if both devices are side-by-side.",
      imagePrompt: "Smartphone interface displaying maps with proximity nodes connecting together, minimal tech interface",
      svgCode: `<svg viewBox="0 0 400 400" width="100%" height="100%">
        <circle cx="200" cy="200" r="120" fill="none" stroke="#39ff14" stroke-opacity="0.2" stroke-width="2"/>
        <circle cx="200" cy="200" r="80" fill="none" stroke="#39ff14" stroke-opacity="0.4" stroke-width="2"/>
        <circle cx="160" cy="180" r="10" fill="#39ff14"/>
        <circle cx="240" cy="220" r="10" fill="#39ff14"/>
        <path d="M 160 180 Q 200 200 240 220" fill="none" stroke="#39ff14" stroke-width="2" stroke-dasharray="4"/>
      </svg>`,
      duration: 5
    },
    {
      sceneNumber: 5,
      title: "Save For Later",
      content: "Follow for more product breakdowns and architectural systems analysis.",
      imagePrompt: "Tech logo card displaying profile details, save icon glowing neon border, sleek dark card",
      svgCode: `<svg viewBox="0 0 400 400" width="100%" height="100%">
        <rect x="80" y="80" width="240" height="240" rx="20" fill="#090c0f" stroke="#39ff14" stroke-width="3"/>
        <path d="M 170 140 L 230 140 L 230 240 L 200 220 L 170 240 Z" fill="#39ff14"/>
        <text x="200" y="280" fill="#39ff14" font-family="monospace" font-size="16" text-anchor="middle">FOLLOW FOR MORE</text>
      </svg>`,
      duration: 5
    }
  ]);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");

  // Styling state
  const [themePreset, setThemePreset] = useState<"cyberpunk" | "cream" | "sunset" | "terminal" | "glass" | "emerald" | "minimal" | "gold">("terminal");
  const [visualMode, setVisualMode] = useState<"svg" | "image">("svg");
  const [brandName, setBrandName] = useState("GrowXLabs");
  const [instagramHandle, setInstagramHandle] = useState("@growxlabs.tech");

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Cumulative time in ms
  const [activeIndex, setActiveIndex] = useState(0); // Current active scene index
  const [sceneElapsedTime, setSceneElapsedTime] = useState(0); // Ms elapsed in current scene

  // Video recording states
  const [isRecording, setIsRecording] = useState(false);

  // Auto-calculated timelines
  const getTimeline = () => {
    let cumulative = 0;
    return scenes.map((scene) => {
      const start = cumulative;
      const end = cumulative + (scene.duration * 1000);
      cumulative = end;
      return { ...scene, start, end };
    });
  };

  const timeline = getTimeline();
  const totalDurationMs = timeline.length > 0 ? timeline[timeline.length - 1].end : 0;

  // Active scene selection
  const activeScene = scenes[activeIndex] || scenes[0] || {
    title: "",
    content: "",
    imagePrompt: "",
    svgCode: "",
    duration: 5
  };

  // Synchronize playback timeline
  useEffect(() => {
    // Find active scene based on currentTime
    const foundIndex = timeline.findIndex(
      (s) => currentTime >= s.start && currentTime < s.end
    );
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
      setSceneElapsedTime(currentTime - timeline[foundIndex].start);
    } else if (currentTime >= totalDurationMs && totalDurationMs > 0) {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveIndex(0);
      setSceneElapsedTime(0);
    }
  }, [currentTime, totalDurationMs]);

  // Playback Timer loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= totalDurationMs) {
          setIsPlaying(false);
          return totalDurationMs;
        }
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, totalDurationMs]);

  // API Call to Generate Reels Content
  const handleGenerateReel = async () => {
    setIsGenerating(true);
    setStreamBuffer("");
    const apiToast = toast.loading("Connecting to Gemini 2.5 Flash...");

    try {
      const response = await fetch("/api/generate-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, sceneCount })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate: ${response.statusText}`);
      }

      toast.loading("Compiling Reels timeline...", { id: apiToast });
      
      let reader = null;
      try {
        reader = response.body ? response.body.getReader() : null;
      } catch (err) {
        console.warn("Streaming reader not available for Reels, falling back to full text reading:", err);
      }

      if (!reader) {
        const text = await response.text();
        setStreamBuffer(text);
        const finalJson = JSON.parse(text);
        if (finalJson.scenes && Array.isArray(finalJson.scenes)) {
          setScenes(finalJson.scenes);
          if (finalJson.themeSuggestion) {
            setThemePreset(finalJson.themeSuggestion.toLowerCase() as any);
          }
          setCurrentTime(0);
          setIsPlaying(false);
          toast.success("Reels content generated successfully!", { id: apiToast });
        } else {
          throw new Error("Invalid format received from server");
        }
      } else {
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          buffer += textChunk;
          setStreamBuffer(buffer);
        }

        // Final parse
        const finalJson = JSON.parse(buffer);
        if (finalJson.scenes && Array.isArray(finalJson.scenes)) {
          setScenes(finalJson.scenes);
          if (finalJson.themeSuggestion) {
            setThemePreset(finalJson.themeSuggestion.toLowerCase() as any);
          }
          setCurrentTime(0);
          setIsPlaying(false);
          toast.success("Reels content generated successfully!", { id: apiToast });
        } else {
          throw new Error("Invalid format received from server");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to compile Reels timeline.", { id: apiToast });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get active styling configs
  const getThemeColors = () => {
    switch (themePreset) {
      case "cyberpunk":
        return {
          bg: "#05050a",
          bgImage: "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.25) 0%, transparent 60%)",
          brandColor: "#06b6d4",
          accentColor: "#9333ea",
          titleColor: "#06b6d4",
          textColor: "#ffffff",
          textHighlightColor: "#39ff14", // Neon Green caption pop
          cardBg: "rgba(10,10,20,0.6)"
        };
      case "cream":
        return {
          bg: "#F9F6F0",
          bgImage: "none",
          brandColor: "#5c554c",
          accentColor: "#8c8273",
          titleColor: "#1c1a17",
          textColor: "#5c554c",
          textHighlightColor: "#8c8273",
          cardBg: "#f2ede4"
        };
      case "sunset":
        return {
          bg: "#1a0b2e",
          bgImage: "linear-gradient(to bottom, #FF512F 0%, #DD2476 100%)",
          brandColor: "#ffffff",
          accentColor: "#ffffff",
          titleColor: "#ffffff",
          textColor: "#ffffff",
          textHighlightColor: "#ffecd2",
          cardBg: "rgba(255,255,255,0.06)"
        };
      case "terminal":
      default:
        return {
          bg: "#090c0f",
          bgImage: "linear-gradient(rgba(24, 33, 44, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(24, 33, 44, 0.4) 1px, transparent 1px)",
          brandColor: "#39ff14",
          accentColor: "#8892b0",
          titleColor: "#39ff14",
          textColor: "#a8b2d1",
          textHighlightColor: "#ffffff",
          cardBg: "#18212c"
        };
      case "glass":
        return {
          bg: "#03001e",
          bgImage: "radial-gradient(circle at 50% 50%, #4a0072 0%, #03001e 85%)",
          brandColor: "#a5f3fc",
          accentColor: "#c084fc",
          titleColor: "#ffffff",
          textColor: "#e2e8f0",
          textHighlightColor: "#39ff14",
          cardBg: "rgba(255,255,255,0.05)"
        };
      case "emerald":
        return {
          bg: "#041611",
          bgImage: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          brandColor: "#10b981",
          accentColor: "#34d399",
          titleColor: "#10b981",
          textColor: "#e2e8f0",
          textHighlightColor: "#34d399",
          cardBg: "rgba(10,30,25,0.6)"
        };
      case "minimal":
        return {
          bg: "#ffffff",
          bgImage: "none",
          brandColor: "#0a0a0a",
          accentColor: "#404040",
          titleColor: "#0a0a0a",
          textColor: "#404040",
          textHighlightColor: "#000000",
          cardBg: "#f5f5f5"
        };
      case "gold":
        return {
          bg: "#0a0907",
          bgImage: "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)",
          brandColor: "#d4af37",
          accentColor: "#f59e0b",
          titleColor: "#d4af37",
          textColor: "#f3f4f6",
          textHighlightColor: "#ffffff",
          cardBg: "#1a1610"
        };
    }
  };

  const themeColors = getThemeColors();

  // Word-by-word Caption Calculation
  const renderWordCaptions = () => {
    if (!activeScene.content) return null;
    const words = activeScene.content.split(" ");
    const totalWords = words.length;
    const durationMs = activeScene.duration * 1000;
    const msPerWord = durationMs / totalWords;
    const activeWordIndex = Math.floor(sceneElapsedTime / msPerWord);

    return (
      <div className="flex flex-wrap justify-center text-center px-4 leading-relaxed font-semibold">
        {words.map((word, index) => {
          const isActive = index === activeWordIndex;
          return (
            <span
              key={index}
              className="inline-block mx-1.5 transition-all duration-200 transform"
              style={{
                color: isActive ? themeColors.textHighlightColor : `${themeColors.textColor}99`,
                fontSize: isActive ? "15px" : "13.5px",
                fontWeight: isActive ? 900 : 500,
                textShadow: isActive ? `0 0 10px ${themeColors.textHighlightColor}40` : "none",
                scale: isActive ? "1.08" : "1.0"
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  // Modify active scene details
  const updateActiveScene = (updatedFields: Partial<Scene>) => {
    const updatedScenes = [...scenes];
    updatedScenes[activeIndex] = { ...activeScene, ...updatedFields };
    setScenes(updatedScenes);
  };

  // Export static high-res files (ZIP / SVGs)
  const handleDownloadSVG = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([activeScene.svgCode], { type: "image/svg+xml" });
      element.href = URL.createObjectURL(file);
      element.download = `reel-scene-${activeIndex + 1}.svg`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success(`Scene ${activeIndex + 1} SVG downloaded.`);
    } catch (e) {
      toast.error("Failed to export SVG.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Settings Panel (Left 7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Step 1: AI Prompt Input */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Generate Reel Timeline</h3>
              <p className="text-xs text-neutral-500">Provide your topic and let Gemini create a playable Reels storyboard.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Topic / Core Theme</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                placeholder="e.g. Stop using static variables in Java..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
                >
                  <option value="Hype">Hype (Energetic & Punchy)</option>
                  <option value="Professional">Professional (Educational)</option>
                  <option value="Casual">Casual (Friendly)</option>
                  <option value="Technical">Technical (Detailed Systems)</option>
                  <option value="Minimalist">Minimalist (Stark Ideas)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Scene Count</label>
                <select
                  value={sceneCount}
                  onChange={(e) => setSceneCount(Number(e.target.value))}
                  className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
                >
                  <option value="3">3 Scenes (Short)</option>
                  <option value="5">5 Scenes (Standard)</option>
                  <option value="7">7 Scenes (Long)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateReel}
              disabled={isGenerating}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RotateCw size={14} className="animate-spin" />
                  Generating via Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Compile with Gemini 2.5 Flash
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Streaming Widget */}
        {isGenerating && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Streaming Tokens</span>
            </div>
            <div className="w-full h-24 bg-neutral-950 border border-neutral-900 rounded-xl p-3 font-mono text-[10px] text-primary overflow-y-auto custom-scrollbar">
              {streamBuffer || "Waiting for first token..."}
            </div>
          </div>
        )}

        {/* Step 2: Scene Editor */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Edit Active Scene ({activeIndex + 1}/{scenes.length})</h3>
              <p className="text-xs text-neutral-500">Fine-tune the scripts, durations, image prompts, or vector code.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Scene Title</label>
              <input
                type="text"
                value={activeScene.title}
                onChange={(e) => updateActiveScene({ title: e.target.value })}
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Caption Content (Spoken Script)</label>
                <textarea
                  value={activeScene.content}
                  onChange={(e) => updateActiveScene({ content: e.target.value })}
                  className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Descriptive Image Prompt</label>
                <textarea
                  value={activeScene.imagePrompt}
                  onChange={(e) => updateActiveScene({ imagePrompt: e.target.value })}
                  className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Display Duration (Seconds)</label>
                <input
                  type="number"
                  min="2"
                  max="15"
                  value={activeScene.duration}
                  onChange={(e) => updateActiveScene({ duration: Number(e.target.value) })}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Visual Styling theme</label>
                <select
                  value={themePreset}
                  onChange={(e) => setThemePreset(e.target.value as any)}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
                >
                  <option value="cyberpunk">Cyberpunk Neon</option>
                  <option value="cream">Cream Aesthetics</option>
                  <option value="sunset">Sunset Gradient</option>
                  <option value="terminal">Terminal Code</option>
                  <option value="glass">Glassmorphic Glow</option>
                  <option value="emerald">Emerald Clean Energy</option>
                  <option value="minimal">Minimal Contrast</option>
                  <option value="gold">Gold Luxury</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Vector SVG Code</label>
              <textarea
                value={activeScene.svgCode}
                onChange={(e) => updateActiveScene({ svgCode: e.target.value })}
                className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-[10px] text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Vertical Player Panel (Right 5 Cols) */}
      <div className="lg:col-span-5 flex flex-col items-center space-y-6">
        
        {/* Toggle Visual Mode */}
        <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl flex gap-1.5 w-full max-w-[320px]">
          <button
            onClick={() => setVisualMode("svg")}
            className={`flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              visualMode === "svg" ? "bg-primary text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            SVG Vector
          </button>
          <button
            onClick={() => setVisualMode("image")}
            className={`flex-1 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              visualMode === "image" ? "bg-primary text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            AI Image
          </button>
        </div>

        {/* 9:16 vertical video player mockup */}
        <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[36px] overflow-hidden border border-neutral-800 shadow-2xl bg-black flex flex-col justify-between p-6 select-none relative box-border">
          
          {/* Background container */}
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              backgroundColor: themeColors.bg,
              backgroundImage: themeColors.bgImage,
              backgroundSize: "40px 40px"
            }}
          />

          {/* Top Story/Reels Indicators */}
          <div className="absolute top-4 left-6 right-6 flex gap-1 z-20">
            {scenes.map((scene, index) => {
              // Calculate completion bar widths
              let fillPercent = 0;
              if (index < activeIndex) fillPercent = 100;
              else if (index === activeIndex) fillPercent = (sceneElapsedTime / (scene.duration * 1000)) * 100;

              return (
                <div key={index} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Header Layout Info */}
          <div className="w-full flex items-center justify-between border-b pb-2.5 z-10 mt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <div 
                className="h-7 w-7 rounded-full flex items-center justify-center font-black text-[10px]"
                style={{ background: themeColors.accentColor, color: themePreset === "cream" ? "#ffffff" : "#000000" }}
              >
                {brandName[0]}
              </div>
              <span className="text-[10px] font-black tracking-tight" style={{ color: themeColors.brandColor }}>
                {brandName}
              </span>
            </div>
            <span className="text-[8px] font-bold opacity-60" style={{ color: themeColors.brandColor }}>
              {instagramHandle}
            </span>
          </div>

          {/* Graphic Visualization Area */}
          <div className="flex-1 flex flex-col justify-center items-center w-full py-4 z-10 overflow-hidden">
            {visualMode === "svg" ? (
              <div 
                className="w-[180px] h-[180px] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: activeScene.svgCode }}
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 relative">
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(activeScene.imagePrompt)}?width=500&height=500&nologo=true`}
                  alt="AI Scene visual fallback"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Text/Captions Area */}
          <div className="w-full space-y-4 z-10 mb-2">
            <h2 
              className="text-center font-black leading-tight uppercase italic tracking-tighter"
              style={{ color: themeColors.titleColor, fontSize: "17px" }}
            >
              {activeScene.title}
            </h2>
            
            {/* Word by word animated text */}
            <div className="min-h-[50px] flex items-center justify-center">
              {renderWordCaptions()}
            </div>
          </div>

          {/* Brand/Swipe Footer */}
          <div className="w-full flex items-center justify-between border-t pt-2.5 z-10" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-[8px] font-black tracking-wider opacity-50 uppercase" style={{ color: themeColors.brandColor }}>
              {activeIndex === scenes.length - 1 ? "SAVE THIS POST" : "SWIPE LEFT ➔"}
            </span>
            <span className="text-[9px] font-black italic opacity-60" style={{ color: themeColors.brandColor }}>
              {String(activeIndex + 1).padStart(2, '0')}/{String(scenes.length).padStart(2, '0')}
            </span>
          </div>

        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-3 w-full max-w-[320px]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-neutral-800"
          >
            {isPlaying ? (
              <>
                <Pause size={14} fill="white" />
                Pause Playback
              </>
            ) : (
              <>
                <Play size={14} fill="white" />
                Play Timeline
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadSVG}
            title="Download Active Scene SVG"
            className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 transition-all"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Recording Alert / Instructions */}
        <div className="w-full max-w-[320px] bg-neutral-900/50 border border-neutral-800/80 p-4 rounded-2xl text-[10px] text-neutral-400 space-y-2 leading-relaxed">
          <div className="flex items-center gap-1.5 text-primary font-black uppercase tracking-wider">
            <Info size={14} />
            <span>Internal Usage Note</span>
          </div>
          <p>
            To compile this preview timeline into a Reels video, click **Play Timeline** and use your local screen capture software (OBS, Canva, or CapCut) to record the animated 9:16 mockup instantly.
          </p>
        </div>

      </div>

    </div>
  );
}
