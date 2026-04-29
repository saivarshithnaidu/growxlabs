"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, Clock, Sparkles } from "lucide-react";
import React from "react";

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
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
      setFormData({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
            GET IN TOUCH
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(32px,6vw,72px)] font-bold text-white mb-8 tracking-tight leading-[1.1]"
          >
            Start Your <span className="text-gradient">Project.</span>
          </motion.h1>
          <p className="text-[clamp(16px,2vw,18px)] text-[#A0A0A0] max-w-[640px] mx-auto leading-[1.7]">
            Tell us about your project and we will respond within 4 hours with a custom plan.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div className="flex justify-center mb-16">
          <a
            href="https://wa.me/919121600000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-10 py-5 bg-[#00A86B] text-white font-bold rounded-full hover:bg-[#00A86B]/90 hover:scale-105 transition-all text-lg shadow-2xl"
          >
            <MessageCircle size={24} />
            Chat on WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Direct Contact</h2>
              <p className="text-[#A0A0A0] leading-[1.8] text-lg font-medium">
                We are currently accepting new projects. Use the form or contact us directly.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "hello@growxlabs.tech", href: "mailto:hello@growxlabs.tech" },
                { icon: Phone, label: "Phone", value: "+91 81859 58336", href: "tel:+918185958336" },
                { icon: MapPin, label: "Location", value: "Guntur, Andhra Pradesh, India" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center transition-all group-hover:border-[rgba(0,168,107,0.3)] shadow-xl">
                    <item.icon className="text-[#00A86B] h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A0A0A0]/60 uppercase tracking-widest font-black mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white font-bold text-lg hover:text-[#00A86B] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-white font-bold text-lg">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="pt-10 border-t border-white/5 space-y-6">
              {[
                { icon: ShieldCheck, text: "Registered Business — UDYAM-AP-22-0063260" },
                { icon: Clock, text: "Response within 4 hours" },
                { icon: Sparkles, text: "Free 15-minute discovery call" },
              ].map((signal, i) => (
                <div key={i} className="flex items-center gap-4 text-[15px] text-white/50 font-medium">
                  <signal.icon size={20} className="text-[#00A86B] shrink-0" />
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-10 md:p-12 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/[0.02] shadow-2xl backdrop-blur-md">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-8"
                >
                  <div className="w-24 h-24 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="text-[#00A86B] w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">Message Sent!</h3>
                    <p className="text-[#A0A0A0] text-lg font-medium">
                      We will get back to you within 4 hours.
                    </p>
                  </div>
                  <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-full px-10 h-14 border-white/10 hover:bg-white/5 text-white font-bold transition-all shadow-none">
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Full Name</label>
                    <Input
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-6 text-white focus:border-[#00A86B]/40 transition-all text-base shadow-inner"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Email Address</label>
                      <Input
                        required
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-6 text-white focus:border-[#00A86B]/40 transition-all text-base shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-14 rounded-2xl bg-white/[0.03] border-white/5 pl-6 text-white focus:border-[#00A86B]/40 transition-all text-base shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Service Needed</label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full h-14 rounded-2xl bg-black/40 border border-white/5 pl-6 pr-6 text-white focus:border-[#00A86B]/40 transition-all text-base appearance-none cursor-pointer shadow-inner"
                      >
                        <option value="" className="bg-black">Select a service</option>
                        <option value="website" className="bg-black">Website Development</option>
                        <option value="automation" className="bg-black">n8n Automation</option>
                        <option value="hosting" className="bg-black">Hosting and Maintenance</option>
                        <option value="ai" className="bg-black">AI Integration</option>
                        <option value="bundle" className="bg-black">Full Bundle</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Estimated Budget</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-14 rounded-2xl bg-black/40 border border-white/5 pl-6 pr-6 text-white focus:border-[#00A86B]/40 transition-all text-base appearance-none cursor-pointer shadow-inner"
                      >
                        <option value="" className="bg-black">Select budget range</option>
                        <option value="under-15k" className="bg-black">Under ₹15,000</option>
                        <option value="15k-35k" className="bg-black">₹15,000 – ₹35,000</option>
                        <option value="35k-70k" className="bg-black">₹35,000 – ₹70,000</option>
                        <option value="above-70k" className="bg-black">Above ₹70,000</option>
                        <option value="overseas" className="bg-black">Overseas (USD)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Project Brief</label>
                    <Textarea
                      required
                      placeholder="Tell us about your project goals, timeline, and requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[160px] rounded-2xl bg-white/[0.03] border-white/5 p-6 text-white focus:border-[#00A86B]/40 transition-all leading-relaxed text-base shadow-inner"
                    />
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center space-x-4 text-red-500 text-sm bg-red-500/10 p-5 rounded-2xl border border-red-500/20 shadow-lg"
                    >
                      <AlertCircle size={20} className="shrink-0" />
                      <span className="font-bold">{errorMessage}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-16 text-lg font-black bg-[#00A86B] text-white hover:bg-[#00A86B]/90 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Processing..." : "Get Started Now →"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
