import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "website-vs-growth-system";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "What is an AI Native Digital Agency — And Why Your Business Needs One | GrowXLabsTech",
    description: "Discover why traditional digital agencies are failing and why your business needs an AI-native approach to survive and thrive in 2026.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function WebsiteVsSystemPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the difference between a website and a growth system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A traditional website is a static digital brochure that displays information. In contrast, a Growth System is a comprehensive digital infrastructure that combines a high-performance website with marketing automation, lead nurturing, and CRM integration to actively convert traffic into revenue."
        }
      }
    ]
  };

  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen">
      <Script
        id="aeo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <Reveal y={20}>
          <div className="mb-16">
            <h1 className="text-white font-bold text-[clamp(32px,5vw,64px)] leading-tight tracking-tighter mb-6 italic">
              Website vs. <br />
              <span className="text-primary">Growth System.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Don't just exist online. Compete online. Understand why a standard website is no longer enough for modern business.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="What is the difference between a website and a growth system?"
          answer="A website is a passive online address that merely displays information, while a Growth System is an active business infrastructure that integrates marketing, automated lead capture, and sales workflows to drive revenue."
          explanation="Websites are 'destinations' that wait for people to find them. Growth Systems are 'engines' that actively find, engage, and convert users through data-driven automation, essentially acting as a 24/7 sales team."
          example="A local bakery with a 'website' just has a menu and a map. A bakery with a 'Growth System' has an automated email list, loyalty rewards, and an online ordering system that upsells customers based on their history."
          ctaText="Upgrade to a Growth System"
          ctaHref="/services"
        />

        <Reveal y={20} delay={0.2}>
          <div className="mt-20">
            <h2 className="text-white font-bold text-3xl mb-12 text-center">Feature Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01] space-y-6">
                <h3 className="text-white/40 font-bold text-xl uppercase tracking-widest text-center">Passive Website</h3>
                <ul className="space-y-4">
                  <li className="text-white/30 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Static Content
                  </li>
                  <li className="text-white/30 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Generic Contact Form
                  </li>
                  <li className="text-white/30 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> No Lead Tracking
                  </li>
                  <li className="text-white/30 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Manual Follow-ups
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-[32px] border border-primary/20 bg-primary/[0.03] space-y-6">
                <h3 className="text-primary font-bold text-xl uppercase tracking-widest text-center">GrowXLabsTech Growth System</h3>
                <ul className="space-y-4">
                  <li className="text-white flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Dynamic Value Blocks
                  </li>
                  <li className="text-white flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Automated Lead Magnets
                  </li>
                  <li className="text-white flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Full CRM Integration
                  </li>
                  <li className="text-white flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Instant AI Responses
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Background Glow */}
      <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] bg-primary/5 blur-[200px] -z-10 rounded-full" />
    </div>
  );
}
