import { locales } from "@/navigation";
import { CareersContent } from "./CareersContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "careers";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "Careers | GrowX Labs",
    description: "Join GrowX Labs Tech. Build cinematic web systems, autonomous workflows, and modern products with senior engineers.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default function CareersPage() {
  return <CareersContent />;
}
