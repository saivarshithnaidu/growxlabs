"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, 
  Terminal, 
  Settings, 
  Eye, 
  CheckCircle, 
  UploadCloud, 
  Play, 
  RotateCcw, 
  Activity, 
  ArrowRight, 
  Search,
  Code2,
  FileCheck,
  ShieldCheck
} from "lucide-react";

interface NodeDetail {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  intent_parser: {
    title: "User Intent & Spec Parser",
    category: "Phase 1: Planning & Specification",
    description: "Reads user requests, analyzes context files, fetches external docs, and drafts a comprehensive implementation plan.",
    metrics: "Parse lag: 32ms // Context: 120,000 tokens"
  },
  workspace_exec: {
    title: "Workspace File Modification Engine",
    category: "Phase 2: Active Development",
    description: "Performs native, high-integrity contiguous and multi-point edits across workspace source files.",
    metrics: "File Operations: replace_file_content // Safety: Protected"
  },
  terminal_env: {
    title: "Autonomous Terminal Shell Execution",
    category: "Phase 2: Active Development",
    description: "Spawns sandboxed PowerShell terminals to execute package installs, code builds, and environment diagnostics.",
    metrics: "Shell: powershell // Cwd: c:\\growxlabs\\grow-x"
  },
  syntax_lint: {
    title: "Static Linter & Type-Check Validation",
    category: "Phase 3: Verification & Quality",
    description: "Executes typescript compilers and syntax checkers to ensure compile-safety before merging.",
    metrics: "Check tool: tsc --noEmit // Compile errors: 0"
  },
  test_suite: {
    title: "Automated Regression Test Suite",
    category: "Phase 3: Verification & Quality",
    description: "Fires full test suites, checking router integrity, database connections, and component responsiveness.",
    metrics: "Test Framework: Jest/Vitest // Suite: 42 files PASSED"
  },
  pr_compilation: {
    title: "Production Bundle Compilation",
    category: "Phase 3: Verification & Quality",
    description: "Compiles static assets, tree-shakes redundant javascript code, and compresses distribution assets.",
    metrics: "Builder: Next.js Compiler // Output size: 242KB"
  },
  ci_cd_gate: {
    title: "CI/CD Automated Deployment Gate",
    category: "Phase 4: Deployment & Release",
    description: "Autonomously formats, commits, drafts pull requests, and merges approved codes into the main codebase trunk.",
    metrics: "Merge target: origin/main // Gateway: Github Actions"
  },
  production_live: {
    title: "Production Deployment Live & Online",
    category: "Phase 4: Deployment & Release",
    description: "Finished application updates are deployed globally onto edge server networks, serving users with zero lag.",
    metrics: "Status: ACTIVE // Edge: Vercel Global Network"
  }
};

export function InteractiveAiCodingEngine() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const simulationSteps = [
    "intent_parser",
    "workspace_exec",
    "terminal_env",
    "syntax_lint",
    "test_suite",
    "pr_compilation",
    "ci_cd_gate",
    "production_live"
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
    }, 1250);

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
    <div className="w-full bg-[#FAF9F6] border border-[#9CA3AF] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 select-none relative overflow-hidden text-[#1A1A1A]">
      
      {/* ─── Top Control Panel ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E5E2DC] gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#355CFF] animate-ping" />
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-[#355CFF] uppercase font-bold">
              Autonomous Development Engine
            </h4>
          </div>
          <p className="text-[#6B7280] text-[12px] mt-1 font-sans">
            Interactive trace model of multi-agent software engineering workflows from intent planning to direct deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="bg-[#355CFF] hover:bg-[#2A4AD4] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATE DEVELOPMENT CYCLE</span>
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
              <pattern id="coding-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,26,26,0.02)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="860" fill="url(#coding-grid)" />

            {/* Scheme Title Text */}
            <text x="50" y="45" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="bold" letterSpacing="0.05em">
              MULTI-AGENT SOFTWARE DEVELOPMENT ENGINE ARCHITECTURE
            </text>
            <text x="50" y="70" fill="#6B7280" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">
              AGENTIC SDLC CONTROL PROTOCOL V8.0
            </text>

            {/* ─── CONNECTION PATHS (SVG Lines) ─── */}
            {/* Layer 1 to Layer 2 */}
            <path
              d="M 280,240 L 280,310"
              stroke={isNodeActive("workspace_exec") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("workspace_exec") ? "2" : "1.2"}
              markerEnd={isNodeActive("workspace_exec") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 2: Workspace -> Terminal */}
            <path
              d="M 380,350 L 620,350"
              stroke={isNodeActive("terminal_env") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("terminal_env") ? "2" : "1.2"}
              markerEnd={isNodeActive("terminal_env") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 2 to Layer 3 (Terminal down to Linter) */}
            <path
              d="M 720,390 L 720,460"
              stroke={isNodeActive("syntax_lint") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("syntax_lint") ? "2" : "1.2"}
              markerEnd={isNodeActive("syntax_lint") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 3: Linter -> Test Suite */}
            <path
              d="M 620,500 L 380,500"
              stroke={isNodeActive("test_suite") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("test_suite") ? "2" : "1.2"}
              markerEnd={isNodeActive("test_suite") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 3: Test Suite -> Bundle compiler */}
            <path
              d="M 280,540 L 280,610"
              stroke={isNodeActive("pr_compilation") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("pr_compilation") ? "2" : "1.2"}
              markerEnd={isNodeActive("pr_compilation") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 3 to Layer 4 (Bundle compiler -> CD deploy) */}
            <path
              d="M 380,650 L 620,650"
              stroke={isNodeActive("ci_cd_gate") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("ci_cd_gate") ? "2" : "1.2"}
              markerEnd={isNodeActive("ci_cd_gate") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Layer 4: CD Deploy -> Production Live */}
            <path
              d="M 720,690 L 720,760"
              stroke={isNodeActive("production_live") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("production_live") ? "2" : "1.2"}
              markerEnd={isNodeActive("production_live") ? "url(#coding-arrow-blue)" : "url(#coding-arrow-gray)"}
            />

            {/* Markers Definitions for Arrows */}
            <defs>
              <marker id="coding-arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9CA3AF" />
              </marker>
              <marker id="coding-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#355CFF" />
              </marker>
            </defs>

            {/* ─── INTERACTIVE NODES ─── */}

            {/* PHASE 1: Specification */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("intent_parser")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="160" width="200" height="80" fill={isNodeActive("intent_parser") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("intent_parser") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("intent_parser") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="195" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">USER INTENT PARSER & SPEC</text>
              <text x="280" y="215" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Planning Phase 1)</text>
            </g>

            {/* PHASE 2: Execution */}
            {/* Workspace File edit */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("workspace_exec")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="310" width="200" height="80" fill={isNodeActive("workspace_exec") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("workspace_exec") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("workspace_exec") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="345" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">WORKSPACE FILE EDITOR</text>
              <text x="280" y="365" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Development Phase 2)</text>
            </g>

            {/* Sandbox Terminal */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("terminal_env")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="310" width="200" height="80" fill={isNodeActive("terminal_env") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("terminal_env") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("terminal_env") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="345" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">SANDBOXED TERMINAL CORE</text>
              <text x="720" y="365" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Development Phase 2)</text>
            </g>

            {/* PHASE 3: Validation */}
            {/* Syntax Linter */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("syntax_lint")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="460" width="200" height="80" fill={isNodeActive("syntax_lint") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("syntax_lint") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("syntax_lint") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="495" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">SYNTAX & TYPE CHECKER</text>
              <text x="720" y="515" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Verification Phase 3)</text>
            </g>

            {/* Test Suite */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("test_suite")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="460" width="200" height="80" fill={isNodeActive("test_suite") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("test_suite") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("test_suite") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="495" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">REGRESSION TEST RUNNER</text>
              <text x="280" y="515" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Verification Phase 3)</text>
            </g>

            {/* Production Compiler */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("pr_compilation")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="610" width="200" height="80" fill={isNodeActive("pr_compilation") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("pr_compilation") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("pr_compilation") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="645" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">PRODUCTION COMPILER</text>
              <text x="280" y="665" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Verification Phase 3)</text>
            </g>

            {/* PHASE 4: Deployment */}
            {/* CI/CD Gate */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("ci_cd_gate")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="610" width="200" height="80" fill={isNodeActive("ci_cd_gate") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("ci_cd_gate") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("ci_cd_gate") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="645" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">CI/CD AUTONOMOUS GATE</text>
              <text x="720" y="665" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Deployment Phase 4)</text>
            </g>

            {/* Production Live */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("production_live")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="760" width="200" height="80" fill={isNodeActive("production_live") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("production_live") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("production_live") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="795" fill="#355CFF" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="black" textAnchor="middle">DEPLOYMENT LIVE</text>
              <text x="720" y="810" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10" textAnchor="middle">(Edge Node Network)</text>
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
                <Code2 className="w-8 h-8 text-[#9CA3AF] mb-2.5 animate-pulse" />
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
              <span>ACTIVE COMPILER STATUS:</span>
              <span className="text-[#10B981] font-semibold">tsc CLEAN</span>
            </div>
            <div className="flex justify-between">
              <span>WORKSPACE MONITORING:</span>
              <span className="text-[#1A1A1A]">SAFE SYNC ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span>TEST REDUNDANCY RATIO:</span>
              <span className="text-[#355CFF] font-semibold">100.0% ASSURED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
