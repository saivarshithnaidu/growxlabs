"use client";

import { useEffect, useState } from "react";
import { Badge, Card, CardHeader, KeyValueList } from "@/src/components/ui";

interface SalesContextData {
  qualification?: {
    state?: string;
  };
  activities?: { id: string }[];
  followups?: { id: string; status: string }[];
  opportunity?: {
    stage?: string;
  };
  discovery?: {
    scheduled_start?: string;
  };
  handoff?: boolean;
  error?: string;
}

export function AdminLeadSalesContext({ leadId }: { leadId: string }) {
  const [data, setData] = useState<SalesContextData | null>(null);

  useEffect(() => {
    fetch(`/api/admin/crm/leads/${leadId}/sales-context`)
      .then((r) => r.json())
      .then((json: SalesContextData) => setData(json))
      .catch(() => {});
  }, [leadId]);

  if (!data || data.error) return null;

  const state = data.qualification?.state;
  return (
    <Card>
      <CardHeader title="Pipeline metrics" />
      <KeyValueList items={[
        { label: "Qualification", value: <Badge variant={state === "qualified" ? "success" : state === "unqualified" ? "danger" : "neutral"}>{state || "Not started"}</Badge> },
        { label: "Activities logged", value: String(data.activities?.length || 0) },
        { label: "Open follow-ups", value: String(data.followups?.filter((f) => f.status === "open").length || 0) },
        { label: "Opportunity stage", value: <span className="capitalize">{data.opportunity?.stage ? data.opportunity.stage.replaceAll("_", " ") : "—"}</span> },
        {
          label: "Discovery session",
          value: data.discovery?.scheduled_start
            ? new Date(data.discovery.scheduled_start).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
            : "—",
        },
        { label: "Handoff status", value: data.handoff ? "Completed" : "Pending" },
      ]} />
    </Card>
  );
}
