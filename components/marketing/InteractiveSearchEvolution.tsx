"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Database,
  Terminal,
  Activity,
  Play,
  RotateCcw,
  Zap,
  CheckCircle,
  Network
} from "lucide-react";

interface NodeDetail {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  query: {
    title: "User Search Query",
    category: "Input Layer",
    description: "The initial semantic search string or action query submitted by the user. Traditonally parsed for keyword matching; in modern engines, parsed for execution intent.",
    metrics: "Type: Semantic Query // Length: 8.4 words average"
  },
  search_index: {
    title: "Traditional Search Index",
    category: "Retrieval Layer",
    description: "The classic neural network index and link repository. Scans matching pages, ranks them using static SEO scoring algorithms, and returns a flat directory list of URLs.",
    metrics: "Index size: 45B pages // Search time: 180ms"
  },
  synthesis: {
    title: "Synthesis Node",
    category: "AI Processing",
    description: "Aggregates raw data sources, compiles semantic definitions, reconciles contradicting information, and compiles a parsed contextual summary.",
    metrics: "Processing volume: 1.2M tokens/s // Confidence: 98.4%"
  },
  reasoning: {
    title: "Reasoning Node",
    category: "AI Processing",
    description: "Breaks down complex user intents into detailed operational tasks, plans multi-agent actions, and dynamically constructs validation checklists.",
    metrics: "Inference steps: 12-step plan // Cycle latency: 45ms"
  },
  creation: {
    title: "Creation Node",
    category: "AI Processing",
    description: "Dynamically constructs custom front-end interfaces, code blocks, tailored tables, and dedicated miniature applications to display completed work in real-time.",
    metrics: "Dynamic views compiled: 230/s // Render delay: 8.5ms"
  },
  action: {
    title: "Action Node",
    category: "AI Processing",
    description: "Performs outbound executions, makes secure API requests to connected apps, executes code scripts inside isolated sandboxes, and settles database states.",
    metrics: "Execution paths: 4 concurrent // Success rate: 99.99%"
  },
  execution_endpoint: {
    title: "Execution Endpoint Core",
    category: "Central Runtime",
    description: "The transaction endpoint where plans, aggregated data, and custom compiled views are safely reconciled and executed to finalize the user task.",
    metrics: "Endpoint route: /v2/execute // Method: RPC"
  },
  result_completion: {
    title: "Result / Task Completion",
    category: "Output Layer",
    description: "The finalized output delivered to the user. Rather than a flat list of page URLs, this is the finished settlement (e.g., flight booked, contact updated, report compiled).",
    metrics: "Resolution state: COMPLETED // Integrity: verified"
  }
};

export function InteractiveSearchEvolution() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const simulationSteps = [
    "query",
    "search_index",
    "reasoning",
    "synthesis",
    "action",
    "creation",
    "execution_endpoint",
    "result_completion"
  ];

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setTimeout(() => {
      if (activeStep < simulationSteps.length - 1) {
        setActiveStep((prev) => prev + 1);
        setHoveredNode(simulationSteps[activeStep + 1]);
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
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setActiveStep(-1);
    setHoveredNode(null);
  };

  const isNodeActive = (nodeId: string) => {
    if (isSimulating) {
      const stepIdx = simulationSteps.indexOf(nodeId);
      return stepIdx !== -1 && stepIdx <= activeStep;
    }
    return hoveredNode === nodeId;
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 select-none relative overflow-hidden">
      
      {/* ─── Top Control Panel ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E2DC] gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#355CFF] animate-ping" />
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-[#355CFF] uppercase font-bold">
              AI Evolution Simulator
            </h4>
          </div>
          <p className="text-[#6B7280] text-[12px] mt-1 font-sans">
            Transitioning search from a passive directory lookup to an active AI workflow execution framework.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="bg-[#355CFF] hover:bg-[#2A4AD4] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATE EVOLUTION</span>
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET MODEL</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* Left Column: Responsive SVG Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E5E2DC]/80 rounded-xl p-3 md:p-5 relative flex items-center justify-center">
          <svg
            viewBox="0 0 1000 680"
            className="w-full h-auto select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Blueprint Overlay */}
            <defs>
              <pattern id="evolution-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,26,26,0.015)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="680" fill="url(#evolution-grid)" />

            {/* Title Text Blocks */}
            <text x="50" y="50" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="bold" letterSpacing="0.05em">
              THE EVOLUTION: SEARCH TO AI ENGINE
            </text>
            <text x="50" y="75" fill="#6B7280" fontFamily="monospace" fontSize="10.5" letterSpacing="0.1em">
              A blueprint of the transition from finding to executing.
            </text>

            <text x="180" y="605" fill="#1A1A1A" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.15em">SEARCH</text>
            <text x="650" y="605" fill="#1A1A1A" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.15em">AI EXECUTION</text>

            <line x1="50" x2="380" y1="620" y2="620" stroke="#1A1A1A" strokeWidth="1" />
            <line x1="520" x2="930" y1="620" y2="620" stroke="#1A1A1A" strokeWidth="1" />
            
            <text x="800" y="650" fill="#6B7280" fontFamily="monospace" fontSize="8" letterSpacing="0.05em">A TECH BLOG EDITORIAL</text>

            {/* ─── CONNECTION LINES LAYER (SVG Paths) ─── */}
            {/* Query to Search Index */}
            <path
              d="M 140,280 L 190,280"
              stroke={isNodeActive("search_index") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("search_index") ? "2" : "1.5"}
            />
            {/* Transition Arrow */}
            <path
              d="M 370,280 L 460,280"
              stroke={isNodeActive("reasoning") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("reasoning") ? "2" : "1.5"}
              strokeDasharray={isNodeActive("reasoning") ? "4 4" : "none"}
            />

            {/* Reasoning (x=730, y=410) -> Endpoint */}
            <path
              d="M 730,410 L 730,370 C 730,330 680,330 680,290"
              stroke={isNodeActive("reasoning") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("reasoning") ? "2" : "1.5"}
            />
            {/* Synthesis (x=590, y=190) -> Endpoint */}
            <path
              d="M 590,190 L 590,230 C 590,250 620,250 620,270"
              stroke={isNodeActive("synthesis") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("synthesis") ? "2" : "1.5"}
            />
            {/* Creation (x=590, y=410) -> Endpoint */}
            <path
              d="M 590,410 L 590,370 C 590,350 620,350 620,290"
              stroke={isNodeActive("creation") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("creation") ? "2" : "1.5"}
            />
            {/* Action (x=730, y=190) -> Endpoint */}
            <path
              d="M 730,190 L 730,230 C 730,250 680,250 680,270"
              stroke={isNodeActive("action") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("action") ? "2" : "1.5"}
            />

            {/* Endpoint -> Result Completion */}
            <path
              d="M 710,280 L 800,280"
              stroke={isNodeActive("result_completion") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("result_completion") ? "2" : "1.5"}
              strokeDasharray={isNodeActive("result_completion") ? "3 3" : "none"}
            />


            {/* ─── LEFT COLUMN: SEARCH (Traditional Index Network) ─── */}
            
            {/* Query Block */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("query")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="50"
                y="255"
                width="90"
                height="50"
                rx="6"
                fill={isNodeActive("query") ? "rgba(53,92,255,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("query") ? "#355CFF" : "#1A1A1A"}
                strokeWidth={isNodeActive("query") ? "2" : "1"}
                className="transition-all duration-300"
              />
              <text x="73" y="286" fill="#1A1A1A" fontFamily="monospace" fontSize="12" fontWeight="black" letterSpacing="0.05em">
                QUERY
              </text>
            </g>

            {/* Neural Network Nodes */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("search_index")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Network Connections */}
              {[
                { x1: 200, y1: 280, x2: 240, y2: 200 },
                { x1: 200, y1: 280, x2: 240, y2: 360 },
                { x1: 240, y1: 200, x2: 290, y2: 150 },
                { x1: 240, y1: 200, x2: 290, y2: 280 },
                { x1: 240, y1: 360, x2: 290, y2: 280 },
                { x1: 240, y1: 360, x2: 290, y2: 410 },
                { x1: 290, y1: 150, x2: 340, y2: 210 },
                { x1: 290, y1: 280, x2: 340, y2: 210 },
                { x1: 290, y1: 280, x2: 340, y2: 350 },
                { x1: 290, y1: 410, x2: 340, y2: 350 },
                { x1: 340, y1: 210, x2: 380, y2: 280 },
                { x1: 340, y1: 350, x2: 380, y2: 280 }
              ].map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={isNodeActive("search_index") ? "#355CFF" : "#1A1A1A"}
                  strokeWidth={isNodeActive("search_index") ? "1.5" : "0.8"}
                  opacity={isNodeActive("search_index") ? "0.8" : "0.5"}
                  className="transition-all duration-300"
                />
              ))}

              {/* Network Circles */}
              {[
                { cx: 200, cy: 280 },
                { cx: 240, cy: 200 },
                { cx: 240, cy: 360 },
                { cx: 290, cy: 150 },
                { cx: 290, cy: 280 },
                { cx: 290, cy: 410 },
                { cx: 340, cy: 210 },
                { cx: 340, cy: 350 },
                { cx: 380, cy: 280 }
              ].map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="7"
                  fill={isNodeActive("search_index") ? "#355CFF" : "#1A1A1A"}
                  stroke="#FAF9F6"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
              ))}
            </g>


            {/* ─── TRANSITION FLOW ARROW ─── */}
            <g>
              <polygon
                points="420,265 455,280 420,295"
                fill={isNodeActive("reasoning") ? "#355CFF" : "#1A1A1A"}
                className="transition-colors duration-300"
              />
              <line
                x1="390"
                y1="280"
                x2="425"
                y2="280"
                stroke={isNodeActive("reasoning") ? "#355CFF" : "#1A1A1A"}
                strokeWidth="2"
                className="transition-colors duration-300"
              />
            </g>


            {/* ─── RIGHT COLUMN: AI EXECUTION FLOWCHART ─── */}
            
            {/* Synthesis Block */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("synthesis")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="525"
                y="160"
                width="110"
                height="45"
                rx="6"
                fill={isNodeActive("synthesis") ? "rgba(53,92,255,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("synthesis") ? "#355CFF" : "#9CA3AF"}
                strokeWidth={isNodeActive("synthesis") ? "2" : "1.2"}
                className="transition-all duration-300"
              />
              <text x="548" y="187" fill={isNodeActive("synthesis") ? "#355CFF" : "#4B5563"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em" className="transition-colors duration-300">
                SYNTHESIS
              </text>
            </g>

            {/* Creation Block */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("creation")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="525"
                y="375"
                width="110"
                height="45"
                rx="6"
                fill={isNodeActive("creation") ? "rgba(53,92,255,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("creation") ? "#355CFF" : "#9CA3AF"}
                strokeWidth={isNodeActive("creation") ? "2" : "1.2"}
                className="transition-all duration-300"
              />
              <text x="553" y="402" fill={isNodeActive("creation") ? "#355CFF" : "#4B5563"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em" className="transition-colors duration-300">
                CREATION
              </text>
            </g>

            {/* Action Block */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("action")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="665"
                y="160"
                width="110"
                height="45"
                rx="6"
                fill={isNodeActive("action") ? "rgba(53,92,255,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("action") ? "#355CFF" : "#9CA3AF"}
                strokeWidth={isNodeActive("action") ? "2" : "1.2"}
                className="transition-all duration-300"
              />
              <text x="702" y="187" fill={isNodeActive("action") ? "#355CFF" : "#4B5563"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em" className="transition-colors duration-300">
                ACTION
              </text>
            </g>

            {/* Reasoning Block */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("reasoning")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="665"
                y="375"
                width="110"
                height="45"
                rx="6"
                fill={isNodeActive("reasoning") ? "rgba(53,92,255,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("reasoning") ? "#355CFF" : "#9CA3AF"}
                strokeWidth={isNodeActive("reasoning") ? "2" : "1.2"}
                className="transition-all duration-300"
              />
              <text x="696" y="402" fill={isNodeActive("reasoning") ? "#355CFF" : "#4B5563"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em" className="transition-colors duration-300">
                REASONING
              </text>
            </g>

            {/* Execution Endpoint (Central Bold Card) */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("execution_endpoint")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="595"
                y="255"
                width="110"
                height="50"
                rx="6"
                fill={isNodeActive("execution_endpoint") ? "rgba(26,26,26,0.03)" : "#1A1A1A"}
                stroke="#1A1A1A"
                strokeWidth="1"
                className="transition-colors duration-300"
              />
              <text x="622" y="278" fill={isNodeActive("execution_endpoint") ? "#1A1A1A" : "#FAF9F6"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em">
                EXECUTION
              </text>
              <text x="626" y="291" fill={isNodeActive("execution_endpoint") ? "#1A1A1A" : "#FAF9F6"} fontFamily="monospace" fontSize="9" fontWeight="bold" letterSpacing="0.05em">
                ENDPOINT
              </text>
            </g>

            {/* Result / Task Completion */}
            <g
              onMouseEnter={() => !isSimulating && setHoveredNode("result_completion")}
              onMouseLeave={() => !isSimulating && setHoveredNode(null)}
              className="cursor-pointer group"
            >
              <rect
                x="800"
                y="255"
                width="115"
                height="50"
                rx="6"
                fill={isNodeActive("result_completion") ? "rgba(16,185,129,0.03)" : "#FAF9F6"}
                stroke={isNodeActive("result_completion") ? "#10B981" : "#9CA3AF"}
                strokeWidth={isNodeActive("result_completion") ? "2" : "1.2"}
                className="transition-all duration-300"
              />
              <text x="808" y="278" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="bold" letterSpacing="0.05em">
                RESULT/TASK
              </text>
              <text x="808" y="291" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="black" letterSpacing="0.05em">
                COMPLETION
              </text>
            </g>

          </svg>
        </div>

        {/* Right Column: Node Inspector & Status Display (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          
          {/* Status Inspector Box */}
          <div className="bg-white border border-[#E5E2DC] rounded-xl p-5 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
                <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#355CFF]" />
                  <span>Evolution Inspector</span>
                </span>
                <span className="font-mono text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF] animate-pulse" />
                  <span>ACTIVE</span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                {hoveredNode && nodeDetails[hoveredNode] ? (
                  <motion.div
                    key={hoveredNode}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3.5"
                  >
                    <div>
                      <span className="text-[9px] font-mono tracking-wider text-[#355CFF] bg-[#355CFF]/5 px-2 py-0.5 rounded uppercase font-bold">
                        {nodeDetails[hoveredNode].category}
                      </span>
                      <h4 className="text-xl font-black text-[#1A1A1A] mt-2 tracking-tight">
                        {nodeDetails[hoveredNode].title}
                      </h4>
                    </div>

                    <p className="text-[#4B5563] text-[13.5px] leading-relaxed font-sans font-normal font-sans">
                      {nodeDetails[hoveredNode].description}
                    </p>

                    <div className="bg-[#FAF9F6] border border-[#E5E2DC] p-3 rounded-lg font-mono text-[10px] text-[#6B7280] space-y-1">
                      <span className="text-[#1A1A1A] font-bold block mb-1">NODE SPECS:</span>
                      <span className="block">{nodeDetails[hoveredNode].metrics}</span>
                      <span className="block">Framework: Agentic Architecture</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center space-y-3"
                  >
                    <HelpCircle className="w-10 h-10 text-[#E5E2DC] mx-auto animate-pulse" />
                    <p className="text-[13px] text-[#6B7280] font-sans max-w-[200px] mx-auto">
                      Hover over any node in the search evolution diagram to inspect how artificial intelligence changes index retrievals into completed workflows.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Execution Rates Bar Chart */}
            <div className="border-t border-[#E5E2DC] pt-4 mt-6">
              <span className="font-mono text-[9px] tracking-wider text-[#6B7280] uppercase block mb-3">
                Evolution Index Rates
              </span>
              <div className="space-y-2.5">
                {[
                  { label: "Search Index Precision", val: 56, color: "bg-[#6B7280]" },
                  { label: "AI Planning Latency", val: isSimulating ? 94 : 15, color: isSimulating ? "bg-emerald-500" : "bg-[#6B7280]" },
                  { label: "Execution Success", val: isSimulating ? 99 : 85, color: "bg-[#355CFF]" }
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-[9.5px] font-mono">
                      <span className="text-[#4B5563]">{bar.label}</span>
                      <span className="font-bold text-[#1A1A1A]">{bar.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#E5E2DC] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${bar.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.val}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Status Card */}
          <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl p-4 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center">
                {isSimulating ? (
                  <Zap className="w-4 h-4 text-amber-500 animate-bounce" strokeWidth="2.5" />
                ) : (
                  <Network className="w-4 h-4 text-emerald-500 animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-mono text-[9px] text-[#6B7280] tracking-wider uppercase">Model status</p>
                <p className="text-[12px] font-bold text-[#1A1A1A] font-sans">
                  {isSimulating ? `EVOLUTION SIMULATOR ACTIVE` : "MODEL PARSED & READY"}
                </p>
              </div>
            </div>
            {isSimulating && (
              <span className="text-[8px] font-mono tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded animate-pulse">
                SIMULATING...
              </span>
            )}
          </div>

        </div>
        
      </div>
      
    </div>
  );
}
