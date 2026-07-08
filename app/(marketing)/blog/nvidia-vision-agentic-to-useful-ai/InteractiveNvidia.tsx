"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Bot, Cpu, Zap, Activity, CheckCircle2, 
  Terminal, Sparkles, Database, Workflow, Play, RefreshCw,
  Factory, Cog, Eye, Hand, Brain, TrendingUp, Users, 
  Code, Shield, GitBranch, Layers, Target, ArrowRight,
  BarChart3, Gauge, Network, Lock, FileCode, Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════
// 1. 3D REACTOR CELL (R3F Scene)
// ═══════════════════════════════════════════════════

function NodeCluster({ dataRate }: { dataRate: number }) {
  const groupRef = useRef<any>(null);
  const particlesRef = useRef<any[]>([]);
  const particleCount = 40;

  // Set up random initial positions for particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
      z: (Math.random() - 0.5) * 6,
      speed: 0.01 + Math.random() * 0.02,
      axis: Math.random() > 0.5 ? "y" : "x",
      direction: Math.random() > 0.5 ? 1 : -1
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire cluster
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core GPU */}
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial 
          color="#C0F0FB" 
          emissive="#2A4AD4"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Satellite Servers */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const angle = (idx / 6) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={idx} position={[x, 0, z]}>
            <mesh>
              <boxGeometry args={[0.6, 0.9, 0.3]} />
              <meshStandardMaterial 
                color="#10B981" 
                emissive="#059669"
                emissiveIntensity={0.5} 
                roughness={0.1}
              />
            </mesh>
            {/* Glowing antenna lines */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
          </group>
        );
      })}

      {/* Floating Particle Flow */}
      {particlesRef.current.map((p, idx) => {
        return (
          <Particle 
            key={idx} 
            initialData={p} 
            dataRate={dataRate} 
          />
        );
      })}
    </group>
  );
}

function Particle({ initialData, dataRate }: { initialData: any; dataRate: number }) {
  const meshRef = useRef<any>(null);
  const currentPos = useRef({ ...initialData });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Adjust speed based on dataRate factor
    const speedMultiplier = dataRate;
    
    // Move along designated axis
    if (currentPos.current.axis === "y") {
      currentPos.current.y += currentPos.current.speed * currentPos.current.direction * speedMultiplier;
      if (Math.abs(currentPos.current.y) > 3.5) {
        currentPos.current.y = -3.5 * currentPos.current.direction;
      }
    } else {
      currentPos.current.x += currentPos.current.speed * currentPos.current.direction * speedMultiplier;
      if (Math.abs(currentPos.current.x) > 3.5) {
        currentPos.current.x = -3.5 * currentPos.current.direction;
      }
    }

    meshRef.current.position.set(
      currentPos.current.x,
      currentPos.current.y,
      currentPos.current.z
    );
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#C0F0FB" toneMapped={false} />
    </mesh>
  );
}

// Fallback skeleton view during hydration
function FallbackVisual() {
  return (
    <div className="w-full h-full bg-[#0F0F12] flex items-center justify-center rounded-xl border border-white/5">
      <div className="text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto opacity-40" />
        <p className="text-xs text-[#9CA3AF] font-mono uppercase tracking-wider">Loading compute cell...</p>
      </div>
    </div>
  );
}

export function AIFactoryVisualizerClient() {
  const [mounted, setMounted] = useState(false);
  const [dataRate, setDataRate] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBoost = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setDataRate(4);
    setTimeout(() => {
      setDataRate(1);
      setIsProcessing(false);
    }, 2000);
  };

  if (!mounted) return <FallbackVisual />;

  return (
    <div className="relative w-full h-[380px] bg-[#0F0F12] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col my-10 group">
      {/* 3D Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        <Canvas camera={{ position: [0, 4, 7], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <NodeCluster dataRate={dataRate} />
        </Canvas>

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0F0F12] via-transparent to-[#0F0F12]/10" />

        {/* Status Indicators overlay */}
        <div className="absolute top-4 left-4 font-mono text-[10px] space-y-2 uppercase text-white tracking-widest bg-black/40 border border-white/10 px-3 py-2.5 rounded-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-[#C0F0FB] animate-ping" : "bg-[#10B981]")} />
            <span>Core: Active</span>
          </div>
          <div>Data Flow: {dataRate === 1 ? "1.2 GB/s" : "4.8 GB/s (BOOST)"}</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="border-t border-white/5 bg-[#14141A] p-4 flex items-center justify-between z-10">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Factory Core simulator</h4>
          <p className="text-[10px] text-[#888899]">Click boost to simulate accelerated computation.</p>
        </div>
        <button
          onClick={handleBoost}
          disabled={isProcessing}
          className={cn(
            "h-9 px-5 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-1.5 transition-all cursor-pointer",
            isProcessing 
              ? "bg-[#C0F0FB]/20 text-primary border border-primary/30 cursor-not-allowed" 
              : "bg-[#C0F0FB] hover:bg-[#2A4AD4] text-white"
          )}
        >
          <Play size={12} className={cn(isProcessing && "animate-pulse")} />
          {isProcessing ? "Boosting..." : "Boost GPU"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 2. 2D PIPELINE EVOLUTION
// ═══════════════════════════════════════════════════

export function AIPipelineEvolution() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Generative AI (Reactive)",
      subtitle: "The Text-Generation Wave",
      icon: Sparkles,
      color: "border-[#D1D5DB] text-[#9CA3AF]",
      glow: "shadow-[0_0_15px_rgba(107,114,128,0.15)]",
      desc: "First wave (2022-2024) optimized for passive content creation. Responds only when prompted and forgets context immediately.",
      workflow: ["User Input", "LLM Inference", "Output Generated", "Session Terminated"],
      metrics: { autonomy: "0%", execution: "None", impact: "Friction Reducer" }
    },
    {
      title: "Agentic AI (Reasoning Loop)",
      subtitle: "The Action-Centric Wave",
      icon: Workflow,
      color: "border-primary text-primary",
      glow: "shadow-[0_0_15px_rgba(53,92,255,0.2)]",
      desc: "Second wave (2025-2026) optimized for loops. Formulates a multi-step plan, utilizes tools, reviews output, and corrects errors.",
      workflow: ["Goal Set", "Task Planning", "Tool Call (API/SQL)", "Verify Output", "Repeat Loop"],
      metrics: { autonomy: "65%", execution: "Intermediate", impact: "Process Automation" }
    },
    {
      title: "Useful AI (Outcomes)",
      subtitle: "The Infrastructure Wave",
      icon: Bot,
      color: "border-[#10B981] text-[#10B981]",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
      desc: "Ultimate destination. Background agent fleets working asynchronously, integrated natively into corporate databases, driving revenue.",
      workflow: ["Biz Objective", "Autonomous Orchestration", "Dynamic Optimization", "Deliver Outcomes"],
      metrics: { autonomy: "95%", execution: "Full Asynchronous", impact: "Bottom-line Expansion" }
    }
  ];

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 md:p-8 my-10 shadow-sm animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-primary/5 px-2.5 py-1 rounded">
          Evolutionary Blueprint
        </span>
        <h4 className="text-xl font-black text-foreground mt-3 tracking-tight">The Journey from Generation to Utility</h4>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-md mx-auto">
          Click on any phase below to examine the internal loop architecture, metrics, and business impact.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/10 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={cn(
                "py-3 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 cursor-pointer text-center",
                isActive 
                  ? idx === 2 
                    ? "bg-[#10B981] text-white shadow-sm"
                    : idx === 1
                    ? "bg-[#C0F0FB] text-white shadow-sm"
                    : "bg-white/10 text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-foreground"
              )}
            >
              <Icon size={12} className={cn(!isActive && "opacity-75")} />
              <span>Phase 0{idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Stepper Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6">
            {/* Left: Description & Workflow */}
            <div className="space-y-4">
              <div>
                <h5 className="font-black text-lg text-foreground">{steps[activeStep].title}</h5>
                <p className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider mt-0.5">{steps[activeStep].subtitle}</p>
              </div>
              <p className="text-[14px] leading-relaxed text-[#A1A1AA]">{steps[activeStep].desc}</p>
              
              {/* Animated Workflow Visualizer */}
              <div className="space-y-2 pt-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#9CA3AF]">System Pipeline:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {steps[activeStep].workflow.map((node, nodeIdx) => (
                    <React.Fragment key={nodeIdx}>
                      <span className="text-[11px] font-mono bg-[#EDEAE4] border border-border px-2.5 py-1 rounded text-foreground">
                        {node}
                      </span>
                      {nodeIdx < steps[activeStep].workflow.length - 1 && (
                        <span className="text-xs text-[#9CA3AF]">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Metrics Table */}
            <div className="bg-white/[0.02] border border-border rounded-lg p-5 flex flex-col justify-center space-y-4">
              <h6 className="font-mono text-[9px] uppercase tracking-wider text-[#9CA3AF] border-b border-border pb-2">
                Performance Indicators
              </h6>
              {Object.entries(steps[activeStep].metrics).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-xs font-mono">
                  <span className="capitalize text-[#9CA3AF]">{key}:</span>
                  <span className="font-bold text-foreground">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 3. CUDA-X SKILLS EXPLORER
// ═══════════════════════════════════════════════════

export function CudaXSkillsExplorer() {
  const [selectedSkill, setSelectedSkill] = useState("cuDNN");

  const skills = {
    cuDNN: {
      name: "cuDNN / TensorRT",
      useCase: "Inference Acceleration",
      description: "Speeds up basic deep learning neural network processes, translating models into real-time executable software.",
      agentImpact: "Reduces LLM latency to sub-second, allowing agents to respond, plan, and verify routes in real-time."
    },
    Isaac: {
      name: "Isaac / Omniverse",
      useCase: "Robotics & Physical AI",
      description: "Simulates physical environments with high accuracy so machines can learn to move and operate.",
      agentImpact: "Enables robots to run millions of reinforcement learning simulations, mastering real-world manipulation."
    },
    cuDF: {
      name: "cuDF",
      useCase: "Data Science Acceleration",
      description: "Accelerates tabular database operations directly on GPUs, bypassing slow CPU compute pipelines.",
      agentImpact: "Allows data agents to sort, filter, and extract insights from millions of CRM rows in milliseconds."
    },
    Modulus: {
      name: "Modulus",
      useCase: "Physics-ML Simulation",
      description: "Builds physics-informed machine learning models that simulate thermodynamics and fluid mechanics.",
      agentImpact: "Enables research agents to run highly complex physical simulations, discovering designs without manual code."
    }
  };

  return (
    <div className="w-full bg-[#14141A] border border-white/5 rounded-xl p-6 md:p-8 my-10 text-white shadow-2xl animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C0F0FB]/3 rounded-full blur-[80px]" />
      
      <div className="text-center mb-8 relative z-10">
        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
          Software Interface Layer
        </span>
        <h4 className="text-xl font-black mt-3 tracking-tight">CUDA-X Agent Integration Hub</h4>
        <p className="text-xs text-[#888899] mt-1 max-w-md mx-auto">
          Select a library below to see how it acts as an specialized GPU skill for autonomous agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 relative z-10">
        {Object.keys(skills).map((key) => {
          const isActive = key === selectedSkill;
          return (
            <button
              key={key}
              onClick={() => setSelectedSkill(key)}
              className={cn(
                "h-12 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center cursor-pointer",
                isActive 
                  ? "bg-[#C0F0FB] border-primary text-white shadow-md shadow-[#C0F0FB]/20" 
                  : "bg-white/5 border-white/10 text-[#888899] hover:border-white/20 hover:text-white"
              )}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Details Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSkill}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 space-y-4"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h5 className="font-bold text-white text-base">
              {skills[selectedSkill as keyof typeof skills].name}
            </h5>
            <span className="text-[10px] font-mono text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              {skills[selectedSkill as keyof typeof skills].useCase}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#888899]">Core Capability:</p>
              <p className="text-sm text-[#D1D5DB] mt-1 leading-relaxed">
                {skills[selectedSkill as keyof typeof skills].description}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#888899]">Impact on Autonomous Agents:</p>
              <p className="text-sm text-[#D1D5DB] mt-1 leading-relaxed">
                {skills[selectedSkill as keyof typeof skills].agentImpact}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 4. MODEL VS INFRASTRUCTURE — Animated Value Comparison
//    (For "Why This Matters More Than a New AI Model")
// ═══════════════════════════════════════════════════

export function ModelVsInfrastructure() {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<"model" | "infra">("model");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const modelMetrics = [
    { label: "MMLU Score", value: 88, prev: 85, delta: "+3.5%", color: "#D97706" },
    { label: "Context Window", value: 72, prev: 65, delta: "+10.8%", color: "#D97706" },
    { label: "Cost / 1M Tokens", value: 45, prev: 52, delta: "-13.5%", color: "#D97706" },
    { label: "Business Impact", value: 12, prev: 10, delta: "+2%", color: "#EF4444" },
  ];

  const infraMetrics = [
    { label: "Execution Speed", value: 95, prev: 40, delta: "+137%", color: "#C0F0FB" },
    { label: "Agent Autonomy", value: 88, prev: 15, delta: "+487%", color: "#C0F0FB" },
    { label: "Integration Depth", value: 92, prev: 20, delta: "+360%", color: "#C0F0FB" },
    { label: "Business Impact", value: 85, prev: 10, delta: "+750%", color: "#10B981" },
  ];

  const metrics = activeView === "model" ? modelMetrics : infraMetrics;

  return (
    <div className="w-full bg-[#0F0F12] rounded-xl border border-white/5 p-6 md:p-8 my-10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#C0F0FB]/[0.03] rounded-full blur-[100px]" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
            Value Comparison
          </span>
          <h4 className="text-xl font-black text-white mt-3 tracking-tight">
            Marginal Model Gains vs. Infrastructure Revolution
          </h4>
          <p className="text-xs text-[#888899] mt-1 max-w-lg mx-auto">
            Toggle between model upgrades and infrastructure upgrades to see which delivers real business transformation.
          </p>
        </div>

        {/* Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/5 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveView("model")}
            className={cn(
              "py-3 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2",
              activeView === "model"
                ? "bg-[#D97706] text-white shadow-md"
                : "text-[#9CA3AF] hover:text-white"
            )}
          >
            <Cpu size={13} />
            Model Upgrade
          </button>
          <button
            onClick={() => setActiveView("infra")}
            className={cn(
              "py-3 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2",
              activeView === "infra"
                ? "bg-[#C0F0FB] text-white shadow-md shadow-[#C0F0FB]/20"
                : "text-[#9CA3AF] hover:text-white"
            )}
          >
            <Factory size={13} />
            Infrastructure
          </button>
        </div>

        {/* Bars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {metrics.map((m, i) => (
              <div key={m.label} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-[13px] font-medium tracking-tight">{m.label}</span>
                  <span className={cn(
                    "text-[12px] font-bold font-mono px-2 py-0.5 rounded-md",
                    m.label === "Business Impact" && activeView === "infra"
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : m.label === "Business Impact" && activeView === "model"
                      ? "bg-red-500/10 text-red-400"
                      : activeView === "model"
                      ? "bg-[#D97706]/10 text-[#D97706]"
                      : "bg-primary/10 text-primary"
                  )}>
                    {m.delta}
                  </span>
                </div>
                <div className="h-7 bg-white/[0.04] rounded-md overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-md relative"
                    style={{
                      background: m.label === "Business Impact" && activeView === "model"
                        ? "linear-gradient(90deg, #EF4444, #F87171)"
                        : m.label === "Business Impact" && activeView === "infra"
                        ? "linear-gradient(90deg, #10B981, #34D399)"
                        : activeView === "model"
                        ? "linear-gradient(90deg, #D97706, #F59E0B)"
                        : "linear-gradient(90deg, #C0F0FB, #6366F1)"
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: mounted ? `${m.value}%` : "0%" }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  >
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold font-mono text-white drop-shadow-sm">
                      {m.value}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Insight Callout */}
        <motion.div
          key={activeView + "-insight"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "mt-8 p-4 rounded-lg border text-[12px] font-mono leading-relaxed",
            activeView === "model"
              ? "bg-[#D97706]/5 border-[#D97706]/20 text-[#F59E0B]"
              : "bg-primary/5 border-primary/20 text-[#93A3FF]"
          )}
        >
          {activeView === "model"
            ? "⚠ Upgrading from GPT-4.5 to GPT-5 yields single-digit improvements on benchmarks — but barely moves the needle on business outcomes."
            : "✦ Building execution infrastructure (agent orchestration, GPU acceleration, tool integration) delivers 5–10× more business value than any single model upgrade."
          }
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 5. PHYSICAL AI SIMULATOR — 3D Robotic Environment
//    (For "Physical AI and the Rise of Robotics")
// ═══════════════════════════════════════════════════

function RoboticArm({ simSpeed }: { simSpeed: number }) {
  const armRef = useRef<any>(null);
  const jointRef = useRef<any>(null);
  const clawRef = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * simSpeed;

    // Base rotation
    if (armRef.current) {
      armRef.current.rotation.y = Math.sin(time * 0.4) * 0.8;
    }
    // Joint movement
    if (jointRef.current) {
      jointRef.current.rotation.z = Math.sin(time * 0.6 + 1) * 0.4 - 0.3;
    }
    // Claw open/close
    if (clawRef.current) {
      clawRef.current.scale.x = 0.8 + Math.sin(time * 1.2) * 0.2;
    }
  });

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Grid lines on ground */}
      <gridHelper args={[12, 20, "#C0F0FB", "#1a1a3e"]} position={[0, -1.49, 0]} />

      {/* Robot base */}
      <group ref={armRef}>
        {/* Base cylinder */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.8, 1, 1, 16]} />
          <meshStandardMaterial color="#2a2a3e" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Lower arm */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.35, 2.5, 0.35]} />
          <meshStandardMaterial color="#C0F0FB" emissive="#2A4AD4" emissiveIntensity={0.3} roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Joint */}
        <group ref={jointRef} position={[0, 1.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={0.5} />
          </mesh>

          {/* Upper arm */}
          <mesh position={[0.8, 0.6, 0]}>
            <boxGeometry args={[1.8, 0.25, 0.25]} />
            <meshStandardMaterial color="#A1A1AA" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Claw / end effector */}
          <group ref={clawRef} position={[1.7, 0.6, 0]}>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.15]} />
              <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.15]} />
              <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={0.3} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Target objects on conveyor */}
      {[[-2, -1, 1.5], [2.5, -1, -1], [-1.5, -1, -2]].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={idx === 0 ? "#EF4444" : idx === 1 ? "#8B5CF6" : "#06B6D4"}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Simulation boundary walls (wireframe) */}
      <mesh position={[0, 0.5, -5]}>
        <planeGeometry args={[12, 4]} />
        <meshBasicMaterial color="#C0F0FB" wireframe opacity={0.15} transparent />
      </mesh>
    </group>
  );
}

export function PhysicalAISimulator() {
  const [mounted, setMounted] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simCount, setSimCount] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isTraining) return;
    const interval = setInterval(() => {
      setSimCount(prev => {
        if (prev >= 999) {
          setIsTraining(false);
          setSimSpeed(1);
          return 999;
        }
        return prev + Math.floor(Math.random() * 12) + 3;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isTraining]);

  const handleTrain = () => {
    if (isTraining) return;
    setSimCount(0);
    setSimSpeed(3);
    setIsTraining(true);
  };

  if (!mounted) return <FallbackVisual />;

  return (
    <div className="relative w-full bg-[#0F0F12] rounded-xl border border-white/5 overflow-hidden shadow-2xl my-10">
      {/* 3D Scene */}
      <div className="w-full h-[360px] relative">
        <Canvas camera={{ position: [4, 3, 6], fov: 40 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[8, 8, 8]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, 3, -5]} intensity={0.6} color="#C0F0FB" />
          <RoboticArm simSpeed={simSpeed} />
        </Canvas>

        {/* Overlay HUD */}
        <div className="absolute top-4 left-4 font-mono text-[10px] space-y-2 uppercase text-white tracking-widest bg-black/50 border border-white/10 px-3 py-2.5 rounded-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", isTraining ? "bg-[#F59E0B] animate-pulse" : "bg-[#10B981]")} />
            <span>{isTraining ? "Training" : "Idle"}</span>
          </div>
          <div>Sim Speed: {simSpeed}×</div>
          <div>Iterations: {Math.min(simCount, 999).toLocaleString()}</div>
        </div>

        {/* Industry tags */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5">
          {[
            { label: "Warehousing", icon: Boxes },
            { label: "Agriculture", icon: Cog },
            { label: "Healthcare", icon: Shield }
          ].map((tag) => (
            <div key={tag.label} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded px-2.5 py-1.5 text-[9px] font-mono text-[#888899] uppercase tracking-wider">
              <tag.icon size={10} className="text-primary" />
              {tag.label}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0F0F12] via-transparent to-transparent" />
      </div>

      {/* Control Bar */}
      <div className="border-t border-white/5 bg-[#14141A] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Omniverse Sim Environment</h4>
          <p className="text-[10px] text-[#888899] mt-0.5">
            {isTraining
              ? `Running reinforcement learning — ${Math.min(simCount, 999)} iterations completed`
              : simCount >= 999
              ? "Training complete — robot policy converged after 999 simulations"
              : "Click Train to run parallel simulation loops"
            }
          </p>
        </div>
        <button
          onClick={handleTrain}
          disabled={isTraining}
          className={cn(
            "h-9 px-5 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-1.5 transition-all cursor-pointer shrink-0",
            isTraining
              ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 cursor-not-allowed"
              : "bg-[#10B981] hover:bg-[#059669] text-white"
          )}
        >
          <Activity size={12} className={cn(isTraining && "animate-pulse")} />
          {isTraining ? "Training..." : simCount >= 999 ? "Retrain" : "Train Robot"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 6. USEFUL AI ORCHESTRATOR — Autonomous Task Flow
//    (For "The Future of Useful AI")
// ═══════════════════════════════════════════════════

export function UsefulAIOrchestrator() {
  const [activeNode, setActiveNode] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const nodes = [
    { label: "Monitor Email", icon: Eye, color: "#6B7280", desc: "Scans inbox for project updates and client requests" },
    { label: "Generate Tasks", icon: FileCode, color: "#C0F0FB", desc: "Breaks down requests into discrete, assignable work items" },
    { label: "Assign to Team", icon: Users, color: "#8B5CF6", desc: "Routes tasks to team members based on skill and capacity" },
    { label: "Create Branches", icon: GitBranch, color: "#10B981", desc: "Opens Git branches and scaffolds boilerplate code" },
    { label: "Schedule Review", icon: Target, color: "#F59E0B", desc: "Books code review slots and sets deadline reminders" },
    { label: "Track Progress", icon: BarChart3, color: "#EF4444", desc: "Updates dashboards and reports status to stakeholders" },
  ];

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveNode(prev => {
        if (prev >= nodes.length - 1) {
          setIsRunning(false);
          return nodes.length - 1;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isRunning, nodes.length]);

  const handleRun = () => {
    setActiveNode(0);
    setIsRunning(true);
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 md:p-8 my-10 shadow-sm overflow-hidden relative">
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-primary/5 px-2.5 py-1 rounded">
          Autonomous Execution Loop
        </span>
        <h4 className="text-xl font-black text-foreground mt-3 tracking-tight">
          How Useful AI Replaces Manual Workflows
        </h4>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-md mx-auto">
          Watch the AI system autonomously execute a full project management cycle — no human prompts required.
        </p>
      </div>

      {/* Pipeline visualization */}
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isActive = idx === activeNode;
            const isComplete = idx < activeNode;

            return (
              <motion.div
                key={node.label}
                className={cn(
                  "relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300 cursor-pointer",
                  isActive
                    ? "border-primary bg-primary/5 shadow-md shadow-[#C0F0FB]/10"
                    : isComplete
                    ? "border-[#10B981]/30 bg-[#10B981]/5"
                    : "border-border bg-white/[0.02] hover:border-primary/30"
                )}
                onClick={() => { if (!isRunning) setActiveNode(idx); }}
                animate={isActive ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.6, repeat: isActive && isRunning ? Infinity : 0 }}
              >
                {/* Step number */}
                <span className={cn(
                  "absolute -top-2 -right-2 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center",
                  isComplete
                    ? "bg-[#10B981] text-white"
                    : isActive
                    ? "bg-[#C0F0FB] text-white"
                    : "bg-[#E5E2DC] text-[#9CA3AF]"
                )}>
                  {isComplete ? "✓" : idx + 1}
                </span>

                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                  isActive ? "bg-primary/10" : isComplete ? "bg-[#10B981]/10" : "bg-[#E5E2DC]"
                )}>
                  <Icon
                    size={18}
                    style={{ color: isActive ? "#C0F0FB" : isComplete ? "#10B981" : node.color }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "text-primary" : isComplete ? "text-[#10B981]" : "text-[#9CA3AF]"
                )}>
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Active node detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-6 bg-white/[0.02] border border-border rounded-lg p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {React.createElement(nodes[activeNode].icon, { size: 18, style: { color: nodes[activeNode].color } })}
            </div>
            <div>
              <h5 className="font-bold text-foreground text-sm">{nodes[activeNode].label}</h5>
              <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">{nodes[activeNode].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Run button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={cn(
            "h-10 px-6 text-[12px] font-bold uppercase tracking-wider rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer",
            isRunning
              ? "bg-primary/10 text-primary border border-primary/20 cursor-not-allowed"
              : "bg-[#C0F0FB] hover:bg-[#2A4AD4] text-white shadow-md shadow-[#C0F0FB]/15"
          )}
        >
          <Play size={12} className={cn(isRunning && "animate-pulse")} />
          {isRunning ? "Executing..." : "Run Full Pipeline"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 7. BUSINESS READINESS GAUGE — Interactive Assessment
//    (For "What This Means for Businesses")
// ═══════════════════════════════════════════════════

export function BusinessReadinessGauge() {
  const [scores, setScores] = useState({ workflow: 25, data: 40, guardrails: 15 });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const avg = Math.round((scores.workflow + scores.data + scores.guardrails) / 3);
    setTotalScore(avg);
  }, [scores]);

  const pillars = [
    {
      key: "workflow" as const,
      label: "Workflow Mapping",
      icon: Workflow,
      color: "#C0F0FB",
      desc: "How well-documented are your business processes?",
      levels: [
        { value: 25, label: "Ad-hoc / Undocumented" },
        { value: 50, label: "Partially Mapped" },
        { value: 75, label: "Fully Documented" },
        { value: 100, label: "Automated & Instrumented" },
      ]
    },
    {
      key: "data" as const,
      label: "Data Infrastructure",
      icon: Database,
      color: "#8B5CF6",
      desc: "Can agents securely access your databases and CRMs in real-time?",
      levels: [
        { value: 25, label: "Siloed Spreadsheets" },
        { value: 50, label: "Centralized but Manual" },
        { value: 75, label: "API-Connected" },
        { value: 100, label: "Unified Real-Time Layer" },
      ]
    },
    {
      key: "guardrails" as const,
      label: "Guardrails & Oversight",
      icon: Shield,
      color: "#10B981",
      desc: "Do you have approval workflows and verification gates for AI actions?",
      levels: [
        { value: 25, label: "No Controls" },
        { value: 50, label: "Basic Logging" },
        { value: 75, label: "Human-in-the-Loop" },
        { value: 100, label: "Full Governance Stack" },
      ]
    },
  ];

  const getReadinessLabel = (score: number) => {
    if (score <= 25) return { label: "Not Ready", color: "#EF4444" };
    if (score <= 50) return { label: "Early Stage", color: "#F59E0B" };
    if (score <= 75) return { label: "Progressing", color: "#C0F0FB" };
    return { label: "Agent-Ready", color: "#10B981" };
  };

  const readiness = getReadinessLabel(totalScore);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 md:p-8 my-10 shadow-sm">
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-bold bg-primary/5 px-2.5 py-1 rounded">
          Self-Assessment
        </span>
        <h4 className="text-xl font-black text-foreground mt-3 tracking-tight">
          Is Your Business Agent-Ready?
        </h4>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-md mx-auto">
          Rate your organization across the three critical pillars. Adjust the sliders to see your readiness score.
        </p>
      </div>

      {/* Score Display */}
      <div className="flex justify-center mb-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Circular background */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E2DC" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke={readiness.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - totalScore / 100) }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>
          <div className="text-center z-10">
            <span className="text-3xl font-black text-foreground">{totalScore}</span>
            <span className="text-xs text-[#9CA3AF] block font-mono">/ 100</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <span
          className="text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full"
          style={{ backgroundColor: readiness.color + "15", color: readiness.color }}
        >
          {readiness.label}
        </span>
      </div>

      {/* Pillar Sliders */}
      <div className="space-y-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const currentLevel = pillar.levels.find(l => l.value >= scores[pillar.key]) || pillar.levels[3];

          return (
            <div key={pillar.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: pillar.color + "15" }}>
                  <Icon size={14} style={{ color: pillar.color }} />
                </div>
                <div>
                  <h5 className="font-bold text-foreground text-[13px]">{pillar.label}</h5>
                  <p className="text-[10px] text-[#9CA3AF]">{pillar.desc}</p>
                </div>
              </div>

              {/* Level selector buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {pillar.levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setScores(prev => ({ ...prev, [pillar.key]: level.value }))}
                    className={cn(
                      "py-2.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer text-center",
                      scores[pillar.key] === level.value
                        ? "text-white shadow-sm"
                        : "border-border text-[#9CA3AF] hover:border-current bg-white/[0.02]"
                    )}
                    style={
                      scores[pillar.key] === level.value
                        ? { backgroundColor: pillar.color, borderColor: pillar.color }
                        : undefined
                    }
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// 8. DEVELOPER ROLE SHIFT — Skill Evolution Visualizer
//    (For "What This Means for Developers" + Startups)
// ═══════════════════════════════════════════════════

export function DeveloperRoleShift() {
  const [era, setEra] = useState<"before" | "after">("before");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const beforeSkills = [
    { name: "Writing Boilerplate", pct: 85, color: "#6B7280", fading: true },
    { name: "Syntax & Debugging", pct: 75, color: "#6B7280", fading: true },
    { name: "Manual Testing", pct: 65, color: "#6B7280", fading: true },
    { name: "System Architecture", pct: 30, color: "#C0F0FB", fading: false },
    { name: "Security Engineering", pct: 20, color: "#C0F0FB", fading: false },
    { name: "Agent Coordination", pct: 5, color: "#10B981", fading: false },
  ];

  const afterSkills = [
    { name: "Writing Boilerplate", pct: 10, color: "#EF4444", fading: true },
    { name: "Syntax & Debugging", pct: 15, color: "#EF4444", fading: true },
    { name: "Manual Testing", pct: 10, color: "#EF4444", fading: true },
    { name: "System Architecture", pct: 80, color: "#C0F0FB", fading: false },
    { name: "Security Engineering", pct: 70, color: "#8B5CF6", fading: false },
    { name: "Agent Coordination", pct: 90, color: "#10B981", fading: false },
  ];

  const skills = era === "before" ? beforeSkills : afterSkills;

  return (
    <div className="w-full bg-[#14141A] border border-white/5 rounded-xl p-6 md:p-8 my-10 shadow-2xl relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-[#10B981]/[0.03] rounded-full blur-[80px]" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#10B981] uppercase font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
            Skill Evolution
          </span>
          <h4 className="text-xl font-black text-white mt-3 tracking-tight">
            How Developer Time Allocation Is Shifting
          </h4>
          <p className="text-xs text-[#888899] mt-1 max-w-md mx-auto">
            Toggle between eras to see how the value of engineering skills is being restructured by agentic AI.
          </p>
        </div>

        {/* Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/5 mb-8 max-w-sm mx-auto">
          <button
            onClick={() => setEra("before")}
            className={cn(
              "py-3 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2",
              era === "before"
                ? "bg-[#6B7280] text-white"
                : "text-[#9CA3AF] hover:text-white"
            )}
          >
            <Code size={13} />
            Pre-Agent Era
          </button>
          <button
            onClick={() => setEra("after")}
            className={cn(
              "py-3 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-2",
              era === "after"
                ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/20"
                : "text-[#9CA3AF] hover:text-white"
            )}
          >
            <Bot size={13} />
            Agentic Era
          </button>
        </div>

        {/* Skill Bars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={era}
            initial={{ opacity: 0, x: era === "after" ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: era === "after" ? -15 : 15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn(
                    "text-[12px] font-medium tracking-tight flex items-center gap-2",
                    skill.fading && era === "after" ? "text-[#9CA3AF] line-through opacity-60" : "text-white"
                  )}>
                    {skill.name}
                    {skill.fading && era === "after" && (
                      <span className="text-[9px] font-mono text-red-400 no-underline px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 uppercase">
                        Automated
                      </span>
                    )}
                    {!skill.fading && era === "after" && skill.pct >= 70 && (
                      <span className="text-[9px] font-mono text-[#10B981] px-1.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/20 uppercase">
                        High Value
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold font-mono text-[#9CA3AF]">
                    {skill.pct}%
                  </span>
                </div>
                <div className="h-5 bg-white/[0.04] rounded overflow-hidden">
                  <motion.div
                    className="h-full rounded"
                    style={{ backgroundColor: skill.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: mounted ? `${skill.pct}%` : "0%" }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Insight */}
        <motion.p
          key={era + "-insight"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-[12px] font-mono leading-relaxed p-4 rounded-lg border bg-white/[0.02] border-white/5 text-[#9CA3AF]"
        >
          {era === "before"
            ? "In the pre-agent era, 70%+ of a developer's time is spent on commodity work — writing boilerplate, fixing syntax, and running manual tests. High-value architecture and security work is deprioritized."
            : "In the agentic era, commodity coding is fully automated. The developer's highest-value skills become system design, agent coordination, and security engineering — the work AI cannot safely do alone."
          }
        </motion.p>
      </div>
    </div>
  );
}
