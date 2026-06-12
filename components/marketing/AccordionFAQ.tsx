"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "@/navigation";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function AccordionFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const isBlog = pathname?.includes("/blog");

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Dynamic theme variables
  const hoverText = isBlog ? "group-hover:text-[#355CFF]" : "group-hover:text-[#C0F0FB]";
  const activeText = isBlog ? "text-[#355CFF]" : "text-[#C0F0FB]";

  return (
    <div className="w-full">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border-t border-white/10 last:border-b border-white/10 transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
            >
              <div className="flex gap-6 items-start pr-4">
                <span className="font-mono text-xs text-white/30 pt-1 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className={cn(
                  "text-white text-[16px] sm:text-[18px] font-sans font-semibold tracking-tight leading-snug transition-colors",
                  isOpen ? activeText : "text-white",
                  hoverText
                )}>
                  {faq.question}
                </h4>
              </div>
              <Plus
                className={cn(
                  "w-5 h-5 text-white/40 group-hover:text-white shrink-0 transition-transform duration-300",
                  isOpen ? "rotate-45 text-white" : ""
                )}
              />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isOpen ? "max-h-[300px] opacity-100 pb-6" : "max-h-0 opacity-0"
              )}
            >
              <div className="pl-10 pr-4 sm:pl-12">
                <p className="text-white/70 font-sans text-[15px] sm:text-[16px] leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



