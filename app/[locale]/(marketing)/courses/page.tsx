"use client";

import { useState } from "react";
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
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { courses } from "@/lib/data/courses";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CertificatePreview } from "@/components/marketing/CertificatePreview";
import Script from "next/script";

const faqData = [
  {
    question: "Are these courses suitable for beginners?",
    answer: "We have specific 'Beginner' tracks for Java and Python. The AI Engineering track is best suited for those with basic programming knowledge."
  },
  {
    question: "Do I get a certificate after completion?",
    answer: "Yes. Every course includes a GrowX Labs certification that is cryptographically signed and globally verifiable."
  },
  {
    question: "Is there any support if I get stuck?",
    answer: "Yes. Our premium tracks include access to our private community where engineers provide direct feedback."
  },
  {
    question: "How long do I have access to the materials?",
    answer: "Once you enroll, you have lifetime access to the course materials and all future updates."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "We offer a 7-day no-questions-asked refund policy if you haven't completed more than 20% of the course."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const COURSE_PRICES: Record<string, { inr: number; id: string }> = {
  "ai-engineering": { inr: 1999, id: "ai-engineering" },
  "java-mastery": { inr: 799, id: "java-mastery" },
  "python-mastery": { inr: 499, id: "python-mastery" },
  "nextjs-fullstack": { inr: 899, id: "nextjs-fullstack" },
  "java-python-bundle": { inr: 999, id: "java-python-bundle" }
};

const flagshipAEO = {
  become: "A world-class AI Engineer capable of architecting autonomous agent systems.",
  problemSolved: "Solves the 'wrapper' problem by teaching you to build deep RAG and Agentic workflows, not just API calls.",
  willBuild: "A multi-agent knowledge platform with live web-search and document intelligence.",
  forWho: "Senior developers, tech leads, and founders who want to lead the AI wave."
};

const MODULES = [
  {
    id: 1,
    title: "Module 1: The AI Mindset & Core LLM Mechanics",
    content: "Understanding how Transformer models think. From tokenization and temperature settings to the math behind embeddings. We don't just use APIs; we understand the weights."
  },
  {
    id: 2,
    title: "Module 2: Advanced Prompt Engineering (Architect Level)",
    content: "Moving beyond basic instructions. Learn Chain-of-Thought (CoT), Tree-of-Thought (ToT), and automated prompt optimization techniques used by top engineering teams."
  },
  {
    id: 3,
    title: "Module 3: Deep RAG - Knowledge Retrieval Systems",
    content: "Building production-grade Retrieval Augmented Generation. Vector databases (Pinecone/Milvus), hybrid search, reranking strategies, and handling massive PDF/Doc sets."
  },
  {
    id: 4,
    title: "Module 4: Autonomous Agents & Tool Use",
    content: "Giving AI the ability to act. Building agents that can search the web, execute Python code, and interact with your existing SQL databases independently."
  },
  {
    id: 5,
    title: "Module 5: Multi-Agent Systems & Deployment",
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

  const titleName = "COURSES";

  const handleEnroll = (courseId: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses`);
      return;
    }

    const price = COURSE_PRICES[courseId]?.inr || 1999;
    const course = courses.find(c => c.id === courseId);
    const title = course?.title || courseId.replace(/-/g, " ").toUpperCase();
    
    router.push(`/checkout?productId=${courseId}&type=course&price=${price}&title=${encodeURIComponent(title)}`);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! ${email} has been added to the waitlist.`);
    setEmail("");
  };

  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen font-sans overflow-x-hidden">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <section className="mb-24">
          {/* Massive Swiss Page Title */}
          <div className="w-full overflow-hidden flex justify-center md:justify-start items-end select-none pointer-events-none mb-14">
            <h1 className="font-black select-none tracking-[-0.06em] text-white leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
              {titleName}
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-primary font-bold uppercase tracking-widest text-xs">GrowX Labs Academy</span>
            </div>
            <h2 className="text-white font-bold text-4xl md:text-6xl tracking-tight max-w-4xl leading-[1.1]">
              Learn AI Engineering
            </h2>
            <p className="text-[#A0A0A0] text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Hands-on courses built by engineers who ship real AI products. Every course ends with a GrowX Labs certification.
            </p>
          </div>
        </section>

        {/* Featured Course Track — AI Engineering */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Detailed Course Card */}
            <div
              className="lg:col-span-8 group relative rounded-3xl border border-zinc-800 bg-zinc-950 p-10 md:p-14"
            >
              {/* AI Engineering AEO Section */}
              <div className="mb-12 p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800">
                <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Direct Track Outcome
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-white/40 font-medium text-xs uppercase tracking-widest">What will you become?</p>
                    <p className="text-white text-base leading-snug">{flagshipAEO.become}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 font-medium text-xs uppercase tracking-widest">What problem does this solve?</p>
                    <p className="text-white text-base leading-snug">{flagshipAEO.problemSolved}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 font-medium text-xs uppercase tracking-widest">What will you build?</p>
                    <p className="text-white text-base leading-snug">{flagshipAEO.willBuild}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 font-medium text-xs uppercase tracking-widest">Who is this for?</p>
                    <p className="text-white text-base leading-snug">{flagshipAEO.forWho}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-primary font-semibold uppercase tracking-wider text-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Core AI Track — Enrollment Open
                  </h2>
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                    Flagship Program
                  </span>
                </div>
                <h3 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">AI Engineering</h3>
                <p className="text-xl md:text-2xl text-white/60 font-medium mb-12">From Scratch to Production</p>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
                  <div className="space-y-6">
                    <p className="text-white/40 font-semibold text-xs uppercase tracking-widest">Terminal Skills:</p>
                    <ul className="space-y-4">
                      {[
                        "How LLMs and AI models actually work",
                        "Prompt engineering from basics to advanced",
                        "Claude, OpenAI, and Gemini APIs",
                        "Embeddings and vector databases",
                        "RAG systems — build your own from scratch",
                        "AI agents and tool use",
                        "Deploy AI applications to production",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 group">
                          <CheckCircle2
                            className="text-primary mt-0.5 shrink-0"
                            size={18}
                          />
                          <span className="text-white/80 font-medium text-base leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-end gap-6 bg-zinc-900/20 rounded-2xl p-8 border border-zinc-800">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                        <Clock size={16} className="text-white/40" />
                        12 Weeks Self-paced
                      </div>
                      <div className="flex items-center gap-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                        <GraduationCap size={16} className="text-white/40" />
                        GrowX Labs Certified
                      </div>
                    </div>
                    <div className="pt-6 border-t border-zinc-800">
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">Tuition Fees</p>
                          <p className="text-4xl font-bold text-white tracking-tight">₹1,999</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1 line-through">
                            ₹4,999
                          </p>
                          <p className="text-green-500 text-sm font-bold uppercase">60% OFF</p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleEnroll("ai-engineering")}
                        disabled={loading === "ai-engineering"}
                        className="w-full h-14 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold uppercase text-sm tracking-widest transition-colors duration-200"
                      >
                        {loading === "ai-engineering" ? "Processing..." : "Enroll Now"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Modules Accordion */}
                <div className="space-y-4 mt-16">
                  <div className="flex items-center gap-6 mb-8">
                    <h4 className="text-white font-bold text-2xl tracking-tight shrink-0">Detailed Curriculum</h4>
                    <div className="h-px flex-grow bg-zinc-800" />
                  </div>
                  {MODULES.map((mod) => (
                    <div key={mod.id} className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/20">
                      <button
                        onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-zinc-900/40 transition-colors group"
                      >
                        <span className="text-white font-medium text-lg text-left tracking-tight group-hover:text-primary transition-colors">
                          {mod.title}
                        </span>
                        <ChevronDown
                          className={cn(
                            "text-white/40 transition-transform",
                            openModule === mod.id && "rotate-180 text-white"
                          )}
                          size={20}
                        />
                      </button>
                      <div className={openModule === mod.id ? "block bg-zinc-950 border-t border-zinc-800" : "hidden"}>
                        <div className="p-6 text-[#A0A0A0] leading-relaxed font-medium text-base">{mod.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center"
              >
                <div className="w-full">
                  <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3 tracking-tight self-start">
                    <ShieldCheck className="text-primary" size={22} />
                    Global Credentials
                  </h4>
                </div>

                <CertificatePreview />

                <div className="text-center mt-6">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-full py-1.5 px-4 inline-flex items-center gap-2 mb-4">
                    <ShieldCheck size={14} className="text-white/60" />
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Institutional Verification</span>
                  </div>
                  <p className="text-white/40 text-sm font-medium max-w-[260px] mx-auto leading-relaxed">
                    This certificate is cryptographically signed and globally verifiable via the GrowX Trust Protocol.
                  </p>
                </div>
              </div>

              <div
                className="bg-white rounded-3xl p-10 text-black border border-zinc-250 shadow-xl"
              >
                <div className="relative z-10">
                  <h4 className="text-3xl font-bold tracking-tight mb-4">Claim Early Access</h4>
                  <p className="text-black/60 font-medium mb-8 text-base leading-snug">
                    The first 100 registrations receive a 100% scholarship for life. Secure your track.
                  </p>
                  <form onSubmit={handleWaitlist} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your professional email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/5 border-none rounded-xl h-14 px-6 text-base text-black font-medium placeholder:text-black/40 focus:bg-black/10 transition-all"
                    />
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-black/80 transition-all"
                    >
                      Join the Waitlist — Free
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Courses Grid */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:bg-zinc-900/10 transition-colors flex flex-col md:flex-row"
              >
                {/* Horizontal Image Section */}
                <div className="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/40">
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-zinc-950 rounded-md text-xs font-semibold uppercase text-white/80 border border-zinc-850">
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                {/* Horizontal Content Section */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-bold text-xl group-hover:text-primary transition-colors leading-tight tracking-tight max-w-[75%]">
                        {course.title}
                      </h5>
                      <div className="text-right">
                        <span className="text-white font-bold text-lg block">₹{COURSE_PRICES[course.id]?.inr || "???"}</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                        <BookOpen size={14} className="text-white/20" />
                        {course.modules.length} Modules
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                        <Clock size={14} className="text-white/20" />
                        {course.duration}
                      </div>
                    </div>

                    {/* COURSE AEO Section */}
                    <div className="mb-6">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenAEO(openAEO === course.id ? null : course.id);
                        }}
                        className="flex items-center gap-2 text-white/60 font-semibold text-xs hover:text-white transition-colors"
                      >
                        <HelpCircle size={14} /> 
                        {openAEO === course.id ? "Hide Summary" : "Show Direct Outcomes"}
                        <ChevronDown className={cn("transition-transform", openAEO === course.id && "rotate-180")} size={14} />
                      </button>
                      
                      <div className={openAEO === course.id ? "block mt-3 pt-4 border-t border-zinc-800 space-y-3" : "hidden"}>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Outcome</p>
                          <p className="text-[#A0A0A0] text-sm leading-snug">{course.become}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Problem Solved</p>
                          <p className="text-[#A0A0A0] text-sm leading-snug">{course.problemSolved}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Project</p>
                          <p className="text-[#A0A0A0] text-sm leading-snug">{course.willBuild}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">For Who</p>
                          <p className="text-[#A0A0A0] text-sm leading-snug">{course.forWho}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleEnroll(course.id)}
                      disabled={loading === course.id}
                      className="w-full bg-white text-black hover:bg-zinc-200 rounded-lg h-12 font-bold text-sm tracking-widest transition-colors duration-200"
                    >
                      {loading === course.id ? "Processing..." : "Enroll Now"}
                    </Button>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-center text-white/40 hover:text-white text-xs font-semibold tracking-widest transition-colors mt-2"
                    >
                      Explore Curriculum
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Special Bundle Card */}
            <div
              className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:bg-zinc-900/10 transition-colors flex flex-col md:flex-row lg:col-span-2"
            >
              <div className="relative w-full md:w-1/3 h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800">
                <div className="absolute inset-0 bg-zinc-900/40 flex items-center justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <Star size={100} className="text-white/5 absolute" />
                    <Award className="text-white/60 relative z-10" size={48} />
                  </div>
                </div>
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-white rounded-md text-xs font-semibold uppercase tracking-widest">
                    Value Bundle
                  </span>
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h5 className="text-white font-bold text-2xl mb-3 tracking-tight">Double Mastery Bundle</h5>
                    <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
                      Secure both Java and Python tracks at a significant discount. Perfect for engineers aiming for polyglot backend expertise.
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-green-500" />
                        Java Mastery
                      </div>
                      <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                        <CheckCircle2 size={16} className="text-green-500" />
                        Python Mastery
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-end p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1 line-through">₹1,298 Combined</p>
                    <p className="text-4xl font-bold text-white mb-6 tracking-tight">₹999</p>

                    <Button
                      onClick={() => handleEnroll("java-python-bundle")}
                      disabled={loading === "java-python-bundle"}
                      className="w-full md:w-56 h-12 rounded-lg bg-white text-black hover:bg-zinc-200 font-bold uppercase text-sm tracking-widest transition-colors duration-200"
                    >
                      {loading === "java-python-bundle" ? "Processing..." : "Get Bundle"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-32 max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Academy FAQ</h2>
            <p className="text-white/60 text-lg">Direct answers to common enrollment questions.</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
                <h4 className="text-white font-semibold text-lg mb-2 flex items-center gap-3">
                  <HelpCircle size={18} className="text-white/40" />
                  {faq.question}
                </h4>
                <p className="text-[#A0A0A0] leading-relaxed pl-7 border-l border-zinc-800">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Expansion Roadmap Section */}
        <section className="pb-20 mt-32">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-6 bg-white/10" />
              <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Academic Pipeline</span>
              <div className="h-px w-6 bg-white/10" />
            </div>
            <h3 className="text-white font-bold text-4xl md:text-5xl tracking-tight">Growth Roadmap</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMING_SOON.map((course, i) => (
              <div
                key={i}
                className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 min-h-[240px] flex flex-col justify-end overflow-hidden hover:bg-zinc-900/10 transition-colors"
              >
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                    <Lock className="text-white/40" size={20} />
                  </div>
                  <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium uppercase text-white/60 tracking-wider">
                    Enrollment Locked
                  </span>
                </div>
                <div className="relative pointer-events-none">
                  <h5 className="text-white font-bold text-xl mb-2 tracking-tight leading-tight">{course.title}</h5>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed font-medium line-clamp-3">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

