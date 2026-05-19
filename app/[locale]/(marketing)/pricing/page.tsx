import { Check, Calendar, FileText, Rocket, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/Reveal";
import PricingTracker from "./PricingTracker";

const VALUE_TRACKS = [
  {
    name: "Digital Presence",
    description: "A professional website that captures trust, answers buyer questions, and converts visitors into leads.",
    outcomes: [
      "Customers find you on Google",
      "Leads captured after hours",
      "Mobile-first performance",
      "WhatsApp and enquiry integration",
      "Clean handover documentation"
    ],
    cta: "Discuss Your Website",
    popular: false
  },
  {
    name: "Growth Automation",
    description: "Automation workflows for follow-ups, lead nurturing, reminders, customer win-back, and internal reporting.",
    outcomes: [
      "Zero missed follow-ups",
      "Leads contacted quickly",
      "Customers never go cold",
      "Save 20+ hours per week",
      "Works while you sleep"
    ],
    cta: "Discuss Automation",
    popular: true
  },
  {
    name: "Complete Digital System",
    description: "A connected website, automation layer, AI features, CRM flow, analytics, and ongoing maintenance.",
    outcomes: [
      "Full website and automation stack",
      "AI-powered features",
      "Custom admin dashboard",
      "Dedicated monthly support",
      "Scales as your business grows"
    ],
    cta: "Get a Custom Scope",
    popular: false
  }
];

const PRICING_PROCESS = [
  {
    icon: Calendar,
    title: "Book a free call",
    text: "We understand the business, current bottlenecks, audience, and what the website or automation must accomplish."
  },
  {
    icon: FileText,
    title: "Receive a proposal",
    text: "You get a custom scope, timeline, deliverables, and price based on what your project actually requires."
  },
  {
    icon: Rocket,
    title: "Start the build",
    text: "We begin with a structured milestone plan, regular updates, and a practical production handover."
  }
];

export async function generateMetadata() {
  return {
    title: "Pricing | GrowXLabsTech",
    description: "Transparent, value-based pricing for our AI-powered digital engineering services. No hidden costs, just results.",
    alternates: {
      canonical: "https://growxlabs.tech/pricing",
    }
  };
}

export default function PricingPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full">
      <PricingTracker />
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="text-center mb-20">
          <Reveal>
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#355CFF] mb-4 block">
              How we price
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-[clamp(40px,7vw,76px)] font-black text-[#1A1A1A] mb-7 tracking-tight leading-[1]">
              Custom systems, scoped around real business value.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-[#6B7280] max-w-[760px] mx-auto leading-relaxed">
              We do not force generic packages. Pricing depends on scope, timeline, integrations, content depth, automation complexity, and the level of ongoing support you need.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 mb-28">
          {VALUE_TRACKS.map((track, index) => (
            <Reveal
              key={track.name}
              delay={index * 0.1}
              className="h-full"
            >
              <Card className={cn(
                "p-7 md:p-8 h-full flex flex-col relative overflow-hidden",
                track.popular ? "border-[#355CFF]/35 shadow-md" : ""
              )}>
                {track.popular && (
                  <div className="absolute top-0 right-0 py-2 px-5 bg-[#355CFF] text-white font-bold uppercase text-[9px] tracking-[0.16em] rounded-bl-lg">
                    Most requested
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-black text-[#1A1A1A] tracking-tight mb-4">{track.name}</h3>
                  <p className="text-base text-[#6B7280] leading-relaxed">{track.description}</p>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280] mb-5">Expected outcomes</p>
                  {track.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-md bg-[#355CFF]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#355CFF]/15">
                        <Check className="text-[#355CFF]" size={12} aria-hidden="true" />
                      </div>
                      <span className="text-sm font-semibold text-[#1A1A1A]">{outcome}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-auto">
                  <Button
                    variant={track.popular ? "primary" : "outline"}
                    className="w-full h-12 rounded-md font-semibold text-[14px]"
                    trackEvent="cta_clicked"
                    trackProperties={{ location: "pricing_table", track: track.name, cta: track.cta }}
                  >
                    {track.cta}
                  </Button>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="space-y-12 mb-28">
          <div className="text-center">
            <h2 className="text-[clamp(30px,5vw,48px)] font-black text-[#1A1A1A] tracking-tight">How pricing actually works</h2>
            <p className="text-[#6B7280] mt-4 max-w-xl mx-auto">A transparent three-step process built for professional delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PROCESS.map((point, index) => (
              <Reveal
                key={point.title}
                delay={index * 0.1}
                scale={0.95}
                className="bg-white border border-[#E5E2DC] p-7 rounded-lg space-y-5 shadow-sm h-full"
              >
                <div className="p-3 bg-[#EDEAE4] rounded-md w-fit">
                  <point.icon className="text-[#355CFF]" size={24} aria-hidden="true" />
                </div>
                <h4 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{point.title}</h4>
                <p className="text-[#6B7280] text-sm leading-relaxed">{point.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal y={40}>
          <div className="relative bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg p-8 md:p-14 text-center space-y-9 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-14 opacity-[0.08]">
              <MessageSquare size={220} aria-hidden="true" className="text-white" />
            </div>

            <div className="space-y-5 relative z-10">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.28em]">Ready to scale?</span>
              <h2 className="text-[clamp(32px,6vw,64px)] font-black text-white tracking-tight leading-[1.05]">
                Not sure where to start?
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Most businesses start with one question: what is the fastest way to get more customers online? Let us answer that for free.
              </p>
            </div>

            <div className="space-y-7 relative z-10">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-9 rounded-md font-semibold text-base inline-flex items-center gap-2"
                  trackEvent="call_booked_intent"
                  trackProperties={{ location: "pricing_footer" }}
                >
                  Book your free 15 minute call
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
                {["No commitment", "No sales pressure", "Direct clarity"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                    <Check className="text-[#355CFF]" size={14} aria-hidden="true" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
