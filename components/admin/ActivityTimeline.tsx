"use client";

import React from "react";
import { 
  Phone, Mail, Calendar, CheckSquare, FileText, Send, 
  MessageSquare, User, Tag, Clock, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE' | 'WHATSAPP' | 'SMS' | 'LINKEDIN';
  title: string;
  description?: string;
  created_at: string;
  performed_by_name?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ICON_MAP = {
  CALL: { icon: Phone, color: "text-[#dd5b00] bg-[#dd5b00]/5 border-[#dd5b00]/10" },
  EMAIL: { icon: Mail, color: "text-[#0075de] bg-[#0075de]/5 border-[#0075de]/10" },
  MEETING: { icon: Calendar, color: "text-[#1aae39] bg-[#1aae39]/5 border-[#1aae39]/10" },
  TASK: { icon: CheckSquare, color: "text-[#8a3ffc] bg-[#8a3ffc]/5 border-[#8a3ffc]/10" },
  NOTE: { icon: FileText, color: "text-[#615d59] bg-[#615d59]/5 border-[#615d59]/10" },
  WHATSAPP: { icon: Send, color: "text-[#25D366] bg-[#25D366]/5 border-[#25D366]/10" },
  SMS: { icon: MessageSquare, color: "text-amber-500 bg-amber-500/5 border-amber-500/10" },
  LINKEDIN: { icon: User, color: "text-[#0a66c2] bg-[#0a66c2]/5 border-[#0a66c2]/10" }
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white p-6 text-center">
        <Clock className="w-8 h-8 text-neutral-300 mb-2" />
        <h4 className="text-sm font-bold text-neutral-800">Timeline is quiet</h4>
        <p className="text-xs text-neutral-400 max-w-xs mt-1">No activities logged yet. Interactions will appear here chronologically.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-[#e6e6e6] ml-4 space-y-6 py-2">
      {activities.map((act, index) => {
        const typeConfig = ICON_MAP[act.type] || ICON_MAP.NOTE;
        const IconComponent = typeConfig.icon;
        const date = new Date(act.created_at);
        const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + 
          " • " + 
          date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

        return (
          <motion.div 
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            {/* Timeline Dot Indicator */}
            <div className={cn(
              "absolute -left-[37px] top-1 w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-transform duration-200 group-hover:scale-110",
              typeConfig.color
            )}>
              <IconComponent size={11} />
            </div>

            {/* Activity Card */}
            <div className="bg-white border border-[#e6e6e6] p-4 rounded-md shadow-sm transition-all duration-200 hover:border-[#0075de]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <h4 className="text-[13px] font-bold text-neutral-900 tracking-tight leading-none">
                  {act.title}
                </h4>
                <span className="text-[10px] font-semibold text-neutral-400 font-mono">
                  {formattedDate}
                </span>
              </div>
              
              {act.description && (
                <p className="text-xs text-[#31302e] leading-relaxed whitespace-pre-line font-medium mb-2.5">
                  {act.description}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#a39e98]">
                <User size={10} />
                <span>Logged by: {act.performed_by_name || "System Automation"}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
