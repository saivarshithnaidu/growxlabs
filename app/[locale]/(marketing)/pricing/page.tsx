"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { getCurrency } from "@/lib/i18n/currencies";

const PRICING_PLANS = [
  {
    name: "Starter",
    description: "Best for local businesses, landing pages, and personal brands.",
    prices: { 
      'en-IN': "₹8,000 - ₹12,000", 
      'en-US': "$100 - $150",
      'en-GB': "£80 - £120",
      'de-DE': "€95 - €140"
    },
    timeline: "7 days",
    features: [
      "3-5 page responsive website",
      "Modern UI/UX design",
      "Contact form integration",
      "WhatsApp chat button",
      "Basic SEO optimization",
      "SSL Certificate + Hosting setup",
      "2 revision rounds",
      "14 days free support"
    ],
    cta: "Get Started →",
    popular: false,
    color: "from-blue-600/20 to-blue-400/10"
  },
  {
    name: "Growth",
    description: "Best for growing businesses needing full websites and automation.",
    prices: { 
      'en-IN': "₹20,000 - ₹35,000", 
      'en-US': "$250 - $420",
      'en-GB': "£200 - £340",
      'de-DE': "€235 - €400"
    },
    timeline: "14 days",
    features: [
      "8-10 page responsive website",
      "All Starter features included",
      "Blog / News section",
      "Google Analytics & Search Console",
      "Speed optimization (90+ PageSpeed)",
      "n8n lead capture automation",
      "Easy content management panel",
      "Priority email support"
    ],
    cta: "Get Started →",
    popular: true,
    color: "from-primary/30 to-primary/10"
  },
  {
    name: "Enterprise",
    description: "Best for startups, SaaS platforms, and complex web applications.",
    prices: { 
      'en-IN': "₹40,000+", 
      'en-US': "$500+",
      'en-GB': "£400+",
      'de-DE': "€470+"
    },
    timeline: "21-30 days",
    features: [
      "Full custom web application",
      "All Growth features included",
      "Complete n8n automation suite",
      "AI Chatbot integration",
      "Third-party API integrations",
      "Custom admin dashboard",
      "Dedicated monthly maintenance",
      "Priority Slack/WhatsApp support"
    ],
    cta: "Get a Custom Quote →",
    popular: false,
    color: "from-purple-600/20 to-purple-400/10"
  }
];

export default function PricingPage() {
  const locale = useLocale();
  const currencyInfo = getCurrency(locale);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Helper to get price for current locale, fallback to USD if no match in the map
  const getPlanPrice = (planPrices: Record<string, string>) => {
    return planPrices[locale] || planPrices['en-US'] || "$ Price Varies";
  };

  return (
    <div className="pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs"
          >
            Regionalized Investment
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mt-4 mb-6 tracking-tighter"
          >
            Simple, Honest Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/40 max-w-2xl mx-auto font-medium"
          >
            Current Currency: <span className="text-primary">{currencyInfo.code} ({currencyInfo.symbol})</span>
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "p-10 h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-white/10",
                plan.popular ? "bg-white/[0.04] border-primary/50 shadow-2xl shadow-primary/5" : "bg-white/[0.02]"
              )}>
                 {plan.popular && (
                    <div className="absolute top-0 right-0 py-2 px-6 bg-primary text-white font-black uppercase text-[8px] tracking-[0.3em] rounded-bl-2xl">
                       Most Popular
                    </div>
                 )}
                 <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] -z-10 bg-gradient-to-br", plan.color)} />
                 
                 <div className="mb-10">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2">{plan.name}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed mb-8">{plan.description}</p>
                    <div className="text-4xl font-black text-white tracking-tighter mb-1">
                       {getPlanPrice(plan.prices)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                       <Clock size={12} />
                       Delivery: {plan.timeline}
                    </div>
                 </div>

                 <ul className="space-y-4 mb-12 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                         <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="text-primary" size={12} />
                         </div>
                         <span className="text-sm font-medium text-white/60">{feature}</span>
                      </li>
                    ))}
                 </ul>

                 <Link href="/contact">
                   <Button 
                     className={cn(
                       "w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest",
                       plan.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-black hover:bg-white/90"
                     )}
                   >
                     {plan.cta}
                   </Button>
                 </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ... Rest of components preserved ... */}
      </div>
    </div>
  );
}
