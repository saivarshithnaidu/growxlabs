"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Filter, Mail, Phone, MapPin, Briefcase, Calendar, Link2, FileText, CheckCircle, XCircle, AlertCircle, Clock, Save, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Status helpers
const STATUSES = [
  { value: "all", label: "All Statuses", color: "bg-neutral-500/10 text-neutral-400 border-neutral-850" },
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-400 border-blue-900/30" },
  { value: "reviewed", label: "Reviewed", color: "bg-zinc-500/10 text-zinc-400 border-zinc-900/30" },
  { value: "shortlisted", label: "Shortlisted", color: "bg-purple-500/10 text-purple-400 border-purple-900/30" },
  { value: "contacted", label: "Contacted", color: "bg-amber-500/10 text-amber-400 border-amber-900/30" },
  { value: "hired", label: "Hired", color: "bg-emerald-500/10 text-emerald-400 border-emerald-900/30" },
  { value: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-400 border-rose-900/30" }
];

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  
  // Selected candidate detail panel state
  const [activeCandidate, setActiveCandidate] = useState<any | null>(null);
  const [candidateNotes, setCandidateNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (activeCandidate) {
      setCandidateNotes(activeCandidate.notes || "");
    }
  }, [activeCandidate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/careers/list?t=${Date.now()}`);
      const data = await res.json();
      setApplications(data || []);
    } catch (e) {
      console.error("Failed to fetch applications:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/admin/careers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
        setActiveCandidate((prev: any) => prev && prev.id === id ? { ...prev, status } : prev);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeCandidate) return;
    try {
      setSavingNotes(true);
      const res = await fetch("/api/admin/careers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeCandidate.id, notes: candidateNotes })
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(prev => prev.map(app => app.id === activeCandidate.id ? { ...app, notes: candidateNotes } : app));
        setActiveCandidate((prev: any) => prev ? { ...prev, notes: candidateNotes } : null);
        alert("Internal notes saved successfully");
      } else {
        alert(data.error || "Failed to save notes");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving notes");
    } finally {
      setSavingNotes(false);
    }
  };

  // Filter candidates
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchesRole = selectedRole === "all" || app.role === selectedRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Extract unique roles from submissions for filters
  const uniqueRoles = Array.from(new Set(applications.map(app => app.role).filter(Boolean)));

  const getStatusBadge = (statusValue: string) => {
    const status = STATUSES.find(s => s.value === statusValue) || STATUSES[1];
    return (
      <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", status.color)}>
        {status.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Loading Candidates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Careers Portal</h1>
            <p className="text-[var(--text-secondary)] text-sm">Review candidate applications and systems expertise.</p>
          </div>
        </div>
      </Reveal>

      {/* ═══ FILTER BAR ═══ */}
      <Reveal y={10}>
        <div className="p-5 border border-[var(--border-subtle)] bg-[var(--surface-1)] rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search candidate name, email, or role..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] focus:border-white focus:outline-none pl-12 pr-4 py-3 rounded-xl text-sm transition-all placeholder-[var(--text-muted)] text-white"
            />
          </div>

          {/* Status filter */}
          <div className="w-full md:w-52 relative">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-[var(--text-secondary)] appearance-none cursor-pointer"
            >
              {STATUSES.map(status => (
                <option key={status.value} value={status.value} className="bg-[var(--surface-1)]">
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role filter */}
          <div className="w-full md:w-56 relative">
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm transition-all text-[var(--text-secondary)] appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[var(--surface-1)]">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role as string} value={role as string} className="bg-[var(--surface-1)]">
                  {role as string}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Reveal>

      {/* ═══ APPLICATIONS LIST ═══ */}
      <div className="grid gap-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app, i) => (
            <Reveal key={app.id} delay={i * 0.02}>
              <div 
                onClick={() => setActiveCandidate(app)}
                className="p-6 border border-[var(--border-subtle)] bg-[var(--surface-1)] hover:border-[var(--border-hover)] hover:shadow-sm cursor-pointer transition-all rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col md:flex-row md:items-center gap-6 flex-grow">
                  <div className="space-y-1 md:w-56">
                    <p className="font-bold text-white tracking-tight text-base group-hover:text-primary transition-colors">{app.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium truncate max-w-xs">{app.email}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">{app.phone || "No Phone"}</p>
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{app.role || "Not specified"}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Exp: {app.experience || "0"} Years | {app.location || "Unknown"}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-medium line-clamp-1 italic max-w-lg">"{app.motivation || "No statement"}"</p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-4 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Submitted On</p>
                    <p className="text-xs text-[var(--text-secondary)] font-semibold">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <Reveal>
            <div className="h-64 flex flex-col items-center justify-center border border-[var(--border-subtle)] border-dashed rounded-xl bg-[var(--surface-1)]">
              <AlertCircle className="text-[var(--text-muted)] mb-4" size={48} />
              <p className="text-[var(--text-secondary)] text-sm font-medium">No career applications found.</p>
            </div>
          </Reveal>
        )}
      </div>

      {/* ═══ CANDIDATE DETAILS SIDE DRAWER ═══ */}
      <AnimatePresence>
        {activeCandidate && (
          <div className="fixed inset-0 z-[250] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCandidate(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border-l border-zinc-900 shadow-2xl flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight leading-none">{activeCandidate.name}</h2>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5">// Candidate Dossier</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveCandidate(null)} 
                  className="p-2 hover:bg-zinc-900 rounded-md transition-colors text-zinc-500 hover:text-white"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. Header Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Application Status</p>
                    <div className="pt-1">{getStatusBadge(activeCandidate.status)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Applied Date</p>
                    <p className="text-xs font-bold text-white mt-1.5">{new Date(activeCandidate.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* 2. Contact details */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Contact & Logistics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-3">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Email Address</p>
                        <a href={`mailto:${activeCandidate.email}`} className="text-xs font-bold text-white hover:underline truncate block max-w-xs">{activeCandidate.email}</a>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-3">
                      <Phone className="h-4 w-4 text-zinc-500" />
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Phone Number</p>
                        <a href={`tel:${activeCandidate.phone}`} className="text-xs font-bold text-white hover:underline">{activeCandidate.phone || "Not provided"}</a>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-zinc-500" />
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Current Location</p>
                        <p className="text-xs font-bold text-white">{activeCandidate.location || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center gap-3">
                      <Clock className="h-4 w-4 text-zinc-500" />
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Notice Period</p>
                        <p className="text-xs font-bold text-white">{activeCandidate.notice_period || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Role and Compensation */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} /> Target Role & Compensation</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase">Target Role</p>
                      <p className="text-xs font-bold text-white mt-1">{activeCandidate.role || "Not specified"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase">Employment Type</p>
                      <p className="text-xs font-bold text-white mt-1">{activeCandidate.employment_type || "Not specified"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase">Expected Salary</p>
                      <p className="text-xs font-bold text-white mt-1">{activeCandidate.expected_salary || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Experience & Tech Stack */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} /> Experience & Technical Skills</p>
                  <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Years of Experience</p>
                        <p className="text-sm font-bold text-white mt-0.5">{activeCandidate.experience || "0"} Years</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Current/Last Title</p>
                        <p className="text-sm font-bold text-white mt-0.5">{activeCandidate.job_title || "Not specified"} at {activeCandidate.company || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="border-t border-zinc-900 pt-3">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1">Technical Stack Details</p>
                      <p className="text-xs font-semibold text-zinc-300 leading-relaxed">{activeCandidate.tech_stack || "Not specified"}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Links */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Link2 size={12} /> Professional Footprints</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCandidate.resume_url && (
                      <a 
                        href={activeCandidate.resume_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-4 rounded-xl border border-zinc-900 hover:border-white bg-zinc-950 flex items-center justify-between text-xs font-bold text-white transition-all"
                      >
                        <span className="flex items-center gap-2.5 text-zinc-300"><FileText className="h-4 w-4 text-emerald-400" /> Resume / CV</span>
                        <ExternalLink size={12} className="text-zinc-500" />
                      </a>
                    )}
                    {activeCandidate.github_url && (
                      <a 
                        href={activeCandidate.github_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-4 rounded-xl border border-zinc-900 hover:border-white bg-zinc-950 flex items-center justify-between text-xs font-bold text-white transition-all"
                      >
                        <span className="flex items-center gap-2.5 text-zinc-300"><Link2 className="h-4 w-4 text-zinc-400" /> GitHub Profile</span>
                        <ExternalLink size={12} className="text-zinc-500" />
                      </a>
                    )}
                    {activeCandidate.linkedin_url && (
                      <a 
                        href={activeCandidate.linkedin_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-4 rounded-xl border border-zinc-900 hover:border-white bg-zinc-950 flex items-center justify-between text-xs font-bold text-white transition-all"
                      >
                        <span className="flex items-center gap-2.5 text-zinc-300"><Link2 className="h-4 w-4 text-blue-400" /> LinkedIn Profile</span>
                        <ExternalLink size={12} className="text-zinc-500" />
                      </a>
                    )}
                    {activeCandidate.portfolio_url && (
                      <a 
                        href={activeCandidate.portfolio_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-4 rounded-xl border border-zinc-900 hover:border-white bg-zinc-950 flex items-center justify-between text-xs font-bold text-white transition-all"
                      >
                        <span className="flex items-center gap-2.5 text-zinc-300"><Link2 className="h-4 w-4 text-purple-400" /> Portfolio Website</span>
                        <ExternalLink size={12} className="text-zinc-500" />
                      </a>
                    )}
                  </div>
                </div>

                {/* 6. Motivation */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><FileText size={12} /> Why GrowX Labs Tech?</p>
                  <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-900">
                    <p className="text-xs text-zinc-300 leading-relaxed italic">"{activeCandidate.motivation || "No statement provided."}"</p>
                  </div>
                </div>

                {/* 7. Notes and internal review */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Save size={12} /> Internal Hiring Notes</p>
                  <div className="space-y-2">
                    <textarea
                      value={candidateNotes}
                      onChange={e => setCandidateNotes(e.target.value)}
                      placeholder="Write internal notes about candidate interview, technical assessment results, or communications..."
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-white focus:outline-none p-4 rounded-xl text-xs text-zinc-300 leading-relaxed resize-none transition-all"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        {savingNotes ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Actions (Status Updates) */}
              <div className="p-6 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-3">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">// Update Candidate Stage</p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "reviewed")}
                    disabled={updatingStatus || activeCandidate.status === "reviewed"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                      activeCandidate.status === "reviewed"
                        ? "bg-zinc-500/10 border-zinc-900/30 text-zinc-400"
                        : "bg-transparent border-zinc-800 hover:border-zinc-500 text-zinc-300"
                    )}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "shortlisted")}
                    disabled={updatingStatus || activeCandidate.status === "shortlisted"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                      activeCandidate.status === "shortlisted"
                        ? "bg-purple-500/10 border-purple-900/30 text-purple-400"
                        : "bg-transparent border-zinc-800 hover:border-purple-500 text-purple-300"
                    )}
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "contacted")}
                    disabled={updatingStatus || activeCandidate.status === "contacted"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                      activeCandidate.status === "contacted"
                        ? "bg-amber-500/10 border-amber-900/30 text-amber-400"
                        : "bg-transparent border-zinc-800 hover:border-amber-500 text-amber-300"
                    )}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "hired")}
                    disabled={updatingStatus || activeCandidate.status === "hired"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer",
                      activeCandidate.status === "hired"
                        ? "bg-emerald-500/10 border-emerald-900/30 text-emerald-400"
                        : "bg-transparent border-zinc-800 hover:border-emerald-500 text-emerald-300"
                    )}
                  >
                    Hire
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "rejected")}
                    disabled={updatingStatus || activeCandidate.status === "rejected"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ml-auto",
                      activeCandidate.status === "rejected"
                        ? "bg-rose-500/10 border-rose-900/30 text-rose-400"
                        : "bg-transparent border-zinc-800 hover:border-rose-500 text-rose-350 hover:bg-rose-500/5"
                    )}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
