"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Brain, 
  ShieldAlert, 
  Terminal, 
  Zap, 
  CheckSquare, 
  Network, 
  Coins, 
  Play,
  RotateCcw,
  Activity,
  ArrowRight,
  Layers,
  Code
} from "lucide-react";

interface NodeDetail {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  query_input: {
    title: "Enterprise Context Inbound",
    category: "Intake Layer",
    description: "An enterprise system dispatches a massive reasoning request containing dense operational code context.",
    metrics: "Token Payload: 85,000 tokens // Method: REST POST"
  },
  anth_cache: {
    title: "Claude Constitutional Prompt Caching",
    category: "Anthropic Claude Pipeline",
    description: "System matches static system instructions against prompt cache memory. Eliminates 90% of processing costs.",
    metrics: "Cache status: HIT (99.8%) // Speedup: 2.4x faster"
  },
  anth_align: {
    title: "Constitutional Safety Alignment Fabric",
    category: "Anthropic Claude Pipeline",
    description: "Natively integrates Constitutional AI self-correction rules directly into model weights to ensure compliance.",
    metrics: "Hallucination Rate: <0.2% // Behavior: Highly predictable"
  },
  anth_exec: {
    title: "Computer Use & Coding Agent Core",
    category: "Anthropic Claude Pipeline",
    description: "Executes raw terminal commands, reads/writes files, and interacts with virtual GUI interfaces autonomously.",
    metrics: "SWE-bench score: 49.2% // Autonomous tasks: Enabled"
  },
  anth_output: {
    title: "High-Determinism JSON Settlement",
    category: "Anthropic Claude Pipeline",
    description: "Returns structurally validated JSON outputs with zero markup leakage, directly consumable by external API engines.",
    metrics: "Price: $3.00/1M tokens (Cache Hit) // SLA success: 100%"
  },
  openai_retrieval: {
    title: "Standard RAG Context Parsing",
    category: "OpenAI GPT Pipeline",
    description: "Runs standard vector database lookups to load context dynamically. Charged at full standard input token pricing.",
    metrics: "Cache status: MISS (0.0%) // Speedup: Baseline 1.0x"
  },
  openai_safety: {
    title: "Post-RLHF Policy & Moderation Filter",
    category: "OpenAI GPT Pipeline",
    description: "Leverages secondary safety wrappers and human feedback preference networks to parse final completions.",
    metrics: "Hallucination Rate: ~1.4% // Behavior: Broad policy safety"
  },
  openai_assistants: {
    title: "Assistants Tools API Sandbox",
    category: "OpenAI GPT Pipeline",
    description: "Fires prepackaged assistants capabilities, including sandboxed Python runtimes and vector file indexes.",
    metrics: "SWE-bench score: 38.5% // Runtime environment: Standard"
  },
  openai_output: {
    title: "Enforced Schema Output Reconciliation",
    category: "OpenAI GPT Pipeline",
    description: "Uses external json-schema compilers to enforce structural validity. Modest formatting failure tolerance.",
    metrics: "Price: $10.00/1M tokens // Schema compliance: Verified"
  },
  level_1: {
    title: "Context Caching vs RAG Scan",
    category: "Comparison Stage 1: Context Layer",
    description: "Claude prompt caching matches system guidelines instantly in cached memory (99.8% hits) to speed up response times. GPT runs standard vector searches for every request.",
    metrics: "Claude speedup: 2.4x // GPT speedup: 1.0x baseline"
  },
  level_2: {
    title: "Constitutional Safety vs External Moderation",
    category: "Comparison Stage 2: Safety Layer",
    description: "Claude enforces legal-style safety constraints directly in model weights. GPT relies on external post-RLHF moderation wrappers to check model completions.",
    metrics: "Claude Hallucinations: <0.2% // GPT Hallucinations: ~1.4%"
  },
  level_3: {
    title: "Computer Use vs Assistants Tooling",
    category: "Comparison Stage 3: Agentic Layer",
    description: "Claude enables native computer-use browser actions to write code and edit workspace files directly. GPT uses standard assistants api sandboxes.",
    metrics: "Claude SWE-bench: 49.2% // GPT SWE-bench: 38.5%"
  },
  level_4: {
    title: "deterministic Output & Enterprise Pricing",
    category: "Comparison Stage 4: Output Layer",
    description: "Claude returns validated structured outputs at $3.00/1M tokens (cache hit). GPT compiles output schemas at $10.00/1M tokens.",
    metrics: "Claude input cost: $3.00/1M // GPT input cost: $10.00/1M"
  }
};

export function InteractiveModelComparison() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [anthSaving, setAnthSaving] = useState<number>(0);
  const [gptSaving, setGptSaving] = useState<number>(0);

  const simulationSteps = [
    "query_input",
    "level_1", // Context Processors
    "level_2", // Safety Fabric
    "level_3", // Agent Capabilities
    "level_4"  // Output Settlement
  ];

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setTimeout(() => {
      if (activeStep < simulationSteps.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        setHoveredNode(simulationSteps[nextStep]);
        
        // Dynamically compute token cost tracking metrics
        if (nextStep >= 1) {
          setAnthSaving(75); // $75 savings on prompt caching
          setGptSaving(0);
        }
      } else {
        setIsSimulating(false);
        setActiveStep(-1);
        setHoveredNode(null);
      }
    }, 1400);

    return () => clearTimeout(interval);
  }, [isSimulating, activeStep]);

  const startSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    setHoveredNode(simulationSteps[0]);
    setAnthSaving(0);
    setGptSaving(0);
  };


  const stopSimulation = () => {
    setIsSimulating(false);
    setActiveStep(-1);
    setHoveredNode(null);
    setAnthSaving(0);
    setGptSaving(0);
  };

  const isLevelActive = (levelName: string) => {
    if (isSimulating) {
      const idx = simulationSteps.indexOf(levelName);
      return idx !== -1 && idx <= activeStep;
    }
    return false;
  };

  const isNodeActive = (nodeId: string) => {
    if (isSimulating) {
      if (nodeId === "query_input" && activeStep >= 0) return true;
      if ((nodeId === "anth_cache" || nodeId === "openai_retrieval") && activeStep >= 1) return true;
      if ((nodeId === "anth_align" || nodeId === "openai_safety") && activeStep >= 2) return true;
      if ((nodeId === "anth_exec" || nodeId === "openai_assistants") && activeStep >= 3) return true;
      if ((nodeId === "anth_output" || nodeId === "openai_output") && activeStep >= 4) return true;
    }
    return hoveredNode === nodeId;
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#9CA3AF] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 select-none relative overflow-hidden text-[#1A1A1A]">
      
      {/* ─── Top Control Panel ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E2DC] gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#355CFF] animate-ping" />
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-[#355CFF] uppercase font-bold">
              AI Infrastructure Engine Simulator
            </h4>
          </div>
          <p className="text-[#6B7280] text-[12px] mt-1 font-sans">
            Interactive side-by-side execution trace contrasting Anthropic Claude and OpenAI GPT enterprise pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="bg-[#355CFF] hover:bg-[#2A4AD4] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATE PIPELINE EXECUTION</span>
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET BLUEPRINT</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* Left Column: Responsive SVG Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#9CA3AF]/40 rounded-xl p-3 md:p-5 relative flex items-center justify-center">
          <svg
            viewBox="0 0 1000 860"
            className="w-full h-auto select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Blueprint Overlay */}
            <defs>
              <pattern id="model-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,26,26,0.02)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="860" fill="url(#model-grid)" />

            {/* Scheme Title Text */}
            <text x="50" y="45" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="bold" letterSpacing="0.05em">
              ENTERPRISE AI PIPELINE & ALIGNMENT ARCHITECTURES
            </text>
            <text x="50" y="70" fill="#6B7280" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">
              MODEL INFERENCE PATHWAYS COMPARISON CORE V1.5
            </text>

            <text x="180" y="130" fill="#D97706" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.15em">ANTHROPIC CLAUDE SYSTEM</text>
            <text x="650" y="130" fill="#355CFF" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.15em">OPENAI GPT-4 INFRASTRUCTURE</text>

            <line x1="50" y1="140" x2="430" y2="140" stroke="#D97706" strokeWidth="1.5" />
            <line x1="570" y1="140" x2="950" y2="140" stroke="#355CFF" strokeWidth="1.5" />

            {/* ─── CONNECTION PATHS (SVG Lines) ─── */}
            {/* Input (x=500, y=180) -> Claude Cache Left */}
            <path
              d="M 450,210 C 280,210 280,260 280,280"
              stroke={isLevelActive("level_1") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_1") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_1") ? "url(#model-arrow-blue)" : "url(#model-arrow-gray)"}
            />

            {/* Input (x=500, y=180) -> GPT Retrieval Right */}
            <path
              d="M 550,210 C 720,210 720,260 720,280"
              stroke={isLevelActive("level_1") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_1") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_1") ? "url(#model-arrow-blue)" : "url(#model-arrow-gray)"}
            />

            {/* Claude Path Connectors */}
            <path
              d="M 280,360 L 280,410"
              stroke={isLevelActive("level_2") ? "#D97706" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_2") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_2") ? "url(#model-arrow-orange)" : "url(#model-arrow-gray)"}
            />
            <path
              d="M 280,490 L 280,540"
              stroke={isLevelActive("level_3") ? "#D97706" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_3") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_3") ? "url(#model-arrow-orange)" : "url(#model-arrow-gray)"}
            />
            <path
              d="M 280,620 L 280,670"
              stroke={isLevelActive("level_4") ? "#D97706" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_4") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_4") ? "url(#model-arrow-orange)" : "url(#model-arrow-gray)"}
            />

            {/* GPT Path Connectors */}
            <path
              d="M 720,360 L 720,410"
              stroke={isLevelActive("level_2") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_2") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_2") ? "url(#model-arrow-blue)" : "url(#model-arrow-gray)"}
            />
            <path
              d="M 720,490 L 720,540"
              stroke={isLevelActive("level_3") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_3") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_3") ? "url(#model-arrow-blue)" : "url(#model-arrow-gray)"}
            />
            <path
              d="M 720,620 L 720,670"
              stroke={isLevelActive("level_4") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_4") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_4") ? "url(#model-arrow-blue)" : "url(#model-arrow-gray)"}
            />

            {/* Markers Definitions for Arrows */}
            <defs>
              <marker id="model-arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9CA3AF" />
              </marker>
              <marker id="model-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#355CFF" />
              </marker>
              <marker id="model-arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#D97706" />
              </marker>
            </defs>

            {/* ─── INTERACTIVE NODES ─── */}

            {/* Master Intake Node */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("query_input")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="420" y="175" width="160" height="70" fill={isNodeActive("query_input") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("query_input") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("query_input") ? "1.8" : "1.2"} rx="8" />
              <text x="500" y="205" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">CONTEXT INTAKE LAYER</text>
              <text x="500" y="225" fill="#6B7280" fontFamily="monospace" fontSize="8" textAnchor="middle">(85K Token Workload)</text>
            </g>

            {/* ANTHROPIC CLAUDE SYSTEM PATH */}
            {/* Claude Prompt Caching */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("anth_cache")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="280" width="200" height="80" fill={isNodeActive("anth_cache") ? "#FEF3C7" : "#FFFFFF"} stroke={isNodeActive("anth_cache") ? "#D97706" : "#9CA3AF"} strokeWidth={isNodeActive("anth_cache") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="310" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">CONSTITUTIONAL CACHING</text>
              <text x="280" y="328" fill="#D97706" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">PROMPT CACHE HIT (99.8%)</text>
              <text x="280" y="343" fill="#6B7280" fontFamily="monospace" fontSize="7.5" textAnchor="middle">Cuts latency in half</text>
            </g>

            {/* Constitutional AI Safety */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("anth_align")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="410" width="200" height="80" fill={isNodeActive("anth_align") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("anth_align") ? "#D97706" : "#9CA3AF"} strokeWidth={isNodeActive("anth_align") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="445" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">CONSTITUTIONAL AI ALIGN</text>
              <text x="280" y="465" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Self-correction weights)</text>
            </g>

            {/* Claude Computer use */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("anth_exec")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="540" width="200" height="80" fill={isNodeActive("anth_exec") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("anth_exec") ? "#D97706" : "#9CA3AF"} strokeWidth={isNodeActive("anth_exec") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="575" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">COMPUTER USE & AGENTS CORE</text>
              <text x="280" y="595" fill="#D97706" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">SWE-BENCH SCORE: 49.2%</text>
            </g>

            {/* Claude Payout JSON */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("anth_output")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="670" width="200" height="80" fill={isNodeActive("anth_output") ? "#FEF3C7" : "#FFFFFF"} stroke={isNodeActive("anth_output") ? "#D97706" : "#9CA3AF"} strokeWidth={isNodeActive("anth_output") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="700" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">DETERMINISTIC JSON OUTPUT</text>
              <text x="280" y="725" fill="#D97706" fontFamily="monospace" fontSize="11" fontWeight="black" textAnchor="middle">
                $3.00 / 1M TOKENS
              </text>
              {isSimulating && activeStep >= 1 && (
                <text x="280" y="743" fill="#10B981" fontFamily="monospace" fontSize="9.5" fontWeight="bold" textAnchor="middle">-$75.00 SAVED</text>
              )}
            </g>

            {/* OPENAI GPT INFRASTRUCTURE PATH */}
            {/* GPT Context retrieval */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("openai_retrieval")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="280" width="200" height="80" fill={isNodeActive("openai_retrieval") ? "#EFF6FF" : "#FFFFFF"} stroke={isNodeActive("openai_retrieval") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("openai_retrieval") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="310" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">STANDARD RAG SEARCH</text>
              <text x="720" y="328" fill="#EF4444" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle">CACHE MISS (0.0% SAVING)</text>
              <text x="720" y="343" fill="#6B7280" fontFamily="monospace" fontSize="7.5" textAnchor="middle">Charged at baseline standard rates</text>
            </g>

            {/* Post RLHF Policy */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("openai_safety")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="410" width="200" height="80" fill={isNodeActive("openai_safety") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("openai_safety") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("openai_safety") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="445" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">POST-RLHF POLICY WRAPPERS</text>
              <text x="720" y="465" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Human alignment preferences)</text>
            </g>

            {/* GPT Assistants Sandbox */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("openai_assistants")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="540" width="200" height="80" fill={isNodeActive("openai_assistants") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("openai_assistants") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("openai_assistants") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="575" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">ASSISTANTS TOOL SANDBOX</text>
              <text x="720" y="595" fill="#355CFF" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">SWE-BENCH SCORE: 38.5%</text>
            </g>

            {/* GPT Schema Enforced Output */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("openai_output")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="670" width="200" height="80" fill={isNodeActive("openai_output") ? "#EFF6FF" : "#FFFFFF"} stroke={isNodeActive("openai_output") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("openai_output") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="700" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">SCHEMA ENFORCED OUTPUT</text>
              <text x="720" y="725" fill="#355CFF" fontFamily="monospace" fontSize="11" fontWeight="black" textAnchor="middle">
                $10.00 / 1M TOKENS
              </text>
              {isSimulating && activeStep >= 1 && (
                <text x="720" y="743" fill="#EF4444" fontFamily="monospace" fontSize="9.5" fontWeight="bold" textAnchor="middle">+$0.00 SAVED (FULL TOLL)</text>
              )}
            </g>

          </svg>
        </div>

        {/* Right Column: Telemetry Inspector Console (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-[#9CA3AF]/40 rounded-xl p-5 shadow-sm text-left">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#355CFF]" />
                <h5 className="font-mono text-[11px] tracking-[0.1em] text-[#1A1A1A] uppercase font-bold">
                  TELEMETRY PANEL
                </h5>
              </div>
              <span className="font-mono text-[9px] text-[#6B7280] uppercase bg-[#E5E2DC]/50 px-2 py-0.5 rounded">
                {isSimulating ? "LIVE RUN" : "INSPECT MODE"}
              </span>
            </div>

            {/* Information Inspector */}
            {hoveredNode && nodeDetails[hoveredNode] ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-[#355CFF] uppercase tracking-wider block mb-1">
                    {nodeDetails[hoveredNode].category}
                  </span>
                  <h6 className="text-[16px] font-black tracking-tight text-[#1A1A1A] leading-tight">
                    {nodeDetails[hoveredNode].title}
                  </h6>
                </div>

                <p className="text-[13px] text-[#4B5563] leading-relaxed">
                  {nodeDetails[hoveredNode].description}
                </p>

                <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-md p-3.5 font-mono text-[11px] text-[#374151] space-y-1 relative">
                  <div className="absolute top-2 right-2 text-[#355CFF]/30"><Terminal className="w-3.5 h-3.5" /></div>
                  <span className="text-[#6B7280] block uppercase text-[9px] tracking-wider mb-1.5">SYSTEM DIAGNOSTICS:</span>
                  <div className="truncate">{nodeDetails[hoveredNode].metrics}</div>
                  <div>Trace State: <span className="text-[#355CFF] font-bold">ACTIVE</span></div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-[#E5E2DC] rounded-xl p-6">
                <Cpu className="w-8 h-8 text-[#9CA3AF] mb-2.5 animate-pulse" />
                <p className="font-mono text-[10px] tracking-wide text-[#6B7280] uppercase">
                  AWAITING NODE PROBE
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">
                  Hover over blueprint modules or trigger a trace simulation run above.
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-[#E5E2DC] mt-6 font-mono text-[9.5px] text-[#6B7280] space-y-1">
            <div className="flex justify-between">
              <span>PROMPT CACHING IMPACT:</span>
              <span className="text-[#10B981] font-semibold">-90.0% COST DISPATCH</span>
            </div>
            <div className="flex justify-between">
              <span>AGENT BENCHMARK:</span>
              <span className="text-[#D97706] font-semibold">CLAUDE +10.7% LEAD</span>
            </div>
            <div className="flex justify-between">
              <span>DETERMINISM INDEX:</span>
              <span className="text-[#10B981] font-semibold">MAXIMUM VALIDATION</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
