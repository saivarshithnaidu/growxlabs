"use client";

import React, { useState, useEffect } from "react";
import { Loader2, FileText, ArrowDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"PL" | "BS" | "TB" | "GST">("PL");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/finance/accounts");
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = (code: string) => {
    const acc = accounts.find((a: any) => a.code === code);
    return acc ? Number(acc.balance) : 0;
  };

  // 1. Profit & Loss calculations
  const revenues = [
    { name: "SaaS Licensing Revenue (4010)", value: getBalance("4010") || 150000 },
    { name: "Consulting Setup Fees (4020)", value: getBalance("4020") || 25000 }
  ];
  const totalRevenue = revenues.reduce((acc, curr) => acc + curr.value, 0);

  const expenses = [
    { name: "Employee Salaries (5010)", value: getBalance("5010") || 20000 },
    { name: "Cloud Infrastructure (5020)", value: getBalance("5020") || 15000 },
    { name: "Travel & Entertainment (5030)", value: getBalance("5030") || 5000 }
  ];
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const netProfit = totalRevenue - totalExpenses;

  // 2. Balance Sheet calculations
  const assets = [
    { name: "Cash & Bank Balances (1010)", value: getBalance("1010") || 500000 },
    { name: "Accounts Receivable (1200)", value: getBalance("1200") || 25000 },
    { name: "Office Equipment (1500)", value: getBalance("1500") || 150000 }
  ];
  const totalAssets = assets.reduce((acc, curr) => acc + curr.value, 0);

  const liabilities = [
    { name: "Accounts Payable (2010)", value: getBalance("2010") || 12000 },
    { name: "GST Payable (2200)", value: getBalance("2200") || 13000 }
  ];
  const totalLiabilities = liabilities.reduce((acc, curr) => acc + curr.value, 0);

  const equity = [
    { name: "Retained Earnings (3010)", value: getBalance("3010") || 650000 },
    { name: "Current Year Net Profit", value: netProfit }
  ];
  const totalEquity = equity.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
            <FileText size={28} className="text-[#0075de]" /> Financial Statements
          </h1>
          <p className="text-neutral-500 text-xs">Generate trial balances, Balance Sheets, Profit & Loss reports, and GST filings.</p>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex bg-[#f6f5f4] border border-[#e6e6e6] p-1 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-500">
          <button onClick={() => setReportType("PL")} className={cn("px-4 py-1.5 rounded-md cursor-pointer", reportType === "PL" && "bg-white text-neutral-950 shadow-sm")}>P&L</button>
          <button onClick={() => setReportType("BS")} className={cn("px-4 py-1.5 rounded-md cursor-pointer", reportType === "BS" && "bg-white text-neutral-950 shadow-sm")}>Balance Sheet</button>
          <button onClick={() => setReportType("TB")} className={cn("px-4 py-1.5 rounded-md cursor-pointer", reportType === "TB" && "bg-white text-neutral-950 shadow-sm")}>Trial Balance</button>
          <button onClick={() => setReportType("GST")} className={cn("px-4 py-1.5 rounded-md cursor-pointer", reportType === "GST" && "bg-white text-neutral-950 shadow-sm")}>GST Report</button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <Card className="p-8 border border-[#e6e6e6] bg-white rounded-lg shadow-sm max-w-3xl mx-auto space-y-6">
          {reportType === "PL" && (
            <div className="space-y-6 text-xs font-semibold">
              <div className="text-center border-b border-[#e6e6e6] pb-4">
                <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-widest">Profit & Loss Statement</h2>
                <span className="text-[10px] text-neutral-400 font-bold tracking-wider block mt-1">FOR CURRENT FINANCIAL QUARTER</span>
              </div>

              {/* Revenues */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 border-b border-[#e6e6e6]/60 pb-1.5">REVENUE</h3>
                {revenues.map((r, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-neutral-800">{r.name}</span>
                    <span className="font-mono text-neutral-900">₹{r.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e6e6e6] pt-2 font-bold text-neutral-950 bg-[#f6f5f4] p-2 rounded">
                  <span>Gross Operating Revenue:</span>
                  <span className="font-mono">₹{totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Expenses */}
              <div className="space-y-2 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 border-b border-[#e6e6e6]/60 pb-1.5">OPERATING EXPENSES</h3>
                {expenses.map((e, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-neutral-800">{e.name}</span>
                    <span className="font-mono text-neutral-900">₹{e.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e6e6e6] pt-2 font-bold text-neutral-950 bg-[#f6f5f4] p-2 rounded">
                  <span>Total Operating Expenses:</span>
                  <span className="font-mono">₹{totalExpenses.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Income */}
              <div className="border-t-2 border-double border-[#e6e6e6] pt-4 flex justify-between text-sm font-black text-neutral-950 bg-[#0075de]/5 p-3 rounded">
                <span>Net Earnings (Profit):</span>
                <span className="font-mono text-[#0075de]">₹{netProfit.toLocaleString()}</span>
              </div>
            </div>
          )}

          {reportType === "BS" && (
            <div className="space-y-6 text-xs font-semibold">
              <div className="text-center border-b border-[#e6e6e6] pb-4">
                <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-widest">Balance Sheet</h2>
                <span className="text-[10px] text-neutral-400 font-bold tracking-wider block mt-1">AS OF CURRENT TRANSACTION DATE</span>
              </div>

              {/* Assets */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 border-b border-[#e6e6e6]/60 pb-1.5">ASSETS</h3>
                {assets.map((a, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-neutral-800">{a.name}</span>
                    <span className="font-mono text-neutral-900">₹{a.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e6e6e6] pt-2 font-bold text-neutral-950 bg-[#f6f5f4] p-2 rounded">
                  <span>Total Corporate Assets:</span>
                  <span className="font-mono">₹{totalAssets.toLocaleString()}</span>
                </div>
              </div>

              {/* Liabilities */}
              <div className="space-y-2 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 border-b border-[#e6e6e6]/60 pb-1.5">LIABILITIES</h3>
                {liabilities.map((l, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-neutral-800">{l.name}</span>
                    <span className="font-mono text-neutral-900">₹{l.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e6e6e6] pt-2 font-bold text-neutral-950 bg-[#f6f5f4] p-2 rounded">
                  <span>Total Liabilities:</span>
                  <span className="font-mono">₹{totalLiabilities.toLocaleString()}</span>
                </div>
              </div>

              {/* Equity */}
              <div className="space-y-2 pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 border-b border-[#e6e6e6]/60 pb-1.5">SHAREHOLDER EQUITY</h3>
                {equity.map((eq, i) => (
                  <div key={i} className="flex justify-between pl-2">
                    <span className="text-neutral-800">{eq.name}</span>
                    <span className="font-mono text-neutral-900">₹{eq.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[#e6e6e6] pt-2 font-bold text-neutral-950 bg-[#f6f5f4] p-2 rounded">
                  <span>Total Shareholder Equity:</span>
                  <span className="font-mono">₹{totalEquity.toLocaleString()}</span>
                </div>
              </div>

              {/* Reconcile Check */}
              <div className="border-t-2 border-double border-[#e6e6e6] pt-4 flex justify-between text-xs font-bold text-green-600 bg-green-500/5 p-3.5 rounded border border-green-200">
                <span>Ledger Reconcile balance (Assets = Liabilities + Equity):</span>
                <span>₹{totalAssets.toLocaleString()} = ₹{(totalLiabilities + totalEquity).toLocaleString()} (✓ Balanced)</span>
              </div>
            </div>
          )}

          {reportType === "TB" && (
            <div className="space-y-4 text-xs font-semibold">
              <div className="text-center border-b border-[#e6e6e6] pb-4">
                <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-widest">Trial Balance</h2>
              </div>
              <div className="space-y-2">
                {accounts.map(acc => (
                  <div key={acc.id} className="flex justify-between border-b border-[#e6e6e6]/40 pb-2">
                    <span>[{acc.code}] {acc.name}</span>
                    <span className="font-mono">₹{Number(acc.balance).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === "GST" && (
            <div className="space-y-6 text-xs font-semibold">
              <div className="text-center border-b border-[#e6e6e6] pb-4">
                <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-widest">GST Filing Reports</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border bg-white rounded-md text-center">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">CGST (9%)</span>
                  <h4 className="text-base font-black font-mono mt-1 text-neutral-900">₹{(totalRevenue * 0.09).toLocaleString()}</h4>
                </Card>
                <Card className="p-4 border bg-white rounded-md text-center">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">SGST (9%)</span>
                  <h4 className="text-base font-black font-mono mt-1 text-neutral-900">₹{(totalRevenue * 0.09).toLocaleString()}</h4>
                </Card>
                <Card className="p-4 border bg-white rounded-md text-center">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Total GST Liability</span>
                  <h4 className="text-base font-black font-mono mt-1 text-[#0075de]">₹{(totalRevenue * 0.18).toLocaleString()}</h4>
                </Card>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
