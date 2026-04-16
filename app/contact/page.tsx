"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Our systems are currently experiencing a high volume of inquiries. Please try again or email us directly.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-32 pb-48 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter"
          >
            Start Your <span className="text-gradient">Project.</span>
          </motion.h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            We review documentation and respond to all project inquiries within 24 business hours.
            Secure your growth infrastructure today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-6 uppercase">Consultation Office</h2>
              <p className="text-white/40 leading-relaxed text-lg font-light">
                We are currently accepting high-impact partnerships for Q3. 
                Use the portal below or contact our strategy team directly.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Direct Email", value: "partnerships@growxlabs.tech" },
                { icon: Phone, label: "Strategy Line", value: "+91 91216 00000" },
                { icon: MapPin, label: "Global HQ", value: "Engineering Block, Guntur, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <item.icon className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{item.label}</p>
                    <p className="text-white font-bold text-lg tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5">
              <p className="text-[10px] font-black text-white/20 mb-8 uppercase tracking-[0.3em]">Industry Recognized Excellence</p>
              <div className="flex flex-wrap gap-10 opacity-30 grayscale items-center">
                 <span className="text-xl font-black text-white tracking-widest leading-none">TECHCORP</span>
                 <span className="text-xl font-black text-white tracking-widest leading-none">SKYLAB</span>
                 <span className="text-xl font-black text-white tracking-widest leading-none">NEXUS</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-10 md:p-16 glass border-white/5 rounded-[3rem] shadow-2xl shadow-black/50">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-8"
                >
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-white w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Transmission Secured.</h3>
                    <p className="text-white/40 font-light text-lg">
                      Your inquiry has been logged. A partner strategy expert 
                      will contact you via email shortly.
                    </p>
                  </div>
                  <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-full px-10 h-14 border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all">
                    Initialize New Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Full Name</label>
                    <Input 
                      required
                      placeholder="Jane Cooper"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-6 text-white focus:border-white/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Corporate Email Address</label>
                    <Input 
                      required
                      type="email"
                      placeholder="j.cooper@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-6 text-white focus:border-white/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Project Scope & Requirements</label>
                    <Textarea 
                      required
                      placeholder="Discuss your growth objectives, desired timeline, and technical constraints..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[160px] rounded-3xl bg-white/[0.03] border-white/5 p-6 text-white focus:border-white/20 transition-all font-medium leading-relaxed"
                    />
                  </div>

                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center space-x-3 text-red-500 text-xs bg-red-500/10 p-5 rounded-2xl border border-red-500/20"
                    >
                      <AlertCircle size={18} />
                      <span className="font-bold leading-tight">{errorMessage}</span>
                    </motion.div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-16 text-lg font-black bg-white text-black hover:bg-neutral-200 transition-all rounded-2xl shadow-xl shadow-white/5" 
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Initializing Transmission..." : "Get a Custom Quote"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-[10px] text-center text-white/20 font-medium uppercase tracking-widest">
                    Encrypted Protocol &bull; Secure Data Handling &bull; NDAs Active
                  </p>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

