"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    if (email) {
      router.push(role === "Admin" ? "/admin/search" : "/dashboard");
    }
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
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
      
      if (!res.ok) throw new Error(data.error || "Failed to initialize registration.");
      
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#F5F3EE]">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-[#6B7280] hover:text-[#1A1A1A] group transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="p-10 border border-[#E5E2DC] rounded-[24px] shadow-sm bg-white">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center text-3xl font-black tracking-tight select-none">
                <span className="text-[#1A1A1A]">GrowX</span>
                <span className="text-[#1A1A1A]">Labs</span>
                <span className="text-[#355CFF] font-black">.tech</span>
              </div>
            </div>
            <p className="text-[#6B7280] text-[10px] font-black uppercase tracking-[0.2em] -mt-2">
              Partner Registration
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-6 py-8">
              <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">Registration Initialized</h2>
                <p className="text-sm text-[#6B7280]">Check your inbox to verify your credentials. Redirecting to login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#6B7280]/60 ml-4">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]/40 group-focus-within:text-[#355CFF] transition-colors" />
                  <Input 
                    placeholder="John Doe" 
                    required
                    className="h-14 rounded-2xl bg-[#EDEAE4]/20 border-[#E5E2DC] pl-14 pr-6 focus:border-[#355CFF]/30 focus:bg-white transition-all text-[#1A1A1A]"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#6B7280]/60 ml-4">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]/40 group-focus-within:text-[#355CFF] transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="name@company.com" 
                    required
                    className="h-14 rounded-2xl bg-[#EDEAE4]/20 border-[#E5E2DC] pl-14 pr-6 focus:border-[#355CFF]/30 focus:bg-white transition-all text-[#1A1A1A]"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#6B7280]/60 ml-4">Access Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]/40 group-focus-within:text-[#355CFF] transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    className="h-14 rounded-2xl bg-[#EDEAE4]/20 border-[#E5E2DC] pl-14 pr-6 focus:border-[#355CFF]/30 focus:bg-white transition-all text-[#1A1A1A]"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-start text-[11px] text-red-600 font-medium leading-tight">
                  <AlertCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#355CFF] text-white hover:bg-[#254CE0] transition-all flex items-center justify-center shadow-md shadow-[#355CFF]/10"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
              </Button>

              <p className="text-center text-xs text-[#6B7280] font-bold uppercase tracking-widest">
                Already a partner? {" "}
                <Link href="/login" className="text-[#355CFF] hover:text-[#254CE0] hover:underline transition-colors">Login</Link>
              </p>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-[#E5E2DC] text-center">
            <p className="text-[#6B7280]/40 text-[10px] font-black uppercase tracking-[0.2em]">
              Partner Access
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-[#6B7280]/50 font-bold uppercase tracking-widest leading-relaxed">
          Secure Portal for GrowX Labs Clients & Team <br />
          <span className="text-[#6B7280]/30">GrowX Labs Cloud Systems &copy; {new Date().getFullYear()}</span>
        </p>
      </div>
    </div>
  );
}
