"use client";

import { Check } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";

export default function SubscriptionsPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="text-center py-24 md:px-16 container mx-auto">
          <span className="text-[#00A86B] font-bold uppercase tracking-widest text-xs mb-4 block">
            SUBSCRIPTION PLANS
          </span>
          <h1 className="text-white font-bold text-[clamp(40px,7vw,56px)] leading-[1.1] max-w-[800px] mx-auto mb-6">
            Predictable Growth. Every Month.
          </h1>
          <p className="text-[#A0A0A0] text-lg max-w-[520px] mx-auto">
            No project gaps. No revenue uncertainty. Pick a plan and grow consistently.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">

          {/* Card 1: Basic */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[rgba(0,168,107,0.3)] transition-colors duration-300 h-full relative">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Online Presence</h3>
              <div className="text-3xl font-bold text-white mb-8">₹3,999<span className="text-[#A0A0A0] text-lg font-normal">/month</span></div>
              <div className="space-y-4 mb-8">
                {[
                  "Website hosting and monitoring",
                  "Minor updates (2/month)",
                  "Monthly performance report",
                  "SSL + security maintenance",
                  "Email & WhatsApp support",
                  "Response time: 24 hours"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-5 w-5 rounded-full bg-[#00A86B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-[#00A86B]" size={12} />
                    </div>
                    <span className="text-[15px] font-medium text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/contact" className="w-full mt-auto">
              <Button variant="outline" className="w-full h-12 rounded-xl text-white/70 hover:text-white border-white/10 hover:border-white/20">
                Start Basic
              </Button>
            </Link>
          </div>

          {/* Card 2: Standard (Most Important) */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[#00A86B] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[rgba(0,168,107,0.5)] transition-colors duration-300 h-full relative shadow-[0_0_30px_-5px_rgba(0,168,107,0.2)]">
            <div className="absolute top-4 right-4 bg-[#00A86B] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Growth System</h3>
              <div className="text-3xl font-bold text-white mb-8">₹7,999<span className="text-[#A0A0A0] text-lg font-normal">/month</span></div>
              <div className="space-y-4 mb-8">
                {[
                  "Everything in Basic",
                  "On-page SEO optimization",
                  "Search Console monitoring",
                  "Lead automation (n8n)",
                  "WhatsApp auto-reply",
                  "4 Instagram posts/month",
                  "Monthly strategy call (30 min)",
                  "Response: 12 hours"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-5 w-5 rounded-full bg-[#00A86B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-[#00A86B]" size={12} />
                    </div>
                    <span className="text-[15px] font-medium text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/contact" className="w-full mt-auto">
              <Button className="w-full h-12 rounded-xl bg-[#00A86B] hover:bg-[#00A86B]/90 text-white font-semibold flex items-center justify-center">
                Start Standard
              </Button>
            </Link>
          </div>

          {/* Card 3: Premium */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[rgba(0,168,107,0.3)] transition-colors duration-300 h-full relative">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Full Digital Growth</h3>
              <div className="text-3xl font-bold text-white mb-8">₹15,999<span className="text-[#A0A0A0] text-lg font-normal">/month</span></div>
              <div className="space-y-4 mb-8">
                {[
                  "Everything in Standard",
                  "Full SEO + AEO",
                  "Advanced automation workflows",
                  "Lead scoring + CRM updates",
                  "8 posts + 2 reels",
                  "CRO optimization",
                  "Priority support (4 hrs)",
                  "Weekly call"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="h-5 w-5 rounded-full bg-[#00A86B]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="text-[#00A86B]" size={12} />
                    </div>
                    <span className="text-[15px] font-medium text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/contact" className="w-full mt-auto">
              <Button className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-semibold transition-colors flex items-center justify-center">
                Start Premium
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 mb-12 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure where to start?</h2>
          <p className="text-[#A0A0A0] mb-8">We’ll guide you based on your business stage.</p>
          <Link href="/contact">
            <Button className="bg-[#00A86B] hover:bg-[#00A86B]/90 text-white rounded-xl h-12 px-8 font-semibold">
              Book Free Strategy Call &rarr;
            </Button>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="max-w-[700px] mx-auto mt-20">
          <div className="space-y-6">
            <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] rounded-2xl p-6">
              <h4 className="text-white font-bold mb-2">Q: Can I cancel anytime?</h4>
              <p className="text-[#A0A0A0]">A: Yes. Cancel with 15 days notice. No lock-in.</p>
            </div>
            <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] rounded-2xl p-6">
              <h4 className="text-white font-bold mb-2">Q: What if I need a website first?</h4>
              <p className="text-[#A0A0A0]">A: We build your website first (one-time), then you move to subscription.</p>
            </div>
            <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] rounded-2xl p-6">
              <h4 className="text-white font-bold mb-2">Q: Do you serve outside India?</h4>
              <p className="text-[#A0A0A0]">A: Yes. USD pricing available.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
