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
    image: "/portfolio/resumeforgeai.png",
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
    image: "/portfolio/universalai.png",
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
    image: "/portfolio/recruitai.png",
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
  },
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
];
