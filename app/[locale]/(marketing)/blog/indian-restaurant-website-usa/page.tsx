import React from "react";
import Image from "next/image";
import Script from "next/script";
import { Link, locales } from "@/navigation";
import { 
  ReadingProgressBar, 
  TableOfContents, 
  CopyCodeButton 
} from "@/components/marketing/BlogInteractive";
import { Reveal } from "@/components/marketing/Reveal";
import { ArrowRight, Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FlickerText } from "@/components/marketing/FlickerText";
import { AccordionFAQ } from "@/components/marketing/AccordionFAQ";
import { InsightCallout, WhyThisMatters, EditorialDivider, RelatedArticlesGrid } from "@/components/marketing/BlogEditorial";
import { InteractiveRestaurantWebsite } from "@/components/marketing/InteractiveRestaurantWebsite";


// ═══════════════════════════════════════════════════
// METADATA GENERATOR (Perfect SEO / AEO Optimization)
// ═══════════════════════════════════════════════════
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/indian-restaurant-website-usa";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  const title = "Indian Restaurant Website USA — Stop Paying 30% Commission to Platforms";
  const description = "Learn how custom ordering systems and automated marketing protect margins for Indian restaurants in the US, escaping commission fees while building customer databases.";

  return {
    title: `${title} | GrowXLabsTech`,
    description,
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    },
    openGraph: {
      title,
      description,
      url: `https://growxlabs.tech/${locale}/${path}`,
      siteName: "GrowXLabsTech",
      type: "article",
      publishedTime: "2026-01-15T08:30:00.000Z",
      authors: ["GrowXLabsTech"],
      images: [
        {
          url: "https://growxlabs.tech/images/blog-restaurant-website.png",
          width: 1200,
          height: 630,
          alt: "Indian Restaurant Direct Web Platform Schematic"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://growxlabs.tech/images/blog-restaurant-website.png"]
    }
  };
}

export default async function IndianRestaurantUSAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titleName = "DIRECT";

  // Headings array for the Table of Contents scrollspy
  const headings = [
    { id: "commission-model", text: "Escaping the Third-Party Platform Commission Trap" },
    { id: "direct-ordering", text: "The Power of a Direct Online Ordering System" },
    { id: "cultural-relevance", text: "Custom Technology Built for Indian Hospitality" },
    { id: "lead-engine", text: "Qualitative Customer Data Capture and Marketing" },
    { id: "database-sync", text: "Syncing Direct Ordering with Automated WhatsApp Alerts" },
    { id: "operation-scalability", text: "Scale Your Restaurant Operations Efficiently" },
    { id: "final-thoughts", text: "Final Thoughts" },
    { id: "faq", text: "Frequently Asked Questions" }
  ];

  // Q&A data for both visual UI rendering and search-engine validation schema
  const faqData = [
    {
      question: "How can a custom ordering system save my restaurant money in the US?",
      answer: "Third-party delivery platforms take 20% to 30% commission per order. A custom website with direct payment processing (using providers like Stripe) charges minimal card processing fees, enabling you to keep up to 97% of your revenue and build a customer database."
    },
    {
      question: "Why is owning guest data so critical for restaurants?",
      answer: "When a guest orders via a portal app, they belong to that aggregator—not to you. Direct websites capture phone numbers, emails, and dining habits, allowing zero-cost automated CRM follow-ups that incentivize regular visits."
    },
    {
      question: "Does the custom system support US tax structures and multiple branches?",
      answer: "Yes. Our direct ordering architectures feature granular sales tax mapping, localized menus, multi-location routing, and real-time printer connections managed under a single dashboard."
    }
  ];

  // Structured Data (JSON-LD) for SEO / AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://growxlabs.tech/${locale}/blog/indian-restaurant-website-usa/#article`,
        "headline": "Indian Restaurant Website USA — Stop Paying 30% Commission to Platforms",
        "description": "Learn how custom ordering systems and automated marketing protect margins for Indian restaurants in the US, escaping commission fees while building customer databases.",
        "datePublished": "2026-01-15T08:30:00Z",
        "dateModified": "2026-05-27T08:30:00Z",
        "image": "https://growxlabs.tech/images/blog-restaurant-website.png",
        "author": {
          "@type": "Organization",
          "name": "GrowXLabsTech",
          "url": "https://growxlabs.tech",
          "logo": "https://growxlabs.tech/logo.png"
        },
        "publisher": {
          "@type": "Organization",
          "name": "GrowXLabsTech",
          "logo": {
            "@type": "ImageObject",
            "url": "https://growxlabs.tech/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://growxlabs.tech/${locale}/blog/indian-restaurant-website-usa`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://growxlabs.tech/${locale}/blog/indian-restaurant-website-usa/#faq`,
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  // Related articles typographic lists
  const relatedArticles = [
    {
      title: "How Restaurants Worldwide Lose 30% of Regulars (And the Automation Fix)",
      href: "/blog/restaurant-customer-retention-automation",
      date: "Feb 18, 2026",
      readTime: "6 min read",
      category: "Restaurant / Retention"
    },
    {
      title: "WhatsApp Automation for Lead Nurturing — The 2026 Strategy",
      href: "/blog/whatsapp-automation-for-lead-nurturing",
      date: "Mar 28, 2026",
      readTime: "4 min read",
      category: "Automation / CRM"
    },
    {
      title: "n8n Automation for Business — Complete Global Guide 2026",
      href: "/blog/n8n-automation-for-business",
      date: "Apr 12, 2026",
      readTime: "5 min read",
      category: "Workflow Automation"
    }
  ];

  return (
    <div className="w-full bg-background min-h-screen text-foreground selection:bg-primary/10 selection:text-primary pt-32 pb-24">
      {/* Dynamic JSON-LD Structured Data */}
      <Script
        id="indian-restaurant-usa-schemas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Progress Bar */}
      <ReadingProgressBar />

      {/* ═══════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <header className="w-full border-b border-border pb-16 px-6 md:px-10 xl:px-16 2xl:px-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Massive Swiss Page Title with neon flickering */}
          <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mb-10">
            <h1 className="font-black select-none tracking-[-0.06em] text-foreground leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
              <FlickerText text={titleName} />
            </h1>
          </div>

          <Reveal y={20}>
            {/* Category Tag */}
            <div className="flex gap-2 justify-center items-center mb-6">
              <span className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-primary/5 px-2.5 py-1 rounded">
                Hospitality
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                US Market
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                Direct Sales
              </span>
            </div>

            {/* Editorial Title */}
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black leading-[1.1] tracking-tighter text-foreground mb-8 max-w-4xl mx-auto">
              Indian Restaurant Website USA:
              <br />
              <span className="text-primary">Stop Paying 30% Platform Commissions</span>
            </h2>

            {/* Excerpt */}
            <p className="text-[18px] md:text-[20px] text-[#A1A1AA] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
              Escape the aggregator commission model. Learn how custom digital infrastructure and automated ordering protect margins for Indian restaurateurs in the US.
            </p>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-6 sm:gap-10 font-mono text-[11px] tracking-[0.1em] text-[#9CA3AF] uppercase border-t border-b border-border py-5">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>By GrowXLabsTech</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>January 15, 2026</span>
              </div>
            </div>
          </Reveal>

          {/* Blueprint Banner */}
          <Reveal y={30} delay={0.2}>
            <div className="mt-14 w-full max-w-5xl mx-auto">
              <InteractiveRestaurantWebsite />
            </div>
          </Reveal>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 2. ARTICLE EXPERIENCE GRID                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <main className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 py-16">
        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 relative">
          
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <TableOfContents headings={headings} />
          </aside>

          {/* Core Article Body (Strict 70ch) */}
          <article className="col-span-12 lg:col-span-9 max-w-[720px] mx-auto lg:mx-0 blog-article">
            {/* Inline Table of Contents for Mobile */}
            <div className="lg:hidden mb-12 bg-card/60 border border-border rounded-xl p-6">
              <TableOfContents headings={headings} />
            </div>

            {/* Intro Content */}
            <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-8 font-sans blog-prose">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                The restaurant margin squeeze in the United States is at an all-time high.
              </p>
              <p>
                Indian hospitality in the US—representing some of the most vibrant, high-volume dining environments in major cities like New York, Chicago, San Francisco, and Dallas—is feeling the strain.
              </p>
              <p>
                While third-party delivery platforms bring volume, their **30% commission model** strips away nearly all net profitability.
              </p>
              <p>
                Successful restaurateurs are taking back control by building their own **direct digital ordering infrastructure**.
              </p>
            </div>

            {/* Divider Line */}
            <EditorialDivider />

            {/* Section 1 */}
            <section id="commission-model" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Escaping the Third-Party Platform Commission Trap
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Third-party food portals make big promises about audience reach, but they restrict direct customer contact completely.
                </p>
                <p>
                  Every delivery dispatched through their systems takes up to a third of your gross bill. For a high-volume Indian restaurant, this can easily translate to thousands of dollars in lost profit margins every month.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="direct-ordering" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                The Power of a Direct Online Ordering System
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  A dedicated online ordering system built natively into your restaurant's website bypasses aggregators entirely.
                </p>
                <p>
                  Transactions are processed securely through low-cost processors (like Stripe), leaving you with up to **97% of your revenue** instead of losing a third to an external platform.
                </p>
              </div>
            </section>

            {/* Insight Callout */}
            <InsightCallout variant="impact">
              A single restaurant switching from 100% platform-dependent orders to 50% direct orders can save $50,000–$80,000 annually in commission fees alone. That recovered margin funds better ingredients, higher staff wages, and marketing that actually builds your brand—not someone else's.
            </InsightCallout>

            {/* Section 3 */}
            <section id="cultural-relevance" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Custom Technology Built for Indian Hospitality
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Indian dining represents a unique blend of heritage, group dining dynamics, complex spicing structures, and high delivery demand.
                </p>
                <blockquote className="my-10 pl-6 border-l-3 border-primary italic text-[20px] text-[#A1A1AA] font-serif leading-relaxed">
                  "Generic restaurant templates fail because they don't capture the details of Indian hospitality—from catering requests and custom spice levels to banquet bookings. We engineer frameworks designed specifically around the operational needs of Indian-owned businesses."
                </blockquote>
              </div>
            </section>

            {/* Section 4 */}
            <section id="lead-engine" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Qualitative Customer Data Capture and Marketing
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  When a customer orders via a portal app, they are the platform's user.
                </p>
                <p>
                  When they order via your custom web system, you own the relationship. Every name, phone number, email, and order pattern is logged, enabling automated, zero-cost SMS and WhatsApp marketing campaigns that drive repeating orders natively.
                </p>
              </div>
            </section>

            {/* Why This Matters */}
            <WhyThisMatters>
              Every order placed through third-party platforms costs restaurants 25–30% in commissions while surrendering customer data—owning your digital infrastructure is no longer optional, it's survival. Restaurants that build direct ordering channels don't just save on fees; they accumulate a proprietary customer database that compounds in value with every transaction, creating a defensible moat that no aggregator can replicate.
            </WhyThisMatters>

            {/* Section 5 */}
            <section id="database-sync" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Syncing Direct Ordering with Automated WhatsApp Alerts
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Automation ensures operational harmony.
                </p>
                <p>
                  Our setups link ordering directly to instant WhatsApp dispatch notifications. Guests receive real-time updates on their order status, kitchen prep, and delivery progress directly on their primary chat apps, creating an incredibly modern customer experience.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="operation-scalability" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Scale Your Restaurant Operations Efficiently
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  As you open multiple branches in different states, managing centralized operations becomes critical.
                </p>
                <p>
                  Our unified administration panels enable simple multi-location tax mapping, real-time POS sync, localized menu routing, and automated staff dashboards under one cohesive portal.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="final-thoughts" className="scroll-mt-32 mt-16 space-y-6 font-serif italic text-[#A1A1AA]">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight not-italic font-sans">
                Final Thoughts
              </h2>
              <p>
                Culinary excellence is the heart of Indian hospitality, but direct digital systems are the protector of its margins.
              </p>
              <p>
                By building direct web ordering platforms and automating guest follow-ups, your brand breaks free of platform commissions, keeps its margins, and develops long-term asset value. Build direct paths and own your growth.
              </p>
              <p className="mt-8 font-sans font-bold text-foreground not-italic text-sm tracking-[0.1em] uppercase">
                — GrowXLabsTech
              </p>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 2.5 FAQ SECTION (Perfect AEO Validation)           */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="faq" className="scroll-mt-32 mt-16 pt-16 border-t border-border space-y-8">
              <div className="text-center md:text-left space-y-3">
                <span className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase font-bold">
                  Common Q&A
                </span>
                <h3 className="text-3xl font-black tracking-tight text-foreground">
                  Frequently Asked Questions
                </h3>
                <p className="text-[#9CA3AF] text-[15px] max-w-xl leading-relaxed">
                  Key details regarding direct online ordering, credit transaction processing, and CRM integration.
                </p>
              </div>
              <div className="mt-8">
                <AccordionFAQ items={faqData} />
              </div>
            </section>

            {/* Divider Line */}
            <EditorialDivider />

            {/* ═══════════════════════════════════════════════════ */}
            {/* 3. FINAL CTA SECTION                               */}
            {/* ═══════════════════════════════════════════════════ */}
            <Reveal y={20}>
              <div className="my-16 bg-[#EDEAE4] rounded-2xl p-8 md:p-12 border border-border text-center space-y-6">
                <span className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase font-bold">
                  Next-Gen digital engineering
                </span>
                <h3 className="text-[28px] md:text-[38px] font-black tracking-tight leading-tight text-foreground">
                  Building AI-native products
                  <br />
                  and AI engineering labs.
                </h3>
                <p className="text-[#9CA3AF] text-[15px] max-w-md mx-auto leading-relaxed">
                  We build high-performance software, advanced backend automations, and custom infrastructure tailored for global scale.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button variant="outline" className="border-primary/20 hover:border-primary/50 text-primary rounded-md px-8 h-12 text-[15px] font-semibold transition-all">
                      <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">Work With GrowXLabsTech <ArrowRight className="w-4 h-4 shrink-0" /></span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 4. RELATED ARTICLES SECTION                        */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="mt-16 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h4 className="font-mono text-[11px] tracking-[0.15em] text-[#9CA3AF] uppercase font-bold">
                  Related Insights
                </h4>
                <Link href="/blog" className="text-[12px] font-bold text-primary hover:underline inline-flex items-center gap-1">
                  View all articles <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <RelatedArticlesGrid articles={relatedArticles} />
            </section>

          </article>
        </div>
      </main>
    </div>
  );
}
