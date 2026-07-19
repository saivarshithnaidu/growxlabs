"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RecruitmentPipeline } from "@/components/admin/hrms/RecruitmentPipeline";

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", salary_range: "", requirements: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hrms/recruitment");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreateJob = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/hrms/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          requirements: jobForm.requirements.split(",").map(r => r.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        setShowJobForm(false);
        setJobForm({ title: "", description: "", salary_range: "", requirements: "" });
        fetchJobs();
      }
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const handleUpdateStage = async (candidateId: string, newStage: string) => {
    try {
      // Direct Supabase update via API is not available, so we'll refetch
      // In production, this would call a dedicated PATCH endpoint
      fetchJobs();
    } catch (e) { console.error(e); }
  };

  const allCandidates = jobs.flatMap((j: any) => (j.candidates || []).map((c: any) => ({ ...c, job_title: j.title })));

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Recruitment Pipeline</h1>
        <p className="text-neutral-500 text-xs">Track job openings, candidate stages, and hiring workflows.</p>
      </div>

      {/* Job Openings */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Job Openings</span>
        <button
          onClick={() => setShowJobForm(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> New Job
        </button>
      </div>

      {showJobForm && (
        <Card className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-neutral-800">Create Job Opening</h3>
            <button onClick={() => setShowJobForm(false)} className="text-neutral-400 hover:text-neutral-600"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Job Title</label>
              <input type="text" placeholder="Senior React Developer" value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Salary Range</label>
              <input type="text" placeholder="₹12L - ₹24L" value={jobForm.salary_range}
                onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Description</label>
              <textarea placeholder="Job description..." value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-16 resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1 block">Requirements (comma-separated)</label>
              <input type="text" placeholder="React, TypeScript, Next.js" value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <button onClick={handleCreateJob} disabled={submitting}
            className="mt-4 bg-gradient-to-r from-[#0075de] to-[#005bab] text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Create Opening"}
          </button>
        </Card>
      )}

      {/* Job Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job: any) => (
            <Card key={job.id} className="p-4 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
              <h4 className="text-xs font-bold text-neutral-800">{job.title}</h4>
              <p className="text-[9px] text-neutral-400 mt-1">{job.department?.name || "—"} · {job.salary_range || "—"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 text-[8px] font-bold">
                  {job.candidates?.length || 0} Applicants
                </span>
                {job.is_active && <span className="text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-200 text-[8px] font-bold">Active</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Candidates Pipeline */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-8 w-8" />
        </div>
      ) : (
        <RecruitmentPipeline candidates={allCandidates} onUpdateStage={handleUpdateStage} />
      )}
    </div>
  );
}
