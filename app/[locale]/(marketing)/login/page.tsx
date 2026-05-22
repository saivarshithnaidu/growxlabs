"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const locale = window.location.pathname.split('/')[1] || 'en-IN';
      
      const callbackUrl = email.includes('admin') 
        ? `/${locale}/admin/leads` 
        : `/${locale}/client/dashboard`;

      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        throw new Error("Invalid email or password. Please try again.");
      }
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
              Authentication Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]/60 ml-4">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]/40 group-focus-within:text-[#355CFF] transition-colors" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="name@company.com" 
                  className="h-14 rounded-2xl bg-[#EDEAE4]/20 border-[#E5E2DC] pl-14 pr-6 focus:border-[#355CFF]/30 focus:bg-white transition-all text-[#1A1A1A] placeholder:text-[#6B7280]/30"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]/60 ml-4">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]/40 group-focus-within:text-[#355CFF] transition-colors" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-[#EDEAE4]/20 border-[#E5E2DC] pl-14 pr-6 focus:border-[#355CFF]/30 focus:bg-white transition-all text-[#1A1A1A] placeholder:text-[#6B7280]/30"
                  disabled={loading}
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
              className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#355CFF] text-white hover:bg-[#254CE0] transition-all shadow-md shadow-[#355CFF]/10 disabled:opacity-50"
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
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#355CFF] hover:text-[#254CE0] transition-colors hover:underline">
                Create one here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E5E2DC] text-center">
            <p className="text-[#6B7280]/40 text-[10px] font-black uppercase tracking-[0.2em]">
              Secure Access Portal
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-[#6B7280]/50 font-bold uppercase tracking-widest leading-relaxed">
          Secure Login for GrowX Labs Clients & Team <br />
          <span className="text-[#6B7280]/30">GrowX Labs Cloud Systems &copy; {new Date().getFullYear()}</span>
        </p>
      </div>
    </div>
  );
}
