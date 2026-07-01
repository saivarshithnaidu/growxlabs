'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { 
  ArrowRight, 
  Search, 
  Database, 
  Upload, 
  Play, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Smartphone, 
  Sparkles, 
  Loader2, 
  FileText,
  Clock
} from "lucide-react";

export default function ProductsPage() {
  // === LEAD SCRAPER SIMULATOR STATES ===
  const [scraperIndustry, setScraperIndustry] = useState('Real Estate Developers');
  const [scraperCity, setScraperCity] = useState('Dubai');
  const [scraperStep, setScraperStep] = useState<'idle' | 'spawning' | 'scraping' | 'enriching' | 'syncing' | 'done'>('idle');
  const [scrapedCount, setScrapedCount] = useState(0);

  // === INVOICE PARSER SIMULATOR STATES ===
  const [parserState, setParserState] = useState<'idle' | 'scanning' | 'done'>('idle');

  // === CHAT AGENT SIMULATOR STATES ===
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot' | 'system', text: string }>>([
    { sender: 'bot', text: 'Hi! I am the GrowX Labs AI Agent. Ask me about your operations, logistics, or bookings!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  // Handle Lead Scraper simulation
  useEffect(() => {
    if (scraperStep === 'spawning') {
      const timer = setTimeout(() => setScraperStep('scraping'), 1800);
      return () => clearTimeout(timer);
    } else if (scraperStep === 'scraping') {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 8) + 3;
        if (current >= 47) {
          setScrapedCount(47);
          clearInterval(interval);
          setScraperStep('enriching');
        } else {
          setScrapedCount(current);
        }
      }, 200);
      return () => clearInterval(interval);
    } else if (scraperStep === 'enriching') {
      const timer = setTimeout(() => setScraperStep('syncing'), 1500);
      return () => clearTimeout(timer);
    } else if (scraperStep === 'syncing') {
      const timer = setTimeout(() => setScraperStep('done'), 1500);
      return () => clearTimeout(timer);
    }
  }, [scraperStep]);

  const handleStartScraper = () => {
    setScrapedCount(0);
    setScraperStep('spawning');
  };

  // Handle Invoice Parser simulation
  const handleStartParser = () => {
    setParserState('scanning');
    setTimeout(() => {
      setParserState('done');
    }, 3000);
  };

  // Handle Chat Agent simulation
  const handleSendMessage = (msg: string) => {
    if (isTyping) return;
    setActiveSuggestion(msg);
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setIsTyping(true);

    setTimeout(() => {
      if (msg.includes('container')) {
        setChatMessages(prev => [
          ...prev, 
          { sender: 'system', text: 'SYSTEM: Querying Shipping & Freight API for #GXL-921...' }
        ]);
        setTimeout(() => {
          setChatMessages(prev => [
            ...prev,
            { sender: 'bot', text: 'Your container #GXL-921 is currently at the Port of Dubai (Terminal 2). It cleared customs inspection at 18:40 and is scheduled for release to dispatch in 3 hours.' }
          ]);
          setIsTyping(false);
          setActiveSuggestion(null);
        }, 1500);
      } else {
        setChatMessages(prev => [
          ...prev, 
          { sender: 'system', text: 'SYSTEM: Accessing Scheduling Calendar & Booking API...' }
        ]);
        setTimeout(() => {
          setChatMessages(prev => [
            ...prev,
            { sender: 'bot', text: 'Done! I have rescheduled your property walkthrough to this Thursday at 3:00 PM. A calendar invite has been auto-sent to your team.' }
          ]);
          setIsTyping(false);
          setActiveSuggestion(null);
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div className="bg-[#020202] min-h-screen text-white select-none">
      <PageHero
        title="Products"
        viewingText="AI LABS"
        exploreText="SANDBOX"
        tagline="AI-NATIVE SYSTEMS"
      />

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-24 pt-16">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-24">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal>
              <span className="text-[12px] font-mono font-bold uppercase tracking-[0.2em] text-[#C0F0FB] mb-3 block">
                Interactive Preview
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-serif font-bold tracking-tight leading-tight">
                Experience our products in action.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-zinc-400 mt-4 text-[16px] max-w-xl mx-auto leading-relaxed">
                Interact with the mock simulations below to see how our custom AI-native pipelines automate business operations.
              </p>
            </Reveal>
          </div>

          {/* ================= SANDBOX 1: B2B LEAD SCRAPER ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-white/5 pt-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs text-[#C0F0FB] tracking-widest uppercase">[ SANDBOX 01 ]</span>
              <h3 className="text-3xl font-bold tracking-tight font-serif">Autonomous B2B Lead Scraper</h3>
              <p className="text-zinc-400 leading-relaxed text-[15px]">
                A simulated live demo of our orchestrator agent. Input your industry and city to watch our multi-agent pipeline discover, crawl, and compile qualified leads directly into your database.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Google Maps directory crawling</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Website contact email & phone extraction</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Direct sync to admin CRM lead tables</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              {/* Form Controls */}
              {scraperStep === 'idle' && (
                <div className="space-y-6 my-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Target Industry</label>
                      <input 
                        type="text" 
                        value={scraperIndustry} 
                        onChange={(e) => setScraperIndustry(e.target.value)}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C0F0FB] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Target City</label>
                      <select 
                        value={scraperCity} 
                        onChange={(e) => setScraperCity(e.target.value)}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C0F0FB] transition-colors"
                      >
                        <option value="Dubai">Dubai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="New York">New York</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartScraper}
                    className="w-full py-6 bg-[#C0F0FB] text-black font-semibold hover:bg-[#C0F0FB]/90 transition-all rounded-lg flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch AI Scraper Agent</span>
                  </Button>
                </div>
              )}

              {/* Running Terminal Simulation */}
              {scraperStep !== 'idle' && scraperStep !== 'done' && (
                <div className="font-mono text-xs space-y-4 my-auto text-left text-zinc-400 bg-[#050505] p-5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-[#C0F0FB]">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="font-bold">ORCHESTRATOR LOOP RUNNING</span>
                  </div>
                  <div className="space-y-2.5">
                    <p className={scraperStep !== 'spawning' ? 'text-zinc-500' : 'text-white'}>
                      &gt; Spawning subagent nodes...
                    </p>
                    {(scraperStep === 'scraping' || scraperStep === 'enriching' || scraperStep === 'syncing') && (
                      <p className={scraperStep !== 'scraping' ? 'text-zinc-500' : 'text-white'}>
                        &gt; Crawling Google Maps listings in {scraperCity}... ({scrapedCount} leads found)
                      </p>
                    )}
                    {(scraperStep === 'enriching' || scraperStep === 'syncing') && (
                      <p className={scraperStep !== 'enriching' ? 'text-zinc-500' : 'text-white'}>
                        &gt; Extracting domain contacts (emails, social handles, phone numbers)...
                      </p>
                    )}
                    {scraperStep === 'syncing' && (
                      <p className="text-white animate-pulse">
                        &gt; Syncing leads database to Admin CRM table...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Scraped Leads Result */}
              {scraperStep === 'done' && (
                <div className="space-y-6 my-auto animate-fade-in-up text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">Scrape Complete</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">Status: Synced to CRM</span>
                  </div>
                  <div className="overflow-x-auto border border-white/5 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-500 uppercase tracking-widest font-mono text-[9px]">
                          <th className="p-3">Company Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Contact Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-semibold text-white">Aura Developers</td>
                          <td className="p-3 text-zinc-400 font-mono">contact@aura****.com</td>
                          <td className="p-3 text-zinc-400 font-mono">+971 50 *** ****</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-semibold text-white">Zeta Construction</td>
                          <td className="p-3 text-zinc-400 font-mono">info@zeta****.com</td>
                          <td className="p-3 text-zinc-400 font-mono">+971 55 *** ****</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-white">Apex Properties</td>
                          <td className="p-3 text-zinc-400 font-mono">sales@apex****.com</td>
                          <td className="p-3 text-zinc-400 font-mono">+971 52 *** ****</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full py-4 bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-lg text-xs">
                        Unlock Lead Automation For My Business
                      </Button>
                    </Link>
                    <button 
                      onClick={() => setScraperStep('idle')} 
                      className="px-5 py-4 border border-white/10 hover:border-white/20 transition-all rounded-lg font-mono text-xs text-zinc-400 hover:text-white"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= SANDBOX 2: ERP INVOICE PARSER ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-white/5 pt-16">
            <div className="lg:col-span-7 bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between order-last lg:order-first">
              {/* Idle Upload State */}
              {parserState === 'idle' && (
                <div className="my-auto space-y-6">
                  <div className="border border-dashed border-white/10 hover:border-[#C0F0FB]/30 bg-white/[0.01] rounded-xl p-8 text-center cursor-pointer transition-colors group flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-[#C0F0FB] transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Mock Invoice File Ready</p>
                      <p className="text-xs text-zinc-500 font-mono">invoice_sample_TBK.pdf (42.5 KB)</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStartParser}
                    className="w-full py-6 bg-white text-black font-semibold hover:bg-zinc-200 transition-all rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Process Invoice Document</span>
                  </Button>
                </div>
              )}

              {/* Scanning Active State */}
              {parserState === 'scanning' && (
                <div className="my-auto space-y-6 text-center relative py-12">
                  {/* Laser Scan Line Overlay */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C0F0FB] to-transparent shadow-[0_0_12px_#C0F0FB] top-6 animate-[bounce_2.5s_infinite_ease-in-out]" />
                  
                  <div className="w-14 h-14 rounded-full bg-[#C0F0FB]/10 text-[#C0F0FB] flex items-center justify-center mx-auto animate-pulse">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-mono tracking-widest text-[#C0F0FB] font-bold">PARSING DOCUMENT CONTENT</p>
                    <p className="text-xs text-zinc-500">Extracting table headers, line items, and transaction keys...</p>
                  </div>
                </div>
              )}

              {/* Parsing Complete Result */}
              {parserState === 'done' && (
                <div className="space-y-6 my-auto animate-fade-in-up text-left">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">Parsing Successful</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">Action: Auto-Reconciled</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#161616] p-4 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block">Vendor Name</span>
                      <span className="text-sm font-bold text-white">TBK Metal Co. Ltd.</span>
                    </div>
                    <div className="bg-[#161616] p-4 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block">Total Document Value</span>
                      <span className="text-sm font-bold text-[#C0F0FB]">$12,450.00 USD</span>
                    </div>
                    <div className="bg-[#161616] p-4 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block">Line Items Found</span>
                      <span className="text-sm font-semibold text-white">Steel Channels (35 Tons)</span>
                    </div>
                    <div className="bg-[#161616] p-4 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block">Ledger Verification</span>
                      <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Matched Trans #TX-8821
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full py-4 bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-lg text-xs">
                        Build Custom ERP For My Business
                      </Button>
                    </Link>
                    <button 
                      onClick={() => setParserState('idle')} 
                      className="px-5 py-4 border border-white/10 hover:border-white/20 transition-all rounded-lg font-mono text-xs text-zinc-400 hover:text-white"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs text-[#C0F0FB] tracking-widest uppercase">[ SANDBOX 02 ]</span>
              <h3 className="text-3xl font-bold tracking-tight font-serif">AI-Native Document Parser</h3>
              <p className="text-zinc-400 leading-relaxed text-[15px]">
                Watch how our intelligent document parser processes physical invoices, bills of lading, and PDFs. It extracts tables, line items, and names, automatically reconciling them with your banking ledger.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>OCR visual extraction engine</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Automatic transaction matching</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>ERP database sync & record updating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SANDBOX 3: COGNITIVE SUPPORT AGENT ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-t border-white/5 pt-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs text-[#C0F0FB] tracking-widest uppercase">[ SANDBOX 03 ]</span>
              <h3 className="text-3xl font-bold tracking-tight font-serif">Cognitive Support Agent</h3>
              <p className="text-zinc-400 leading-relaxed text-[15px]">
                Interact with our support bot simulation. Unlike basic rule-based trees, our agents connect directly to operational APIs (Logistics, Booking databases) to solve complex customer queries instantly.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Live operational database queries</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Automated meeting & booking reschedule</span>
                </div>
                <div className="flex gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-[#C0F0FB] shrink-0" />
                  <span>Intelligent system API fallback routing</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              {/* Smartphone Mockup */}
              <div className="w-full max-w-[420px] bg-[#0c0c0c] border border-white/10 rounded-[36px] p-4.5 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between aspect-[9/16]">
                {/* Speaker & Sensor Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-black rounded-full z-20 flex items-center justify-center gap-1.5">
                  <div className="w-10 h-1 bg-zinc-800 rounded-full" />
                  <div className="w-2 h-2 bg-zinc-900 rounded-full" />
                </div>

                {/* Inner Screen */}
                <div className="w-full h-full bg-[#050505] rounded-[24px] border border-white/5 flex flex-col justify-between overflow-hidden relative pt-6">
                  {/* Mock WhatsApp Header */}
                  <div className="bg-[#111111] border-b border-white/5 p-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#C0F0FB]/20 text-[#C0F0FB] flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">GrowX Agent</h4>
                        <span className="text-[9px] text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          ONLINE
                        </span>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </div>

                  {/* Message History Container */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col justify-end">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-xs text-left leading-relaxed",
                          msg.sender === 'user' && "bg-[#C0F0FB] text-black self-end rounded-tr-none font-semibold",
                          msg.sender === 'bot' && "bg-zinc-900 text-zinc-100 self-start rounded-tl-none border border-white/5",
                          msg.sender === 'system' && "bg-zinc-950 border border-dashed border-white/10 text-zinc-400 self-center max-w-[95%] py-1.5 text-[10px] font-mono text-center rounded-md"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}

                    {/* Typing state */}
                    {isTyping && (
                      <div className="bg-zinc-900 text-zinc-100 self-start rounded-2xl rounded-tl-none border border-white/5 px-4 py-2.5 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>

                  {/* Suggestion Prompts */}
                  <div className="p-3 border-t border-white/5 bg-[#111111]/40 space-y-2">
                    <p className="text-[8px] uppercase font-mono tracking-widest text-zinc-500 text-left">Click to Ask Agent:</p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleSendMessage('Where is my container #GXL-921?')}
                        disabled={isTyping}
                        className={cn(
                          "text-left px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[10px] transition-colors border border-white/5 flex items-center justify-between",
                          activeSuggestion === 'Where is my container #GXL-921?' && "border-[#C0F0FB] text-[#C0F0FB]"
                        )}
                      >
                        <span>&gt; Where is my cargo container #GXL-921?</span>
                        <Send className="w-3 h-3 text-zinc-500" />
                      </button>
                      <button 
                        onClick={() => handleSendMessage('Reschedule walkthrough to Thursday.')}
                        disabled={isTyping}
                        className={cn(
                          "text-left px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[10px] transition-colors border border-white/5 flex items-center justify-between",
                          activeSuggestion === 'Reschedule walkthrough to Thursday.' && "border-[#C0F0FB] text-[#C0F0FB]"
                        )}
                      >
                        <span>&gt; Reschedule property walkthrough</span>
                        <Send className="w-3 h-3 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Block */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <span className="text-[12px] font-mono tracking-[0.2em] text-[#C0F0FB] uppercase font-bold">
              Engineering Custom AI
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tight max-w-2xl mx-auto leading-tight">
              Ready to automate your operations?
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
              We design and ship custom AI-native products, databases, and dashboards tailored directly to your team's workflows.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-lg px-8 py-6 text-sm">
                  Let's Discuss Your Project
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple local classname toggle helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
