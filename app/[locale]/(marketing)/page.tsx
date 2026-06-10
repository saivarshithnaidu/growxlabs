import { ServiceCard } from "@/components/ui/ServiceCard";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { HeroSection } from "@/components/marketing/HeroSection";
import { SectionG } from "@/components/marketing/SectionG";
import { SectionR } from "@/components/marketing/SectionR";
import { SectionO } from "@/components/marketing/SectionO";
import { SectionW } from "@/components/marketing/SectionW";
import { SectionX } from "@/components/marketing/SectionX";
import { LeadEngineSection } from "@/components/marketing/LeadEngineSection";
import { ValuePropositions } from "@/components/marketing/ValuePropositions";
import { AccordionFAQ } from "@/components/marketing/AccordionFAQ";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { HotlineConsole } from "@/components/marketing/HotlineConsole";
import { PipelineSection } from "@/components/marketing/PipelineSection";
import { locales } from "@/navigation";
import Script from "next/script";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const languages: Record<string, string> = {
    'x-default': 'https://growxlabs.tech/en-IN',
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}`;
  });

  return {
    title: "GrowXLabsTech — AI Native Product Studio | Websites & Automation for Businesses Worldwide",
    description: "GrowXLabsTech is a global AI native product studio building AI powered websites, automation systems, and business growth tools. We help restaurants, real estate agencies, and growing businesses worldwide generate leads and scale with intelligent digital systems. Serving India, USA, UK, Australia, UAE, and Canada.",
    keywords: "AI agency, AI native digital agency, web agency, n8n automation agency, restaurant automation, real estate CRM, WhatsApp automation business, business automation agency, AI web agency, lead capture automation, automated follow up system, GrowXLabsTech",
    alternates: {
      canonical: "https://growxlabs.tech/en-IN",
      languages
    }
  };
}

export default function Home() {
  const faqData = [
    {
      question: "What is GrowXLabs.tech?",
      answer: "GrowXLabs.tech is a global AI-native product studio that builds high-performance websites, automation systems, and growth systems for ambitious businesses worldwide. We specialize in helping restaurants, real estate agencies, and scaling brands stop losing customers through automated follow-ups and custom workflows."
    },
    {
      question: "Where is GrowXLabs.tech based?",
      answer: "GrowXLabs.tech is headquartered in India and operates globally. We serve clients across the USA, UK, Europe, Australia, UAE, Canada, Singapore, and worldwide. All client work is done remotely with full transparency and regular async updates."
    },
    {
      question: "What industries does GrowXLabs.tech serve?",
      answer: "GrowXLabs.tech serves restaurants, real estate agencies, hotels, clinics, e-commerce brands, SaaS platforms, B2B service firms, and any growing business that wants to automate customer acquisition."
    },
    {
      question: "How does GrowXLabs.tech work with international clients?",
      answer: "GrowXLabs.tech works fully remotely with clients worldwide. Discovery and alignment calls are scheduled on Google Meet or Zoom. We support secure international bank transfers, Stripe, and PayPal, and send updates via WhatsApp, Slack, or email."
    },
    {
      question: "What makes GrowXLabs.tech different from other agencies?",
      answer: "We combine AI-powered development tools with deep software engineering expertise to build systems faster and with higher fidelity than traditional agencies. Every platform we build is optimized for measurable conversion and speed."
    },
    {
      question: "What tech stack and frameworks do you use to build projects?",
      answer: "We build with a high-performance, future-proof stack: Next.js (React) as our primary framework, TypeScript for type safety, Tailwind CSS for clean responsive layouts, and Framer Motion for premium micro-animations. For backend automations, we leverage n8n, node.js, and cloud integrations. Everything is hosted on secure cloud infrastructure like AWS, Vercel, or highly optimized VPS setups."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel with 15 days notice. No lock-in."
    },
    {
      question: "What if I need a website first?",
      answer: "We build your website first (one-time), then you move to subscription."
    },
    {
      question: "Do you serve outside India?",
      answer: "Yes. USD pricing available."
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

  const mainServices = [
    {
      title: "Web Engineering",
      description: "High-performance digital platforms that convert visitors into customers at scale.",
      iconName: "code",
    },
    {
      title: "AI & Automation",
      description: "Custom AI workflows and automation systems that eliminate manual work and drive growth.",
      iconName: "settings",
    },
    {
      title: "Technical SEO",
      description: "Dominant search visibility engineered to capture high-intent traffic and revenue.",
      iconName: "trending",
    },
    {
      title: "Cloud Infrastructure",
      description: "Secure, scalable hosting designed for 100% uptime and business continuity.",
      iconName: "server",
    },
  ];

  return (
    <div className="flex flex-col">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══ HERO (studio + brand only) ═══ */}
      <HeroSection />

      {/* ═══ Swiss-Editorial Sections (G, R, O, W, X) ═══ */}
      <SectionG />
      <SectionR />
      <SectionO />
      <SectionW />
      <SectionX />



      {/* ═══ EXPLORE NAVIGATIONS ═══ */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-card/60 border-y border-border">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-primary mb-3 block">OUR WORK</span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-sans font-black text-foreground tracking-tight">Explore Our Systems</h2>
          </AnimatedSection>
          
          <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PORTFOLIO CARD */}
            <AnimatedItem>
              <Link href="/portfolio" className="group block h-full">
                <div className="relative h-full flex flex-col justify-between bg-[#111111] text-white border border-white/5 rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl transition-[border-color,background-image,box-shadow] duration-500 hover:border-[#C0F0FB]/35 hover:bg-[radial-gradient(circle_at_top_right,rgba(192,240,251,0.06),transparent_60%)] min-h-[460px]">
                  {/* Top line with title and circular arrow */}
                  <div className="flex justify-between items-start z-10">
                    <h3 className="text-[clamp(28px,3vw,38px)] font-sans font-black tracking-tight leading-[1.05] max-w-[280px]">
                      Explore Our Portfolio
                    </h3>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C0F0FB] group-hover:text-black group-hover:border-[#C0F0FB] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Central geometric SVG animation - GPU safe opacity transition */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] group-hover:opacity-[0.16] transition-opacity duration-700">
                    <svg viewBox="0 0 100 100" className="w-72 h-72 text-white group-hover:text-[#C0F0FB] group-hover:scale-[1.03] transition-all duration-700" fill="none" stroke="currentColor" strokeWidth="0.5">
                      <path d="M50 10 L90 50 L50 90 L10 50 Z" />
                      <path d="M50 20 L80 50 L50 80 L20 50 Z" />
                      <path d="M50 30 L70 50 L50 70 L30 50 Z" />
                      <path d="M50 40 L60 50 L50 60 L40 50 Z" />
                      <line x1="50" y1="10" x2="50" y2="90" />
                      <line x1="10" y1="50" x2="90" y2="50" />
                      <line x1="20" y1="50" x2="50" y2="20" />
                      <line x1="80" y1="50" x2="50" y2="20" />
                      <line x1="20" y1="50" x2="50" y2="80" />
                      <line x1="80" y1="50" x2="50" y2="80" />
                    </svg>
                  </div>

                  {/* Bottom description & status indicators */}
                  <div className="z-10 mt-auto pt-16">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                      <span>[ EXPLORE ]</span>
                      <span>[ CLIENT WORK ]</span>
                    </div>
                    <p className="text-white/70 text-[15px] leading-relaxed max-w-md font-sans">
                      Discover high-performance systems, custom automation pipelines, and high-converting websites engineered for global brands.
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedItem>

            {/* LABS CARD */}
            <AnimatedItem>
              <Link href="/products" className="group block h-full">
                <div className="relative h-full flex flex-col justify-between bg-[#111111] text-white border border-white/5 rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl transition-[border-color,background-image,box-shadow] duration-500 hover:border-[#6366F1]/35 hover:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_60%)] min-h-[460px]">
                  {/* Top line with title and circular arrow */}
                  <div className="flex justify-between items-start z-10">
                    <h3 className="text-[clamp(28px,3vw,38px)] font-sans font-black tracking-tight leading-[1.05] max-w-[280px]">
                      Explore Our Labs
                    </h3>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#6366F1] group-hover:text-white group-hover:border-[#6366F1] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Central geometric SVG animation - GPU safe opacity transition */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] group-hover:opacity-[0.16] transition-opacity duration-700">
                    <svg viewBox="0 0 100 100" className="w-72 h-72 text-white group-hover:text-[#6366F1] group-hover:scale-[1.03] transition-all duration-700" fill="none" stroke="currentColor" strokeWidth="0.5">
                      <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
                      <line x1="50" y1="50" x2="50" y2="10" />
                      <line x1="50" y1="50" x2="85" y2="30" />
                      <line x1="50" y1="50" x2="85" y2="70" />
                      <line x1="50" y1="50" x2="50" y2="90" />
                      <line x1="50" y1="50" x2="15" y2="70" />
                      <line x1="50" y1="50" x2="15" y2="30" />
                      <polygon points="50,25 72,37 72,63 50,75 28,63 28,37" />
                      <circle cx="50" cy="50" r="1.5" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Bottom description & status indicators */}
                  <div className="z-10 mt-auto pt-16">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                      <span>[ EXPLORE ]</span>
                      <span>[ OWN PRODUCTS ]</span>
                    </div>
                    <p className="text-white/70 text-[15px] leading-relaxed max-w-md font-sans">
                      Test and use proprietary AI SaaS platforms, experimental research tools, and open-source models crafted by our studio.
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      <PipelineSection />

      <section className="w-full py-20 px-6 md:px-10 xl:px-16 2xl:px-24 bg-background overflow-hidden">
        <AnimatedSection className="max-w-7xl mx-auto text-center">
          <HotlineConsole />
        </AnimatedSection>
      </section>

      {/* ═══ FAQ — Accordion ═══ */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-[clamp(28px,4vw,36px)] font-bold text-foreground mb-4 tracking-tight">Common Questions</h2>
            <p className="text-muted-foreground text-[16px]">Everything you need to know about working with us.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <AccordionFAQ items={faqData} />
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="text-center mt-12">
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-background hover:bg-card text-foreground text-[12px] font-bold tracking-[0.15em] uppercase transition-all shadow-sm active:scale-95 group font-mono"
            >
              <span>View All FAQs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ AEO — Hidden, SEO only ═══ */}
      <section className="sr-only" aria-hidden="true">
        <div className="max-w-5xl mx-auto">
          <AEOBlock question="What does GrowXLabsTech actually do?" answer="GrowXLabsTech builds complete digital systems that help businesses generate leads, automate workflows, and convert visitors into paying customers." explanation="Most websites only display information. We build systems that guide users to take action and turn traffic into revenue." example="A visitor lands → fills form → automation follows up → business closes the lead." ctaText="Start building your system" ctaHref="/contact" />
          <AEOBlock question="Why most business websites fail to get clients?" answer="Most websites are built as digital brochures that lack conversion triggers, lead capture systems, and automated follow-ups." explanation="A website without a growth system is just a cost. We transform it into an asset by engineering every element to drive user intent toward a conversion." example="A beautiful site gets 1,000 visitors but 0 leads because there's no clear hook or automation to capture interest." ctaText="Audit your website" ctaHref="/contact" />
          <AEOBlock question="How does GrowXLabsTech help you get clients?" answer="We deploy a 4-step growth engine: Build performance foundation → Integrate lead capture → Automate follow-ups → Optimize for scale." explanation="This end-to-end approach ensures no lead is wasted and your sales process runs 24/7 without manual effort." example="Instead of manually emailing leads, our system qualifies them and books meetings while you sleep." ctaText="See how it works" ctaHref="/services" />
        </div>
      </section>
    </div>
  );
}
