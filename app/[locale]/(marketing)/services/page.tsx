import { ServiceCard } from "@/components/ui/ServiceCard";
import { Shield, Clock, Zap, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { locales, Link } from "@/navigation";
import Script from "next/script";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";
import { SubscriptionPlansSection } from "@/components/marketing/SubscriptionPlansSection";
import { AccordionFAQ } from "@/components/marketing/AccordionFAQ";
import { Button } from "@/components/ui/Button";

const faqData = [
  {
    question: "How do your digital systems improve revenue?",
    answer: "Our systems capture high-intent traffic, qualify leads quickly, and automate the conversion path so fewer opportunities are lost."
  },
  {
    question: "Do I need to manage the automation myself?",
    answer: "No. We build, deploy, document, and maintain the workflows so your team can focus on sales and delivery."
  },
  {
    question: "What is Technical SEO?",
    answer: "It is engineering your site structure, content model, speed, and schema so search engines and AI assistants can understand and recommend your business."
  },
  {
    question: "Can your systems scale with my business?",
    answer: "Yes. We use modern cloud infrastructure and modular workflows so your site, CRM, and automations can grow with demand."
  },
  {
    question: "What is the typical ROI timeline?",
    answer: "Most clients see operational savings immediately, while revenue improvements typically appear after the system has collected and converted traffic for several weeks."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const allServices = [
  {
    title: "Web Engineering",
    description: "High performance websites and applications built for speed, clarity, and conversion using modern full-stack architecture.",
    iconName: "code",
  },
  {
    title: "AI & Automations",
    description: "Lead follow-up, routing, reporting, and task automation that keeps your business responsive around the clock.",
    iconName: "settings",
  },
  {
    title: "Technical SEO",
    description: "Schema, content architecture, metadata, and performance improvements that help your business get discovered.",
    iconName: "trending",
  },
  {
    title: "Cloud Infrastructure",
    description: "Reliable hosting, monitoring, deployment, backups, and maintenance for sites that need to stay online.",
    iconName: "server",
  },
  {
    title: "Product Design",
    description: "Clean interfaces and user journeys that make complex services feel simple, credible, and easy to buy.",
    iconName: "globe",
  },
  {
    title: "Strategic Growth",
    description: "Audits, roadmaps, and experiments that reveal the fastest path from traffic to qualified revenue.",
    iconName: "zap",
  },
];

const proofPoints = [
  {
    icon: Shield,
    title: "Secure by default",
    text: "Authentication, data handling, and deployment decisions are reviewed before launch."
  },
  {
    icon: Clock,
    title: "Fast delivery rhythm",
    text: "Short build cycles, visible progress, and handover documentation keep momentum high."
  },
  {
    icon: Zap,
    title: "Built for action",
    text: "Every section, form, and automation is tied to a measurable business outcome."
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const languages: Record<string, string> = {
    "x-default": "https://growxlabs.tech/en-IN/services",
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/services`;
  });

  return {
    title: "Global Web Development & Automation Services | GrowXLabsTech",
    description: "AI-powered websites, n8n automation workflows, WhatsApp integration, and AI chatbots for businesses globally. Trusted by restaurants, real estate agencies, and growing businesses across USA, UK, Australia, and UAE.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/services`,
      languages
    }
  };
}

export default function ServicesPage() {
  return (
    <>
      <DynamicSchema
        graph={[
          {
            "@type": "Service",
            "@id": "https://growxlabs.tech/services/ai#service",
            "name": "AI Development",
            "provider": { "@id": "https://growxlabs.tech/#organization" },
            "areaServed": "Global",
            "description": "Custom AI systems, automation workflows, and intelligent applications."
          },
          {
            "@type": "Service",
            "@id": "https://growxlabs.tech/services/web#service",
            "name": "Web Engineering",
            "provider": { "@id": "https://growxlabs.tech/#organization" },
            "areaServed": "Global",
            "description": "High-performance websites with native AI integration."
          }
        ]}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center mb-20">
            <Reveal>
              <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF] mb-4 block">
                What we build
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-[clamp(40px,7vw,76px)] font-black text-[#1A1A1A] mb-7 tracking-tight leading-[1]">
                Services that turn your website into a growth system.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#6B7280] max-w-[760px] mx-auto text-lg leading-relaxed">
                We connect website engineering, automation, SEO, and cloud operations into one practical system: attract the right visitors, capture intent, follow up quickly, and measure what is working.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-24">
            {allServices.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.05}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>

          <Reveal y={40}>
            <div className="rounded-lg p-8 md:p-12 border border-[#E5E2DC] bg-white shadow-sm mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF]">Our delivery promise</span>
                  <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-black text-[#1A1A1A] tracking-tight leading-tight">
                    Serious engineering without agency fog.
                  </h2>
                  <p className="mt-5 text-[#6B7280] leading-relaxed">
                    You get clear scope, visible milestones, performance-first builds, and automations designed around your real business workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {proofPoints.map((point) => (
                    <div key={point.title} className="rounded-lg bg-[#F5F3EE] border border-[#E5E2DC] p-5">
                      <div className="w-11 h-11 rounded-md bg-white flex items-center justify-center mb-4">
                        <point.icon className="text-[#355CFF] h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-[#1A1A1A] mb-2">{point.title}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{point.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <section id="process" className="scroll-mt-28 mb-24">
            <Reveal>
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-3 block">
                  Process
                </span>
                <h2 className="text-[clamp(1.65rem,4vw,2.5rem)] font-black text-[#1A1A1A] tracking-tight leading-tight mb-3">
                  Idea to live system—three clear gates.
                </h2>
                <p className="text-[#6B7280] text-base leading-relaxed">
                  No fog: each step has a visible artifact you can forward to your team.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  title: "Discover",
                  rows: [
                    { k: "Missions", v: "Map revenue path + constraints" },
                    { k: "Inputs", v: "Traffic, offers, ops load" },
                    { k: "Output", v: "Scope, stack, timeline" },
                  ],
                },
                {
                  title: "Build",
                  rows: [
                    { k: "Missions", v: "Ship production-grade systems" },
                    { k: "Inputs", v: "Milestones + weekly reviews" },
                    { k: "Output", v: "Live site, automations, docs" },
                  ],
                },
                {
                  title: "Operate",
                  rows: [
                    { k: "Missions", v: "Measure, harden, iterate" },
                    { k: "Inputs", v: "Analytics + team feedback" },
                    { k: "Output", v: "Cadence you can run" },
                  ],
                },
              ].map((card) => (
                <Reveal key={card.title} delay={0.06}>
                  <div
                    className="h-full bg-white border border-[#E5E2DC] rounded-2xl p-6 md:p-7 shadow-sm relative overflow-hidden"
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                    }}
                  >
                    <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight mb-5 pr-2">{card.title}</h3>
                    <div className="divide-y divide-[#E5E2DC]">
                      {card.rows.map((row) => (
                        <div key={row.k} className="grid grid-cols-[minmax(0,88px)_1fr] gap-x-3 py-3 first:pt-0">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280] leading-snug">
                            {row.k}
                          </span>
                          <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <SubscriptionPlansSection />

          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[clamp(28px,4vw,40px)] font-black text-[#1A1A1A] mb-4 tracking-tight">Service FAQ</h2>
              <p className="text-[#6B7280]">Clear answers to help you understand the process.</p>
            </div>

            <Reveal delay={0.1}>
              <AccordionFAQ items={faqData} />
            </Reveal>
          </section>

          <div className="mt-24 text-center rounded-lg bg-[#1A1A1A] p-8 md:p-12">
            <h2 className="text-[clamp(28px,5vw,46px)] font-black text-white tracking-tight mb-4">
              Need a complete digital system?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Tell us what you sell, how leads currently arrive, and where your team loses time. We will map the system that fits.
            </p>
            <Link href="/contact">
              <Button className="h-14 px-8 rounded-md font-semibold inline-flex items-center gap-2">
                Start a project <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
