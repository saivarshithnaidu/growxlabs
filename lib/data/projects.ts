export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  problem: string;
  solution: string;
  tech: string[];
  results: {
    label: string;
    value: string;
  }[];
  gallery: string[];
}

export const projects: CaseStudy[] = [
  {
    slug: "ecommerce-performance",
    title: "Global Commerce Scaling",
    category: "Web Engineering",
    description: "Architected a sub-second headless commerce platform for an international lifestyle brand, driving unprecedented conversion growth.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200",
    problem: "The client was losing 40% of potential revenue due to legacy platform latency and checkout failures during high-traffic global sales.",
    solution: "We engineered a high-performance Next.js engine with a distributed headless backend, eliminating load-time bottlenecks and stabilizing the checkout pipeline.",
    tech: ["Next.js", "Shopify Hydrogen", "Tailwind CSS", "Vercel"],
    results: [
      { label: "Conversion Lift", value: "3.2x" },
      { label: "LCP Performance", value: "0.4s" },
      { label: "Cart Abandonment", value: "-62%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "enterprise-automation",
    title: "Operational Efficiency Engine",
    category: "AI & Automation",
    description: "Developed an autonomous workflow ecosystem for a B2B SaaS leader, eliminating thousands of manual processing hours annually.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    problem: "Manual data entry and fragmented onboarding processes were costing the operations team 160+ hours per month and increasing churn risk.",
    solution: "We deployed an AI-powered automation layer using n8n and custom logic to centralize customer intelligence and automate the entire onboarding lifecycle.",
    tech: ["n8n", "Supabase", "Node.js", "OpenAI"],
    results: [
      { label: "Ops Hours Saved", value: "2,000+" },
      { label: "Onboarding Speed", value: "4.5x" },
      { label: "Process Accuracy", value: "100%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "fintech-intelligence",
    title: "Asset Management Portal",
    category: "Financial Systems",
    description: "Designed a high-security, real-time data orchestration platform for high-net-worth wealth management.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
    problem: "Inconsistent data visualization and complex navigation were hindering client engagement and increasing support overhead.",
    solution: "We built a specialized data portal with real-time financial streaming and intuitive performance analytics, focusing on high-trust user experience.",
    tech: ["React", "D3.js", "Framer Motion", "Tailwind"],
    results: [
      { label: "User Engagement", value: "+85%" },
      { label: "Support Vol.", value: "-40%" },
      { label: "NPS Growth", value: "+22pts" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1450101496173-ec413b681f4c?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
