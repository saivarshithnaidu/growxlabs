"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const STATUS_BADGES: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-500/10 border-amber-200",
  APPROVED: "text-green-600 bg-green-500/10 border-green-200",
  REJECTED: "text-red-600 bg-red-500/10 border-red-200",
  CANCELLED: "text-neutral-500 bg-neutral-100 border-neutral-200",
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "", leave_type: "CASUAL", start_date: "", end_date: "", reason: ""
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leavesRes, empRes] = await Promise.all([
        fetch("/api/hrms/leaves"),
        fetch("/api/hrms/employees")
      ]);
      const leavesData = await leavesRes.json();
      const empData = await empRes.json();
      setLeaves(leavesData.leaves || []);
      setBalances(leavesData.balances || []);
      setEmployees(empData.employees || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/hrms/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowForm(false);
      setFormData({ employee_id: "", leave_type: "CASUAL", start_date: "", end_date: "", reason: "" });
      fetchData();
    } catch (e: any) {
      alert(e.message);
    } finally { setSubmitting(false); }
  };

  // Aggregate balances by type
  const leaveTypes = ["SICK", "CASUAL", "EARNED", "MATERNITY"];
  const balanceSummary = leaveTypes.map(type => {
    const entries = balances.filter((b: any) => b.leave_type === type);
    const totalAllocated = entries.reduce((s: number, b: any) => s + (b.allocated || 0), 0);
    const totalUsed = entries.reduce((s: number, b: any) => s + (b.used || 0), 0);
    return { type, allocated: totalAllocated || 12, used: totalUsed, remaining: (totalAllocated || 12) - totalUsed };
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Leave Management</h1>
        <p className="text-neutral-500 text-xs">Apply, approve, and track employee leave balances and requests.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <>
          {/* Leave Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {balanceSummary.map(b => (
              <Card key={b.type} className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{b.type} Leave</span>
                <div className="flex items-end gap-2 mt-2">
                  <h3 className="text-xl font-black text-neutral-900 font-mono">{b.remaining}</h3>
                  <p className="text-[9px] text-neutral-400 font-medium mb-0.5">/ {b.allocated} remaining</p>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${b.allocated > 0 ? (b.remaining / b.allocated) * 100 : 0}%` }} />
                </div>
              </Card>
            ))}
          </div>

          {/* Apply Leave */}
          <div className="flex justify-end">
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all">
              <Plus className="h-3.5 w-3.5" /> Apply for Leave
            </button>
          </div>

          {showForm && (
            <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-neutral-800">Leave Application</h3>
                <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Employee</label>
                  <select value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="">Select Employee</option>
                    {employees.map((e: any) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Leave Type</label>
                  <select value={formData.leave_type} onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Start Date</label>
                  <input type="date" value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">End Date</label>
                  <input type="date" value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Reason</label>
                  <input type="text" placeholder="Leave reason..." value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="mt-4 bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Submit Request"}
              </button>
            </Card>
          )}

          {/* Leave Requests Table */}
          <Card className="border border-[#e6e6e6] bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Leave Requests</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100">
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Employee</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Type</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">From</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">To</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Reason</th>
                    <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-neutral-400">No leave requests</td></tr>
                  )}
                  {leaves.map((leave: any) => (
                    <tr key={leave.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-neutral-800">{leave.employee?.full_name || "—"}</td>
                      <td className="px-4 py-2.5 font-mono text-neutral-600">{leave.leave_type}</td>
                      <td className="px-4 py-2.5 font-mono text-neutral-500">{leave.start_date}</td>
                      <td className="px-4 py-2.5 font-mono text-neutral-500">{leave.end_date}</td>
                      <td className="px-4 py-2.5 text-neutral-500 truncate max-w-[200px]">{leave.reason || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("px-2 py-0.5 rounded border text-[8px] font-bold", STATUS_BADGES[leave.status] || STATUS_BADGES.PENDING)}>
                          {leave.status}
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
