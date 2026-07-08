import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";
import { Link } from "@/navigation";
import { Reveal } from "@/components/marketing/Reveal";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";
import { PageHero } from "@/components/marketing/PageHero";

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

  return (
    <>
      <DynamicSchema
        graph={[
          {
            "@type": "ItemList",
            "@id": "https://growxlabs.tech/portfolio#list",
            itemListElement: projects.map((project, idx) => ({
              "@type": "SoftwareApplication",
              "@id": `https://growxlabs.tech/portfolio/${project.slug}#product`,
              name: project.title,
              position: idx + 1,
            })),
          },
        ]}
      />

      <PageHero
        title="Portfolio"
        viewingText="PORTFOLIO"
        exploreText="OUR WORK"
        tagline="REAL SYSTEMS"
      />

      <div className="w-full px-6 md:px-10 xl:px-16 2xl:px-24 pb-12 border-t border-border/20 pt-16">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <div className="text-center max-w-3xl mx-auto pt-10 md:pt-12 mb-10 md:mb-12">
            <Reveal scale={0.98}>
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
                Our work
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-[clamp(1.65rem,4vw,2.75rem)] font-black text-foreground tracking-tight leading-[1.12]">
                Real systems, shipped for real users.
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14 md:mb-16">
            {introBlocks.map((card, i) => (
              <Reveal key={card.title} delay={0.06 + i * 0.05}>
                <div
                  className="h-full bg-card border border-border rounded-2xl p-6 md:p-7 shadow-sm relative overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}
                >
                  <h3 className="text-lg font-black text-foreground tracking-tight mb-5 pr-2">{card.title}</h3>
                  <div className="divide-y divide-[#E5E2DC]">
                    {card.rows.map((row) => (
                      <div key={`${card.title}-${row.k}-${row.v}`} className="grid grid-cols-[minmax(0,88px)_1fr] gap-x-3 py-3 first:pt-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground leading-snug">
                          {row.k}
                        </span>
                        <span className="text-sm font-semibold text-foreground leading-snug">{row.v}</span>
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
        </div>
      </div>
    </>
  );
}
