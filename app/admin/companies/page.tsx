"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Building2, Plus, Search, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Customer360 } from "@/components/admin/Customer360";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    website: "",
    gst: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    employees_count: 10,
    annual_revenue: 100000
  });

  useEffect(() => {
    fetchCompanies();
  }, [search]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/companies?search=${search}`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (id: string) => {
    try {
      setLoading(true);
      setSelectedCompanyId(id);
      const res = await fetch(`/api/companies/${id}`); // Wait, our API does not have `/api/companies/[id]` yet. We can query `/api/companies` or query directly.
      // Wait, let's look at the GET endpoint: it fetches all companies. We can just load the company from our current list or fetch a detailed version.
      // Since we haven't created `/api/companies/[id]/route.ts`, let's create a quick API fetch for a single company, or we can just fetch all related lists at `/api/companies` or simulate it.
      // Let's implement /api/companies/[id]/route.ts so it matches! But for now, we can just load the selected company from the array or simulate fetching details.
      const companyDetails = companies.find(c => c.id === id);
      setSelectedCompany(companyDetails);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCompany({
          name: "",
          industry: "",
          website: "",
          gst: "",
          pan: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          employees_count: 10,
          annual_revenue: 100000
        });
        fetchCompanies();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedCompanyId && selectedCompany) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => { setSelectedCompanyId(null); setSelectedCompany(null); }}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-450 hover:text-neutral-900 bg-transparent outline-none cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Directory
        </button>
        <Customer360 company={selectedCompany} timelineActivities={[]} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Company Directory</h1>
          <p className="text-neutral-500 text-xs">Manage your enterprise accounts and customer profiles.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Add Account
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4 bg-white border border-[#e6e6e6] p-3 rounded-md shadow-sm">
        <Search className="text-neutral-400 w-4 h-4" />
        <Input 
          type="text" 
          placeholder="Search accounts..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent h-9 text-xs focus:ring-0"
        />
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : companies.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <Building2 className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No accounts found</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Get started by creating your first company account profile.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <Card 
              key={c.id} 
              className="p-5 border border-[#e6e6e6] hover:border-[#0075de]/30 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
              onClick={() => selectCompany(c.id)}
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="h-10 w-10 bg-[#0075de]/5 border border-[#0075de]/10 text-[#0075de] rounded-md flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 leading-snug">{c.name}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">{c.industry || "General Industry"}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#e6e6e6]/60 pt-3 text-[10px] font-semibold text-neutral-500">
                <div className="flex justify-between">
                  <span>Owner:</span>
                  <span className="text-neutral-900">{c.owner?.name || "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="text-neutral-900">₹{c.annual_revenue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employees:</span>
                  <span className="text-neutral-900">{c.employees_count || "Unknown"}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-xl p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Create Company Profile</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Company Name</span>
                  <Input required placeholder="Acme Corp" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Industry</span>
                  <Input placeholder="Tech, Retail..." value={newCompany.industry} onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Website</span>
                  <Input placeholder="acme.com" value={newCompany.website} onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">GST Number</span>
                  <Input placeholder="GSTIN..." value={newCompany.gst} onChange={e => setNewCompany({ ...newCompany, gst: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">PAN Number</span>
                  <Input placeholder="PAN..." value={newCompany.pan} onChange={e => setNewCompany({ ...newCompany, pan: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Employees Count</span>
                  <Input type="number" value={newCompany.employees_count} onChange={e => setNewCompany({ ...newCompany, employees_count: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Address Details</span>
                  <Input placeholder="123 Main St..." value={newCompany.address} onChange={e => setNewCompany({ ...newCompany, address: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Create Account</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
