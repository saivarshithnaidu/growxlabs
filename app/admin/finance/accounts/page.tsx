"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { GeneralLedger } from "@/components/admin/finance/GeneralLedger";
import { Button, Skeleton } from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

export default function AccountsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entryOpen, setEntryOpen] = useState(false);

  useEffect(() => {
    fetchAccountsData();
  }, []);

  const fetchAccountsData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/finance/accounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load the ledger.");
      setAccounts(data.accounts || []);
      setItems(data.items || []);
      setEntries(data.entries || []);
    } catch (e: any) {
      setError(e.message || "Couldn't load the ledger.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostVoucher = async (voucherData: any) => {
    const res = await fetch("/api/finance/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voucherData)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Couldn't post the journal entry.");
    }
    fetchAccountsData();
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Ledger accounts"
        breadcrumb={breadcrumb}
        info="The chart of accounts with current balances, and every journal line posted against them."
        actions={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} disabled={loading || !accounts.length} onClick={() => setEntryOpen(true)}>New journal entry</Button>}
      />

      {error ? (
        <ErrorState title="Couldn't load the ledger" description={error} onRetry={fetchAccountsData} />
      ) : loading ? (
        <Skeleton height={420} radius="md" />
      ) : (
        <GeneralLedger accounts={accounts} items={items} entries={entries} onPostVoucher={handlePostVoucher} entryOpen={entryOpen} onEntryOpenChange={setEntryOpen} />
      )}
    </div>
  );
}
