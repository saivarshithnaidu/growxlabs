"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileText, Send, Rocket, Loader2, CheckCircle2, Plus, ArrowUpRight, Download, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Client Agreements</h1>
          <p className="text-white/40 font-medium">Manage and track client partnership agreements.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 h-11"
        >
          {showForm ? "Cancel" : "Create Agreement"}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-8 border-white/10 rounded-xl bg-white/[0.02]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Client</label>
                    <select
                      className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-white/20"
                      onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                      required
                    >
                      <option value="">Select client...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.business_name || c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Service</label>
                    <Input
                      placeholder="e.g. Backend Engineering"
                      className="h-11 bg-white/[0.03] border-white/5 text-sm"
                      onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Scope</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-white/20"
                    placeholder="Deliverables and technical specifications..."
                    onChange={(e) => setForm({ ...form, project_description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Total Fee ($)</label>
                    <Input type="number" className="h-11 bg-white/[0.03] border-white/5" onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Advance ($)</label>
                    <Input type="number" className="h-11 bg-white/[0.03] border-white/5" onChange={(e) => setForm({ ...form, advance_amount: e.target.value })} required />
                  </div>
                </div>

                <Button
                  disabled={submitting}
                  className="w-full bg-white text-black h-12 font-bold"
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
          <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-xl">
            <Loader2 className="animate-spin text-white/20" />
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
                <Card className="p-5 border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight leading-none mb-1">
                          {agg.clients?.business_name || "Direct Partnership"}
                        </h3>
                        <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-white/40">{agg.service_type}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className={cn(
                            "flex items-center",
                            agg.status === 'signed' ? "text-green-500" : "text-yellow-500"
                          )}>
                            <span className={cn("h-1.5 w-1.5 rounded-full mr-2", agg.status === 'signed' ? "bg-green-500" : "bg-yellow-500")} />
                            {agg.status === 'signed' ? 'Countersigned' : 'Awaiting Signature'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/agreements/${agg.id}`}>
                        <Button variant="outline" className="h-9 px-4 text-[10px] font-bold border-white/5 text-white/40 hover:text-white">
                          Manage
                        </Button>
                      </Link>
                      {agg.pdf_url && (
                        <a href={agg.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="h-9 px-4 text-[10px] font-bold border-white/5 text-white/40 hover:text-white uppercase tracking-widest font-black">
                            PDF
                          </Button>
                        </a>
                      )}
                      <Button variant="outline" className="h-9 px-4 text-[10px] font-bold border-white/5 text-white/40 hover:text-white">
                        Export
                      </Button>
                      <Button variant="outline" className="h-9 px-4 text-[10px] font-bold border-white/5 text-white/40 hover:text-white">
                        Resend
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <FileText size={24} />
            </div>
            <div className="text-center">
              <p className="text-white font-bold">No agreements created</p>
              <p className="text-white/20 text-sm">Create your first client partnership agreement to begin.</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-white text-black h-10 px-6 mt-4">
              Create Agreement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
