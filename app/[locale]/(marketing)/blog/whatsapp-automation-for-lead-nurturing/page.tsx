import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/whatsapp-automation-for-lead-nurturing";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "WhatsApp Automation for Lead Nurturing — The 2026 Strategy | GrowXLabsTech",
    description: "WhatsApp has a 98% open rate. Learn how to use WhatsApp automation to nurture leads, answer questions, and close deals while you sleep.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function WhatsappAutomationPage() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal y={20}>
          <div className="mb-16">
            <h1 className="text-white font-bold text-[clamp(32px,5vw,64px)] leading-tight tracking-tighter mb-6 italic">
              WhatsApp Lead <br />
              <span className="text-primary">Nurturing Automation.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Emails get ignored. WhatsApp gets read. Learn how to use the world's most popular messaging app to turn cold leads into hot buyers automatically.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="Why use WhatsApp for lead nurturing?"
          answer="WhatsApp has a 98% open rate compared to 20% for email. It allows for instant, personal communication that builds trust and accelerates the sales cycle."
          explanation="By automating your WhatsApp responses and follow-up sequences, you can engage leads the moment they show interest, significantly increasing your conversion rate."
          example="A car dealership in Dubai uses WhatsApp automation to send a video walkthrough of a car immediately after a user submits an enquiry. Bookings for test drives increased by 400%."
          ctaText="Start WhatsApp Automation"
          ctaHref="/services"
        />

        <div className="mt-20 space-y-12">
            <h2 className="text-white font-bold text-3xl">The Power of Instant Response</h2>
            <p className="text-white/50 leading-relaxed text-lg">
                In 2026, speed is the ultimate competitive advantage. If you don't respond to a lead within 60 seconds, your competitor will. WhatsApp automation ensures you are always the first to respond, regardless of the timezone.
            </p>
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[300px] -z-10 rounded-full" />
    </div>
  );
}
