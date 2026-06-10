import React from "react";
import Image from "next/image";
import Script from "next/script";
import { Link, locales } from "@/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { ArrowRight, Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BlogInteractiveList } from "@/components/marketing/BlogInteractiveList";

// ═══════════════════════════════════════════════════
// METADATA GENERATOR (Perfect SEO / Directory SEO)
// ═══════════════════════════════════════════════════
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const path = "blog";

  const languages: Record<string, string> = {
    'x-default': `https://growxlabs.tech/en-IN/${path}`,
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}/${path}`;
  });

  return {
    title: "GrowXLabsTech Insights — AI, Automation & High-Performance Engineering",
    description: "Explore premium editorial insights, research, and deep-dives on background AI agents, business automation workflows, Next.js engineering, and digital growth systems from the GrowXLabsTech studio.",
    alternates: {
      canonical: `https://growxlabs.tech/${locale}/${path}`,
      languages
    }
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const titleName = "INSIGHTS";

  // Blog posts database
  const featuredPost = {
    slug: "nvidia-vision-agentic-to-useful-ai",
    title: "NVIDIA's Vision for the Future of AI: From Agentic AI to Useful AI",
    excerpt: "Analyze Jensen Huang's GTC vision: CUDA-X, AI Factories, Physical AI, and the historic shift from reactive chatbots to proactive execution systems.",
    category: "AI Industry / Infrastructure / Analysis",
    date: "June 4, 2026",
    readTime: "14 min read",
    image: "/images/nvidia-vision-agentic-to-useful-ai.png"
  };

  const regularPosts = [
    {
      slug: "nvidia-vision-agentic-to-useful-ai",
      title: "NVIDIA's Vision for the Future of AI: From Agentic AI to Useful AI",
      excerpt: "Analyze Jensen Huang's GTC vision: CUDA-X, AI Factories, Physical AI, and the historic shift from reactive chatbots to proactive execution systems.",
      category: "AI Industry / Infrastructure / Analysis",
      date: "June 4, 2026",
      readTime: "14 min read"
    },
    {
      slug: "chatbots-are-dying-agents-are-taking-over",
      title: "Chatbots Are Dying. Agents Are Taking Over.",
      excerpt: "AI is evolving from chatbots to autonomous agents. Discover why AI agents will transform business operations, automation, sales, marketing, and execution.",
      category: "AI / Automation / Scale",
      date: "June 1, 2026",
      readTime: "6 min read"
    },
    {
      slug: "blue-origin-new-glenn-rocket-explosion",
      title: "Blue Origin’s New Glenn Rocket Explodes During Test: What Happened?",
      excerpt: "Blue Origin's New Glenn rocket exploded during a hot-fire test in Florida. Here's what happened, why it matters, and what it means for the future of space technology.",
      category: "Space / Technology / Innovation",
      date: "May 30, 2026",
      readTime: "5 min read"
    },
    {
      slug: "claude-opus-4-8-anthropic-ai-model",
      title: "Claude Opus 4.8: Anthropic's Most Advanced AI Model — Benchmarks, Features & Full Review",
      excerpt: "Complete analysis of Claude Opus 4.8 released May 28, 2026. Explore benchmark results (SWE-Bench 69.2%, Terminal-Bench 74.2%), Dynamic Workflows, Effort Control, pricing, API access, and what's next with Claude Mythos.",
      category: "AI / Anthropic / Engineering",
      date: "May 29, 2026",
      readTime: "12 min read"
    },
    {
      slug: "google-io-2026",
      title: "Google I/O 2026: The Beginning of the AI-Native Internet",
      excerpt: "Explore the shift from reactive AI chatbots to proactive, 24/7 background AI infrastructure. Discover how Gemini 3.5 Flash, Gemini Spark, and Antigravity are redefining the modern internet.",
      category: "AI / Google / Technology",
      date: "May 27, 2026",
      readTime: "6 min read"
    },
    {
      slug: "ferraris-electric-future-why-the-luce-marks-a-historic-turning-point",
      title: "Ferrari’s Electric Future: Why The Luce Marks A Historic Turning Point",
      excerpt: "Analyze how Ferrari is navigating its transition to electrification. Discover how solid-state engineering, axial flux motors, and predictive software dynamics bridge heritage and innovation.",
      category: "Case Study / Automotive / Future",
      date: "May 29, 2026",
      readTime: "7 min read"
    },
    {
      slug: "google-search-is-no-longer-just-search",
      title: "Google Search Is No Longer Just Search: The Rise of the Execution Engine",
      excerpt: "Explore the historic transition of Google Search from an index of web links to an AI-native execution workspace. Discover how Gemini's infrastructure layer changes search forever.",
      category: "SEO / Search / AI",
      date: "May 27, 2026",
      readTime: "5 min read"
    },
    {
      slug: "why-anthropic-is-becoming-a-serious-threat-to-openai",
      title: "Why Anthropic Is Becoming a Serious Threat to OpenAI",
      excerpt: "Analyze how Anthropic's Claude is quietly challenging OpenAI's dominance. Explore the developer migration, long-context mechanics, and smart enterprise positioning.",
      category: "AI Industry / Anthropic / OpenAI",
      date: "May 27, 2026",
      readTime: "5 min read"
    },
    {
      slug: "ai-coding-tools-are-reshaping-modern-software-engineering",
      title: "AI Coding Tools Are Reshaping Modern Software Engineering",
      excerpt: "Understand how AI coding systems are shifting software engineering from autocomplete syntax helpers to complex multi-agent workflow orchestration.",
      category: "Engineering / Code / AI Tools",
      date: "May 27, 2026",
      readTime: "5 min read"
    },
    {
      slug: "n8n-automation-for-business",
      title: "n8n Automation for Business — Complete Global Guide 2026",
      excerpt: "Stop doing manual work. Learn how n8n can handle your leads, emails, and CRM data 24/7 so your team can focus on growing your business globally.",
      category: "Automation / n8n / Workflow",
      date: "Apr 12, 2026",
      readTime: "5 min read"
    },
    {
      slug: "whatsapp-automation-for-lead-nurturing",
      title: "WhatsApp Automation for Lead Nurturing — The 2026 Strategy",
      excerpt: "Emails get ignored, but WhatsApp has a 98% open rate. Discover how to use automated WhatsApp pipelines to engage leads, answer FAQs, and secure deals while you sleep.",
      category: "WhatsApp / Marketing / Sales",
      date: "Mar 28, 2026",
      readTime: "4 min read"
    },
    {
      slug: "restaurant-customer-retention-automation",
      title: "How Restaurants Worldwide Lose 30% of Regulars (And the Automation Fix)",
      excerpt: "Discover why customer retention is failing in the competitive food market and how automated follow-ups, loyalty rewards, and AI systems can bring guests back through the door.",
      category: "FoodTech / Retention / Systems",
      date: "Feb 18, 2026",
      readTime: "6 min read"
    },
    {
      slug: "indian-restaurant-website-usa",
      title: "Indian Restaurant Website USA — Stop Paying 30% Commission to Platforms",
      excerpt: "A direct strategy guide for Indian restaurant owners in the US to escape third-party commission models. Build your own digital infrastructure and capture direct client data.",
      category: "Restaurant / Web / Growth",
      date: "Jan 15, 2026",
      readTime: "5 min read"
    }
  ];

  // Collection Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://growxlabs.tech/${locale}/blog/#webpage`,
    "url": `https://growxlabs.tech/${locale}/blog`,
    "name": "GrowXLabsTech Insights — AI, Automation & High-Performance Engineering",
    "description": "Explore premium editorial insights, research, and deep-dives on background AI agents, business automation workflows, Next.js engineering, and digital growth systems from the GrowXLabsTech studio.",
    "publisher": {
      "@type": "Organization",
      "name": "GrowXLabsTech",
      "logo": "https://growxlabs.tech/logo.png"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Artificial Intelligence"
      },
      {
        "@type": "Thing",
        "name": "Automation"
      },
      {
        "@type": "Thing",
        "name": "Web Engineering"
      }
    ]
  };

  return (
    <div className="w-full bg-background min-h-screen text-foreground selection:bg-primary/10 selection:text-primary pt-32 pb-24 animate-fade-in">
      {/* Schema injection */}
      <Script
        id="blog-index-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 xl:px-16 2xl:px-24">
        {/* Page Header */}
        <header className="pb-10 mb-10 text-center">
          <Reveal y={20}>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4 block font-mono">
              Editorial Insights
            </span>
            <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight mb-4 uppercase">
              Insights
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Curated case studies, engineering papers, and deep-dives from the GrowXLabsTech studio.
            </p>
          </Reveal>
        </header>

        {/* Interactive Filterable Blog Index Split Layout */}
        <BlogInteractiveList posts={regularPosts} featuredPost={featuredPost} />

        {/* Bottom CTA Block */}
        <section className="mt-32 border-t border-border/20 pt-16">
          <Reveal y={20}>
            <div className="bg-[#111111]/20 rounded-3xl p-8 md:p-16 border border-border/10 text-center space-y-6 max-w-5xl mx-auto backdrop-blur-sm">
              <span className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase font-bold">
                Let's construct your system
              </span>
              <h3 className="font-outfit font-black text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight text-foreground uppercase">
                Building AI-native products
                <br />
                and modern digital systems.
              </h3>
              <p className="text-muted-foreground text-[15px] max-w-md mx-auto leading-relaxed">
                Work directly with the GrowXLabsTech studio to engineer bespoke background automation pipelines, custom Web systems, and high-performance growth stacks.
              </p>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-md px-8 h-12 text-[15px] font-semibold transition-all inline-flex items-center gap-2 hover:gap-3 cursor-pointer">
                    Work With GrowXLabsTech <ArrowRight className="w-4.5 h-4.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
