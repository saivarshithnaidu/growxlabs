import { ServiceCard } from "@/components/ui/ServiceCard";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { HeroSection } from "@/components/marketing/HeroSection";
import { LeadEngineSection } from "@/components/marketing/LeadEngineSection";
import { ValuePropositions } from "@/components/marketing/ValuePropositions";
import { AccordionFAQ } from "@/components/marketing/AccordionFAQ";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "@/components/marketing/AnimatedSection";
import { locales } from "@/navigation";
import Script from "next/script";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      question: "What is GrowXLabsTech?",
      answer: "GrowXLabsTech is a global AI native product studio that builds AI powered websites, automation systems, and business growth tools for businesses worldwide. We specialize in helping restaurants, real estate agencies, and growing businesses stop losing customers through automated follow ups and intelligent systems."
    },
    {
      question: "Where is GrowXLabsTech based?",
      answer: "GrowXLabsTech is headquartered in India and operates globally. We serve clients across USA, UK, Australia, UAE, Canada, Singapore, and worldwide. All client work is done remotely with full transparency and regular updates."
    },
    {
      question: "What industries does GrowXLabsTech serve?",
      answer: "GrowXLabsTech serves restaurants, real estate agencies, clinics, salons, hotels, ecommerce businesses, SaaS companies, and any growing business that needs digital systems."
    },
    {
      question: "How does GrowXLabsTech work with international clients?",
      answer: "GrowXLabsTech works fully remotely with clients worldwide. Discovery calls are on Google Meet or Zoom. Payments are accepted via bank transfer, Stripe, Razorpay, or PayPal. Project updates are sent regularly via WhatsApp or email."
    },
    {
      question: "What makes GrowXLabsTech different from other agencies?",
      answer: "We combine AI-powered development tools with deep domain expertise to deliver projects faster and with higher quality than traditional agencies. Every system we build is engineered for measurable business growth."
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

      {/* ═══ LEAD ENGINE + GROWTH CONSOLE ═══ */}
      <LeadEngineSection />

      {/* ═══ VALUE PROPOSITIONS — Figma words ═══ */}
      <ValuePropositions />

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold text-[#1A1A1A] mb-4 tracking-tight">
              Everything you need to grow your business
            </h2>
            <p className="text-[#6B7280] max-w-[560px] mx-auto text-[17px] leading-relaxed">
              Powerful digital systems designed to generate leads, automate operations, and drive measurable revenue.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {mainServices.map((service, index) => (
              <AnimatedItem key={index}>
                <ServiceCard {...service} />
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>



      {/* ═══ CASE STUDIES ═══ */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-white/60 border-y border-[#E5E2DC]">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#355CFF] mb-3 block">OUR WORK</span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold text-[#1A1A1A] tracking-tight">Case Studies</h2>
          </AnimatedSection>
          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <AnimatedItem key={index}>
                <ProjectCard {...project} />
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* ═══ CTA — Editorial Phone Style ═══ */}
      <section className="w-full py-28 px-6 md:px-10 xl:px-16 2xl:px-24 bg-[#EDEAE4] overflow-hidden">
        <AnimatedSection className="max-w-7xl mx-auto text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF] mb-5 block">Ready for the next version?</span>
          <h2 className="text-[clamp(34px,6vw,68px)] font-black text-[#1A1A1A] tracking-tight leading-[1.05] mb-6">
            Let us redesign the system behind your growth.
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto text-lg leading-relaxed mb-9">
            We will turn your website, lead capture, and follow-up into one connected experience your team can actually use.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-14">
            <Link href="/contact">
              <Button className="bg-[#355CFF] text-white hover:bg-[#2A4AD4] rounded-md px-8 h-14 text-[16px] font-semibold shadow-sm transition-all inline-flex items-center gap-2 hover:gap-3" trackEvent="cta_clicked" trackProperties={{ location: 'cta_phone', text: 'Get in Touch' }}>
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" className="rounded-md px-8 h-14 text-[16px] font-semibold">
                View Work
              </Button>
            </Link>
          </div>
          <div className="relative w-[220px] sm:w-[280px] mx-auto">
            <Image
              src="/images/cta-phone.png"
              alt="GrowXLabsTech contact preview"
              width={280}
              height={320}
              className="mx-auto object-contain"
              priority={false}
            />
          </div>
        </AnimatedSection>
      </section>

      {/* ═══ FAQ — Accordion ═══ */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-[clamp(28px,4vw,36px)] font-bold text-[#1A1A1A] mb-4 tracking-tight">Common Questions</h2>
            <p className="text-[#6B7280] text-[16px]">Everything you need to know about working with us.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <AccordionFAQ items={faqData} />
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
