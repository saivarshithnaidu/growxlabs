"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Zap,
  GitBranch,
  CheckCircle2,
  Package,
  Brain,
  Layers,
  Gauge,
  Rocket,
  Sparkles,
  Activity,
  Clock,
  Shield,
  Target,
  Cpu,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   1. CLAUDE OPUS BENCHMARKS — Premium Animated Bar Chart (Zero Framer Motion)
   ═══════════════════════════════════════════════════════════════════════════ */

interface BenchmarkItem {
  name: string;
  shortName: string;
  opus47: number | null;
  opus48: number;
  delta: string | null;
  highlight?: string;
  isBestInClass?: boolean;
}

const benchmarks: BenchmarkItem[] = [
  {
    name: "SWE-Bench Pro",
    shortName: "SWE-Bench",
    opus47: 64.3,
    opus48: 69.2,
    delta: "+4.9%",
  },
  {
    name: "Terminal-Bench 2.1",
    shortName: "Term-Bench",
    opus47: 65.8,
    opus48: 74.2,
    delta: "+8.4%",
  },
  {
    name: "Multidisciplinary Reasoning",
    shortName: "Multi-Reason",
    opus47: 54.7,
    opus48: 57.9,
    delta: "+3.2%",
  },
  {
    name: "Online-Mind2Web",
    shortName: "Mind2Web",
    opus47: null,
    opus48: 84.0,
    delta: null,
    highlight: "Best in class",
    isBestInClass: true,
  },
  {
    name: "Legal Agent Benchmark",
    shortName: "Legal Agent",
    opus47: null,
    opus48: 100,
    delta: null,
    highlight: "First to break 10% all-pass",
    isBestInClass: true,
  },
];

export function ClaudeOpusBenchmarks() {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = 100;

  return (
    <div className="w-full bg-[#0F0F12] rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#355CFF]/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#355CFF]" />
            </div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">
              Claude Opus 4.8 Benchmark Performance
            </h3>
          </div>
          <p className="text-[#6B7280] text-[12px] leading-relaxed ml-[42px]">
            Head-to-head comparison against Opus 4.7 across key evaluations
          </p>
        </div>
        <div className="flex items-center gap-4 ml-[42px] sm:ml-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#D97706]" />
            <span className="text-[11px] text-[#9CA3AF] font-mono">Opus 4.7</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#355CFF]" />
            <span className="text-[11px] text-[#9CA3AF] font-mono">Opus 4.8</span>
          </div>
        </div>
      </div>

      {/* Benchmark Bars */}
      <div className="space-y-5">
        {benchmarks.map((bench, i) => {
          const isLegal = bench.name === "Legal Agent Benchmark";
          return (
            <div
              key={bench.name}
              className={cn(
                "group relative rounded-xl p-4 transition-colors duration-300",
                hoveredIndex === i ? "bg-white/[0.04]" : "bg-transparent"
              )}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Label Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[13px] font-medium tracking-tight">
                    {bench.name}
                  </span>
                  {bench.isBestInClass && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {bench.highlight}
                    </span>
                  )}
                </div>
                {bench.delta && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[12px] font-bold font-mono">
                    <TrendingUp className="w-3 h-3" />
                    {bench.delta}
                  </div>
                )}
              </div>

              {/* Opus 4.7 Bar */}
              {bench.opus47 !== null && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono text-[#9CA3AF] w-10 shrink-0 text-right">
                    4.7
                  </span>
                  <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-md relative transition-[width] duration-1000 ease-out"
                      style={{ width: mounted ? `${(bench.opus47 / maxValue) * 100}%` : "0%" }}
                    >
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold font-mono text-white drop-shadow-sm">
                        {bench.opus47}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Opus 4.8 Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#9CA3AF] w-10 shrink-0 text-right">
                  4.8
                </span>
                <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden relative">
                  <div
                    className={cn(
                      "h-full rounded-md relative transition-[width] duration-1000 ease-out",
                      isLegal
                        ? "bg-gradient-to-r from-[#355CFF] via-[#6366F1] to-emerald-500"
                        : "bg-gradient-to-r from-[#355CFF] to-[#6366F1]"
                    )}
                    style={{
                      width: mounted
                        ? isLegal
                          ? "100%"
                          : `${(bench.opus48 / maxValue) * 100}%`
                        : "0%",
                    }}
                  >
                    {isLegal ? (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold font-mono text-white drop-shadow-sm flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        TOP SCORE
                      </span>
                    ) : (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold font-mono text-white drop-shadow-sm">
                        {bench.opus48}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#6B7280]">
          <Activity className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-wider">
            Source: Anthropic Official Benchmarks
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
            All improvements verified
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. DYNAMIC WORKFLOW VIZ — Cinematic Workflow (Zero Framer Motion)
   ═══════════════════════════════════════════════════════════════════════════ */

interface WorkflowStep {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "plan",
    label: "PLAN",
    title: "Strategic Planning",
    description:
      "Claude plans the full scope of work upfront — analyzing the codebase, decomposing the task, and mapping dependencies before a single line is touched.",
    icon: Brain,
    color: "#8B5CF6",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
  },
  {
    id: "spawn",
    label: "SPAWN",
    title: "Parallel Subagents",
    description:
      "Hundreds of parallel subagents are spawned simultaneously, each assigned a discrete chunk of the work graph. This is massively concurrent execution.",
    icon: Network,
    color: "#355CFF",
    glow: "shadow-[0_0_20px_rgba(53,92,255,0.15)]",
  },
  {
    id: "execute",
    label: "EXECUTE",
    title: "Distributed Execution",
    description:
      "Each subagent independently handles its piece — editing files, running tests, validating outputs. No bottleneck. No sequential wait.",
    icon: Zap,
    color: "#F59E0B",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  {
    id: "verify",
    label: "VERIFY",
    title: "Automated Verification",
    description:
      "All outputs are verified against acceptance criteria. Tests pass, lint passes, type-checks pass. Nothing ships without proof.",
    icon: Shield,
    color: "#10B981",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
  },
  {
    id: "deliver",
    label: "DELIVER",
    title: "Merged Output",
    description:
      "Final merged output delivered as a cohesive, clean result. Thousands of changes, one unified delivery. Production-ready.",
    icon: Package,
    color: "#EC4899",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]",
  },
];

export function DynamicWorkflowViz() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCycling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2500);
  }, []);

  useEffect(() => {
    if (isAutoCycling) {
      startCycling();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoCycling, startCycling]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsAutoCycling(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Resume auto-cycling after 6 seconds of inactivity
    setTimeout(() => {
      setIsAutoCycling(true);
    }, 6000);
  };

  return (
    <div className="w-full bg-[#0F0F12] rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#355CFF]/10 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-[#355CFF]" />
            </div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">
              Dynamic Workflows — Claude Code
            </h3>
          </div>
          <p className="text-[#6B7280] text-[12px] leading-relaxed ml-[42px]">
            How Claude Code orchestrates massive parallel execution pipelines
          </p>
        </div>
        <button
          onClick={() => setIsAutoCycling(!isAutoCycling)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer",
            isAutoCycling
              ? "bg-[#355CFF]/10 text-[#355CFF] border border-[#355CFF]/20"
              : "bg-white/[0.04] text-[#9CA3AF] border border-white/[0.08]"
          )}
        >
          <PlayCircleIcon className="w-3.5 h-3.5" />
          {isAutoCycling ? "Auto-Playing" : "Paused"}
        </button>
      </div>

      {/* Workflow Steps */}
      <div className="relative flex flex-col gap-0">
        {workflowSteps.map((step, i) => {
          const isActive = activeStep === i;
          const isPast = i < activeStep;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.id}>
              {/* Connection Line */}
              {i > 0 && (
                <div className="relative flex justify-center h-8 md:h-10">
                  <div
                    className="w-[2px] h-full transition-all duration-500"
                    style={{
                      background: isPast || isActive
                        ? `linear-gradient(180deg, ${workflowSteps[i - 1].color}, ${step.color})`
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              )}

              {/* Step Node */}
              <div
                onClick={() => handleStepClick(i)}
                className={cn(
                  "relative flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 border",
                  isActive
                    ? `bg-white/[0.04] border-white/[0.08] ${step.glow}`
                    : isPast
                    ? "bg-white/[0.02] border-white/[0.04]"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                )}
              >
                {/* Step Icon */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center relative transition-all duration-500",
                      isActive ? "bg-white/10" : isPast ? "bg-white/[0.06]" : "bg-white/[0.03]"
                    )}
                    style={{
                      boxShadow: isActive ? `0 0 15px ${step.color}25` : "none"
                    }}
                  >
                    <StepIcon
                      className="w-5 h-5 md:w-6 md:h-6"
                      style={{
                        color: isActive || isPast ? step.color : "#6B7280",
                      }}
                    />
                  </div>
                  {/* Step number badge */}
                  <div
                    className={cn(
                      "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono transition-all duration-300",
                      isActive || isPast
                        ? "text-white"
                        : "bg-white/[0.06] text-[#6B7280]"
                    )}
                    style={
                      isActive || isPast
                        ? { backgroundColor: step.color }
                        : undefined
                    }
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-300"
                      style={{
                        color: isActive || isPast ? step.color : "#6B7280",
                      }}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: step.color }}
                      />
                    )}
                    {isPast && (
                      <CheckCircle2
                        className="w-3.5 h-3.5"
                        style={{ color: step.color }}
                      />
                    )}
                  </div>
                  <h4
                    className={cn(
                      "text-[14px] font-semibold tracking-tight mb-1 transition-colors duration-300",
                      isActive ? "text-white" : "text-[#9CA3AF]"
                    )}
                  >
                    {step.title}
                  </h4>
                  
                  {/* Static height info container (zero layout shift) */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    isActive ? "max-h-[100px] opacity-100 mt-1" : "max-h-0 opacity-0"
                  )}>
                    <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 pt-5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          {workflowSteps.map((step, i) => (
            <div
              key={step.id}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.04] cursor-pointer"
              onClick={() => handleStepClick(i)}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor: step.color,
                  width: i <= activeStep ? "100%" : "0%"
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
            Stage {activeStep + 1} of {workflowSteps.length}
          </span>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-300"
            style={{ color: workflowSteps[activeStep].color }}
          >
            {workflowSteps[activeStep].label}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon helper for zero dependencies
function PlayCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. EFFORT CONTROL DIAGRAM — Hybrid Browser-Adaptive Console Panel
   ═══════════════════════════════════════════════════════════════════════════ */

interface EffortLevel {
  id: string;
  claudeCodeId: string;
  label: string;
  subtitle: string;
  description: string;
  useCases: string[];
  intensity: number; // 1-4
  gradient: string;
  borderColor: string;
  accentColor: string;
  icon: React.ElementType;
}

const effortLevels: EffortLevel[] = [
  {
    id: "low",
    claudeCodeId: "low",
    label: "Low",
    subtitle: "Simple queries, fast replies",
    description:
      "For straightforward tasks that need quick answers. Claude responds instantly with minimal computation, keeping latency ultra-low and costs down.",
    useCases: [
      "Quick code lookups",
      "Simple Q&A",
      "Syntax checks",
      "File reads",
    ],
    intensity: 1,
    gradient: "from-[#355CFF]/10 to-[#355CFF]/5",
    borderColor: "#355CFF",
    accentColor: "#355CFF",
    icon: Clock,
  },
  {
    id: "high",
    claudeCodeId: "high",
    label: "High",
    subtitle: "Default — general tasks",
    description:
      "The default mode for most development tasks. Claude thinks carefully, considers context, and delivers thoughtful, accurate responses across a wide range of complexity.",
    useCases: [
      "Code generation",
      "Bug fixing",
      "Refactoring",
      "Code review",
    ],
    intensity: 2,
    gradient: "from-[#355CFF]/20 to-[#355CFF]/10",
    borderColor: "#355CFF",
    accentColor: "#6366F1",
    icon: Target,
  },
  {
    id: "extra",
    claudeCodeId: "xhigh",
    label: "Extra",
    subtitle: "Difficult tasks, async workflows",
    description:
      "For challenging tasks that benefit from extended reasoning. Claude takes more time to explore solution spaces, consider edge cases, and produce higher-quality outputs.",
    useCases: [
      "Architecture design",
      "Complex debugging",
      "Multi-file refactors",
      "Test suite creation",
    ],
    intensity: 3,
    gradient: "from-[#355CFF]/35 to-[#355CFF]/15",
    borderColor: "#6366F1",
    accentColor: "#8B5CF6",
    icon: Cpu,
  },
  {
    id: "max",
    claudeCodeId: "max",
    label: "Max",
    subtitle: "Hardest tasks, maximum performance",
    description:
      "Full computational power unlocked. Claude uses maximum extended thinking, exploring all possible approaches. Reserved for the most demanding engineering challenges.",
    useCases: [
      "System design",
      "Performance optimization",
      "Security audits",
      "Cross-codebase migrations",
    ],
    intensity: 4,
    gradient: "from-[#355CFF]/50 to-[#6366F1]/25",
    borderColor: "#8B5CF6",
    accentColor: "#A78BFA",
    icon: Rocket,
  },
];

export function EffortControlDiagram() {
  const [isChrome, setIsChrome] = useState(false);
  const [activeId, setActiveId] = useState<string>("high");
  const [expandedId, setExpandedId] = useState<string | null>("high");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Detect standard Google Chrome (distinguishing from Brave, Edge, Opera, Safari, Firefox, etc.)
    const isGoogleChrome = 
      /Chrome/.test(navigator.userAgent) && 
      /Google Inc/.test(navigator.vendor) && 
      !(navigator as any).brave;
    
    setIsChrome(isGoogleChrome);
  }, []);

  const activeLevel = effortLevels.find((l) => l.id === activeId) || effortLevels[1];
  const ActiveIcon = activeLevel.icon;

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // A. CHROME DETECTED: Show ultra-stable horizontal studio control dashboard
  // ═══════════════════════════════════════════════════════════════════════════
  if (isChrome) {
    return (
      <div className="w-full bg-[#0F0F12] rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl overflow-hidden select-none animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#355CFF]/10 flex items-center justify-center">
              <Gauge className="w-4 h-4 text-[#355CFF]" />
            </div>
            <h3 className="text-white font-semibold text-[15px] tracking-tight">
              Effort Control Dashboard
            </h3>
          </div>
          <p className="text-[#6B7280] text-[12px] leading-relaxed ml-[42px]">
            Click a selector node below to calibrate Claude's computational intensity
          </p>
        </div>

        {/* 4-Segment Calibration Selector Deck */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {effortLevels.map((level) => {
            const isActive = activeId === level.id;
            const IconComponent = level.icon;
            return (
              <button
                key={level.id}
                onClick={() => setActiveId(level.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer relative overflow-hidden",
                  isActive
                    ? "border-[#355CFF]/40 bg-[#355CFF]/10"
                    : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08]"
                )}
              >
                {/* Highlight bar at top of active button */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
                    style={{ backgroundColor: level.accentColor }}
                  />
                )}

                <IconComponent
                  className="w-5 h-5 mb-2 transition-transform duration-300"
                  style={{ color: isActive ? level.accentColor : "#6B7280" }}
                />
                <span
                  className="text-[12px] font-bold tracking-tight"
                  style={{ color: isActive ? "#FFFFFF" : "#9CA3AF" }}
                >
                  {level.label}
                </span>
                <span className="text-[9px] font-mono text-[#6B7280] mt-0.5 uppercase">
                  {level.claudeCodeId}
                </span>
              </button>
            );
          })}
        </div>

        {/* Calibration Detail Panel */}
        <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.01] p-5 md:p-6 overflow-hidden">
          {/* Glow backdrop based on active level */}
          <div
            className="absolute -top-24 -left-24 w-48 h-48 rounded-full filter blur-[80px] opacity-[0.1] pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: activeLevel.accentColor }}
          />

          <div className="relative z-10">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.03]">
                  <ActiveIcon
                    className="w-5 h-5"
                    style={{ color: activeLevel.accentColor }}
                  />
                </div>
                <div>
                  <h4 className="text-white text-[14px] font-bold tracking-tight flex items-center gap-2">
                    {activeLevel.label} Level
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-[#9CA3AF]">
                      --effort={activeLevel.claudeCodeId}
                    </span>
                    {activeLevel.claudeCodeId === "high" && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#355CFF]/15 text-[#355CFF] uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </h4>
                  <p className="text-[#6B7280] text-[11px] mt-0.5 font-mono">
                    {activeLevel.subtitle}
                  </p>
                </div>
              </div>

              {/* Intensity visual display */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-[#6B7280] uppercase tracking-wider mr-2">
                  Compute Dial
                </span>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="w-2 h-4 rounded-sm transition-all duration-300"
                    style={{
                      backgroundColor: n <= activeLevel.intensity ? activeLevel.accentColor : "rgba(255,255,255,0.02)",
                      boxShadow: n <= activeLevel.intensity ? `0 0 10px ${activeLevel.accentColor}30` : "none"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-5">
              {activeLevel.description}
            </p>

            {/* Use Cases */}
            <div className="mb-5">
              <h5 className="text-white text-[10px] font-mono uppercase tracking-widest text-[#6B7280] mb-3">
                Primary Use Cases
              </h5>
              <div className="flex flex-wrap gap-2">
                {activeLevel.useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.04] text-[11px] text-[#9CA3AF] font-mono"
                  >
                    <Sparkles
                      className="w-3 h-3 text-[#6B7280]"
                      style={{ color: activeLevel.accentColor }}
                    />
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive copyable terminal command */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#070709] border border-white/[0.04] font-mono text-[11px]">
              <div className="truncate text-left pr-4">
                <span className="text-[#6B7280]">$ </span>
                <span className="text-[#9CA3AF]">claude --effort </span>
                <span className="font-bold" style={{ color: activeLevel.accentColor }}>
                  {activeLevel.claudeCodeId}
                </span>
                <span className="text-[#6B7280]"> "execute refactor"</span>
              </div>
              <button
                onClick={() => handleCopy(`claude --effort ${activeLevel.claudeCodeId} "execute refactor"`)}
                className="shrink-0 text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-white border border-white/[0.06] transition-all cursor-pointer"
              >
                {copied ? "Copied!" : "Copy CMD"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
            System calibration successful — compute is dynamically allocated safely
          </span>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // B. OTHER BROWSERS (Brave, Firefox, Safari): Show premium expandable accordion list
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full bg-[#0F0F12] rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#355CFF]/10 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-[#355CFF]" />
          </div>
          <h3 className="text-white font-semibold text-[15px] tracking-tight">
            Effort Control Levels
          </h3>
        </div>
        <p className="text-[#6B7280] text-[12px] leading-relaxed ml-[42px]">
          Dial Claude&apos;s computational intensity to match your task complexity
        </p>
      </div>

      {/* Effort Level Blocks */}
      <div className="space-y-3">
        {effortLevels.map((level) => {
          const isExpanded = expandedId === level.id;
          const LevelIcon = level.icon;

          return (
            <div
              key={level.id}
              className={cn(
                "relative rounded-xl border cursor-pointer transition-[border-color,background-color] duration-300 overflow-hidden",
                isExpanded
                  ? "border-white/[0.12] bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]"
              )}
              onClick={() => toggleExpand(level.id)}
            >
              {/* Intensity Gradient Bar */}
              <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl overflow-hidden bg-white/10">
                <div
                  className="w-full h-full opacity-60"
                  style={{
                    background: `linear-gradient(180deg, ${level.accentColor}, ${level.accentColor}40)`,
                  }}
                />
              </div>

              {/* Main Row */}
              <div className="flex items-center gap-4 p-4 pl-5">
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isExpanded ? "bg-white/10" : "bg-white/[0.04]"
                  )}
                >
                  <LevelIcon
                    className="w-5 h-5"
                    style={{ color: level.accentColor }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-[14px] font-semibold tracking-tight"
                      style={{
                        color: isExpanded ? level.accentColor : "#E5E7EB",
                      }}
                    >
                      {level.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-[#9CA3AF]">
                      {level.claudeCodeId}
                    </span>
                    {level.claudeCodeId === "high" && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#355CFF]/10 text-[#355CFF] uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6B7280] mt-0.5 truncate">
                    {level.subtitle}
                  </p>
                </div>

                {/* Intensity Meter */}
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="w-2.5 h-5 rounded-sm transition-all duration-350"
                      style={{
                        backgroundColor: n <= level.intensity ? level.accentColor : "rgba(255,255,255,0.02)"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Expanded Content (Stable pure-CSS transition) */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out pl-[4.25rem] pr-5",
                isExpanded ? "max-h-[350px] pb-5 opacity-100" : "max-h-0 opacity-0"
              )}>
                <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-4">
                  {level.description}
                </p>

                {/* Use Cases */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {level.useCases.map((useCase) => (
                    <span
                      key={useCase}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#9CA3AF] font-mono"
                    >
                      <Sparkles
                        className="w-3 h-3"
                        style={{ color: level.accentColor }}
                      />
                      {useCase}
                    </span>
                  ))}
                </div>

                {/* Copyable terminal command inside accordion */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#070709] border border-white/[0.04] font-mono text-[10px]">
                  <div className="truncate text-left pr-4">
                    <span className="text-[#6B7280]">$ </span>
                    <span className="text-[#9CA3AF]">claude --effort </span>
                    <span className="font-bold" style={{ color: level.accentColor }}>
                      {level.claudeCodeId}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`claude --effort ${level.claudeCodeId}`)}
                    className="shrink-0 font-bold px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-white border border-white/[0.06] transition-all cursor-pointer"
                  >
                    {copied && expandedId === level.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-[#6B7280]" />
        <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
          Click any level to explore details — Higher effort = deeper reasoning
        </span>
      </div>
    </div>
  );
}
