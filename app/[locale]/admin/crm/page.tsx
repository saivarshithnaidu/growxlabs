"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Users, TrendingUp, Download, Upload, Filter, Plus, FileDown, FileText, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/utils";

export default function AdminCRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/crm/leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    if (format === 'csv') {
      window.location.href = '/api/crm/export?format=csv'; 
    } else {
      alert(`${format.toUpperCase()} export functionality is building...`);
    }
    setShowExport(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportCSV = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      const text = await selectedFile.text();
      const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
      if (lines.length < 2) throw new Error("File is empty or invalid");

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/["']/g, ""));
      const data = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim().replace(/["']/g, ""));
        const obj: any = {};
        headers.forEach((header, i) => {
          if (header.includes("business") || header.includes("name")) obj.business_name = values[i];
          if (header.includes("email")) obj.email = values[i];
          if (header.includes("phone")) obj.phone = values[i];
          if (header.includes("city")) obj.city = values[i];
          if (header.includes("status")) obj.status = values[i];
        });
        return obj;
      });

      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: data })
      });

      if (!res.ok) throw new Error("Import failed");
      const result = await res.json();
      alert(`Success: ${result.count} leads imported`);
      setShowImport(false);
      setSelectedFile(null);
      fetchLeads();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const kpis = [
    { title: "Total Leads", value: leads.length, change: "+12%", icon: Users, accent: "blue" },
    { title: "Pipeline Value", value: "$45,000", change: "+8%", icon: TrendingUp, accent: "green" },
    { title: "Conversion Rate", value: "14%", change: "+2%", icon: TrendingUp, accent: "amber" },
    { title: "Follow-ups Due", value: "24", change: "-5%", icon: TrendingUp, accent: "purple" },
  ];

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">CRM Dashboard</h1>
            <p className="text-[var(--text-secondary)] text-sm">Manage leads, track pipeline, and monitor agent performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowImport(true)} variant="outline" className="h-10 px-4 bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
              <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>
            <Button onClick={() => setShowExport(true)} variant="outline" className="h-10 px-4 bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
              <Download className="w-4 h-4 mr-2" /> Export Data
            </Button>
            <Link href="/admin/crm/sources">
              <Button variant="outline" className="h-10 px-4 bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]">
                Lead Sources
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => {
          const accColor = {
            blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            green: "text-primary bg-primary/10 border-primary/20",
            amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
            purple: "text-purple-400 bg-purple-400/10 border-purple-400/20"
          }[kpi.accent as string];

          const Icon = kpi.icon;

          return (
            <Reveal key={i} delay={i * 0.05}>
              <div className="group relative bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 rounded-2xl hover:border-[var(--border-hover)] transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                   <div className={cn("p-2.5 rounded-xl border", accColor)}>
                      <Icon size={18} />
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                     <ArrowUpRight size={12} />
                     {kpi.change}
                   </div>
                </div>
                
                <div>
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] mb-1">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{kpi.value}</h3>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* ADMIN LEADS TABLE */}
      <Reveal delay={0.2}>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--surface-2)]">
            <h2 className="text-lg font-bold text-white tracking-tight">All Leads</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] w-10"><input type="checkbox" className="rounded border-gray-600 bg-transparent" /></th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Business / Contact</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Status</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Agent</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] bg-transparent">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">Loading leads...</td></tr>
                ) : leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-600 bg-transparent" /></td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white mb-1">{lead.business_name}</div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">{lead.contact_name} • {lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-full text-[9px] font-bold uppercase tracking-widest text-white">{lead.status}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {lead.assigned_to_member?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* EXPORT MODAL */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Export Data</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Select format to export your CRM leads.</p>
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={() => handleExport('csv')} variant="outline" className="h-14 justify-start bg-[var(--surface-2)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]">
                <FileText className="w-5 h-5 mr-3 text-primary" /> Export as CSV (Excel)
              </Button>
              <Button onClick={() => handleExport('pdf')} variant="outline" className="h-14 justify-start bg-[var(--surface-2)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]">
                <FileDown className="w-5 h-5 mr-3 text-red-400" /> Export as PDF
              </Button>
              <Button onClick={() => handleExport('docx')} variant="outline" className="h-14 justify-start bg-[var(--surface-2)] border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:bg-white/[0.02]">
                <FileText className="w-5 h-5 mr-3 text-blue-400" /> Export as DOCX
              </Button>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowExport(false)} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Import Leads</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Upload a CSV file containing lead data.</p>
            
            <div className={cn(
              "relative border-2 border-dashed rounded-xl p-8 text-center bg-[var(--surface-2)] mb-4 hover:border-[var(--border-hover)] hover:bg-white/[0.02] transition-colors",
              selectedFile ? "border-primary/40 bg-primary/5" : "border-[var(--border-subtle)]"
            )}>
               <input 
                 type="file" 
                 onChange={handleFileChange}
                 accept=".csv"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <Upload className={cn("w-8 h-8 mx-auto mb-3", selectedFile ? "text-primary" : "text-[var(--text-muted)]")} />
               <div className="text-sm font-semibold text-white">
                 {selectedFile ? selectedFile.name : "Click to upload CSV"}
               </div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-2">
                 {selectedFile ? `${(selectedFile.size / 1024).toFixed(2)} KB` : "Maximum file size 5MB"}
               </div>
            </div>
            <div className="text-center">
              <button type="button" onClick={() => alert('Template download is being generated...')} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">Download Template</button>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button onClick={() => { setShowImport(false); setSelectedFile(null); }} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white">Cancel</Button>
              <Button 
                onClick={handleImportCSV}
                disabled={!selectedFile || isSubmitting}
                className="bg-white text-black hover:bg-gray-200 text-[10px] font-bold uppercase tracking-widest h-10 px-6 min-w-[120px]"
              >
                {isSubmitting ? "Importing..." : "Import Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
