"use client";

import React, { useState, useEffect } from "react";
import { FinanceDashboard, summarizeLedger, type LedgerSummary } from "@/components/admin/finance/FinanceDashboard";
import { Skeleton } from "@/src/components/ui";
import { ErrorState, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

export default function FinanceDashboardPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/finance/accounts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load the ledger.");
      setSummary(summarizeLedger(data.accounts || [], data.entries || [], data.items || []));
    } catch (e: any) {
      setError(e.message || "Couldn't load the ledger.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader title="Financial overview" breadcrumb={breadcrumb} info="Cash, receivables, payables and profit, computed from the ledger." />

      {error ? (
        <ErrorState title="Couldn't load the ledger" description={error} onRetry={fetchStats} />
      ) : loading || !summary ? (
        <div className="flex flex-col gap-6" aria-busy="true">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={84} radius="md" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Skeleton height={300} radius="md" />
            <Skeleton height={300} radius="md" />
          </div>
        </div>
      ) : (
        <FinanceDashboard summary={summary} />
      )}
    </div>
  );
}
