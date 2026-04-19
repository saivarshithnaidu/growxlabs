"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      if (role === "ADMIN" || role === "CO_ADMIN") {
        router.push("/admin/leads");
      } else {
        router.push("/client/dashboard");
      }
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid email or password. Please try again.");
      }

      // The useEffect will handle redirection once the session is updated
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030303]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-white/40 hover:text-white group transition-all">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="p-10 glass border-white/5 shadow-2xl shadow-black/80 backdrop-blur-xl bg-white/[0.02]">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-6">
                <div className="relative h-16 w-64 transition-transform hover:scale-[1.02] duration-300">
                  <Image 
                    src="/logo.svg" 
                    alt="GrowX Labs" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] -mt-2">
                Authentication Portal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    placeholder="name@company.com" 
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 pr-6 focus:border-white/20 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 pr-6 focus:border-white/20 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                    disabled={loading}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start text-[11px] text-red-400 font-medium leading-tight">
                      <AlertCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" /> {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Authenticating...
                  </span>
                ) : (
                  "Access System"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
                Don't have an account?{" "}
                <Link href="/register" className="text-white hover:text-primary transition-colors hover:underline">
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                Secure Access Portal
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-[10px] text-white/25 font-bold uppercase tracking-widest leading-relaxed"
        >
          Secure Login for GrowX Labs Clients & Team <br />
          <span className="text-white/10">GrowX Labs Cloud Systems &copy; {new Date().getFullYear()}</span>
        </motion.p>
      </div>
    </div>
  );
}

