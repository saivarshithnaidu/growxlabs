"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";

// Lazy-load GPU 3D Earth Scene for optimal performance & zero SSR hydration overhead
const EarthScene = dynamic(() => import("@/components/earth/Scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[360px] sm:min-h-[440px] md:min-h-[500px] bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
    <section className="relative w-full max-w-[1400px] mx-auto flex flex-col items-center justify-start px-4 sm:px-6 pt-4 pb-16 select-none bg-[#050505] overflow-hidden">
      {/* 1. Large Uncropped Rotating Earth (Top Visual Hero) */}
      <div className="relative w-full max-w-[1000px] h-[360px] sm:h-[440px] md:h-[500px] flex items-center justify-center z-0">
        <EarthScene />
      </div>

      {/* 2. Comfortable 56px Vertical Whitespace Spacing between Earth and Prompt */}
      <div className="h-10 sm:h-12 md:h-14" />

      {/* 3. Primary Interactive Prompt Input (Positioned BELOW Earth in Normal Flow) */}
      <div 
        className="relative w-full max-w-[880px] p-5 sm:p-6 md:p-7 z-10 transition-all duration-300"
        style={{
          background: "rgba(12, 12, 14, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "28px",
          boxShadow: "0 18px 60px rgba(0, 0, 0, 0.45)",
        }}
      >
        <ChatInput
          variant="unstyled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-between bg-transparent"
        >
          <ChatInputTextArea
            variant="unstyled"
            placeholder="Ask GrowXLabs to build something..."
            className="text-white text-sm sm:text-base md:text-lg font-sans font-medium placeholder:text-neutral-500 bg-transparent min-h-[52px] py-1 border-none outline-none focus:outline-none focus:ring-0 leading-relaxed"
          />
          <div className="flex justify-between items-center w-full pt-4 border-t border-white/[0.06] mt-2">
            <span className="text-neutral-500 font-bold text-xl leading-none cursor-pointer hover:text-white select-none transition-colors px-1">+</span>
            <ChatInputSubmit
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-neutral-200 border-none text-black transition-colors shadow-md flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 cursor-pointer font-bold"
            />
          </div>
        </ChatInput>
      </div>
    </section>
  );
}
