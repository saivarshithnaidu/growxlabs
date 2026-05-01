import { locales } from "@/navigation";
import { AboutContent } from "./AboutContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "about";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "About GrowX Labs | AI-Native Growth Engineering",
    description: "Learn about the founding engineers and the mission of GrowX Labs to deliver enterprise-grade digital infrastructure through AI and automation.",
    alternates: {
      canonical: `https://growxlabs.tech/en-IN/${path}`,
      languages
    }
  };
}

import { DynamicSchema } from "@/components/marketing/DynamicSchema";

export default function AboutPage() {
  return (
    <>
      <DynamicSchema 
        graph={[
          {
            "@type": "Organization",
            "@id": "https://growxlabs.tech/#organization",
            "description": "AI-native digital agency building AI-powered systems and products.",
            "founder": [
              { "@id": "https://growxlabs.tech/#varshith" },
              { "@id": "https://growxlabs.tech/#akhilesh" }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Guntur",
              "addressRegion": "Andhra Pradesh",
              "addressCountry": "India"
            }
          }
        ]} 
      />
      <AboutContent />
    </>
  );
}

