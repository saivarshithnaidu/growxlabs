"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import {
  MessageSquare, Zap, Target,
  MapPin, Star, X, Copy, Loader2,
  CheckCircle, AlertCircle, Phone, Mail, Users,
  RefreshCw, Send, PhoneCall, Info, Plus, Upload, Download, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Lead } from "@/types";
import { useSession } from "next-auth/react";

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: Lead['status'] }) => {
  const configs: Record<string, { label: string, color: string }> = {
    new: { label: "NEW", color: "text-neutral-500 bg-neutral-100 border-neutral-200" },
    qualified: { label: "QUALIFIED", color: "text-amber-700 bg-amber-50 border-amber-200" },
    outreach: { label: "OUTREACH", color: "text-[#0075de] bg-[#0075de]/5 border-[#0075de]/10" },
    contacted: { label: "CONTACTED", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  };

  const config = configs[status] || configs.new;

  return (
    <span className={cn("px-2.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider", config.color)}>
      {config.label}
    </span>
  );
};

export default function LeadsAdminPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdminOrCoAdmin = role === "ADMIN" || role === "CO_ADMIN";

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
      const res = await fetch(`/api/leads/list?t=${Date.now()}`);
      const data = await res.json();
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
    const previousLeads = [...leads];
    setLeads(current => current.map(l => l.id === id ? { ...l, status, ...extraData } : l));

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extraData })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      
      showToast("Lead updated successfully");
      await fetchLeads();
    } catch (e: any) {
      console.error(e);
      setLeads(previousLeads);
      showToast(e.message || "Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete lead");
      }

      showToast("Lead deleted successfully");
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const handleClearAllLeads = async () => {
    if (!confirm("WARNING: Are you sure you want to clear ALL leads? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/leads/delete-all", {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to clear leads");
      }

      showToast("All leads cleared successfully");
      fetchLeads();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const generateAIOutreach = async (lead: Lead, force = false) => {
    if (!lead.id) return;

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

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedContent(data);
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
    if (score >= 7) return { label: "HOT", color: "text-red-700 bg-red-50 border-red-200/60" };
    if (score >= 4) return { label: "WARM", color: "text-amber-700 bg-amber-50 border-amber-200/60" };
    return { label: "COLD", color: "text-neutral-500 bg-neutral-100 border-neutral-200/60" };
  };

  const hotLeadsCount = leads.filter(l => (l.lead_score || 0) >= 7).length;
  const totalLeads = leads.length;

  return (
    <div className="relative min-h-screen">
      <div className="space-y-6 sm:space-y-10 lg:space-y-12">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className={cn(
                "fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-md shadow-lg border flex items-center gap-3 min-w-[300px]",
                toast.type === 'success' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
              )}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Total Leads", value: totalLeads.toString() },
            { label: "Hot Leads Today", value: hotLeadsCount.toString() },
            { label: "Active Clients", value: "—" },
            { label: "Revenue This Month", value: "—" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-[#e6e6e6] p-6 rounded-md hover:shadow-sm transition-all duration-200">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <p className="text-3xl font-bold text-[#0075de] tracking-tight leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Sales Pipeline</h1>
            <p className="text-neutral-500 text-sm">Real-time Business Intelligence</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdminOrCoAdmin && leads.length > 0 && (
              <Button onClick={handleClearAllLeads} className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 h-10 px-5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
                <Trash2 size={13} className="mr-2" /> Clear All
              </Button>
            )}
            <Button onClick={() => setShowImportLead(true)} className="bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-600 h-10 px-5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
              <Upload size={13} className="mr-2" /> Import CSV
            </Button>
            <Button onClick={handleExportCSV} className="bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-600 h-10 px-5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
              <Download size={13} className="mr-2" /> Export
            </Button>
            <Button onClick={() => setShowAddLead(true)} className="bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-600 h-10 px-5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
              <Plus size={13} className="mr-2" /> Add Lead
            </Button>
            <Link href="/admin/leads/scrape">
              <Button className="bg-[#0075de] text-white hover:bg-[#005bab] px-6 h-10 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                <Zap size={13} className="mr-2 fill-current" /> Hunt Leads
              </Button>
            </Link>
          </div>
        </div>

        {/* Lead List Cards */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="h-64 flex items-center justify-center border border-[#e6e6e6] border-dashed rounded-md bg-white">
                <Loader2 className="h-6 w-6 text-neutral-300 animate-spin" />
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
                    transition={{ delay: i * 0.01 }}
                  >
                    <Card className={cn(
                      "p-0 border-[#e6e6e6] rounded-md bg-white hover:shadow-sm transition-all overflow-hidden relative group",
                      isExpanded && "border-[#0075de]/30 shadow-md"
                    )}>
                      {/* Priority left indicator */}
                      <div className={cn("absolute left-0 top-0 bottom-0 w-1 transition-all", isExpanded ? "w-1.5" : "w-1", 
                        (lead.lead_score || 0) >= 7 ? "bg-red-500" : (lead.lead_score || 0) >= 4 ? "bg-amber-500" : "bg-neutral-300"
                      )} />

                      <div className="p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between pl-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-base font-bold text-neutral-800 tracking-tight">
                              {lead.business_name}
                            </h3>
                            <StatusBadge status={lead.status} />
                            <span className={cn("px-2.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider", priority.color)}>
                              {priority.label}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 bg-[#f6f5f4] px-2.5 py-0.5 rounded border border-[#e6e6e6]">
                              <MapPin size={9} /> {lead.city || "Unknown Location"}
                            </span>
                            {lead.outreach_sent && (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">CONTACTED</span>
                            )}
                            {displaySource === "Admin Manual" && (
                              <span className="bg-[#0075de]/5 text-[#0075de] text-[9px] font-bold px-2 py-0.5 rounded border border-[#0075de]/10 uppercase tracking-wider">Admin Saved</span>
                            )}
                            {displayCreator && (
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 bg-[#f6f5f4] px-2.5 py-0.5 rounded border border-[#e6e6e6]">
                                <Users size={9} /> Uploaded By: {displayCreator}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {!lead.has_website && (
                              <div className="flex items-center text-amber-700 text-[9px] font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                NO WEBSITE ❌
                              </div>
                            )}
                            {(lead.google_rating || 0) > 0 && (
                              <div className="flex items-center text-neutral-500 text-[9px] font-bold uppercase tracking-wider bg-[#f6f5f4] px-2 py-0.5 rounded border border-[#e6e6e6]">
                                <Star size={9} className="mr-1 text-amber-500 fill-amber-500" /> {lead.google_rating} RATING
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 flex-wrap lg:flex-nowrap w-full lg:w-auto">
                          {lead.phone && lead.phone.length >= 10 && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://wa.me/${lead.phone?.replace(/\D/g, '')}`, '_blank');
                              }}
                              className="h-9 px-4 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-md"
                            >
                              WhatsApp
                            </Button>
                          )}
                          <Button
                            onClick={() => setActiveLeadId(isExpanded ? null : lead.id!)}
                            className={cn(
                              "h-9 px-5 transition-all text-[10px] font-bold uppercase tracking-widest rounded-md border",
                              isExpanded ? "bg-[#f6f5f4] text-neutral-800 border-[#e6e6e6]" : "bg-white border-[#e6e6e6] text-neutral-600 hover:bg-[#f6f5f4]"
                            )}
                          >
                            {isExpanded ? "Close Info" : "View Details"}
                          </Button>
                          {isAdminOrCoAdmin && (
                            <Button
                              onClick={(e) => handleDeleteLead(e, lead.id!)}
                              className="h-9 w-9 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-md flex items-center justify-center p-0"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-[#e6e6e6]"
                          >
                            <div className="p-6 bg-[#f6f5f4]/30 grid md:grid-cols-3 gap-6">
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Contact Information</p>
                                  <div className="text-xs font-medium text-neutral-600 space-y-1">
                                    <p className="flex items-center gap-2.5"><Phone size={12} className="text-neutral-400" /> {lead.phone || "No phone listed"}</p>
                                    <p className="flex items-center gap-2.5"><Mail size={12} className="text-neutral-400" /> {lead.email || "No email detected"}</p>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Digital Status</p>
                                  <div className="flex items-center gap-2">
                                    <span className={cn("px-2.5 py-0.5 rounded text-[9px] font-bold border", lead.has_website ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-red-700 border-red-200 bg-red-50")}>
                                      {lead.has_website ? "Website ✅" : "No Website ❌"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Opportunity Insights</p>
                                <div className="space-y-2">
                                  {!lead.has_website && (
                                    <div className="p-3 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium">
                                      Critically underserved digital presence. No operational website detected.
                                    </div>
                                  )}
                                  <div className="p-3 rounded bg-white border border-[#e6e6e6] shadow-sm">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Calculated Quality</p>
                                    <div className="flex items-end gap-2 leading-none">
                                      <span className="text-2xl font-bold text-neutral-800">{lead.lead_score}</span>
                                      <span className="text-[10px] font-semibold text-neutral-400 mb-0.5">/ 10 Score</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Suggested Action</p>
                                <div className="space-y-2.5">
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => updateStatus(lead.id, 'qualified')}
                                      isLoading={updatingId === lead.id}
                                      className="flex-1 h-9 bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-600 text-[9px] font-bold uppercase tracking-wider rounded-md"
                                    >
                                      Mark Qualified
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenOutreach(lead)}
                                      className="flex-1 h-9 bg-[#0075de] hover:bg-[#005bab] text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm"
                                    >
                                      Start Outreach
                                    </Button>
                                  </div>
                                  <Link href={`/admin/leads/${lead.id}`} className="block">
                                    <Button className="w-full h-9 bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-500 hover:text-neutral-700 font-bold uppercase tracking-wider text-[9px] rounded-md">
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
                className="h-80 flex flex-col items-center justify-center border border-[#e6e6e6] border-dashed rounded-md bg-white space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-[#f6f5f4] border border-[#e6e6e6] flex items-center justify-center text-neutral-400">
                  <Target size={24} />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-neutral-800">Pipeline Empty</h3>
                  <p className="text-neutral-400 text-xs max-w-xs mx-auto">Start by hunting for new high-conversion leads in target regions.</p>
                </div>
                <Link href="/admin/leads/scrape">
                  <Button className="bg-[#0075de] text-white hover:bg-[#005bab] h-10 px-6 font-bold rounded-md shadow-sm">
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
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-xl bg-white border-l border-[#e6e6e6] shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 border-b border-[#e6e6e6] flex items-center justify-between bg-[#f6f5f4]/40">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-[#0075de]/5 flex items-center justify-center text-[#0075de] border border-[#0075de]/10">
                      <Zap size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-800 tracking-tight leading-none">{outreachLead.business_name}</h2>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">AI Outreach Engine</p>
                    </div>
                  </div>
                  <button onClick={() => setOutreachLead(null)} className="p-2 hover:bg-[#f6f5f4] rounded-md transition-colors text-neutral-400 hover:text-neutral-700">
                    <X size={18} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {/* Section 1: Lead Summary */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Info size={10} /> Lead Intelligence
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-md bg-[#f6f5f4]/50 border border-[#e6e6e6]">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase mb-1">Status</p>
                        <p className="text-xs font-bold text-neutral-700">{outreachLead.has_website ? "Website ✅" : "No Website ❌"}</p>
                      </div>
                      <div className="p-3.5 rounded-md bg-[#f6f5f4]/50 border border-[#e6e6e6]">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase mb-1">Rating</p>
                        <p className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                          <Star size={11} className="text-amber-500 fill-amber-500" /> {outreachLead.google_rating || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-md bg-[#0075de]/5 border border-[#0075de]/10">
                      <p className="text-[9px] font-bold text-[#0075de] uppercase tracking-wider mb-1">Key Insight</p>
                      <p className="text-xs font-medium text-neutral-700 italic">
                        {!outreachLead.has_website ? "Critical lack of digital footprint. High probability for web development project." : "Strong foundation but low social presence detected."}
                      </p>
                    </div>
                  </div>

                  {/* Section 2: AI Messages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Generated Strategy</p>
                      <button
                        onClick={() => generateAIOutreach(outreachLead, true)}
                        disabled={isGenerating}
                        className="text-[9px] font-bold text-[#0075de] hover:text-[#005bab] flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={11} className={cn(isGenerating && "animate-spin")} /> REGENERATE
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-0.5 bg-[#f6f5f4] rounded-md border border-[#e6e6e6]">
                      {(['whatsapp', 'email', 'call'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={cn(
                            "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded transition-all",
                            activeTab === tab ? "bg-white text-neutral-800 border border-[#e6e6e6] shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Message Block */}
                    <div className="relative group">
                      {isGenerating ? (
                        <div className="h-40 rounded-md bg-[#f6f5f4]/50 animate-pulse flex items-center justify-center border border-[#e6e6e6]">
                          <Loader2 className="h-5 w-5 text-neutral-300 animate-spin" />
                        </div>
                      ) : (
                        <>
                          <Textarea
                             value={generatedContent?.[activeTab] || ""}
                             onChange={(e) => setGeneratedContent(cur => cur ? { ...cur, [activeTab]: e.target.value } : null)}
                             className="min-h-[160px] bg-white border-[#e6e6e6] focus:border-[#0075de] text-xs leading-relaxed p-4 h-auto text-neutral-800"
                          />
                          <button
                            onClick={() => {
                              if (generatedContent?.[activeTab]) {
                                navigator.clipboard.writeText(generatedContent[activeTab]);
                                showToast("Copied to clipboard");
                              }
                            }}
                            className="absolute bottom-3 right-3 p-1.5 bg-[#f6f5f4] hover:bg-[#e6e6e6] rounded border border-[#e6e6e6] text-neutral-400 hover:text-neutral-700 transition-all"
                          >
                            <Copy size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-6 border-t border-[#e6e6e6] grid gap-3.5 bg-[#f6f5f4]/40">
                  <div className="flex gap-3">
                    {activeTab === 'whatsapp' && outreachLead.phone && (
                      <a
                        href={`https://wa.me/${outreachLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(generatedContent?.whatsapp || "")}`}
                        target="_blank"
                        className="flex-1"
                      >
                        <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white gap-2 rounded-md shadow-sm">
                          <Send size={15} /> Open WhatsApp
                        </Button>
                      </a>
                    )}
                    {activeTab === 'email' && outreachLead.email && (
                      <a
                        href={`mailto:${outreachLead.email}?subject=Partnership Strategy for ${outreachLead.business_name}&body=${encodeURIComponent(generatedContent?.email || "")}`}
                        className="flex-1"
                      >
                        <Button className="w-full h-11 bg-[#0075de] hover:bg-[#005bab] text-white gap-2 rounded-md shadow-sm">
                          <Mail size={15} /> Open Email
                        </Button>
                      </a>
                    )}
                    {activeTab === 'call' && (
                      <Button onClick={() => showToast("Script copied for call")} className="flex-1 h-11 bg-[#0075de] hover:bg-[#005bab] text-white gap-2 rounded-md shadow-sm">
                        <PhoneCall size={15} /> Copy Script
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={handleMarkContacted}
                    isLoading={updatingId === outreachLead.id}
                    className="w-full h-10 bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-500 hover:text-neutral-700 rounded-md"
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white border border-[#e6e6e6] rounded-md w-full max-w-md p-8 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-neutral-800 tracking-tight mb-1">Add New Lead</h2>
            <p className="text-neutral-400 text-xs mb-6">Manually enter lead information into the pipeline.</p>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Business Name</label>
                <input 
                  type="text" 
                  required
                  value={newLead.business_name}
                  onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 py-2.5 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-xs" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
                <input 
                  type="email" 
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 py-2.5 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-xs" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Phone Number</label>
                <input 
                  type="text" 
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 py-2.5 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-xs" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">City</label>
                <input 
                  type="text" 
                  value={newLead.city}
                  onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-3 py-2.5 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-xs" 
                />
              </div>
              
              <div className="pt-5 flex justify-end gap-2.5 border-t border-[#e6e6e6] mt-6">
                 <Button type="button" onClick={() => setShowAddLead(false)} className="bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-500 h-9 px-4 rounded-md text-[9px] font-bold uppercase tracking-wider">Cancel</Button>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-[#0075de] hover:bg-[#005bab] text-white text-[9px] font-bold uppercase tracking-wider h-9 px-5 rounded-md shadow-sm"
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white border border-[#e6e6e6] rounded-md w-full max-w-md p-8 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-neutral-800 tracking-tight mb-1">Import Leads</h2>
            <p className="text-neutral-400 text-xs mb-6">Upload a CSV file to bulk import leads.</p>
            
            <div 
              className={cn(
                "relative border border-dashed rounded-md p-10 text-center transition-all",
                selectedFile ? "border-emerald-300 bg-emerald-50/50" : "border-[#e6e6e6] bg-[#f6f5f4]/30 hover:bg-[#f6f5f4]/50"
              )}
            >
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Upload size={28} className={cn("mx-auto mb-3", selectedFile ? "text-emerald-600" : "text-neutral-300")} />
              <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">
                {selectedFile ? selectedFile.name : "Drop CSV File Here"}
              </p>
              <p className="text-[9px] text-neutral-400 mt-1 uppercase">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "or click to browse local files"}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 border-t border-[#e6e6e6] pt-5">
               <Button 
                type="button" 
                onClick={() => {
                  setShowImportLead(false);
                  setSelectedFile(null);
                }} 
                className="bg-white border border-[#e6e6e6] hover:bg-[#f6f5f4] text-neutral-500 h-9 px-4 rounded-md text-[9px] font-bold uppercase tracking-wider"
              >
                Cancel
              </Button>
               <Button 
                onClick={handleImportCSV}
                disabled={!selectedFile || isSubmitting}
                className="bg-[#0075de] hover:bg-[#005bab] text-white text-[9px] font-bold uppercase tracking-wider h-9 px-5 rounded-md shadow-sm"
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
