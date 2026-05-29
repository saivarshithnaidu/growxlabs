"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Activity, 
  Cpu, 
  Gauge, 
  Compass, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  ChevronRight, 
  Eye, 
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   1. HERO SECTION VISUAL: LuceHeroVisual
   Giant abstract "F" blueprint layout.
   ═══════════════════════════════════════════════════ */
export function LuceHeroVisual() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const parts = {
    f_wing: {
      title: "VIRTUAL AERO SPOILER",
      spec: "Dynamic DRS // Drag Coefficient: 0.21 Cd",
      coord: "COORD: X_104 / Y_502",
      notes: "Prototipo Aerodinamica Maranello"
    },
    battery_chassis: {
      title: "SOLID-STATE STRESS CORE",
      spec: "800V Architecture // Carbon Fiber Monocoque",
      coord: "COORD: X_309 / Y_812",
      notes: "Integrazione Strutturale Cella"
    },
    axial_flux: {
      title: "TRIPLE AXIAL FLUX MOTOR",
      spec: "1100 Nm Peak Torque // 22,000 RPM Max",
      coord: "COORD: X_780 / Y_204",
      notes: "Propulsione Magnetica Diretta"
    },
    vector_steering: {
      title: "TORQUE VECTORING ACTUATOR",
      spec: "Lateral Slip Control // 1.2ms Sync Latency",
      coord: "COORD: X_604 / Y_690",
      notes: "Controllo Dinamico Di Imbardata"
    }
  };

  return (
    <div className="relative w-full aspect-[1000/860] bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between p-6 select-none font-mono">
      {/* Precision Blueprint Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-12 grid-rows-12">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-[#E5E2DC]/50 border-dashed" />
        ))}
      </div>

      {/* Grid Coordinates and Metric Annotations */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[9px] text-[#9CA3AF]">
        <div className="flex justify-between">
          <span>SYS.REF: F_LUCE_2026 // TYPE_E_SPEC</span>
          <span>LAT: 44.5323° N // LON: 10.8640° E</span>
        </div>
        <div className="flex justify-between">
          <span>METROLOGY TOLERANCE: ±0.002mm</span>
          <span>SCALA 1:12 // PROGETTAZIONE DI PRECISIONE</span>
        </div>
      </div>

      {/* Top Banner Details */}
      <div className="relative z-10 flex justify-between items-start border-b border-[#E5E2DC] pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#E60000] tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
            Disegno Tecnico / Luce V.01
          </span>
          <h4 className="text-sm font-bold text-[#1A1A1A] mt-2 tracking-tight">
            ESTETICA STRUTTURALE DELL'ERA ELETTRICA
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#9CA3AF]">REV. 2026.05</span>
          <p className="text-[11px] font-bold text-[#1A1A1A]">MARANELLO, ITALIA</p>
        </div>
      </div>

      {/* Main SVG Blueprint Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center py-4">
        <svg viewBox="0 0 1000 700" className="w-full h-full max-h-[500px]">
          {/* Circular Blueprint Rulers */}
          <circle cx="500" cy="350" r="280" fill="none" stroke="#E5E2DC" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="350" r="200" fill="none" stroke="#E5E2DC" strokeWidth="0.5" />
          <circle cx="500" cy="350" r="120" fill="none" stroke="#E5E2DC" strokeWidth="0.5" strokeDasharray="2 6" />

          {/* Compass & Precision Crosshairs */}
          <line x1="500" y1="50" x2="500" y2="650" stroke="#E5E2DC" strokeWidth="0.5" />
          <line x1="150" y1="350" x2="850" y2="350" stroke="#E5E2DC" strokeWidth="0.5" />

          {/* Isometric Structure Grid Lines */}
          <path d="M150 150 L850 550" stroke="#E5E2DC" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M150 550 L850 150" stroke="#E5E2DC" strokeWidth="0.5" strokeDasharray="3 3" />

          {/* ═══════════════════════════════════════════════════
             GIANT ABSTRACT FERRARI-INSPIRED "F" VECTOR ARTWORK
             ═══════════════════════════════════════════════════ */}
          {/* Base Shadow Matrix */}
          <path 
            d="M250 120 L650 120 L680 180 L400 180 L420 320 L580 320 L600 380 L440 380 L490 620 L350 620 Z" 
            fill="none" 
            stroke="#9CA3AF" 
            strokeWidth="1.5" 
            strokeDasharray="4 2"
            opacity="0.3"
          />

          {/* Main "F" Geometry with Ferrari Red strokes & accents */}
          <motion.path 
            d="M270 140 H 680 L 660 210 H 420 L 400 310 H 600 L 580 375 H 390 L 340 600 H 270 Z" 
            fill="rgba(230, 0, 0, 0.01)" 
            stroke="#E60000" 
            strokeWidth="2.5" 
            strokeLinejoin="bevel"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          {/* Inner mechanical blueprint outlines */}
          <path 
            d="M320 160 H 630 L 610 190 H 400 L 380 290 H 550 L 530 345 H 370 L 320 570 H 320 Z" 
            fill="none" 
            stroke="#1A1A1A" 
            strokeWidth="1" 
            opacity="0.8" 
          />

          {/* Isometric engineering subdivisions on the "F" */}
          <line x1="270" y1="140" x2="320" y2="160" stroke="#1A1A1A" strokeWidth="0.75" />
          <line x1="680" y1="140" x2="630" y2="160" stroke="#1A1A1A" strokeWidth="0.75" />
          <line x1="660" y1="210" x2="610" y2="190" stroke="#1A1A1A" strokeWidth="0.75" />
          <line x1="420" y1="210" x2="400" y2="290" stroke="#E60000" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="600" y1="310" x2="550" y2="290" stroke="#1A1A1A" strokeWidth="0.75" />
          <line x1="580" y1="375" x2="530" y2="345" stroke="#1A1A1A" strokeWidth="0.75" />
          <line x1="390" y1="375" x2="370" y2="345" stroke="#E60000" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="340" y1="600" x2="320" y2="570" stroke="#1A1A1A" strokeWidth="0.75" />

          {/* ═══════════════════════════════════════════════════
             HOTSPOT ANNOTATIONS AND LEADER LINES
             ═══════════════════════════════════════════════════ */}
          
          {/* Hotspot 1: Virtual Aero Spoiler (Top Right of F) */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPart("f_wing")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle cx="650" cy="160" r="16" fill="rgba(230, 0, 0, 0.05)" className="group-hover:fill-red-100 transition-colors" />
            <circle cx="650" cy="160" r="5" fill="#E60000" />
            <line x1="650" y1="160" x2="780" y2="110" stroke="#E60000" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="780" y1="110" x2="860" y2="110" stroke="#E60000" strokeWidth="1" />
            <circle cx="650" cy="160" r="25" fill="none" stroke="#E60000" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "3s" }} />
            <text x="790" y="100" fill="#E60000" className="text-[10px] font-bold">DRS_SYS.01</text>
          </g>

          {/* Hotspot 2: Axial Flux Motors (Middle Right of F) */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPart("axial_flux")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle cx="590" cy="340" r="16" fill="rgba(230, 0, 0, 0.05)" className="group-hover:fill-red-100 transition-colors" />
            <circle cx="590" cy="340" r="5" fill="#1A1A1A" />
            <line x1="590" y1="340" x2="720" y2="280" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="720" y1="280" x2="820" y2="280" stroke="#1A1A1A" strokeWidth="1" />
            <text x="730" y="270" fill="#1A1A1A" className="text-[10px] font-bold">AXIAL_MTR.3x</text>
          </g>

          {/* Hotspot 3: Carbon Fiber Chassis Core (Bottom Main of F) */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPart("battery_chassis")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle cx="310" cy="380" r="16" fill="rgba(230, 0, 0, 0.05)" className="group-hover:fill-red-100 transition-colors" />
            <circle cx="310" cy="380" r="5" fill="#1A1A1A" />
            <line x1="310" y1="380" x2="160" y2="380" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="160" y1="380" x2="80" y2="380" stroke="#1A1A1A" strokeWidth="1" />
            <text x="90" y="370" fill="#1A1A1A" className="text-[10px] font-bold">STRUCT_CORE.C8</text>
          </g>

          {/* Hotspot 4: Yaw Control / Torque Vectoring (Bottom Corner of F) */}
          <g 
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredPart("vector_steering")}
            onMouseLeave={() => setHoveredPart(null)}
          >
            <circle cx="340" cy="530" r="16" fill="rgba(230, 0, 0, 0.05)" className="group-hover:fill-red-100 transition-colors" />
            <circle cx="340" cy="530" r="5" fill="#E60000" />
            <line x1="340" y1="530" x2="220" y2="600" stroke="#E60000" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="220" y1="600" x2="110" y2="600" stroke="#E60000" strokeWidth="1" />
            <text x="120" y="590" fill="#E60000" className="text-[10px] font-bold">VEC_TRQ.SYS</text>
          </g>
        </svg>
      </div>

      {/* Telemetry Inspector Overlay (Activates on hovering hotspots) */}
      <div className="relative z-10 min-h-[70px] bg-[#FAFAF8] border border-[#E5E2DC] rounded-lg p-3 text-xs flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {hoveredPart ? (
            <motion.div 
              key={hoveredPart}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-2"
            >
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Spec Component</span>
                <p className="font-bold text-[#E60000]">{parts[hoveredPart as keyof typeof parts].title}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Calculated Telemetry</span>
                <p className="font-bold text-[#1A1A1A]">{parts[hoveredPart as keyof typeof parts].spec}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF] block">{parts[hoveredPart as keyof typeof parts].coord}</span>
                <p className="text-[10px] italic text-[#4B5563] mt-0.5">{parts[hoveredPart as keyof typeof parts].notes}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#9CA3AF] italic text-[11px]"
            >
              Hover over blueprint nodes to activate real-time telemetry inspectors.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. SECTION 1 VISUAL: CombustionToElectricVisual
   Engine blueprint dissolving/morphing into electric.
   ═══════════════════════════════════════════════════ */
export function CombustionToElectricVisual() {
  const [blendValue, setBlendValue] = useState<number>(0);

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden p-6 font-mono">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5E2DC] pb-4 mb-6">
        <div>
          <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
            Section 1 Visual // Progetto Evoluzione
          </span>
          <h4 className="text-base font-black text-[#1A1A1A] mt-2 tracking-tight">
            THE END OF THE COMBUSTION ERA
          </h4>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <span className="text-xs text-[#9CA3AF]">ARCHITECTURAL BLEND SCALE</span>
          <p className="text-sm font-bold text-[#1A1A1A]">
            {blendValue === 0 ? "V12 MECHANICAL" : blendValue === 100 ? "AXIAL ELECTRIC" : `MORPH IN PROGRESS: ${blendValue}%`}
          </p>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[1000/600] border border-[#E5E2DC] bg-[#FAF9F6] rounded-lg flex items-center justify-center overflow-hidden mb-6">
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {/* Grid Background */}
          <defs>
            <pattern id="blendGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E2DC" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#blendGrid)" opacity="0.75" />

          {/* Central Dividing Line */}
          <line x1="500" y1="50" x2="500" y2="550" stroke="#E5E2DC" strokeWidth="1" strokeDasharray="6 6" />

          {/* LEFT SIDE: V12 PISTONS ENGINE (Graphite outline) */}
          <g style={{ opacity: 1 - blendValue / 100 }}>
            {/* Cylinder Block Left */}
            <rect x="180" y="200" width="120" height="240" fill="none" stroke="#1A1A1A" strokeWidth="2" rx="4" />
            <line x1="240" y1="200" x2="240" y2="440" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Crankshaft Gears */}
            <circle cx="240" cy="410" r="24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            <circle cx="240" cy="410" r="8" fill="#1A1A1A" />
            
            {/* Connecting Rod & Piston A */}
            <motion.g
              animate={{ y: blendValue === 0 ? [0, -35, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              <rect x="210" y="230" width="60" height="25" fill="none" stroke="#1A1A1A" strokeWidth="2.5" rx="2" />
              <line x1="240" y1="255" x2="240" y2="410" stroke="#1A1A1A" strokeWidth="2" />
            </motion.g>

            {/* Spark Plug Elements */}
            <path d="M230 170 H250 V200 H230 Z" fill="none" stroke="#E60000" strokeWidth="1.5" />
            <line x1="240" y1="150" x2="240" y2="170" stroke="#E60000" strokeWidth="1" />
            
            {/* Manifolds */}
            <path d="M120 220 Q150 220 180 250" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            <path d="M110 210 Q150 210 180 240" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />

            <text x="140" y="470" fill="#1A1A1A" className="text-xs font-bold font-mono">F140 V12 MECHANICAL CORE</text>
            <text x="140" y="490" fill="#9CA3AF" className="text-[10px] font-mono">VALVEMOTION: ACTIVE // RPM: 9200</text>
          </g>

          {/* RIGHT SIDE: AXIAL FLUX ELECTRIC POWER (Ferrari Red glows) */}
          <g style={{ opacity: blendValue / 100 }}>
            {/* Outer Stator Casing */}
            <circle cx="760" cy="320" r="130" fill="none" stroke="#E60000" strokeWidth="3" />
            <circle cx="760" cy="320" r="145" fill="none" stroke="#E60000" strokeWidth="1" strokeDasharray="3 6" />

            {/* Inner Rotor Matrix */}
            <circle cx="760" cy="320" r="95" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
            
            {/* Inverter Grid Blocks (High Frequency switches) */}
            <g transform="translate(680, 470)">
              <rect x="0" y="0" width="160" height="70" fill="none" stroke="#1A1A1A" strokeWidth="2" rx="4" />
              <line x1="0" y1="35" x2="160" y2="35" stroke="#E60000" strokeWidth="1" strokeDasharray="4 2" />
              <text x="10" y="20" fill="#1A1A1A" className="text-[9px] font-bold">SILICON CARBIDE INVERTER</text>
              <text x="10" y="55" fill="#E60000" className="text-[9px] font-bold">VOLTAGE: 800V DIRECT</text>
            </g>

            {/* High-density battery nodes inside stator */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const cx = 760 + 95 * Math.cos(angle);
              const cy = 320 + 95 * Math.sin(angle);
              return (
                <motion.circle 
                  key={i} 
                  cx={cx} 
                  cy={cy} 
                  r="6" 
                  fill={blendValue > 50 ? "#E60000" : "#1A1A1A"} 
                  animate={blendValue > 50 ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.15 }}
                />
              );
            })}

            {/* Central Electric Drive Shaft */}
            <circle cx="760" cy="320" r="28" fill="none" stroke="#1A1A1A" strokeWidth="2" />
            <circle cx="760" cy="320" r="10" fill="#1A1A1A" />
            
            {/* Magnetic Field Waves */}
            <path d="M600 320 Q680 220 760 220" fill="none" stroke="#E60000" strokeWidth="0.5" strokeDasharray="1 5" />
            <path d="M920 320 Q840 420 760 420" fill="none" stroke="#E60000" strokeWidth="0.5" strokeDasharray="1 5" />

            <text x="630" y="110" fill="#E60000" className="text-xs font-bold font-mono">AXIAL FLUX TRACTION HUB</text>
            <text x="630" y="130" fill="#9CA3AF" className="text-[10px] font-mono">EFFICIENCY: 97.4% // 3x MOTORS</text>
          </g>
        </svg>
      </div>

      {/* Interactive Controls */}
      <div className="bg-[#FAFAF8] border border-[#E5E2DC] rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-2/3 flex flex-col gap-2">
          <span className="text-xs font-bold text-[#1A1A1A]">SLIDE TO EVOLVE MECHANICS</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={blendValue} 
            onChange={(e) => setBlendValue(parseInt(e.target.value))}
            className="w-full accent-[#E60000] cursor-pointer h-1 bg-[#E5E2DC] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] text-[#9CA3AF]">
            <span>V12 PURE ENGINE (0%)</span>
            <span>HYBRID INTEGRATION (50%)</span>
            <span>PURE ELECTRIC LUCE (100%)</span>
          </div>
        </div>
        <div className="shrink-0 flex gap-2">
          <button 
            onClick={() => setBlendValue(0)}
            className="px-3 py-1.5 border border-[#E5E2DC] bg-white rounded text-[10px] hover:bg-[#FAF9F6] text-[#1A1A1A]"
          >
            V12 mechanical
          </button>
          <button 
            onClick={() => setBlendValue(100)}
            className="px-3 py-1.5 bg-[#E60000] text-white rounded text-[10px] hover:bg-[#C50000] font-bold"
          >
            Axial Electric
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SECTION 2 VISUAL: TransformationTimelineVisual
   Strategic timeline map with details on node clicks.
   ═══════════════════════════════════════════════════ */
export function TransformationTimelineVisual() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const timelineSteps = [
    {
      year: "2020",
      title: "Regulatory Impetus",
      tag: "GLOBAL MANDATES",
      metric: "Euro 7 & ICE phaseouts",
      description: "Global governments draft strict timelines to ban combustion vehicle sales in major cities. Enforces unprecedented efficiency thresholds on boutique luxury builders.",
      stats: [
        { label: "Target fleet reduction", value: "-55% CO2" },
        { label: "ICE Ban Timelines", value: "2030-2035" }
      ]
    },
    {
      year: "2022",
      title: "Market Transition",
      tag: "DEMOGRAPHICS SHIFT",
      metric: "+40% Luxury EV growth",
      description: "Modern luxury buyers shift spending towards sustainable alternatives. Competitor models emerge, demonstrating that peak performance and zero-emissions are compatible.",
      stats: [
        { label: "High Net Worth EV Demand", value: "62% Survey" },
        { label: "EV Premium Market Share", value: "14.2%" }
      ]
    },
    {
      year: "2024",
      title: "Solid-State Breakout",
      tag: "MARANELLO LABORATORY",
      metric: "Next-gen battery testing",
      description: "Ferrari labs finalize thermal-stable solid-state cells. Solves the traditional weight penalty, maintaining perfect center of gravity specs without adding heavy battery structures.",
      stats: [
        { label: "Cell Density", value: "480 Wh/kg" },
        { label: "Thermal Stability", value: "100% Secure" }
      ]
    },
    {
      year: "2026",
      title: "The Luce Launch",
      tag: "HISTORIC TRANSFORMATION",
      metric: "First fully electric Ferrari",
      description: "The Luce is officially unveiled. Built in Maranello's state-of-the-art e-building, integrating hardware assembly, electric motors, and predictive software dynamic systems in-house.",
      stats: [
        { label: "Luce Motor Output", value: "1400 HP" },
        { label: "0-100 km/h acceleration", value: "<1.95 sec" }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden p-6 font-mono">
      {/* Visual Header */}
      <div className="border-b border-[#E5E2DC] pb-4 mb-8">
        <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
          Section 2 Visual // Mappa Strategica
        </span>
        <h4 className="text-base font-black text-[#1A1A1A] mt-2 tracking-tight">
          THE STRATEGIC ROADMAP TO ELECTRIFICATION
        </h4>
      </div>

      {/* Horizontal Interactive Graph */}
      <div className="relative w-full py-8 mb-8 border border-[#E5E2DC] bg-[#FAFAF8] rounded-lg px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 overflow-hidden">
        {/* Connection Line */}
        <div className="absolute top-[35px] left-12 right-12 h-0.5 bg-[#E5E2DC] hidden md:block z-0" />
        <div 
          className="absolute top-[35px] left-12 h-0.5 bg-[#E60000] hidden md:block z-0 transition-all duration-500" 
          style={{ width: `${(activeStep / (timelineSteps.length - 1)) * 82}%` }}
        />

        {timelineSteps.map((step, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveStep(idx)}
            className="relative z-10 cursor-pointer flex flex-col items-center text-center group md:w-1/4"
          >
            {/* Step Node */}
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                activeStep === idx 
                  ? "bg-[#E60000] border-[#E60000] text-white" 
                  : "bg-white border-[#E5E2DC] text-[#9CA3AF] group-hover:border-[#1A1A1A]"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xs font-bold">{idx + 1}</span>
            </motion.div>

            <span className="text-xs font-bold text-[#1A1A1A] mt-3">{step.year}</span>
            <span className="text-[9px] text-[#9CA3AF] uppercase mt-1 tracking-wider">{step.title}</span>

            {/* Hover details tooltip */}
            <div className="text-[10px] text-[#E60000] mt-1 font-bold h-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view details
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Strategic Analysis Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-[#E5E2DC] rounded-lg p-6">
        <div className="md:col-span-8 space-y-4">
          <div className="flex gap-2.5 items-center">
            <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-wider bg-[#E60000]/5 px-2 py-0.5 rounded">
              {timelineSteps[activeStep].tag}
            </span>
            <span className="text-xs text-[#9CA3AF] font-bold">·</span>
            <span className="text-xs font-bold text-[#1A1A1A]">{timelineSteps[activeStep].metric}</span>
          </div>

          <h5 className="text-lg font-black text-[#1A1A1A] tracking-tight leading-snug">
            {timelineSteps[activeStep].title} — Phase {activeStep + 1}
          </h5>

          <p className="text-[14px] leading-[1.7] text-[#4B5563]">
            {timelineSteps[activeStep].description}
          </p>
        </div>

        {/* Column sidebar for statistics metrics */}
        <div className="md:col-span-4 bg-[#FAF9F6] border border-[#E5E2DC] rounded-md p-4 flex flex-col justify-center gap-4">
          <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">KEY METRIC TELEMETRY</span>
          <div className="space-y-4">
            {timelineSteps[activeStep].stats.map((st, i) => (
              <div key={i} className="border-b border-[#E5E2DC] pb-2 last:border-0 last:pb-0">
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF] block">{st.label}</span>
                <span className="text-lg font-black text-[#1A1A1A] leading-none">{st.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. SECTION 3 VISUAL: OpinionNetworkVisual
   Clashing perspectives node graph & inspector sidebars.
   ═══════════════════════════════════════════════════ */
export function OpinionNetworkVisual() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const opinionNodes = {
    heritage_sound: {
      id: "heritage_sound",
      side: "traditionalist",
      title: "V12 MOTOR SOUND",
      quote: "Electrification destroys the sensory climax of the natural acoustic motor. The sound is 50% of the emotion.",
      sentiment: "TRADITIONALIST CORE // 82% Sentiment Resistance",
      cx: 240,
      cy: 160
    },
    mechanical_vibe: {
      id: "mechanical_vibe",
      side: "traditionalist",
      title: "TACTILE FEEDBACK",
      quote: "Without mechanical vibrations, gear clatter, and oil heat, driving feels virtual, like playing a video game.",
      sentiment: "ENGAGEMENT BARRIER // 71% Sentiment Resistance",
      cx: 160,
      cy: 280
    },
    exclusivity_loss: {
      id: "exclusivity_loss",
      side: "traditionalist",
      title: "EXCLUSIVE PATENTS",
      quote: "Electric engines are highly commoditized. If a Tesla has similar performance, how can Ferrari charge luxury margins?",
      sentiment: "VALUE PROPOSITION THREAT // 65% Concern Rating",
      cx: 220,
      cy: 400
    },
    torque_instant: {
      id: "torque_instant",
      side: "futurist",
      title: "INSTANT TORQUE VECTOR",
      quote: "The axial flux motors hit peak torque instantly. There's no mechanical lag. It redefines lateral corner speeds.",
      sentiment: "PERFORMANCE ADVANTAGE // 92% Excitement Rating",
      cx: 760,
      cy: 160
    },
    software_chassis: {
      id: "software_chassis",
      side: "futurist",
      title: "SOFTWARE DYNAMICS OS",
      quote: "Dynamic slip controls run calculations 1000 times per second. It allows humans to explore vehicle boundaries safely.",
      sentiment: "INTELLIGENT INTEGRATION // 88% Technology Approval",
      cx: 840,
      cy: 280
    },
    eco_prestige: {
      id: "eco_prestige",
      side: "futurist",
      title: "CLEAN TECH STATUS",
      quote: "The future luxury buyer wants guilt-free prestige. Sustainable engineering is today's ultimate brand status.",
      sentiment: "MARKET ALIGNMENT // 79% Market Synergy",
      cx: 780,
      cy: 400
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden p-6 font-mono">
      {/* Visual Header */}
      <div className="border-b border-[#E5E2DC] pb-4 mb-6">
        <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
          Section 3 Visual // Grafico Delle Opinioni
        </span>
        <h4 className="text-base font-black text-[#1A1A1A] mt-2 tracking-tight">
          THE DILEMMA: HERITAGE RESISTANCE VS. FUTURE ACCLAIM
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Graph Column */}
        <div className="lg:col-span-8 relative aspect-[1000/600] border border-[#E5E2DC] bg-white rounded-lg overflow-hidden">
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            {/* Background grids */}
            <circle cx="500" cy="300" r="220" fill="none" stroke="#E5E2DC" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="500" cy="300" r="120" fill="none" stroke="#E5E2DC" strokeWidth="0.5" />

            {/* Central Core Connection Axis */}
            <line x1="500" y1="50" x2="500" y2="550" stroke="#E5E2DC" strokeWidth="1.5" strokeDasharray="4 4" />
            
            {/* Split Titles */}
            <text x="180" y="80" fill="#9CA3AF" className="text-[11px] font-bold" textAnchor="middle">TRADITIONAL HERITAGE CAMPS</text>
            <text x="820" y="80" fill="#E60000" className="text-[11px] font-bold" textAnchor="middle">FUTURISTIC EVOLUTIONISTS</text>

            {/* Center Core Hub */}
            <g transform="translate(500, 300)" className="pointer-events-none">
              <circle cx="0" cy="0" r="45" fill="#1A1A1A" />
              <circle cx="0" cy="0" r="55" fill="none" stroke="#E60000" strokeWidth="1" strokeDasharray="2 4" />
              <text x="0" y="-5" fill="#white" className="text-[9px] text-white font-bold" textAnchor="middle">LUCE</text>
              <text x="0" y="10" fill="#E60000" className="text-[8px] font-bold" textAnchor="middle">DEBUT 2026</text>
            </g>

            {/* Connective Link Lines to center and between nodes */}
            {Object.values(opinionNodes).map((node) => (
              <line 
                key={node.id} 
                x1={node.cx} 
                y1={node.cy} 
                x2="500" 
                y2="300" 
                stroke={node.side === "traditionalist" ? "#9CA3AF" : "#E60000"} 
                strokeWidth={hoveredNode === node.id ? 2 : 0.75} 
                strokeDasharray="2 3"
                opacity={hoveredNode && hoveredNode !== node.id ? 0.3 : 0.8}
                className="transition-all"
              />
            ))}

            {/* Side specific links */}
            <path d="M 240 160 L 160 280 L 220 400 Z" fill="none" stroke="#9CA3AF" strokeWidth="0.5" opacity="0.4" />
            <path d="M 760 160 L 840 280 L 780 400 Z" fill="none" stroke="#E60000" strokeWidth="0.5" opacity="0.4" />

            {/* Interactive Nodes */}
            {Object.values(opinionNodes).map((node) => (
              <g 
                key={node.id}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Outer halo */}
                <circle 
                  cx={node.cx} 
                  cy={node.cy} 
                  r="24" 
                  fill={node.side === "traditionalist" ? "rgba(156,163,175,0.05)" : "rgba(230,0,0,0.05)"}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Main Node Point */}
                <circle 
                  cx={node.cx} 
                  cy={node.cy} 
                  r="8" 
                  fill={node.side === "traditionalist" ? "#1A1A1A" : "#E60000"} 
                  className="transition-transform group-hover:scale-125"
                />

                {/* Pulsing indicator for hovered nodes */}
                {hoveredNode === node.id && (
                  <circle 
                    cx={node.cx} 
                    cy={node.cy} 
                    r="16" 
                    fill="none" 
                    stroke={node.side === "traditionalist" ? "#1A1A1A" : "#E60000"} 
                    strokeWidth="1" 
                    className="animate-ping" 
                  />
                )}

                {/* Node Text labels */}
                <text 
                  x={node.cx} 
                  y={node.cy - 16} 
                  fill="#1A1A1A" 
                  className="text-[9px] font-bold" 
                  textAnchor="middle"
                >
                  {node.title}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Dynamic Sentiment Details Sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#FAFAF8] border border-[#E5E2DC] rounded-lg p-5">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-widest block">
              OPINION NETWORK TELEMETRY
            </span>

            <AnimatePresence mode="wait">
              {hoveredNode ? (
                <motion.div 
                  key={hoveredNode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Perspective Group</span>
                    <p className={`text-xs font-bold uppercase mt-0.5 ${opinionNodes[hoveredNode as keyof typeof opinionNodes].side === "traditionalist" ? "text-[#1A1A1A]" : "text-[#E60000]"}`}>
                      {opinionNodes[hoveredNode as keyof typeof opinionNodes].side}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Focus Component</span>
                    <p className="text-sm font-bold text-[#1A1A1A]">{opinionNodes[hoveredNode as keyof typeof opinionNodes].title}</p>
                  </div>

                  <div className="bg-white border border-[#E5E2DC] rounded p-3 italic text-xs text-[#4B5563] leading-relaxed relative">
                    &ldquo;{opinionNodes[hoveredNode as keyof typeof opinionNodes].quote}&rdquo;
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Market Sentiment Index</span>
                    <p className="text-xs font-bold text-[#1A1A1A] mt-0.5">{opinionNodes[hoveredNode as keyof typeof opinionNodes].sentiment}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center py-12"
                >
                  <MessageSquare className="w-8 h-8 mx-auto text-[#9CA3AF]" />
                  <p className="text-xs text-[#9CA3AF] italic">
                    Hover over network nodes to extract demographic arguments, quotes, and concern parameters.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-[#E5E2DC] pt-4 mt-6 flex justify-between items-center text-[10px] text-[#9CA3AF]">
            <span>NODES: 6 INTEGRATED</span>
            <span>CLASH COEFFICIENT: 0.85</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. SECTION 4 VISUAL: LuxuryEcosystemVisual
   The modern luxury ecosystem comparison quadrant.
   ═══════════════════════════════════════════════════ */
export function LuxuryEcosystemVisual() {
  const [activeSegment, setActiveSegment] = useState<string>("dynamics");

  const segments = {
    dynamics: {
      title: "PERFORMANCE DYNAMICS",
      concept: "Beyond Traditional Top Speed",
      description: "True luxury is no longer just high speeds in a straight line. It is lateral traction, predictive slip controllers, zero drivetrain lag, and immediate, linear power delivery optimized per millisecond.",
      icon: Gauge,
      accent: "#E60000",
      blueprint_notes: "AXIAL ROTOR SYNC // YAW CONTROL"
    },
    intellect: {
      title: "DIGITAL INTELLECT",
      concept: "Predictive Software Control",
      description: "A luxury chassis is today a software-defined computer. Neural dynamic modules analyze steering angles and tires, automatically tailoring the vehicle behavior before physical slip occurs.",
      icon: Cpu,
      accent: "#1A1A1A",
      blueprint_notes: "NEURAL OS V2.0 // CALC LATENCY <1.2ms"
    },
    sustainability: {
      title: "SUSTAINABLE ENGINEERING",
      concept: "Conscious Prestige Status",
      description: "The modern elite consumer expects carbon-neutral credentials. Pure performance must be engineered with circular materials, solid-state stability, and high-efficiency direct recycling standards.",
      icon: Layers,
      accent: "#E60000",
      blueprint_notes: "SOLID STATE // 100% RECYCLED ALLOY"
    },
    sovereign: {
      title: "SOVEREIGN STATUS",
      concept: "Limited Aesthetic Prestige",
      description: "Exclusivity is redefined through scarce bespoke designs, proprietary digital access layers, custom telemetry vaults, and high-end artisanal coachbuilding combined with digital prestige.",
      icon: Compass,
      accent: "#1A1A1A",
      blueprint_notes: "EXCLUSIVITA MARANELLO // SCARED NUMBERS"
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden p-6 font-mono">
      {/* Visual Header */}
      <div className="border-b border-[#E5E2DC] pb-4 mb-6">
        <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
          Section 4 Visual // Nuovo Ecosistema
        </span>
        <h4 className="text-base font-black text-[#1A1A1A] mt-2 tracking-tight">
          THE MODERN LUXURY ECOSYSTEM REDEFINED
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Dynamic Detailed Display Card */}
        <div className="md:col-span-6 flex flex-col justify-between bg-white border border-[#E5E2DC] rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">
                SELECTED PILLAR ANALYTICS
              </span>
              <span className="text-[9px] text-[#9CA3AF]">
                {segments[activeSegment as keyof typeof segments].blueprint_notes}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: segments[activeSegment as keyof typeof segments].accent }}
              >
                {React.createElement(segments[activeSegment as keyof typeof segments].icon, { className: "w-5 h-5" })}
              </div>
              <div>
                <h5 className="text-base font-black text-[#1A1A1A] leading-tight">
                  {segments[activeSegment as keyof typeof segments].title}
                </h5>
                <p className="text-xs text-[#E60000] font-bold mt-0.5">
                  {segments[activeSegment as keyof typeof segments].concept}
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-[1.75] text-[#4B5563] pt-2">
              {segments[activeSegment as keyof typeof segments].description}
            </p>
          </div>

          <div className="border-t border-[#E5E2DC] pt-4 mt-6 flex justify-between items-center text-[10px] text-[#9CA3AF]">
            <span>CORE PILLAR REGISTER</span>
            <span>ECOSYSTEM INTEGRATED // AA+</span>
          </div>
        </div>

        {/* Quadrant Selection Grid */}
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          {Object.entries(segments).map(([key, item]) => {
            const isSelected = activeSegment === key;
            return (
              <div 
                key={key}
                onClick={() => setActiveSegment(key)}
                className={`cursor-pointer p-5 border rounded-lg flex flex-col justify-between transition-all duration-300 select-none ${
                  isSelected 
                    ? "bg-white border-[#E60000] shadow-sm scale-[1.01]" 
                    : "bg-[#FAFAF8] border-[#E5E2DC] hover:border-[#1A1A1A]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#E60000]/10 text-[#E60000]" : "bg-white border border-[#E5E2DC] text-[#9CA3AF]"
                    }`}
                  >
                    {React.createElement(item.icon, { className: "w-4 h-4" })}
                  </div>
                  {isSelected && (
                    <span className="text-[8px] uppercase tracking-wider text-[#E60000] bg-[#E60000]/5 px-1.5 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <h6 className="text-[11px] font-black tracking-tight text-[#1A1A1A]">
                    {item.title}
                  </h6>
                  <span className="text-[9px] text-[#9CA3AF] uppercase block mt-1 tracking-wider">
                    {item.concept}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   6. SECTION 5 VISUAL: AdaptationOSVisual
   Organizational transformation OS simulator dashboard.
   ═══════════════════════════════════════════════════ */
export function AdaptationOSVisual() {
  const [preserveHeritage, setPreserveHeritage] = useState<boolean>(true);
  const [accelerateSoftware, setAccelerateSoftware] = useState<boolean>(false);
  const [retrofitManufacturing, setRetrofitManufacturing] = useState<boolean>(false);
  const [educateTalent, setEducateTalent] = useState<boolean>(false);

  // Dynamic Strategic Relevance score calculations
  const calculateScore = () => {
    let score = 25; // baseline index
    if (preserveHeritage) score += 10;
    if (accelerateSoftware) score += 25;
    if (retrofitManufacturing) score += 20;
    if (educateTalent) score += 18;
    
    // Synergistic bonus for doing both heritage AND forward tech acceleration
    if (preserveHeritage && accelerateSoftware && retrofitManufacturing && educateTalent) {
      score = 98; // Peak synergy index
    }
    return score;
  };

  const score = calculateScore();

  const getScoreColor = () => {
    if (score < 40) return "#9CA3AF"; // Grey
    if (score < 75) return "#1A1A1A"; // Black
    return "#E60000"; // Ferrari Red
  };

  const getStatusText = () => {
    if (score < 40) return "HIGH RISK OF OBSOLESCENCE";
    if (score < 75) return "STRUCTURAL FRAGILITY";
    if (score === 98) return "PEAK TRANSCENDENT SYNERGY";
    return "FORWARD EVOLVED STATUS";
  };

  return (
    <div className="w-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-xl overflow-hidden p-6 font-mono">
      {/* Visual Header */}
      <div className="border-b border-[#E5E2DC] pb-4 mb-6">
        <span className="text-[10px] font-bold text-[#E60000] uppercase tracking-widest bg-[#E60000]/5 px-2.5 py-1 rounded">
          Section 5 Visual // Simula Strategia
        </span>
        <h4 className="text-base font-black text-[#1A1A1A] mt-2 tracking-tight">
          THE STRATEGIC TRANSFORMATION SYSTEM OS
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Toggle Switch Controls Column */}
        <div className="lg:col-span-7 bg-white border border-[#E5E2DC] rounded-lg p-5 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-widest block">
              ADAPTATION CONTROLS LEVERS
            </span>

            {/* Lever 1 */}
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#1A1A1A]">Preserve Heritage Core DNA</span>
                <p className="text-[9px] text-[#9CA3AF] uppercase">Protect brand prestige and craftsmanship values</p>
              </div>
              <button 
                onClick={() => setPreserveHeritage(!preserveHeritage)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  preserveHeritage ? "bg-[#1A1A1A]" : "bg-[#E5E2DC]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  preserveHeritage ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Lever 2 */}
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#1A1A1A]">Accelerate Software R&D</span>
                <p className="text-[9px] text-[#9CA3AF] uppercase">Develop proprietary OS, algorithms, dynamics</p>
              </div>
              <button 
                onClick={() => setAccelerateSoftware(!accelerateSoftware)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  accelerateSoftware ? "bg-[#E60000]" : "bg-[#E5E2DC]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  accelerateSoftware ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Lever 3 */}
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#1A1A1A]">Retrofit E-Building Assembly</span>
                <p className="text-[9px] text-[#9CA3AF] uppercase">Configure factories for modular hardware integration</p>
              </div>
              <button 
                onClick={() => setRetrofitManufacturing(!retrofitManufacturing)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  retrofitManufacturing ? "bg-[#E60000]" : "bg-[#E5E2DC]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  retrofitManufacturing ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Lever 4 */}
            <div className="flex justify-between items-center border-b border-[#E5E2DC] pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#1A1A1A]">Re-train Artisanal Talent</span>
                <p className="text-[9px] text-[#9CA3AF] uppercase">Educate engineers on code, circuitry, and cells</p>
              </div>
              <button 
                onClick={() => setEducateTalent(!educateTalent)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  educateTalent ? "bg-[#1A1A1A]" : "bg-[#E5E2DC]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  educateTalent ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              setPreserveHeritage(true);
              setAccelerateSoftware(true);
              setRetrofitManufacturing(true);
              setEducateTalent(true);
            }}
            className="w-full h-10 border border-[#E5E2DC] hover:border-[#1A1A1A] bg-white rounded flex items-center justify-center gap-2 text-xs font-bold text-[#1A1A1A] transition-all hover:gap-3"
          >
            <span>Activate Total Integration Framework</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calculated Simulation Display Column */}
        <div className="lg:col-span-5 bg-[#FAFAF8] border border-[#E5E2DC] rounded-lg p-5 flex flex-col justify-between items-stretch">
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-widest block">
              TRANSFORMATION OUTCOME OS
            </span>

            {/* Massive Circular Score Dashboard */}
            <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center bg-white border border-[#E5E2DC] rounded-full shadow-sm">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#E5E2DC" strokeWidth="2" />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  fill="none" 
                  stroke={getScoreColor()} 
                  strokeWidth="4" 
                  strokeDasharray="276"
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 276 - (276 * score) / 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase leading-none">Index Rating</span>
              <span className="text-4xl font-black mt-1 leading-none tracking-tight" style={{ color: getScoreColor() }}>
                {score}%
              </span>
            </div>

            {/* Status and Summary Assessment */}
            <div className="text-center space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">Strategic Diagnostic</span>
              <p className="text-xs font-black text-[#1A1A1A] leading-tight uppercase tracking-tight">{getStatusText()}</p>
            </div>
          </div>

          <div className="border-t border-[#E5E2DC] pt-4 mt-6 text-[10px] text-[#9CA3AF] space-y-2 leading-relaxed">
            {score < 40 && (
              <p className="text-red-500 font-bold">
                ⚠️ Legacy preservation alone risks competitive displacement by software-first hypercar platforms.
              </p>
            )}
            {score >= 40 && score < 75 && (
              <p className="text-[#1A1A1A]">
                ✓ Forward action initialized. However, fragmented technology layers limit final dynamic efficiency bounds.
              </p>
            )}
            {score >= 75 && score < 98 && (
              <p className="text-emerald-600">
                ✓ Strong adaptation capability. Add all transformation vectors to trigger Maranello Synergy bonus.
              </p>
            )}
            {score === 98 && (
              <p className="text-[#E60000] font-bold">
                ★ PERFECT HARMONY: The heritage remains legendary, while software-defined engineering establishes brand sovereignty forever.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
