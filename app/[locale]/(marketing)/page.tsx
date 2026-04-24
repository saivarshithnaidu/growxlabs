import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Link } from "@/navigation";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/marketing/Reveal";
import { AEOBlock } from "@/components/marketing/AEOBlock";
import Script from "next/script";

export default function Home() {
  const faqData = [
    {
      question: "What does GrowX Labs do?",
      answer: "GrowX Labs builds digital systems including websites, AI automation, and lead generation tools to help businesses scale."
    },
    {
      question: "Is this different from a normal website?",
      answer: "Yes. A normal website is just a digital brochure. We build growth systems that actively capture leads and automate follow-ups."
    },
    {
      question: "Do I need automation?",
      answer: "If you spend more than 2 hours a day on repetitive tasks like follow-ups or manual data entry, you need automation."
    },
    {
      question: "How long does it take?",
      answer: "A typical system build takes 2–4 weeks. We focus on speed and high-performance delivery."
    },
    {
      question: "Who is this for?",
      answer: "This is for business owners and founders who want to stop manual work and start growing with automated systems."
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
              AI Native Digital Agency
            </span>
          </Reveal>

          <Reveal y={20}>
            <h1
              className="text-white font-bold mb-8 sm:mb-10 leading-[1.1] max-w-[1100px] mx-auto px-2"
              style={{ fontSize: "clamp(40px, 8vw, 96px)", fontWeight: 700 }}
            >
              Digital Systems That Drive Growth.
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.1}>
            <p className="text-[16px] sm:text-[18px] text-[#A0A0A0] max-w-[520px] mx-auto mb-10 sm:mb-14 leading-[1.6] sm:leading-[1.7] px-4">
              We build high performance websites and automation systems that help businesses grow faster.
            </p>
          </Reveal>

          <Reveal y={20} delay={0.2} className="flex flex-col sm:flex-row justify-center gap-4 px-6">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 py-3 text-base rounded-full font-semibold bg-[#00A86B] text-white hover:bg-[#00A86B]/90 transition-all shadow-none">
                Start Your Project Today
              </Button>
            </Link>
            <Link href="/portfolio" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 py-3 text-base rounded-full font-semibold border-white/20 hover:border-white hover:bg-white/5 transition-all text-white">
                View Portfolio
              </Button>
            </Link>
          </Reveal>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] sm:h-[500px] bg-[#00A86B]/[0.04] blur-[100px] sm:blur-[150px] -z-10 rounded-full" />
      </section>

      {/* AEO Layer - Homepage */}
      <section className="w-full py-24 px-6 md:px-10 xl:px-16 2xl:px-24 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              THE GROWX DIFFERENCE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Direct Solutions for Your Business</h2>
          </div>

          <AEOBlock 
            question="What does GrowX Labs actually do?"
            answer="GrowX Labs builds complete digital systems that help businesses generate leads, automate workflows, and convert visitors into paying customers."
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
            question="How does GrowX Labs help you get clients?"
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
            Be among the first businesses to experience AI powered digital growth with GrowX Labs.
          </p>

          <div className="max-w-xl mx-auto p-10 rounded-2xl border border-[#00A86B]/30 bg-[rgba(255,255,255,0.03)] shadow-2xl backdrop-blur-sm">
            <p className="text-white text-xl font-medium mb-3">
              Want to be our first featured client?
            </p>
            <p className="text-[#A0A0A0] text-base mb-10">
              Your project becomes our showcase.
            </p>
            <Link href="/contact">
              <Button className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 rounded-full px-10 py-4 h-14 text-lg font-semibold shadow-none transition-all hover:scale-105">
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
