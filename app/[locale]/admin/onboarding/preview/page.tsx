"use client";

import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPreviewPage() {
  return (
    <div className="bg-neutral-900 min-h-screen py-12">
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="mb-8 flex justify-between items-center text-white/40">
           <p className="text-xs font-bold uppercase tracking-widest">Document Preview Mode</p>
           <button 
             onClick={() => window.print()}
             className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all text-xs font-bold"
           >
             Test Print
           </button>
        </div>
        <OnboardingFlow />
      </div>
    </div>
  );
}
