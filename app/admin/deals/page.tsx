"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { Button, CurrencyAmount, Input, KPIItem, KPIStrip, Modal, Select, Skeleton } from "@/src/components/ui";
import { FormField, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

export default function DealsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [deals, setDeals] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newDeal, setNewDeal] = useState({
    name: "",
    company_id: "",
    primary_contact_id: "",
    value: 50000,
    currency: "INR",
    expected_close_date: "",
    probability: 50,
    stage_id: ""
  });

  useEffect(() => {
    fetchDealsData();
  }, []);

  const fetchDealsData = async () => {
    try {
      setLoading(true);
      const [dealsRes, compRes, contactRes] = await Promise.all([
        fetch("/api/deals"),
        fetch("/api/companies"),
        fetch("/api/contacts")
      ]);
      
      const dealsData = await dealsRes.json();
      const compData = await compRes.json();
      const contactData = await contactRes.json();
      
      setDeals(dealsData.deals || []);
      setStages(dealsData.stages || []);
      setCompanies(compData.companies || []);
      setContacts(contactData.contacts || []);

      if (dealsData.stages && dealsData.stages.length > 0) {
        setNewDeal(prev => ({ ...prev, stage_id: dealsData.stages[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (dealId: string, newStageId: string) => {
    try {
      const res = await fetch(`/api/deals?id=${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_id: newStageId })
      });
      if (!res.ok) throw new Error("Failed to persist stage change");
      fetchDealsData();
    } catch (err) {
      console.error(err);
      alert("Error saving stage update");
      throw err;
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDeal)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewDeal({
          name: "",
          company_id: "",
          primary_contact_id: "",
          value: 50000,
          currency: "INR",
          expected_close_date: "",
          probability: 50,
          stage_id: stages[0]?.id || ""
        });
        fetchDealsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalPipelineValue = deals.reduce((acc, curr) => acc + Number(curr.value), 0);
  const set = (patch: Partial<typeof newDeal>) => setNewDeal({ ...newDeal, ...patch });

  return (
    <ListPage
      header={{
        title: "Sales Pipeline",
        breadcrumb,
        info: "Track active deals, close probability, and pipeline values. Drag a deal to move it to another stage.",
        actions: <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowAddModal(true)}>New deal</Button>,
      }}
      kpis={
        <KPIStrip>
          <KPIItem label="Total pipeline" value={<CurrencyAmount value={totalPipelineValue} />} loading={loading} />
          <KPIItem label="Open deals" value={deals.length} loading={loading} />
          <KPIItem label="Stages" value={stages.length} loading={loading} />
        </KPIStrip>
      }
    >
      {loading ? (
        <div className="flex gap-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} width={288} height={320} radius="md" />)}
        </div>
      ) : (
        <KanbanBoard
          initialDeals={deals}
          stages={stages}
          onStageChange={handleStageChange}
        />
      )}

      <Modal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Add pipeline deal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" form="deal-form" variant="primary">Add deal</Button>
          </>
        }
      >
        <form id="deal-form" onSubmit={handleCreateDeal} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormField label="Deal name" required>
              {(f) => <Input {...f} required placeholder="Acme Software Integration" value={newDeal.name} onChange={e => set({ name: e.target.value })} />}
            </FormField>
          </div>
          <FormField label="Target company" required>
            {(f) => <Select {...f} required placeholder="Select account…" value={newDeal.company_id || undefined} onValueChange={(company_id) => set({ company_id })} options={companies.map(c => ({ value: c.id, label: c.name }))} />}
          </FormField>
          <FormField label="Primary contact" required>
            {(f) => <Select {...f} required placeholder="Select contact…" value={newDeal.primary_contact_id || undefined} onValueChange={(primary_contact_id) => set({ primary_contact_id })} options={contacts.map(c => ({ value: c.id, label: `${c.first_name} ${c.last_name || ""}` }))} />}
          </FormField>
          <FormField label="Deal value (₹)" required>
            {(f) => <Input {...f} type="number" required value={newDeal.value} onChange={e => set({ value: Number(e.target.value) })} />}
          </FormField>
          <FormField label="Expected close date">
            {(f) => <Input {...f} type="date" value={newDeal.expected_close_date} onChange={e => set({ expected_close_date: e.target.value })} />}
          </FormField>
          <FormField label="Probability (%)">
            {(f) => <Input {...f} type="number" min={0} max={100} value={newDeal.probability} onChange={e => set({ probability: Number(e.target.value) })} />}
          </FormField>
          <FormField label="Initial stage" required>
            {(f) => <Select {...f} required value={newDeal.stage_id || undefined} onValueChange={(stage_id) => set({ stage_id })} options={stages.map(st => ({ value: st.id, label: st.name }))} />}
          </FormField>
        </form>
      </Modal>
    </ListPage>
  );
}
