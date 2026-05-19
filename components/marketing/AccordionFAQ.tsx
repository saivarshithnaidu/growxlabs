"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function AccordionFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((faq, index) => (
        <div
          key={index}
          className="rounded-lg border border-[#E5E2DC] bg-white overflow-hidden transition-all shadow-sm hover:border-[#355CFF]/20"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-6 text-left gap-4 group cursor-pointer"
          >
            <h4 className="text-[#1A1A1A] font-semibold text-[16px] leading-snug">
              {faq.question}
            </h4>
            <div className={`flex-shrink-0 w-8 h-8 rounded-md border border-[#E5E2DC] flex items-center justify-center transition-all duration-300 group-hover:border-[#355CFF]/30 ${openIndex === index ? 'bg-[#355CFF] border-[#355CFF] rotate-45' : ''}`}>
              <Plus className={`w-4 h-4 transition-colors ${openIndex === index ? 'text-white' : 'text-[#9CA3AF]'}`} />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0">
                  <p className="text-[#6B7280] text-[15px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
