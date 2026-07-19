"use client";

import React from "react";
import { ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = ["APPLIED", "SCREENING", "INTERVIEW", "ASSESSMENT", "OFFER", "HIRED"];
const STAGE_COLORS: Record<string, string> = {
  APPLIED: "border-blue-300 bg-blue-50",
  SCREENING: "border-violet-300 bg-violet-50",
  INTERVIEW: "border-amber-300 bg-amber-50",
  ASSESSMENT: "border-orange-300 bg-orange-50",
  OFFER: "border-emerald-300 bg-emerald-50",
  HIRED: "border-green-300 bg-green-50",
};
const STAGE_HEADER_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-500",
  SCREENING: "bg-violet-500",
  INTERVIEW: "bg-amber-500",
  ASSESSMENT: "bg-orange-500",
  OFFER: "bg-emerald-500",
  HIRED: "bg-green-500",
};

interface RecruitmentPipelineProps {
  candidates: any[];
  onUpdateStage: (id: string, stage: string) => void;
}

export function RecruitmentPipeline({ candidates, onUpdateStage }: RecruitmentPipelineProps) {
  const getNextStage = (current: string) => {
    const idx = STAGES.indexOf(current);
    return idx < STAGES.length - 1 ? STAGES[idx + 1] : null;
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);
          return (
            <div key={stage} className="w-[220px] flex-shrink-0">
              {/* Column Header */}
              <div className={cn("rounded-t-lg px-3 py-2 flex items-center justify-between", STAGE_HEADER_COLORS[stage])}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">{stage.replace("_", " ")}</span>
                <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{stageCandidates.length}</span>
              </div>

              {/* Candidate Cards */}
              <div className={cn("border-x border-b rounded-b-lg p-2 space-y-2 min-h-[200px]", STAGE_COLORS[stage])}>
                {stageCandidates.length === 0 && (
                  <p className="text-[9px] text-neutral-400 text-center py-8 font-medium">No candidates</p>
                )}
                {stageCandidates.map((candidate: any) => (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-lg border border-neutral-200 p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-xs font-bold text-neutral-800 truncate">{candidate.full_name}</p>
                    <p className="text-[9px] text-neutral-400 truncate">{candidate.email}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-neutral-600">{candidate.score || 0}</span>
                      </div>
                      {getNextStage(stage) && (
                        <button
                          onClick={() => onUpdateStage(candidate.id, getNextStage(stage)!)}
                          className="flex items-center gap-0.5 text-[8px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                        >
                          Advance <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
