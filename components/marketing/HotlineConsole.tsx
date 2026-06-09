"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Calendar, ShieldCheck, ArrowUpRight, Terminal, Code, Cpu } from "lucide-react";
import { Link } from "@/navigation";

export function HotlineConsole() {
  const [showCalendly, setShowCalendly] = useState(false);
  const [activeTab, setActiveTab] = useState<"logs" | "payload" | "metrics">("logs");
  const [logs, setLogs] = useState<string[]>([]);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Initialize terminal logs on mount
  useEffect(() => {
    const initialLogs = [
      "guest@growxlabs:~$ init_handshake --secure",
      "▸ Establish tunnel to growxlabs-core-node-1...",
      "✔ TLS 1.3 session established successfully.",
      "✔ Secure routing port allocated: 443",
      "▸ Latency check: 14ms (Optimal)",
      "▸ Average studio response time: 4 mins",
      "guest@growxlabs:~$ status --active",
      "● ONLINE // Direct Studio Connect ready.",
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < initialLogs.length) {
        const nextLine = initialLogs[i];
        if (nextLine) {
          setLogs(prev => [...prev, nextLine]);
        }
        i++;
      } else {
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  // Append a line when button is hovered
  const handleButtonHover = (buttonName: string) => {
    setHoveredButton(buttonName);
    if (buttonName === "whatsapp") {
      setLogs(prev => [
        ...prev.slice(-10),
        "guest@growxlabs:~$ exec launch_whatsapp --target=engineer",
        "▸ Status: Preparing redirection payload..."
      ]);
    } else if (buttonName === "calendly") {
      setLogs(prev => [
        ...prev.slice(-10),
        "guest@growxlabs:~$ exec initialize_calendly --embed",
        "▸ Status: Awaiting calendar selection..."
      ]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4 text-left">
      {/* Top Header (directly on section background) */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 text-left animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#355CFF]">Direct Studio Connect</p>
            <h3 className="text-[14px] font-bold text-foreground tracking-tight mt-0.5 uppercase font-mono">
              {showCalendly ? "secure_calendly_session.sh" : "studio_terminal_active.log"}
            </h3>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1 text-[12px] font-semibold text-muted-foreground font-mono">
          <span>Ping: <span className="font-bold text-[#10B981]">14ms</span></span>
        </div>
      </div>

      {showCalendly ? (
        /* Inline Calendly Iframe */
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-full overflow-hidden rounded-xl border border-border bg-[#05060A] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <iframe 
              src="https://calendly.com/saivarshith8284" 
              className="w-full h-[600px] border-0" 
              title="Select a Date & Time - Calendly"
            />
          </div>
          
          <button 
            type="button"
            onClick={() => setShowCalendly(false)}
            className="mt-6 text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-5 py-2 bg-background cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>guest@growxlabs:~$ cd ..</span>
          </button>
        </div>
      ) : (
        /* Central Interactive Terminal Window */
        <div className="space-y-6">
          <div className="w-full rounded-xl border border-border bg-[#05060A] overflow-hidden flex flex-col font-mono text-[13px] text-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0B0D15] border-b border-border/70">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
              </div>
              {/* Tabs */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium border transition-all ${
                    activeTab === "logs" 
                      ? "bg-background border-border text-white shadow-sm" 
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>connection.log</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("payload")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium border transition-all ${
                    activeTab === "payload" 
                      ? "bg-background border-border text-white shadow-sm" 
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>payload.json</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metrics")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium border transition-all ${
                    activeTab === "metrics" 
                      ? "bg-background border-border text-white shadow-sm" 
                      : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>system.specs</span>
                </button>
              </div>
            </div>

            {/* Terminal Screen Body */}
            <div className="p-4 sm:p-6 h-[240px] overflow-y-auto text-left leading-relaxed">
              {activeTab === "logs" && (
                <div className="space-y-1">
                  {logs.map((log, index) => {
                    if (!log || typeof log !== "string") return null;
                    if (log.startsWith("guest@growxlabs")) {
                      return (
                        <p key={index} className="text-white/40">
                          <span className="text-[#355CFF]">guest@growxlabs</span>
                          <span className="text-white/60">:</span>
                          <span className="text-[#10B981]">~$</span>{" "}
                          <span className="text-white/95">{log.split("~$ ")[1]}</span>
                        </p>
                      );
                    }
                    if (log.startsWith("✔")) {
                      return <p key={index} className="text-[#10B981]">{log}</p>;
                    }
                    if (log.startsWith("●")) {
                      return <p key={index} className="text-[#10B981] font-bold">{log}</p>;
                    }
                    return <p key={index} className="text-white/70">{log}</p>;
                  })}
                  <div className="w-2 h-4 bg-white/70 inline-block animate-pulse ml-0.5 align-middle" />
                </div>
              )}

              {activeTab === "payload" && (
                <pre className="text-white/80 overflow-x-auto text-[12.5px] leading-relaxed">
                  {JSON.stringify(
                    {
                      studio: "GrowXLabs.tech",
                      status: "ONLINE",
                      average_response: "4 mins",
                      encryption: "TLS_1.3_AES_256",
                      active_regions: ["IN", "USA", "EU", "AE"],
                      actions_supported: ["WHATSAPP_CONNECT", "CALENDLY_BOOK"]
                    },
                    null,
                    2
                  )}
                </pre>
              )}

              {activeTab === "metrics" && (
                <div className="space-y-2 text-[12.5px] text-white/80">
                  <p className="text-white/40">// Hardware & Cryptographic Protocol Specs</p>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-w-sm">
                    <div className="text-white/40">Routing Tunnel</div>
                    <div className="text-white/90">TLS 1.3 / AES-256-GCM</div>
                    <div className="text-white/40">Avg Bandwidth</div>
                    <div className="text-white/90">1.2 Gbps Dedicated</div>
                    <div className="text-white/40">Core AI Engine</div>
                    <div className="text-white/90">Claude 3.5 Sonnet / GPT-4o</div>
                    <div className="text-white/40">Integration Hub</div>
                    <div className="text-white/90">n8n / custom-workflows</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/contact"
              onMouseEnter={() => handleButtonHover("whatsapp")}
              onMouseLeave={() => setHoveredButton(null)}
              className="group/btn flex items-center justify-between rounded-xl border border-border bg-background p-4 text-left hover:border-[#355CFF] hover:bg-card transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#355CFF]/5 text-[#355CFF] flex items-center justify-center group-hover/btn:bg-[#355CFF] group-hover/btn:text-white transition-all duration-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-black tracking-tight text-foreground font-mono">POST /whatsapp-connect</p>
                  <p className="text-[11px] text-muted-foreground">Instant dispatch to engineer</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/btn:text-[#355CFF] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
            </Link>

            <button 
              type="button"
              onClick={() => setShowCalendly(true)}
              onMouseEnter={() => handleButtonHover("calendly")}
              onMouseLeave={() => setHoveredButton(null)}
              className="group/btn flex items-center justify-between rounded-xl border border-border bg-background p-4 text-left hover:border-[#355CFF] hover:bg-card transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] w-full text-left cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#355CFF]/5 text-[#355CFF] flex items-center justify-center group-hover/btn:bg-[#355CFF] group-hover/btn:text-white transition-all duration-300">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[13px] font-black tracking-tight text-foreground font-mono">POST /calendly-schedule</p>
                  <p className="text-[11px] text-muted-foreground">Book detailed digital strategy</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/btn:text-[#355CFF] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
            </button>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Encrypted connection. Zero third-party tracking.</span>
          </div>
        </div>
      )}
    </div>
  );
}
