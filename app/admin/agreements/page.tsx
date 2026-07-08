"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileText, Send, Rocket, Loader2, CheckCircle2, Plus, ArrowUpRight, Download, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/Reveal";

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    client_id: "",
    service_type: "",
    project_description: "",
    total_amount: "",
    advance_amount: "",
    start_date: "",
    delivery_date: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aggRes, clientRes] = await Promise.all([
        fetch("/api/agreements/list"),
        fetch("/api/clients/list")
      ]);
      const aggData = await aggRes.json();
      const clientData = await clientRes.json();
      setAgreements(aggData || []);
      setClients(clientData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/agreements/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Client Agreements</h1>
            <p className="text-[var(--text-secondary)] text-sm">Manage and track client partnership agreements.</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-black hover:bg-gray-200 font-bold tracking-widest uppercase text-[10px] px-6 h-10"
          >
            {showForm ? "Cancel" : "Create Agreement"}
          </Button>
        </div>
      </Reveal>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-8 border border-[var(--border-subtle)] bg-[var(--surface-1)] rounded-2xl mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Client</label>
                    <select
                      className="w-full h-11 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 text-white text-sm focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                      onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                      required
                    >
                      <option value="" className="bg-neutral-900">Select client...</option>
                      {clients.map(c => <option key={c.id} value={c.id} className="bg-neutral-900">{c.business_name || c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Service</label>
                    <Input
                      placeholder="e.g. Backend Engineering"
                      className="h-11 bg-[var(--surface-2)] border-[var(--border-subtle)] text-sm rounded-xl focus:border-[var(--border-hover)] transition-colors"
                      onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Scope</label>
                  <textarea
                    rows={3}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                    placeholder="Deliverables and technical specifications..."
                    onChange={(e) => setForm({ ...form, project_description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Total Fee (₹)</label>
                    <Input type="number" placeholder="0.00" className="h-11 bg-[var(--surface-2)] border-[var(--border-subtle)] rounded-xl focus:border-[var(--border-hover)] transition-colors" onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Advance (₹)</label>
                    <Input type="number" placeholder="0.00" className="h-11 bg-[var(--surface-2)] border-[var(--border-subtle)] rounded-xl focus:border-[var(--border-hover)] transition-colors" onChange={(e) => setForm({ ...form, advance_amount: e.target.value })} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Start Date</label>
                    <Input type="date" className="h-11 bg-[var(--surface-2)] border-[var(--border-subtle)] rounded-xl focus:border-[var(--border-hover)] transition-colors" onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Delivery Date</label>
                    <Input type="date" className="h-11 bg-[var(--surface-2)] border-[var(--border-subtle)] rounded-xl focus:border-[var(--border-hover)] transition-colors" onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} required />
                  </div>
                </div>

                <Button
                  disabled={submitting}
                  className="w-full bg-white text-black h-12 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {submitting ? "Generating Document..." : "Create and Send Agreement"}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-[var(--border-subtle)] border-dashed rounded-2xl bg-[var(--surface-1)]">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : agreements.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {agreements.map((agg, i) => (
              <motion.div
                key={agg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="p-6 border border-[var(--border-subtle)] rounded-2xl bg-[var(--surface-1)] hover:border-[var(--border-hover)] transition-all group">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                      <div className="h-12 w-12 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-primary border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-2">
                          {agg.clients?.business_name || "Direct Partnership"}
                        </h3>
                        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-[var(--text-secondary)]">{agg.service_type}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                          <span className={cn(
                            "flex items-center",
                            agg.status === 'fully_signed' ? "text-green-500" : 
                            agg.status === 'awaiting_admin_signature' ? "text-blue-500" :
                            "text-amber-500"
                          )}>
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full mr-2", 
                              agg.status === 'fully_signed' ? "bg-green-500" : 
                              agg.status === 'awaiting_admin_signature' ? "bg-blue-500" :
                              "bg-amber-500"
                            )} />
                            {agg.status === 'fully_signed' ? 'Fully Executed' : 
                             agg.status === 'awaiting_admin_signature' ? 'Client Signed' : 
                             'Awaiting Client Signature'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/agreements/${agg.id}`}>
                        <Button variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
                          Manage
                        </Button>
                      </Link>
                      {agg.pdf_url && (
                        <a href={agg.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
                            PDF
                          </Button>
                        </a>
                      )}
                      <Button variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
                        Export
                      </Button>
                      <Button variant="outline" className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
                        Resend
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[var(--border-subtle)] border-dashed rounded-2xl bg-[var(--surface-1)] space-y-4">
              <div className="h-14 w-14 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)]">
                <FileText size={24} />
              </div>
              <div className="text-center">
                <p className="text-white font-bold tracking-tight">No agreements created</p>
                <p className="text-[var(--text-secondary)] text-sm">Create your first client partnership agreement to begin.</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-white text-black h-10 px-6 mt-4 font-bold tracking-widest uppercase text-[10px]">
                Create Agreement
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
