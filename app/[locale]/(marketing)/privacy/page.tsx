import { locales } from "@/navigation";
import { PrivacyContent } from "./PrivacyContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "privacy";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "Privacy Policy | GrowX Labs",
    description: "Learn how we protect your digital identity and project intelligence within the GrowX ecosystem.",
    alternates: {
      canonical: `https://growxlabs.tech/en-IN/${path}`,
      languages
    }
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
