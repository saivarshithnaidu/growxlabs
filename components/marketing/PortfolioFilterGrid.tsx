import React from "react";
import { CaseStudy } from "@/lib/data/projects";
import { Reveal } from "@/components/marketing/Reveal";
import { FeaturedProjectCard } from "@/components/marketing/FeaturedProjectCard";

interface PortfolioFilterGridProps {
  projects: CaseStudy[];
}

/* How each portfolio entry is shown; titles come from the project record. */
const SHOWCASE: Record<string, { tag: string; summary: string; image: string; imageAlt: string; width: number; height: number }> = {
  trionyx: {
    tag: "Case study",
    summary: "One platform for dealers, stock, warranties and enquiries, built for a distribution business.",
    image: "/portfolio/ai-native-dms-operations.png",
    imageAlt: "Operations summary showing dealers, stock, enquiries and warranties with their status",
    width: 776,
    height: 212,
  },
  "growx-crawl": {
    tag: "Product",
    summary: "Our web research platform: finds companies, crawls their sites and keeps the source behind every finding.",
    image: "/portfolio/growx-crawl.png",
    imageAlt: "GrowX Crawl workspace",
    width: 2880,
    height: 1620,
  },
};

export function PortfolioFilterGrid({ projects }: PortfolioFilterGridProps) {
  const shown = projects.filter((p) => SHOWCASE[p.slug]);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
      {shown.map((project, i) => {
        const view = SHOWCASE[project.slug];
        return (
          <Reveal key={project.slug} delay={0.08 * i} className="h-full">
            <FeaturedProjectCard
              slug={project.slug}
              tag={view.tag}
              title={project.title}
              summary={view.summary}
              image={view.image}
              imageAlt={view.imageAlt}
              imageWidth={view.width}
              imageHeight={view.height}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
