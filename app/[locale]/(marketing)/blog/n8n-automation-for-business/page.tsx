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
import { InteractiveWorkflowEngine } from "@/components/marketing/InteractiveWorkflowEngine";

// ═══════════════════════════════════════════════════
// METADATA GENERATOR (Perfect SEO / AEO Optimization)
// ═══════════════════════════════════════════════════
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog/n8n-automation-for-business";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  const title = "n8n Automation for Business — Complete Global Guide 2026";
  const description = "Learn how to orchestrate business systems and eliminate manual admin work 24/7. A deep-dive guide to self-hosted n8n workflows, CRM pipelines, and digital employees.";

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
      publishedTime: "2026-04-12T08:30:00.000Z",
      authors: ["GrowXLabsTech"],
      images: [
        {
          url: "https://growxlabs.tech/images/blog-n8n-automation.png",
          width: 1200,
          height: 630,
          alt: "n8n Business Automation Architecture Blueprint"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://growxlabs.tech/images/blog-n8n-automation.png"]
    }
  };
}

export default async function N8nAutomationGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titleName = "AUTOMATE";

  // Headings array for the Table of Contents scrollspy
  const headings = [
    { id: "hiring-crisis", text: "The Shift from Manual Work to Digital Employees" },
    { id: "why-n8n", text: "Why n8n Is the Core of Business Orchestration" },
    { id: "how-it-works", text: "Building Resilient Multi-System Pipelines" },
    { id: "lead-engine", text: "Qualify and Route Leads in 60 Seconds" },
    { id: "database-sync", text: "Keeping CRM and Invoicing Synced 24/7" },
    { id: "operation-scalability", text: "Scale Operations Globally Without the Headcount" },
    { id: "final-thoughts", text: "Final Thoughts" },
    { id: "faq", text: "Frequently Asked Questions" }
  ];

  // Q&A data for both visual UI rendering and search-engine validation schema
  const faqData = [
    {
      question: "What is n8n and why is it preferred over other automation tools?",
      answer: "n8n is a node-based workflow engine that supports self-hosting, advanced branch logic, and custom JavaScript parsing. This permits startups and enterprises to manage their data securely, avoid rising API subscription costs, and build custom integration workflows that typical drag-and-drop tools cannot support."
    },
    {
      question: "Can n8n connect custom databases and legacy APIs?",
      answer: "Yes. Through pre-built nodes, secure HTTP request parameters, and standard database connectors (SQL, PostgreSQL, MongoDB), n8n can serve as a robust data-routing broker between legacy enterprise databases and modern cloud software."
    },
    {
      question: "What is the typical timeline to deploy an n8n workflow?",
      answer: "Standard qualification flows and communication automation sequences take 7 to 14 days to engineer and fully test. Deep, multi-system CRM and dynamic data-sync architectures are completed within 14 to 21 days."
    }
  ];

  // Structured Data (JSON-LD) for SEO / AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://growxlabs.tech/${locale}/blog/n8n-automation-for-business/#article`,
        "headline": "n8n Automation for Business — Complete Global Guide 2026",
        "description": "Learn how to orchestrate business systems and eliminate manual admin work 24/7. A deep-dive guide to self-hosted n8n workflows, CRM pipelines, and digital employees.",
        "datePublished": "2026-04-12T08:30:00Z",
        "dateModified": "2026-05-27T08:30:00Z",
        "image": "https://growxlabs.tech/images/blog-n8n-automation.png",
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
          "@id": `https://growxlabs.tech/${locale}/blog/n8n-automation-for-business`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://growxlabs.tech/${locale}/blog/n8n-automation-for-business/#faq`,
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
      title: "WhatsApp Automation for Lead Nurturing — The 2026 Strategy",
      href: "/blog/whatsapp-automation-for-lead-nurturing",
      date: "Mar 28, 2026",
      readTime: "4 min read",
      category: "Marketing Automation"
    },
    {
      title: "Google Search Is No Longer Just Search: The Rise of the Execution Engine",
      href: "/blog/google-search-is-no-longer-just-search",
      date: "May 27, 2026",
      readTime: "5 min read",
      category: "Search / SEO"
    },
    {
      title: "AI Coding Tools Are Reshaping Modern Software Engineering",
      href: "/blog/ai-coding-tools-are-reshaping-modern-software-engineering",
      date: "May 27, 2026",
      readTime: "5 min read",
      category: "AI Industry"
    }
  ];

  return (
    <div className="w-full bg-[#F5F3EE] min-h-screen text-[#1A1A1A] selection:bg-[#355CFF]/10 selection:text-[#355CFF] pt-32 pb-24">
      {/* Dynamic JSON-LD Structured Data */}
      <Script
        id="n8n-automation-schemas"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Progress Bar */}
      <ReadingProgressBar />

      {/* ═══════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <header className="w-full border-b border-[#E5E2DC] pb-16 px-6 md:px-10 xl:px-16 2xl:px-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Massive Swiss Page Title with neon flickering */}
          <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mb-10">
            <h1 className="font-black select-none tracking-[-0.06em] text-[#1A1A1A] leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
              <FlickerText text={titleName} />
            </h1>
          </div>

          <Reveal y={20}>
            {/* Category Tag */}
            <div className="flex gap-2 justify-center items-center mb-6">
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold bg-[#355CFF]/5 px-2.5 py-1 rounded">
                Automation
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                n8n
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                /
              </span>
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Workflows
              </span>
            </div>

            {/* Editorial Title */}
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black leading-[1.1] tracking-tighter text-[#1A1A1A] mb-8 max-w-4xl mx-auto">
              n8n Automation for Business:
              <br />
              <span className="text-[#355CFF]">The 2026 Strategy Guide</span>
            </h2>

            {/* Excerpt */}
            <p className="text-[18px] md:text-[20px] text-[#4B5563] leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
              Stop doing manual work. Discover how leading startups and modern enterprises leverage self-hosted n8n pipelines as tireless digital employees operating 24/7.
            </p>

            {/* Meta Details Grid */}
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-6 sm:gap-10 font-mono text-[11px] tracking-[0.1em] text-[#6B7280] uppercase border-t border-b border-[#E5E2DC] py-5">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>By GrowXLabsTech</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#355CFF]" />
                <span>April 12, 2026</span>
              </div>
            </div>
          </Reveal>

          {/* Interactive Blueprint Banner */}
          <Reveal y={30} delay={0.2}>
            <div className="mt-14 w-full">
              <InteractiveWorkflowEngine />
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
            <div className="lg:hidden mb-12 bg-white/60 border border-[#E5E2DC] rounded-xl p-6">
              <TableOfContents headings={headings} />
            </div>

            {/* Intro Content */}
            <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-8 font-sans blog-prose">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#355CFF] first-letter:mr-3 first-letter:float-left">
                Every business wants to scale, but scaling usually means adding overhead.
              </p>
              <p>
                In 2026, the cost of manual admin work—data transfer, manual lead logging, and checking multi-system dashboards—is higher than ever. Software systems are abundant, yet they remain isolated in separate silos.
              </p>
              <p>
                The companies winning the next wave of startup efficiency aren't hiring more operations assistants. They are hiring <strong>digital employees</strong> by engineering self-hosted, autonomous backend pipelines through <strong>n8n</strong>.
              </p>
            </div>

            {/* Divider Line */}
            <EditorialDivider />

            {/* Section 1 */}
            <section id="hiring-crisis" className="scroll-mt-32 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                The Shift from Manual Work to Digital Employees
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  Most companies have talented teams that spend up to 30% of their day on low-leverage tasks: copying lead data, typing inputs manually, and logging details across disparate software systems.
                </p>
                <p>
                  We build automated workflows to address this exact bottleneck.
                </p>
                <p>
                  By creating n8n systems that act as background digital employees, businesses can qualification-test leads, book scheduling, verify logs, update CRMs, and email proposals 24/7 without a single human click.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="why-n8n" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Why n8n Is the Core of Business Orchestration
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  While tools like Zapier exist, they present major operational limitations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Data Privacy & Compliance</strong>: Zapier runs entirely on external servers. Self-hosting n8n keeps 100% of customer data in your own private cloud.</li>
                  <li><strong>Unlimited Scaling</strong>: Zapier charging per-task model becomes extremely expensive. n8n runs unlimited executions on standard VPS structures for a flat server cost.</li>
                  <li><strong>Logical Depth</strong>: n8n handles advanced loops, custom JavaScript nodes, and complex branching structures effortlessly.</li>
                </ul>
              </div>
            </section>

            <InsightCallout variant="impact">
              n8n's open-source model fundamentally changes the economics of automation infrastructure. Unlike SaaS platforms where recurring fees compound indefinitely, your n8n investment appreciates in value over time—every workflow you build, every custom node you create, and every integration you deploy becomes a permanent operational asset you fully own.
            </InsightCallout>

            {/* Section 3 */}
            <section id="how-it-works" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Building Resilient Multi-System Pipelines
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  An automation is only as good as its error-handling and reliability parameters.
                </p>
                <blockquote className="my-10 pl-6 border-l-3 border-[#355CFF] italic text-[20px] text-[#4B5563] font-serif leading-relaxed">
                  "Most manual integrations fail because when an API goes down, the data vanishes. n8n allows for structural retry logic, error-routing notifications, and data caching that makes business systems highly resilient."
                </blockquote>
                <p>
                  In our custom setups, we build fail-safes so that if an external CRM goes offline temporarily, n8n queues the inputs and pushes them the second the destination system returns.
                </p>
              </div>
            </section>

            <WhyThisMatters>
              Self-hosted automation is rapidly becoming a structural competitive advantage. Companies that own their workflow infrastructure avoid vendor lock-in, reduce operational costs by 60–80% compared to per-task SaaS pricing, and maintain complete data sovereignty—a non-negotiable requirement as global privacy regulations tighten. The organizations building this capability now are creating moats that cloud-dependent competitors simply cannot replicate.
            </WhyThisMatters>

            {/* Section 4 */}
            <section id="lead-engine" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Qualify and Route Leads in 60 Seconds
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  Speed to lead is the most important conversion metric in digital sales.
                </p>
                <p>
                  Our n8n-powered lead engines intercept form entries immediately, parse them using lightweight LLM filters, and route high-intent leads to key WhatsApp/Slack alert channels within seconds.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="database-sync" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Keeping CRM and Invoicing Synced 24/7
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  Manual billing logging and CRM bookkeeping can take up hours of administrative time each week.
                </p>
                <p>
                  By creating a direct, automated link between payment platforms (Stripe/PayPal), internal databases, and CRMs, n8n synchronizes invoice states dynamically, sends custom receipts, updates client roles, and notifies operations channels without delay.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="operation-scalability" className="scroll-mt-32 mt-16 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight">
                Scale Operations Globally Without the Headcount
              </h2>
              <div className="text-[17px] leading-[1.9] text-[#374151] font-normal space-y-6 font-sans blog-prose">
                <p>
                  The modern business goal is lean scalability: doing more work with a focused, elite group of specialists.
                </p>
                <p>
                  Integrating cohesive automation loops translates into a business that handles multi-timezone client requests, orders, updates, and communications smoothly. Your team stops spending their energy typing data and starts focusing on product growth.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="final-thoughts" className="scroll-mt-32 mt-16 space-y-6 font-serif italic text-[#4B5563]">
              <h2 className="text-3xl font-black tracking-tight text-[#1A1A1A] leading-tight not-italic font-sans">
                Final Thoughts
              </h2>
              <p>
                Software is the foundation of modern commerce, but automation is what connects it into a high-performance system.
              </p>
              <p>
                With n8n, your business shifts from manual operations into a cohesive digital machine that operates around the clock. The teams that build these background pipelines today are the ones scaling their business globally tomorrow.
              </p>
              <p className="mt-8 font-sans font-bold text-[#1A1A1A] not-italic text-sm tracking-[0.1em] uppercase">
                — GrowXLabsTech
              </p>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* 2.5 FAQ SECTION (Perfect AEO Validation)           */}
            {/* ═══════════════════════════════════════════════════ */}
            <section id="faq" className="scroll-mt-32 mt-16 pt-16 border-t border-[#E5E2DC] space-y-8">
              <div className="text-center md:text-left space-y-3">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold">
                  Common Q&A
                </span>
                <h3 className="text-3xl font-black tracking-tight text-[#1A1A1A]">
                  Frequently Asked Questions
                </h3>
                <p className="text-[#6B7280] text-[15px] max-w-xl leading-relaxed">
                  Key technical details regarding workflow automation and enterprise n8n deployment.
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
              <div className="my-16 bg-[#EDEAE4] rounded-2xl p-8 md:p-12 border border-[#E5E2DC] text-center space-y-6">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold">
                  Next-Gen digital engineering
                </span>
                <h3 className="text-[28px] md:text-[38px] font-black tracking-tight leading-tight text-[#1A1A1A]">
                  Building AI-native products
                  <br />
                  and modern digital systems.
                </h3>
                <p className="text-[#6B7280] text-[15px] max-w-md mx-auto leading-relaxed">
                  We design high-performance websites, advanced background automations, and custom workflows tailored for global scale.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button className="bg-[#355CFF] text-white hover:bg-[#2A4AD4] rounded-md px-8 h-12 text-[15px] font-semibold transition-all inline-flex items-center gap-2 hover:gap-3">
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
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DC]">
                <h4 className="font-mono text-[11px] tracking-[0.15em] text-[#6B7280] uppercase font-bold">
                  Related Insights
                </h4>
                <Link href="/blog" className="text-[12px] font-bold text-[#355CFF] hover:underline inline-flex items-center gap-1">
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
