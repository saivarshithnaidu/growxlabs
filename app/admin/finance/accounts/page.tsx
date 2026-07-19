"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { GeneralLedger } from "@/components/admin/finance/GeneralLedger";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountsData();
  }, []);

  const fetchAccountsData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/finance/accounts");
      const data = await res.json();
      setAccounts(data.accounts || []);
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostVoucher = async (voucherData: any) => {
    try {
      const res = await fetch("/api/finance/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voucherData)
      });
      if (res.ok) {
        fetchAccountsData();
      } else {
        throw new Error("Failed to post voucher");
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
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Accounts & General Ledger</h1>
        <p className="text-neutral-500 text-xs">Verify the double-entry charts, asset valuations, and post journal entries.</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <GeneralLedger 
          accounts={accounts}
          items={items}
          onPostVoucher={handlePostVoucher}
        />
      )}
    </div>
  );
}
