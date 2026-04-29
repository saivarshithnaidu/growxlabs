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

export default function AboutPage() {
  return <AboutContent />;
}
