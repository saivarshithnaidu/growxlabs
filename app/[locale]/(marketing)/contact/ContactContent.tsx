"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, Clock, Sparkles, ArrowRight } from "lucide-react";
import React from "react";
import { usePostHog } from "posthog-js/react";
import { Turnstile } from "@marsidev/react-turnstile";
import { FlickerText } from "@/components/marketing/FlickerText";
import Plan, { Task } from "@/components/ui/agent-plan";
import { cn } from "@/lib/utils";

export function ContactContent() {
  // Mode selection state
  const [isAIMode, setIsAIMode] = useState(false);

  // Traditional form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  // AI strategy builder state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: "Hi! I'm your GrowXLabs AI Architect. Tell me a bit about what you want to build or automate, and I will live-design your system blueprint, tech stack, and execution roadmap right here!"
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [aiService, setAiService] = useState("");
  const [aiBudget, setAiBudget] = useState("");
  const [aiTasks, setAiTasks] = useState<Task[]>([]);
  const [isAIChatLoading, setIsAIChatLoading] = useState(false);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const posthog = usePostHog();

  const titleName = "CONTACT";

  // Handle traditional submit
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
          mode: "traditional"
        });
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  // Handle chat submission (conversational steps)
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim() || isAIChatLoading) return;

    const userMsg = currentChatInput.trim();
    setCurrentChatInput("");
    setIsAIChatLoading(true);

    const updatedMessages = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(updatedMessages);

    try {
      const response = await fetch("/api/contact/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Strategy server is currently busy. Please try writing again.");
      }

      const data = await response.json();
      
      setChatMessages(prev => [...prev, { role: "model" as const, content: data.response }]);
      if (data.service) setAiService(data.service);
      if (data.budget) setAiBudget(data.budget);
      if (data.tasks && data.tasks.length > 0) setAiTasks(data.tasks);
      if (data.isReady) setIsReadyToSubmit(true);

    } catch (err: any) {
      setChatMessages(prev => [...prev, { 
        role: "model" as const, 
        content: "Sorry, I had a brief connection interruption. Could you describe your requirement again?" 
      }]);
    } finally {
      setIsAIChatLoading(false);
    }
  };

  // Submit lead from AI strategy mode
  const handleAISubmit = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: aiService,
          budget: aiBudget,
          message: `AI generated strategy roadmap for ${formData.name}`,
          tasks: aiTasks,
          chatHistory: chatMessages,
          turnstileToken
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed. Please try again.");
      }

      if (posthog) {
        posthog.identify(formData.email, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: aiService,
          budget: aiBudget,
        });

        posthog.capture("lead_submitted", {
          service: aiService,
          budget: aiBudget,
          mode: "ai_strategy"
        });
      }

      setStatus("success");
      // Reset form
      setFormData({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
      setChatMessages([
        {
          role: "model",
          content: "Hi! I'm your GrowXLabs AI Architect. Tell me a bit about what you want to build or automate, and I will live-design your system blueprint, tech stack, and execution roadmap right here!"
        }
      ]);
      setAiTasks([]);
      setAiService("");
      setAiBudget("");
      setIsReadyToSubmit(false);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please check your network and submit again.");
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

        <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-10 lg:gap-14">
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
            className="w-full"
          >
            <div className="p-6 md:p-8 rounded-lg border border-[#E5E2DC] bg-white shadow-sm w-full">
              
              {/* Premium Mode Switch Tabs */}
              <div className="flex p-1 bg-[#EDEAE4] rounded-lg border border-[#E5E2DC] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAIMode(false);
                    setStatus("idle");
                  }}
                  className={cn(
                    "flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer",
                    !isAIMode ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B7280] hover:text-[#1A1A1A]"
                  )}
                >
                  Traditional Form
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAIMode(true);
                    setStatus("idle");
                  }}
                  className={cn(
                    "flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer",
                    isAIMode ? "bg-[#355CFF] text-white shadow-sm" : "text-[#6B7280] hover:text-[#1A1A1A]"
                  )}
                >
                  <Sparkles size={13} className={cn(isAIMode ? "text-white" : "text-[#355CFF]")} />
                  AI Strategy Builder
                </button>
              </div>

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
                <AnimatePresence mode="wait">
                  {!isAIMode ? (
                    /* TRADITIONAL STATIC FORM VIEW */
                    <motion.form 
                      key="traditional-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit} 
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Full name</label>
                        <Input
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 rounded-md bg-white border border-[#E5E2DC] px-4"
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
                            className="h-12 rounded-md bg-white border border-[#E5E2DC] px-4"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280] ml-1">Phone number</label>
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-12 rounded-md bg-white border border-[#E5E2DC] px-4"
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
                          className="min-h-[150px] rounded-md leading-relaxed border border-[#E5E2DC] p-4"
                        />
                      </div>

                      {status === "error" && (
                        <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-md border border-red-100">
                          <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
                          <span className="font-semibold">{errorMessage}</span>
                        </div>
                      )}

                      <div className="flex justify-center py-2">
                        <Turnstile
                          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                          onSuccess={(token) => setTurnstileToken(token)}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-base font-semibold rounded-md inline-flex items-center gap-2 bg-[#355CFF] hover:bg-[#2A4AD4] text-white transition-all cursor-pointer"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? "Processing..." : "Send project brief"}
                        {status !== "loading" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                      </Button>
                    </motion.form>
                  ) : (
                    /* DYNAMIC AGENTIC AI MODE VIEW */
                    <motion.div
                      key="ai-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8"
                    >
                      {/* Left: Chat Window */}
                      <div className="flex flex-col h-[580px] bg-white border border-[#E5E2DC] rounded-lg p-5">
                        
                        {/* Conversation stream */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
                          {chatMessages.map((msg, idx) => (
                            <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                              <div className={cn(
                                "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                                msg.role === "user" 
                                  ? "bg-[#355CFF] text-white rounded-br-none" 
                                  : "bg-[#F5F3EE] text-[#1A1A1A] rounded-bl-none border border-[#E5E2DC]"
                              )}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          
                          {isAIChatLoading && (
                            <div className="flex justify-start">
                              <div className="bg-[#F5F3EE] border border-[#E5E2DC] rounded-lg rounded-bl-none p-3 max-w-[85%] flex items-center gap-2">
                                <span className="text-xs text-[#6B7280]">AI Architect is drafting</span>
                                <div className="flex gap-1">
                                  <span className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce delay-100" />
                                  <span className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce delay-200" />
                                  <span className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce delay-300" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Input console */}
                        {!isReadyToSubmit ? (
                          <form onSubmit={handleSendChatMessage} className="flex gap-2 items-end shrink-0">
                            <Input
                              value={currentChatInput}
                              onChange={(e) => setCurrentChatInput(e.target.value)}
                              placeholder="Describe your project requirements here..."
                              className="flex-1 h-12 bg-white border border-[#E5E2DC] px-4"
                              disabled={isAIChatLoading}
                            />
                            <Button 
                              type="submit" 
                              disabled={isAIChatLoading || !currentChatInput.trim()}
                              className="h-12 w-12 rounded-md p-0 flex items-center justify-center bg-[#355CFF] text-white cursor-pointer hover:bg-[#2A4AD4]"
                            >
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </form>
                        ) : (
                          <div className="border-t border-[#E5E2DC] pt-4 space-y-4 shrink-0">
                            <p className="text-xs font-bold text-green-600 bg-green-50 p-2.5 rounded-md border border-green-100 flex items-center gap-2">
                              <CheckCircle2 size={14} /> Roadmap draft completed! Enter details below to submit.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <Input 
                                required 
                                placeholder="Your Name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="h-11 bg-white border border-[#E5E2DC] px-4"
                              />
                              <Input 
                                required 
                                type="email"
                                placeholder="Your Email" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="h-11 bg-white border border-[#E5E2DC] px-4"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Phone Number (Optional)" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="h-11 flex-1 bg-white border border-[#E5E2DC] px-4"
                              />
                              <Button 
                                onClick={handleAISubmit} 
                                disabled={status === "loading" || !formData.name || !formData.email}
                                className="h-11 px-6 bg-[#355CFF] text-white hover:bg-[#2A4AD4] cursor-pointer"
                              >
                                {status === "loading" ? "Submitting..." : "Submit AI Brief"}
                              </Button>
                            </div>
                            {status === "error" && (
                              <div className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-md border border-red-100">
                                {errorMessage}
                              </div>
                            )}
                            <div className="flex justify-center py-1">
                              <Turnstile
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                                onSuccess={(token) => setTurnstileToken(token)}
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setIsReadyToSubmit(false)} 
                              className="text-xs text-[#6B7280] hover:text-[#355CFF] block mx-auto underline font-medium cursor-pointer"
                            >
                              Keep chatting to customize roadmap
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Live Blueprint Cards */}
                      <div className="bg-[#F9F8F6] border border-[#E5E2DC] rounded-lg p-5 flex flex-col h-[580px] overflow-hidden">
                        <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E2DC] flex items-center gap-2">
                          <Sparkles size={15} className="text-[#355CFF]" /> Live Strategy Blueprint
                        </h3>
                        
                        {/* Service / Budget auto-indicators */}
                        <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                          <div className="bg-white border border-[#E5E2DC] rounded-md p-3">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Service Class</p>
                            <p className="text-xs font-bold text-[#1A1A1A]">
                              {aiService ? (
                                aiService === "website" ? "Website Development" :
                                aiService === "automation" ? "Workflow Automation" :
                                aiService === "hosting" ? "Hosting & Maintenance" :
                                aiService === "ai" ? "AI Integrations" : "Full Bundle"
                              ) : (
                                <span className="text-[#6B7280] font-normal italic">Analyzing...</span>
                              )}
                            </p>
                          </div>
                          
                          <div className="bg-white border border-[#E5E2DC] rounded-md p-3">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Estimated Budget</p>
                            <p className="text-xs font-bold text-[#1A1A1A]">
                              {aiBudget ? (
                                aiBudget === "under-15k" ? "Under INR 15,000" :
                                aiBudget === "15k-35k" ? "INR 15,000 - 35,000" :
                                aiBudget === "35k-70k" ? "INR 35,000 - 70,000" :
                                aiBudget === "above-70k" ? "Above INR 70,000" : "Overseas (USD)"
                              ) : (
                                <span className="text-[#6B7280] font-normal italic">Analyzing...</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Plan Roadmap */}
                        <div className="flex-1 overflow-y-auto pr-1">
                          {aiTasks.length > 0 ? (
                            <Plan tasks={aiTasks} />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E5E2DC] rounded-md">
                              <Sparkles size={32} className="text-[#6B7280] opacity-30 mb-3 animate-pulse" />
                              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Roadmap Ingesting</h4>
                              <p className="text-xs text-[#6B7280] max-w-[220px] mt-1.5 leading-relaxed">
                                Chat with the AI Strategy Architect on the left to instantly map out your task breakdown, tools, and execution phases.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Finish trigger */}
                        {aiTasks.length > 0 && !isReadyToSubmit && (
                          <Button 
                            onClick={() => setIsReadyToSubmit(true)}
                            className="mt-4 w-full h-11 bg-white hover:bg-neutral-50 text-[#355CFF] border border-[#355CFF]/20 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            Finish & Lock in Strategy
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
