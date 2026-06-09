"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Node {
  id: string;
  cx: number;
  cy: number;
  label: string;
  desc: string;
}

export function PipelineSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const column0: Node[] = [
    { id: "A0", cx: 15, cy: 20, label: "Design", desc: "Crafting modern, premium user interfaces that convert" },
    { id: "A1", cx: 15, cy: 40, label: "Code", desc: "Clean, high-performance web applications built to scale" },
    { id: "A2", cx: 15, cy: 60, label: "Data", desc: "Organizing your business information for clear analytics" },
    { id: "A3", cx: 15, cy: 80, label: "API", desc: "Seamless database and third-party software integrations" },
  ];

  const column1: Node[] = [
    { id: "B0", cx: 42, cy: 30, label: "Automation", desc: "Automating repetitive work to save hours of manual labor" },
    { id: "B1", cx: 42, cy: 50, label: "AI Hub", desc: "Adding intelligent bots and smart text processing to workflows" },
    { id: "B2", cx: 42, cy: 70, label: "CRM Sync", desc: "Syncing client data across your tools in real-time" },
  ];

  const column2: Node[] = [
    { id: "C0", cx: 68, cy: 50, label: "GrowX Studio", desc: "Engineered systems shipped for your business" },
  ];

  const column3: Node[] = [
    { id: "D0", cx: 94, cy: 30, label: "WhatsApp", desc: "Sending instant alerts and chats to your customers" },
    { id: "D1", cx: 94, cy: 50, label: "Email", desc: "Automating personalized email updates and nurtures" },
    { id: "D2", cx: 94, cy: 70, label: "Stripe", desc: "Processing secure payments and generating subscriptions" },
  ];

  const column4: Node[] = [
    { id: "E0", cx: 121, cy: 20, label: "Leads", desc: "Capturing and qualifying incoming customer inquiries" },
    { id: "E1", cx: 121, cy: 40, label: "Sales", desc: "Closing deals and driving revenue automatically" },
    { id: "E2", cx: 121, cy: 60, label: "Uptime", desc: "Keeping your systems running 24/7 with zero downtime" },
    { id: "E3", cx: 121, cy: 80, label: "Growth", desc: "Scaling your customer base and expanding business operations" },
  ];

  const allNodes = [...column0, ...column1, ...column2, ...column3, ...column4];

  // Helper to generate connection paths between two columns
  const renderConnections = (colsFrom: Node[], colsTo: Node[]) => {
    return colsFrom.map((nFrom) =>
      colsTo.map((nTo) => {
        const pathId = `${nFrom.id}-${nTo.id}`;
        const isActive = activeNode === nFrom.id || activeNode === nTo.id;
        return (
          <g key={pathId}>
            {/* Background thin lines */}
            <motion.line
              x1={nFrom.cx}
              y1={nFrom.cy}
              x2={nTo.cx}
              y2={nTo.cy}
              stroke={isActive ? "#C0F0FB" : "rgba(255, 255, 255, 0.08)"}
              strokeWidth={isActive ? 1.0 : 0.4}
              transition={{ duration: 0.3 }}
            />
            {/* Pulsing particles along active lines */}
            {isActive && (
              <circle r="0.8" fill="#C0F0FB">
                <animateMotion
                  path={`M ${nFrom.cx} ${nFrom.cy} L ${nTo.cx} ${nTo.cy}`}
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })
    );
  };

  return (
    <section className="w-full lg:h-screen lg:min-h-[750px] flex items-center py-20 lg:py-0 px-6 md:px-10 xl:px-16 2xl:px-24 bg-background relative overflow-hidden select-none">
      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Column: Copy */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left z-10">
            <h2 className="text-[clamp(32px,4.5vw,52px)] font-black text-foreground leading-[1.05] tracking-tight">
              Powering the <br className="hidden sm:inline" />
              Growth Pipeline
            </h2>
          <p className="text-muted-foreground text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto lg:mx-0">
            We are an AI-native product studio. We design, build, and automate custom pipelines to ship your systems at production speed.
          </p>


        </div>

        {/* Right Column: Visual Neural Graph */}
        <div className="lg:col-span-7 flex justify-center items-center w-full z-10">
          <div className="relative w-full max-w-[680px] aspect-[136/100] border border-border/20 bg-[#111111]/45 p-4 sm:p-6 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Subtle glow hubs in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#355CFF]/5 blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-[68%] -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-[#C0F0FB]/5 blur-[60px] pointer-events-none" />

            <svg
              viewBox="0 0 136 100"
              className="w-full h-full select-none"
              style={{ overflow: "visible" }}
            >
              {/* Lines / Connections */}
              {renderConnections(column0, column1)}
              {renderConnections(column1, column2)}
              {renderConnections(column2, column3)}
              {renderConnections(column3, column4)}

              {/* Pulse animation for steady state background data flow */}
              <circle r="0.5" fill="rgba(255, 255, 255, 0.3)">
                <animateMotion
                  path={`M 15 60 L 42 50 L 68 50 L 94 50 L 121 40`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="0.5" fill="rgba(192, 240, 251, 0.4)">
                <animateMotion
                  path={`M 15 20 L 42 30 L 68 50 L 94 30 L 121 20`}
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="0.5" fill="rgba(255, 255, 255, 0.3)">
                <animateMotion
                  path={`M 15 80 L 42 70 L 68 50 L 94 70 L 121 80`}
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Nodes rendering */}
              {allNodes.map((node) => {
                const isActive = activeNode === node.id;
                const isHub = node.id === "C0";

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group/node"
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    {/* Hover larger glow ring */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isHub ? 4.5 : 3.5}
                      fill="transparent"
                      className="transition-colors duration-300"
                    />

                    {/* Outer border ring */}
                    <motion.circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isHub ? 3.2 : 2.2}
                      fill={isHub ? "#0A0A0A" : "#111111"}
                      stroke={isActive ? "#C0F0FB" : isHub ? "#355CFF" : "rgba(255,255,255,0.3)"}
                      strokeWidth={isHub ? 0.9 : isActive ? 0.8 : 0.5}
                      animate={{
                        scale: isActive ? 1.25 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Inner core dot */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isHub ? 1.4 : 0.9}
                      fill={isActive ? "#C0F0FB" : isHub ? "#C0F0FB" : "rgba(255, 255, 255, 0.5)"}
                      className="transition-colors duration-200"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
