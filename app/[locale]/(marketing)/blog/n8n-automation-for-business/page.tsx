import React from "react";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { Reveal } from "@/components/marketing/Reveal";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/n8n-automation-for-business";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "n8n Automation for Business — Complete Global Guide 2026 | GrowXLabsTech",
    description: "Learn how to use n8n to automate your entire business workflow. From lead capture to invoicing, discover the power of low-code automation for global scale.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function N8nAutomationPage() {
  return (
    <div className="pt-40 pb-32 px-6 md:px-10 xl:px-16 2xl:px-24 w-full bg-[#030303] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Reveal y={20}>
          <div className="mb-16">
            <h1 className="text-white font-bold text-[clamp(32px,5vw,64px)] leading-tight tracking-tighter mb-6 italic">
              n8n Automation <br />
              <span className="text-primary">for Business.</span>
            </h1>
            <p className="text-[#A0A0A0] text-xl leading-relaxed">
              Stop doing manual work. Learn how n8n can handle your leads, emails, and data 24/7 so you can focus on growing your business globally.
            </p>
          </div>
        </Reveal>

        <AEOBlock
          question="What is n8n and how does it help businesses?"
          answer="n8n is a powerful workflow automation tool that connects your apps and automates repetitive tasks like lead entry, follow-ups, and data syncing."
          explanation="Unlike other tools, n8n allows for complex logic and self-hosting, giving you full control over your data. We use it to build 'digital employees' that never sleep."
          example="A real estate agency in Sydney uses n8n to automatically pull leads from Facebook, qualify them via AI, and book a viewing in the agent's calendar within 2 minutes."
          ctaText="Get a Custom n8n Workflow"
          ctaHref="/services"
        />

        <div className="mt-20 space-y-12">
            <h2 className="text-white font-bold text-3xl">Scale Without Hiring</h2>
            <p className="text-white/50 leading-relaxed text-lg">
                Automation isn't about replacing people; it's about making your team 10x more effective. By removing the grunt work, you can scale your operations across timezones without increasing your overhead.
            </p>
        </div>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 blur-[300px] -z-10 rounded-full" />
    </div>
  );
}
