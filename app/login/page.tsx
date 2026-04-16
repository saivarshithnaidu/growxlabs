"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const CREDENTIALS = {
  ADMIN: { email: "admin@growxlabs.tech", password: "VARSHITH973206" },
  CO_ADMIN: { email: "coadmin@growxlabs.tech", password: "AKHILESH" }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // DEV ONLY: Hardcoded logic for demo purposes
    if (email === CREDENTIALS.ADMIN.email && password === CREDENTIALS.ADMIN.password) {
      localStorage.setItem("userRole", "Admin");
      localStorage.setItem("userEmail", email);
      router.push("/dashboard");
    } else if (email === CREDENTIALS.CO_ADMIN.email && password === CREDENTIALS.CO_ADMIN.password) {
      localStorage.setItem("userRole", "Co-Admin");
      localStorage.setItem("userEmail", email);
      router.push("/dashboard");
    } else {
      setTimeout(() => {
        setError("Invalid credentials");
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-white/40 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-10 glass border-white/5 shadow-2xl shadow-black/50">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">
                GrowX Portal
              </h1>
              <p className="text-white/40 text-sm font-light uppercase tracking-widest">
                Internal Environment
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="admin@growxlabs.tech" 
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 pr-6 focus:border-white/20 transition-all text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 pr-6 focus:border-white/20 transition-all text-white"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center text-xs text-red-500 font-bold"
                >
                  <AlertCircle className="h-4 w-4 mr-2" /> {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-black text-lg bg-white text-black hover:bg-neutral-200 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "Access System"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                Demo Phase v1.0
              </p>
            </div>
          </Card>
        </motion.div>

        <p className="mt-8 text-center text-[10px] text-white/20 font-black uppercase tracking-widest leading-relaxed">
          Authorized personnel only. <br />
          GrowX Labs Cloud Systems.
        </p>
      </div>
    </div>
  );
}
