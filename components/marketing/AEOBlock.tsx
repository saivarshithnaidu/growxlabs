import React from "react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Reveal } from "./Reveal";
import { HelpCircle, ArrowRight, Lightbulb, PlayCircle } from "lucide-react";

interface AEOBlockProps {
  question: string;
  answer: string;
  explanation: string;
  example: string;
  ctaText: string;
  ctaHref: string;
}

export function AEOBlock({
  question,
  answer,
  explanation,
  example,
  ctaText,
  ctaHref,
}: AEOBlockProps) {
  return (
    <Reveal y={20}>
      <div className="w-full p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A86B]/[0.02] blur-[80px] -z-10" />
        
        <div className="flex flex-col gap-6">
          {/* Question */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00A86B]/10 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-[#00A86B]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {question}
              </h3>
            </div>
          </div>

          {/* Direct Answer */}
          <div className="pl-14">
            <p className="text-lg md:text-xl text-white font-medium italic border-l-2 border-[#00A86B] pl-6 py-1">
              "{answer}"
            </p>
          </div>

          {/* Explanation & Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-14 pt-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#00A86B] font-bold text-xs uppercase tracking-widest">
                <Lightbulb className="w-4 h-4" /> Explanation
              </div>
              <p className="text-[#A0A0A0] leading-relaxed">
                {explanation}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#00A86B] font-bold text-xs uppercase tracking-widest">
                <PlayCircle className="w-4 h-4" /> Real-world Example
              </div>
              <p className="text-[#A0A0A0] leading-relaxed italic">
                {example}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pl-14 pt-4">
            <Link href={ctaHref}>
              <Button 
                variant="outline" 
                className="rounded-full border-[#00A86B]/30 text-[#00A86B] hover:bg-[#00A86B] hover:text-white transition-all group/btn h-10 px-6"
              >
                {ctaText} <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
