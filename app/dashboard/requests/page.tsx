"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Plus, CheckCircle2, Clock, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Active Service Inquiries Data
const mockRequests = [
  { id: 1, client: "Stark Industries", message: "Need to upgrade the reactor monitoring dashboard to real-time WebSockets.", status: "Open", date: "2024-04-15" },
  { id: 2, client: "Wayne Enterprises", message: "Automate the satellite uplink synchronization scripts.", status: "Closed", date: "2024-04-12" },
  { id: 3, client: "Oscorp", message: "Technical SEO audit for the new synthetic genetics portal.", status: "Open", date: "2024-04-16" },
  { id: 4, client: "Pied Piper", message: "Latency issues on the middle-out compression API endpoint.", status: "Under Review", date: "2024-04-14" },
];

export default function RequestsDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, [router]);

  if (!role) return null;

  const isAdmin = role === "Admin" || role === "Co-Admin";

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Service Stream.
          </h1>
          <p className="text-xl text-white/40 font-light leading-relaxed">
            Direct communication channel for feature requests and technical support.
          </p>
        </div>
        {!isAdmin && (
          <Button className="h-14 px-8 rounded-2xl font-black bg-white text-black hover:bg-neutral-200 transition-all">
            <Plus className="mr-2 h-5 w-5" /> New Request
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {mockRequests.map((request, i) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 glass border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-white/20 transition-all">
              <div className="flex items-start gap-6">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                  request.status === "Open" ? "bg-white/5 text-white" : "bg-green-500/10 text-green-500"
                )}>
                  {request.status === "Open" ? <Clock size={24} strokeWidth={1.5} /> : <CheckCircle2 size={24} strokeWidth={1.5} />}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      {isAdmin ? request.client : "Status Ticket"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{request.date}</span>
                  </div>
                  <p className="text-white font-bold leading-relaxed pr-8">{request.message}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <span className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest min-w-[100px] text-center",
                  request.status === "Open" ? "text-white bg-white/5 border border-white/10" : "text-green-500 bg-green-500/10"
                )}>
                  {request.status}
                </span>
                {isAdmin && (
                  <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl text-white/20 hover:text-white">
                    <ChevronRight size={20} />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
