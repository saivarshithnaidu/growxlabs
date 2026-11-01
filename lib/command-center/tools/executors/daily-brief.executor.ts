import "server-only";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ToolExecutor } from "../registry/tool-types";
import { getBillingOverviewExecutor } from "./billing.executor";

/*
 * "What needs me today?" One read across billing, sales, proposals, delivery and meetings,
 * built only from live records. Each source is read independently, so one failing table
 * shows as unavailable instead of failing the whole brief.
 */

const BriefSchema = z.object({});
const OPEN_LEAD = ["new", "contacted", "engaged"];

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const day = (iso: string | null | undefined) => (iso ? String(iso).slice(0, 10) : null);

async function safely<T>(label: string, read: () => Promise<T>): Promise<T | { unavailable: string }> {
  try {
    return await read();
  } catch (e) {
    return { unavailable: `${label}: ${e instanceof Error ? e.message : "could not load"}` };
  }
}

export const getDailyBriefExecutor: ToolExecutor<z.infer<typeof BriefSchema>, unknown> = {
  name: "get_daily_brief",
  description: "What needs the founder's attention today: payments to verify, overdue invoices, agreements to invoice, lead follow-ups due, proposals waiting for internal review, blocked delivery tasks and today's discovery meetings.",
  inputSchema: BriefSchema,
  riskLevel: "low",
  requiredPermissions: ["invoices:read", "leads:read"],
  async execute(_input, context) {
    const today = endOfToday().toISOString();

    const [billing, followUps, proposals, blocked, meetings] = await Promise.all([
      safely("Billing", async () => getBillingOverviewExecutor.execute({}, context) as Promise<any>),

      safely("Lead follow-ups", async () => {
        const { data, error } = await supabaseAdmin
          .from("leads")
          .select("business_name,status,next_followup_at,last_contacted_at")
          .in("status", OPEN_LEAD)
          .lte("next_followup_at", today)
          .order("next_followup_at", { ascending: true })
          .limit(15);
        if (error) throw new Error(error.message);
        return (data || []).map((l) => ({ lead: l.business_name, due: day(l.next_followup_at), lastContacted: day(l.last_contacted_at) || "Never" }));
      }),

      safely("Proposals", async () => {
        const { data, error } = await supabaseAdmin
          .from("commercial_proposals")
          .select("proposal_number,status,updated_at")
          .eq("status", "internal_review")
          .order("updated_at", { ascending: true })
          .limit(15);
        if (error) throw new Error(error.message);
        return (data || []).map((p) => ({ proposal: p.proposal_number, waitingSince: day(p.updated_at) }));
      }),

      safely("Blocked tasks", async () => {
        const { data, error } = await supabaseAdmin.from("projects").select("title,name,description");
        if (error) throw new Error(error.message);
        const rows: Array<{ task: string; project: string }> = [];
        for (const p of data || []) {
          let meta: any = {};
          try { meta = JSON.parse(p.description || "{}"); } catch { continue; }
          for (const t of Array.isArray(meta.tasks) ? meta.tasks : []) {
            if (t.status === "BLOCKED") rows.push({ task: t.key ? `${t.key} ${t.title}` : t.title, project: p.title || p.name || "Project" });
          }
        }
        return rows;
      }),

      safely("Meetings", async () => {
        const { data, error } = await supabaseAdmin
          .from("discovery_meetings")
          .select("meeting_number,title,scheduled_start,status")
          .gte("scheduled_start", startOfToday().toISOString())
          .lte("scheduled_start", today)
          .not("status", "in", "(closed,cancelled)")
          .order("scheduled_start", { ascending: true });
        if (error) throw new Error(error.message);
        return (data || []).map((m) => ({
          meeting: m.meeting_number,
          title: m.title,
          time: m.scheduled_start ? new Date(m.scheduled_start).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : null,
        }));
      }),
    ]);

    const b = billing as any;
    const list = (v: unknown) => (Array.isArray(v) ? v : []);
    const unavailable = [billing, followUps, proposals, blocked, meetings]
      .filter((v): v is { unavailable: string } => !!v && typeof v === "object" && "unavailable" in (v as object))
      .map((v) => v.unavailable);

    return {
      paymentsToVerify: b?.paymentsToVerify ?? 0,
      overdueInvoices: list(b?.overdue).length,
      followUpsDue: list(followUps).length,
      proposalsToReview: list(proposals).length,
      blockedTasks: list(blocked).length,
      meetingsToday: list(meetings).length,
      outstanding: b?.outstanding ?? null,
      overdue: list(b?.overdue),
      agreementsAwaitingInvoice: list(b?.agreementsAwaitingInvoice),
      followUps: list(followUps),
      proposals: list(proposals),
      blocked: list(blocked),
      meetings: list(meetings),
      ...(unavailable.length ? { unavailable: unavailable.join("; ") } : {}),
    };
  },
};
