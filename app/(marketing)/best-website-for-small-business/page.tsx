import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "best-website-for-small-business";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "How to Get a Professional Website in 7 Days for Your Business | GrowXLabsTech",
    description: "Get a high-converting professional website in just 7 days. GrowXLabsTech builds AI-powered websites that capture leads and drive growth for businesses worldwide.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function SmallBusinessWebsitePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best website for a small business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best website for a small business is a Conversion-Focused Growth System. It must be mobile-optimized, load in under 2 seconds, and feature automated lead capture tools (like instant quotes or booking calendars) that allow the business to generate revenue even after hours."
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
              Best website for <br />
              <span className="text-primary">Small Business.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Stop wasting money on "pretty" websites that don't sell. Learn what your small business actually needs to thrive in the AI era.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="What kind of website is best for a small business?"
          answer="The best website for a small business is one that prioritizes conversion over aesthetics. It should include high-speed performance, mobile optimization, clear calls-to-action (CTAs), and automated tools that handle customer inquiries and bookings."
          explanation="Small businesses don't need 'digital art'; they need 'digital employees.' A website that doesn't capture leads or answer customer questions automatically is a wasted resource. It must work for you, not the other way around."
          example="A local plumbing business uses a website with an 'Instant Quote' calculator. This allows them to capture leads at 11 PM when no one is answering the phone, giving them a massive advantage over competitors."
          ctaText="Get a Small Business System"
          ctaHref="/services"
        />

        <Reveal y={20} delay={0.2}>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-white font-bold text-3xl">Why "Pretty" Isn't Enough</h2>
              <p className="text-white/50 leading-relaxed">
                Many agencies sell small businesses beautiful websites that are invisible to search engines and useless for conversions. At GrowXLabsTech, we focus on the metrics that matter:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-white font-bold">LCP Under 1.5s</p>
                    <p className="text-white/30 text-sm">Fast loading ensures you don't lose impatient mobile users.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-white font-bold">AEO Optimized</p>
                    <p className="text-white/30 text-sm">Be the first answer when users ask Siri or ChatGPT for local services.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Automated ROI</p>
                    <p className="text-white/30 text-sm">Integrated booking and payments turn browsers into buyers instantly.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 bg-card/[0.02] flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 blur-[100px]" />
              <div className="relative z-10 text-center p-10">
                <p className="text-primary font-black text-6xl mb-4 italic">90%</p>
                <p className="text-white font-bold text-xl leading-tight">of small business websites fail to generate a single lead per month.</p>
                <p className="text-white/30 mt-6 text-sm uppercase tracking-widest">Don't be one of them.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[300px] -z-10 rounded-full" />
    </div>
  );
}
