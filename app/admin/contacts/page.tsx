"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Users, Plus, Search, Mail, Phone, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newContact, setNewContact] = useState({
    company_id: "",
    first_name: "",
    last_name: "",
    job_title: "",
    department: "",
    email: "",
    phone: "",
    linkedin_url: "",
    is_decision_maker: false
  });

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, [search]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts?search=${search}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewContact({
          company_id: "",
          first_name: "",
          last_name: "",
          job_title: "",
          department: "",
          email: "",
          phone: "",
          linkedin_url: "",
          is_decision_maker: false
        });
        fetchContacts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Contacts Directory</h1>
          <p className="text-neutral-500 text-xs">Manage individual lead contacts, decision makers, and emails.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Add Contact
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4 bg-white border border-[#e6e6e6] p-3 rounded-md shadow-sm">
        <Search className="text-neutral-400 w-4 h-4" />
        <Input 
          type="text" 
          placeholder="Search contacts..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent h-9 text-xs focus:ring-0"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <Users className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No contacts found</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Get started by creating your first business contact.</p>
        </div>
      ) : (
        <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-450">
                  <th className="py-2.5 pl-2">Name</th>
                  <th className="py-2.5">Company Account</th>
                  <th className="py-2.5">Title & Dept</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Phone</th>
                  <th className="py-2.5 pr-2 text-right">Decision Maker</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                    <td className="py-3 pl-2 font-bold text-neutral-900">{c.first_name} {c.last_name || ""}</td>
                    <td className="py-3 text-neutral-600 font-bold">{c.company?.name || "Independent"}</td>
                    <td className="py-3 text-neutral-500">
                      <div>{c.job_title || "General Staff"}</div>
                      <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-tight">{c.department}</div>
                    </td>
                    <td className="py-3 text-[#0075de] font-mono">{c.email}</td>
                    <td className="py-3 text-neutral-600">{c.phone || "Not configured"}</td>
                    <td className="py-3 pr-2 text-right">
                      <span className={c.is_decision_maker ? "text-green-600 font-bold bg-green-500/5 px-2 py-0.5 rounded border border-green-200" : "text-neutral-400"}>
                        {c.is_decision_maker ? "DECISION MAKER" : "Staff"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-xl p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Create Contact Profile</h3>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">First Name</span>
                  <Input required placeholder="John" value={newContact.first_name} onChange={e => setNewContact({ ...newContact, first_name: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Last Name</span>
                  <Input placeholder="Doe" value={newContact.last_name} onChange={e => setNewContact({ ...newContact, last_name: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Associated Company</span>
                  <select
                    required
                    value={newContact.company_id}
                    onChange={e => setNewContact({ ...newContact, company_id: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    <option value="">Select account...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Job Title</span>
                  <Input placeholder="VP Operations" value={newContact.job_title} onChange={e => setNewContact({ ...newContact, job_title: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Department</span>
                  <Input placeholder="Supply Chain" value={newContact.department} onChange={e => setNewContact({ ...newContact, department: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Email Address</span>
                  <Input required type="email" placeholder="john.doe@company.com" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Phone Number</span>
                  <Input placeholder="+91..." value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1 col-span-2 flex items-center gap-2 pt-2 select-none">
                  <input type="checkbox" id="dm" checked={newContact.is_decision_maker} onChange={e => setNewContact({ ...newContact, is_decision_maker: e.target.checked })} />
                  <label htmlFor="dm" className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 cursor-pointer">Mark as Decision Maker</label>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Create Contact</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
