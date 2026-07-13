"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Presentation, Sparkles, Download, ChevronLeft, ChevronRight, 
  Play, Mail, Phone, Globe, Loader2, Lightbulb, 
  Settings, Key, Trophy, PieChart, ShieldAlert, CheckCircle2,
  XCircle, Edit3, Eye, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/marketing/Reveal";

export default function PitchDeckGenPage() {
  const [outlineText, setOutlineText] = useState("");
  const [companyName, setCompanyName] = useState("Thynk Unlimited");
  const [presenterName, setPresenterName] = useState("Alfredo Torres");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [deckData, setDeckData] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlineText.trim()) {
      showToast("Please enter a business outline or description first", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pitch-deck/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessDescription: outlineText,
          companyName,
          presenterName
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate pitch deck");
      }

      setDeckData(data);
      setCurrentSlideIndex(0);
      showToast("Investor Pitch Deck generated successfully! ✨", "success");
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "An error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const updateSlideData = (slideKey: string, field: string, value: any) => {
    if (!deckData) return;
    setDeckData((prev: any) => ({
      ...prev,
      [slideKey]: {
        ...prev[slideKey],
        [field]: value
      }
    }));
  };

  const updateArrayField = (slideKey: string, field: string, index: number, value: string) => {
    if (!deckData) return;
    const currentArray = [...deckData[slideKey][field]];
    currentArray[index] = value;
    updateSlideData(slideKey, field, currentArray);
  };

  // Renders a specific slide card based on index
  const renderSlideContent = (index: number) => {
    if (!deckData) return null;

    const themeBg = "bg-black text-white font-sans relative select-none overflow-hidden border border-neutral-900 rounded-2xl";
    const borderCard = "bg-neutral-950/40 border border-neutral-900 rounded-lg p-6 relative overflow-hidden transition-all duration-300";
    const headerTitle = "text-3xl font-light tracking-tight text-white uppercase";
    const monoLabel = "text-[9px] font-mono tracking-widest text-neutral-500 uppercase";

    switch (index) {
      case 0: // Cover
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg} relative`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">{deckData.slide1.companyName}</span>
              <span className="text-[10px] font-mono text-neutral-500 tracking-wider">{deckData.slide1.date}</span>
            </div>

            <div className="space-y-6 text-left my-auto max-w-3xl">
              <h1 className="text-5xl font-extralight tracking-tight uppercase leading-[1.1] text-white">
                {deckData.slide1.title}
              </h1>
              <div className="h-[1px] w-20 bg-neutral-800" />
              <div className="flex flex-wrap gap-2">
                {deckData.slide1.badges.map((b: string, i: number) => (
                  <span key={i} className="px-3 py-1 border border-neutral-800 text-neutral-400 text-[9px] font-mono uppercase rounded">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-neutral-950">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">{deckData.slide1.companyName}</span>
              </div>
              <div className="text-right">
                <span className={monoLabel}>Presented By</span>
                <p className="text-xs font-semibold text-neutral-300 mt-1">{deckData.slide1.presenter}</p>
              </div>
            </div>
          </div>
        );

      case 1: // Company Overview
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <div className="flex justify-between items-start">
              <h2 className={headerTitle}>{deckData.slide2.title}</h2>
              <span className="text-[10px] font-mono text-neutral-500">EST. 2025</span>
            </div>

            <div className="grid grid-cols-2 gap-8 my-auto">
              <div className={borderCard}>
                <p className={monoLabel}>About Us</p>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal mt-3">
                  {deckData.slide2.aboutUs}
                </p>
              </div>
              <div className={borderCard}>
                <p className={monoLabel}>Key Strengths</p>
                <div className="space-y-2.5 mt-4">
                  {deckData.slide2.keyStrengths.map((str: string, idx: number) => (
                    <div key={idx} className="text-xs font-normal text-neutral-300 flex items-center gap-2">
                      <span className="font-mono text-neutral-600 text-[10px]">0{idx+1}.</span>
                      {str}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>{deckData.slide1.companyName} Overview</span>
              <span>Slide 02</span>
            </div>
          </div>
        );

      case 2: // The Problem
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <div className="flex justify-between items-start">
              <h2 className={headerTitle}>{deckData.slide3.title}</h2>
              <span className="text-[10px] font-mono text-neutral-500">EST. 2025</span>
            </div>

            <div className="grid grid-cols-2 gap-8 my-auto">
              <div className={borderCard}>
                <p className={monoLabel}>Market Challenges</p>
                <div className="space-y-3 mt-4">
                  {deckData.slide3.challenges.map((c: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-normal text-neutral-300">
                      <span className="h-2 w-2 rounded-full bg-neutral-800 border border-neutral-700" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={borderCard}>
                <p className={monoLabel}>Context & Impact</p>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal mt-3">
                  {deckData.slide3.problemDescription}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Identifying Market Friction</span>
              <span>Slide 03</span>
            </div>
          </div>
        );

      case 4: // Our Solution
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <div className="flex justify-between items-start">
              <h2 className={headerTitle}>{deckData.slide4.title}</h2>
              <span className="text-[10px] font-mono text-neutral-500">EST. 2025</span>
            </div>

            <div className="grid grid-cols-5 gap-8 my-auto items-center">
              <div className={`${borderCard} col-span-2 flex flex-col items-start p-8`}>
                <span className="font-mono text-xs text-neutral-600 mb-2">04.</span>
                <p className="text-xs text-neutral-300 font-bold uppercase tracking-wider">Automated Architecture</p>
                <p className="text-[10px] text-neutral-500 mt-2">Engineered for robust and rapid scaling.</p>
              </div>
              <div className={`${borderCard} col-span-3 space-y-4`}>
                <p className="text-xs font-normal text-neutral-400 italic">"{deckData.slide4.subtitle}"</p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {deckData.slide4.solutions.map((s: string, idx: number) => (
                    <div key={idx} className="p-3 border border-neutral-900 bg-neutral-950/20 rounded text-xs font-bold text-neutral-300 flex items-center">
                      <span className="h-1 w-1 bg-neutral-500 mr-2" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Resolving Market Challenges</span>
              <span>Slide 04</span>
            </div>
          </div>
        );

      case 5: // Market Opportunity
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <div className="flex justify-between items-start">
              <h2 className={headerTitle}>{deckData.slide5.title}</h2>
              <span className="text-[10px] font-mono text-neutral-500">EST. 2025</span>
            </div>

            <div className="grid grid-cols-2 gap-8 my-auto">
              <div className={borderCard}>
                <p className={monoLabel}>Market Context</p>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal mt-3">
                  {deckData.slide5.marketDescription}
                </p>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-neutral-900 bg-neutral-950/20 rounded">
                    <p className={monoLabel}>TAM</p>
                    <p className="text-xs font-bold text-neutral-300 mt-1">{deckData.slide5.tam}</p>
                  </div>
                  <div className="p-3 border border-neutral-900 bg-neutral-950/20 rounded">
                    <p className={monoLabel}>SAM</p>
                    <p className="text-xs font-bold text-neutral-300 mt-1">{deckData.slide5.sam}</p>
                  </div>
                </div>
                <div className="p-3 border border-neutral-900 bg-neutral-950/20 rounded">
                  <p className={monoLabel}>MARKET DRIVERS</p>
                  <p className="text-xs font-bold text-neutral-300 mt-1">{deckData.slide5.drivers}</p>
                </div>
                <div className="p-3 border border-neutral-800 bg-neutral-900/30 rounded">
                  <p className="text-[8px] font-mono tracking-widest text-neutral-300 uppercase">KEY INSIGHT</p>
                  <p className="text-xs font-bold text-white mt-1">{deckData.slide5.insight}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>TAM / SAM & Drivers</span>
              <span>Slide 05</span>
            </div>
          </div>
        );

      case 6: // Business Model
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <h2 className={headerTitle}>{deckData.slide6.title}</h2>
            
            <div className="space-y-6 my-auto">
              <p className="text-xs font-mono text-neutral-500 text-center uppercase tracking-widest">{deckData.slide6.subtitle}</p>
              <div className="grid grid-cols-3 gap-6">
                {deckData.slide6.models.map((m: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`${borderCard} flex flex-col justify-between h-36`}
                  >
                    <div className="text-3xl font-light text-neutral-800 font-mono">{m.id}.</div>
                    <p className="text-xs font-normal text-neutral-400 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Monetization & Pricing Strategy</span>
              <span>Slide 06</span>
            </div>
          </div>
        );

      case 7: // Key Product Features
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <h2 className={headerTitle}>{deckData.slide7.title}</h2>

            <div className="grid grid-cols-2 gap-8 my-auto">
              <div className="space-y-2">
                {deckData.slide7.features.map((f: string, idx: number) => (
                  <div key={idx} className="p-3 border border-neutral-900 bg-neutral-950/20 rounded text-xs font-normal text-neutral-300 flex items-center gap-3">
                    <span className="font-mono text-neutral-600 text-[10px]">0{idx+1}.</span>
                    {f}
                  </div>
                ))}
              </div>
              <div className={borderCard}>
                <p className={monoLabel}>Capability Outline</p>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal mt-3">
                  {deckData.slide7.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Platform Capability Matrix</span>
              <span>Slide 07</span>
            </div>
          </div>
        );

      case 8: // Competitive Advantage
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <h2 className={headerTitle}>{deckData.slide8.title}</h2>

            <div className="grid grid-cols-2 gap-8 my-auto">
              <div className={borderCard}>
                <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-4">{deckData.slide8.subtitle}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {deckData.slide8.advantages.map((adv: string, idx: number) => (
                    <div key={idx} className="p-3 border border-neutral-900 bg-neutral-950/20 rounded text-[11px] font-normal text-neutral-300 flex items-center">
                      <span className="h-1 w-1 bg-neutral-600 mr-2" />
                      {adv}
                    </div>
                  ))}
                </div>
              </div>
              <div className={borderCard}>
                <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">Our Competitive Moat</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  {deckData.slide8.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Market Defensibility Moat</span>
              <span>Slide 08</span>
            </div>
          </div>
        );

      case 9: // Traction & Growth
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <h2 className={headerTitle}>{deckData.slide9.title}</h2>

            <div className="space-y-6 my-auto">
              <p className="text-xs font-mono text-neutral-500 text-center uppercase tracking-widest">{deckData.slide9.subtitle}</p>
              <div className="grid grid-cols-5 gap-4">
                {deckData.slide9.indicators.map((ind: any, idx: number) => (
                  <div key={idx} className={`${borderCard} flex flex-col justify-between h-36 p-4`}>
                    <div className="text-3xl font-light text-neutral-800 font-mono">{ind.id}.</div>
                    <p className="text-[11px] font-normal text-neutral-400 leading-snug">{ind.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Growth Metrics & Key Milestones</span>
              <span>Slide 09</span>
            </div>
          </div>
        );

      case 10: // Use of Funds & Contact
        return (
          <div className={`w-full h-full flex flex-col justify-between p-16 ${themeBg}`}>
            <h2 className={headerTitle}>{deckData.slide10.title}</h2>

            <div className="grid grid-cols-3 gap-6 my-auto">
              <div className={borderCard}>
                <h3 className="text-[9px] font-mono text-neutral-500 mb-4 uppercase tracking-wider">Allocation</h3>
                <div className="space-y-3.5">
                  {deckData.slide10.funds.map((f: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-normal text-neutral-300">
                        <span>{f.item}</span>
                        <span>{f.percentage}%</span>
                      </div>
                      <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div className="h-full bg-white" style={{ width: `${f.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={borderCard}>
                <h3 className="text-[9px] font-mono text-neutral-500 mb-4 uppercase tracking-wider">Use of Funds Detail</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Capital will be structured to accelerate advanced engineering, scale outbound sales channels, and support research and operations.
                </p>
              </div>
              <div className={`${borderCard} space-y-4`}>
                <h3 className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-normal text-neutral-300">
                    <Phone size={12} className="text-neutral-500" /> {deckData.slide10.contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-normal text-neutral-300">
                    <Mail size={12} className="text-neutral-500" /> {deckData.slide10.contact.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-normal text-neutral-300">
                    <Globe size={12} className="text-neutral-500" /> {deckData.slide10.contact.website}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
              <span>Financial Allocation Plan</span>
              <span>Slide 10</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 pb-20 print:p-0 print:m-0">
      
      {/* Header bar (hidden during print) */}
      <Reveal y={-20} className="print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Presentation className="text-primary" /> Investor Pitch Deck Generator
            </h1>
            <p className="text-white/40 font-medium">Automatically draft and export high-converting pitch deck slides based on business outlines.</p>
          </div>
        </div>
      </Reveal>

      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 border print:hidden ${
            toast.type === "success" 
              ? "bg-green-500/10 border-green-500/20 text-green-400" 
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
          {toast.message}
        </motion.div>
      )}

      {/* Configuration Form (hidden when deck is loaded, hidden during print) */}
      <AnimatePresence>
        {!deckData && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="print:hidden"
          >
            <Card className="p-8 border-white/5 bg-white/[0.02] rounded-2xl">
              <form onSubmit={handleGenerateDeck} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Company / Project Name</label>
                    <input 
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="e.g. Thynk Unlimited"
                      className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Presenter Name</label>
                    <input 
                      type="text"
                      value={presenterName}
                      onChange={(e) => setPresenterName(e.target.value)}
                      required
                      placeholder="e.g. Alfredo Torres"
                      className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Raw business info / outline ("Matter")</label>
                  <textarea 
                    rows={8}
                    required
                    placeholder="Enter what your business does, key strengths, target market, features, business model, or any rough notes here..."
                    value={outlineText}
                    onChange={(e) => setOutlineText(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 text-white text-sm font-medium focus:outline-none focus:border-white/20 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-white text-black hover:bg-neutral-100 font-bold px-8 py-3 h-12 shadow-2xl flex items-center gap-1.5"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing & Generating...</>
                    ) : (
                      <><Sparkles size={16} /> Generate Pitch Deck</>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presentation view / edit interface (hidden during print) */}
      <AnimatePresence>
        {deckData && !presentationMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 print:hidden"
          >
            {/* Top Toolbar controls */}
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setDeckData(null)}
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 text-white/60 text-xs font-bold"
                >
                  ← New Deck
                </Button>
                <span className="text-sm font-bold text-white/80">
                  Slide {currentSlideIndex + 1} of 10
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-xs font-bold ${isEditing ? "bg-green-600 hover:bg-green-500 text-white" : "bg-neutral-800 text-white/70 hover:bg-neutral-700"}`}
                >
                  {isEditing ? <><Eye size={12} className="mr-1.5" /> Preview Mode</> : <><Edit3 size={12} className="mr-1.5" /> Quick Edit</>}
                </Button>
                <Button 
                  onClick={() => setPresentationMode(true)}
                  className="bg-neutral-800 text-white hover:bg-neutral-700 text-xs font-bold"
                >
                  <Play size={12} className="mr-1.5" /> Present
                </Button>
                <Button 
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  <Download size={12} className="mr-1.5" /> Save PDF Presentation
                </Button>
              </div>
            </div>

            {/* Slide interactive preview container */}
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Giant aspect ratio slide view */}
              <div className="lg:col-span-3 space-y-4">
                <div className="aspect-[16/9] w-full border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative bg-black">
                  {renderSlideContent(currentSlideIndex)}
                </div>

                {/* Left/Right navigation */}
                <div className="flex justify-between items-center px-4">
                  <Button 
                    onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="bg-white/5 hover:bg-white/10 text-white"
                  >
                    <ChevronLeft size={16} /> Prev
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          currentSlideIndex === idx ? "w-6 bg-blue-500" : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                  <Button 
                    onClick={() => setCurrentSlideIndex(prev => Math.min(9, prev + 1))}
                    disabled={currentSlideIndex === 9}
                    className="bg-white/5 hover:bg-white/10 text-white"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Sidebar Quick Slide Editor / Selector */}
              <div className="space-y-4">
                <Card className="p-4 border-white/5 bg-white/[0.02] rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Deck Navigation</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`p-3 rounded-lg border text-[10px] font-black uppercase text-left transition-all ${
                          currentSlideIndex === idx 
                            ? "bg-blue-600/10 border-blue-500 text-blue-400" 
                            : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5"
                        }`}
                      >
                        Slide 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Quick Editor Fields panel */}
                {isEditing && (
                  <Card className="p-5 border-white/5 bg-white/[0.02] rounded-xl space-y-4 max-h-80 overflow-y-auto custom-scrollbar text-left">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Edit Slide Content</h3>
                    
                    {currentSlideIndex === 0 && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">Title</label>
                          <input 
                            type="text"
                            value={deckData.slide1.title}
                            onChange={(e) => updateSlideData("slide1", "title", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">Presenter</label>
                          <input 
                            type="text"
                            value={deckData.slide1.presenter}
                            onChange={(e) => updateSlideData("slide1", "presenter", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {currentSlideIndex === 1 && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">About Us Text</label>
                          <textarea 
                            value={deckData.slide2.aboutUs}
                            onChange={(e) => updateSlideData("slide2", "aboutUs", e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white resize-none"
                          />
                        </div>
                        {deckData.slide2.keyStrengths.map((str: string, idx: number) => (
                          <div key={idx}>
                            <label className="text-[9px] font-bold text-white/30 uppercase">Strength {idx + 1}</label>
                            <input 
                              type="text"
                              value={str}
                              onChange={(e) => updateArrayField("slide2", "keyStrengths", idx, e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentSlideIndex === 2 && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">Problem Description</label>
                          <textarea 
                            value={deckData.slide3.problemDescription}
                            onChange={(e) => updateSlideData("slide3", "problemDescription", e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white resize-none"
                          />
                        </div>
                        {deckData.slide3.challenges.map((c: string, idx: number) => (
                          <div key={idx}>
                            <label className="text-[9px] font-bold text-white/30 uppercase">Challenge {idx + 1}</label>
                            <input 
                              type="text"
                              value={c}
                              onChange={(e) => updateArrayField("slide3", "challenges", idx, e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentSlideIndex === 3 && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">Solution Subtitle</label>
                          <input 
                            type="text"
                            value={deckData.slide4.subtitle}
                            onChange={(e) => updateSlideData("slide4", "subtitle", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        {deckData.slide4.solutions.map((s: string, idx: number) => (
                          <div key={idx}>
                            <label className="text-[9px] font-bold text-white/30 uppercase">Solution Pillar {idx + 1}</label>
                            <input 
                              type="text"
                              value={s}
                              onChange={(e) => updateArrayField("slide4", "solutions", idx, e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {currentSlideIndex === 4 && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">Market Context</label>
                          <textarea 
                            value={deckData.slide5.marketDescription}
                            onChange={(e) => updateSlideData("slide5", "marketDescription", e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">TAM</label>
                          <input 
                            type="text"
                            value={deckData.slide5.tam}
                            onChange={(e) => updateSlideData("slide5", "tam", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-white/30 uppercase">SAM</label>
                          <input 
                            type="text"
                            value={deckData.slide5.sam}
                            onChange={(e) => updateSlideData("slide5", "sam", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presentation Fullscreen mode (hidden during print) */}
      <AnimatePresence>
        {presentationMode && deckData && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 print:hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">{deckData.slide1.companyName}</span>
              <button 
                onClick={() => setPresentationMode(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Exit Presentation
              </button>
            </div>

            <div className="aspect-[16/9] w-full max-w-5xl mx-auto border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl bg-black">
              {renderSlideContent(currentSlideIndex)}
            </div>

            <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
              <Button 
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="bg-white/5 hover:bg-white/10 text-white"
              >
                <ChevronLeft size={16} /> Prev
              </Button>
              <span className="text-xs font-bold text-white/40">
                Slide {currentSlideIndex + 1} of 10
              </span>
              <Button 
                onClick={() => setCurrentSlideIndex(prev => Math.min(9, prev + 1))}
                disabled={currentSlideIndex === 9}
                className="bg-white/5 hover:bg-white/10 text-white"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Print rendering area (ONLY visible during print/save to PDF) */}
      {deckData && (
        <div className="hidden print:block w-[100vw] h-[100vh] bg-black">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div 
              key={idx} 
              className="w-[100vw] h-[100vh] overflow-hidden page-break"
              style={{ pageBreakAfter: "always" }}
            >
              {renderSlideContent(idx)}
            </div>
          ))}
        </div>
      )}

      {/* Style updates to support print layouts cleanly */}
      <style jsx global>{`
        @media print {
          body, html, main, #__next {
            background-color: #000000 !important;
            color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            width: 100vw !important;
            overflow: hidden !important;
          }
          /* Hide sidebar layout completely */
          aside, nav, header, footer, button, .print\\:hidden {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          .page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
}
