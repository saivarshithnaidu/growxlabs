
import { Reveal } from "@/components/marketing/Reveal";
import { locales, Link } from "@/navigation";
import { DynamicSchema } from "@/components/marketing/DynamicSchema";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { ServicePixelArt } from "@/components/marketing/ServicePixelArt";

const services = [
  {
    title: "Custom Software Builds",
    type: "software",
    mission: "Problem to prototype",
    useCases: "Custom enterprise apps, platforms, integrations",
    weight: "Scoped build",
    dimensions: "Architecture to production delivery",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20a%20Custom%20Software%20Build%20at%20GrowxLabs.",
  },
  {
    title: "Labs & Platforms",
    type: "ai",
    mission: "Deploy proven architectures",
    useCases: "Scraping, developer harnesses, talent systems",
    weight: "Fast deployment",
    dimensions: "Configurable / production-ready",
    buttonText: "Explore labs",
    buttonHref: "/products",
  },
  {
    title: "Fractional CTO",
    type: "cto",
    mission: "Own product and architecture",
    useCases: "Roadmaps, system design, technical strategy",
    weight: "Strategic",
    dimensions: "Architecture & technical leadership",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20Fractional%20CTO%20services%20at%20GrowxLabs.",
  },
  {
    title: "Technical Co-founders",
    type: "founder",
    mission: "Embed from day one",
    useCases: "MVPs, technology stack, delivery, scaling",
    weight: "Deep partnership",
    dimensions: "Long-term aligned engineering",
    buttonText: "Get in touch",
    buttonHref: "https://wa.me/919381188153?text=Hi%2C%20I%27m%20interested%20in%20a%20Technical%20Co-founder%20partnership%20at%20GrowxLabs.",
  },
];

export async function generateMetadata() {
  return {
    title: "Software Engineering, Web Platforms & Enterprise AI Services | GrowxLabs",
    description: "GrowxLabs provides custom enterprise software development, product engineering, web platform engineering, modernization, and intelligent workflow integrations.",
    alternates: {
      canonical: "https://growxlabs.tech/services"
    }
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
            "description": "Custom enterprise software development, modern web platform engineering, and scalable digital architectures."
          },
          {
            "@type": "Service",
            "@id": "https://growxlabs.tech/services/ai#service",
            "name": "AI & Intelligent Workflows",
            "provider": { "@id": "https://growxlabs.tech/#organization" },
            "areaServed": "Global",
            "description": "Multi-agent systems, document intelligence pipelines, and secure enterprise AI integrations."
          }
        ]}
      />

      <PageHero
        title="Services"
        viewingText="SERVICES"
        exploreText="WHAT WE DO"
        tagline="SOFTWARE & PRODUCT ENGINEERING"
      />

      <div className="pb-12 px-6 md:px-10 xl:px-16 2xl:px-24 w-full border-t border-white/10 pt-16 bg-black">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">

          {/* Services Cards Grid */}
          <Reveal y={40}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-0">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="group relative p-[1px] transition-[background-color,scale] duration-300 motion-safe:hover:scale-[1.01] bg-[var(--svc-border)] hover:bg-[var(--svc-accent)]"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 42px) 0, 100% 42px, 100% 100%, 0 100%)",
                  }}
                >
                  <div
                    className="bg-[var(--svc-card)] py-6 px-7 sm:px-8 sm:py-9 flex flex-col h-full justify-between min-h-[500px]"
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 41px) 0, 100% 41px, 100% 100%, 0 100%)",
                    }}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-[var(--svc-heading)] leading-tight tracking-tight mt-4 min-h-[56px] flex items-center">
                        {service.title}
                      </h3>
                      
                      {/* Pixel Art Graphic */}
                      <ServicePixelArt type={service.type} />
                    </div>

                    <div>
                      {/* Metadata fields list */}
                      <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-[var(--svc-border)]">
                        {[
                          { k: "Missions", v: service.mission },
                          { k: "Use cases", v: service.useCases },
                          { k: "Weight", v: service.weight },
                          { k: "Dimensions", v: service.dimensions },
                        ].map((row) => (
                          <div key={row.k} className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-[var(--svc-accent)]">
                              {row.k}
                            </span>
                            <span className="text-sm font-normal text-[var(--svc-text)] leading-normal">
                              {row.v}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      {service.buttonHref.startsWith("http") ? (
                        <a 
                          href={service.buttonHref} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full block mt-6"
                        >
                          <Button
                            className="w-full h-12 font-semibold text-sm bg-[var(--svc-accent)] text-[var(--svc-on-accent)] hover:bg-[var(--svc-heading)] hover:text-[var(--svc-on-accent)] active:opacity-85 border-none shadow-none transition-[background-color,color,opacity] duration-200"
                          >
                            {service.buttonText}
                          </Button>
                        </a>
                      ) : (
                        <Link href={service.buttonHref} className="w-full block mt-6">
                          <Button
                            className="w-full h-12 font-semibold text-sm bg-[var(--svc-accent)] text-[var(--svc-on-accent)] hover:bg-[var(--svc-heading)] hover:text-[var(--svc-on-accent)] active:opacity-85 border-none shadow-none transition-[background-color,color,opacity] duration-200"
                          >
                            {service.buttonText}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
