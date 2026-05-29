"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ArrowDown,
  PlayCircle,
  Clock,
  Shield,
  Target,
  Cpu,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   1. CLAUDE OPUS BENCHMARKS — Animated bar chart comparison
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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const maxValue = 100;

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0F0F12] rounded-2xl border border-white/[0.06] p-6 md:p-8 shadow-2xl overflow-hidden select-none"
    >
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
            <span className="text-[11px] text-[#9CA3AF] font-mono">
              Opus 4.7
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#355CFF]" />
            <span className="text-[11px] text-[#9CA3AF] font-mono">
              Opus 4.8
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Bars */}
      <div className="space-y-5">
        {benchmarks.map((bench, i) => {
          const isLegal = bench.name === "Legal Agent Benchmark";
          return (
            <motion.div
              key={bench.name}
              className={cn(
                "group relative rounded-xl p-4 transition-colors duration-200",
                hoveredIndex === i
                  ? "bg-white/[0.04]"
                  : "bg-transparent"
              )}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={
                hasAnimated
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              {/* Label Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-white text-[13px] font-medium tracking-tight">
                    {bench.name}
                  </span>
                  {bench.isBestInClass && (
                    <motion.span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                      initial={{ scale: 0 }}
                      animate={hasAnimated ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: i * 0.1 + 0.4, type: "spring" }}
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        {bench.highlight}
                      </span>
                    </motion.span>
                  )}
                </div>
                {bench.delta && (
                  <motion.div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      hasAnimated
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: i * 0.1 + 0.6, duration: 0.3 }}
                  >
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[12px] font-bold font-mono">
                      {bench.delta}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Opus 4.7 Bar */}
              {bench.opus47 !== null && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono text-[#9CA3AF] w-10 shrink-0 text-right">
                    4.7
                  </span>
                  <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-md relative"
                      initial={{ width: 0 }}
                      animate={
                        hasAnimated
                          ? { width: `${(bench.opus47 / maxValue) * 100}%` }
                          : { width: 0 }
                      }
                      transition={{
                        delay: i * 0.1 + 0.2,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold font-mono text-white drop-shadow-sm">
                        {bench.opus47}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Opus 4.8 Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#9CA3AF] w-10 shrink-0 text-right">
                  4.8
                </span>
                <div className="flex-1 h-6 bg-white/[0.04] rounded-md overflow-hidden relative">
                  <motion.div
                    className={cn(
                      "h-full rounded-md relative",
                      isLegal
                        ? "bg-gradient-to-r from-[#355CFF] via-[#6366F1] to-emerald-500"
                        : "bg-gradient-to-r from-[#355CFF] to-[#6366F1]"
                    )}
                    initial={{ width: 0 }}
                    animate={
                      hasAnimated
                        ? {
                            width: isLegal
                              ? "100%"
                              : `${(bench.opus48 / maxValue) * 100}%`,
                          }
                        : { width: 0 }
                    }
                    transition={{
                      delay: i * 0.1 + 0.35,
                      duration: 0.9,
                      ease: "easeOut",
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
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
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
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. DYNAMIC WORKFLOW VIZ — Cinematic animated workflow
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
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
  },
  {
    id: "spawn",
    label: "SPAWN",
    title: "Parallel Subagents",
    description:
      "Hundreds of parallel subagents are spawned simultaneously, each assigned a discrete chunk of the work graph. This is massively concurrent execution.",
    icon: Network,
    color: "#355CFF",
    glow: "shadow-[0_0_30px_rgba(53,92,255,0.3)]",
  },
  {
    id: "execute",
    label: "EXECUTE",
    title: "Distributed Execution",
    description:
      "Each subagent independently handles its piece — editing files, running tests, validating outputs. No bottleneck. No sequential wait.",
    icon: Zap,
    color: "#F59E0B",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    id: "verify",
    label: "VERIFY",
    title: "Automated Verification",
    description:
      "All outputs are verified against acceptance criteria. Tests pass, lint passes, type-checks pass. Nothing ships without proof.",
    icon: Shield,
    color: "#10B981",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
  },
  {
    id: "deliver",
    label: "DELIVER",
    title: "Merged Output",
    description:
      "Final merged output delivered as a cohesive, clean result. Thousands of changes, one unified delivery. Production-ready.",
    icon: Package,
    color: "#EC4899",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.3)]",
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
    }, 2000);
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
          <PlayCircle className="w-3.5 h-3.5" />
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
                  <motion.div
                    className="w-[2px] h-full origin-top"
                    style={{
                      background: isPast || isActive
                        ? `linear-gradient(180deg, ${workflowSteps[i - 1].color}, ${step.color})`
                        : "rgba(255,255,255,0.06)",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                  />
                  {/* Animated dash overlay */}
                  {(isPast || isActive) && (
                    <motion.div
                      className="absolute w-[2px] h-full"
                      style={{
                        backgroundImage: `repeating-linear-gradient(180deg, transparent, transparent 4px, ${step.color} 4px, ${step.color} 8px)`,
                        backgroundSize: "2px 12px",
                      }}
                      animate={{ backgroundPositionY: ["0px", "24px"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    />
                  )}
                  {/* Flow particles */}
                  {isActive && (
                    <motion.div
                      className="absolute w-2 h-2 rounded-full"
                      style={{ backgroundColor: step.color }}
                      animate={{ top: ["0%", "100%"], opacity: [1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeIn",
                      }}
                    />
                  )}
                </div>
              )}

              {/* Step Node */}
              <motion.div
                onClick={() => handleStepClick(i)}
                className={cn(
                  "relative flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-300 border",
                  isActive
                    ? `bg-white/[0.04] border-white/[0.08] ${step.glow}`
                    : isPast
                    ? "bg-white/[0.02] border-white/[0.04]"
                    : "bg-transparent border-transparent hover:bg-white/[0.02]"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Step Icon */}
                <div className="relative shrink-0">
                  <motion.div
                    className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center relative",
                      isActive
                        ? "bg-white/10"
                        : isPast
                        ? "bg-white/[0.06]"
                        : "bg-white/[0.03]"
                    )}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              `0 0 0px ${step.color}00`,
                              `0 0 20px ${step.color}40`,
                              `0 0 0px ${step.color}00`,
                            ],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                        : {}
                    }
                  >
                    <StepIcon
                      className="w-5 h-5 md:w-6 md:h-6"
                      style={{
                        color: isActive || isPast ? step.color : "#6B7280",
                      }}
                    />
                  </motion.div>
                  {/* Step number badge */}
                  <div
                    className={cn(
                      "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono",
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
                      className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
                      style={{
                        color: isActive || isPast ? step.color : "#6B7280",
                      }}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: step.color }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                        }}
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
                      "text-[14px] font-semibold tracking-tight mb-1",
                      isActive ? "text-white" : "text-[#9CA3AF]"
                    )}
                  >
                    {step.title}
                  </h4>
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.p
                        className="text-[12px] text-[#9CA3AF] leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Active indicator arrow */}
                {isActive && (
                  <motion.div
                    className="shrink-0 self-center"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight
                      className="w-5 h-5"
                      style={{ color: step.color }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 pt-5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          {workflowSteps.map((step, i) => (
            <motion.div
              key={step.id}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/[0.04] cursor-pointer"
              onClick={() => handleStepClick(i)}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: step.color }}
                initial={{ width: 0 }}
                animate={{
                  width:
                    i < activeStep
                      ? "100%"
                      : i === activeStep
                      ? "100%"
                      : "0%",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
            Stage {activeStep + 1} of {workflowSteps.length}
          </span>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{ color: workflowSteps[activeStep].color }}
          >
            {workflowSteps[activeStep].label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. EFFORT CONTROL DIAGRAM — Expandable effort level blocks
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
        {effortLevels.map((level, i) => {
          const isExpanded = expandedId === level.id;
          const LevelIcon = level.icon;

          return (
            <motion.div
              key={level.id}
              className={cn(
                "relative rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden",
                isExpanded
                  ? "border-white/[0.12] bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]"
              )}
              onClick={() => toggleExpand(level.id)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              layout
            >
              {/* Intensity Gradient Bar */}
              <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl overflow-hidden">
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(180deg, ${level.accentColor}, ${level.accentColor}40)`,
                  }}
                  animate={
                    isExpanded
                      ? {
                          opacity: [0.6, 1, 0.6],
                        }
                      : { opacity: 0.4 }
                  }
                  transition={
                    isExpanded
                      ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                      : {}
                  }
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
                    <motion.div
                      key={n}
                      className={cn(
                        "w-2.5 h-5 rounded-sm",
                        n <= level.intensity
                          ? "opacity-100"
                          : "bg-white/[0.04] opacity-100"
                      )}
                      style={
                        n <= level.intensity
                          ? { backgroundColor: level.accentColor }
                          : undefined
                      }
                      animate={
                        isExpanded && n <= level.intensity
                          ? {
                              opacity: [0.5, 1, 0.5],
                            }
                          : {}
                      }
                      transition={
                        isExpanded
                          ? {
                              repeat: Infinity,
                              duration: 1.5,
                              delay: n * 0.1,
                              ease: "easeInOut",
                            }
                          : {}
                      }
                    />
                  ))}
                </div>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pl-[4.25rem]">
                      <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-4">
                        {level.description}
                      </p>

                      {/* Use Cases */}
                      <div className="flex flex-wrap gap-2">
                        {level.useCases.map((useCase, j) => (
                          <motion.span
                            key={useCase}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#9CA3AF] font-mono"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: j * 0.05, duration: 0.2 }}
                          >
                            <Sparkles
                              className="w-3 h-3"
                              style={{ color: level.accentColor }}
                            />
                            {useCase}
                          </motion.span>
                        ))}
                      </div>

                      {/* Claude Code Usage */}
                      <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-[11px]">
                        <span className="text-[#6B7280]">$ </span>
                        <span className="text-[#9CA3AF]">
                          claude --effort{" "}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: level.accentColor }}
                        >
                          {level.claudeCodeId}
                        </span>
                        <span className="text-[#6B7280]">
                          {" "}
                          &quot;your prompt here&quot;
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div
        className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Layers className="w-3.5 h-3.5 text-[#6B7280]" />
        <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
          Click any level to explore details — Higher effort = deeper reasoning
        </span>
      </motion.div>
    </div>
  );
}
