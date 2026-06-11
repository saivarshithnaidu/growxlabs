"use client";

import React, { useState } from "react";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";

export function AstroChatCTA() {
  const [value, setValue] = useState("Schedule a promotional campaign to go out this Friday at 9 AM.");

  const handleSubmit = () => {
    if (!value || typeof value !== "string" || value.trim().length === 0) return;
    const waUrl = `https://wa.me/918790907144?text=${encodeURIComponent(value)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="relative mx-auto rounded-[32px] overflow-hidden border border-white/5 bg-black shadow-2xl group select-none w-[95vw] h-[420px] sm:w-[90vw] sm:h-[500px] md:w-[90%] md:max-w-[1100px] md:h-[620px] md:aspect-[1100/620] flex items-center justify-center">
      {/* Background Image */}
      <img
        src="/images/astronaut.jpg"
        alt="GrowXLabs Astronaut Illustration"
        className="absolute inset-0 w-full h-full object-cover object-bottom transition-transform duration-[1200ms] group-hover:scale-[1.015] select-none pointer-events-none"
      />
      {/* Dark overlay for premium contrast */}
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

      {/* Premium Integrated Chat Box */}
      <div className="absolute bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] md:w-[88%] max-w-[950px] bg-white/95 backdrop-blur-md border border-[#FF6B4A]/80 rounded-[24px] p-5 md:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] h-auto md:h-[135px] flex flex-col justify-between z-10 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
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
            className="text-neutral-800 text-sm md:text-base font-sans font-medium placeholder:text-neutral-400 bg-transparent min-h-0 py-1"
          />
          <div className="flex justify-between items-center w-full pt-3 border-t border-neutral-100">
            <span className="text-neutral-400 font-bold text-xl leading-none cursor-pointer hover:text-neutral-600 select-none">+</span>
            <ChatInputSubmit
              className="w-9 h-9 rounded-full bg-[#FF6B4A] hover:bg-[#ff5733] border-none text-white transition-colors shadow-md flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 cursor-pointer"
            />
          </div>
        </ChatInput>
      </div>
    </div>
  );
}
