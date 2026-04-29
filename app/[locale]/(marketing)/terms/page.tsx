import { locales } from "@/navigation";
import { TermsContent } from "./TermsContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "terms";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "Terms of Service | GrowX Labs",
    description: "Read the terms and conditions governing the professional digital engineering and automation services provided by GrowX Labs.",
    alternates: {
      canonical: `https://growxlabs.tech/en-IN/${path}`,
      languages
    }
  };
}

export default function TermsPage() {
  return <TermsContent />;
}
