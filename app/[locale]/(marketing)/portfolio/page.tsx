import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data/projects";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";

export async function generateMetadata() {
  return {
    title: "Portfolio | GrowX Labs",
    description: "Case studies of our successful AI-native digital systems, from full-stack platforms to complex automation workflows.",
    alternates: {
      canonical: "https://growxlabs.tech/portfolio",
    }
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
            "itemListElement": [
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/resumeforgeai#product",
                "name": "ResumeForgeAI"
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/universalai#product",
                "name": "UniversalAI"
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://growxlabs.tech/products/recruitai#product",
                "name": "RecruitAI"
              }
            ]
          }
        ]} 
      />
      <div className="pt-32 pb-24 relative overflow-hidden px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <Reveal scale={0.9} className="mb-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B]">
                Our Work
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-[clamp(32px,6vw,72px)] font-bold text-white mb-8 tracking-tight leading-[1.1]">
                Engineering <br />
                <span className="text-gradient">Real Results.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[clamp(16px,2vw,18px)] text-[#A0A0A0] max-w-[640px] mx-auto leading-[1.7]">
                Every project listed here is live, serving real users, and built by our team.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <ProjectCard {...project} />
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal y={40} className="mt-24 text-center p-12 md:p-16 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] relative overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A86B]/10 rounded-full blur-[100px] -z-10" />
            <h2 className="text-[clamp(28px,5vw,48px)] font-bold text-white mb-6 tracking-tight leading-[1.2]">Ready to be our next success story?</h2>
            <p className="text-[#A0A0A0] mb-10 max-w-[640px] mx-auto text-lg leading-relaxed">
              We partner with ambitious businesses to build AI-powered digital systems that drive real growth.
            </p>
            <Link href="/contact">
              <Button className="px-10 py-3 bg-[#00A86B] text-white rounded-full font-semibold text-lg hover:bg-[#00A86B]/90 hover:scale-105 transition-all shadow-none h-14">
                Start Your Project →
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    </>
  );
}
