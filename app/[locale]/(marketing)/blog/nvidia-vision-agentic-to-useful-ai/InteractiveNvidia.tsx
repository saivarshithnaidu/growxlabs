"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Bot, Cpu, Zap, Activity, CheckCircle2, 
  Terminal, Sparkles, Database, Workflow, Play, RefreshCw 
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
          color="#355CFF" 
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
      <meshBasicMaterial color="#355CFF" toneMapped={false} />
    </mesh>
  );
}

// Fallback skeleton view during hydration
function FallbackVisual() {
  return (
    <div className="w-full h-full bg-[#0F0F12] flex items-center justify-center rounded-xl border border-white/5">
      <div className="text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-[#355CFF] animate-spin mx-auto opacity-40" />
        <p className="text-xs text-[#6B7280] font-mono uppercase tracking-wider">Loading compute cell...</p>
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
            <span className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-[#355CFF] animate-ping" : "bg-[#10B981]")} />
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
              ? "bg-[#355CFF]/20 text-[#355CFF] border border-[#355CFF]/30 cursor-not-allowed" 
              : "bg-[#355CFF] hover:bg-[#2A4AD4] text-white"
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
      color: "border-[#D1D5DB] text-[#6B7280]",
      glow: "shadow-[0_0_15px_rgba(107,114,128,0.15)]",
      desc: "First wave (2022-2024) optimized for passive content creation. Responds only when prompted and forgets context immediately.",
      workflow: ["User Input", "LLM Inference", "Output Generated", "Session Terminated"],
      metrics: { autonomy: "0%", execution: "None", impact: "Friction Reducer" }
    },
    {
      title: "Agentic AI (Reasoning Loop)",
      subtitle: "The Action-Centric Wave",
      icon: Workflow,
      color: "border-[#355CFF] text-[#355CFF]",
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
    <div className="w-full bg-white border border-[#E5E2DC] rounded-xl p-6 md:p-8 my-10 shadow-sm animate-fade-in">
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold bg-[#355CFF]/5 px-2.5 py-1 rounded">
          Evolutionary Blueprint
        </span>
        <h4 className="text-xl font-black text-[#1A1A1A] mt-3 tracking-tight">The Journey from Generation to Utility</h4>
        <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
          Click on any phase below to examine the internal loop architecture, metrics, and business impact.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-[#EDEAE4] rounded-lg border border-[#E5E2DC] mb-8">
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
                    ? "bg-[#355CFF] text-white shadow-sm"
                    : "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-[#6B7280] hover:text-[#1A1A1A]"
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
                <h5 className="font-black text-lg text-[#1A1A1A]">{steps[activeStep].title}</h5>
                <p className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider mt-0.5">{steps[activeStep].subtitle}</p>
              </div>
              <p className="text-[14px] leading-relaxed text-[#4B5563]">{steps[activeStep].desc}</p>
              
              {/* Animated Workflow Visualizer */}
              <div className="space-y-2 pt-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#6B7280]">System Pipeline:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {steps[activeStep].workflow.map((node, nodeIdx) => (
                    <React.Fragment key={nodeIdx}>
                      <span className="text-[11px] font-mono bg-[#EDEAE4] border border-[#E5E2DC] px-2.5 py-1 rounded text-[#1A1A1A]">
                        {node}
                      </span>
                      {nodeIdx < steps[activeStep].workflow.length - 1 && (
                        <span className="text-xs text-[#6B7280]">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Metrics Table */}
            <div className="bg-[#F9F8F6] border border-[#E5E2DC] rounded-lg p-5 flex flex-col justify-center space-y-4">
              <h6 className="font-mono text-[9px] uppercase tracking-wider text-[#6B7280] border-b border-[#E5E2DC] pb-2">
                Performance Indicators
              </h6>
              {Object.entries(steps[activeStep].metrics).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-xs font-mono">
                  <span className="capitalize text-[#6B7280]">{key}:</span>
                  <span className="font-bold text-[#1A1A1A]">{val}</span>
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
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#355CFF]/3 rounded-full blur-[80px]" />
      
      <div className="text-center mb-8 relative z-10">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#355CFF] uppercase font-bold bg-white/5 px-2.5 py-1 rounded border border-white/10">
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
                  ? "bg-[#355CFF] border-[#355CFF] text-white shadow-md shadow-[#355CFF]/20" 
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
            <span className="text-[10px] font-mono text-[#355CFF] uppercase bg-[#355CFF]/10 px-2 py-0.5 rounded border border-[#355CFF]/20">
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
