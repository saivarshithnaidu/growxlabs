"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

type Scope = {
  id: string;
  scope_number: string;
  status: string;
  version: number;
  company: { name: string } | null;
  deal: { name: string } | null;
  updated_at: string;
};
const readable = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function AdminScopesPage() {
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/scopes", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load scopes.");
      setScopes(data.scopes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load scopes.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Consulting workflow
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
            Scopes of work
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Review approved solution scopes before creating commercial
            proposals.
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-4 text-sm font-medium text-[var(--text-secondary)]"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-1)] shadow-sm">
        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="animate-spin text-[var(--text-muted)]" />
          </div>
        ) : scopes.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
            <FileText className="text-slate-300" size={30} />
            <p className="font-medium text-[var(--text-secondary)]">
              No scopes of work found
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Scopes are created from approved solution architectures.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <tr>
                    <th className="px-5 py-3">Scope of Work</th>
                  <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Revision</th>
                    <th className="px-5 py-3">Customer / Opportunity</th>
                    <th className="px-5 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {scopes.map((scope) => (
                  <tr key={scope.id} className="cursor-pointer hover:bg-[var(--surface-hover)]">
                    <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">
                      <Link className="text-blue-700 hover:underline" href={`/admin/scopes/${scope.id}`}>{scope.scope_number}</Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {readable(scope.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                        {scope.version}
                    </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[var(--text-primary)]">
                          {scope.company?.name || "Customer name unavailable"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {scope.deal?.name || "No opportunity linked"}
                        </p>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                      {new Date(scope.updated_at).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
