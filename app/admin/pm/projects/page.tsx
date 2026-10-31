"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Plus } from "lucide-react";
import {
  Avatar, Badge, Button, DataTable, type DataTableColumn, Modal, Select, formatCurrency, toast, type BadgeVariant,
} from "@/src/components/ui";
import { EmptyState, FormField, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { ProgressMeter } from "@/components/admin/pm/ProgressMeter";

const STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Active", variant: "info" },
  PLANNING: { label: "Planning", variant: "neutral" },
  COMPLETED: { label: "Completed", variant: "success" },
};
const HEALTH: Record<string, { label: string; variant: BadgeVariant }> = {
  ON_TRACK: { label: "On track", variant: "success" },
  AT_RISK: { label: "At risk", variant: "warning" },
  OFF_TRACK: { label: "Off track", variant: "danger" },
};

export default function ProjectsPage() {
  const router = useRouter();
  const breadcrumb = useAdminBreadcrumb();
  const [projects, setProjects] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, dealRes] = await Promise.all([
        fetch("/api/pm/projects"),
        fetch("/api/deals")
      ]);

      const projData = await projRes.json();
      const dealData = await dealRes.json();

      setProjects(projData.projects || []);
      // Filter only Won CRM deals that don't have a project yet (simulated by filtering all Won deals)
      const wonDeals = (dealData.deals || []).filter((d: any) => d.stage?.name === "Won");
      setDeals(wonDeals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/pm/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: selectedDealId })
      });
      if (res.ok) {
        setShowPromoteModal(false);
        setSelectedDealId("");
        toast({ title: "Project created", variant: "success" });
        await fetchData();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast({ title: errorData.error || "Failed to initialize project.", variant: "danger" });
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: err.message || "An unexpected error occurred while initializing project.", variant: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const columns: DataTableColumn<any>[] = [
    {
      id: "name",
      header: "Project",
      width: "34%",
      sortValue: (p) => p.name || p.title,
      cell: (p) => (
        <span className="flex min-w-0 flex-col">
          <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{p.name || p.title}</span>
          <span className="ds-t-meta truncate text-[var(--text-muted)]">{p.company?.name || "No client"}</span>
        </span>
      ),
    },
    { id: "status", header: "Status", sortValue: (p) => p.status, cell: (p) => <Badge variant={STATUS[p.status]?.variant || "neutral"}>{STATUS[p.status]?.label || p.status}</Badge> },
    { id: "health", header: "Health", sortValue: (p) => p.health, cell: (p) => p.health ? <Badge variant={HEALTH[p.health]?.variant || "neutral"}>{HEALTH[p.health]?.label || p.health}</Badge> : null },
    { id: "progress", header: "Progress", sortValue: (p) => p.progress || 0, cell: (p) => <ProgressMeter value={p.progress} /> },
    {
      id: "manager",
      header: "Manager",
      sortValue: (p) => p.project_manager?.name || "",
      cell: (p) => p.project_manager?.name
        ? <span className="flex min-w-0 items-center gap-2"><Avatar name={p.project_manager.name} size={24} /><span className="truncate text-[var(--text-primary)]">{p.project_manager.name}</span></span>
        : <span className="text-[var(--text-disabled)]">Unassigned</span>,
    },
    { id: "budget", header: "Budget", numeric: true, sortValue: (p) => Number(p.budget) || 0, cell: (p) => Number(p.budget) > 0 ? formatCurrency(p.budget) : <span className="text-[var(--text-disabled)]">Not set</span> },
  ];

  return (
    <div className="mx-auto max-w-[1440px]">
      <PageHeader
        title="Projects"
        breadcrumb={breadcrumb}
        info="Delivery projects promoted from won CRM deals. Open one to see its board, milestones and issues."
        actions={<Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowPromoteModal(true)}>Promote deal</Button>}
      />

      <DataTable
        label="Delivery projects"
        columns={columns}
        rows={projects}
        getRowId={(p) => p.id}
        loading={loading}
        skeletonRows={5}
        onRowClick={(p) => router.push(`/admin/pm/projects/${p.id}`)}
        emptyState={
          <EmptyState
            icon={<FolderKanban size={24} strokeWidth={1.5} />}
            title="No delivery projects yet"
            description="Promote a won deal from the CRM to start tracking delivery."
            action={<Button variant="primary" onClick={() => setShowPromoteModal(true)}>Promote deal</Button>}
          />
        }
      />

      <Modal
        open={showPromoteModal}
        onOpenChange={(open) => { setShowPromoteModal(open); if (!open) setSelectedDealId(""); }}
        title="Promote deal to project"
        description="Creates a delivery project from a won CRM deal."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPromoteModal(false)}>Cancel</Button>
            <Button type="submit" form="promote-deal-form" variant="primary" loading={submitting} disabled={!selectedDealId}>Create project</Button>
          </>
        }
      >
        <form id="promote-deal-form" onSubmit={handlePromoteDeal}>
          <FormField label="Won deal" required hint={deals.length === 0 ? "No won deals in the CRM yet." : undefined}>
            {(f) => (
              <Select
                {...f}
                required
                value={selectedDealId || undefined}
                onValueChange={setSelectedDealId}
                placeholder="Select a won deal"
                disabled={deals.length === 0}
                options={deals.map((d) => ({ value: d.id, label: `${d.name} (${formatCurrency(d.value)})` }))}
              />
            )}
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
