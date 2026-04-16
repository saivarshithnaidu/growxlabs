"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Rocket, LogOut, ShieldCheck, UserCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check local session for demo purposes
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      setEmail(storedEmail);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  if (!role) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Welcome to <span className="text-gradient">GrowX Labs Dashboard.</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-2 px-3 py-1 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                {role === "Admin" ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                <span>{role} Access</span>
              </span>
              <span className="text-white/40 text-sm font-light tracking-wide">{email}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="rounded-full border-white/5 text-white/40 hover:text-white hover:border-white/20 px-8"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Rocket className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">System Status</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                All GrowX core systems are operational. Internal environment v1.0 is active.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Connected</span>
            </div>
          </Card>

          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Activity className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Active Analytics</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Platform is monitoring global project sync. Performance health at 100%.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Real-time Data Active</span>
            </div>
          </Card>

          <Card className="p-10 glass border-white/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Security Audit</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Authentication layer is currently in demo mode. Hardcoded overrides enabled.
              </p>
            </div>
            <div className="pt-4 flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Auth Phase 1</span>
            </div>
          </Card>
        </div>

        <div className="mt-24 text-center">
          <p className="text-white/10 text-xs font-black uppercase tracking-[0.4em]">
            Authorized GrowX Internal Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
