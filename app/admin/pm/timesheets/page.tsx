"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Clock } from "lucide-react";
import { TimeTracker } from "@/components/admin/pm/TimeTracker";
import { Card } from "@/components/ui/Card";

export default function TimesheetsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimesheetData();
  }, []);

  const fetchTimesheetData = async () => {
    try {
      setLoading(true);
      const [tasksRes, logsRes] = await Promise.all([
        fetch("/api/pm/tasks"),
        fetch("/api/pm/timesheets")
      ]);

      const tasksData = await tasksRes.json();
      const logsData = await logsRes.json();

      setTasks(tasksData.tasks || []);
      setLogs(logsData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogTime = async (logData: any) => {
    try {
      const res = await fetch("/api/pm/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData)
      });
      if (res.ok) {
        fetchTimesheetData();
      } else {
        throw new Error("Failed to log time");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
          <Clock size={28} className="text-[#0075de]" /> Employee Timesheets
        </h1>
        <p className="text-neutral-500 text-xs">Log daily project hours, manual entries, and view active timers.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <div className="space-y-8">
          <TimeTracker tasks={tasks} onLogTime={handleLogTime} />

          {/* Timesheets List */}
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Historical Time Logs</h3>
            {logs.length === 0 ? (
              <div className="text-center py-10 text-xs text-neutral-450 font-semibold">No hours logs submitted yet.</div>
            ) : (
              <div className="overflow-x-auto text-xs text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                      <th className="py-2 pl-2">Task</th>
                      <th className="py-2">Project</th>
                      <th className="py-2">Date Logged</th>
                      <th className="py-2">Description</th>
                      <th className="py-2 pr-2 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: any) => (
                      <tr key={log.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                        <td className="py-3 pl-2 text-neutral-900 font-bold">{log.task?.title}</td>
                        <td className="py-3 text-neutral-500 font-bold">{log.task?.project?.name}</td>
                        <td className="py-3 text-neutral-500 font-mono">{log.log_date}</td>
                        <td className="py-3 text-neutral-600 max-w-xs truncate">{log.description || "Project task execution"}</td>
                        <td className="py-3 pr-2 text-right text-[#0075de] font-mono font-bold">{Number(log.hours_logged).toFixed(2)} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
