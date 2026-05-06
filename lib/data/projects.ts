export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  image: string;
  problem: string;
  solution: string;
  tech: string[];
  metric: string;
  link?: string;
  status: "Live" | "Beta" | "Development";
  results: {
    label: string;
    value: string;
  }[];
  gallery: string[];
}

export const projects: CaseStudy[] = [
  {
    slug: "resumeforgeai",
    title: "ResumeForgeAI",
    tag: "AI Product",
    category: "AI Product",
    description: "AI powered career platform for Indian professionals. Resume builder, ATS optimizer, and job matching. Helping professionals get hired faster.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
    problem: "Indian job seekers lack affordable, ATS compliant resume tools tailored to the local market, resulting in low interview conversion rates.",
    solution: "Built an AI powered platform using Claude AI for intelligent resume generation, ATS scoring, and job resume matching. all optimized for Indian hiring patterns.",
    tech: ["Next.js", "Claude AI", "Supabase"],
    metric: "Active Platform",
    link: "https://resumeforgeai.in",
    status: "Live",
    results: [
      { label: "Platform", value: "Active" },
      { label: "Community", value: "Growing" },
      { label: "Success Rate", value: "High" }
    ],
    gallery: []
  },
  {
    slug: "universalai",
    title: "UniversalAI",
    tag: "AI Platform",
    category: "AI Platform",
    description: "Multi model AI chat platform supporting Claude, GPT 4, and Gemini in one unified interface with plugin marketplace.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    problem: "Users need to switch between multiple AI platforms to access different models, losing context and productivity.",
    solution: "Created a unified AI chat interface that aggregates Claude, GPT 4, and Gemini into one platform with a plugin marketplace for extended capabilities.",
    tech: ["Next.js", "OpenAI", "Anthropic"],
    metric: "Multi-Model",
    link: "https://universalai.co.in",
    status: "Live",
    results: [
      { label: "AI Models", value: "Multiple" },
      { label: "Speed", value: "Instant" },
      { label: "System", value: "Ready" }
    ],
    gallery: []
  },
  {
    slug: "recruitai",
    title: "RecruitAI",
    tag: "Automation Platform",
    category: "Automation Platform",
    description: "AI recruitment automation with intelligent screening, lead scoring, and n8n workflow integration.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
    problem: "Recruitment agencies spend 70% of their time on repetitive screening and follow up tasks instead of closing candidates.",
    solution: "Built an AI powered recruitment pipeline with automated candidate screening, intelligent lead scoring, and n8n workflow integration for end to end automation.",
    tech: ["Next.js", "n8n", "Supabase"],
    metric: "Process Automation",
    link: "https://recruitaitech.in",
    status: "Live",
    results: [
      { label: "Workflows", value: "Automated" },
      { label: "Time Saved", value: "Significant" },
      { label: "Efficiency", value: "Optimized" }
    ],
    gallery: []
  }
];
