import { Check } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";

const planSummaries = [
  {
    title: "Online Presence",
    rows: [
      { k: "Mission", v: "Stay live, monitored, safe" },
      { k: "Cadence", v: "Monthly care + light updates" },
      { k: "Fit", v: "Early-stage sites" },
    ],
  },
  {
    title: "Growth System",
    rows: [
      { k: "Mission", v: "Capture + automate demand" },
      { k: "Cadence", v: "Weekly motion + strategy touch" },
      { k: "Fit", v: "Teams ready to scale leads" },
    ],
  },
  {
    title: "Full Digital Growth",
    rows: [
      { k: "Mission", v: "Own search, content, ops depth" },
      { k: "Cadence", v: "Priority lane + weekly steering" },
      { k: "Fit", v: "High-throughput growth orgs" },
    ],
  },
] as const;

/** Monthly retainers — lives on Services under `#subscriptions`. */
export function SubscriptionPlansSection() {
  return (
    <section id="subscriptions" className="scroll-mt-28 mb-24 border-t border-[#E5E2DC]/90 pt-16 md:pt-20">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
        <Reveal>
          <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#355CFF] mb-4 block">
            Subscription plans
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-black text-[#1A1A1A] tracking-tight leading-[1.12] mb-4">
            Predictable growth. Every month.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed">
            No project gaps. No revenue uncertainty. Pick a plan and grow consistently.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12 max-w-7xl mx-auto">
        {planSummaries.map((card, i) => (
          <Reveal key={card.title} delay={0.05 + i * 0.05}>
            <div
              className="h-full bg-[#FAF9F6] border border-[#E5E2DC] rounded-2xl p-6 md:p-7 shadow-sm relative overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
              }}
            >
              <h3 className="text-base font-black text-[#1A1A1A] tracking-tight mb-5">{card.title}</h3>
              <div className="divide-y divide-[#E5E2DC]">
                {card.rows.map((row) => (
                  <div key={`${card.title}-${row.k}`} className="grid grid-cols-[minmax(0,72px)_1fr] gap-x-3 py-3 first:pt-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280] leading-snug">
                      {row.k}
                    </span>
                    <span className="text-sm font-semibold text-[#1A1A1A] leading-snug">{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#355CFF]/30 transition-colors duration-300 h-full relative shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-8">Online Presence</h3>
            <div className="space-y-4 mb-8">
              {[
                "Website hosting and monitoring",
                "Minor updates (2/month)",
                "Monthly performance report",
                "SSL + security maintenance",
                "Email & WhatsApp support",
                "Response time: 24 hours",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#355CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="text-[#355CFF]" size={12} />
                  </div>
                  <span className="text-[15px] font-medium text-[#4B5563] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/contact" className="w-full mt-auto">
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
              Start Basic
            </Button>
          </Link>
        </div>

        <div className="bg-white border-2 border-[#355CFF] rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-colors duration-300 h-full relative shadow-[0_8px_40px_rgba(53,92,255,0.12)]">
          <div className="absolute top-4 right-4 bg-[#355CFF] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Most popular
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-8">Growth System</h3>
            <div className="space-y-4 mb-8">
              {[
                "Everything in Basic",
                "On-page SEO optimization",
                "Search Console monitoring",
                "Lead automation (n8n)",
                "WhatsApp auto-reply",
                "4 Instagram posts/month",
                "Monthly strategy call (30 min)",
                "Response: 12 hours",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#355CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="text-[#355CFF]" size={12} />
                  </div>
                  <span className="text-[15px] font-medium text-[#4B5563] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/contact" className="w-full mt-auto">
            <Button className="w-full h-12 rounded-xl font-semibold">Start Standard</Button>
          </Link>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-[#355CFF]/30 transition-colors duration-300 h-full relative shadow-sm">
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-8">Full Digital Growth</h3>
            <div className="space-y-4 mb-8">
              {[
                "Everything in Standard",
                "Full SEO + AEO",
                "Advanced automation workflows",
                "Lead scoring + CRM updates",
                "8 posts + 2 reels",
                "CRO optimization",
                "Priority support (4 hrs)",
                "Weekly call",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#355CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="text-[#355CFF]" size={12} />
                  </div>
                  <span className="text-[15px] font-medium text-[#4B5563] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/contact" className="w-full mt-auto">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold border-[#1A1A1A]/20 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]"
            >
              Start Premium
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
