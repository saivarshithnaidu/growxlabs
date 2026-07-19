"use client";

import React, { useState } from "react";
import { Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PayrollSlipBuilderProps {
  payrollItems: any[];
  payrollMonth: string;
  onGenerate: (month: string, employeeIds: string[]) => void;
}

export function PayrollSlipBuilder({ payrollItems, payrollMonth, onGenerate }: PayrollSlipBuilderProps) {
  const [selectedMonth, setSelectedMonth] = useState(payrollMonth || new Date().toISOString().slice(0, 7));

  const totalEarnings = payrollItems.reduce((sum: number, i: any) => sum + (Number(i.basic_salary) + Number(i.allowances)), 0);
  const totalDeductions = payrollItems.reduce((sum: number, i: any) => sum + (Number(i.pf_deduction) + Number(i.esi_deduction) + Number(i.tds_withheld)), 0);
  const totalNet = payrollItems.reduce((sum: number, i: any) => sum + Number(i.net_payable), 0);
  const maxBar = Math.max(totalEarnings, totalDeductions, 1);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Earnings</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">₹{totalEarnings.toLocaleString()}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">Basic + Allowances</p>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Deductions</span>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">₹{totalDeductions.toLocaleString()}</h3>
          <p className="text-[9px] text-neutral-400 mt-1 font-medium">PF + ESI + TDS</p>
        </Card>

        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Net Payable</span>
            <Receipt className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-xl font-black text-neutral-900 font-mono">₹{totalNet.toLocaleString()}</h3>
          <span className="text-blue-600 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-200 text-[8px] font-bold">
            {payrollItems.length} Employees
          </span>
        </Card>
      </div>

      {/* Earnings vs Deductions Bar */}
      <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Earnings vs Deductions</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-700">Earnings</span>
              <span className="text-xs font-mono font-bold text-neutral-500">₹{totalEarnings.toLocaleString()}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totalEarnings / maxBar) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-red-700">Deductions</span>
              <span className="text-xs font-mono font-bold text-neutral-500">₹{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-rose-400 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totalDeductions / maxBar) * 100}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Payslip Table */}
      <Card className="border border-[#e6e6e6] bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Employee Payslips</h4>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs border border-neutral-200 rounded-md px-2 py-1 font-mono"
            />
            <button
              onClick={() => onGenerate(selectedMonth + "-01", payrollItems.map((i: any) => i.employee_id))}
              className="bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all"
            >
              Generate Payroll
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Employee</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Basic</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Allowances</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">PF</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">ESI</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">TDS</th>
                <th className="text-right px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {payrollItems.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-neutral-400 text-xs">No payslips generated yet</td></tr>
              )}
              {payrollItems.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-neutral-800">{item.employee?.full_name || item.employee_id}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-neutral-600">₹{Number(item.basic_salary).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-neutral-600">₹{Number(item.allowances).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-red-500">-₹{Number(item.pf_deduction).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-red-500">-₹{Number(item.esi_deduction).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-red-500">-₹{Number(item.tds_withheld).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-neutral-900">₹{Number(item.net_payable).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
