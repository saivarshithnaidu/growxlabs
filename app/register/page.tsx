"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { Mail, Lock, User, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "System registration failed.");
      
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030303]">
      {/* Background Glows */}
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-10 glass border-white/5 shadow-2xl bg-white/[0.01]">
            <div className="text-center mb-10 text-white">
              <div className="flex items-center justify-center mb-6">
                 <Image src="/logo.svg" alt="GrowX Labs" width={200} height={40} className="opacity-90" />
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Agency Portal Registration</p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-center space-y-6 py-8"
                >
                  <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">Access Initialized</h2>
                    <p className="text-sm text-white/40 text-center">Your partner account has been created. Syncing with authentication services...</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/20 ml-2">Full Organization Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                      <Input 
                        placeholder="GrowX Labs Client" 
                        required
                        className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 text-white"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/20 ml-2">Authorized Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                      <Input 
                        type="email" 
                        placeholder="partner@company.com" 
                        required
                        className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 text-white"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-white/20 ml-2">Secure Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        required
                        className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-14 text-white"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 mr-2" /> {error}
                    </div>
                  )}

                  <Button 
                    className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-neutral-100 transition-all flex items-center justify-center shadow-2xl shadow-white/5"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Request Access"}
                  </Button>

                  <p className="text-center text-xs text-white/20 font-bold uppercase tracking-widest">
                    Already an authorized partner? {" "}
                    <Link href="/login" className="text-white hover:underline transition-all">Sign In</Link>
                  </p>
                </form>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
