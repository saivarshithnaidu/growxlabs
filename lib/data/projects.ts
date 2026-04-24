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
    description: "AI powered career platform for Indian professionals. Resume builder, ATS optimizer, job matching. 500 plus active users.",
    image: "",
    problem: "Indian job seekers lack affordable, ATS compliant resume tools tailored to the local market, resulting in low interview conversion rates.",
    solution: "Built an AI powered platform using Claude AI for intelligent resume generation, ATS scoring, and job resume matching. all optimized for Indian hiring patterns.",
    tech: ["Next.js", "Claude AI", "Supabase"],
    metric: "500 plus Users",
    link: "https://resumeforgeai.in",
    status: "Live",
    results: [
      { label: "Active Users", value: "500 plus" },
      { label: "Resumes Generated", value: "2,000 plus" },
      { label: "ATS Score Avg", value: "92%" }
    ],
    gallery: []
  },
  {
    slug: "universalai",
    title: "UniversalAI",
    tag: "AI Platform",
    category: "AI Platform",
    description: "Multi model AI chat platform supporting Claude, GPT 4, and Gemini in one unified interface with plugin marketplace.",
    image: "",
    problem: "Users need to switch between multiple AI platforms to access different models, losing context and productivity.",
    solution: "Created a unified AI chat interface that aggregates Claude, GPT 4, and Gemini into one platform with a plugin marketplace for extended capabilities.",
    tech: ["Next.js", "OpenAI", "Anthropic"],
    metric: "3 AI Models",
    link: "https://universalai.co.in",
    status: "Live",
    results: [
      { label: "AI Models", value: "3" },
      { label: "Response Time", value: "<2s" },
      { label: "Plugin System", value: "Active" }
    ],
    gallery: []
  },
  {
    slug: "recruitai",
    title: "RecruitAI",
    tag: "Automation Platform",
    category: "Automation Platform",
    description: "AI recruitment automation with intelligent screening, lead scoring, and n8n workflow integration.",
    image: "",
    problem: "Recruitment agencies spend 70% of their time on repetitive screening and follow up tasks instead of closing candidates.",
    solution: "Built an AI powered recruitment pipeline with automated candidate screening, intelligent lead scoring, and n8n workflow integration for end to end automation.",
    tech: ["Next.js", "n8n", "Supabase"],
    metric: "15 plus Automations",
    link: "https://recruitaitech.in",
    status: "Live",
    results: [
      { label: "Automations", value: "15 plus" },
      { label: "Time Saved", value: "70%" },
      { label: "Accuracy", value: "95%" }
    ],
    gallery: []
  }
];
