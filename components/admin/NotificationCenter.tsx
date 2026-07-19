"use client";

import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Sparkles, MessageSquare } from "lucide-react";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "ai">("all");

  if (!isOpen) return null;

  const notifications = [
    { id: "n1", title: "MQL Lead Qualification", message: "Acme Corp score reached 92%. Assigned to SDR.", type: "system", time: "10m ago", read: false },
    { id: "n2", title: "Gemini Copilot Alert", message: "Predicted low churn risk (Score 96) for Enterprise Client.", type: "ai", time: "25m ago", read: false },
    { id: "n3", title: "Invoice Paid", message: "Invoice INV-90812 paid ($17,110.00). Updated Finance.", type: "system", time: "1h ago", read: true }
  ];

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "ai") return n.type === "ai";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border-l border-white/10 h-full p-6 flex flex-col justify-between text-white shadow-2xl">
        
        <div>
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-blue-400" />
              <h3 className="font-extrabold text-base text-white">Unified Notification Center</h3>
            </div>
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mb-6">
            {(["all", "unread", "ai"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                  filter === f
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {filtered.map(n => (
              <div key={n.id} className={`p-4 rounded-xl border transition-all ${!n.read ? "bg-white/[0.03] border-blue-500/20" : "bg-white/[0.01] border-white/5"}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-white">{n.title}</span>
                  <span className="text-[10px] text-neutral-500">{n.time}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <button onClick={onClose} className="w-full h-10 bg-white/5 border border-white/10 text-neutral-300 hover:text-white font-bold rounded-xl text-xs">
            Mark All as Read
          </button>
        </div>

      </div>
    </div>
  );
}
