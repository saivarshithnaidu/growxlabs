import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "how-to-get-clients-from-website";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
    'en': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "How to Get Clients From Your Website | GrowX Labs",
    description: "Learn how to transform your website from a passive brochure into an active conversion engine and generate high-quality leads automatically.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function HowToGetClientsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to get clients from a website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To get clients from your website, you must transition from a passive brochure to an active conversion engine. This involves implementing a Value-First funnel: capturing leads with high-value offers, building trust through social proof, and simplifying the booking process with automated scheduling tools."
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
              How to get clients <br />
              <span className="text-primary">from your website?</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Stop treating your website like a digital business card. Learn how to transform it into a 24/7 lead generation machine.
            </p>
          </div>
        </Reveal>

        <AEOBlock 
          question="How do I turn my website visitors into paying clients?"
          answer="To get clients, your website must shift from a digital brochure to a conversion engine by offering immediate value (Lead Magnet), establishing authority (Case Studies), and providing a frictionless path to contact (Smart Forms)."
          explanation="Most websites fail because they talk about 'themselves' instead of solving a user's problem. By implementing a 'Value-First' funnel, you capture intent early and nurture it through automation, ensuring no lead falls through the cracks."
          example="A Law Firm replaces their generic 'Contact Us' button with a 'Free 5-Minute Case Assessment' tool. This captures critical details while providing the user instant feedback, leading to a 300% increase in qualified bookings."
          ctaText="Build your Growth System"
          ctaHref="/services"
        />

        <Reveal y={20} delay={0.2}>
          <div className="mt-20 p-10 rounded-[40px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <h2 className="text-white font-bold text-3xl mb-8">The 3-Step Growth Framework</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">1</div>
                <h3 className="text-white font-bold text-xl">Capture Intent</h3>
                <p className="text-white/50 text-sm">Use lead magnets and interactive tools to identify interested visitors early.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">2</div>
                <h3 className="text-white font-bold text-xl">Build Authority</h3>
                <p className="text-white/50 text-sm">Showcase real results and cryptographically signed certifications to build trust.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">3</div>
                <h3 className="text-white font-bold text-xl">Automate Conversion</h3>
                <p className="text-white/50 text-sm">Connect your website directly to your CRM and calendar for instant follow-ups.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 blur-[200px] -z-10 rounded-full" />
    </div>
  );
}
