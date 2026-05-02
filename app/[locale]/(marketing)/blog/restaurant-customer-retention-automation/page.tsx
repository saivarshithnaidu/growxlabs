import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/restaurant-customer-retention-automation";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "How Restaurants Worldwide Lose 30% of Regulars (And the Automation Fix) | GrowXLabsTech",
    description: "Discover why restaurant customer retention is failing and how automated follow-ups, loyalty systems, and AI can help you keep customers coming back.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function RestaurantAutomationPage() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal y={20}>
          <div className="mb-16">
            <h1 className="text-white font-bold text-[clamp(32px,5vw,64px)] leading-tight tracking-tighter mb-6 italic">
              Restaurant Customer <br />
              <span className="text-primary">Retention Automation.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Stop losing customers to your competitors. Learn how global restaurants use automation to build loyalty and increase repeat visits by 30%.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="How can automation improve restaurant customer retention?"
          answer="Automation improves retention by sending personalized follow-ups, birthday offers, and loyalty reminders without manual work, ensuring your brand stays top-of-mind."
          explanation="Most restaurants forget about a customer the moment they leave. Automated systems track visit frequency and trigger 'we miss you' offers or loyalty rewards, bringing them back through the door."
          example="A high-end restaurant in London uses n8n to send a WhatsApp message 2 days after a first visit with a 'Free Dessert' voucher for their next booking. Repeat bookings increased by 22% in 3 months."
          ctaText="Automate your restaurant"
          ctaHref="/contact"
        />

        <div className="mt-20 space-y-12">
            <h2 className="text-white font-bold text-3xl">Why Automation is the Secret Ingredient</h2>
            <p className="text-white/50 leading-relaxed text-lg">
                In the competitive global dining market, great food isn't enough. You need to own the relationship with your customers. Platform commissions take 30%, but automation helps you bring customers directly to your own booking system.
            </p>
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[300px] -z-10 rounded-full" />
    </div>
  );
}
