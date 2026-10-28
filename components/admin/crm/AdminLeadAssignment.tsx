"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Badge, Button, Card, CardHeader, Select } from "@/src/components/ui";

const UNASSIGNED = "__unassigned";

export function AdminLeadAssignment({ leadId }: { leadId: string }) {
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/admin/crm/leads/${leadId}/assignment`)
      .then((r) => r.json())
      .then((b) => {
        if (!isMounted) return;
        setEmployees(b.employees || []);
        if (b.currentEmployeeId) {
          setValue(b.currentEmployeeId);
        } else {
          setValue("");
        }
      })
      .catch((err) => {
        console.error("Failed to load assignment:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [leadId]);

  async function assign() {
    setSaving(true);
    setStatusMessage(null);
    try {
      const r = await fetch(`/api/admin/crm/leads/${leadId}/assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: value || null }),
      });
      const b = await r.json();
      if (r.ok) {
        setStatusMessage({ type: "success", text: "Owner saved" });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: "error", text: b.error || "Assignment failed" });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Lead owner"
        actions={statusMessage && <Badge variant={statusMessage.type === "success" ? "success" : "danger"}>{statusMessage.text}</Badge>}
      />
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <Select
            aria-label="Lead owner"
            disabled={loading || saving}
            value={value || UNASSIGNED}
            onValueChange={(v) => setValue(v === UNASSIGNED ? "" : v)}
            options={[{ value: UNASSIGNED, label: "Unassigned" }, ...employees.map((e) => ({ value: e.id, label: e.name }))]}
          />
        </div>
        <Button variant="primary" loading={saving} disabled={loading} iconLeft={<Check size={16} strokeWidth={1.5} />} onClick={() => void assign()}>Save</Button>
      </div>
    </Card>
  );
}
