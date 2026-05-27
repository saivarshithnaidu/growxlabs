"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Utensils, 
  MessageSquare, 
  Star, 
  AlertTriangle, 
  Coins, 
  Calendar, 
  Bell, 
  PhoneCall, 
  Clock, 
  Gift, 
  Heart,
  Play,
  RotateCcw,
  Activity,
  Terminal,
  ArrowRight
} from "lucide-react";

interface NodeDetail {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  pos_transaction: {
    title: "Point-of-Sale Transaction Sync",
    category: "Intake Layer",
    description: "POS bridge (Toast, NCR, or Custom) captures the receipt total, seat duration, and contact parameters in real-time.",
    metrics: "API Status: CONNECTED // Sync latency: 150ms"
  },
  feedback_hook: {
    title: "10-Min Post-Dining Feedback Hook",
    category: "Intake Layer",
    description: "Automatic text check-in dispatched exactly 10 minutes after table settlement, requesting a simple 1-5 rating.",
    metrics: "Response rate: 64.8% // Dispatched: SMS & WhatsApp"
  },
  rating_good: {
    title: "High Rating (4-5 Stars)",
    category: "Decision Matrix",
    description: "Positive customer sentiment detected. Directs user to loyalty enrollment systems and social reviews.",
    metrics: "Probability: 84.2% // Trigger: AUTO-LOYALTY"
  },
  rating_bad: {
    title: "Sub-Optimal Rating (1-3 Stars)",
    category: "Decision Matrix",
    description: "Critical review registered. Bypasses marketing loops entirely to trigger instant operational damage-control.",
    metrics: "Probability: 15.8% // Trigger: CRITICAL-RECOVERY"
  },
  loyalty_vault: {
    title: "Loyalty Vault Enrollment (+10%)",
    category: "Loyalty Pipeline",
    description: "Diner is registered inside the CRM vault. Instantly awards 10% loyalty coins redeemable on their next booking.",
    metrics: "Vault State: SUCCESS // Active members: 12,480"
  },
  booking_loop: {
    title: "Automated Re-booking Calendar",
    category: "Loyalty Pipeline",
    description: "Dispatches contextual invitations for special culinary events, chef pairings, and reservation suggestions.",
    metrics: "Re-booking rate: 24.2% // Average cycle: 18 days"
  },
  admin_escalation: {
    title: "VIP Incident Alert to Operations",
    category: "Incident Recovery",
    description: "Sends an immediate SMS alert to floor managers detailing the table number, server name, and complaint text.",
    metrics: "Alert priority: P1 URGENT // SLA dispatch: <2s"
  },
  recovery_call: {
    title: "Manager Personal Care Outreach",
    category: "Incident Recovery",
    description: "Specialist makes direct manual phone call or custom chat outreach to resolve complaints and offer courtesy compensation.",
    metrics: "Resolution rate: 92.4% // Outreach lag: <5 mins"
  },
  idle_interval: {
    title: "30-Day Guest Inactivity Check",
    category: "Drip Re-engagement",
    description: "Chronometer loop monitoring guest visits. Triggers when no active transactions occur for exactly 30 days.",
    metrics: "State: COUNTDOWN // Monitoring: 4,500 profiles"
  },
  miss_you: {
    title: "\"We Miss You\" Incentive Offer",
    category: "Drip Re-engagement",
    description: "Sends an automated text invitation from the head chef containing a personalized high-value dining voucher.",
    metrics: "Coupon conversion: 21.8% // Open rate: 97.4%"
  },
  return_visit: {
    title: "Diner Retained & Reconciled",
    category: "Success Settlement",
    description: "Guest dines again. POS scans the unique coupon code, completes transaction, and resets retention chronometers.",
    metrics: "ROI tracking: 4.8x direct margin // Status: ACTIVE"
  }
};

export function InteractiveRestaurantRetention() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [simulationType, setSimulationType] = useState<"loyalty" | "recovery" | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const loyaltySteps = [
    "pos_transaction",
    "feedback_hook",
    "rating_good",
    "loyalty_vault",
    "booking_loop",
    "idle_interval",
    "return_visit"
  ];

  const recoverySteps = [
    "pos_transaction",
    "feedback_hook",
    "rating_bad",
    "admin_escalation",
    "recovery_call",
    "idle_interval",
    "miss_you",
    "return_visit"
  ];

  const currentSteps = simulationType === "loyalty" ? loyaltySteps : recoverySteps;

  useEffect(() => {
    if (!isSimulating || !simulationType) return;

    const interval = setTimeout(() => {
      if (activeStep < currentSteps.length - 1) {
        setActiveStep((prev) => prev + 1);
        setHoveredNode(currentSteps[activeStep + 1]);
      } else {
        setIsSimulating(false);
        setActiveStep(-1);
        setSimulationType(null);
        setHoveredNode(null);
      }
    }, 1200);

    return () => clearTimeout(interval);
  }, [isSimulating, activeStep, simulationType]);

  const startSimulation = (type: "loyalty" | "recovery") => {
    setIsSimulating(true);
    setSimulationType(type);
    setActiveStep(0);
    setHoveredNode(type === "loyalty" ? loyaltySteps[0] : recoverySteps[0]);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setActiveStep(-1);
    setSimulationType(null);
    setHoveredNode(null);
  };

  const isNodeActive = (nodeId: string) => {
    if (isSimulating && simulationType) {
      const stepIdx = currentSteps.indexOf(nodeId);
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
              Retention Loop Simulator
            </h4>
          </div>
          <p className="text-[#6B7280] text-[12px] mt-1 font-sans">
            Interactive trace engine showing automated loyal customer journeys versus critical incident recovery sequences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isSimulating ? (
            <>
              <button
                onClick={() => startSimulation("loyalty")}
                className="bg-[#355CFF] hover:bg-[#2A4AD4] text-white font-mono text-[11px] font-bold px-3.5 py-2 rounded-md shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>TRACE LOYALTY FUNNEL</span>
              </button>
              <button
                onClick={() => startSimulation("recovery")}
                className="bg-[#355CFF]/10 text-[#355CFF] border border-[#355CFF]/20 hover:bg-[#355CFF]/20 font-mono text-[11px] font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>TRACE RECOVERY FUNNEL</span>
              </button>
            </>
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
              <pattern id="retention-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,26,26,0.02)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="860" fill="url(#retention-grid)" />

            {/* Scheme Title Text */}
            <text x="50" y="45" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="bold" letterSpacing="0.05em">
              RESTAURANT CUSTOMER RETENTION LIFECYCLE BLUEPRINT
            </text>
            <text x="50" y="70" fill="#6B7280" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">
              CRM LOOPS & RECONCILIATION ENGINE V1.0
            </text>

            {/* ─── CONNECTION PATHS (SVG Lines) ─── */}
            {/* POS Sync (x=160, y=200) -> Feedback Hook (x=380, y=200) */}
            <path
              d="M 240,200 L 320,200"
              stroke={isNodeActive("feedback_hook") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("feedback_hook") ? "2" : "1.2"}
              markerEnd={isNodeActive("feedback_hook") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Feedback Hook -> Good Rating (Upwards) */}
            <path
              d="M 400,160 L 400,130 C 400,110 490,110 520,110"
              stroke={isNodeActive("rating_good") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("rating_good") ? "2" : "1.2"}
              markerEnd={isNodeActive("rating_good") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Feedback Hook -> Bad Rating (Downwards) */}
            <path
              d="M 400,240 L 400,280 C 400,300 490,300 520,300"
              stroke={isNodeActive("rating_bad") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("rating_bad") ? "2" : "1.2"}
              markerEnd={isNodeActive("rating_bad") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Good Rating -> Loyalty Vault */}
            <path
              d="M 640,110 L 700,110"
              stroke={isNodeActive("loyalty_vault") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("loyalty_vault") ? "2" : "1.2"}
              markerEnd={isNodeActive("loyalty_vault") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Loyalty Vault -> Booking Loop */}
            <path
              d="M 820,110 L 880,110"
              stroke={isNodeActive("booking_loop") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("booking_loop") ? "2" : "1.2"}
              markerEnd={isNodeActive("booking_loop") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Bad Rating -> Admin Escalation */}
            <path
              d="M 640,300 L 700,300"
              stroke={isNodeActive("admin_escalation") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("admin_escalation") ? "2" : "1.2"}
              markerEnd={isNodeActive("admin_escalation") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Admin Escalation -> Recovery Care Call */}
            <path
              d="M 820,300 L 880,300"
              stroke={isNodeActive("recovery_call") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("recovery_call") ? "2" : "1.2"}
              markerEnd={isNodeActive("recovery_call") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Booking Loop (x=940, y=110) -> Idle Interval Check (x=500, y=490) */}
            <path
              d="M 940,150 L 940,430 C 940,450 630,450 560,450"
              stroke={isNodeActive("idle_interval") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("idle_interval") ? "2" : "1.2"}
              markerEnd={isNodeActive("idle_interval") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Recovery Outreach (x=940, y=300) -> Idle Interval Check */}
            <path
              d="M 940,340 L 940,410 C 940,450 630,450 560,450"
              stroke={isNodeActive("idle_interval") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("idle_interval") ? "2" : "1.2"}
              markerEnd={isNodeActive("idle_interval") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Idle Interval Check -> Miss You Offer */}
            <path
              d="M 500,530 L 500,600"
              stroke={isNodeActive("miss_you") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("miss_you") ? "2" : "1.2"}
              markerEnd={isNodeActive("miss_you") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Miss You Offer (x=500, y=640) -> Return Visit (x=500, y=740) */}
            <path
              d="M 500,680 L 500,740"
              stroke={isNodeActive("return_visit") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("return_visit") ? "2" : "1.2"}
              markerEnd={isNodeActive("return_visit") ? "url(#retention-arrow-blue)" : "url(#retention-arrow-gray)"}
            />

            {/* Inactivity check direct path bypass to return visit */}
            <path
              d="M 440,490 C 350,490 350,780 440,780"
              stroke={isNodeActive("return_visit") ? "#355CFF" : "#9CA3AF"}
              strokeWidth={isNodeActive("return_visit") ? "2" : "1.2"}
              strokeDasharray="4 4"
            />

            {/* Markers Definitions for Arrows */}
            <defs>
              <marker id="retention-arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9CA3AF" />
              </marker>
              <marker id="retention-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#355CFF" />
              </marker>
            </defs>

            {/* ─── INTERACTIVE NODES (GROUPS WITH HOVER HANDLERS) ─── */}

            {/* POS Transaction Intake */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("pos_transaction")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="80" y="160" width="160" height="80" fill={isNodeActive("pos_transaction") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("pos_transaction") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("pos_transaction") ? "1.8" : "1.2"} rx="8" />
              <text x="160" y="195" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">GUEST DINING</text>
              <text x="160" y="210" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">POS TRANSACTION</text>
              <text x="160" y="228" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Toast POS Capture)</text>
            </g>

            {/* Feedback Hook */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("feedback_hook")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="320" y="160" width="160" height="80" fill={isNodeActive("feedback_hook") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("feedback_hook") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("feedback_hook") ? "1.8" : "1.2"} rx="8" />
              <text x="400" y="195" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">FEEDBACK HOOK</text>
              <text x="400" y="210" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(SMS / WhatsApp poll)</text>
              <text x="400" y="228" fill="#355CFF" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">10 MIN DELAY</text>
            </g>

            {/* Good Rating Option */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("rating_good")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="520" y="70" width="120" height="80" fill={isNodeActive("rating_good") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("rating_good") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("rating_good") ? "1.8" : "1.2"} rx="8" />
              <text x="580" y="105" fill="#10B981" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">RATING: 4-5 STAR</text>
              <text x="580" y="120" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Excellent Experience)</text>
            </g>

            {/* Bad Rating Option */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("rating_bad")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="520" y="260" width="120" height="80" fill={isNodeActive("rating_bad") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("rating_bad") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("rating_bad") ? "1.8" : "1.2"} rx="8" />
              <text x="580" y="295" fill="#EF4444" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">RATING: 1-3 STAR</text>
              <text x="580" y="310" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Sub-Optimal Experience)</text>
            </g>

            {/* Loyalty Vault */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("loyalty_vault")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="700" y="70" width="120" height="80" fill={isNodeActive("loyalty_vault") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("loyalty_vault") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("loyalty_vault") ? "1.8" : "1.2"} rx="8" />
              <text x="760" y="105" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">LOYALTY VAULT</text>
              <text x="760" y="120" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Earn +10% rewards)</text>
            </g>

            {/* Booking Loop */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("booking_loop")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="880" y="70" width="80" height="80" fill={isNodeActive("booking_loop") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("booking_loop") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("booking_loop") ? "1.8" : "1.2"} rx="8" />
              <text x="920" y="105" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">RE-BOOKING</text>
              <text x="920" y="120" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">LOOP</text>
            </g>

            {/* Admin Escalation */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("admin_escalation")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="700" y="260" width="120" height="80" fill={isNodeActive("admin_escalation") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("admin_escalation") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("admin_escalation") ? "1.8" : "1.2"} rx="8" />
              <text x="760" y="295" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">VIP ESCALATION</text>
              <text x="760" y="310" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(SMS floor alert)</text>
            </g>

            {/* Recovery Outreach care-call */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("recovery_call")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="880" y="260" width="80" height="80" fill={isNodeActive("recovery_call") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("recovery_call") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("recovery_call") ? "1.8" : "1.2"} rx="8" />
              <text x="920" y="295" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">CARE CALL</text>
              <text x="920" y="310" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Personalized)</text>
            </g>

            {/* Idle Interval Check */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("idle_interval")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="440" y="410" width="120" height="80" fill={isNodeActive("idle_interval") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("idle_interval") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("idle_interval") ? "1.8" : "1.2"} rx="8" />
              <text x="500" y="445" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">30-DAY INACTIVE</text>
              <text x="500" y="460" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="10.5" fontWeight="bold" textAnchor="middle">INTERVAL CHECK</text>
            </g>

            {/* "We Miss You" offer */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("miss_you")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="420" y="600" width="160" height="80" fill={isNodeActive("miss_you") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("miss_you") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("miss_you") ? "1.8" : "1.2"} rx="8" />
              <text x="500" y="635" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">"WE MISS YOU" OFFER</text>
              <text x="500" y="650" fill="#6B7280" fontFamily="monospace" fontSize="8.5" textAnchor="middle">(Dynamic App Voucher)</text>
            </g>

            {/* Return Visit settlement */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode("return_visit")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="420" y="740" width="160" height="80" fill={isNodeActive("return_visit") ? "#FAF9F6" : "#FFFFFF"} stroke={isNodeActive("return_visit") ? "#355CFF" : "#9CA3AF"} strokeWidth={isNodeActive("return_visit") ? "1.8" : "1.2"} rx="8" />
              <text x="500" y="775" fill="#355CFF" fontFamily="system-ui, sans-serif" fontSize="11.5" fontWeight="black" textAnchor="middle">RETURNING DINER</text>
              <text x="500" y="790" fill="#1A1A1A" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="bold" textAnchor="middle">SETTLEMENT SUCCESS</text>
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
                <Utensils className="w-8 h-8 text-[#9CA3AF] mb-2.5 animate-pulse" />
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
              <span>POS INTEGRATION:</span>
              <span className="text-[#10B981] font-semibold">TOAST POS ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>CHRONOMETER DRIPS:</span>
              <span className="text-[#1A1A1A]">4,210 TRACKED</span>
            </div>
            <div className="flex justify-between">
              <span>RETENTION AVERAGE:</span>
              <span className="text-[#355CFF] font-semibold">+28.5% RECURRING</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
