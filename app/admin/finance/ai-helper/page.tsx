"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, Brain, Check, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AiHelperPage() {
  const [receiptText, setReceiptText] = useState("");
  const [loadingOcr, setLoadingOcr] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);

  const [loadingCash, setLoadingCash] = useState(false);
  const [cashForecast, setCashForecast] = useState<any | null>(null);

  const handleScanReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptText) return;

    setLoadingOcr(true);
    try {
      const res = await fetch("/api/finance/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "categorize_receipt",
          receiptText
        })
      });
      const data = await res.json();
      setOcrResult(data.category || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOcr(false);
    }
  };

  const handleForecastCash = async () => {
    setLoadingCash(true);
    try {
      const res = await fetch("/api/finance/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "predict_cashflow",
          transactions: [
            { date: "2026-06-01", amount: 150000, type: "inflow" },
            { date: "2026-06-15", amount: -40000, type: "outflow" },
            { date: "2026-07-01", amount: 180000, type: "inflow" },
            { date: "2026-07-10", amount: -55000, type: "outflow" }
          ]
        })
      });
      const data = await res.json();
      setCashForecast(data.prediction?.forecasts || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCash(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
          <Brain size={28} className="text-[#0075de]" /> AI Finance Assistant
        </h1>
        <p className="text-neutral-500 text-xs">Verify automated expense audits, receipt scans, and cash flow projections.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Receipt Parser */}
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5 flex items-center gap-2">
            <Sparkles size={14} className="text-[#0075de]" /> OCR Receipt Classification
          </h3>

          <form onSubmit={handleScanReceipt} className="space-y-3">
            <span className="text-[9px] font-bold uppercase text-neutral-450 block">Receipt Text Content</span>
            <textarea
              required
              rows={4}
              value={receiptText}
              onChange={(e) => setReceiptText(e.target.value)}
              placeholder="AWS Cloud bill invoice ID: 4892019-IN Amount: Rs 15,200 CGST 9% SGST 9%..."
              className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md p-3 text-xs outline-none focus:bg-white focus:border-[#0075de] font-mono"
            />
            <Button
              type="submit"
              disabled={loadingOcr}
              className="w-full bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[9px] h-9 rounded-md"
            >
              {loadingOcr ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Scan and Categorize receipt"}
            </Button>
          </form>

          {ocrResult && (
            <div className="border border-green-200 bg-green-500/5 p-4 rounded-md text-xs font-semibold text-neutral-800 space-y-2">
              <div className="flex justify-between items-center border-b border-green-100 pb-1.5 mb-1">
                <span className="text-green-600 font-bold flex items-center gap-1"><Check size={14} /> Scan Successful</span>
                <span className="text-[9px] font-mono bg-green-100 px-1.5 py-0.5 rounded text-green-700">Confidence: {ocrResult.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span>Detected Vendor:</span>
                <span className="text-neutral-950 font-bold">{ocrResult.detected_vendor}</span>
              </div>
              <div className="flex justify-between">
                <span>Extracted Value:</span>
                <span className="text-neutral-950 font-mono font-bold">₹{Number(ocrResult.extracted_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Suggested Account:</span>
                <span className="text-[#0075de] font-mono">[{ocrResult.category_code}] {ocrResult.category_name}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Cash Flow Forecast */}
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5 flex items-center gap-2">
            <TrendingUp size={14} className="text-[#0075de]" /> AI Cash Flow Projections
          </h3>

          <div className="space-y-4">
            <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
              Verify monthly projections, predict incoming receivables velocity, and get alerts for potential cash deficits.
            </p>
            <Button
              onClick={handleForecastCash}
              disabled={loadingCash}
              className="w-full bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[9px] h-9 rounded-md"
            >
              {loadingCash ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Run cash flow projection models"}
            </Button>

            {cashForecast && (
              <div className="space-y-3.5 border border-[#e6e6e6] rounded-md p-4 bg-[#f6f5f4]/45 text-xs font-semibold">
                <h4 className="text-[10px] font-bold text-neutral-405 uppercase tracking-wider">Next 2 Months Estimates</h4>
                <div className="space-y-2">
                  {cashForecast.map((f: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center border-b border-[#e6e6e6]/60 pb-2">
                      <span className="font-bold text-neutral-900">{f.month} Forecast</span>
                      <span className="font-mono text-neutral-600">
                        In: <span className="text-[#0075de]">+₹{f.inflow.toLocaleString()}</span> / Out: <span className="text-red-500">-₹{f.outflow.toLocaleString()}</span> (Net: <span className="text-green-600">₹{f.net.toLocaleString()}</span>)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-start border border-amber-200 bg-amber-500/5 p-2 rounded text-[10px] text-amber-700 leading-normal">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>Cash balance healthy. Net projection surplus maintains robust liquidity reserves.</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
