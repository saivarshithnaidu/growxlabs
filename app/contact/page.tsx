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
        throw new Error("Failed to send message properly. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Let&apos;s Build <span className="text-gradient">Something Great.</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next project or have a question? 
            Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re currently accepting new projects and partnerships. 
              Fill out the form or use our direct contact info below.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "hello@growxlabs.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
                { icon: MapPin, label: "Office", value: "123 Innovation Drive, Tech City" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof Placeholder */}
            <div className="pt-12">
              <p className="text-sm font-semibold text-muted-foreground mb-4">TRUSTED BY INNOVATORS AT</p>
              <div className="flex flex-wrap gap-8 opacity-40">
                <span className="text-2xl font-bold text-white tracking-widest">TECHCORP</span>
                <span className="text-2xl font-bold text-white tracking-widest">SKYLAB</span>
                <span className="text-2xl font-bold text-white tracking-widest">NEXUS</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 md:p-10">
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. A strategy expert will review your message 
                  and contact you shortly.
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline" className="mt-4">
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <Input 
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input 
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">How can we help?</label>
                  <Textarea 
                    required
                    placeholder="Tell us about your project, goals, and timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-500/10 p-4 rounded-lg">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg" 
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
