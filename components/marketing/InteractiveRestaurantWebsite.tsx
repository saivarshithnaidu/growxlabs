"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Database, 
  ArrowRightLeft, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle,
  DatabaseZap,
  DollarSign,
  Play,
  RotateCcw,
  Activity,
  Terminal,
  ArrowRight,
  Smartphone,
  Globe
} from "lucide-react";

interface NodeDetail {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  customer_order: {
    title: "Customer Order Submission",
    category: "Intake Layer",
    description: "Prospect initiates a $100 order from their mobile phone or desktop browser.",
    metrics: "Cart Value: $100.00 // Input: HTTP POST"
  },
  app_entry: {
    title: "Third-Party Aggregator App Intake",
    category: "Aggregator Pipeline (Uber/DoorDash)",
    description: "Order is routed through aggregator services, locking the user in a crowded directory alongside competitors.",
    metrics: "Platform: Aggregator Marketplace"
  },
  commission_cut: {
    title: "30% Commission Slashed",
    category: "Aggregator Pipeline (Uber/DoorDash)",
    description: "Third-party platform cuts off an immediate 30% toll, draining key margins from the transaction.",
    metrics: "Commission Leak: -$30.00 // Fee: 30% flat"
  },
  data_silo: {
    title: "Customer Data Siloed & Blocked",
    category: "Aggregator Pipeline (Uber/DoorDash)",
    description: "The aggregator hides customer phone numbers, emails, and diet insights. The restaurant receives zero retargeting database value.",
    metrics: "Data Logging: BLOCKED // Re-marketing: IMPOSSIBLE"
  },
  payout_shrink: {
    title: "Squeezed $70 Restaurant Payout",
    category: "Aggregator Pipeline (Uber/DoorDash)",
    description: "The restaurant receives the remainder, severely constraining food costs, labor space, and net profitability.",
    metrics: "Final Revenue Payout: $70.00 // Margin: Squeezed"
  },
  direct_web: {
    title: "GrowXLabs Direct Web Platform",
    category: "Direct Pipeline (Own Site)",
    description: "Order processed natively on the restaurant's own high-speed, custom-domain direct ordering site.",
    metrics: "Platform: Native Custom Next.js Site"
  },
  zero_commission: {
    title: "0% Commission Margin Retention",
    category: "Direct Pipeline (Own Site)",
    description: "Direct transactions bypass third-party platforms entirely. Payment gateway charges direct Stripe/Adyen transaction rates.",
    metrics: "Commission Leak: $0.00 // Retained Margin: 100%"
  },
  crm_database: {
    title: "Native CRM Database Intake",
    category: "Direct Pipeline (Own Site)",
    description: "Direct guest phone, email, allergy tags, and dining patterns are fully logged for automated marketing.",
    metrics: "Sync: Native CRM Vault // Profile status: CREATED"
  },
  payout_full: {
    title: "Full $100 Payout Settled",
    category: "Direct Pipeline (Own Site)",
    description: "The full order subtotal is deposited securely into the restaurant's business bank account within 24 hours.",
    metrics: "Final Revenue Payout: $100.00 // Margin: MAXIMIZED"
  },
  intake_split: {
    title: "Dual-Path Transaction Split",
    category: "Intake Routing Layer",
    description: "The incoming order propagates in parallel along two paths: the traditional third-party aggregator trap and the direct digital pipeline.",
    metrics: "Routing channels: 2 active // Direction: Downward split"
  },
  level_1: {
    title: "Client Order Intake Interfaces",
    category: "Order Intake Layer Comparison",
    description: "Aggregation apps lock restaurants into high-competition marketplace indexes. Direct custom sites serve clients natively on custom domains with high retention.",
    metrics: "Direct load: 12ms // Marketplace lag: Standard"
  },
  level_2: {
    title: "30% Commission Cut vs Direct Margin",
    category: "Platform Commission Gate Comparison",
    description: "Third-party platform slashes an immediate 30% toll ($30.00). Direct ordering keeps 100% of subtotal with 0% platform commission.",
    metrics: "Direct profit saved: $30.00 // Aggregator leakage: 30% flat"
  },
  level_3: {
    title: "Siloed Data vs Native CRM Capture",
    category: "Database & Retargeting Comparison",
    description: "Third-party networks block customer information. Direct systems capture phone, email, and preferences to build an automated retargeting database.",
    metrics: "Aggregator: SILOED // Direct: CRM Profile Synced"
  },
  level_4: {
    title: "Squeezed $70 Payout vs Full $100 payout",
    category: "Financial Settlement Comparison",
    description: "The restaurant receives the leftovers of aggregator transactions ($70). Direct sites deposit the full transaction subtotal ($100.00).",
    metrics: "Aggregator: $70 payout // Direct: $100 payout"
  }
};

export function InteractiveRestaurantWebsite() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [payoutLeft, setPayoutLeft] = useState<number>(100);
  const [payoutRight, setPayoutRight] = useState<number>(100);

  const simulationSteps = [
    "customer_order",
    "intake_split", // visual step
    "level_1",      // entry step (app_entry & direct_web)
    "level_2",      // commission step (commission_cut & zero_commission)
    "level_3",      // data step (data_silo & crm_database)
    "level_4"       // payout step (payout_shrink & payout_full)
  ];

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setTimeout(() => {
      if (activeStep < simulationSteps.length - 1) {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        setHoveredNode(simulationSteps[nextStep]);
        
        // Dynamically adjust payout numbers based on simulation level
        if (nextStep >= 3) { // level_2 active (step index 3)
          setPayoutLeft(70);
          setPayoutRight(100);
        } else {
          setPayoutLeft(100);
          setPayoutRight(100);
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
    setPayoutLeft(100);
    setPayoutRight(100);
  };


  const stopSimulation = () => {
    setIsSimulating(false);
    setActiveStep(-1);
    setHoveredNode(null);
    setPayoutLeft(100);
    setPayoutRight(100);
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
      if (nodeId === "customer_order" && activeStep >= 0) return true;
      if ((nodeId === "app_entry" || nodeId === "direct_web") && activeStep >= 2) return true;
      if ((nodeId === "commission_cut" || nodeId === "zero_commission") && activeStep >= 3) return true;
      if ((nodeId === "data_silo" || nodeId === "crm_database") && activeStep >= 4) return true;
      if ((nodeId === "payout_shrink" || nodeId === "payout_full") && activeStep >= 5) return true;
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
              Commission vs Direct Profit Analyzer
            </h4>
          </div>
          <p className="text-[#6B7280] text-[12px] mt-1 font-sans">
            Compare transaction value leakages, customer retention pipelines, and margins in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <button
              onClick={startSimulation}
              className="bg-[#355CFF] hover:bg-[#2A4AD4] text-white font-mono text-[11px] font-bold px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATE $100 ORDER FLOW</span>
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
              <pattern id="website-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,26,26,0.02)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="860" fill="url(#website-grid)" />

            {/* Scheme Title Text */}
            <text x="50" y="45" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="bold" letterSpacing="0.05em">
              DUAL PATH commission vs direct TRANSACTION BLUEPRINT
            </text>
            <text x="50" y="70" fill="#6B7280" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">
              COMMISSION LEAKAGE COMPARISON CORE V2.1
            </text>

            <text x="180" y="130" fill="#EF4444" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.15em">THIRD-PARTY PLATFORM TRAP</text>
            <text x="650" y="130" fill="#10B981" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.15em">GROWXLABS DIRECT PLATFORM</text>

            <line x1="50" y1="140" x2="430" y2="140" stroke="#EF4444" strokeWidth="1.5" />
            <line x1="570" y1="140" x2="950" y2="140" stroke="#10B981" strokeWidth="1.5" />

            {/* ─── CONNECTION PATHS (SVG Lines) ─── */}
            {/* Customer Order (x=500, y=180) -> App Intake Split Left */}
            <path
              d="M 450,210 C 280,210 280,260 280,280"
              stroke={isLevelActive("level_1") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_1") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_1") ? "url(#web-arrow-blue)" : "url(#web-arrow-gray)"}
            />

            {/* Customer Order (x=500, y=180) -> Direct Intake Split Right */}
            <path
              d="M 550,210 C 720,210 720,260 720,280"
              stroke={isLevelActive("level_1") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_1") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_1") ? "url(#web-arrow-blue)" : "url(#web-arrow-gray)"}
            />

            {/* Left Path Connectors */}
            {/* Entry -> Commission */}
            <path
              d="M 280,360 L 280,410"
              stroke={isLevelActive("level_2") ? "#EF4444" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_2") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_2") ? "url(#web-arrow-red)" : "url(#web-arrow-gray)"}
            />
            {/* Commission -> Data */}
            <path
              d="M 280,490 L 280,540"
              stroke={isLevelActive("level_3") ? "#EF4444" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_3") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_3") ? "url(#web-arrow-red)" : "url(#web-arrow-gray)"}
            />
            {/* Data -> Payout */}
            <path
              d="M 280,620 L 280,670"
              stroke={isLevelActive("level_4") ? "#EF4444" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_4") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_4") ? "url(#web-arrow-red)" : "url(#web-arrow-gray)"}
            />

            {/* Right Path Connectors */}
            {/* Entry -> Commission */}
            <path
              d="M 720,360 L 720,410"
              stroke={isLevelActive("level_2") ? "#10B981" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_2") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_2") ? "url(#web-arrow-green)" : "url(#web-arrow-gray)"}
            />
            {/* Commission -> Data */}
            <path
              d="M 720,490 L 720,540"
              stroke={isLevelActive("level_3") ? "#10B981" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_3") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_3") ? "url(#web-arrow-green)" : "url(#web-arrow-gray)"}
            />
            {/* Data -> Payout */}
            <path
              d="M 720,620 L 720,670"
              stroke={isLevelActive("level_4") ? "#10B981" : "#9CA3AF"}
              strokeWidth={isLevelActive("level_4") ? "2" : "1.2"}
              markerEnd={isLevelActive("level_4") ? "url(#web-arrow-green)" : "url(#web-arrow-gray)"}
            />

            {/* Markers Definitions for Arrows */}
            <defs>
              <marker id="web-arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9CA3AF" />
              </marker>
              <marker id="web-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#355CFF" />
              </marker>
              <marker id="web-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EF4444" />
              </marker>
              <marker id="web-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
              </marker>
            </defs>

            {/* ─── INTERACTIVE NODES ─── */}

            {/* Master Customer Order Node */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("customer_order")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="420" y="170" width="160" height="70" fill={isNodeActive("customer_order") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("customer_order") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("customer_order") ? "1.8" : "1.2"} rx="8" />
              <text x="500" y="200" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">INBOUND GUEST ORDER</text>
              <text x="500" y="218" fill="#355CFF" fontFamily="monospace" fontSize="12" fontWeight="black" textAnchor="middle">$100.00</text>
            </g>

            {/* LEFT COLUMN: APP PATH */}
            {/* Aggregator entry */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("app_entry")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="280" width="200" height="80" fill={isNodeActive("app_entry") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("app_entry") ? "#EF4444" : "#9CA3AF"} strokeWidth={isNodeActive("app_entry") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="315" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">AGGREGATOR APP ENTRY</text>
              <text x="280" y="335" fill="#EF4444" fontFamily="monospace" fontSize="9.5" textAnchor="middle">(Third-Party Directory)</text>
            </g>

            {/* Commission Leak */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("commission_cut")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="410" width="200" height="80" fill={isNodeActive("commission_cut") ? "#FEF2F2" : "#FFFFFF"} stroke={isNodeActive("commission_cut") ? "#EF4444" : "#9CA3AF"} strokeWidth={isNodeActive("commission_cut") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="445" fill="#EF4444" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">30% COMMISSION CUT</text>
              <text x="280" y="465" fill="#EF4444" fontFamily="monospace" fontSize="12" fontWeight="black" textAnchor="middle">-$30.00 LEAKED</text>
            </g>

            {/* Data silo */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("data_silo")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="540" width="200" height="80" fill={isNodeActive("data_silo") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("data_silo") ? "#EF4444" : "#9CA3AF"} strokeWidth={isNodeActive("data_silo") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="575" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">CUSTOMER DATA SILOED</text>
              <text x="280" y="595" fill="#6B7280" fontFamily="monospace" fontSize="9.5" textAnchor="middle">(Zero Phone/Email Logging)</text>
            </g>

            {/* Payout Shrink */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("payout_shrink")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="180" y="670" width="200" height="80" fill={isNodeActive("payout_shrink") ? "#FEF2F2" : "#FFFFFF"} stroke={isNodeActive("payout_shrink") ? "#EF4444" : "#9CA3AF"} strokeWidth={isNodeActive("payout_shrink") ? "1.8" : "1.2"} rx="8" />
              <text x="280" y="700" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11.5" fontWeight="bold" textAnchor="middle">RESTAURANT PAYOUT</text>
              <text x="280" y="725" fill="#EF4444" fontFamily="monospace" fontSize="18" fontWeight="black" textAnchor="middle">
                ${payoutLeft.toFixed(2)}
              </text>
              <text x="280" y="740" fill="#6B7280" fontFamily="monospace" fontSize="7.5" textAnchor="middle">(Weekly deposits)</text>
            </g>

            {/* RIGHT COLUMN: NATIVE DIRECT WEB PATH */}
            {/* Direct Web intake */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("direct_web")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="280" width="200" height="80" fill={isNodeActive("direct_web") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("direct_web") ? "#10B981" : "#9CA3AF"} strokeWidth={isNodeActive("direct_web") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="315" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">GROWXLABS DIRECT WEB</text>
              <text x="720" y="335" fill="#10B981" fontFamily="monospace" fontSize="9.5" textAnchor="middle">(Custom Domain Portal)</text>
            </g>

            {/* Zero commission */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("zero_commission")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="410" width="200" height="80" fill={isNodeActive("zero_commission") ? "#ECFDF5" : "#FFFFFF"} stroke={isNodeActive("zero_commission") ? "#10B981" : "#9CA3AF"} strokeWidth={isNodeActive("zero_commission") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="445" fill="#10B981" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">0% DIRECT COMMISSION</text>
              <text x="720" y="465" fill="#10B981" fontFamily="monospace" fontSize="12" fontWeight="black" textAnchor="middle">$0.00 LEAKAGE</text>
            </g>

            {/* Native CRM Database */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("crm_database")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="540" width="200" height="80" fill={isNodeActive("crm_database") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("crm_database") ? "#10B981" : "#9CA3AF"} strokeWidth={isNodeActive("crm_database") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="575" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">CRM DATABASE CAPTURE</text>
              <text x="720" y="595" fill="#10B981" fontFamily="monospace" fontSize="9.5" textAnchor="middle">(Logs Phone & Diet Pref)</text>
            </g>

            {/* Payout Full */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("payout_full")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="620" y="670" width="200" height="80" fill={isNodeActive("payout_full") ? "#ECFDF5" : "#FFFFFF"} stroke={isNodeActive("payout_full") ? "#10B981" : "#9CA3AF"} strokeWidth={isNodeActive("payout_full") ? "1.8" : "1.2"} rx="8" />
              <text x="720" y="700" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11.5" fontWeight="bold" textAnchor="middle">RESTAURANT PAYOUT</text>
              <text x="720" y="725" fill="#10B981" fontFamily="monospace" fontSize="18" fontWeight="black" textAnchor="middle">
                ${payoutRight.toFixed(2)}
              </text>
              <text x="720" y="740" fill="#6B7280" fontFamily="monospace" fontSize="7.5" textAnchor="middle">(Instant daily payouts)</text>
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
                <ShoppingBag className="w-8 h-8 text-[#9CA3AF] mb-2.5 animate-pulse" />
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
              <span>COMMISSION SAVED:</span>
              <span className="text-[#10B981] font-semibold">$30.00 PER $100</span>
            </div>
            <div className="flex justify-between">
              <span>RECURRING VALUE INCRM:</span>
              <span className="text-[#355CFF] font-semibold">4.8x DATABASE CLUTCH</span>
            </div>
            <div className="flex justify-between">
              <span>BANK DEPOSIT SYNC:</span>
              <span className="text-[#10B981] font-semibold">DAILY STRIPE NET</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
