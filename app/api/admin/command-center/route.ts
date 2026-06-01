import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, files } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const query = message.toLowerCase().trim();

    // 1. PROPOSAL INTENT (Proposal, Sales, CFO, Research)
    if (query.includes("proposal") || query.includes("abc hospital") || query.includes("xyz")) {
      const hospitalName = query.includes("abc hospital") ? "ABC Hospital Group" : "XYZ Enterprise";
      
      return NextResponse.json({
        intent: "PROPOSAL",
        activeAgents: ["Research Agent", "Sales Agent", "CFO Agent", "Proposal Agent"],
        activity: [
          "Research Agent: Investigating market background and regional medical workflows for " + hospitalName + "...",
          "Sales Agent: Qualifying client intent and mapping digital pain points to GrowXLabs CRM suites...",
          "CFO Agent: Running pricing tier projections and calculating standard/custom implementation margins...",
          "Proposal Agent: Drafting project scope of work, milestone timelines, and deliverable packages...",
          "Central Orchestrator: Synthesizing multi-agent outputs into a unified client proposal..."
        ],
        output: `# Proposal Executive Summary: GrowXLabs × ${hospitalName}

This proposal outlines the strategic deployment of the **GrowXLabs CRM & Operational Intelligence Suite** for ${hospitalName}. Prepared collaboratively by GXL Command Center agents, this document represents our complete diagnostic and implementation roadmap.

---

## 1. Diagnostic Findings & Research
* **Research Agent Analysis:** ${hospitalName} operates in a highly regulated healthcare workflow with latency issues around client intake and scheduling.
* **Problem Statement:** Current workflows lose approximately **22% of prospect conversions** due to delayed intake follow-ups and manual scheduling pipelines.
* **Target Solution:** AI-driven scheduling automation and unified patient onboarding CRM nodes.

---

## 2. Scope of Work (SOW) & Deliverables
* **Phase 1: Digital Architecture Blueprint (Weeks 1-2):** Complete database schemas and HIPAA-compliant API pipelines.
* **Phase 2: CRM Core Integration (Weeks 3-6):** Custom intake widgets, staff scheduling consoles, and analytics hooks.
* **Phase 3: AI Agent Workspace Rollout (Weeks 7-9):** Active background agents handling patient inquiry qualification 24/7.
* **Phase 4: Training & Handover (Week 10):** Complete administrative dashboard tutorials and staff onboarding.

---

## 3. CFO Financial Breakdown & Pricing
Our Pricing Agent has compiled three customized pricing structures based on transaction scale:

| Option | Package Detail | Timeline | Price (INR) |
| :--- | :--- | :--- | :--- |
| **Standard Tier** | Core CRM & Automations | 6 Weeks | **₹4,50,000** |
| **Growth Tier (Recommended)** | Standard + AI Inquiry Agents | 9 Weeks | **₹7,50,000** |
| **Enterprise Suite** | Full Agentic Ops OS + 1 Year SLA | 12 Weeks | **₹12,00,000** |

---

## 4. Operational Timeline & Milestones
* **Milestone 1:** Architecture Sign-off (End of Week 2)
* **Milestone 2:** CRM Front-End Console Alpha (End of Week 5)
* **Milestone 3:** AI Scheduling Agent Integration (End of Week 8)
* **Milestone 4:** Full Platform Handover & Launch (End of Week 10)
`,
        proposal: {
          clientName: hospitalName,
          budget: "₹7,50,000",
          timeline: "10 Weeks",
          deliverables: ["HIPAA-Compliant Patient Intake CRM", "Autonomous AI Inquiry Agent System", "1 Year Support SLA"],
          status: "DRAFT_COMPLETED"
        }
      });
    }

    // 2. CONTENT / SEO INTENT (Content, SEO, Research, Trend)
    if (query.includes("post") || query.includes("content") || query.includes("today")) {
      return NextResponse.json({
        intent: "CONTENT",
        activeAgents: ["Research Agent", "Trend Agent", "SEO Agent", "Content Agent"],
        activity: [
          "Research Agent: Querying search matrices for trending high-volume tech topics...",
          "Trend Agent: Scanning X/Twitter and LinkedIn developer hubs for modern software engineering discussions...",
          "SEO Agent: Performing keyword competition analysis and establishing ranking parameters...",
          "Content Agent: Crafting high-converting hooks, captions, and call-to-actions...",
          "Central Orchestrator: Unifying editorial copy and meta keywords..."
        ],
        output: `# GrowXLabsTech Daily Editorial Briefing

Our Content, SEO, and Trend agents have collaborated to design today's high-performing professional post copy. 

---

## 1. Editorial Strategy
* **Core Topic:** *Why Autonomous AI Agents Will Replace Standard Chatbots in 2026.*
* **Target Audience:** CTOs, Tech Founders, and Startup Operations Leads.
* **Primary Objective:** Drive clicks to our new article: **"Chatbots Are Dying. Agents Are Taking Over."**

---

## 2. Social Copy Blueprint (LinkedIn / X)

> **🎯 THE HOOK:**
> If your company is still building "chatbots" to solve business problems in 2026, you are operating on a outdated playbook. 
> 
> Standard AI chat is reactive—it waits for a question, outputs text, and requires a human to do the actual work.
> 
> The next era isn't about conversation. **It's about execution.**
> 
> **💡 THE BODY:**
> We are officially entering the **Agent Era**. 
> Autonomous AI agents don't just answer questions. They:
> 1. Plan complex workflows upfront
> 2. Spin up parallel subagents to coordinate tasks
> 3. Connect securely to your database, CRM, and APIs
> 4. Verify outputs before returning results
> 
> *The difference is massive: Chatbots give you text. Agents give you outcomes.*
> 
> **🔥 THE CALL-TO-ACTION (CTA):**
> Read our full diagnostic review on why chatbots are dying and how autonomous agents are transforming startup operations:
> 👉 https://growxlabs.tech/en-IN/blog/chatbots-are-dying-agents-are-taking-over

---

## 3. SEO Meta Parameters
* **Primary Focus Keyword:** \`AI Agents vs Chatbots\` (Volume: 12.5k/mo, Difficulty: Low)
* **Secondary Keywords:** \`Autonomous Workflows\`, \`CRM Agents\`, \`Startup Scaling\`
* **Recommended Tags:** \`#ArtificialIntelligence\` \`#BusinessAutomation\` \`#AgenticCoding\` \`#StartupScaling\` \`#GrowXLabsTech\`
`
      });
    }

    // 3. GROWTH / ANALYTICS INTENT (CEO, CFO, Analytics)
    if (query.includes("analyze") || query.includes("growth") || query.includes("revenue") || query.includes("website")) {
      return NextResponse.json({
        intent: "GROWTH",
        activeAgents: ["CEO Agent", "CFO Agent", "Analytics Agent"],
        activity: [
          "Analytics Agent: Pulling real-time transactional statistics, life-time enrollments, and test scores...",
          "CFO Agent: Processing financial trajectories and forecasting revenue models...",
          "CEO Agent: Formulating strategic growth recommendations and risk mitigation roadmaps...",
          "Central Orchestrator: Generating interactive metrics dashboard charts..."
        ],
        output: `# GrowXLabs Corporate Growth Diagnostic

This diagnostic has been generated by GXL Command Center's executive suite.

---

## 1. Executive Summary & Trajectory
GrowXLabs Academy is demonstrating strong velocity across student onboarding, course sales, and curriculum certifications. 

Our current lifetime revenue projection indicates a **24.2% month-over-month expansion**, driven by high-ticket automation course enrollments.

---

## 2. Strategic Opportunity Grid

### A. Launch GXL Command Center Internally (CEO recommendation)
* **Rationale:** Operational teams spend approximately **28% of their time** manually moving data between CRM tables, email triggers, and proposals.
* **Target Impact:** Deploying the Command Center internally will reduce proposal generation latency from **24 hours to 3 minutes**.

### B. Scaled Subscription Models (CFO recommendation)
* **Rationale:** Transitioning one-time course sales into monthly SaaS academy memberships will secure a highly predictable **Monthly Recurring Revenue (MRR)**.
* **Target Impact:** Expecting a **30% lift in customer lifetime value (LTV)** within 60 days of launch.

---

## 3. Financial Forecast (SVG Chart Available Below)
The CFO Agent predicts revenue reaching the following milestones:

* **Current Quarter:** ₹1,20,000 (Base Platform Velocity)
* **Q3 2026 Forecast:** ₹3,80,000 (With SaaS Academy rollout)
* **Q4 2026 Forecast:** ₹8,50,000 (Following full administrative automation integrations)
`,
        chart: [
          { month: "Jan", revenue: 45000 },
          { month: "Feb", revenue: 62000 },
          { month: "Mar", revenue: 58000 },
          { month: "Apr", revenue: 75000 },
          { month: "May", revenue: 90000 },
          { month: "Jun", revenue: 120000 },
        ]
      });
    }

    // 4. CTO / TECHNICAL INTENT (CTO, Engineering)
    if (query.includes("code") || query.includes("architecture") || query.includes("tech") || query.includes("review")) {
      return NextResponse.json({
        intent: "CTO",
        activeAgents: ["CTO Agent", "Engineering Agent"],
        activity: [
          "CTO Agent: Analyzing target directory layout and reviewing framework dependencies...",
          "Engineering Agent: Auditing client/server code boundaries and compiling security logs...",
          "Central Orchestrator: Constructing structural refactoring report..."
        ],
        output: `# Technical Architecture Audit: GXL Command Center

This audit details the security, performance, and scalability limits of the new AI Operating System interface.

---

## 1. Dependency Analysis
* **Core Framework:** Next.js 15 (App Router with multilingual URL structures).
* **Database Engine:** Supabase Server Client (fully isolated transaction pools).
* **AI Orchestrator Engine:** Provider-agnostic serverless routing API compatible with Google Gemini, Anthropic Claude Messages, and OpenAI Chat Completion formats.

---

## 2. Code Boundaries Audit
* **Client Components:** Clean client state hooks utilized for progress indicators, interactive forms, and sharing handlers.
* **Server Components:** Metadata generators ('generateMetadata()') and database calls are executed strictly on the server to prevent exposing security tokens or Supabase credentials.

---

## 3. Performance & GPU Optimization
* **Compositor Safety:** Removed rotating absolute SVG filters to completely eliminate GPU composition VRAM cache overload in Chrome.
* **Animations:** Transition-all styles scaled down to targeted opacity and scale transitions, ensuring high-performance hardware-acceleration across mobile web views.
`
      });
    }

    // 5. FALLBACK / GENERAL INTENT (Research, Content, CEO)
    return NextResponse.json({
      intent: "GENERAL",
      activeAgents: ["Research Agent", "Content Agent", "CEO Agent"],
      activity: [
        "Research Agent: Investigating context on '" + message + "'...",
        "Content Agent: Structuring clear explanation blocks...",
        "CEO Agent: Formulating high-level operational advice...",
        "Central Orchestrator: Unifying findings..."
      ],
      output: `# GrowXLabs Central Workspace Response

Thank you for querying **GXL Command Center**. 

We have activated the **Research**, **Content**, and **CEO** agents to formulate a unified response to your request:

&ldquo;*${message}*&rdquo;

---

## 1. Executive Research Summary
Our Research Agent completed a context mapping for your query. 
* **Focus Area:** Administrative automation, workflow scaling, and AI agent integration.
* **Insights:** Implementing autonomous execution triggers inside your admin panel will reduce manual tasks by up to **70%**.

---

## 2. Actionable Operational Steps
To drive growth based on this topic, our CEO Agent recommends taking three immediate actions:
1. **Reset Database Pipelines:** Ensure your lead scoring engines are automatically piped into your scraper dashboards.
2. **Launch Content Campaigns:** Focus your marketing outreach on demonstrating autonomous outcomes rather than simple chatbot solutions.
3. **Automate Outreach Flows:** Set up automated n8n triggers to book follow-ups when AI qualifies high-ticket prospects.
`
    });

  } catch (error: any) {
    console.error("Command Center Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
