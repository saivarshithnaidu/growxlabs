"use client";

import React, { useState } from "react";
import { 
  Play, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Key,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  Info,
  Users,
  Compass,
  Brain,
  Hammer,
  Monitor,
  Shield,
  HelpCircle,
  Network,
  GitBranch,
  Terminal,
  Activity,
  Briefcase
} from "lucide-react";

interface NodeData {
  title: string;
  subtitle: string;
  desc: string;
  tech: string;
  cost: string;
  security: string;
  icon?: string;
}

export default function ArchitecturePage() {
  const [currentTab, setCurrentTab] = useState<"pipeline" | "layers">("pipeline");
  const [activeNode, setActiveNode] = useState<string>("user");
  const [logFeed, setLogFeed] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [System Ready] Click "Simulate Request Pipeline" to trigger visual compilation path animation.`
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePaths, setActivePaths] = useState<string[]>([]);

  // System Pipeline specifications
  const pipelineDb: Record<string, NodeData> = {
    user: {
      title: "Web IDE (User Client)",
      subtitle: "Frontend Workspace Interface",
      desc: "The Next.js 15 developer client portal. Powered by React Flow v12 for the drag-and-drop no-code layout nodes and Zustand for local state. Synchronizes user prompts and visual nodes in real-time.",
      tech: "Next.js + React Flow v12",
      cost: "$0.00 (Static Client)",
      security: "Local Browser LocalStorage",
      icon: "👨‍💻"
    },
    gateway: {
      title: "API Gateway",
      subtitle: "Orchestrator Entrypoint",
      desc: "Fastify-based WebSocket server. Streams agent thoughts, logs, and build states in real-time to the client. Uses Redis to cache session blackboard logs and coordinate compiler task pipelines.",
      tech: "Fastify + WebSockets + Redis",
      cost: "~$25.00 / month",
      security: "TLS Encryption + Rate Limit Filters",
      icon: "⚡"
    },
    agent: {
      title: "Agent Orchestrator",
      subtitle: "Multi-Layer AI Coordinator",
      desc: "Coordinates the 6-layer agent brain (Analyzer, Researcher, Thinker, Auditer, Worker, Compacter). Manages model tasks via OpenRouter API and standardizes task execution through the Redis Blackboard system.",
      tech: "TypeScript + Vercel AI SDK",
      cost: "Per-Token Usage Billing",
      security: "Redis Isolated Environment",
      icon: "🧠"
    },
    sandbox: {
      title: "AWS Fargate Sandbox",
      subtitle: "Self-Hosted Code Sandbox",
      desc: "On-demand isolated Docker containers hosted on AWS ECS Fargate or GCP Cloud Run. Executes AST type-checking, linter validation, and packages compilation locally before launching compiler VMs.",
      tech: "Docker + AWS Fargate",
      cost: "Per-Second Billing ($0 when idle)",
      security: "Closed VPC, Hardened Sandboxes",
      icon: "🐳"
    },
    vault: {
      title: "HashiCorp Secure Vault",
      subtitle: "Provisioning Credentials Storage",
      desc: "Encrypts and stores developers' iOS provisioning profiles, Apple Developer certificates, Android keystore keys, and cloud deployment keys. Injects secrets dynamically during compilation steps.",
      tech: "HashiCorp Vault Service",
      cost: "$0.00 (Self-hosted on core server)",
      security: "Transit Encryption Engine (AES-256-GCM)",
      icon: "🔑"
    },
    queue: {
      title: "BullMQ Job Queue",
      subtitle: "Compilation Scheduler",
      desc: "Combines BullMQ and Redis to orchestrate native platform builds. Manages build jobs asynchronously, preventing server spikes by queuing tasks before sending them to specialized platform compiler VMs.",
      tech: "BullMQ + Redis Server",
      cost: "$10.00 / month",
      security: "Private subnet queue channels",
      icon: "📦"
    },
    mac: {
      title: "macOS Build Worker",
      subtitle: "iOS & macOS Compiler",
      desc: "Headless macOS VM worker. Pulls source assets, invokes Apple SDKs (Xcode build Tools), and automates signing credentials compilation using Fastlane. Packages native macOS .dmg and iOS .ipa files.",
      tech: "EC2 Mac Instance + Xcode",
      cost: "$1.08 / hour (Only when active)",
      security: "Apple Code Signature Validation",
      icon: "🍎"
    },
    windows: {
      title: "Windows Build Worker",
      subtitle: "Windows Installer Compiler",
      desc: "Dedicated Windows Server VM worker. Invokes Microsoft Visual C++ Build Tools (MSVC) to compile Rust/Tauri assets, and uses WiX Toolset to wrap output files into native Windows .exe and .msi setup installers.",
      tech: "Windows Server Core + WiX v4",
      cost: "$0.46 / hour (Only when active)",
      security: "Windows Authenticode Signing",
      icon: "🪟"
    },
    linux: {
      title: "Linux Build Worker",
      subtitle: "Android SDK Compiler",
      desc: "Linux Docker builder that executes Android Gradle compilations. Integrates Android NDK/SDK tools to build signed Android .apk installers and Google Play .aab publishing bundles.",
      tech: "Docker + Android Gradle SDK",
      cost: "Per-second billing (Fargate)",
      security: "Google Play App Signing Match",
      icon: "🐧"
    },
    storage: {
      title: "Cloudflare R2 Storage",
      subtitle: "Zero-Egress Distribution CDN",
      desc: "S3-compatible bucket storing all compiled mobile and desktop applications. Solves download bandwidth costs by offering $0 egress fees, enabling unlimited package downloads with flat storage fees.",
      tech: "Cloudflare R2 Bucket",
      cost: "$15.00 / month (1TB storage)",
      security: "Signed URLs (expiring links)",
      icon: "☁️"
    },
    output: {
      title: "App Distribution CDN",
      subtitle: "User Download Delivery",
      desc: "Generates signed, secure CDN links for users to download their native Windows installers, macOS apps, or mobile bundles ready for store submissions.",
      tech: "Secure CDN + Signed links",
      cost: "$0.00 (Zero-egress)",
      security: "Time-limited access token checks",
      icon: "🚀"
    }
  };

  // Gryvo Layered Architecture specifications
  const layersDb: Record<string, NodeData> = {
    // 1. Users
    users: {
      title: "1. Target Users",
      subtitle: "Gryvo App Creators",
      desc: "Empowers anyone with an idea—Founders, Entrepreneurs, Agencies, Designers, and Freelancers—to build digital products, enterprise SaaS portals, and native mobile/desktop platforms instantly without code limits.",
      tech: "Gryvo Account Service",
      cost: "Subscription/Seats Model",
      security: "MFA + OAuth Protection"
    },
    // 2. Experience Layer
    copilot: {
      title: "Experience: AI Copilot Chat",
      subtitle: "Conversational Interface",
      desc: "A natural language chat interface allowing users to describe their business goals, database models, and layout preferences. Translates prompt requests directly into active tasks.",
      tech: "Next.js WebSockets client",
      cost: "Included in seat pricing",
      security: "Content filtering + Prompt injection checks"
    },
    studio: {
      title: "Experience: Visual Studio Canvas",
      subtitle: "Drag & Drop UI Editor",
      desc: "The drag-and-drop canvas editor matching React Flow v12. Allows components layout resizing, alignment, theme changes, and action link configuration.",
      tech: "React Flow + Tailwind CSS",
      cost: "Client-side execution ($0)",
      security: "Isolated browser sandbox"
    },
    dashboard: {
      title: "Experience: Project Dashboard",
      subtitle: "Status & Progress Hub",
      desc: "Displays active builds, deployed environments, active database schemas, custom API keys, and compiler build queue logs in a clean dashboard workspace.",
      tech: "Next.js App Routing",
      cost: "$0.00",
      security: "JWT Auth Session Checks"
    },
    knowledge_center: {
      title: "Experience: Knowledge Center",
      subtitle: "Best Practice Hub",
      desc: "Serves reference templates, official API guides, layout rules, and code patterns to the Builder Layer to optimize generation quality.",
      tech: "Markdown Docs CDN",
      cost: "$0.00",
      security: "Static CDN delivery"
    },
    collab: {
      title: "Experience: Team Collaboration",
      subtitle: "Real-Time Co-Authoring",
      desc: "Enables multiple users to design layouts and edit data schemas simultaneously inside the same project workspace using CRDT-based sync engines.",
      tech: "Yjs / WebRTC Websockets",
      cost: "~$10.00 / month",
      security: "Room Access Tokens"
    },
    marketplace: {
      title: "Experience: Template Marketplace",
      subtitle: "App Marketplace",
      desc: "Hosts pre-built component templates, visual styles, custom database integrations, and third-party API plugins ready for installation.",
      tech: "Gryvo Package API",
      cost: "Dynamic Developer Revenue Split",
      security: "Plugin Sandboxing & Code Scanning"
    },
    // 3. Orchestration Runtime
    intent_engine: {
      title: "Runtime: Intent Engine (3.1)",
      subtitle: "Command Interpreter",
      desc: "Extracts intents, classifications, and system requirements from user prompts. Translates natural language commands into visual node operations and data schema migrations.",
      tech: "LLM Intent Classifier",
      cost: "Token usage billing",
      security: "Hardened system boundary validation"
    },
    planner: {
      title: "Runtime: Smart Planner (3.2)",
      subtitle: "Task Decomposition Engine",
      desc: "Breaks complex business requirements down into structured execution tasks, schedules dependencies, and structures build phases.",
      tech: "LLM Planner Agent",
      cost: "Token usage billing",
      security: "Pre-validated plan templates"
    },
    orchestrator: {
      title: "Runtime: Multi-Agent Orchestrator (3.3)",
      subtitle: "Task Router",
      desc: "Coordinates specialized agents, monitors progress, verifies compilation builds, and handles automatic code repairs on errors.",
      tech: "TypeScript Agentic Framework",
      cost: "Token usage billing",
      security: "Blackboard boundary limits"
    },
    memory: {
      title: "Runtime: Memory & Context (3.4)",
      subtitle: "Session Store",
      desc: "Maintains project history, visual layout trees, database schema states, and user design preferences across multiple prompt requests.",
      tech: "Redis Blackboard Storage",
      cost: "~$10.00 / month",
      security: "Project key separation"
    },
    rag: {
      title: "Runtime: Smart RAG Retrieval (3.5)",
      subtitle: "Knowledge Fetcher",
      desc: "Context-aware lookup matching user tasks against best-practice guides, API documentation, and code templates to inject clean patterns into code generation.",
      tech: "Qdrant Vector Database",
      cost: "~$15.00 / month",
      security: "Encrypted data vectors"
    },
    // Agents
    agent_ux: {
      title: "Agent: UI/UX Designer",
      subtitle: "Aesthetic Auditor",
      desc: "Ensures every generated component respects spacing rules, typographic hierarchy scales, and contrast ratios. Rejects bad styles.",
      tech: "Linter Agent Engine",
      cost: "Per-build check",
      security: "Local CSS check scripts"
    },
    agent_backend: {
      title: "Agent: Backend Developer",
      subtitle: "API Code Generator",
      desc: "Writes server action handlers, database queries, and integration webhooks. Ensures type safety and parses models automatically.",
      tech: "TypeScript Codegen Agent",
      cost: "Per-build check",
      security: "Closed Sandbox Compilation"
    },
    // 4. Builder Layer
    build_design: {
      title: "Builder: Design System (4.1)",
      subtitle: "Aesthetic Core",
      desc: "Compiles design tokens, layout templates, colors, and button margins to keep the user interface consistent.",
      tech: "Tailwind Theme Tokens",
      cost: "$0.00",
      security: "Config file read-only locks"
    },
    build_code: {
      title: "Builder: Code Engine (4.2)",
      subtitle: "Compile Generator",
      desc: "Maintains code standards, cleans imports, and handles bidirectional canvas AST sync tasks.",
      tech: "TypeScript AST Compiler API",
      cost: "$0.00",
      security: "Strict code parser rules"
    },
    build_data: {
      title: "Builder: Data Layer (4.3)",
      subtitle: "Database Migrator",
      desc: "Automates SQL schemas, migrations, relations, indexing, and seeds based on user data descriptions.",
      tech: "Prisma ORM / Supabase Sync",
      cost: "$0.00",
      security: "SQL injection scanner filters"
    },
    // 5. Output
    out_web: {
      title: "Output: Web App Target",
      subtitle: "HTML5 Responsive Portal",
      desc: "Builds responsive web applications deployed on global CDN nodes (Vercel, Netlify, or self-hosted).",
      tech: "Next.js App Router",
      cost: "Included",
      security: "HTTPS + Cloudflare CDN"
    },
    out_mobile: {
      title: "Output: Native iOS & Android",
      subtitle: "Tauri Mobile Wrapper",
      desc: "Compiles native iOS and Android application binaries with a 1-click installer pipeline, ready for app store submissions.",
      tech: "Tauri v2 + Rust compiler",
      cost: "Included in worker runs",
      security: "Apple & Android signature matches"
    },
    out_desktop: {
      title: "Output: Desktop Platforms",
      subtitle: "Windows & Mac Binaries",
      desc: "Builds native `.exe`, `.msi`, and `.dmg` installers utilizing Tauri's system webview layer, ensuring lightweight footprints (~8MB).",
      tech: "Tauri v2 + Rust compiler",
      cost: "Included in worker runs",
      security: "Windows Authenticode Signing"
    }
  };

  const writeLog = (text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogFeed(prev => [...prev, `[${time}] ${text}`]);
  };

  const startFlowSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActivePaths([]);
    writeLog("[Simulation] Initializing client prompt transaction...");

    const lines = [
      { id: "line1", text: "WebIDE ➔ Fastify Gateway WebSocket connection opened." },
      { id: "line2", text: "Orchestrator initialized task in Redis Blackboard." },
      { id: "line3", text: "OpenRouter called for agent task planning." },
      { id: "line4", text: "AWS Fargate Docker sandbox verified compilation checks." },
      { id: "line5", text: "HashiCorp Vault injected developer keys." },
      { id: "line6a", text: "Sandbox verified and credentials prepared." },
      { id: "line6b", text: "Coordinating task scheduling inside BullMQ queue." },
      { id: "line7", text: "macOS EC2 Xcode pipeline compiled signed iOS bundle." },
      { id: "line8", text: "Windows Server MSVC compiled native .msi installer." },
      { id: "line9", text: "Linux Gradle SDK compiled Google Play .aab bundle." },
      { id: "line10", text: "Build artifacts pushed to Cloudflare R2 bucket." },
      { id: "line11", text: "R2 storage saved build output." },
      { id: "line12", text: "Delivery pipelines synced successfully." },
      { id: "line13", text: "Signed download CDN links generated. Build completed successfully! 🚀" }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < lines.length) {
        const line = lines[step];
        if (line.id === "line6a" || line.id === "line6b") {
          setActivePaths(prev => [...prev, "line6a", "line6b"]);
        } else {
          setActivePaths(prev => [...prev, line.id]);
        }
        writeLog(line.text);
        step++;
      } else {
        clearInterval(interval);
        writeLog("[Simulation] System pipeline trace completed. All nodes online.");
        setIsSimulating(false);
      }
    }, 900);
  };

  const resetSimulation = () => {
    setActivePaths([]);
    writeLog("[Simulation] Resetting connection lines.");
  };

  const inspectNode = (key: string, isLayer = false) => {
    setActiveNode(key);
    const db = isLayer ? layersDb : pipelineDb;
    writeLog(`[Inspector] Selected node: ${db[key]?.title}. Read full specifications.`);
  };

  const currentData = currentTab === "pipeline" 
    ? (pipelineDb[activeNode] || pipelineDb.user) 
    : (layersDb[activeNode] || layersDb.users);

  return (
    <div className="w-full h-screen bg-[#0b0b0c] text-zinc-200 flex flex-col overflow-hidden select-none font-sans">
      
      {/* Header */}
      <header className="border-b border-[#222225] bg-[#121214] px-8 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5856d6] block animate-pulse"></span>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            Gryvo Platform <span className="text-zinc-500 font-medium">|</span> <span className="text-zinc-400 text-sm font-semibold">Systems Architecture Blueprint</span>
          </h1>
        </div>

        {/* Tab Selector Segment Control */}
        <div className="flex bg-[#1c1c1e] p-1 rounded-xl border border-[#222225]">
          <button 
            onClick={() => { setCurrentTab("pipeline"); setActiveNode("user"); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              currentTab === "pipeline" ? "bg-[#5856d6] text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            System Pipeline
          </button>
          <button 
            onClick={() => { setCurrentTab("layers"); setActiveNode("users"); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              currentTab === "layers" ? "bg-[#5856d6] text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Gryvo Layer Map
          </button>
        </div>

        <div className="flex items-center gap-3">
          {currentTab === "pipeline" && (
            <>
              <button 
                onClick={startFlowSimulation} 
                disabled={isSimulating}
                className="bg-[#5856d6] hover:bg-[#4745c1] disabled:opacity-40 disabled:hover:scale-100 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-105"
              >
                {isSimulating ? "Simulating..." : "Simulate Request Pipeline"}
              </button>
              <button 
                onClick={resetSimulation} 
                className="border border-[#222225] hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              >
                Reset
              </button>
            </>
          )}
          <span className="text-xs text-zinc-500 font-mono">v1.0.0</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area: Viewport Canvas */}
        <div className="flex-1 p-6 overflow-auto relative custom-scroll flex items-center justify-center bg-[#0c0c0e]">
          
          {/* TAB 1: System Compile Network Pipeline */}
          {currentTab === "pipeline" && (
            <div className="relative w-[1800px] h-[400px] shrink-0 z-10 mx-auto my-auto">
              
              {/* SVG Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <path d="M 130 200 L 240 200" stroke={activePaths.includes("line1") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line1") ? "3" : "2"} className={activePaths.includes("line1") ? "flow-line" : ""} fill="none" />
                <path d="M 380 200 L 460 200" stroke={activePaths.includes("line2") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line2") ? "3" : "2"} className={activePaths.includes("line2") ? "flow-line" : ""} fill="none" />
                <path d="M 600 200 L 640 200" stroke={activePaths.includes("line3") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line3") ? "3" : "2"} className={activePaths.includes("line3") ? "flow-line" : ""} fill="none" />
                
                <path d="M 640 200 L 640 100 L 680 100" stroke={activePaths.includes("line4") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line4") ? "3" : "2"} className={activePaths.includes("line4") ? "flow-line" : ""} fill="none" />
                <path d="M 640 200 L 640 300 L 680 300" stroke={activePaths.includes("line5") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line5") ? "3" : "2"} className={activePaths.includes("line5") ? "flow-line" : ""} fill="none" />
                
                <path d="M 820 100 L 880 100 L 880 200 L 940 200" stroke={activePaths.includes("line6a") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line6a") ? "3" : "2"} className={activePaths.includes("line6a") ? "flow-line" : ""} fill="none" />
                <path d="M 820 300 L 880 300 L 880 200 L 940 200" stroke={activePaths.includes("line6b") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line6b") ? "3" : "2"} className={activePaths.includes("line6b") ? "flow-line" : ""} fill="none" />
                
                <path d="M 1060 200 L 1100 200 L 1100 100 L 1160 100" stroke={activePaths.includes("line7") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line7") ? "3" : "2"} className={activePaths.includes("line7") ? "flow-line" : ""} fill="none" />
                <path d="M 1060 200 L 1160 200" stroke={activePaths.includes("line8") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line8") ? "3" : "2"} className={activePaths.includes("line8") ? "flow-line" : ""} fill="none" />
                <path d="M 1060 200 L 1100 200 L 1100 300 L 1160 300" stroke={activePaths.includes("line9") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line9") ? "3" : "2"} className={activePaths.includes("line9") ? "flow-line" : ""} fill="none" />
                
                <path d="M 1300 100 L 1340 100 L 1340 200 L 1380 200" stroke={activePaths.includes("line10") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line10") ? "3" : "2"} className={activePaths.includes("line10") ? "flow-line" : ""} fill="none" />
                <path d="M 1300 200 L 1380 200" stroke={activePaths.includes("line11") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line11") ? "3" : "2"} className={activePaths.includes("line11") ? "flow-line" : ""} fill="none" />
                <path d="M 1300 300 L 1340 300 L 1340 200 L 1380 200" stroke={activePaths.includes("line12") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line12") ? "3" : "2"} className={activePaths.includes("line12") ? "flow-line" : ""} fill="none" />
                
                <path d="M 1520 200 L 1580 200" stroke={activePaths.includes("line13") ? "#5856d6" : "#222225"} strokeWidth={activePaths.includes("line13") ? "3" : "2"} className={activePaths.includes("line13") ? "flow-line" : ""} fill="none" />
              </svg>

              {/* Nodes list */}
              <div onClick={() => inspectNode("user")} className={`absolute left-[20px] top-[150px] w-[110px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "user" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">User</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mb-1 text-base">{pipelineDb.user.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Next.js IDE</span>
              </div>

              <div onClick={() => inspectNode("gateway")} className={`absolute left-[240px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "gateway" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-[#2f80ed] uppercase tracking-wider mb-1">API Gateway</span>
                <div className="w-8 h-8 rounded-lg bg-[#2f80ed]/15 flex items-center justify-center text-base mb-1">{pipelineDb.gateway.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Fastify & Redis</span>
              </div>

              <div onClick={() => inspectNode("agent")} className={`absolute left-[460px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "agent" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Orchestrator</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-base mb-1">{pipelineDb.agent.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Blackboard Engine</span>
              </div>

              <div onClick={() => inspectNode("sandbox")} className={`absolute left-[680px] top-[50px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "sandbox" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Fargate VM</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-base mb-1">{pipelineDb.sandbox.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Docker Sandbox</span>
              </div>

              <div onClick={() => inspectNode("vault")} className={`absolute left-[680px] top-[250px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "vault" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Vault</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-base mb-1">{pipelineDb.vault.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Secure Keys Certs</span>
              </div>

              <div onClick={() => inspectNode("queue")} className={`absolute left-[940px] top-[150px] w-[120px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "queue" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Build Queue</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base mb-1">{pipelineDb.queue.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">BullMQ Scheduler</span>
              </div>

              <div onClick={() => inspectNode("mac")} className={`absolute left-[1160px] top-[50px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "mac" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">macOS EC2</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base mb-1">{pipelineDb.mac.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">iOS Xcode Build</span>
              </div>

              <div onClick={() => inspectNode("windows")} className={`absolute left-[1160px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "windows" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Windows VM</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-base mb-1">{pipelineDb.windows.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Windows MSVC</span>
              </div>

              <div onClick={() => inspectNode("linux")} className={`absolute left-[1160px] top-[250px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "linux" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Linux VM</span>
                <div className="w-8 h-8 rounded-lg bg-amber-600/15 flex items-center justify-center text-base mb-1">{pipelineDb.linux.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Android Gradle SDK</span>
              </div>

              <div onClick={() => inspectNode("storage")} className={`absolute left-[1380px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "storage" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-[#ff8000] uppercase tracking-wider mb-1">Storage</span>
                <div className="w-8 h-8 rounded-lg bg-[#ff8000]/15 flex items-center justify-center text-base mb-1">{pipelineDb.storage.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Zero Egress R2</span>
              </div>

              <div onClick={() => inspectNode("output")} className={`absolute left-[1580px] top-[150px] w-[120px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 z-10 ${activeNode === "output" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"}`}>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Publish</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-base mb-1">{pipelineDb.output.icon}</div>
                <span className="text-[9px] text-zinc-500 font-mono">Store Delivery</span>
              </div>

            </div>
          )}

          {/* TAB 2: Gryvo Layered Architecture Map */}
          {currentTab === "layers" && (
            <div className="w-full max-w-[1200px] flex gap-4 min-h-[600px] items-stretch z-10 py-4 font-sans text-xs">
              
              {/* Left Side: Knowledge & Specialized Agents */}
              <div className="w-[200px] flex flex-col gap-4">
                
                {/* Knowledge Sources */}
                <div className="flex-1 bg-[#121214] border border-[#222225] rounded-2xl p-4 flex flex-col gap-2">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1"><Info className="w-3 h-3 text-[#5856d6]" /> Knowledge</h3>
                  {["Documentation", "Open Source", "Best Practices", "Community", "Blogs/Guides", "Uploads"].map((item, idx) => (
                    <div key={idx} className="bg-[#1c1c1e] border border-zinc-800 p-2 rounded-lg text-zinc-300 font-medium hover:border-zinc-600 transition-colors">
                      {item}
                    </div>
                  ))}
                </div>

                {/* Specialized Agents */}
                <div className="flex-1 bg-[#121214] border border-[#222225] rounded-2xl p-4 flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scroll">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1"><Cpu className="w-3 h-3 text-purple-400" /> AI Agents</h3>
                  {[
                    { id: "agent_ux", label: "UI/UX Agent" },
                    { id: "agent_backend", label: "Backend Agent" },
                    { id: "agent_db", label: "Database Agent" },
                    { id: "agent_qa", label: "QA Tester" },
                    { id: "agent_sec", label: "Security Agent" }
                  ].map((agent) => (
                    <div 
                      key={agent.id} 
                      onClick={() => inspectNode(agent.id === "agent_ux" || agent.id === "agent_backend" ? agent.id : "agent_ux", true)}
                      className={`p-2 rounded-lg border font-medium cursor-pointer transition-colors text-zinc-300 ${
                        activeNode === agent.id ? "border-[#5856d6] bg-[rgba(88,86,214,0.03)]" : "border-zinc-800 hover:border-zinc-650 bg-[#1c1c1e]"
                      }`}
                    >
                      {agent.label}
                    </div>
                  ))}
                </div>

              </div>

              {/* Center Column: The 7 Vertical Layers Stack */}
              <div className="flex-1 flex flex-col gap-3 justify-between">
                
                {/* 1. Users */}
                <div 
                  onClick={() => inspectNode("users", true)} 
                  className={`bg-[#121214] border rounded-2xl p-3 cursor-pointer transition-all ${
                    activeNode === "users" ? "border-[#5856d6] shadow-[0_0_10px_rgba(88,86,214,0.15)]" : "border-[#222225] hover:border-zinc-600"
                  }`}
                >
                  <h4 className="text-[10px] font-bold text-[#5856d6] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> 1. Users (Anyone With an Idea)
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Founders", "Entrepreneurs", "Businesses", "Developers", "Designers", "Agencies"].map((u, i) => (
                      <span key={i} className="bg-[#1c1c1e] border border-zinc-800 px-3 py-1 rounded-full text-zinc-300 font-semibold text-[10px]">{u}</span>
                    ))}
                  </div>
                </div>

                {/* 2. Experience Layer */}
                <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                  <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5" /> 2. Experience Layer
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "copilot", label: "AI Copilot Chat" },
                      { id: "studio", label: "Visual Studio" },
                      { id: "dashboard", label: "Project Hub" },
                      { id: "knowledge_center", label: "Docs Guide" },
                      { id: "collab", label: "Collab Sync" },
                      { id: "marketplace", label: "Marketplace" }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => inspectNode(item.id, true)}
                        className={`p-2 rounded-lg border text-center font-medium cursor-pointer transition-colors text-zinc-300 ${
                          activeNode === item.id ? "border-[#5856d6] bg-[rgba(88,86,214,0.03)]" : "border-zinc-800 hover:border-zinc-650 bg-[#1c1c1e]"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Intelligent Orchestration Runtime (The Brain) */}
                <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" /> 3. Intelligent Orchestration Runtime
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "intent_engine", label: "3.1 Intent Engine" },
                      { id: "planner", label: "3.2 Planner Agent" },
                      { id: "orchestrator", label: "3.3 Orchestrator" }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => inspectNode(item.id, true)}
                        className={`p-2 rounded-lg border text-center font-semibold cursor-pointer transition-colors text-zinc-350 ${
                          activeNode === item.id ? "border-[#5856d6] bg-[rgba(88,86,214,0.03)]" : "border-zinc-800 hover:border-zinc-650 bg-[#1c1c1e]"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div onClick={() => inspectNode("memory", true)} className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer text-zinc-400 text-[10px] ${activeNode === "memory" ? "border-[#5856d6]" : "border-zinc-800 bg-[#171719]"}`}>3.4 Memory & Context Layer</div>
                    <div onClick={() => inspectNode("rag", true)} className={`p-1.5 rounded-lg border text-center font-medium cursor-pointer text-zinc-400 text-[10px] ${activeNode === "rag" ? "border-[#5856d6]" : "border-zinc-800 bg-[#171719]"}`}>3.5 Knowledge Retrieval (RAG)</div>
                  </div>
                </div>

                {/* 4. Builder Layer */}
                <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                  <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5" /> 4. Builder Layer (What Gets Built)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "build_design", label: "Design System" },
                      { id: "build_code", label: "Code Engine" },
                      { id: "build_data", label: "Data Schema" }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => inspectNode(item.id, true)}
                        className={`p-2 rounded-lg border text-center font-medium cursor-pointer transition-colors text-zinc-300 ${
                          activeNode === item.id ? "border-[#5856d6] bg-[rgba(88,86,214,0.03)]" : "border-zinc-800 hover:border-zinc-650 bg-[#1c1c1e]"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Output Platforms */}
                <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5" /> 5. Output Platforms (Build Once, Deploy Everywhere)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "out_web", label: "Next.js Web" },
                      { id: "out_mobile", label: "Native iOS/Android" },
                      { id: "out_desktop", label: "Tauri Desktop" }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => inspectNode(item.id, true)}
                        className={`p-2 rounded-lg border text-center font-medium cursor-pointer transition-colors text-zinc-300 ${
                          activeNode === item.id ? "border-[#5856d6] bg-[rgba(88,86,214,0.03)]" : "border-zinc-800 hover:border-zinc-650 bg-[#1c1c1e]"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. DevOps & 7. Governance */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                    <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Server className="w-3 h-3 text-zinc-500" /> 6. DevOps Infra</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Fargate & Docker Pipelines</span>
                  </div>
                  <div className="bg-[#121214] border border-[#222225] rounded-2xl p-3">
                    <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Shield className="w-3 h-3 text-zinc-500" /> 7. Trust & Governance</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">HashiCorp Vault Credentials</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Integrations & Exec Engine */}
              <div className="w-[200px] flex flex-col gap-4">
                
                {/* External Integrations */}
                <div className="flex-1 bg-[#121214] border border-[#222225] rounded-2xl p-4 flex flex-col gap-2">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1"><Network className="w-3 h-3 text-[#ff8000]" /> Integrations</h3>
                  {["GitHub API", "Stripe Checkout", "SendGrid Mail", "Firebase Sync", "Supabase DB", "Analytics"].map((item, idx) => (
                    <div key={idx} className="bg-[#1c1c1e] border border-zinc-800 p-2 rounded-lg text-zinc-300 font-medium hover:border-zinc-600 transition-colors">
                      {item}
                    </div>
                  ))}
                </div>

                {/* Execution Engine */}
                <div className="flex-1 bg-[#121214] border border-[#222225] rounded-2xl p-4 flex flex-col gap-2">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mb-2 flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-400" /> Execution</h3>
                  {["Code Gen", "Build Compile", "App Signed Deploy", "Health Monitor", "Performance"].map((item, idx) => (
                    <div key={idx} className="bg-[#1c1c1e] border border-zinc-800 p-2 rounded-lg text-zinc-300 font-medium hover:border-zinc-600 transition-colors">
                      {item}
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Right Area: Inspector Panel (Persistent Detail View) */}
        <div className="w-[360px] border-l border-[#222225] bg-[#121214] p-6 flex flex-col justify-between overflow-y-auto custom-scroll z-10 shrink-0">
          
          <div>
            <div className="flex items-center gap-2 border-b border-[#222225] pb-4 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5856d6]"></div>
              <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">Node Inspector</span>
            </div>

            {/* Dynamic Content Header */}
            <div>
              <h2 className="text-lg font-bold text-white mb-1">{currentData.title}</h2>
              <p className="text-xs text-[#5856d6] font-semibold uppercase tracking-wider">{currentData.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              {currentData.desc}
            </p>

            {/* Tech Specifications List */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex justify-between border-b border-[#222225] pb-2 items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Engine/Tech</span>
                <span className="text-xs font-mono font-medium text-zinc-350 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{currentData.tech}</span>
              </div>
              <div className="flex justify-between border-b border-[#222225] pb-2 items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Operational Cost</span>
                <span className="text-xs font-mono font-medium text-emerald-400">{currentData.cost}</span>
              </div>
              <div className="flex justify-between border-b border-[#222225] pb-2 items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Security Protocol</span>
                <span className="text-xs font-mono font-medium text-blue-400">{currentData.security}</span>
              </div>
            </div>
          </div>

          {/* Bottom System Status Summary */}
          <div className="border-t border-[#222225] pt-4 mt-6">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Simulation Status Log</h4>
            <div className="h-28 bg-black rounded-lg p-2.5 font-mono text-[9px] text-zinc-400 overflow-y-auto leading-relaxed border border-zinc-800 custom-scroll whitespace-pre-line">
              {logFeed.join("\n")}
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        /* Custom Keyframe animation for path flow */
        @keyframes pulse-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .flow-line {
          stroke-dasharray: 8, 4;
          animation: pulse-flow 1.5s infinite linear;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #222225;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #2e2e32;
        }
      `}</style>

    </div>
  );
}
