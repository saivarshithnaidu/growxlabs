import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/indian-restaurant-website-usa";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "Indian Restaurant Website USA — Stop Paying 30% Commission to Platforms | GrowXLabsTech",
    description: "Are you an Indian restaurant owner in the USA? Learn how a custom website with automated ordering can save you 30% in platform fees and build your own customer list.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function IndianRestaurantUSAPage() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal y={20}>
          <div className="mb-16">
            <h1 className="text-white font-bold text-[clamp(32px,5vw,64px)] leading-tight tracking-tighter mb-6 italic">
              Indian Restaurant <br />
              <span className="text-primary">Website USA.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Stop letting DoorDash and UberEats take your profits. Build your own digital infrastructure and keep 100% of your revenue while automating your customer follow-ups.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="How can a custom website save my restaurant money in the USA?"
          answer="A custom website with its own ordering system eliminates the 20-30% commission charged by third-party platforms. It also allows you to capture customer data for direct marketing."
          explanation="When a customer orders via a platform, they are the 'platform's' customer. When they order via 'your' website, they are 'your' customer. You can then use automation to bring them back without paying for ads."
          example="An Indian restaurant in New Jersey switched to their own GrowXLabsTech system. They saved $2,400 in commissions in the first month and grew their direct order volume by 35%."
          ctaText="Own Your Restaurant Growth"
          ctaHref="/contact"
        />

        <div className="mt-20 space-y-12">
            <h2 className="text-white font-bold text-3xl">Take Back Control</h2>
            <p className="text-white/50 leading-relaxed text-lg">
                We specialize in helping Indian-owned businesses in the USA, UK, and Australia build world-class technology. We understand your culture and your business needs. Let's build a system that makes you independent of big platforms.
            </p>
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[300px] -z-10 rounded-full" />
    </div>
  );
}
