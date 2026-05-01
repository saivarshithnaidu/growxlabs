import { locales } from "@/navigation";
import { ContactContent } from "./ContactContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "contact";
  
  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "Contact GrowX Labs | Get a Custom AI Strategy",
    description: "Ready to automate your business and grow faster? Contact GrowX Labs today for a custom AI and automation strategy. Response within 4 hours.",
    alternates: {
      canonical: `https://growxlabs.tech/en-IN/${path}`,
      languages
    }
  };
}

import { DynamicSchema } from "@/components/marketing/DynamicSchema";

export default function ContactPage() {
  return (
    <>
      <DynamicSchema 
        graph={[
          {
            "@type": "ContactPage",
            "@id": "https://growxlabs.tech/contact#page",
            "about": { "@id": "https://growxlabs.tech/#organization" }
          }
        ]} 
      />
      <ContactContent />
    </>
  );
}

