import { locales, Link } from "@/navigation";
import { AccordionFAQ } from "@/components/marketing/AccordionFAQ";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Script from "next/script";

const faqData = [
  {
    question: "What is GrowXLabs.tech?",
    answer: "GrowXLabs.tech is a global AI-native product studio that builds high-performance websites, automation systems, and growth systems for ambitious businesses worldwide. We specialize in helping restaurants, real estate agencies, and scaling brands stop losing customers through automated follow-ups and custom workflows."
  },
  {
    question: "Where is GrowXLabs.tech based?",
    answer: "GrowXLabs.tech is a global studio. We serve clients worldwide remotely with full transparency and regular async updates."
  },
  {
    question: "What industries does GrowXLabs.tech serve?",
    answer: "GrowXLabs.tech serves restaurants, real estate agencies, hotels, clinics, e-commerce brands, SaaS platforms, B2B service firms, and any growing business that wants to automate customer acquisition."
  },
  {
    question: "How does GrowXLabs.tech work with international clients?",
    answer: "GrowXLabs.tech works fully remotely with clients worldwide. Discovery and alignment calls are scheduled on Google Meet or Zoom. We support secure international bank transfers, Stripe, and PayPal, and send updates via WhatsApp, Slack, or email."
  },
  {
    question: "What makes GrowXLabs.tech different from other agencies?",
    answer: "We combine AI-powered development tools with deep software engineering expertise to build systems faster and with higher fidelity than traditional agencies. Every platform we build is optimized for measurable conversion and speed."
  },
  {
    question: "What tech stack and frameworks do you use to build projects?",
    answer: "We build with a high-performance, future-proof stack: Next.js (React) as our primary framework, TypeScript for type safety, Tailwind CSS for clean responsive layouts, and Framer Motion for premium micro-animations. For backend automations, we leverage n8n, node.js, and cloud integrations. Everything is hosted on secure cloud infrastructure like AWS, Vercel, or highly optimized VPS setups."
  },
  {
    question: "How do your digital systems improve revenue?",
    answer: "Our systems capture high-intent traffic, qualify leads quickly, and automate the conversion path so fewer opportunities are lost."
  },
  {
    question: "Do I need to manage the automation myself?",
    answer: "No. We build, deploy, document, and maintain the workflows so your team can focus on sales and delivery."
  },
  {
    question: "What is Technical SEO?",
    answer: "It is engineering your site structure, content model, speed, and schema so search engines and AI assistants can understand and recommend your business."
  },
  {
    question: "Can your systems scale with my business?",
    answer: "Yes. We use modern cloud infrastructure and modular workflows so your site, CRM, and automations can grow with demand."
  },
  {
    question: "What is the typical ROI timeline?",
    answer: "Most clients see operational savings immediately, while revenue improvements typically appear after the system has collected and converted traffic for several weeks."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel with 15 days notice. No lock-in."
  },
  {
    question: "What if I need a website first?",
    answer: "We build your website first (one-time), then you move to subscription."
  },
  {
    question: "What currencies and pricing options do you support?",
    answer: "We support USD and major global currencies. Pricing options are transparent and tailored to your system requirements."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const languages: Record<string, string> = {
    "x-default": "https://growxlabs.tech/en-IN/faq",
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/faq`;
  });

  return {
    title: "FAQ | GrowXLabsTech",
    description: "Frequently Asked Questions about our web development, automation systems, and operations.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/faq`,
      languages
    }
  };
}

export default function FAQPage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title="FAQ"
        viewingText="FAQ"
        exploreText="HELP & ANSWERS"
        tagline="QUESTIONS"
      />

      <div className="pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full border-t border-border/20 pt-16">
        <div className="max-w-4xl mx-auto">
          <section className="max-w-4xl mx-auto mb-24">
            <AccordionFAQ items={faqData} />
          </section>

          <div className="text-center rounded-lg bg-[#1A1A1A] p-8 md:p-12">
            <h2 className="text-[clamp(28px,5vw,46px)] font-black text-white tracking-tight mb-4">
              Need a complete digital system?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Tell us what you sell, how leads currently arrive, and where your team loses time. We will map the system that fits.
            </p>
            <Link href="/contact">
              <Button className="h-14 px-8 rounded-md font-semibold inline-flex items-center gap-2">
                Start a project <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
