"use client";

import React, { useState } from "react";
import { Play, TrendingDown, Target, Zap, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Sprint {
  id: string;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
  status: 'FUTURE' | 'ACTIVE' | 'COMPLETED';
  capacity_story_points: number;
  completed_story_points: number;
}

interface SprintManagerProps {
  sprints: Sprint[];
  onStartSprint?: (id: string) => Promise<void>;
  onCompleteSprint?: (id: string) => Promise<void>;
}

export function SprintManager({ sprints, onStartSprint, onCompleteSprint }: SprintManagerProps) {
  const activeSprint = sprints.find(s => s.status === "ACTIVE");
  const futureSprints = sprints.filter(s => s.status === "FUTURE");

  // Burn-down points estimation
  const totalPoints = activeSprint?.capacity_story_points || 30;
  const completedPoints = activeSprint?.completed_story_points || 12;
  const remainingPoints = Math.max(0, totalPoints - completedPoints);

  // CSS Burndown simulator
  const daysTotal = 10; // 2 week sprint
  const idealPointsPerDay = totalPoints / daysTotal;
  const burndownData = Array.from({ length: daysTotal + 1 }, (_, day) => {
    const ideal = totalPoints - (day * idealPointsPerDay);
    // Simulate actual burndown path
    const actual = day <= 4 
      ? totalPoints - (day * (idealPointsPerDay * 0.75)) 
      : Math.max(0, totalPoints - 4 * (idealPointsPerDay * 0.75) - (day - 4) * (idealPointsPerDay * 1.2));
    return { day, ideal, actual };
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Burn-down and Active Sprint info */}
      <div className="md:col-span-2 space-y-6">
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-3.5 mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-[#0075de]" /> Active Sprint Dashboard
              </h3>
              <p className="text-[10px] font-bold text-[#0075de] uppercase tracking-wider mt-1">{activeSprint?.name || "No Active Sprint"}</p>
            </div>
            {activeSprint && onCompleteSprint && (
              <Button 
                onClick={() => onCompleteSprint(activeSprint.id)}
                className="h-8 text-[9px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-green-600 hover:bg-neutral-50 rounded-md"
              >
                Complete Sprint
              </Button>
            )}
          </div>

          {activeSprint ? (
            <div className="space-y-6">
              <div className="bg-[#f6f5f4] p-4 rounded-md border border-[#e6e6e6] text-xs font-semibold">
                <span className="text-[10px] font-bold uppercase text-neutral-450 block mb-1">Sprint Goal</span>
                <p className="text-neutral-900 leading-relaxed font-medium">{activeSprint.goal || "No goal specified."}</p>
              </div>

              {/* Progress trajectory burndown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <span>Burn-down Progress Chart</span>
                  <span>{remainingPoints} SP remaining / {totalPoints} SP total</span>
                </div>
                
                <div className="h-44 border-b border-l border-[#e6e6e6] relative flex items-end gap-1 px-4 pb-2 pt-8 font-mono text-[8px] text-neutral-450">
                  {burndownData.map((d) => {
                    const idealPercent = (d.ideal / totalPoints) * 100;
                    const actualPercent = (d.actual / totalPoints) * 100;

                    return (
                      <div key={d.day} className="flex-1 flex flex-col justify-end items-center h-full relative group">
                        {/* Ideal line guide */}
                        <div 
                          className="absolute w-2 h-2 rounded-full bg-neutral-300 border border-white z-10 transition-transform group-hover:scale-125"
                          style={{ bottom: `calc(${idealPercent}% - 4px)` }}
                          title={`Day ${d.day} Ideal: ${Math.round(d.ideal)} SP`}
                        />
                        {/* Actual line guide */}
                        <div 
                          className="absolute w-2.5 h-2.5 rounded-full bg-[#0075de] border-2 border-white z-20 transition-transform group-hover:scale-125 shadow-sm"
                          style={{ bottom: `calc(${actualPercent}% - 5px)` }}
                          title={`Day ${d.day} Actual: ${Math.round(d.actual)} SP`}
                        />
                        <span className="mt-2 text-neutral-400">D{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs font-semibold text-neutral-400">
              There is currently no active sprint. Activate a sprint to track burndown charts.
            </div>
          )}
        </Card>
      </div>

      {/* Sprints backlog planning */}
      <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm h-fit">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Sprint Backlog Planning</h3>
        {futureSprints.length === 0 ? (
          <div className="text-center py-8 text-xs font-semibold text-neutral-400">No upcoming sprints scheduled.</div>
        ) : (
          <div className="space-y-4">
            {futureSprints.map((sp) => (
              <div key={sp.id} className="border border-[#e6e6e6] p-4 rounded-md space-y-3 hover:border-[#0075de]/30 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-snug">{sp.name}</h4>
                    <span className="text-[9px] font-mono text-neutral-400">{sp.start_date} to {sp.end_date}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#f6f5f4] border border-[#e6e6e6] text-[#0075de] px-2 py-0.5 rounded-full shrink-0">
                    {sp.capacity_story_points} SP
                  </span>
                </div>
                {onStartSprint && (
                  <Button 
                    onClick={() => onStartSprint(sp.id)}
                    className="w-full h-8 text-[9px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/95 rounded-md flex items-center justify-center gap-1"
                  >
                    <Play size={10} fill="white" /> Start Sprint
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
