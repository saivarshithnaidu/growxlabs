"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, Clock, Sparkles, ArrowRight } from "lucide-react";
import React from "react";
import { usePostHog } from "posthog-js/react";
import { Turnstile } from "@marsidev/react-turnstile";
import { FlickerText } from "@/components/marketing/FlickerText";

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const posthog = usePostHog();

  const titleName = "CONTACT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      if (!response.ok) {
        throw new Error("Our systems are currently experiencing a high volume of inquiries. Please try again or email us directly.");
      }

      if (posthog) {
        posthog.identify(formData.email, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          budget: formData.budget,
        });

        posthog.capture("lead_submitted", {
          service: formData.service,
          budget: formData.budget,
        });
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: "hello@growxlabs.tech", href: "mailto:hello@growxlabs.tech" },
    { icon: Phone, label: "Phone", value: "+91 87909 07144", href: "tel:+918790907144" },
    { icon: MapPin, label: "Location", value: "Guntur, Andhra Pradesh, India" },
  ];

  const trustSignals = [
    { icon: ShieldCheck, text: "Registered Business: UDYAM-AP-22-0063260" },
    { icon: Clock, text: "Response within 4 business hours" },
    { icon: Sparkles, text: "Free 15-minute discovery call" },
  ];

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          {/* Massive Swiss Page Title with neon flickering */}
          <div className="w-full overflow-hidden flex justify-center items-end select-none pointer-events-none mb-14">
            <h1 className="font-black select-none tracking-[-0.06em] text-[#1A1A1A] leading-[0.8] text-[9.2vw] uppercase whitespace-nowrap">
              <FlickerText text={titleName} />
            </h1>
          </div>

          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF] mb-4 block">
            Get in touch
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(32px,5vw,56px)] font-black text-[#1A1A1A] mb-7 tracking-tight leading-[1.1]"
          >
            Start your project with a clear plan.
          </motion.h2>
          <p className="text-[clamp(16px,2vw,18px)] text-[#6B7280] max-w-[720px] mx-auto leading-[1.7]">
            Tell us what you want to build, automate, or improve. We will respond with next steps, rough scope, and the fastest sensible path forward.
          </p>
        </div>

        <div className="flex justify-center mb-14">
          <a
            href="https://wa.me/918790907144"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-[#355CFF] text-white font-semibold rounded-md hover:bg-[#2A4AD4] transition-all shadow-sm"
          >
            <MessageCircle size={21} aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14">
          <div className="space-y-8">
            <div className="rounded-lg border border-[#E5E2DC] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-[#1A1A1A] mb-4">Direct contact</h2>
              <p className="text-[#6B7280] leading-[1.75]">
                We are currently accepting new builds, redesigns, and automation projects. Use the form or reach us directly.
              </p>
            </div>

            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-5 rounded-lg border border-[#E5E2DC] bg-white p-5 shadow-sm">
                  <div className="w-12 h-12 bg-[#EDEAE4] rounded-md flex items-center justify-center shrink-0">
                    <item.icon className="text-[#355CFF] h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6B7280] uppercase tracking-widest font-bold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[#1A1A1A] font-bold hover:text-[#355CFF] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-[#1A1A1A] font-bold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[#E5E2DC] bg-white p-6 shadow-sm space-y-4">
              {trustSignals.map((signal) => (
                <div key={signal.text} className="flex items-center gap-3 text-[14px] text-[#6B7280] font-medium">
                  <signal.icon size={18} className="text-[#355CFF] shrink-0" aria-hidden="true" />
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 md:p-8 rounded-lg border border-[#E5E2DC] bg-white shadow-sm">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-7"
                >
                  <div className="w-20 h-20 bg-[#355CFF]/10 border border-[#355CFF]/15 rounded-lg flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-[#355CFF] w-10 h-10" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-[#1A1A1A]">Message sent</h3>
                    <p className="text-[#6B7280] text-lg">
                      We will get back to you within 4 business hours.
                    </p>
                  </div>
                  <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-md px-8 h-12 font-semibold">
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Full name</label>
                    <Input
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Email address</label>
                      <Input
                        required
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12 rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Phone number</label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Service needed</label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full h-12 rounded-md bg-white border border-[#E5E2DC] px-4 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#355CFF] transition-all"
                      >
                        <option value="">Select a service</option>
                        <option value="website">Website Development</option>
                        <option value="automation">n8n Automation</option>
                        <option value="hosting">Hosting and Maintenance</option>
                        <option value="ai">AI Integration</option>
                        <option value="bundle">Full Bundle</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Estimated budget</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-12 rounded-md bg-white border border-[#E5E2DC] px-4 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#355CFF] transition-all"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-15k">Under INR 15,000</option>
                        <option value="15k-35k">INR 15,000 - INR 35,000</option>
                        <option value="35k-70k">INR 35,000 - INR 70,000</option>
                        <option value="above-70k">Above INR 70,000</option>
                        <option value="overseas">Overseas (USD)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Project brief</label>
                    <Textarea
                      required
                      placeholder="Tell us about your project goals, timeline, and requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[150px] rounded-md leading-relaxed"
                    />
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-md border border-red-100"
                    >
                      <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
                      <span className="font-semibold">{errorMessage}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-center py-2">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                      onSuccess={(token) => setTurnstileToken(token)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold rounded-md inline-flex items-center gap-2"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Processing..." : "Send project brief"}
                    {status !== "loading" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
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
