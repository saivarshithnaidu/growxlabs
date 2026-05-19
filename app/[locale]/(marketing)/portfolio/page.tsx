import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";
import { ArrowRight } from "lucide-react";

const introBlocks = [
  {
    title: "Truth",
    rows: [
      { k: "Status", v: "Live or production-grade" },
      { k: "Lens", v: "Speed, credibility, automation" },
      { k: "Outcome", v: "Measured business signal" },
    ],
  },
  {
    title: "Surface area",
    rows: [
      { k: "Product", v: "AI platforms shipped" },
      { k: "Leads", v: "Capture, route, follow up" },
      { k: "Stack", v: "Web through CRM + ops" },
    ],
  },
  {
    title: "Receipts",
    rows: [
      { k: "Proof", v: "This grid is the receipt" },
      { k: "Depth", v: "Case-ready documentation" },
      { k: "Bar", v: "No brochureware" },
    ],
  },
] as const;

export async function generateMetadata() {
  return {
    title: "Portfolio | GrowXLabsTech",
    description: "Case studies of our successful AI-native digital systems, from full-stack platforms to complex automation workflows.",
    alternates: {
      canonical: "https://growxlabs.tech/portfolio",
    },
  };
}

export default function PortfolioPage() {
  const titleName = "AI PORTFOLIO";
  const flickerDelays = [
    0.2, 0.45, 0.1, 0.6, 0.3, 0.8, 0.15, 0.5, 0.7, 0.25, 0.9, 0.35, 0.05, 0.55, 0.4, 0.75,
  ];
  let letterIdx = 0;

  return (
    <>
      <DynamicSchema
        graph={[
          {
            "@type": "ItemList",
            "@id": "https://growxlabs.tech/portfolio#list",
            itemListElement: [
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/resumeforgeai#product",
                name: "ResumeForgeAI",
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/universalai#product",
                name: "UniversalAI",
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/recruitai#product",
                name: "RecruitAI",
              },
            ],
          },
        ]}
      />

      <section
        className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pt-32 pb-14 md:pb-16 min-h-[min(52dvh,560px)] flex flex-col items-center justify-center text-center"
        aria-labelledby="portfolio-hero-heading"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h1
            id="portfolio-hero-heading"
            className="text-[9.2vw] font-black text-[#1A1A1A] tracking-[-0.06em] leading-[0.8] uppercase whitespace-nowrap"
          >
            {titleName.split("").map((char, idx) => {
              if (char === " ") {
                return (
                  <span key={idx} className="inline-block w-[0.25em]" />
                );
              }
              const currentDelay = flickerDelays[letterIdx % flickerDelays.length];
              letterIdx++;
              return (
                <span
                  key={idx}
                  className="inline-block animate-flicker"
                  style={{
                    opacity: 0,
                    animationDelay: `${currentDelay}s`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>
      </section>

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-24 border-t border-[#E5E2DC]/90">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center max-w-3xl mx-auto pt-10 md:pt-12 mb-10 md:mb-12">
            <Reveal scale={0.98}>
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-3 block">
                Our work
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(1.65rem,4vw,2.75rem)] font-black text-[#1A1A1A] tracking-tight leading-[1.12]">
                Real systems, shipped for real users.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14 md:mb-16">
            {introBlocks.map((card, i) => (
              <Reveal key={card.title} delay={0.06 + i * 0.05}>
                <div
                  className="h-full bg-white border border-[#E5E2DC] rounded-2xl p-6 md:p-7 shadow-sm relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}
                >
                  <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight mb-5 pr-2">{card.title}</h3>
                  <div className="divide-y divide-[#E5E2DC]">
                    {card.rows.map((row) => (
                      <div key={`${card.title}-${row.k}-${row.v}`} className="grid grid-cols-[minmax(0,88px)_1fr] gap-x-3 py-3 first:pt-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280] leading-snug">
                          {row.k}
                        </span>
                        <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
          </div>

          <Reveal y={40} className="mt-20">
            <div className="text-center p-8 md:p-12 rounded-lg border border-[#E5E2DC] bg-white shadow-sm">
              <h2 className="text-[clamp(28px,5vw,48px)] font-black text-[#1A1A1A] mb-5 tracking-tight leading-[1.1]">
                Ready to be our next case study?
              </h2>
              <p className="text-[#6B7280] mb-8 max-w-[660px] mx-auto text-lg leading-relaxed">
                We partner with ambitious businesses to build AI-powered digital systems that can be launched, measured,
                and improved.
              </p>
              <Link href="/contact">
                <Button className="px-8 h-12 rounded-md font-semibold inline-flex items-center gap-2">
                  Start your project <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
