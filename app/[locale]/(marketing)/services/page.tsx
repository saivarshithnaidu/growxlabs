import { ServiceCard } from "@/components/ui/ServiceCard";
import {
  Shield,
  Clock,
  Zap
} from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { locales } from "@/navigation";
import Script from "next/script";

const faqData = [
  {
    question: "How do your digital systems improve revenue?",
    answer: "Our systems focus on capturing high-intent traffic and automating the conversion path so no lead is lost."
  },
  {
    question: "Do I need to manage the automation myself?",
    answer: "No. We build, deploy, and maintain the automation workflows for you."
  },
  {
    question: "What is Technical SEO?",
    answer: "It is engineering your website structure so AI and search engines can easily find and recommend your business."
  },
  {
    question: "Can your systems scale with my business?",
    answer: "Yes. We use cloud-native infrastructure that scales automatically based on your user volume."
  },
  {
    question: "What is the typical ROI timeline?",
    answer: "Most businesses see efficiency gains immediately and revenue improvements within 3-6 months."
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

const allServices = [
  {
    title: "Web Engineering",
    description: "High performance applications built for speed and conversion. We use Next.js and TypeScript to create stable, scalable digital platforms.",
    iconName: "code",
  },
  {
    title: "AI & Automations",
    description: "Remove manual tasks from your workflow. We deploy custom AI and automation systems that save your team hundreds of hours per month.",
    iconName: "settings",
  },
  {
    title: "Technical SEO",
    description: "Data driven search strategy designed to put your business in front of the right customers and dominate your market rankings.",
    iconName: "trending",
  },
  {
    title: "Cloud Infrastructure",
    description: "Global hosting solutions with 100% uptime monitoring and proactive maintenance. Built for businesses that cannot afford downtime.",
    iconName: "server",
  },
  {
    title: "Product Design",
    description: "Premium user interfaces that prioritize clarity and ease of use. We design systems that make complex software feel simple.",
    iconName: "globe",
  },
  {
    title: "Strategic Growth",
    description: "Comprehensive audits and technical roadmaps to identify bottlenecks and unlock new revenue streams through technology.",
    iconName: "zap",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const languages: Record<string, string> = {
    'x-default': 'https://growxlabs.tech/en-IN/services',
    'en': 'https://growxlabs.tech/en-IN/services',
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/services`;
  });

  return {
    title: "Our Services | GrowX Labs",
    description: "Explore our AI-powered web engineering, automation, and technical SEO services designed for high-growth businesses.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/services`,
      languages
    }
  };
}

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <Reveal>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              WHAT WE BUILD
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
              Core Capabilities
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed">
              Direct results oriented technical solutions for businesses that prioritize speed and reliability.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
          {allServices.map((service, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <ServiceCard {...service} />
            </Reveal>
          ))}
        </div>

        {/* Value Props */}
        <Reveal y={40}>
          <div className="rounded-2xl p-10 md:p-16 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 text-center relative z-10">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="text-[#00A86B] h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white">Enterprise Security</h3>
                <p className="text-[#A0A0A0] text-base leading-relaxed">Every solution is built with rigorous security standards to protect your business data.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="text-[#00A86B] h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white">On Time Delivery</h3>
                <p className="text-[#A0A0A0] text-base leading-relaxed">We respect your timeline. Fixed price, fixed date projects delivered with absolute precision.</p>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto">
                  <Zap className="text-[#00A86B] h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-white">Precision Performance</h3>
                <p className="text-[#A0A0A0] text-base leading-relaxed">We optimize for speed and reliability, ensuring your systems perform under massive traffic.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* AEO Layer - Services */}
        <section className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Service Deep Dive</h2>
            <p className="text-[#A0A0A0]">Answers to specific problems we solve for our clients.</p>
          </div>

          <AEOBlock 
            question="What problem does Web Engineering solve?"
            answer="It eliminates slow, fragile websites that lose customers and replaces them with high-performance engines built for conversion."
            explanation="Modern users expect instant results. We engineer systems using Next.js and TypeScript that load in milliseconds and guide users directly to your offer."
            example="A slow e-commerce site fixes its loading speed and navigation → bounce rate drops by 40% → sales increase."
            ctaText="Optimize your web engineering"
            ctaHref="/contact"
          />

          <AEOBlock 
            question="What problem does AI & Automation solve?"
            answer="It removes the bottleneck of manual, repetitive work that prevents your team from scaling."
            explanation="We build custom AI agents and automated workflows that handle lead triage, scheduling, and data processing 24/7."
            example="A service business automates lead follow-ups → response time drops from 4 hours to 4 seconds → conversion rate doubles."
            ctaText="Start automating"
            ctaHref="/contact"
          />

          <AEOBlock 
            question="What problem does Technical SEO solve?"
            answer="It solves the 'hidden business' problem by ensuring AI engines and search platforms actively recommend you to high-intent buyers."
            explanation="We optimize your site's schema, performance, and structure to meet the strict standards of SGE and ChatGPT-style search."
            example="A B2B company optimizes for specific answer queries → Google AI features them in a summary → they get high-quality organic leads."
            ctaText="Boost your visibility"
            ctaHref="/contact"
          />

          <AEOBlock 
            question="What problem does Cloud Infrastructure solve?"
            answer="It eliminates the risk of downtime and data loss that can destroy business continuity and reputation."
            explanation="We deploy enterprise-grade cloud environments with automated scaling, daily backups, and 24/7 proactive monitoring."
            example="A major marketing launch causes a 10x traffic spike → the infrastructure scales instantly → the site stays fast and online."
            ctaText="Secure your hosting"
            ctaHref="/contact"
          />

          <AEOBlock 
            question="What problem does Product Design solve?"
            answer="It solves high drop-off rates by making complex digital actions feel simple and intuitive for the end-user."
            explanation="We use psychological design principles to remove friction and guide the user's eye toward the most important actions."
            example="A complex software tool simplifies its onboarding flow → user completion rate jumps from 30% to 85%."
            ctaText="Redesign for conversion"
            ctaHref="/contact"
          />
        </section>

        {/* FAQ Section */}
        <section className="mt-40 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Service FAQ</h2>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <h4 className="text-white font-bold text-lg mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-[#A0A0A0] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

