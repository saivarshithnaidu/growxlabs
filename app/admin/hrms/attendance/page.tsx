"use client";

import { LogoLoader } from "@/components/ui/LogoLoader";
import React, { useState, useEffect } from "react";
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
    <div className="space-y-8 text-[var(--text-primary)]">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none">Attendance Records</h1>
        <p className="text-[var(--text-secondary)] text-xs">Clock in/out tracking, working hours audit, and weekly heatmap analysis.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <LogoLoader size={40} className="text-[var(--text-primary)]" />
        </div>
      ) : (
        <>
          <AttendanceTracker
            attendance={attendance}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            isCheckedIn={isCheckedIn}
          />

          {/* Audit Log Table */}
          <Card className="border border-[var(--border-subtle)] bg-[var(--card)] rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Attendance Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[var(--surface-2)] border-b border-[var(--border-subtle)]">
                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Date</th>
                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Check In</th>
                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Check Out</th>
                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Hours</th>
                    <th className="text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">No attendance logs found</td></tr>
                  )}
                  {attendance.map((log) => (
                    <tr key={log.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-2)] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[var(--text-secondary)]">{log.work_date}</td>
                      <td className="px-4 py-3 font-mono text-[var(--text-primary)]">
                        {log.check_in ? new Date(log.check_in).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--text-primary)]">
                        {log.check_out ? new Date(log.check_out).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#0075de]">{log.working_hours ? `${log.working_hours}h` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded border text-[8px] font-bold", log.status === "PRESENT" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20")}>
                          {log.status || "PRESENT"}
                        </span>
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
