"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PayrollSlipBuilder } from "@/components/admin/hrms/PayrollSlipBuilder";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, empRes] = await Promise.all([
        fetch("/api/hrms/payroll"),
        fetch("/api/hrms/employees")
      ]);
      const payData = await payRes.json();
      const empData = await empRes.json();
      setPayrolls(payData.payrolls || []);
      setEmployees(empData.employees || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleGenerate = async (month: string, employeeIds: string[]) => {
    try {
      setGenerating(true);
      const ids = employeeIds.length > 0 ? employeeIds : employees.map((e: any) => e.id);
      const res = await fetch("/api/hrms/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payroll_month: month, employee_ids: ids })
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); } finally { setGenerating(false); }
  };

  const latestPayroll = payrolls[0];
  const payrollItems = latestPayroll?.payroll_items || [];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Payroll Management</h1>
        <p className="text-neutral-500 text-xs">Generate monthly payslips with PF, ESI, and TDS deductions.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <>
          <PayrollSlipBuilder
            payrollItems={payrollItems}
            payrollMonth={latestPayroll?.payroll_month || new Date().toISOString().slice(0, 7)}
            onGenerate={handleGenerate}
          />

          {/* Past Payroll Runs */}
          {payrolls.length > 0 && (
            <Card className="border border-[#e6e6e6] bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-neutral-100">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Payroll History</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Month</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Gross</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Deductions</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Net</th>
                      <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Status</th>
                      <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((pr: any) => (
                      <tr key={pr.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-2.5 font-mono font-bold text-neutral-700">{pr.payroll_month}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-neutral-600">₹{Number(pr.gross_salary).toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-red-500">-₹{Number(pr.deductions).toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-neutral-900">₹{Number(pr.net_salary).toLocaleString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn("px-2 py-0.5 rounded border text-[8px] font-bold",
                            pr.status === "PAID" ? "text-green-600 bg-green-500/10 border-green-200" :
                            pr.status === "APPROVED" ? "text-blue-600 bg-blue-500/10 border-blue-200" :
                            "text-amber-600 bg-amber-500/10 border-amber-200"
                          )}>{pr.status}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-neutral-500">{pr.payroll_items?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
