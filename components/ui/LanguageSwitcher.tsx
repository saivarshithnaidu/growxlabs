"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";

const REGIONS = [
  {
    name: "AMERICAS",
    languages: [
      { code: "en-US", name: "English (US)", flag: "🇺🇸" },
      { code: "pt-BR", name: "Portuguese (BR)", flag: "🇧🇷" },
      { code: "es-ES", name: "Español", flag: "🇪🇸" }
    ]
  },
  {
    name: "EUROPE",
    languages: [
      { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
      { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
      { code: "fr-FR", name: "Français", flag: "🇫🇷" }
    ]
  },
  {
    name: "ASIA PACIFIC",
    languages: [
      { code: "en-AU", name: "English (AU)", flag: "🇦🇺" },
      { code: "en-IN", name: "English (IN)", flag: "🇮🇳" },
      { code: "te-IN", name: "తెలుగు", flag: "🇮🇳" },
      { code: "hi-IN", name: "हिन्दी", flag: "🇮🇳" },
      { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
      { code: "zh-CN", name: "中文", flag: "🇨🇳" },
      { code: "ko-KR", name: "한국어", flag: "🇰🇷" },
      { code: "id-ID", name: "Indonesian", flag: "🇮🇩" }
    ]
  },
  {
    name: "MIDDLE EAST",
    languages: [
      { code: "ar-AE", name: "العربية (UAE)", flag: "🇦🇪" }
    ]
  }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const allLanguages = REGIONS.flatMap(r => r.languages);
  const currentLang = allLanguages.find(l => l.code === locale) || allLanguages[0];

  const handleSwitch = (newLocale: string) => {
    // 1. Save to localStorage for preference persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("user-locale", newLocale);
      // next-intl automatically sets NEXT_LOCALE cookie when using router.replace
    }
    
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <Globe size={14} className="text-primary group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white">
          {currentLang.name}
        </span>
        <ChevronDown size={12} className={`text-white/20 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 bg-[#0A0F1E] border border-white/10 rounded-2xl shadow-2xl p-4 z-[70] max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="space-y-6">
                {REGIONS.map((region) => (
                  <div key={region.name}>
                    <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 ml-1">
                      {region.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {region.languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleSwitch(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            locale === lang.code 
                              ? "bg-primary text-black" 
                              : "text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span>{lang.name}</span>
                          <span className="opacity-60">{lang.flag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
