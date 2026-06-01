import React from "react";
import Script from "next/script";
import Image from "next/image";
import { Link, locales } from "@/navigation";
import { 
  ReadingProgressBar, 
  TableOfContents 
} from "@/components/marketing/BlogInteractive";
import { Reveal } from "@/components/marketing/Reveal";
import { Calendar, Clock, User, Cpu, Sparkles, Activity, ArrowRight } from "lucide-react";
import { FlickerText } from "@/components/marketing/FlickerText";
import { BlogShare, NewsletterCTA, AgentCTA } from "./InteractiveComponents";

// ═══════════════════════════════════════════════════
// METADATA GENERATOR (SEO & Directory Optimization)
// ═══════════════════════════════════════════════════
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/chatbots-are-dying-agents-are-taking-over";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  const title = "Chatbots Are Dying. Agents Are Taking Over.";
  const description = "AI is evolving from chatbots to autonomous agents. Discover why AI agents will transform business operations, automation, sales, marketing, and execution.";

  return {
    title: `${title} | GrowXLabs`,
    description,
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    },
    openGraph: {
      title,
      description,
      url: `https://growxlabs.tech/${locale}/${path}`,
      siteName: "GrowXLabs",
      type: "article",
      publishedTime: "2026-06-01T17:00:00.000Z",
      authors: ["GrowXLabs Team"],
      images: [
        {
          url: "https://growxlabs.tech/images/chatbots-are-dying-agents-are-taking-over.png",
          width: 1200,
          height: 630,
          alt: "AI Agents Taking Over CRM and Workflows"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://growxlabs.tech/images/chatbots-are-dying-agents-are-taking-over.png"]
    },
    keywords: [
      "AI Agents",
      "Chatbots",
      "Autonomous Agents",
      "Business Automation",
      "OpenAI Agents",
      "Claude Code",
      "CRM Automation",
      "GrowXLabs",
      "Software Agents",
      "Artificial Intelligence Solutions"
    ]
  };
}

export default async function ChatbotsDyingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titleName = "AI AGENTS";

  // Table of Contents Headings
  const headings = [
    { id: "introduction", text: "Chatbots Are Dying. Agents Are Taking Over." },
    { id: "difference", text: "What's The Difference?" },
    { id: "betting-on-agents", text: "Why Major AI Companies Bet on Agents" },
    { id: "end-of-manual-ops", text: "The End Of Manual Digital Operations" },
    { id: "adopt-early", text: "The Businesses That Win Will Adopt Early" },
    { id: "what-this-means", text: "What This Means For Businesses" },
    { id: "future-is-execution", text: "The Future Is Not AI Chat" }
  ];

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://growxlabs.tech/${locale}/blog/chatbots-are-dying-agents-are-taking-over/#article`,
        "headline": "Chatbots Are Dying. Agents Are Taking Over.",
        "description": "AI is evolving from chatbots to autonomous agents. Discover why AI agents will transform business operations, automation, sales, marketing, and execution.",
        "datePublished": "2026-06-01T17:00:00Z",
        "dateModified": "2026-06-01T17:00:00Z",
        "image": "https://growxlabs.tech/images/chatbots-are-dying-agents-are-taking-over.png",
        "author": {
          "@type": "Organization",
          "name": "GrowXLabs Team",
          "url": "https://growxlabs.tech",
          "logo": "https://growxlabs.tech/logo.png"
        },
        "publisher": {
          "@type": "Organization",
          "name": "GrowXLabs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://growxlabs.tech/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://growxlabs.tech/${locale}/blog/chatbots-are-dying-agents-are-taking-over`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `https://growxlabs.tech/${locale}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `https://growxlabs.tech/${locale}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "AI Agents vs Chatbots",
            "item": `https://growxlabs.tech/${locale}/blog/chatbots-are-dying-agents-are-taking-over`
          }
        ]
      }
    ]
  };

  // Related articles
  const relatedArticles = [
    {
      title: "Blue Origin’s New Glenn Rocket Explodes During Test: What Happened?",
      href: "/blog/blue-origin-new-glenn-rocket-explosion",
      date: "May 30, 2026",
      readTime: "5 min read"
    },
    {
      title: "Claude Opus 4.8: Anthropic's Most Advanced AI Model — Benchmarks & Review",
      href: "/blog/claude-opus-4-8-anthropic-ai-model",
      date: "May 29, 2026",
      readTime: "12 min read"
    },
    {
      title: "Why Anthropic Is Becoming a Serious Threat to OpenAI",
      href: "/blog/why-anthropic-is-becoming-a-serious-threat-to-openai",
      date: "May 27, 2026",
      readTime: "5 min read"
    }
  ];

  return (
    <div className="w-full bg-[#F5F3EE] min-h-screen text-[#1A1A1A] selection:bg-[#355CFF]/10 selection:text-[#355CFF] pt-32 pb-24">
      {/* JSON-LD Structured Data */}
      <Script
        id="ai-agents-explosion-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Reading Progress */}
      <ReadingProgressBar />

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO SECTION                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <header className="w-full border-b border-[#E5E2DC] pb-16 px-6 md:px-10 xl:px-16 2xl:px-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Swiss Page Header */}
          <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mb-10">
            <h1 className="font-black select-none tracking-[-0.06em] text-[#1A1A1A] leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
              <FlickerText text={titleName} />
            </h1>
          </div>

          <Reveal y={20}>
            {/* Category Tags */}
            <div className="flex gap-2 justify-center items-center mb-6">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold bg-[#355CFF]/5 px-2.5 py-1 rounded">
                AI
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Automation
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Scale
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black leading-[1.1] tracking-tighter text-[#1A1A1A] mb-8 max-w-4xl mx-auto">
              Chatbots Are Dying.
              <br />
              <span className="text-[#355CFF]">Agents Are Taking Over.</span>
            </h2>

            {/* Meta Bar */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-6 sm:gap-10 font-mono text-[11px] tracking-[0.1em] text-[#6B7280] uppercase border-t border-b border-[#E5E2DC] py-5">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>By GrowXLabs Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>6 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>June 1, 2026</span>
              </div>
            </div>
          </Reveal>

          {/* Hero Visual — Widescreen Cover Image */}
          <Reveal y={30} delay={0.2}>
            <div className="mt-14 w-full max-w-5xl mx-auto">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-[#E5E2DC] bg-[#0F0F12] shadow-md">
                <Image
                  src="/images/chatbots-are-dying-agents-are-taking-over.png"
                  alt="Sleek autonomous AI Agent network workflow"
                  fill
                  className="object-cover scale-[1.10] transition-transform duration-700 hover:scale-[1.12]"
                  priority
                />
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ARTICLE BODY                                       */}
      {/* ═══════════════════════════════════════════════════ */}
      <main className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 py-16">
        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 relative">
          
          {/* Desktop TOC Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <TableOfContents headings={headings} />
          </aside>

          {/* Article Content */}
          <article className="col-span-12 lg:col-span-9 max-w-[70ch] mx-auto lg:mx-0">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-12 bg-white/60 border border-[#E5E2DC] rounded-xl p-6">
              <TableOfContents headings={headings} />
            </div>

            {/* ─────────────────────────────────────── */}
            {/* SECTION 01 — INTRODUCTION              */}
            {/* ─────────────────────────────────────── */}
            <section id="introduction" className="scroll-mt-32 space-y-6">
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#355CFF] first-letter:mr-3 first-letter:float-left">
                  The AI industry is entering its next major shift.
                </p>
                <p>
                  For the last three years, businesses have been focused on chatbots. Ask a question. Get an answer. Generate content. Write code. Summarize information.
                </p>
                <p>
                  But the future of AI isn&apos;t conversation.
                </p>
                <p className="text-xl font-bold text-[#1A1A1A] border-l-2 border-[#355CFF] pl-4">
                  It&apos;s execution.
                </p>
                <p>
                  We&apos;re moving from AI assistants to AI agents.
                </p>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 02 — WHAT'S THE DIFFERENCE?    */}
            {/* ─────────────────────────────────────── */}
            <section id="difference" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                What&apos;s The Difference?
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p>
                  A chatbot responds.
                </p>
                <p>
                  An agent acts.
                </p>
                <p>
                  A chatbot waits for instructions.
                </p>
                <p>
                  An agent can plan, decide, execute, and complete tasks with minimal human involvement.
                </p>
                
                {/* Comparison Card Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#6B7280] uppercase font-bold">Old AI: Chatbot</span>
                    <p className="text-[#1A1A1A] font-bold text-lg">&ldquo;Write me an email.&rdquo;</p>
                    <p className="text-[15px] text-[#6B7280]">Produces raw text copy. The user must manually copy, paste, select the client, send it, and manually update the platform database.</p>
                  </div>
                  
                  <div className="bg-[#355CFF]/[0.02] border border-[#355CFF]/20 rounded-xl p-6 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#355CFF]/5 rounded-full blur-2xl" />
                    <span className="text-[10px] font-mono tracking-widest text-[#355CFF] uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Agentic AI
                    </span>
                    <ul className="space-y-1.5 font-mono text-[13px] text-[#374151]">
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Finds the lead.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Researches the company.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Writes the email.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Sends it.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Tracks the response.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#355CFF]">→</span> Updates the CRM.
                      </li>
                    </ul>
                  </div>
                </div>

                <p>
                  Same goal.
                </p>
                <p className="font-bold text-[#1A1A1A]">
                  Completely different level of capability.
                </p>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 03 — BETTING ON AGENTS         */}
            {/* ─────────────────────────────────────── */}
            <section id="betting-on-agents" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Why Every Major AI Company Is Betting On Agents
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[13px] text-[#6B7280]">
                  <span>OpenAI</span><span>·</span>
                  <span>Anthropic</span><span>·</span>
                  <span>Google</span><span>·</span>
                  <span>Microsoft</span><span>·</span>
                  <span>NVIDIA</span>
                </div>
                <p>
                  Every major AI company is investing billions into agent technology.
                </p>
                <p>
                  Why?
                </p>
                <p>
                  Because businesses don&apos;t need more answers.
                </p>
                <p className="text-2xl font-black tracking-tight text-[#1A1A1A]">
                  They need more outcomes.
                </p>
                <blockquote className="border-l-4 border-[#355CFF] bg-[#355CFF]/[0.03] pl-6 pr-6 py-6 rounded-r-xl">
                  <p className="text-[17px] italic leading-relaxed text-[#374151] font-medium">
                    &ldquo;The real value of AI isn&apos;t generating text. It&apos;s generating results.&rdquo;
                  </p>
                </blockquote>
                <p>
                  That&apos;s why we&apos;re seeing rapid development in:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "AI Sales Agents", desc: "Autonomously book prospects and secure meetings" },
                    { name: "Customer Support Agents", desc: "Interact directly with backends to solve tickets" },
                    { name: "Research Agents", desc: "Audit literature and compile intelligence databases" },
                    { name: "Coding Agents", desc: "Plan, write, verify, and push stable code modifications" },
                    { name: "Operations Agents", desc: "Coordinate supply chains and CRM data entries" },
                    { name: "Marketing Agents", desc: "Autonomously draft and optimize cross-platform flows" },
                  ].map((agent, i) => (
                    <div key={i} className="bg-white border border-[#E5E2DC] rounded-xl p-5 space-y-1">
                      <p className="text-[15px] font-bold text-[#1A1A1A] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                        <span>{agent.name}</span>
                      </p>
                      <p className="text-[12px] text-[#6B7280] leading-snug">{agent.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="pt-4 font-semibold text-[#1A1A1A]">
                  The goal is simple:
                </p>
                <ul className="list-none space-y-1.5 pl-4 border-l-2 border-[#355CFF]/30">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                    <span>Reduce manual work.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                    <span>Increase execution speed.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]" />
                    <span>Scale without increasing headcount.</span>
                  </li>
                </ul>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 04 — END OF MANUAL DIGITAL OPS */}
            {/* ─────────────────────────────────────── */}
            <section id="end-of-manual-ops" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                The End Of Manual Digital Operations
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p>
                  Today&apos;s businesses spend countless hours on repetitive tasks.
                </p>
                <div className="bg-white border border-[#E5E2DC] rounded-xl p-6">
                  <ul className="grid grid-cols-2 gap-4">
                    {[
                      "Following up with leads.",
                      "Updating spreadsheets.",
                      "Scheduling meetings.",
                      "Sending emails.",
                      "Creating reports.",
                      "Managing customer support."
                    ].map((task, i) => (
                      <li key={i} className="flex items-center gap-2 text-[15px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  These processes consume time that could be spent growing the business.
                </p>
                <p>
                  AI agents are changing that.
                </p>
                <p className="text-xl font-bold text-[#1A1A1A]">
                  Instead of assisting humans with work, they perform the work themselves.
                </p>
                <p className="font-semibold text-[#1A1A1A]">
                  The result?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Execution", value: "Faster Teams" },
                    { label: "Finance", value: "Lower Costs" },
                    { label: "Customer", value: "Better Support" },
                    { label: "Growth", value: "Scalability" }
                  ].map((metric, i) => (
                    <div key={i} className="bg-[#355CFF]/[0.02] border border-[#355CFF]/10 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">{metric.label}</p>
                      <p className="text-[15px] font-black text-[#355CFF] mt-1">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 05 — ADOPT EARLY               */}
            {/* ─────────────────────────────────────── */}
            <section id="adopt-early" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                The Businesses That Win Will Adopt Early
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p>
                  Every technology shift creates two groups.
                </p>
                <p>
                  Those who adapt early.
                </p>
                <p>
                  And those who eventually catch up.
                </p>
                
                {/* Visual grid overlay */}
                <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 my-6">
                  <div className="grid grid-cols-3 gap-4 text-center font-mono text-[11px] text-[#6B7280]">
                    <div>
                      <p className="text-lg font-black text-[#1A1A1A] mb-1">1995</p>
                      <p>The Internet</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-[#1A1A1A] mb-1">2008</p>
                      <p>Mobile Apps</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-[#1A1A1A] mb-1">2026</p>
                      <p className="text-[#355CFF] font-bold">AI Agents</p>
                    </div>
                  </div>
                </div>

                <p>
                  The internet created winners.
                </p>
                <p>
                  Mobile created winners.
                </p>
                <p>
                  Social media created winners.
                </p>
                <p>
                  AI agents will do the same.
                </p>
                <p>
                  Businesses that integrate agents into their operations today will gain a significant advantage over competitors still relying on manual processes tomorrow.
                </p>
                <p className="font-bold text-[#1A1A1A]">
                  The gap won&apos;t be small.
                </p>
                <p className="text-[#355CFF] font-extrabold">
                  It will compound every day.
                </p>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 06 — WHAT THIS MEANS           */}
            {/* ─────────────────────────────────────── */}
            <section id="what-this-means" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                What This Means For Businesses
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p>
                  The question is no longer:
                </p>
                <p className="italic font-medium text-[#6B7280]">
                  &ldquo;Should we use AI?&rdquo;
                </p>
                <p>
                  The question is:
                </p>
                <p className="text-2xl font-black tracking-tight text-[#355CFF]">
                  &ldquo;Which parts of our business should AI execute?&rdquo;
                </p>
                <p>
                  Lead generation.
                </p>
                <p>
                  Sales.
                </p>
                <p>
                  Customer support.
                </p>
                <p>
                  Internal operations.
                </p>
                <p>
                  Marketing workflows.
                </p>
                <p>
                  Data analysis.
                </p>
                <p>
                  The opportunities are expanding every month.
                </p>
                <p>
                  Businesses that understand this shift now will be positioned to scale faster, operate leaner, and compete more effectively.
                </p>
              </div>
            </section>

            <div className="w-full h-px bg-[#E5E2DC] my-14" />

            {/* ─────────────────────────────────────── */}
            {/* SECTION 07 — CONCLUSION                */}
            {/* ─────────────────────────────────────── */}
            <section id="future-is-execution" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                The Future Is Not AI Chat.
              </h2>
              <div className="text-[18px] leading-[1.85] text-[#374151] font-normal space-y-6 font-sans">
                <p>
                  The future is AI execution.
                </p>
                <p>
                  Chatbots helped businesses understand AI.
                </p>
                <p>
                  Agents will transform how businesses operate.
                </p>
                <p>
                  The next generation of companies won&apos;t simply use AI.
                </p>
                <p>
                  They&apos;ll build systems powered by AI agents.
                </p>
                <p>
                  And those systems will become a competitive advantage.
                </p>
                
                <div className="bg-[#1A1A1A] text-white rounded-xl p-6 relative overflow-hidden border border-white/5 my-8">
                  <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#355CFF]/10 rounded-full blur-xl" />
                  <p className="font-mono text-[11px] text-[#355CFF] tracking-[0.25em] uppercase font-bold mb-2">Core Era Shift</p>
                  <p className="text-lg font-bold leading-relaxed">
                    The AI era was about answers. <br className="hidden sm:block" />
                    <span className="text-[#355CFF]">The Agent Era is about outcomes.</span>
                  </p>
                </div>

                <p className="font-mono text-[12px] tracking-[0.1em] text-[#6B7280] uppercase">
                  — GXL Insights
                </p>
              </div>
            </section>

            {/* Share and Social Action Links */}
            <BlogShare title="Chatbots Are Dying. Agents Are Taking Over." slug="chatbots-are-dying-agents-are-taking-over" />

            {/* Customer Call-To-Action Box */}
            <AgentCTA />

            {/* Newsletter CTA Block */}
            <NewsletterCTA />

            {/* Continue Reading / Related Grid */}
            <section className="space-y-8 mt-16">
              <h2 className="text-2xl font-black tracking-tight text-[#1A1A1A]">Continue Reading</h2>
              <div className="grid gap-4">
                {relatedArticles.map((article, i) => (
                  <Link key={i} href={article.href} className="group block bg-white border border-[#E5E2DC] rounded-xl p-6 hover:border-[#355CFF]/30 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-[17px] font-bold text-[#1A1A1A] group-hover:text-[#355CFF] transition-colors leading-snug">{article.title}</h3>
                        <div className="flex items-center gap-4 font-mono text-[11px] text-[#6B7280] tracking-wider uppercase">
                          <span>{article.date}</span>
                          <span>·</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#D1D5DB] group-hover:text-[#355CFF] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}
