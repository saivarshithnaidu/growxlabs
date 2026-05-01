"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-primary font-bold uppercase tracking-widest text-xs">GrowX Labs Academy</span>
            </div>
            <h1 className="text-white font-bold text-5xl md:text-7xl tracking-tight max-w-4xl">
              Learn AI Engineering
            </h1>
            <p className="text-[#A0A0A0] text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Hands-on courses built by engineers who ship real AI products. Every course ends with a GrowX Labs certification.
            </p>
          </motion.div>
        </section>

        {/* Featured Course Track — AI Engineering */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Detailed Course Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8 group relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-10 md:p-14 transition-all duration-500 hover:border-white/10"
            >
              {/* AI Engineering AEO Section */}
              <div className="mb-12 p-8 rounded-2xl bg-white/[0.02] border border-white/5">
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

              <div className="absolute top-0 right-0 p-8">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                  Flagship Program
                </span>
              </div>

              <div className="relative z-10">
                <h2 className="text-primary font-semibold uppercase tracking-wider text-sm mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Core AI Track — Enrollment Open
                </h2>
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
                            className="text-primary mt-0.5 shrink-0 transition-transform group-hover:scale-110 duration-300"
                            size={18}
                          />
                          <span className="text-white/80 font-medium text-base leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-end gap-6 bg-white/[0.02] rounded-2xl p-8 border border-white/5">
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
                    <div className="pt-6 border-t border-white/5">
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
                        className="w-full h-14 rounded-xl bg-white text-black hover:bg-white/90 font-bold uppercase text-sm tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
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
                    <div className="h-px flex-grow bg-white/10" />
                  </div>
                  {MODULES.map((mod) => (
                    <div key={mod.id} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02]">
                      <button
                        onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-white/[0.04] transition-colors group"
                      >
                        <span className="text-white font-medium text-lg text-left tracking-tight group-hover:text-primary transition-colors">
                          {mod.title}
                        </span>
                        <ChevronDown
                          className={cn(
                            "text-white/40 transition-transform duration-300",
                            openModule === mod.id && "rotate-180 text-white"
                          )}
                          size={20}
                        />
                      </button>
                      <AnimatePresence>
                        {openModule === mod.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="bg-white/[0.01] border-t border-white/5"
                          >
                            <div className="p-6 text-white/60 leading-relaxed font-medium text-base">{mod.content}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Registration Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
                <div className="w-full">
                  <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-3 tracking-tight self-start">
                    <ShieldCheck className="text-primary" size={22} />
                    Global Credentials
                  </h4>
                </div>

                <CertificatePreview />

                <div className="text-center mt-6">
                  <div className="bg-white/5 border border-white/10 rounded-full py-1.5 px-4 inline-flex items-center gap-2 mb-4">
                    <ShieldCheck size={14} className="text-white/60" />
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Institutional Verification</span>
                  </div>
                  <p className="text-white/40 text-sm font-medium max-w-[260px] mx-auto leading-relaxed">
                    This certificate is cryptographically signed and globally verifiable via the GrowX Trust Protocol.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-10 text-black relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-[-20%] right-[-20%] w-[100%] h-[100%] bg-black/5 blur-[80px] rounded-full pointer-events-none" />
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
              </motion.div>
            </div>
          </div>
        </section>

        {/* Other Courses Grid */}
        <section className="mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-300 flex flex-col md:flex-row"
              >
                {/* Horizontal Image Section */}
                <div className="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-10" />
                  {course.image && (
                     <div className="absolute inset-0 bg-white/5" />
                  )}
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-semibold uppercase text-white/80 border border-white/10">
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
                      
                      <AnimatePresence>
                        {openAEO === course.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 space-y-3 border-t border-white/5 mt-3">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Outcome</p>
                                <p className="text-white/80 text-sm leading-snug">{course.become}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Problem Solved</p>
                                <p className="text-white/80 text-sm leading-snug">{course.problemSolved}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Project</p>
                                <p className="text-white/80 text-sm leading-snug">{course.willBuild}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">For Who</p>
                                <p className="text-white/80 text-sm leading-snug">{course.forWho}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleEnroll(course.id)}
                      disabled={loading === course.id}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-lg h-12 font-bold text-sm tracking-widest transition-all"
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
              </motion.div>
            ))}

            {/* Special Bundle Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="group relative bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500 flex flex-col md:flex-row lg:col-span-2"
            >
              <div className="relative w-full md:w-1/3 h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <Star size={100} className="text-white/10 animate-spin-slow absolute" />
                    <Award className="text-white/60 relative z-10" size={48} />
                  </div>
                </div>
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/10 border border-white/10 text-white rounded-md text-xs font-semibold uppercase tracking-widest">
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
                  <div className="flex flex-col justify-center items-center md:items-end p-8 bg-black/20 rounded-xl">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1 line-through">₹1,298 Combined</p>
                    <p className="text-4xl font-bold text-white mb-6 tracking-tight">₹999</p>

                    <Button
                      onClick={() => handleEnroll("java-python-bundle")}
                      disabled={loading === "java-python-bundle"}
                      className="w-full md:w-56 h-12 rounded-lg bg-white text-black hover:bg-white/90 font-bold uppercase text-sm tracking-widest transition-all"
                    >
                      {loading === "java-python-bundle" ? "Processing..." : "Get Bundle"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
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
              <div key={index} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h4 className="text-white font-semibold text-lg mb-2 flex items-center gap-3">
                  <HelpCircle size={18} className="text-white/40" />
                  {faq.question}
                </h4>
                <p className="text-white/60 leading-relaxed pl-7 border-l border-white/5">
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
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 min-h-[240px] flex flex-col justify-end transition-all duration-500 overflow-hidden hover:bg-white/[0.04]"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none z-20 transition-all duration-500 group-hover:backdrop-blur-0">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Lock className="text-white/40 transition-colors duration-300" size={20} />
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium uppercase text-white/60 tracking-wider">
                    Enrollment Locked
                  </span>
                </div>
                <div className="relative blur-[4px] group-hover:blur-0 transition-all duration-500 pointer-events-none">
                  <h5 className="text-white font-bold text-xl mb-2 tracking-tight leading-tight">{course.title}</h5>
                  <p className="text-white/60 text-sm leading-relaxed font-medium line-clamp-3">{course.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Dynamic Background Elements */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vw] bg-primary/5 blur-[250px] -z-10 rounded-full opacity-60 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 blur-[200px] -z-10 rounded-full opacity-40 pointer-events-none" />
    </div>
  );
}
