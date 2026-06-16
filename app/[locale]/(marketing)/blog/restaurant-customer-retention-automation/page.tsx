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
import { InteractiveRestaurantRetention } from "@/components/marketing/InteractiveRestaurantRetention";


// ═══════════════════════════════════════════════════
// METADATA GENERATOR (Perfect SEO / AEO Optimization)
// ═══════════════════════════════════════════════════
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/restaurant-customer-retention-automation";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  const title = "How Restaurants Worldwide Lose 30% of Regulars (And the Automation Fix)";
  const description = "Discover why restaurant customer retention is failing in competitive markets and how automated loyalty sequences and AI re-engagement loops bring diners back.";

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
      publishedTime: "2026-02-18T08:30:00.000Z",
      authors: ["GrowXLabsTech"],
      images: [
        {
          url: "https://growxlabs.tech/images/blog-restaurant-retention.png",
          width: 1200,
          height: 630,
          alt: "Restaurant Customer Retention Loop Schematic"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://growxlabs.tech/images/blog-restaurant-retention.png"]
    }
  };
}

export default async function RestaurantCustomerRetentionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titleName = "RETENTION";

  // Headings array for the Table of Contents scrollspy
  const headings = [
    { id: "retention-problem", text: "Why Restaurants Lose 30% of Regulars" },
    { id: "direct-relations", text: "Escaping the 30% Delivery Platform Trap" },
    { id: "how-it-works", text: "Building Automated Loyalty and Feedback Loops" },
    { id: "we-miss-you", text: "Retaining Guests with Intelligent Re-engagement" },
    { id: "birthday-automation", text: "Personalizing Experiences at Scale" },
    { id: "operation-scalability", text: "Scaling Operations and Brand Consistency" },
    { id: "final-thoughts", text: "Final Thoughts" },
    { id: "faq", text: "Frequently Asked Questions" }
  ];

  // Q&A data for both visual UI rendering and search-engine validation schema
  const faqData = [
    {
      question: "How can automation help restaurants increase regular guest visits?",
      answer: "Automated CRM loops track guest dining frequencies, sending personalized thank-yous, direct feedback surveys, birthdate vouchers, and contextual 'we miss you' alerts automatically via WhatsApp or SMS, maintaining a continuous brand presence."
    },
    {
      question: "Can this integrate with standard POS and booking systems?",
      answer: "Yes. We engineer secure custom backend bridges connecting legacy point-of-sale systems (like Toast, NCR, POSist) and modern booking databases (like OpenTable) directly into automated CRM pipelines."
    },
    {
      question: "What is the typical conversion rate of automated re-engagement offers?",
      answer: "Highly contextual, conversational re-engagement offers dispatched directly to mobile chat achieve an average 18% to 25% coupon claim rate, generating solid repeat dining volumes without any additional ad spend."
    }
  ];

  // Structured Data (JSON-LD) for SEO / AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://growxlabs.tech/${locale}/blog/restaurant-customer-retention-automation/#article`,
        "headline": "How Restaurants Worldwide Lose 30% of Regulars (And the Automation Fix)",
        "description": "Discover why restaurant customer retention is failing in competitive markets and how automated loyalty sequences and AI re-engagement loops bring diners back.",
        "datePublished": "2026-02-18T08:30:00Z",
        "dateModified": "2026-05-27T08:30:00Z",
        "image": "https://growxlabs.tech/images/blog-restaurant-retention.png",
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
          "@id": `https://growxlabs.tech/${locale}/blog/restaurant-customer-retention-automation`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://growxlabs.tech/${locale}/blog/restaurant-customer-retention-automation/#faq`,
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
      title: "Indian Restaurant Website USA — Stop Paying 30% Commission to Platforms",
      href: "/blog/indian-restaurant-website-usa",
      date: "Jan 15, 2026",
      readTime: "5 min read",
      category: "Hospitality / Direct Sales"
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
        id="restaurant-retention-schemas"
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
                Restaurant
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Retention
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Automation
              </span>
            </div>

            {/* Editorial Title */}
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black leading-[1.1] tracking-tighter text-foreground mb-8 max-w-4xl mx-auto">
              How Restaurants Worldwide Lose 30% of
              <br />
              <span className="text-primary">Regulars (And the Automation Fix)</span>
            </h2>

            {/* Excerpt */}
            <p className="text-[18px] md:text-[20px] text-[#A1A1AA] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
              Great food is only half the battle. Discover why customer retention is failing in competitive dining markets and how modern restaurants automate guest loyalty.
            </p>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-6 sm:gap-10 font-mono text-[11px] tracking-[0.1em] text-[#6B7280] uppercase border-t border-b border-border py-5">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>By GrowXLabsTech</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>6 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>February 18, 2026</span>
              </div>
            </div>
          </Reveal>

          {/* Blueprint Banner */}
          <Reveal y={30} delay={0.2}>
            <div className="mt-14 w-full max-w-5xl mx-auto">
              <InteractiveRestaurantRetention />
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
                In the global dining market, exceptional hospitality is no longer enough.
              </p>
              <p>
                Every single day, restaurants with spectacular menus and perfect locations lose regular guests to aggressive online competitors. Why? Because they lack a system to capture, track, and nurture relationships with their guests once they walk out the door.
              </p>
              <p>
                Leading dining brands are fixing this by implementing **automated customer retention systems** that bring guests back directly, completely bypassing third-party platforms.
              </p>
            </div>

            {/* Divider Line */}
            <EditorialDivider />

            {/* Section 1 */}
            <section id="retention-problem" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Why Restaurants Lose 30% of Regulars
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Most hospitality owners focus completely on the in-house experience: food preparation, interior styling, and service staff.
                </p>
                <p>
                  But the moment a diner pays and departs, the connection is lost.
                </p>
                <p>
                  Without automated customer relationship mapping, you are relying solely on hope for a repeat visit. In a saturated market filled with endless dining choices, hope is not an operational strategy.
                </p>
              </div>
            </section>

            {/* Insight Callout */}
            <InsightCallout variant="warning">
              Restaurants that don't follow up with customers within 48 hours of their visit lose 40% of potential repeat business permanently. The window for re-engagement is razor-thin—and most operators miss it entirely because they lack automated touchpoints.
            </InsightCallout>

            {/* Section 2 */}
            <section id="direct-relations" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Escaping the 30% Delivery Platform Trap
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Third-party ordering platforms (like DoorDash, UberEats, or Deliveroo) charge up to **30% commission** per transaction.
                </p>
                <blockquote className="my-10 pl-6 border-l-3 border-primary italic text-[20px] text-[#A1A1AA] font-serif leading-relaxed">
                  "When guests order through an aggregator app, they belong to that aggregator—not to your restaurant. By building direct-to-consumer digital infrastructure, you retain the customer data, save massive platform fees, and build long-term repeat asset value."
                </blockquote>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-it-works" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Building Automated Loyalty and Feedback Loops
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  A perfect guest retention loop operates automatically behind the scenes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Instant Feedback</strong>: n8n triggers a friendly feedback text 2 hours after dining. If the response is positive, it prompts a Google Review; if negative, it alerts management privately.</li>
                  <li><strong>Dynamic Rewards</strong>: First-time guests automatically receive a WhatsApp text containing a direct reservation link and a free beverage offer for their next visit.</li>
                  <li><strong>CRM Data Tracking</strong>: Every transaction logs guest details directly into your own marketing list.</li>
                </ul>
              </div>
            </section>

            {/* Why This Matters */}
            <WhyThisMatters>
              The restaurant industry loses billions annually to preventable churn—automated retention systems cost a fraction of acquiring new customers and deliver 5-7x higher ROI than traditional marketing. In an industry where a single loyal guest can generate $5,000+ in annual revenue, the math is unambiguous: retention automation isn't a nice-to-have, it's the highest-leverage investment a restaurant can make.
            </WhyThisMatters>

            {/* Section 4 */}
            <section id="we-miss-you" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Retaining Guests with Intelligent Re-engagement
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  When a regular diner has not visited in 30 days, hope shouldn't be the recovery strategy.
                </p>
                <p>
                  Our automated re-engagement systems monitor check-in databases constantly. When a guest passes a set duration since their last meal, the pipeline dispatches a personalized, direct-to-chat "we miss you" message containing a high-value reservation incentive, pulling them back through the door.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="birthday-automation" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Personalizing Experiences at Scale
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  A guest's birthday represents the highest-spending, most reliable booking opportunity of the year.
                </p>
                <p>
                  Automating birthday check-ins ensures that 7 days prior to their celebration, your regular guests receive a direct-to-chat invitation to host their party at your venue, dynamically sending an incentive for booking a group table.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="operation-scalability" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                Scaling Operations and Brand Consistency
              </h2>
              <div className="text-[17px] leading-[1.9] text-foreground/90 font-normal space-y-6 font-sans blog-prose">
                <p>
                  Manually tracking guest loyalty across multiple locations is operational chaos.
                </p>
                <p>
                  Our unified databases and automated triggers synchronize operational details, loyalty pools, and branding templates smoothly across all branches, allowing you to scale your restaurant footprint with absolute consistency.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="final-thoughts" className="scroll-mt-32 mt-16 space-y-6 font-serif italic text-[#A1A1AA]">
              <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight not-italic font-sans">
                Final Thoughts
              </h2>
              <p>
                Menu development and interior design are the soul of a restaurant, but technology and automation are what protect its profits.
              </p>
              <p>
                By building direct digital relationships with your diners and automating their follow-ups, your brand remains the top choice in their dining decisions. Escape third-party dependencies, own your customer relationships, and protect your margins.
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
                <p className="text-[#6B7280] text-[15px] max-w-xl leading-relaxed">
                  Key details regarding restaurant customer loyalty systems and custom API integrations.
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
                  and modern digital systems.
                </h3>
                <p className="text-[#6B7280] text-[15px] max-w-md mx-auto leading-relaxed">
                  We design high-performance websites, advanced background automations, and custom workflows tailored for global scale.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 h-12 text-[15px] font-semibold transition-all inline-flex items-center gap-2 hover:gap-3">
                      Work With GrowXLabsTech <ArrowRight className="w-4.5 h-4.5" />
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
                <h4 className="font-mono text-[11px] tracking-[0.15em] text-[#6B7280] uppercase font-bold">
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
