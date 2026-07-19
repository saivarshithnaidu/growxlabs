"use client";

import React, { useState, useEffect } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface AttendanceTrackerProps {
  attendance: any[];
  onClockIn: () => void;
  onClockOut: () => void;
  isCheckedIn: boolean;
}

export function AttendanceTracker({ attendance, onClockIn, onClockOut, isCheckedIn }: AttendanceTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Weekly heatmap data (last 7 days)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heatmapData = weekDays.map((day, i) => {
    const record = attendance[i];
    const hours = record?.working_hours || 0;
    return { day, hours };
  });

  const getHeatColor = (hours: number) => {
    if (hours === 0) return "bg-neutral-100 border-neutral-200";
    if (hours < 4) return "bg-red-100 border-red-300 text-red-700";
    if (hours < 6) return "bg-amber-100 border-amber-300 text-amber-700";
    if (hours < 8) return "bg-green-100 border-green-300 text-green-700";
    return "bg-blue-100 border-blue-300 text-blue-700";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Digital Clock */}
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm col-span-1 lg:col-span-2 flex flex-col items-center justify-center">
          <Clock className="h-6 w-6 text-blue-500 mb-2" />
          <h2 className="text-4xl font-black text-neutral-900 font-mono tracking-wider">
            {formatTime(currentTime)}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-medium">{formatDate(currentTime)}</p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClockIn}
              disabled={isCheckedIn}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                isCheckedIn
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:scale-[1.02]"
              )}
            >
              <LogIn className="h-3.5 w-3.5" /> Check In
            </button>
            <button
              onClick={onClockOut}
              disabled={!isCheckedIn}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                !isCheckedIn
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg hover:scale-[1.02]"
              )}
            >
              <LogOut className="h-3.5 w-3.5" /> Check Out
            </button>
          </div>
        </Card>

        {/* Today's Status */}
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Today&apos;s Status</h4>
          <div className="space-y-3">
            <div>
              <span className="text-[9px] text-neutral-400 font-medium">Status</span>
              <p className="text-sm font-bold text-neutral-800">
                {isCheckedIn ? (
                  <span className="text-green-600 bg-green-500/10 px-2 py-1 rounded text-[10px] font-bold">● Clocked In</span>
                ) : (
                  <span className="text-neutral-400 bg-neutral-100 px-2 py-1 rounded text-[10px] font-bold">○ Not Clocked</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 font-medium">Check-In Time</span>
              <p className="text-sm font-mono font-bold text-neutral-800">
                {attendance[0]?.check_in ? new Date(attendance[0].check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </p>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 font-medium">Working Hours</span>
              <p className="text-sm font-mono font-bold text-neutral-800">{attendance[0]?.working_hours || "0.00"}h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Heatmap */}
      <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">Weekly Attendance Heatmap</h4>
        <div className="grid grid-cols-7 gap-2">
          {heatmapData.map((item) => (
            <div
              key={item.day}
              className={cn("rounded-lg border p-3 text-center transition-all", getHeatColor(item.hours))}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider">{item.day}</p>
              <p className="text-sm font-mono font-black mt-1">{item.hours > 0 ? `${item.hours}h` : "—"}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 justify-end">
          <span className="flex items-center gap-1 text-[8px] text-neutral-400"><span className="w-2 h-2 rounded bg-red-200" />&lt;4h</span>
          <span className="flex items-center gap-1 text-[8px] text-neutral-400"><span className="w-2 h-2 rounded bg-amber-200" />4-6h</span>
          <span className="flex items-center gap-1 text-[8px] text-neutral-400"><span className="w-2 h-2 rounded bg-green-200" />6-8h</span>
          <span className="flex items-center gap-1 text-[8px] text-neutral-400"><span className="w-2 h-2 rounded bg-blue-200" />8h+</span>
        </div>
      </Card>
    </div>
  );
}
