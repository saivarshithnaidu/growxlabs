"use client";

import { Card } from "@/components/ui/Card";
import { Mail, MessageSquare, Link2, Send, BarChart3, TrendingUp, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function OutreachPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Outreach Campaigns</h1>
          <p className="text-white/40 font-medium">Manage and track multi-channel communication sequences.</p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 h-11">
          New Campaign
        </Button>
      </div>

      <div className="h-96 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl space-y-4">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          <Send size={24} />
        </div>
        <div className="text-center">
          <p className="text-white font-bold">No campaigns active</p>
          <p className="text-white/20 text-sm">Start a new outreach sequence to engage with your leads.</p>
        </div>
        <Button className="bg-white text-black h-10 px-6 mt-4">
          Initialize Campaign
        </Button>
      </div>
    </div>
  );
}
