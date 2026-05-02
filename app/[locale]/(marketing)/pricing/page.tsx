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
    description: "A professional website that works as your 24/7 sales machine by capturing leads, building trust, and converting visitors into customers automatically.",
    outcomes: [
      "Customers find you on Google",
      "Leads captured even at midnight",
      "Professional first impression",
      "Mobile first, fast loading",
      "WhatsApp and enquiry integration"
    ],
    cta: "Discuss Your Website →",
    popular: false,
    color: "from-blue-600/20 to-blue-400/10"
  },
  {
    name: "Growth Automation",
    description: "n8n automation systems that eliminate manual work. follow ups, lead nurturing, invoice reminders, customer win back. all running without you lifting a finger.",
    outcomes: [
      "Zero missed follow ups",
      "Leads contacted within 60 seconds",
      "Customers never go cold",
      "Save 20 plus hours per week",
      "Works while you sleep"
    ],
    cta: "Discuss Automation →",
    popular: true,
    color: "from-primary/30 to-primary/10"
  },
  {
    name: "Complete Digital System",
    description: "A complete digital infrastructure. website, automation, AI integration, and ongoing maintenance. built as one connected system for serious business growth.",
    outcomes: [
      "Full website and automation stack",
      "AI powered features",
      "Custom admin dashboard",
      "Dedicated monthly support",
      "Scales as your business grows"
    ],
    cta: "Get a Custom Scope →",
    popular: false,
    color: "from-purple-600/20 to-purple-400/10"
  }
];

const PRICING_PROCESS = [
  {
    icon: Calendar,
    title: "Book a Free Call",
    text: "15 minutes. We understand your business and what you actually need."
  },
  {
    icon: FileText,
    title: "We Send a Proposal",
    text: "Custom scope and pricing based on your exact requirements. No generic packages."
  },
  {
    icon: Rocket,
    title: "We Start Building",
    text: "50% to start. 50% on delivery. Simple, fair, no surprises."
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

        {/* Header */}
        <div className="text-center mb-24">
          <Reveal>
            <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#00A86B] mb-4 block">
              HOW WE WORK
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-[clamp(40px,7vw,72px)] font-bold text-white mb-8 tracking-tight leading-[1.1]">
              Systems Built for <br className="hidden md:block" /> Business Growth.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-[#A0A0A0] max-w-[720px] mx-auto font-medium leading-relaxed">
              Every project starts with understanding your exact problem. We do not sell packages. We solve problems. Pricing depends on scope, timeline, and what you actually need.
            </p>
          </Reveal>
        </div>

        {/* Value Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-40">
          {VALUE_TRACKS.map((track, i) => (
            <Reveal
              key={track.name}
              delay={i * 0.1}
              className="h-full"
            >
              <Card className={cn(
                "p-8 md:p-10 h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/5 shadow-2xl",
                track.popular ? "bg-white/[0.04] border-[#00A86B]/30 shadow-[#00A86B]/5" : "bg-white/[0.02]"
              )}>
                {track.popular && (
                  <div className="absolute top-0 right-0 py-2 px-6 bg-[#00A86B] text-white font-bold uppercase text-[9px] tracking-[0.2em] rounded-bl-2xl shadow-xl">
                    Most Popular
                  </div>
                )}
                <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] -z-10 bg-gradient-to-br", track.color)} />

                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">{track.name}</h3>
                  <p className="text-base text-[#A0A0A0] font-medium leading-relaxed">{track.description}</p>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">Expected Outcomes</p>
                  {track.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className="h-5 w-5 rounded-full bg-[#00A86B]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#00A86B]/20">
                        <Check className="text-[#00A86B]" size={10} />
                      </div>
                      <span className="text-base font-medium text-white/70 group-hover:text-white transition-colors">{outcome}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="mt-auto">
                  <Button
                    className={cn(
                      "w-full h-14 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all shadow-xl",
                      track.popular ? "bg-[#00A86B] text-white hover:bg-[#00A86B]/90" : "bg-white text-black hover:bg-white/90"
                    )}
                    trackEvent="cta_clicked"
                    trackProperties={{ location: 'pricing_table', track: track.name, cta: track.cta }}
                  >
                    {track.cta}
                  </Button>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* How Pricing Works Section */}
        <div className="space-y-16 mb-40">
          <div className="text-center">
            <h2 className="text-[clamp(28px,5vw,42px)] font-bold text-white tracking-tight">How Pricing Actually Works</h2>
            <p className="text-[#A0A0A0] mt-4 max-w-xl mx-auto">A transparent, three-step process built for professional engineering delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PROCESS.map((point, i) => (
              <Reveal
                key={i}
                delay={i * 0.1}
                scale={0.95}
                className="bg-white/[0.02] border border-white/5 p-10 rounded-3xl space-y-6 hover:border-primary/20 transition-all duration-500 h-full"
              >
                <div className="p-4 bg-primary/10 rounded-2xl w-fit border border-primary/20">
                  <point.icon className="text-primary" size={24} />
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">{point.title}</h4>
                <p className="text-[#A0A0A0] text-sm font-medium leading-relaxed">{point.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <Reveal y={40} className="relative group lg:pt-10">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[40px] p-8 md:p-20 text-center space-y-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] -z-10">
              <MessageSquare size={300} aria-hidden="true" />
            </div>

            <div className="space-y-6 relative z-10">
              <span className="text-[11px] font-bold text-primary uppercase tracking-[0.4em]">Ready to scale?</span>
              <h2 className="text-[clamp(32px,6vw,64px)] font-bold text-white tracking-tight leading-[1.1]">Not Sure Where <br /> to Start?</h2>
              <p className="text-lg md:text-xl text-[#A0A0A0] max-w-2xl mx-auto font-medium">
                Most businesses we work with start with one question: what is the fastest way to get more customers online? Let us answer that for free.
              </p>
            </div>

            <div className="space-y-8 relative z-10">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-16 px-12 rounded-full bg-[#00A86B] text-white font-bold text-lg hover:bg-[#00A86B]/90 transition-all shadow-2xl group/btn border-none"
                  trackEvent="call_booked_intent"
                  trackProperties={{ location: 'pricing_footer' }}
                >
                  Book Your Free 15 Minute Call
                  <ArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  <Check className="text-primary" size={14} /> No Commitment
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  <Check className="text-primary" size={14} /> No Sales Pressure
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                  <Check className="text-primary" size={14} /> Direct Clarity
                </div>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
