import { ContactContent } from "./ContactContent";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";

export async function generateMetadata() {
  return {
    title: "Contact GrowxLabs | Technical Discovery & Engagements",
    description: "Schedule a technical discovery conversation with GrowxLabs. Direct line / WhatsApp: +91 93811 88153 | Email: svp@growxlabs.tech. We work with organizations globally.",
    alternates: {
      canonical: "https://growxlabs.tech/contact"
    }
  };
}

export default function ContactPage() {
  return (
    <>
      <DynamicSchema 
        graph={[
          {
            "@type": "ContactPage",
            "@id": "https://growxlabs.tech/contact#page",
            "name": "Contact GrowxLabs",
            "description": "Contact GrowxLabs for enterprise AI engineering, intelligent workflows, and custom software development.",
            "url": "https://growxlabs.tech/contact",
            "mainEntity": {
              "@type": "Organization",
              "@id": "https://growxlabs.tech/#organization",
              "name": "GrowxLabs",
              "telephone": "+91-9381188153",
              "email": "svp@growxlabs.tech",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9381188153",
                "email": "svp@growxlabs.tech",
                "contactType": "customer service and sales",
                "availableLanguage": ["English", "Telugu", "Hindi"],
                "areaServed": "Worldwide"
              }
            }
          }
        ]} 
      />
      <ContactContent />
    </>
  );
}
