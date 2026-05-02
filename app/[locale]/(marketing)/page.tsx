import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/marketing/Reveal";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import { locales } from "@/navigation";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const languages: Record<string, string> = {
    'x-default': 'https://growxlabs.tech/en-IN',
  };
  locales.forEach((l) => {
    languages[l] = `https://growxlabs.tech/${l}`;
  });

  return {
    title: "GrowXLabsTech — AI Native Digital Agency | Websites & Automation for Businesses Worldwide",
    description: "GrowXLabsTech is a global AI native digital agency building AI powered websites, n8n automation systems, and business growth tools. We help restaurants, real estate agencies, and growing businesses worldwide stop losing customers through automated follow ups and intelligent lead capture. 7-day delivery. Serving India, USA, UK, Australia, UAE, and Canada.",
    keywords: "AI agency, AI native digital agency, web agency, n8n automation agency, restaurant automation, real estate CRM, WhatsApp automation business, business automation agency, AI web agency, lead capture automation, automated follow up system, GrowXLabsTech",
    alternates: {
      canonical: "https://growxlabs.tech/en-IN",
      languages
    }
  };
}

export default function Home() {
  const faqData = [
    {
      question: "What is GrowXLabsTech?",
      answer: "GrowXLabsTech is a global AI native digital agency that builds AI powered websites, n8n automation systems, and business growth tools for businesses worldwide. We specialize in helping restaurants, real estate agencies, and growing businesses stop losing customers through automated follow ups and intelligent systems. We deliver projects in 7-21 days and serve clients across India, USA, UK, Australia, UAE, Canada, and globally."
    },
    {
      question: "Where is GrowXLabsTech based?",
      answer: "GrowXLabsTech is headquartered in India and operates globally. We serve clients across USA, UK, Australia, UAE, Canada, Singapore, and worldwide. All client work is done remotely with full transparency and daily updates."
    },
    {
      question: "What industries does GrowXLabsTech serve?",
      answer: "GrowXLabsTech serves restaurants, real estate agencies, clinics, salons, hotels, e-commerce businesses, SaaS companies, and any growing business that needs digital systems. We have particular expertise in Indian-owned businesses operating in USA, UK, and Australia."
    },
    {
      question: "How does GrowXLabsTech work with international clients?",
      answer: "GrowXLabsTech works fully remotely with clients worldwide. Discovery calls are on Google Meet or Zoom. Payments are accepted via bank transfer, Stripe, Razorpay, or PayPal. Project updates are sent every 3 days via WhatsApp or email. All projects are delivered to a staging URL for review before going live."
    },
    {
      question: "What currency does GrowXLabsTech charge?",
      answer: "GrowXLabsTech charges in USD for international clients (USA, UK, Australia, UAE, Canada) and INR for Indian clients. Pricing is project-based after a free discovery call."
    },
    {
      question: "How fast does GrowXLabsTech deliver?",
      answer: "GrowXLabsTech delivers standard websites in 7 days, growth websites with automation in 14 days, and enterprise systems in 21 days — regardless of client location. We use AI-powered development tools that are 3x faster than traditional agencies."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const mainServices = [
    {
      title: "Web Engineering",
      description: "We build high-performance digital platforms that turn visitors into customers at scale.",
      iconName: "code",
    },
    {
      title: "AI & Automation",
      description: "Custom AI workflows and automation systems that eliminate manual overhead and speed up your growth.",
      iconName: "settings",
    },
    {
      title: "Technical SEO",
      description: "Dominant search visibility engineered to capture high-intent organic traffic and drive revenue.",
      iconName: "trending",
    },
    {
      title: "Cloud Infrastructure",
      description: "Secure, scalable hosting and maintenance designed for 100% reliability and business continuity.",
      iconName: "server",
    },
  ];

  return (
    <div className="flex flex-col">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="w-full relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-10 xl:px-16 2xl:px-24 pt-20">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto text-center relative z-10 w-full">
          <Reveal scale={0.9} className="mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B]">
              GROWXLABSTECH
            </span>
          </Reveal>

          <Reveal y={20}>
            <h1
              className="text-white font-bold mb-8 sm:mb-10 leading-[1.1] max-w-[1100px] mx-auto px-2"
              style={{ fontSize: "clamp(40px, 8vw, 96px)", fontWeight: 800 }}
            >
              Digital Systems That Drive Growth.
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.1}>
            <p className="text-[16px] sm:text-[18px] text-[#A0A0A0] max-w-[620px] mx-auto mb-10 sm:mb-14 leading-[1.6] sm:leading-[1.7] px-4">
              GrowXLabsTech builds elite digital systems for forward-thinking businesses worldwide. We transform standard websites into high-performance growth engines using AI powered automation.
            </p>
          </Reveal>

          <Reveal y={20} delay={0.2} className="flex flex-col sm:flex-row justify-center gap-4 px-6">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 px-8 py-3 text-base rounded-full font-semibold bg-[#00A86B] text-white hover:bg-[#00A86B]/90 transition-all shadow-none"
                trackEvent="cta_clicked"
                trackProperties={{ location: 'hero', text: 'Start Your Project Today' }}
              >
                Start Your Project Today
              </Button>
            </Link>
            <Link href="/portfolio" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto h-12 px-8 py-3 text-base rounded-full font-semibold border-white/20 hover:border-white hover:bg-white/5 transition-all text-white"
                trackEvent="cta_clicked"
                trackProperties={{ location: 'hero', text: 'View Portfolio' }}
              >
                View Portfolio
              </Button>
            </Link>
          </Reveal>
        </div>


      </section>

      <section className="w-full py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="max-w-[2000px] mx-auto overflow-hidden relative">
          <div className="flex animate-scroll hover:[animation-play-state:paused] whitespace-nowrap w-fit">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 px-8">
                {[
                  { name: "India", flag: "🇮🇳" },
                  { name: "USA", flag: "🇺🇸" },
                  { name: "UK", flag: "🇬🇧" },
                  { name: "Australia", flag: "🇦🇺" },
                  { name: "UAE", flag: "🇦🇪" },
                  { name: "Canada", flag: "🇨🇦" },
                  { name: "Singapore", flag: "🇸🇬" },
                  { name: "Worldwide", flag: "🌍" }
                ].map((country) => (
                  <div key={country.name} className="flex items-center gap-3 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all cursor-default group shrink-0">
                    <span className="text-3xl group-hover:scale-125 transition-transform">{country.flag}</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{country.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { value: "7 Days", label: "Average project delivery", color: "text-[#00A86B]" },
            { value: "60 Sec", label: "Lead response time with automation", color: "text-blue-500" },
            { value: "Global", label: "Clients across USA UK Australia UAE", color: "text-purple-500" }
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1} y={20}>
              <div className="text-center space-y-2 p-10 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How We Work Section */}
      <section className="w-full py-24 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              EXECUTION FRAMEWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">How We Work</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery Call", desc: "15-minute remote call via Google Meet/Zoom to understand your scope." },
              { step: "02", title: "Same-Day Proposal", desc: "We send a custom technical architecture and transparent pricing proposal." },
              { step: "03", title: "7-Day Delivery", desc: "Rapid engineering cycles using AI-powered development tools." },
              { step: "04", title: "Ongoing Support", desc: "Timezone-flexible maintenance and updates via WhatsApp and email." }
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1} scale={0.95}>
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4 h-full relative overflow-hidden group hover:border-[#00A86B]/30 transition-all">
                  <div className="text-4xl font-black text-white/5 absolute -top-2 -right-2 group-hover:text-[#00A86B]/10 transition-colors">{step.step}</div>
                  <h3 className="text-xl font-bold text-white italic">{step.title}</h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm font-medium italic">
              Available across all timezones. Project updates every 3 days.
            </p>
          </div>
        </div>
      </section>

      {/* AEO Layer - Homepage */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              THE GROWXLABSTECH DIFFERENCE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Direct Solutions for Your Business</h2>
          </div>

          <AEOBlock
            question="What does GrowXLabsTech actually do?"
            answer="GrowXLabsTech builds complete digital systems that help businesses generate leads, automate workflows, and convert visitors into paying customers."
            explanation="Most websites only display information. We build systems that guide users to take action and turn traffic into revenue."
            example="A visitor lands → fills form → automation follows up → business closes the lead."
            ctaText="Start building your system"
            ctaHref="/contact"
          />

          <AEOBlock
            question="Why most business websites fail to get clients?"
            answer="Most websites are built as digital brochures that lack conversion triggers, lead capture systems, and automated follow-ups."
            explanation="A website without a growth system is just a cost. We transform it into an asset by engineering every element to drive user intent toward a conversion."
            example="A beautiful site gets 1,000 visitors but 0 leads because there's no clear 'hook' or automation to capture interest."
            ctaText="Audit your website"
            ctaHref="/contact"
          />

          <AEOBlock
            question="How does GrowXLabsTech help you get clients?"
            answer="We deploy a 4-step growth engine: Build performance foundation → Integrate lead capture → Automate follow-ups → Optimize for scale."
            explanation="This end-to-end approach ensures no lead is wasted and your sales process runs 24/7 without manual effort."
            example="Instead of manually emailing leads, our system qualifies them and books meetings while you sleep."
            ctaText="See how it works"
            ctaHref="/services"
          />
        </div>
      </section>

      {/* Services / Core Capabilities Section */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 relative">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              WHAT WE BUILD
            </span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">Core Capabilities</h2>
            <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed">
              Direct results oriented technical solutions for businesses that prioritize speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {mainServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Segment */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              OUR WORK
            </span>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">Case Studies</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto text-center">
          <h2 className="text-[clamp(28px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
            Currently Onboarding First Clients
          </h2>
          <p className="text-[#A0A0A0] max-w-[640px] mx-auto text-lg leading-relaxed mb-12">
            Be among the first businesses to experience AI powered digital growth with GrowXLabsTech.
          </p>

          <div className="max-w-xl mx-auto p-10 rounded-2xl border border-[#00A86B]/30 bg-[rgba(255,255,255,0.03)] shadow-2xl backdrop-blur-sm">
            <p className="text-white text-xl font-medium mb-3">
              Want to be our first featured client?
            </p>
            <p className="text-[#A0A0A0] text-base mb-10">
              Your project becomes our showcase.
            </p>
            <Link href="/contact">
              <Button 
                className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 rounded-full px-10 py-4 h-14 text-lg font-semibold shadow-none transition-all hover:scale-105"
                trackEvent="cta_clicked"
                trackProperties={{ location: 'footer_cta', text: 'Start Your Project Today' }}
              >
                Start Your Project Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Common Questions</h2>
            <p className="text-[#A0A0A0]">Everything you need to know about our systems.</p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B]" />
                    {faq.question}
                  </h4>
                  <p className="text-[#A0A0A0] leading-relaxed pl-4 border-l border-white/10">
                    {faq.answer}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
