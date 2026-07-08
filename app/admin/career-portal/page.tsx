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
      const res = await fetch(`/api/admin/career-portal/list?t=${Date.now()}`);
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
      const res = await fetch("/api/admin/career-portal/update", {
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
      const res = await fetch("/api/admin/career-portal/update", {
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
              className="relative w-full max-w-2xl bg-white border-l border-neutral-200 shadow-2xl flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 tracking-tight leading-none">{activeCandidate.name}</h2>
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1.5">// Candidate Dossier</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveCandidate(null)} 
                  className="p-2 hover:bg-neutral-200 rounded-md transition-colors text-neutral-500 hover:text-neutral-950"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white">
                
                {/* 1. Header Info section with a neat structured profile header */}
                <div className="border-b border-neutral-200 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">// Application Dossier</p>
                      <h3 className="text-2xl font-bold text-neutral-900 tracking-tight mt-1">{activeCandidate.name}</h3>
                      <p className="text-xs text-primary font-bold mt-1 tracking-wider uppercase">{activeCandidate.role || "Not specified"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Current Status</p>
                      <div className="mt-1">{getStatusBadge(activeCandidate.status)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs font-mono">
                    <div>
                      <span className="block text-[9px] text-neutral-550 uppercase">Location</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{activeCandidate.location || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-neutral-550 uppercase">Experience</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{activeCandidate.experience || "0"} Years</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-neutral-550 uppercase">Employment</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{activeCandidate.employment_type || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-neutral-550 uppercase">Applied Date</span>
                      <span className="font-bold text-neutral-900 mt-1 block">{new Date(activeCandidate.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Structured Dossier Form Layout */}
                <div className="space-y-6">
                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                    <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">01. Contact Credentials</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-450 uppercase tracking-wider block">Primary Email</span>
                        <a href={`mailto:${activeCandidate.email}`} className="text-neutral-900 hover:text-primary transition-colors font-bold block truncate">{activeCandidate.email}</a>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Phone Number</span>
                        <a href={`tel:${activeCandidate.phone}`} className="text-neutral-900 hover:text-primary transition-colors font-bold block">{activeCandidate.phone || "Not provided"}</a>
                      </div>
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                    <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">02. Career & Compensation Settings</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Expected Compensation</span>
                        <span className="text-neutral-900 font-bold block">{activeCandidate.expected_salary || "Not specified"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Notice Period / Availability</span>
                        <span className="text-neutral-900 font-bold block">{activeCandidate.notice_period || "Not specified"}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Last/Current Job Title</span>
                        <span className="text-neutral-900 font-bold block">{activeCandidate.job_title || "Not specified"}</span>
                      </div>
                    </div>
                    <div className="p-5 border-t border-neutral-200 text-sm font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Last/Current Employer</span>
                        <span className="text-neutral-900 font-bold block">{activeCandidate.company || "Not specified"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                    <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">03. Systems Expertise & Stack</span>
                    </div>
                    <div className="p-5 text-sm font-sans space-y-2">
                      <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Primary Languages & Technologies</span>
                      <p className="text-neutral-800 leading-relaxed font-bold">{activeCandidate.tech_stack || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                    <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">04. Candidate Motivation</span>
                    </div>
                    <div className="p-5 text-sm font-sans space-y-2">
                      <span className="text-[10px] font-mono text-neutral-455 uppercase tracking-wider block">Why join the team?</span>
                      <p className="text-neutral-800 leading-relaxed italic whitespace-pre-line font-bold bg-neutral-100/50 p-4 rounded-lg border border-neutral-200">
                        "{activeCandidate.motivation || "No motivation statement provided."}"
                      </p>
                    </div>
                  </div>

                  <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                    <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-wider">05. Professional Footprints & Links</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeCandidate.resume_url && (
                        <a 
                          href={activeCandidate.resume_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-xs font-bold text-neutral-800 transition-all duration-300"
                        >
                          <span className="flex items-center gap-2.5 text-neutral-750"><FileText className="h-4 w-4 text-emerald-600" /> Resume / CV Document</span>
                          <ExternalLink size={12} className="text-neutral-450" />
                        </a>
                      )}
                      {activeCandidate.github_url && (
                        <a 
                          href={activeCandidate.github_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-xs font-bold text-neutral-800 transition-all duration-300"
                        >
                          <span className="flex items-center gap-2.5 text-neutral-750"><Link2 className="h-4 w-4 text-neutral-500" /> GitHub Repository</span>
                          <ExternalLink size={12} className="text-neutral-450" />
                        </a>
                      )}
                      {activeCandidate.linkedin_url && (
                        <a 
                          href={activeCandidate.linkedin_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-xs font-bold text-neutral-800 transition-all duration-300"
                        >
                          <span className="flex items-center gap-2.5 text-neutral-750"><Link2 className="h-4 w-4 text-blue-600" /> LinkedIn Profile</span>
                          <ExternalLink size={12} className="text-neutral-450" />
                        </a>
                      )}
                      {activeCandidate.portfolio_url && (
                        <a 
                          href={activeCandidate.portfolio_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-xs font-bold text-neutral-800 transition-all duration-300"
                        >
                          <span className="flex items-center gap-2.5 text-neutral-750"><Link2 className="h-4 w-4 text-purple-600" /> Portfolio Website</span>
                          <ExternalLink size={12} className="text-neutral-450" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Notes and internal review */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2"><Save size={12} /> Internal Hiring Notes</p>
                  <div className="space-y-2">
                    <textarea
                      value={candidateNotes}
                      onChange={e => setCandidateNotes(e.target.value)}
                      placeholder="Write internal notes about candidate interview, technical assessment results, or communications..."
                      rows={3}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-[#C0F0FB] focus:outline-none p-4 rounded-xl text-xs text-neutral-800 leading-relaxed resize-none transition-all duration-300"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        {savingNotes ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions (Status Updates) */}
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-3">
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">// Update Candidate Stage</p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "reviewed")}
                    disabled={updatingStatus || activeCandidate.status === "reviewed"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer",
                      activeCandidate.status === "reviewed"
                        ? "bg-neutral-200 border-neutral-300 text-neutral-850"
                        : "bg-transparent border-neutral-300 hover:border-neutral-500 text-neutral-700"
                    )}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "shortlisted")}
                    disabled={updatingStatus || activeCandidate.status === "shortlisted"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer",
                      activeCandidate.status === "shortlisted"
                        ? "bg-purple-100 border-purple-200 text-purple-800"
                        : "bg-transparent border-neutral-300 hover:border-purple-500 hover:text-purple-705 text-neutral-700"
                    )}
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "contacted")}
                    disabled={updatingStatus || activeCandidate.status === "contacted"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer",
                      activeCandidate.status === "contacted"
                        ? "bg-amber-100 border-amber-200 text-amber-800"
                        : "bg-transparent border-neutral-300 hover:border-amber-500 hover:text-amber-705 text-neutral-700"
                    )}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "hired")}
                    disabled={updatingStatus || activeCandidate.status === "hired"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer",
                      activeCandidate.status === "hired"
                        ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                        : "bg-transparent border-neutral-300 hover:border-emerald-500 hover:text-emerald-705 text-neutral-700"
                    )}
                  >
                    Hire
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeCandidate.id, "rejected")}
                    disabled={updatingStatus || activeCandidate.status === "rejected"}
                    className={cn(
                      "px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-300 cursor-pointer ml-auto",
                      activeCandidate.status === "rejected"
                        ? "bg-rose-100 border-rose-200 text-rose-800"
                        : "bg-transparent border-neutral-300 hover:border-rose-500 hover:text-rose-705 text-neutral-700 hover:bg-rose-50/50"
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
