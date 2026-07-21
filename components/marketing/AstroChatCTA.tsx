"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";

// Lazy-load GPU 3D Earth Scene to ensure 60 FPS performance, zero SSR hydration overhead, and tree shaking
const EarthScene = dynamic(() => import("@/components/earth/Scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#53D9FF]/30 border-t-[#53D9FF] rounded-full animate-spin" />
    </div>
  ),
});

export function AstroChatCTA() {
  const [value, setValue] = useState("Schedule a promotional campaign to go out this Friday at 9 AM.");

  const handleSubmit = () => {
    if (!value || typeof value !== "string" || value.trim().length === 0) return;
    const waUrl = `https://wa.me/918790907144?text=${encodeURIComponent(value)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="relative mx-auto rounded-[32px] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl group select-none w-[95vw] h-[420px] sm:w-[90vw] sm:h-[500px] md:w-[90%] md:max-w-[1100px] md:h-[620px] md:aspect-[1100/620] flex items-center justify-center">
      {/* Interactive GPU 3D Earth Scene Background (Replaces static hero image) */}
      <div className="absolute inset-0 z-0">
        <EarthScene />
      </div>

      {/* Subtle vignette gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-[#050505]/30 pointer-events-none z-[5]" />

      {/* Premium Integrated Chat Prompt Input Box */}
      <div className="absolute bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] md:w-[88%] max-w-[950px] bg-white/95 dark:bg-[#0b0e14]/90 backdrop-blur-md border border-[#53D9FF]/40 rounded-[24px] p-5 md:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] h-auto md:h-[135px] flex flex-col justify-between z-10 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-[0_30px_60px_-15px_rgba(83,217,255,0.25)]">
        <ChatInput
          variant="unstyled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col justify-between bg-transparent"
        >
          <ChatInputTextArea
            variant="unstyled"
            placeholder="Ask GrowXLabs to build something..."
            className="text-neutral-800 dark:text-neutral-100 text-sm md:text-base font-sans font-medium placeholder:text-neutral-400 bg-transparent min-h-0 py-1"
          />
          <div className="flex justify-between items-center w-full pt-3 border-t border-neutral-200/50 dark:border-neutral-800">
            <span className="text-neutral-400 font-bold text-xl leading-none cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-200 select-none">+</span>
            <ChatInputSubmit
              className="w-9 h-9 rounded-full bg-[#53D9FF] hover:bg-[#3bc4eb] border-none text-black transition-colors shadow-md flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 cursor-pointer font-bold"
            />
          </div>
        </ChatInput>
      </div>
    </div>
  );
}
