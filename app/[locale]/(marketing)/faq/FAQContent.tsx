"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

interface FAQContentProps {
  categories: FAQCategory[];
}

export function FAQContent({ categories }: FAQContentProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <>
      <PageHero
        title="FAQ'S"
        viewingText="FAQ'S"
        exploreText="HELP & ANSWERS"
        tagline="QUESTIONS"
      />

      <div className="pb-24 px-6 md:px-10 xl:px-16 2xl:px-24 w-full border-t border-border/20 pt-16">
        <div className="max-w-[1400px] mx-auto">
          {categories.map((category, idx) => (
            <section key={category.id} className="mb-24 last:mb-32">
              {/* Subtle category header */}
              <div className="border-b border-border/10 pb-6 mb-12">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#C0F0FB] uppercase block mb-2">
                  // CATEGORY {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {category.title}
                </h2>
              </div>

              {/* Accordion list */}
              <div className="w-full">
                {category.items.map((faq, itemIdx) => {
                  const itemId = `${category.id}-${itemIdx}`;
                  const isOpen = activeId === itemId;
                  return (
                    <div
                      key={itemIdx}
                      className="border-t border-white/10 last:border-b border-white/10 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggle(itemId)}
                        className="w-full flex items-center justify-between py-8 text-left group cursor-pointer"
                      >
                        <div className="flex gap-8 items-start pr-4">
                          <span className="font-mono text-xs text-white/30 pt-1.5 shrink-0">
                            {String(itemIdx + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-white text-[16px] sm:text-[18px] font-sans font-bold tracking-tight leading-snug group-hover:text-[#C0F0FB] transition-colors">
                            {faq.question}
                          </h3>
                        </div>
                        <Plus 
                          className={`w-5 h-5 text-white/40 group-hover:text-white shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-white" : ""}`} 
                        />
                      </button>

                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-8" : "max-h-0 opacity-0"}`}
                      >
                        <div className="pl-12 pr-4 sm:pl-14">
                          <p className="text-white/70 font-sans text-[15px] sm:text-[16px] leading-relaxed max-w-4xl">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* CTA Box */}
          <div className="text-center rounded-lg bg-[#1A1A1A] p-8 md:p-12 mt-16">
            <h2 className="text-[clamp(28px,5vw,46px)] font-black text-white tracking-tight mb-4">
              Need a complete digital system?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Tell us what you sell, how leads currently arrive, and where your team loses time. We will map the system that fits.
            </p>
            <Link href="/contact">
              <Button className="h-14 px-8 rounded-md font-semibold inline-flex items-center gap-2">
                Start a project <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
