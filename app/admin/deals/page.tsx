"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Kanban, TrendingUp, DollarSign } from "lucide-react";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function DealsPage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none flex items-center gap-2">
            <Kanban size={28} className="text-[#0075de]" /> Sales Pipeline
          </h1>
          <p className="text-neutral-500 text-xs">Track active deals, close probability, and pipeline values.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-[#e6e6e6] p-3 rounded-md shadow-sm flex items-center gap-4 text-xs font-semibold">
            <span className="text-neutral-450 uppercase tracking-widest text-[9px]">Total Pipeline</span>
            <span className="text-neutral-900 font-bold">₹{totalPipelineValue.toLocaleString()}</span>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md shadow-sm"
          >
            <Plus size={14} className="mr-1" /> New Deal
          </Button>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <KanbanBoard 
          initialDeals={deals} 
          stages={stages} 
          onStageChange={handleStageChange} 
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-xl p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Add Pipeline Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Deal Name</span>
                  <Input required placeholder="Acme Software Integration" value={newDeal.name} onChange={e => setNewDeal({ ...newDeal, name: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Target Company</span>
                  <select
                    required
                    value={newDeal.company_id}
                    onChange={e => setNewDeal({ ...newDeal, company_id: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    <option value="">Select Account...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Primary Contact</span>
                  <select
                    required
                    value={newDeal.primary_contact_id}
                    onChange={e => setNewDeal({ ...newDeal, primary_contact_id: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    <option value="">Select Contact...</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name || ""}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Deal Value (₹)</span>
                  <Input type="number" required value={newDeal.value} onChange={e => setNewDeal({ ...newDeal, value: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Expected Close Date</span>
                  <Input type="date" value={newDeal.expected_close_date} onChange={e => setNewDeal({ ...newDeal, expected_close_date: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Probability (%)</span>
                  <Input type="number" min={0} max={100} value={newDeal.probability} onChange={e => setNewDeal({ ...newDeal, probability: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Initial Stage</span>
                  <select
                    required
                    value={newDeal.stage_id}
                    onChange={e => setNewDeal({ ...newDeal, stage_id: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    {stages.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Add Deal</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
