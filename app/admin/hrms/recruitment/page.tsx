"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import {
  Badge, Button, DataTable, Input, KPIItem, KPIStrip, Modal, Tabs, TabsList, TabsTrigger, Textarea, toast, type BadgeVariant, type DataTableColumn,
} from "@/src/components/ui";
import { EmptyState, ErrorState, FormField, PageHeader } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";
import { RecruitmentPipeline } from "@/components/admin/hrms/RecruitmentPipeline";

type Job = { id: string; title: string; department?: string | null; location?: string | null; status: string; applications_close_at?: string | null; candidates?: any[] };

const BLANK = { title: "", department: "", description: "", salary_range: "", requirements: "", location: "India", employment_type: "Full-time", workplace_type: "On-site", applications_open_at: "", applications_close_at: "", application_limit: "" };
const JOB_BADGE: Record<string, BadgeVariant> = { published: "success", scheduled: "info", closed: "neutral", draft: "neutral" };
const VIEWS = [
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "jobs", label: "Jobs" },
];
const human = (v: string) => v.charAt(0).toUpperCase() + v.slice(1).replaceAll("_", " ");

/* Jobs and candidates in one place. Stage changes email the candidate, as they always have. */
export default function RecruitmentPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("active");
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setError("");
    try {
      const res = await fetch("/api/hrms/recruitment", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recruitment couldn't load.");
      setJobs(data.jobs || []);
      const interviewRes = await fetch("/api/admin/recruitment/interviews", { cache: "no-store" });
      if (interviewRes.ok) setInterviews((await interviewRes.json()).interviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recruitment couldn't load.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const candidates = useMemo(
    () => jobs.flatMap((j) => (j.candidates || []).map((c) => ({ ...c, job_title: j.title, interview: interviews.find((i) => i.application_id === c.id) || null }))),
    [jobs, interviews],
  );
  const active = candidates.filter((c) => c.status !== "rejected");
  const rejected = candidates.filter((c) => c.status === "rejected");

  async function moveStage(id: string, stage: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/hrms/recruitment", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId: id, stage }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      await load();
    } catch (err) {
      toast({ title: err instanceof Error && err.message ? err.message : "Couldn't update the stage", variant: "danger" });
    } finally {
      setUpdatingId(null);
    }
  }

  async function postJob(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/hrms/recruitment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.split(",").map((r) => r.trim()).filter(Boolean),
          applications_open_at: form.applications_open_at ? new Date(form.applications_open_at).toISOString() : null,
          applications_close_at: form.applications_close_at ? new Date(form.applications_close_at).toISOString() : null,
          application_limit: form.application_limit ? Number(form.application_limit) : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't publish this job.");
      setPosting(false);
      setForm(BLANK);
      toast({ title: "Job published", variant: "success" });
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't publish this job.");
    } finally {
      setSaving(false);
    }
  }

  const jobColumns: DataTableColumn<Job>[] = [
    { id: "title", header: "Job", width: "40%", sortValue: (j) => j.title, cell: (j) => <span className="ds-t-body-strong text-[var(--text-primary)]">{j.title}</span> },
    { id: "department", header: "Department", sortValue: (j) => j.department || "", cell: (j) => j.department || <span className="text-[var(--text-disabled)]">Not set</span> },
    { id: "location", header: "Location", sortValue: (j) => j.location || "", cell: (j) => j.location || "" },
    { id: "applicants", header: "Applicants", numeric: true, sortValue: (j) => j.candidates?.length || 0, cell: (j) => <span className="ds-num">{j.candidates?.length || 0}</span> },
    { id: "status", header: "Status", sortValue: (j) => j.status, cell: (j) => <Badge variant={JOB_BADGE[j.status] || "neutral"}>{human(j.status)}</Badge> },
  ];

  const text = (key: keyof typeof BLANK, label: string, type = "text", required = false) => (
    <FormField label={label} required={required}>
      {(field) => <Input {...field} type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />}
    </FormField>
  );

  return (
    <div>
      <PageHeader
        title="Jobs & candidates"
        breadcrumb={breadcrumb}
        actions={
          <>
            <Button variant="secondary" asChild><Link href="/admin/career-portal/playbook">Interview playbook</Link></Button>
            <Button variant="primary" iconLeft={<Plus size={14} />} onClick={() => { setFormError(""); setPosting(true); }}>Post job</Button>
          </>
        }
      />

      {error ? (
        <ErrorState title="Recruitment couldn't load" description={error} onRetry={load} />
      ) : (
        <>
          <div className="mb-4">
            <KPIStrip>
              <KPIItem label="Open jobs" value={jobs.filter((j) => j.status === "published").length} loading={loading} />
              <KPIItem label="Active candidates" value={active.length} loading={loading} />
              <KPIItem label="At offer" value={active.filter((c) => c.stage === "OFFER").length} loading={loading} />
              <KPIItem label="Hired" value={candidates.filter((c) => c.stage === "HIRED").length} loading={loading} />
            </KPIStrip>
          </div>

          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              {VIEWS.map((v) => <TabsTrigger key={v.value} value={v.value}>{v.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>

          <div className="mt-4">
            {view === "jobs" ? (
              <DataTable
                label="Jobs"
                columns={jobColumns}
                rows={jobs}
                getRowId={(j) => j.id}
                loading={loading}
                hideToolbar
                emptyState={<EmptyState icon={<Briefcase size={20} />} title="No jobs yet" />}
              />
            ) : !loading && (
              <RecruitmentPipeline
                candidates={view === "rejected" ? rejected : active}
                onUpdateStage={moveStage}
                updatingCandidateId={updatingId}
                onRefresh={load}
                showRejected={view === "rejected"}
              />
            )}
          </div>
        </>
      )}

      <Modal
        open={posting}
        onOpenChange={setPosting}
        title="Post job"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPosting(false)}>Cancel</Button>
            <Button variant="primary" type="submit" form="post-job" loading={saving}>Publish job</Button>
          </>
        }
      >
        <form id="post-job" onSubmit={postJob} className="grid gap-4 sm:grid-cols-2">
          {text("title", "Job title", "text", true)}
          {text("department", "Department")}
          <div className="sm:col-span-2">
            <FormField label="Description">
              {(field) => <Textarea id={field.id} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />}
            </FormField>
          </div>
          <div className="sm:col-span-2">{text("requirements", "Requirements, separated by commas")}</div>
          {text("salary_range", "Salary range")}
          {text("location", "Location")}
          {text("employment_type", "Employment type")}
          {text("workplace_type", "Workplace")}
          {text("applications_open_at", "Opens", "datetime-local")}
          {text("applications_close_at", "Closes", "datetime-local")}
          {text("application_limit", "Application limit", "number")}
          {formError && <p role="alert" className="ds-t-meta text-[var(--danger)] sm:col-span-2">{formError}</p>}
        </form>
      </Modal>
    </div>
  );
}
