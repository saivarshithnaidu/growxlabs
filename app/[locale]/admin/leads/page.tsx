"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import {
  MessageSquare, Zap, Target,
  MapPin, Star, X, Copy, Loader2,
  CheckCircle, AlertCircle, Phone, Mail, Users,
  RefreshCw, Send, PhoneCall, Info, Plus, Upload, Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Lead } from "@/types";



// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const configs: Record<string, { label: string, color: string }> = {
    new: { label: "NEW", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
    qualified: { label: "QUALIFIED", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
    outreach: { label: "OUTREACH", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    contacted: { label: "CONTACTED", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  };

  const config = configs[status] || configs.new;

  return (
    <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-widest", config.color)}>
      {config.label}
    </span>
  );
};

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // AI Outreach Panel State
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'call'>('whatsapp');
  const [generatedContent, setGeneratedContent] = useState<{ whatsapp: string, email: string, call: string } | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // New Lead Modal State
  const [showAddLead, setShowAddLead] = useState(false);
  const [showImportLead, setShowImportLead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    business_name: "",
    email: "",
    phone: "",
    city: "",
    status: "new" as Lead['status']
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads/list");
      const data = await res.json();
      // Ensure leads are sorted by created_at descending (newest first)
      const sortedData = (data || []).sort((a: any, b: any) => {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
      setLeads(sortedData);
    } catch (e) {
      console.error(e);
      showToast("Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const updateStatus = async (id: string | undefined, status: Lead['status'], extraData: Partial<Lead> = {}) => {
    if (!id) return;

    setUpdatingId(id);
    console.log("DEBUG: Calling updateStatus for ID:", id, "Status:", status);
    const previousLeads = [...leads];
    setLeads(current => current.map(l => l.id === id ? { ...l, status, ...extraData } : l));

    try {
      const url = `/api/leads/${id}`;
      console.log("DEBUG: Fetching URL:", url);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extraData })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      
      showToast(`Success: Lead updated`);
      await fetchLeads(); // Refresh data to stay in sync
    } catch (e: any) {
      console.error("PAGE ERROR:", e);
      setLeads(previousLeads);
      showToast(e.message || "Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const generateAIOutreach = async (lead: Lead, force = false) => {
    if (!lead.id) return;

    // Check cache
    if (!force && lead.outreach_generated && lead.outreach_content) {
      setGeneratedContent(lead.outreach_content);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/leads/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id })
      });

      console.log("Generating outreach for:", lead.id);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedContent(data);
      // Update local state and refresh to keep everything in sync
      await fetchLeads();
      showToast("Strategy Generated ✨");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "AI Generation failed";
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lead");
      
      showToast("Lead added successfully");
      setShowAddLead(false);
      setNewLead({ business_name: "", email: "", phone: "", city: "", status: "new" });
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = "/api/crm/export?format=csv";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportCSV = async () => {
    if (!selectedFile) {
      showToast("Please select a file", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const text = await selectedFile.text();
      const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
      if (rawLines.length < 2) throw new Error("File is empty or invalid");

      // Simple CSV parser that handles quotes
      const parseCSVLine = (line: string) => {
        const result = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = "";
          } else cur += char;
        }
        result.push(cur.trim());
        return result;
      };

      const headers = parseCSVLine(rawLines[0]).map(h => h.toLowerCase().replace(/["']/g, ""));
      const data = rawLines.slice(1).map(line => {
        const values = parseCSVLine(line).map(v => v.replace(/["']/g, ""));
        const obj: any = {};
        headers.forEach((header, i) => {
          const val = values[i];
          if (!val) return;

          if (header.includes("business") || header.includes("company") || header.includes("organization")) obj.business_name = val;
          if (header.includes("contact") || header.includes("name") || header.includes("founder") || header.includes("person")) obj.name = val;
          if (header.includes("email") || header.includes("mail")) obj.email = val;
          if (header.includes("phone") || header.includes("mobile") || header.includes("contact number")) obj.phone = val;
          if (header.includes("city") || header.includes("location") || header.includes("address")) obj.city = val;
          if (header.includes("status")) obj.status = val;
        });
        return obj;
      });

      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: data })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Import failed");
      
      showToast(`Success: ${result.count} leads imported`);
      setShowImportLead(false);
      setSelectedFile(null);
      fetchLeads();
    } catch (e: any) {
      showToast(`Import Failed: ${e.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenOutreach = (lead: Lead) => {
    setOutreachLead(lead);
    setGeneratedContent(lead.outreach_content || null);
    if (!lead.outreach_generated) {
      generateAIOutreach(lead);
    }
  };

  const handleMarkContacted = async () => {
    if (!outreachLead?.id) return;
    await updateStatus(outreachLead.id, 'contacted', { outreach_sent: true });
    setOutreachLead(null);
  };

  const getPriority = (score: number) => {
    if (score >= 7) return { label: "HOT", color: "text-green-500 bg-green-500/10 border-green-500/20" };
    if (score >= 4) return { label: "WARM", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
    return { label: "COLD", color: "text-gray-400 bg-gray-400/10 border-gray-400/20" };
  };

  const hotLeadsCount = leads.filter(l => (l.lead_score || 0) >= 7).length;
  const totalLeads = leads.length;

  return (
    <div className="relative min-h-screen">
      <div className="space-y-10 pb-20">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className={cn(
                "fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 min-w-[300px]",
                toast.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
              )}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-bold uppercase tracking-tight">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: totalLeads.toString() },
            { label: "Hot Leads Today", value: hotLeadsCount.toString() },
            { label: "Active Clients", value: "—" },
            { label: "Revenue This Month", value: "—" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-[#00A86B]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Sales Pipeline</h1>
            <p className="text-white/40 font-medium">Real-time Business Intelligence</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowImportLead(true)} variant="outline" className="border-white/10 text-white/40 hover:text-white h-11 px-6 font-bold text-[10px] uppercase tracking-widest">
              <Upload size={14} className="mr-2" /> Import CSV
            </Button>
            <Button onClick={handleExportCSV} variant="outline" className="border-white/10 text-white/40 hover:text-white h-11 px-6 font-bold text-[10px] uppercase tracking-widest">
              <Download size={14} className="mr-2" /> Export
            </Button>
            <Button onClick={() => setShowAddLead(true)} variant="outline" className="border-white/10 text-white/40 hover:text-white h-11 px-6 font-bold text-[10px] uppercase tracking-widest">
              <Plus size={14} className="mr-2" /> Add Lead
            </Button>
            <Link href="/admin/leads/scrape">
              <Button className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 shadow-lg shadow-[#00A86B]/10 px-8 h-11 font-bold">
                <Zap size={16} className="mr-2 fill-current" /> Hunt Leads
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-xl">
                <Loader2 className="h-8 w-8 text-white/10 animate-spin" />
              </div>
            ) : leads.length > 0 ? (
              leads.map((lead, i) => {
                const priority = getPriority(lead.lead_score || 0);
                const isExpanded = activeLeadId === lead.id;

                // Fallback parsing for source/creator from notes
                let displaySource = lead.source;
                let displayCreator = lead.created_by_name;
                
                if (!displaySource && lead.notes?.includes("[Source:")) {
                  displaySource = lead.notes.match(/\[Source:\s*(.*?)\]/)?.[1];
                }
                if (!displayCreator && lead.notes?.includes("[Created By:")) {
                  displayCreator = lead.notes.match(/\[Created By:\s*(.*?)\]/)?.[1];
                }

                return (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <Card className={cn(
                      "p-0 border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden relative group",
                      isExpanded && "bg-white/[0.06] border-white/10 shadow-2xl"
                    )}>
                      {/* Priority Bar */}
                      <div className={cn("absolute left-0 top-0 bottom-0 w-1 transition-all", isExpanded ? "w-1.5" : "w-1", priority.color.split(' ')[0].replace('text', 'bg'))} />

                      <div className="p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                              {lead.business_name}
                            </h3>
                            <StatusBadge status={lead.status} />
                            <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-black border", priority.color)}>
                              {priority.label}
                            </span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-md border border-white/5">
                              <MapPin size={10} /> {lead.city || "Unknown Location"}
                            </span>
                            {lead.outreach_sent && (
                              <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-0.5 rounded border border-green-500/20 uppercase">CONTACTED</span>
                            )}
                            {displaySource === "Admin Manual" && (
                              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">Admin Saved</span>
                            )}
                            {displayCreator && (
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-md border border-white/5">
                                <Users size={10} /> Uploaded By: {displayCreator}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {!lead.has_website && (
                              <div className="flex items-center text-orange-500/80 text-[10px] font-black uppercase tracking-widest bg-orange-500/5 px-3 py-1 rounded-md border border-orange-500/10">
                                NO WEBSITE ❌
                              </div>
                            )}
                            {(lead.google_rating || 0) > 0 && (
                              <div className="flex items-center text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5">
                                <Star size={10} className="mr-1.5 text-yellow-500" /> {lead.google_rating} RATING
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 flex-wrap lg:flex-nowrap">
                          {lead.phone && lead.phone.length >= 10 && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Opening WhatsApp for:", lead.phone);
                                window.open(`https://wa.me/${lead.phone?.replace(/\D/g, '')}`, '_blank');
                              }}
                              className="h-10 px-6 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white border border-green-500/20 text-[10px] font-black uppercase tracking-widest"
                            >
                              WhatsApp
                            </Button>
                          )}
                          <Button
                            onClick={() => setActiveLeadId(isExpanded ? null : lead.id!)}
                            className={cn(
                              "h-10 px-8 transition-all text-[10px] font-black uppercase tracking-widest",
                              isExpanded ? "bg-white text-black shadow-lg shadow-white/5" : "bg-white/5 text-white hover:bg-white hover:text-black"
                            )}
                          >
                            {isExpanded ? "Close Info" : "View Details"}
                          </Button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/5"
                          >
                            <div className="p-8 bg-white/[0.01] grid md:grid-cols-3 gap-8">
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Contact Information</p>
                                  <div className="text-sm font-medium text-white/60 space-y-1">
                                    <p className="flex items-center gap-3"><Phone size={14} className="text-white/20" /> {lead.phone || "No phone listed"}</p>
                                    <p className="flex items-center gap-3"><Mail size={14} className="text-white/20" /> {lead.email || "No email detected"}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Digital Status</p>
                                  <div className="flex items-center gap-2">
                                    <span className={cn("px-3 py-1 rounded-md text-[10px] font-bold border", lead.has_website ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-red-500 border-red-500/20 bg-red-500/5")}>
                                      {lead.has_website ? "Website ✅" : "No Website ❌"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Opportunity Insights</p>
                                <div className="space-y-2">
                                  {!lead.has_website && (
                                    <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-[11px] text-orange-400 font-medium">
                                      Critically underserved digital presence. No operational website detected.
                                    </div>
                                  )}
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Calculated Quality</p>
                                    <div className="flex items-end gap-3 leading-none">
                                      <span className="text-3xl font-black text-white">{lead.lead_score}</span>
                                      <span className="text-xs font-bold text-white/20 mb-1">/ 10 Score</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Suggested Action</p>
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => updateStatus(lead.id, 'qualified')}
                                      isLoading={updatingId === lead.id}
                                      variant="outline"
                                      className="flex-1 h-11 border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
                                    >
                                      Mark Qualified
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenOutreach(lead)}
                                      className="flex-1 h-11 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20"
                                    >
                                      Start Outreach
                                    </Button>
                                  </div>
                                  <Link href={`/admin/leads/${lead.id}`} className="block">
                                    <Button variant="ghost" className="w-full h-11 border border-white/5 text-white/40 hover:text-white font-black uppercase tracking-tighter text-[10px]">
                                      Full Intelligence Profile
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-96 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-3xl space-y-6"
              >
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                  <Target size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-white">Pipeline Empty</h3>
                  <p className="text-white/20 text-sm max-w-xs mx-auto">Start by hunting for new high-conversion leads in target regions.</p>
                </div>
                <Link href="/admin/leads/scrape">
                  <Button className="bg-white text-black hover:bg-neutral-200 h-12 px-10 font-bold rounded-xl shadow-2xl">
                    Hunt Leads
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI OUTREACH PANEL (SIDE DRAWER) */}
        <AnimatePresence>
          {outreachLead && (
            <div className="fixed inset-0 z-[110] flex justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOutreachLead(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-xl bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 border-bottom border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight leading-none">{outreachLead.business_name}</h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">AI Outreach Engine</p>
                    </div>
                  </div>
                  <button onClick={() => setOutreachLead(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                  {/* Section 1: Lead Summary */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Info size={10} /> Lead Intelligence
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] font-bold text-white/20 uppercase mb-1">Status</p>
                        <p className="text-xs font-bold text-white">{outreachLead.has_website ? "Website ✅" : "No Website ❌"}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] font-bold text-white/20 uppercase mb-1">Rating</p>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" /> {outreachLead.google_rating || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Key Insight</p>
                      <p className="text-xs font-medium text-blue-200/80 italic">
                        {!outreachLead.has_website ? "Critical lack of digital footprint. High probability for web development project." : "Strong foundation but low social presence detected."}
                      </p>
                    </div>
                  </div>

                  {/* Section 2: AI Messages */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Generated Strategy</p>
                      <button
                        onClick={() => generateAIOutreach(outreachLead, true)}
                        disabled={isGenerating}
                        className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={12} className={cn(isGenerating && "animate-spin")} /> REGENERATE
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                      {(['whatsapp', 'email', 'call'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            activeTab === tab ? "bg-white/10 text-white border border-white/10 shadow-lg" : "text-white/20 hover:text-white/40"
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Message Block */}
                    <div className="relative group">
                      {isGenerating ? (
                        <div className="h-40 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center border border-white/10">
                          <Loader2 className="h-6 w-6 text-white/20 animate-spin" />
                        </div>
                      ) : (
                        <>
                          <Textarea
                            value={generatedContent?.[activeTab] || ""}
                            onChange={(e) => setGeneratedContent(cur => cur ? { ...cur, [activeTab]: e.target.value } : null)}
                            className="min-h-[180px] bg-black/40 border-white/10 focus:ring-blue-500 text-sm leading-relaxed p-6 h-auto"
                          />
                          <button
                            onClick={() => {
                              if (generatedContent?.[activeTab]) {
                                navigator.clipboard.writeText(generatedContent[activeTab]);
                                showToast("Copied to clipboard");
                              }
                            }}
                            className="absolute bottom-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all border border-white/5"
                          >
                            <Copy size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-8 border-t border-white/5 grid gap-4 bg-black/20">
                  <div className="flex gap-4">
                    {activeTab === 'whatsapp' && outreachLead.phone && (
                      <a
                        href={`https://wa.me/${outreachLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(generatedContent?.whatsapp || "")}`}
                        target="_blank"
                        className="flex-1"
                      >
                        <Button className="w-full h-14 bg-green-600 hover:bg-green-500 text-white gap-3 rounded-2xl shadow-xl shadow-green-900/10">
                          <Send size={18} /> Open WhatsApp
                        </Button>
                      </a>
                    )}
                    {activeTab === 'email' && outreachLead.email && (
                      <a
                        href={`mailto:${outreachLead.email}?subject=Partnership Strategy for ${outreachLead.business_name}&body=${encodeURIComponent(generatedContent?.email || "")}`}
                        className="flex-1"
                      >
                        <Button className="w-full h-14 bg-white text-black gap-3 rounded-2xl">
                          <Mail size={18} /> Open Email Client
                        </Button>
                      </a>
                    )}
                    {activeTab === 'call' && (
                      <Button onClick={() => showToast("Script copied for call")} className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white gap-3 rounded-2xl">
                        <PhoneCall size={18} /> Copy Script
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={handleMarkContacted}
                    isLoading={updatingId === outreachLead.id}
                    variant="outline"
                    className="w-full h-12 border-white/10 text-white/40 hover:border-green-500/40 hover:text-green-500"
                  >
                    Mark as Contacted
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ADD LEAD MODAL */}
      {showAddLead && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Add New Lead</h2>
            <p className="text-white/40 text-sm mb-8">Manually enter lead information into the pipeline.</p>
            <form onSubmit={handleAddLead} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Business Name</label>
                <input 
                  type="text" 
                  required
                  value={newLead.business_name}
                  onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                <input 
                  type="email" 
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Phone Number</label>
                <input 
                  type="text" 
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">City</label>
                <input 
                  type="text" 
                  value={newLead.city}
                  onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors text-sm" 
                />
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-white/5 mt-8">
                 <Button type="button" onClick={() => setShowAddLead(false)} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white">Cancel</Button>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-white text-black hover:bg-neutral-200 text-[10px] font-bold uppercase tracking-widest h-10 px-6 min-w-[120px]"
                 >
                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Lead"}
                 </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {showImportLead && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Import Leads</h2>
            <p className="text-white/40 text-sm mb-8">Upload a CSV file to bulk import leads.</p>
            
            <div 
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                selectedFile ? "border-[#00A86B]/40 bg-[#00A86B]/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload size={32} className={cn("mx-auto mb-4", selectedFile ? "text-[#00A86B]" : "text-white/20")} />
              <p className="text-xs font-bold text-white uppercase tracking-widest">
                {selectedFile ? selectedFile.name : "Drop CSV File Here"}
              </p>
              <p className="text-[10px] text-white/20 mt-2 uppercase tracking-tight">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "or click to browse local files"}
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
               <Button 
                type="button" 
                onClick={() => {
                  setShowImportLead(false);
                  setSelectedFile(null);
                }} 
                variant="ghost" 
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white"
              >
                Cancel
              </Button>
               <Button 
                onClick={handleImportCSV}
                disabled={!selectedFile || isSubmitting}
                className="bg-[#00A86B] text-white hover:bg-[#00A86B]/90 text-[10px] font-bold uppercase tracking-widest h-10 px-6 min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Process File"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

