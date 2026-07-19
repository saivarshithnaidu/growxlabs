"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AttendanceTracker } from "@/components/admin/hrms/AttendanceTracker";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hrms/attendance");
      const data = await res.json();
      setAttendance(data.attendance || []);

      // Check if latest record for today has check_in but no check_out
      const today = new Date().toISOString().split("T")[0];
      const todayRecord = (data.attendance || []).find((a: any) => a.work_date === today);
      setIsCheckedIn(todayRecord && !todayRecord.check_out);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleClockIn = async () => {
    try {
      await fetch("/api/hrms/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_in", employee_id: attendance[0]?.employee_id || "" })
      });
      fetchAttendance();
    } catch (e) { console.error(e); }
  };

  const handleClockOut = async () => {
    try {
      await fetch("/api/hrms/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_out", employee_id: attendance[0]?.employee_id || "" })
      });
      fetchAttendance();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Attendance Records</h1>
        <p className="text-neutral-500 text-xs">Clock in/out tracking, working hours audit, and weekly heatmap analysis.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <>
          <AttendanceTracker
            attendance={attendance}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            isCheckedIn={isCheckedIn}
          />

          {/* Attendance Log Table */}
          <Card className="border border-[#e6e6e6] bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Attendance Log</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Date</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Employee</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Check-In</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Check-Out</th>
                    <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Hours</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-neutral-400">No attendance records</td></tr>
                  )}
                  {attendance.slice(0, 20).map((record: any) => (
                    <tr key={record.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-neutral-600">{record.work_date}</td>
                      <td className="px-4 py-2.5 font-semibold text-neutral-800">{record.employee?.full_name || "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-neutral-500">
                        {record.check_in ? new Date(record.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-neutral-500">
                        {record.check_out ? new Date(record.check_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-neutral-700">{record.working_hours || "0.00"}h</td>
                      <td className="px-4 py-2.5">
                        {record.late_check_in ? (
                          <span className="text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 text-[8px] font-bold">Late</span>
                        ) : (
                          <span className="text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-200 text-[8px] font-bold">On Time</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
