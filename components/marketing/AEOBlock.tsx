import React from "react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
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
    <div className="w-full p-6 sm:p-8 md:p-10 rounded-lg border border-[#E5E2DC] bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden mb-8 animate-fade-in-up">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#355CFF]/[0.02] blur-[80px] -z-10" />

      <div className="flex flex-col gap-8">
        {/* Question */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-md bg-[#355CFF]/10 flex items-center justify-center shrink-0 border border-[#355CFF]/15">
            <HelpCircle className="w-6 h-6 text-[#355CFF]" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] leading-tight tracking-tight">
              {question}
            </h3>
          </div>
        </div>

        {/* Direct Answer */}
        <div className="sm:pl-14">
          <div className="relative">
            <p className="text-lg md:text-xl text-[#1A1A1A] font-bold leading-relaxed border-l-4 border-[#355CFF] pl-6 py-3 bg-[#F5F3EE] rounded-r-lg tracking-tight">
              {answer}
            </p>
          </div>
        </div>

        {/* Explanation & Example */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:pl-14 pt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#355CFF] font-bold text-[10px] uppercase tracking-[0.25em]">
              <Lightbulb className="w-4 h-4" /> Explanation
            </div>
            <p className="text-[#6B7280] text-[15px] leading-relaxed font-medium">
              {explanation}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#355CFF] font-bold text-[10px] uppercase tracking-[0.25em]">
              <PlayCircle className="w-4 h-4" /> Real-world Example
            </div>
            <p className="text-[#6B7280] text-[15px] leading-relaxed font-medium">
              {example}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="sm:pl-14 pt-4">
          <Link href={ctaHref} className="block sm:inline-block">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-md border-[#355CFF]/30 text-[#355CFF] hover:bg-[#355CFF] hover:text-white transition-all group/btn h-12 px-10 font-bold uppercase tracking-widest text-[11px]"
              trackEvent="cta_clicked"
              trackProperties={{ location: 'aeo_block', text: ctaText, question }}
            >
              {ctaText} <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
