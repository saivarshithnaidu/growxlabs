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
  video?: string;
  features?: {
    title: string;
    desc: string;
  }[];
}

export const projects: CaseStudy[] = [
  {
    slug: "pipper",
    title: "Pipper",
    tag: "AI Agent Harness",
    category: "AI Developer Tools",
    description: "Unified agent developer harness and desktop runtime that lets developers orchestrate Codex, Claude-Code, and OpenCode workflows side-by-side in one local hub.",
    image: "/portfolio/pipper.png",
    problem: "Software developers suffer from velocity bottlenecks when managing disconnected terminal runtimes and multiple individual subscriptions for different AI coding agents.",
    solution: "Built a unified local desktop harness (Omni) and secure web hub (pipper.dev) that centralizes agent access, shares local filesystem context, and enables parallel model cross-verification.",
    tech: ["Electron", "Next.js", "Node.js", "AI Agents"],
    metric: "Integrated Agents",
    link: "https://pipper.dev",
    status: "Development",
    results: [
      { label: "Agent Runtimes", value: "3 Integrated" },
      { label: "Workspace State", value: "Unified" },
      { label: "Subscriptions", value: "All-in-One" },
      { label: "Code Verification", value: "Parallel" }
    ],
    gallery: [],
    features: [
      { title: "Subscription Hub", desc: "Manage and authorize your Codex, Claude-Code, and OpenCode subscriptions under a single client session." },
      { title: "Side-by-Side Orchestration", desc: "Run code execution agents concurrently, allowing models to cross-verify code or collaborate on complex tasks." },
      { title: "Local Workspace Harness", desc: "Seamless filesystem integration with safety boundaries, allowing agents to read and modify your project structure directly." },
      { title: "Omni Desktop Environment", desc: "A premium, minimalist desktop shell that groups agent workspaces and execution terminals in a tabbed panel interface." }
    ]
  },
  {
    slug: "3rdmind",
    title: "3rdMind",
    tag: "AI Agents",
    category: "AI Agent Platform",
    description: "Multi-agent startup orchestration platform where AI C-suite executives collaborate, execute real business tasks, and continuously improve through a compounding intelligence loop.",
    image: "/portfolio/3rdmind.png",
    problem: "Solo founders and lean teams lack the bandwidth to handle strategy, marketing, sales, finance, and engineering simultaneously — leading to slow execution and missed opportunities.",
    solution: "Built an autonomous agent squad of six AI C-suite roles that decompose founder goals into executable tasks, learn from real-world outcomes, and compound their effectiveness over time.",
    tech: ["Next.js", "Supabase Realtime", "OpenRouter", "Multi-Agent"],
    metric: "Agent Intelligence",
    link: "https://3rdmind.growxlabs.tech",
    status: "Beta",
    results: [
      { label: "AI Agents", value: "6 C-Suite" },
      { label: "Feedback Loops", value: "3 Signals" },
      { label: "Self-Improvement", value: "Active" },
      { label: "Task Automation", value: "85%" }
    ],
    gallery: [],
    features: [
      { title: "C-Suite Agent Squad", desc: "Six specialized AI agents (CEO, CMO, CTO, CFO, CRO, CSO) that collaborate on real business decisions." },
      { title: "Compounding Intelligence", desc: "Self-improving feedback loop where agents learn from judge scores, outcome tracking, and human feedback." },
      { title: "Council Matrix", desc: "AI board meetings where agents debate proposals and reach consensus before executing high-stakes decisions." },
      { title: "Outcome Tracking", desc: "Monitors real-world results like email replies, lead conversions, and code deployments to refine agent behavior." },
      { title: "Strategy Versioning", desc: "Compiled prompt upgrades with confidence scoring, decay algorithms, and safe rollback capabilities." }
    ]
  },
  {
    slug: "resumeforgeai",
    title: "ResumeForgeAI",
    tag: "AI Product",
    category: "AI Product",
    description: "AI-powered career platform that helps developers craft ATS-optimized resumes, practice real-time voice mock interviews, and auto-generate project documentation.",
    image: "/portfolio/resumeforgeai.png",
    problem: "Developers struggle to pass automated resume filters, practice realistic technical interviews, and professionally document their engineering work.",
    solution: "Built a modular career intelligence platform with ten specialized modules that track job readiness, simulate live interview panels, and generate specs from codebases.",
    tech: ["Next.js", "Claude AI", "Supabase", "WebRTC"],
    metric: "Career Intel",
    link: "https://resumeforgeai.in",
    status: "Live",
    results: [
      { label: "Platform", value: "Active" },
      { label: "Community", value: "Growing" },
      { label: "Success Rate", value: "High" }
    ],
    gallery: [],
    features: [
      { title: "ATS Optimization", desc: "Real-time resume alignment and scoring against target job descriptions." },
      { title: "Voice Mock Interviews", desc: "High-pressure, real-time audio simulation of technical engineering interviews." },
      { title: "Codebase Documentation", desc: "Automated generation of Software Requirement Specifications (SRS) from repositories." }
    ]
  },
  {
    slug: "universalai",
    title: "UniversalAI",
    tag: "AI Platform",
    category: "AI Platform",
    description: "Unified AI workspace that runs multiple language models side-by-side, enabling real-time comparison, document intelligence, and autonomous code generation.",
    image: "/portfolio/universalai.png",
    problem: "Teams waste hours switching between disconnected AI tools, losing context and slowing critical decisions.",
    solution: "Designed a single workspace where multiple AI models respond in parallel, documents are intelligently queried, and code agents build projects autonomously.",
    tech: ["Next.js 15", "PostgreSQL", "OpenRouter", "Gemini API", "Prisma"],
    metric: "Multi-Model",
    link: "https://universalai.co.in",
    status: "Live",
    results: [
      { label: "AI Models", value: "Multiple" },
      { label: "Speed", value: "Instant" },
      { label: "System", value: "Ready" }
    ],
    gallery: [],
    video: "/portfolio/universalai.mp4",
    features: [
      { title: "Parallel Execution", desc: "Run and compare responses from GPT-4o, Gemini, and Claude side-by-side in real-time." },
      { title: "Agent Workspace", desc: "Integrated developer sandbox allowing AI agents to build and preview code live." },
      { title: "Document Intelligence", desc: "Retrieval-Augmented Generation (RAG) engine for querying complex technical files." }
    ]
  },
  {
    slug: "recruitai",
    title: "RecruitAI",
    tag: "AI Automation",
    category: "AI Recruitment Automation",
    description: "AI-driven hiring platform that screens resumes, conducts proctored assessments, and delivers scored candidate shortlists in minutes.",
    image: "/portfolio/recruitai.png",
    problem: "Recruitment teams spend the majority of their time manually sorting unqualified applications, delaying candidate submissions and losing revenue.",
    solution: "Built an end-to-end recruitment automation system with AI-powered resume scoring, dual-camera proctored exams, and voice-based interview evaluation.",
    tech: ["Next.js 15", "n8n Workflow", "Supabase DB", "Claude API", "PostgreSQL"],
    metric: "Automation",
    link: "https://recruitaitech.in",
    status: "Live",
    results: [
      { label: "Time Saved", value: "70%" },
      { label: "Screening Velocity", value: "3x Faster" },
      { label: "Workflow Automation", value: "90%" },
      { label: "Manual Labors Reduced", value: "50%" }
    ],
    gallery: [],
    features: [
      { title: "Automated Screening", desc: "Filters and qualifies candidate profiles autonomously within seconds of submission." },
      { title: "AI Scoring", desc: "Matches CV capabilities to complex JD criteria with high precision scoring." },
      { title: "Candidate Pipeline", desc: "Unified visual dashboard for tracking candidate stages and qualification status." },
      { title: "Workflow Automation", desc: "Seamless workflow architecture routing candidate alerts straight to client CRMs." },
      { title: "Analytics Dashboard", desc: "Real-time visibility into screening latency, source channels, and match quality." }
    ]
  },
  /*
  {
    slug: "royalefeast",
    title: "Royale Feast",
    tag: "Catering Stack",
    category: "Catering Stack",
    description: "AI-powered luxury event catering planner, automated menu generation, and guest sizing estimation tool.",
    image: "/portfolio/royalefeast.png",
    problem: "Catering agencies lose up to 30% of booking inquiries due to slow, manual menu customization workflows.",
    solution: "Engineered an AI-driven menu generation portal with dynamic pricing models and automated WhatsApp guest estimations.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    metric: "Client Project",
    link: "https://catering.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Bookings", value: "+38%" },
      { label: "Lead Response", value: "< 2s" },
      { label: "Menu Creation", value: "Instant" }
    ],
    gallery: []
  },
  {
    slug: "aureliacare",
    title: "Aurelia Care",
    tag: "Healthcare System",
    category: "Healthcare System",
    description: "Secure, HIPAA-compliant patient scheduling assistant, doctor workflow automation, and custom clinical dashboards.",
    image: "/portfolio/aureliacare.png",
    problem: "Clinics face high appointment no-shows and massive administrative overhead handling manual scheduling follow-ups.",
    solution: "Built a secure clinical assistant that automates reminders, qualifies patient records, and simplifies doctor-patient dashboards.",
    tech: ["Next.js", "Supabase", "OpenAI"],
    metric: "Client Project",
    link: "https://clinic.growxlabs.tech",
    status: "Live",
    results: [
      { label: "No-Shows", value: "-90%" },
      { label: "Clinic Time Saved", value: "22h/wk" },
      { label: "HIPAA Guard", value: "Verified" }
    ],
    gallery: []
  },
  {
    slug: "eduverseai",
    title: "Eduverse AI",
    tag: "EdTech Platform",
    category: "EdTech Platform",
    description: "Next-generation adaptive learning platform featuring instant AI doubt resolution and automated career roadmaps.",
    image: "/portfolio/eduverseai.png",
    problem: "Traditional online learning platforms lack personalization, leading to low student engagement and completion rates.",
    solution: "Developed an AI doubts engine and dynamic career roadmap generator that curates syllabus content on-the-fly.",
    tech: ["Next.js 15", "TypeScript", "Framer Motion"],
    metric: "Client Project",
    link: "https://edutech.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Engagement", value: "+64%" },
      { label: "Doubt Speed", value: "Instant" },
      { label: "Completion", value: "+42%" }
    ],
    gallery: []
  },
  {
    slug: "aureliahotels",
    title: "Aurelia Hotels",
    tag: "Hospitality Web",
    category: "Hospitality Web",
    description: "Elite luxury resort booking experience, interactive guest itineraries, and direct booking engine workflows.",
    image: "/portfolio/aureliahotels.png",
    problem: "Boutique hotels lose direct booking revenue to massive high-commission aggregators like Booking.com.",
    solution: "Deployed a high-converting, blazing-fast direct-booking portal that integrates room packages with automated reminders.",
    tech: ["Next.js", "Tailwind CSS", "Hotel APIs"],
    metric: "Client Project",
    link: "https://hotel.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Direct Bookings", value: "+45%" },
      { label: "Uptime", value: "100%" },
      { label: "Page Load", value: "0.4s" }
    ],
    gallery: []
  },
  {
    slug: "aureviajewelry",
    title: "Aurevia Jewelry",
    tag: "E-Commerce Boutique",
    category: "E-Commerce Boutique",
    description: "Premium luxury fashion and jewelry showcase featuring immersive editorial collections and interactive storytelling.",
    image: "/portfolio/aureviajewelry.png",
    problem: "High-end jewelry brands struggle to convey absolute premium craftsmanship and luxury heritage on standard ecommerce layouts.",
    solution: "Created an editorial e-commerce layout utilizing smooth high-fidelity animations, premium typography, and sharp assets.",
    tech: ["Next.js", "GSAP", "NextImage"],
    metric: "Client Project",
    link: "https://jewlery.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Conversion", value: "+28%" },
      { label: "User Time", value: "+120s" },
      { label: "Design Score", value: "9.9/10" }
    ],
    gallery: []
  },
  {
    slug: "velorarestaurants",
    title: "Velora Restaurants",
    tag: "Restaurant CRM",
    category: "Restaurant CRM",
    description: "Smart digital menu portal and local search optimization system engineered for fine dining spots.",
    image: "/portfolio/velorarestaurants.png",
    problem: "Elite restaurants struggle to convert local search traffic into instant reservation bookings.",
    solution: "Developed an instant SEO digital menu system coupled with autonomous SMS/WhatsApp table confirmation workflows.",
    tech: ["Next.js", "Tailwind CSS", "Map APIs"],
    metric: "Client Project",
    link: "https://restuarants.growxlabs.tech",
    status: "Live",
    results: [
      { label: "SEO Visibility", value: "+180%" },
      { label: "Reservations", value: "+34%" },
      { label: "Table Turnover", value: "+15%" }
    ],
    gallery: []
  },
  {
    slug: "returnboxbysana",
    title: "Return Box by Sana",
    tag: "SaaS Gifting",
    category: "SaaS Gifting",
    description: "Premium e-commerce platform for handcrafted gifts, featuring automated stock tracking and payment collection.",
    image: "/portfolio/returnbox.png",
    problem: "Artisanal custom gift vendors face challenges tracking complex individual order specifications at scale.",
    solution: "Engineered a streamlined dashboard that integrates checkout, custom notes, order tracking, and stock alerts.",
    tech: ["Next.js", "Supabase", "Razorpay"],
    metric: "Client Project",
    link: "https://returnbox.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Orders Tracked", value: "10k+" },
      { label: "Sellers Scale", value: "Smooth" },
      { label: "Fail Rate", value: "0%" }
    ],
    gallery: []
  },
  {
    slug: "sriblooms",
    title: "Sri Blooms Collection",
    tag: "Fashion Showcase",
    category: "Fashion Showcase",
    description: "Interactive boutique catalog showcasing premium handcrafted ethnic sarees with immersive translations.",
    image: "/portfolio/sriblooms.png",
    problem: "Boutique wear brands require high-fidelity multi-lingual localization to serve premium buyers internationally.",
    solution: "Built a next-intl powered regional boutique interface featuring stunning high-resolution product collection layouts.",
    tech: ["Next.js", "Framer Motion", "next-intl"],
    metric: "Client Project",
    link: "https://sarre.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Overseas Sales", value: "+58%" },
      { label: "Load Velocity", value: "Sub-1s" },
      { label: "Aesthetics", value: "Premium" }
    ],
    gallery: []
  },
  {
    slug: "velour",
    title: "VELOUR",
    tag: "3D Immersive Web",
    category: "3D Immersive Web",
    description: "State-of-the-art 3D interactive luxury fashion product display using high-end WebGL and smooth parallax scroll controls.",
    image: "/portfolio/velour.png",
    problem: "Modern web users expect a high-degree of digital immersion, but 3D sites often suffer from severe rendering lag and layout shifts.",
    solution: "Created a smooth WebGL frame system employing three.js shaders and GSAP to deliver cinematic, hardware-accelerated product showcases.",
    tech: ["Next.js", "Three.js", "GSAP", "Lenis"],
    metric: "Client Project",
    link: "https://fashion.growxlabs.tech",
    status: "Live",
    results: [
      { label: "Render Lag", value: "0ms" },
      { label: "Frame Rate", value: "60 FPS" },
      { label: "User Delight", value: "Extreme" }
    ],
    gallery: []
  }
  */
];
