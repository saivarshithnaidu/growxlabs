import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Pricing | GrowXLabsTech",
    description: "Transparent, value-based pricing for our AI-powered digital engineering services. No hidden costs, just results.",
    alternates: {
      canonical: "https://growxlabs.tech/pricing",
    }
  };
}

export default function PricingPage() {
  redirect("/services#subscriptions");
  return null;
}
