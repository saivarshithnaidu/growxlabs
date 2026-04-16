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
    slug: "ecommerce-revolution",
    title: "E-Commerce Revolution",
    category: "Web Engineering",
    description: "A high-performance headless commerce store for an international fashion brand, achieving 300% growth in conversion.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200",
    problem: "The client was struggling with a legacy monolith platform that was slow, hard to maintain, and failing to handle peak traffic during sales events.",
    solution: "We rebuilt the entire experience using Next.js and a headless Shopify integration. This allowed for sub-second page loads and a completely custom, cinematic shopping experience.",
    tech: ["Next.js", "Shopify Hydrogen", "Tailwind CSS", "Vercel"],
    results: [
      { label: "Conversion Rate", value: "+300%" },
      { label: "Page Load Speed", value: "0.4s" },
      { label: "Mobile Revenue", value: "+150%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "saas-automation",
    title: "SaaS Automation Engine",
    category: "Automation",
    description: "Automated customer onboarding and billing workflows for a growing B2B SaaS platform, saving 40 hours per week.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    problem: "A rapidly scaling B2B SaaS company was manually handling over 500 new signups a month, leading to human error and delayed onboarding.",
    solution: "We implemented a custom automation layer using n8n and Supabase to sync customer data, trigger onboarding emails, and handle billing logic without human intervention.",
    tech: ["n8n", "Supabase", "Node.js", "Resend"],
    results: [
      { label: "Weekly Hours Saved", value: "40+" },
      { label: "Error Rate", value: "-98%" },
      { label: "Onboarding Time", value: "-75%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    slug: "fintech-dashboard",
    title: "Wealth Management UI",
    category: "UI/UX Design",
    description: "Secure, intuitive wealth management dashboard with real-time data visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200",
    problem: "The client's existing dashboard was visually outdated and complex, making it difficult for high-net-worth individuals to understand their portfolio performance.",
    solution: "We designed and developed a premium, dark-mode dashboard with real-time data streaming and interactive charts, focusing on clarity and ease of use.",
    tech: ["React", "D3.js", "Framer Motion", "Tailwind"],
    results: [
      { label: "User Retention", value: "+60%" },
      { label: "Support Tickets", value: "-45%" },
      { label: "NPS Score", value: "85" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
