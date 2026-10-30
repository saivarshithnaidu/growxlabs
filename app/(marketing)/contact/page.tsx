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
            "about": { "@id": "https://growxlabs.tech/#organization" },
            "telephone": "+91-9381188153"
          }
        ]} 
      />
      <ContactContent />
    </>
  );
}
