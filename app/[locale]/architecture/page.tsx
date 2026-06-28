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
  Info
} from "lucide-react";

interface NodeData {
  title: string;
  subtitle: string;
  desc: string;
  tech: string;
  cost: string;
  security: string;
  icon: string;
}

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState<string>("user");
  const [logFeed, setLogFeed] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [System Ready] Click "Simulate Request Pipeline" to trigger visual compilation path animation.`
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePaths, setActivePaths] = useState<string[]>([]);

  // System specifications database
  const nodesDb: Record<string, NodeData> = {
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
      { id: "line6", text: "BullMQ scheduled build task to compilers." },
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
        setActivePaths(prev => [...prev, line.id]);
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

  const inspectNode = (key: string) => {
    setActiveNode(key);
    writeLog(`[Inspector] Selected node: ${nodesDb[key]?.title}. Read full specifications.`);
  };

  const currentData = nodesDb[activeNode] || nodesDb.user;

  return (
    <div className="w-full h-screen bg-[#0b0b0c] text-zinc-200 flex flex-col overflow-hidden select-none font-sans">
      
      {/* Header */}
      <header className="border-b border-[#222225] bg-[#121214] px-8 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5856d6] block animate-pulse"></span>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            Brio Platform <span className="text-zinc-500 font-medium">|</span> <span className="text-zinc-400 text-sm font-semibold">Systems Architecture Blueprint</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
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
          <span className="text-xs text-zinc-500 font-mono">v1.0.0</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area: Interactive Architecture Grid */}
        <div className="flex-1 p-6 overflow-auto relative custom-scroll flex items-center justify-center min-h-[600px] bg-[#0c0c0e]">
          
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Connection Paths */}
            <path d="M 120 200 L 260 200" stroke={activePaths.includes("line1") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line1") ? "3" : "2"} className={activePaths.includes("line1") ? "flow-line" : ""} fill="none" />
            <path d="M 380 200 L 480 200" stroke={activePaths.includes("line2") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line2") ? "3" : "2"} className={activePaths.includes("line2") ? "flow-line" : ""} fill="none" />
            <path d="M 600 200 L 700 200" stroke={activePaths.includes("line3") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line3") ? "3" : "2"} className={activePaths.includes("line3") ? "flow-line" : ""} fill="none" />
            
            {/* Split to Sandbox & Vault */}
            <path d="M 760 160 L 760 100 L 840 100" stroke={activePaths.includes("line4") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line4") ? "3" : "2"} className={activePaths.includes("line4") ? "flow-line" : ""} fill="none" />
            <path d="M 760 240 L 760 300 L 840 300" stroke={activePaths.includes("line5") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line5") ? "3" : "2"} className={activePaths.includes("line5") ? "flow-line" : ""} fill="none" />
            
            {/* Queue line */}
            <path d="M 960 100 L 1020 100 L 1020 200 L 1080 200" stroke={activePaths.includes("line6") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line6") ? "3" : "2"} className={activePaths.includes("line6") ? "flow-line" : ""} fill="none" />
            
            {/* Compiler workers split */}
            <path d="M 1200 200 L 1240 200 L 1240 100 L 1280 100" stroke={activePaths.includes("line7") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line7") ? "3" : "2"} className={activePaths.includes("line7") ? "flow-line" : ""} fill="none" />
            <path d="M 1240 200 L 1280 200" stroke={activePaths.includes("line8") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line8") ? "3" : "2"} className={activePaths.includes("line8") ? "flow-line" : ""} fill="none" />
            <path d="M 1240 200 L 1240 300 L 1280 300" stroke={activePaths.includes("line9") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line9") ? "3" : "2"} className={activePaths.includes("line9") ? "flow-line" : ""} fill="none" />
            
            {/* Storage and output lines */}
            <path d="M 1400 100 L 1460 100 L 1460 200 L 1480 200" stroke={activePaths.includes("line10") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line10") ? "3" : "2"} className={activePaths.includes("line10") ? "flow-line" : ""} fill="none" />
            <path d="M 1400 200 L 1480 200" stroke={activePaths.includes("line11") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line11") ? "3" : "2"} className={activePaths.includes("line11") ? "flow-line" : ""} fill="none" />
            <path d="M 1400 300 L 1460 300 L 1460 200 L 1480 200" stroke={activePaths.includes("line12") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line12") ? "3" : "2"} className={activePaths.includes("line12") ? "flow-line" : ""} fill="none" />
            
            {/* Final output */}
            <path d="M 1600 200 L 1680 200" stroke={activePaths.includes("line13") ? "#5856d6" : "#3b3b3c"} strokeWidth={activePaths.includes("line13") ? "3" : "2"} className={activePaths.includes("line13") ? "flow-line" : ""} fill="none" />
          </svg>

          {/* Absolute Layout of Nodes */}
          <div className="relative w-[1800px] h-[400px] shrink-0 z-10">

            {/* Node 1: User / Frontend */}
            <div 
              onClick={() => inspectNode("user")} 
              className={`absolute left-[20px] top-[150px] w-[110px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "user" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">User</span>
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mb-1 text-white text-base">
                {nodesDb.user.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Next.js IDE</span>
            </div>

            {/* Node 2: Fastify + Redis */}
            <div 
              onClick={() => inspectNode("gateway")} 
              className={`absolute left-[240px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "gateway" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-[#2f80ed] uppercase tracking-wider mb-1">API Gateway</span>
              <div className="w-8 h-8 rounded-lg bg-[#2f80ed]/15 flex items-center justify-center text-sm font-bold text-[#2f80ed] mb-1">
                {nodesDb.gateway.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Fastify & Redis</span>
            </div>

            {/* Node 3: Agent Orchestrator */}
            <div 
              onClick={() => inspectNode("agent")} 
              className={`absolute left-[460px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "agent" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">Orchestrator</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-sm font-bold text-purple-400 mb-1">
                {nodesDb.agent.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Blackboard Engine</span>
            </div>

            {/* Node 4: AWS Fargate Sandbox */}
            <div 
              onClick={() => inspectNode("sandbox")} 
              className={`absolute left-[680px] top-[50px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "sandbox" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Fargate VM</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-base mb-1">
                {nodesDb.sandbox.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Docker Sandbox</span>
            </div>

            {/* Node 5: Vault */}
            <div 
              onClick={() => inspectNode("vault")} 
              className={`absolute left-[680px] top-[250px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "vault" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Vault</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-base mb-1">
                {nodesDb.vault.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Secure Keys Certs</span>
            </div>

            {/* Node 6: Queue */}
            <div 
              onClick={() => inspectNode("queue")} 
              className={`absolute left-[940px] top-[150px] w-[120px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "queue" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Build Queue</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-850 flex items-center justify-center text-base mb-1">
                {nodesDb.queue.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">BullMQ Scheduler</span>
            </div>

            {/* Node 7: macOS EC2 Compiler */}
            <div 
              onClick={() => inspectNode("mac")} 
              className={`absolute left-[1160px] top-[50px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "mac" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-wider mb-1">macOS EC2</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base mb-1">
                {nodesDb.mac.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">iOS Xcode Build</span>
            </div>

            {/* Node 8: Windows VM Compiler */}
            <div 
              onClick={() => inspectNode("windows")} 
              className={`absolute left-[1160px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "windows" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Windows VM</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-base mb-1">
                {nodesDb.windows.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Windows MSVC</span>
            </div>

            {/* Node 9: Linux Android Compiler */}
            <div 
              onClick={() => inspectNode("linux")} 
              className={`absolute left-[1160px] top-[250px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "linux" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-amber-650 uppercase tracking-wider mb-1">Linux VM</span>
              <div className="w-8 h-8 rounded-lg bg-amber-600/15 flex items-center justify-center text-base mb-1">
                {nodesDb.linux.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Android Gradle SDK</span>
            </div>

            {/* Node 10: Cloudflare R2 */}
            <div 
              onClick={() => inspectNode("storage")} 
              className={`absolute left-[1380px] top-[150px] w-[140px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "storage" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-[#ff8000] uppercase tracking-wider mb-1">Storage</span>
              <div className="w-8 h-8 rounded-lg bg-[#ff8000]/15 flex items-center justify-center text-base mb-1">
                {nodesDb.storage.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Zero Egress R2</span>
            </div>

            {/* Node 11: Download Binary */}
            <div 
              onClick={() => inspectNode("output")} 
              className={`absolute left-[1580px] top-[150px] w-[120px] h-[100px] bg-[#1c1c1e] rounded-2xl flex flex-col items-center justify-center p-3 cursor-pointer border transition-all duration-300 ${
                activeNode === "output" ? "border-[#5856d6] bg-[rgba(88,86,214,0.05)] shadow-[0_0_15px_rgba(88,86,214,0.25)]" : "border-[#3b3b3c] hover:border-zinc-500"
              }`}
            >
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Publish</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-base mb-1">
                {nodesDb.output.icon}
              </div>
              <span className="text-[9px] text-zinc-500 font-mono">Store Delivery</span>
            </div>

          </div>

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
