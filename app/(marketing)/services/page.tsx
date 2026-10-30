/* Hallmark · services/page.tsx · modern-minimal · built: redesign */

import { Reveal } from "@/components/marketing/Reveal";
import { Link } from "@/navigation";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";
import { PageHero } from "@/components/marketing/PageHero";
import { ArrowUpRight, Code2, Layers, Compass, Users } from "lucide-react";

const services = [
  {
    index: "01",
    title: "Custom Software Builds",
    type: "software",
    icon: Code2,
    mission: "Problem to prototype",
    scope: "Scoped build",
    dimensions: "Architecture to production delivery",
    useCases: "Custom enterprise apps, platforms, integrations",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20a%20Custom%20Software%20Build%20at%20GrowxLabs.",
    isExternal: true,
  },
  {
    index: "02",
    title: "Labs & Platforms",
    type: "ai",
    icon: Layers,
    mission: "Deploy proven architectures",
    scope: "Fast deployment",
    dimensions: "Configurable / production-ready",
    useCases: "Scraping, developer harnesses, talent systems",
    buttonText: "Explore labs",
    buttonHref: "/products",
    isExternal: false,
  },
  {
    index: "03",
    title: "Fractional CTO",
    type: "cto",
    icon: Compass,
    mission: "Own product and architecture",
    scope: "Strategic",
    dimensions: "Architecture & technical leadership",
    useCases: "Roadmaps, system design, technical strategy",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20Fractional%20CTO%20services%20at%20GrowxLabs.",
    isExternal: true,
  },
  {
    index: "04",
    title: "Technical Co-founders",
    type: "founder",
    icon: Users,
    mission: "Embed from day one",
    scope: "Deep partnership",
    dimensions: "Long-term aligned engineering",
    useCases: "MVPs, technology stack, delivery, scaling",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20a%20Technical%20Co-founder%20partnership%20at%20GrowxLabs.",
    isExternal: true,
  },
];

export async function generateMetadata() {
  return {
    title: "Software Engineering, Web Platforms & Enterprise AI Services | GrowxLabs",
    description: "GrowxLabs provides custom enterprise software development, product engineering, web platform engineering, modernization, and intelligent workflow integrations.",
    alternates: {
      canonical: "https://growxlabs.tech/services",
    },
  };
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-black text-foreground min-h-screen">
      <DynamicSchema
        graph={[
          {
            "@type": "Service",
            "@id": "https://growxlabs.tech/services/software#service",
            "name": "Enterprise Software Engineering",
            "provider": { "@id": "https://growxlabs.tech/#organization" },
            "areaServed": "Global",
            "description": "Custom enterprise software development, modern web platform engineering, and scalable digital architectures.",
          },
          {
            "@type": "Service",
            "@id": "https://growxlabs.tech/services/ai#service",
            "name": "AI & Intelligent Workflows",
            "provider": { "@id": "https://growxlabs.tech/#organization" },
            "areaServed": "Global",
            "description": "Multi-agent systems, document intelligence pipelines, and secure enterprise AI integrations.",
          },
        ]}
      />

      <PageHero
        title="Services"
        viewingText="Services"
        exploreText="What we do"
        tagline="Software & product engineering"
      />

      <section
        aria-label="Capabilities and engagement models"
        className="pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full border-t border-border pt-16 bg-black"
      >
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          {/* Section Introduction */}
          <Reveal y={20}>
            <div className="mb-12 max-w-3xl">
              <span className="text-xs text-muted-foreground font-mono">
                [ 01 / 04 ]
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground mt-2 mb-4">
                Engagement models and core capabilities
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                From rapid scoped prototypes to production enterprise architectures and full-lifecycle engineering partnerships.
              </p>
            </div>
          </Reveal>

          {/* Capability Grid */}
          <Reveal y={30}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-6 sm:p-8 lg:p-10 transition-colors duration-200 hover:border-neutral-700 motion-reduce:transition-none"
                  >
                    <div>
                      {/* Top Row: Index + Icon Badge */}
                      <div className="flex items-center justify-between pb-6 border-b border-border">
                        <span className="text-xs font-mono text-muted-foreground">
                          {service.index}
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 border border-border text-foreground">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>

                      {/* Header & Mission */}
                      <div className="mt-6">
                        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                          {service.mission}
                        </p>
                      </div>

                      {/* Structured Details Matrix */}
                      <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border">
                        <div>
                          <dt className="text-xs text-muted-foreground font-normal">
                            Scope
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-foreground">
                            {service.scope}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted-foreground font-normal">
                            Delivery
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-foreground">
                            {service.dimensions}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-muted-foreground font-normal">
                            Use cases
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {service.useCases}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* Action Link / Button */}
                    <div className="mt-8 pt-6 border-t border-border">
                      {service.isExternal ? (
                        <a
                          href={service.buttonHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                        >
                          <span>{service.buttonText}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link
                          href={service.buttonHref}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
                        >
                          <span>{service.buttonText}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
