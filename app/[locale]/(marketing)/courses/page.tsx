'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  Lock, 
  Clock,
  ShieldCheck,
  Star,
  GraduationCap,
  BookOpen,
  Award,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Activity,
  Layers,
  HelpCircle as HelpIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { courses } from "@/lib/data/courses";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CertificatePreview } from "@/components/marketing/CertificatePreview";
import Script from "next/script";
import { PageHero } from "@/components/marketing/PageHero";
import { getAbsoluteUrl } from "@/lib/subdomains";
import { Reveal } from "@/components/marketing/Reveal";

const COURSE_PRICES: Record<string, { inr: number; id: string }> = {
  "ai-engineering": { inr: 1999, id: "ai-engineering" },
  "java-mastery": { inr: 799, id: "java-mastery" },
  "python-mastery": { inr: 499, id: "python-mastery" },
  "nextjs-fullstack": { inr: 899, id: "nextjs-fullstack" },
  "java-python-bundle": { inr: 999, id: "java-python-bundle" }
};

const flagshipAEO = {
  become: "AI Agent Architect",
  problemSolved: "Moving beyond basic LLM API wrappers to deep, stateful multi-agent system loops.",
  willBuild: "Production RAG engine with autonomous tool use & web search capabilities.",
  forWho: "Senior Developers, Tech Leads & Founders seeking agentic domain expertise."
};

const MODULES = [
  {
    id: 1,
    title: "01 // Neural Foundations & Core LLM Mechanics",
    content: "Understanding how Transformer models think. From tokenization and temperature settings to the math behind embeddings. We don't just use APIs; we understand the weights."
  },
  {
    id: 2,
    title: "02 // Advanced Prompt Engineering (Architect Level)",
    content: "Moving beyond basic instructions. Learn Chain-of-Thought (CoT), Tree-of-Thought (ToT), and automated prompt optimization techniques used by top engineering teams."
  },
  {
    id: 3,
    title: "03 // Deep RAG - Knowledge Retrieval Systems",
    content: "Building production-grade Retrieval Augmented Generation. Vector databases (Pinecone/Milvus), hybrid search, reranking strategies, and handling massive PDF/Doc sets."
  },
  {
    id: 4,
    title: "04 // Autonomous Agents & Tool Use",
    content: "Giving AI the ability to act. Building agents that can search the web, execute Python code, and interact with your existing SQL databases independently."
  },
  {
    id: 5,
    title: "05 // Multi-Agent Systems & Deployment",
    content: "Architecting teams of AI agents using LangGraph or CrewAI. Final deployment to production with monitoring, latency optimization, and cost management."
  }
];

const COMING_SOON = [
  {
    title: "Fullstack SaaS Mastery",
    description: "Build a complete subscription-based platform from scratch using Next.js 15, Stripe, and Supabase."
  },
  {
    title: "DevOps for AI Engineers",
    description: "Scale your AI applications. Learn Docker, Kubernetes, and specialized GPU orchestration for LLM inference."
  },
  {
    title: "Web3 & Smart Contracts",
    description: "Master Ethereum and Solidity to build decentralized applications on the blockchain."
  }
];

export default function CoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openModule, setOpenModule] = useState<number | null>(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [openAEO, setOpenAEO] = useState<string | null>(null);

  const handleEnroll = (courseId: string) => {
    if (!session) {
      window.location.href = getAbsoluteUrl(`/login?callbackUrl=/courses`);
      return;
    }

    const price = COURSE_PRICES[courseId]?.inr || 1999;
    const course = courses.find(c => c.id === courseId);
    const title = course?.title || courseId.replace(/-/g, " ").toUpperCase();
    
    window.location.href = getAbsoluteUrl(`/checkout?productId=${courseId}&type=course&price=${price}&title=${encodeURIComponent(title)}`);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! ${email} has been added to the waitlist.`);
    setEmail("");
  };

  return (
    <div className="bg-[#020202] min-h-screen text-white select-none">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <PageHero
        title="AI Academy"
        viewingText="ACADEMY"
        exploreText="CURRICULUM"
        tagline="ENGINEERING EDUCATION"
      />

      <div className="pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#020202] overflow-x-hidden border-t border-white/5 pt-16">
        <div className="max-w-[1600px] mx-auto space-y-24">

          {/* ================= SECTION 1: OUTCOMES BLUEPRINT GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal delay={0.08}>
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-3 h-full backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">01 // TARGET ROLE</span>
                <h4 className="text-xl font-bold font-serif text-white">{flagshipAEO.become}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">Scope and architect autonomous agent frameworks across production environments.</p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-3 h-full backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">02 // PROBLEM SOLVED</span>
                <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{flagshipAEO.problemSolved}</p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-3 h-full backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">03 // CAPSTONE PROJECT</span>
                <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{flagshipAEO.willBuild}</p>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-3 h-full backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">04 // TARGET AUDIENCE</span>
                <p className="text-zinc-200 text-sm leading-relaxed font-semibold">{flagshipAEO.forWho}</p>
              </div>
            </Reveal>
          </div>

          {/* ================= SECTION 2: FLAGSHIP SHOWCASE (AI ENGINEERING) ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8">
            {/* Left Column: Flagship Course Details */}
            <div className="lg:col-span-8 space-y-12">
              <Reveal>
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-[#C0F0FB] tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C0F0FB] animate-pulse" />
                      FLAGSHIP TRACK
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
                      ENROLLMENT OPEN
                    </span>
                  </div>

                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-none text-white">
                    AI Engineering
                  </h2>
                  <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-light">
                    A comprehensive, masterclass-level training path designed to take engineers from zero base to deploying stateful multi-agent pipelines in production.
                  </p>
                </div>
              </Reveal>

              {/* Skills checklist */}
              <Reveal delay={0.08}>
                <div className="space-y-6 bg-white/[0.01] border border-white/5 p-8 rounded-2xl">
                  <h4 className="font-mono text-xs text-zinc-500 uppercase tracking-widest font-bold">CORE TERMINAL CAPABILITIES</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Neural networks & LLM mechanics from scratch",
                      "Advanced prompt compiler techniques (CoT, ToT)",
                      "Stateful RAG pipelines & vector space embeddings",
                      "Autonomous tool utilization & API interface structures",
                      "Deploying multi-agent orchestrator systems",
                      "Low-latency serving & cost efficiency monitoring"
                    ].map((skill, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#C0F0FB] shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300 leading-snug">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Interactive Curriculum tree */}
              <Reveal delay={0.12}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="font-serif text-2xl font-bold text-white tracking-tight">Detailed Curriculum</h4>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-4">
                    {MODULES.map((mod) => (
                      <div 
                        key={mod.id} 
                        className="bg-[#080808] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300"
                      >
                        <button
                          onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                          className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.01] transition-colors group"
                        >
                          <span className="text-sm font-semibold tracking-tight text-zinc-300 group-hover:text-[#C0F0FB] transition-colors">
                            {mod.title}
                          </span>
                          <ChevronDown
                            className={cn(
                              "text-zinc-500 transition-transform group-hover:text-white",
                              openModule === mod.id && "rotate-180 text-white"
                            )}
                            size={16}
                          />
                        </button>
                        {openModule === mod.id && (
                          <div className="p-6 bg-[#040404] border-t border-white/5 text-xs md:text-sm text-zinc-400 leading-relaxed font-sans font-light animate-fade-in">
                            {mod.content}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Checkout, Certificate tilt, Waitlist card */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Checkout Card */}
              <Reveal delay={0.16}>
                <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">TUITION & ADMISSIONS</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tight font-serif">₹1,999</span>
                      <span className="text-xs text-zinc-500 line-through">₹4,999</span>
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">60% OFF</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-zinc-400 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C0F0FB]" />
                      <span>12 Weeks · Self-paced syllabus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C0F0FB]" />
                      <span>GrowX Certified AI Engineer credentials</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleEnroll("ai-engineering")}
                    disabled={loading === "ai-engineering"}
                    className="w-full py-4.5 bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#C0F0FB]/5"
                  >
                    {loading === "ai-engineering" ? "Processing..." : "Enroll in Track"}
                  </Button>
                </div>
              </Reveal>

              {/* 3D Certificate Preview Card */}
              <Reveal delay={0.24}>
                <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center space-y-6">
                  <div className="w-full flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">CREDENTIAL ENGINE</span>
                    <span className="text-[9px] text-[#C0F0FB] font-mono uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      VERIFIED
                    </span>
                  </div>

                  <div className="w-full transform hover:scale-[1.03] transition-transform duration-300 cursor-pointer">
                    <CertificatePreview />
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans max-w-[260px]">
                    Every graduate is issued a cryptographically verifiable certificate of mastership tied directly to the GrowX Trust Protocol.
                  </p>
                </div>
              </Reveal>

              {/* Waitlist Form */}
              <Reveal delay={0.32}>
                <div className="bg-white text-black rounded-3xl p-8 space-y-6 border border-zinc-200">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif font-black tracking-tight">Claim Early Access</h4>
                    <p className="text-zinc-600 text-xs leading-relaxed font-normal">
                      The first 100 registrations receive a 100% scholarship for life. Secure your place on the waitlist.
                    </p>
                  </div>

                  <form onSubmit={handleWaitlist} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your professional email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/5 border-none rounded-xl h-12 px-4 text-sm text-black placeholder:text-black/40 focus:bg-black/10 transition-all font-semibold"
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-black text-white font-bold uppercase text-[10px] tracking-widest hover:bg-black/90 transition-all"
                    >
                      Join the Waitlist — Free
                    </Button>
                  </form>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ================= SECTION 3: OTHER ACADEMY TRACKS ================= */}
          <section className="space-y-12 border-t border-white/5 pt-20">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">Alternative Tracks</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">Expand your engineering scope.</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course) => (
                <Reveal key={course.id}>
                  <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 flex flex-col justify-between h-full hover:border-[#C0F0FB]/20 transition-all duration-300 group">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
                          {course.difficulty}
                        </span>
                        <span className="font-serif font-bold text-white text-lg">₹{COURSE_PRICES[course.id]?.inr || "???"}</span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xl font-bold font-serif text-white group-hover:text-[#C0F0FB] transition-colors duration-300">
                          {course.title}
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed font-light">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} />
                          {course.modules.length} Modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {course.duration}
                        </span>
                      </div>

                      {/* Accordion outcome summary */}
                      <div className="border-t border-white/5 pt-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenAEO(openAEO === course.id ? null : course.id);
                          }}
                          className="flex items-center gap-1.5 text-zinc-500 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
                        >
                          <HelpCircle size={12} /> 
                          {openAEO === course.id ? "Hide Blueprint" : "Show Blueprint"}
                          <ChevronDown className={cn("transition-transform", openAEO === course.id && "rotate-180")} size={12} />
                        </button>
                        
                        {openAEO === course.id && (
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-3.5 text-left text-xs animate-fade-in">
                            <div className="space-y-1">
                              <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Outcome</p>
                              <p className="text-zinc-300 leading-snug">{course.become}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Problem Solved</p>
                              <p className="text-zinc-300 leading-snug">{course.problemSolved}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Capstone Project</p>
                              <p className="text-zinc-300 leading-snug">{course.willBuild}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-white/5 flex flex-col gap-3">
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        disabled={loading === course.id}
                        className="w-full py-4.5 bg-zinc-900 border border-white/10 text-white font-bold hover:bg-[#C0F0FB] hover:text-black hover:border-transparent transition-all duration-300 rounded-lg text-xs uppercase tracking-widest"
                      >
                        {loading === course.id ? "Processing..." : "Enroll Now"}
                      </Button>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-center text-zinc-500 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors mt-2"
                      >
                        Explore Curriculum
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Special Double Mastery Bundle Card */}
            <Reveal>
              <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#C0F0FB]/20 transition-all duration-300 group">
                <div className="space-y-4 max-w-xl">
                  <span className="px-3 py-1 bg-[#C0F0FB]/10 border border-[#C0F0FB]/20 text-[#C0F0FB] rounded font-mono text-[9px] uppercase tracking-widest font-bold">
                    Value Bundle
                  </span>
                  <h4 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">Double Mastery Bundle</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed font-light">
                    Secure both Java Mastery and Python Mastery tracks at a massive combined discount. Designed for developers looking to build polyglot backend systems.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Java Mastery Track</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Python Mastery Track</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center flex flex-col justify-center items-center w-full md:w-64">
                  <span className="text-[10px] font-mono text-zinc-500 line-through uppercase tracking-wider mb-1">₹1,298 combined</span>
                  <span className="text-4xl font-bold font-serif mb-6">₹999</span>
                  <Button
                    onClick={() => handleEnroll("java-python-bundle")}
                    disabled={loading === "java-python-bundle"}
                    className="w-full py-4.5 bg-[#C0F0FB] text-black font-bold hover:bg-[#C0F0FB]/90 transition-all rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-[#C0F0FB]/5"
                  >
                    {loading === "java-python-bundle" ? "Processing..." : "Get Bundle"}
                  </Button>
                </div>
              </div>
            </Reveal>
          </section>

          {/* ================= SECTION 4: ROADMAP EXPANSION ROADMAP ================= */}
          <section className="space-y-12 border-t border-white/5 pt-20">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C0F0FB] uppercase">Academic Pipeline</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">Growth Roadmap</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMING_SOON.map((course, i) => (
                <Reveal key={i} delay={0.08 * (i + 1)}>
                  <div className="bg-[#080808] border border-white/5 rounded-2xl p-8 min-h-[220px] flex flex-col justify-end relative overflow-hidden group">
                    {/* Lock Screen overlay */}
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 opacity-100 group-hover:bg-black/75 transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                        <Lock className="text-zinc-500" size={16} />
                      </div>
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
                        Enrollment Locked
                      </span>
                    </div>

                    <div className="space-y-2 relative z-10 pointer-events-none">
                      <h5 className="text-lg font-bold font-serif text-white">{course.title}</h5>
                      <p className="text-zinc-400 text-xs leading-relaxed font-light">{course.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
