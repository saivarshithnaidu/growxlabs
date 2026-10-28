import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ArrowRight, Plus } from "@/components/icons";
import {
  ActionList, Button, ChartCard, CompactFeed, SegmentedBar, StatRow, StatTile, TrendChart, formatCurrency,
} from "@/src/components/ui";
import { PageHeader } from "@/src/components/patterns";

export const dynamic = "force-dynamic";

const MONTHS = 6;

/** Sum `value` per calendar month for the last MONTHS months (oldest first). Presentation only. */
function monthly<T>(rows: T[] | null | undefined, date: (r: T) => string | null | undefined, value: (r: T) => number, now: Date) {
  const buckets = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-IN", { month: "short" }), total: 0 };
  });
  for (const r of rows || []) {
    const raw = date(r);
    if (!raw) continue;
    const d = new Date(raw);
    const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (b) b.total += value(r);
  }
  return buckets;
}

/** Change of the last 30 days vs the 30 days before, for rows with a date and a value. */
function delta30<T>(rows: T[] | null | undefined, date: (r: T) => string | null | undefined, value: (r: T) => number, nowDate: Date) {
  const now = nowDate.getTime(), day = 86_400_000;
  let cur = 0, prev = 0;
  for (const r of rows || []) {
    const raw = date(r);
    if (!raw) continue;
    const age = now - new Date(raw).getTime();
    if (age <= 30 * day) cur += value(r);
    else if (age <= 60 * day) prev += value(r);
  }
  if (prev <= 0) return undefined;
  const pct = Math.round(((cur - prev) / prev) * 100);
  return { value: `${Math.abs(pct)}%`, direction: pct >= 0 ? ("up" as const) : ("down" as const) };
}

export default async function AdminDashboard() {
  // Use supabaseAdmin to bypass RLS for administrative intelligence, fallback to server client
  const supabase = supabaseAdmin || (await createClient());

  // Fetch real company operations & commercial data concurrently
  const [
    { count: leadsCount },
    { data: deals },
    { data: clients },
    { data: proposals },
    { data: invoices },
    { count: teamCount },
    { data: auditEvents },
    { count: solutionsCount },
    { count: academyUsersCount }
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("deals").select("id, name, value, currency, probability, stage_id, created_at").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name, created_at").limit(5),
    supabase.from("commercial_proposals").select("id, title, proposal_number, status, commercial_totals, accepted_at, accepted_by_name").order("created_at", { ascending: false }).limit(5),
    supabase.from("consulting_advance_invoices").select("id, invoice_number, status, total, balance_due, amount_paid, issued_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase.from("audit_events").select("id, action, resource_type, metadata, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("solution_architectures").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true })
  ]);

  // Aggregate financial & pipeline vitals
  const totalPipelineValue = deals?.reduce((sum, d) => sum + (Number(d.value) || 0), 0) || 0;
  const activeDealsCount = deals?.length || 0;
  const totalLeads = leadsCount || 0;
  const totalClients = clients?.length || 0;

  const totalInvoiced = invoices?.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0) || 0;
  const totalDue = invoices?.reduce((sum, inv) => sum + (Number(inv.balance_due) || 0), 0) || 0;

  const activeProposal = proposals?.[0];
  const primaryClient = clients?.[0] || { name: "Trionyx India Private Limited" };
  const primaryInvoice = invoices?.[0];

  // Display values (same fallbacks as before when there is no data yet)
  const pipelineValue = totalPipelineValue > 0 ? totalPipelineValue : 450000;
  const contractedValue = Number(activeProposal?.commercial_totals?.grand_total) || 100000;
  const billedValue = totalInvoiced > 0 ? totalInvoiced : 50000;
  const collectedShare = totalInvoiced > 0 ? (totalInvoiced - totalDue) / totalInvoiced : undefined;

  // Trends derived from rows already loaded above (one clock snapshot per request)
  const now = new Date();
  const pipelineByMonth = monthly(deals, (d) => d.created_at, (d) => Number(d.value) || 0, now);
  const billedByMonth = monthly(invoices, (i) => i.issued_at, (i) => Number(i.total) || 0, now);
  const collectedByMonth = monthly(invoices, (i) => i.issued_at, (i) => Number(i.amount_paid) || 0, now);
  const chartData = pipelineByMonth.map((m, i) => ({ month: m.label, pipeline: m.total, billed: billedByMonth[i].total, collected: collectedByMonth[i].total }));
  const pipelineDelta = delta30(deals, (d) => d.created_at, (d) => Number(d.value) || 0, now);
  const hasCommercialTrend = chartData.some((d) => d.billed > 0 || d.collected > 0);

  const today = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-10 pb-12">
      <PageHeader
        title="Overview"
        info={`${today} · Business performance, clients and operations across GrowX Labs.`}
        actions={
          <>
            <Button asChild><Link href="/admin/crm">CRM pipeline<ArrowRight size={16} strokeWidth={1.5} /></Link></Button>
            <Button asChild variant="primary"><Link href="/admin/proposals"><Plus size={16} strokeWidth={1.5} />New proposal</Link></Button>
          </>
        }
      />

      {/* Hero numbers */}
      <StatRow>
        <StatTile
          label="Pipeline"
          value={formatCurrency(pipelineValue, { compact: true })}
          delta={pipelineDelta}
          caption={`${activeDealsCount > 0 ? activeDealsCount : 4} deals · ${totalLeads} leads`}
          trend={pipelineByMonth.map((m) => m.total)}
          href="/admin/crm"
        />
        <StatTile
          label="Contracted"
          value={formatCurrency(contractedValue, { compact: true })}
          caption={activeProposal?.proposal_number ? `${activeProposal.proposal_number}` : "1 active agreement"}
          href="/admin/proposals"
        />
        <StatTile
          label="Billed"
          value={formatCurrency(billedValue, { compact: true })}
          caption={collectedShare != null ? `${Math.round(collectedShare * 100)}% collected` : primaryInvoice?.invoice_number || "GXL-INV-2026-000001"}
          progress={collectedShare}
          href="/admin/invoices"
        />
        <StatTile
          label="Clients"
          value={totalClients > 0 ? totalClients : 1}
          caption={`${teamCount || 5}-person team`}
          href="/admin/clients"
        />
      </StatRow>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        {/* Left: trends */}
        <div className="flex min-w-0 flex-col gap-10">
          <ChartCard
            title="Pipeline added"
            legend={[
              { label: "Pipeline", color: "var(--chart-1)" },
              ...(hasCommercialTrend ? [{ label: "Billed", color: "var(--chart-compare)", dashed: true }] : []),
            ]}
            action={<Link href="/admin/deals" className="ds-focus ds-t-meta-strong rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Deals</Link>}
          >
            <TrendChart
              label="Pipeline value added per month for the last six months"
              data={chartData}
              xKey="month"
              valueFormat="inr-compact"
              series={[
                { key: "pipeline", label: "Pipeline", color: "var(--chart-1)", area: true },
                ...(hasCommercialTrend ? [{ key: "billed", label: "Billed", color: "var(--chart-compare)", dashed: true }] : []),
              ]}
            />
          </ChartCard>

          <ChartCard
            title="Pipeline stages"
            action={<Link href="/admin/crm" className="ds-focus ds-t-meta-strong rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Manage CRM</Link>}
          >
            <SegmentedBar
              label="Four pipeline stages from inbound leads to executed agreements"
              segments={[
                { label: "Inbound leads", value: totalLeads, weight: 1, color: "var(--chart-3)", href: "/admin/leads" },
                { label: "Discovery", value: "2 deals", weight: 1, color: "var(--chart-2)", href: "/admin/discovery-meetings" },
                { label: "Proposals", value: formatCurrency(100000, { compact: true }), weight: 1, color: "var(--chart-1)", href: "/admin/proposals" },
                { label: "Executed", value: formatCurrency(350000, { compact: true }), weight: 1, color: "var(--chart-4)", href: "/admin/agreements" },
              ]}
            />
          </ChartCard>
        </div>

        {/* Right: what needs attention, then what happened */}
        <div className="flex min-w-0 flex-col gap-10">
          <section aria-label="Needs you" className="flex flex-col gap-3">
            <h2 className="ds-t-title-sm text-[var(--text-primary)]">Needs you</h2>
            <ActionList
              label="Items that need attention"
              items={[
                ...(totalDue > 0 ? [{ id: "due", label: "Outstanding invoices", meta: formatCurrency(totalDue, { compact: true }), tone: "danger" as const, href: "/admin/invoices" }] : []),
                ...(activeProposal ? [{ id: "proposal", label: activeProposal.proposal_number || activeProposal.title || "Latest proposal", meta: String(activeProposal.status || "").replaceAll("_", " "), href: "/admin/proposals" }] : []),
                { id: "client", label: primaryClient?.name || "Trionyx India Private Limited", meta: "Active client", tone: "success" as const, href: "/admin/clients" },
              ]}
            />
          </section>

          <section aria-label="Recent activity" className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="ds-t-title-sm text-[var(--text-primary)]">Recent</h2>
              <Link href="/admin/audit-logs" className="ds-focus ds-t-meta-strong rounded-[var(--radius-xs)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Audit trail</Link>
            </div>
            {auditEvents && auditEvents.length > 0 ? (
              <CompactFeed
                label="Recent operations events"
                items={auditEvents.slice(0, 5).map((evt, idx) => {
                  const actionLabel = evt.action.replace(/\./g, " · ").replace(/_/g, " ");
                  return {
                    id: evt.id || String(idx),
                    label: <span className="capitalize">{actionLabel}</span>,
                    time: new Date(evt.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
                  };
                })}
              />
            ) : (
              <p className="ds-t-body py-2 text-[var(--text-muted)]">No recent events recorded.</p>
            )}
          </section>

          <section aria-label="Teams" className="flex flex-col gap-3">
            <h2 className="ds-t-title-sm text-[var(--text-primary)]">Teams</h2>
            <ActionList
              label="Department shortcuts"
              items={[
                { id: "arch", label: "AI & architecture", meta: `${solutionsCount || 1} blueprint`, href: "/admin/solution-architectures" },
                { id: "people", label: "People", meta: `${teamCount || 5} members`, href: "/admin/people" },
                { id: "academy", label: "Academy", meta: `${academyUsersCount || 6} accounts`, href: "/admin/academy" },
              ]}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
