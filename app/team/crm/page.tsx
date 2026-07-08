"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  LogOut, Phone, MessageCircle, Mail, Plus, 
  Search, Filter, ChevronRight, Activity 
} from "lucide-react";
import Link from "next/link";

export default function TeamCRMPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/crm/leads");
      if (!res.ok) {
        if (res.status === 401) router.push("/team/login");
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/team/auth", { method: "DELETE" });
    router.push("/team/login");
  };

  const filteredLeads = leads.filter(l => filterStatus === "all" || l.status === filterStatus);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      {/* NAVBAR */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#111] sticky top-0 z-30">
        <div className="font-serif text-xl font-bold tracking-tight">GrowX<span className="text-gray-500">Labs</span></div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">Agent Dashboard</div>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition-colors" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Assigned to me", value: leads.length, color: "text-blue-400" },
            { label: "Contacted Today", value: "0", color: "text-green-400" },
            { label: "Follow-ups Due", value: "0", color: "text-red-400" },
            { label: "My Conversions", value: "0", color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111] border border-white/10 p-5 rounded-2xl">
              <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 w-64"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="won">Won</option>
            </select>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>

        {/* TABLE */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Business</th>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-gray-300">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading leads...</td></tr>
                ) : filteredLeads.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No leads found.</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{lead.business_name}</div>
                        <div className="text-xs text-gray-500">{lead.business_type} • {lead.city}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{lead.contact_name}</div>
                        <div className="text-xs text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          lead.priority === 'hot' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          lead.priority === 'warm' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {lead.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <a href={`tel:${lead.phone}`} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Phone size={16} /></a>
                          <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-green-400 transition-colors"><MessageCircle size={16} /></a>
                          <a href={`mailto:${lead.email}`} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Mail size={16} /></a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* SLIDE-IN PANEL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111] border-l border-white/10 h-full flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{selectedLead.business_name}</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"><ChevronRight size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-gray-500 mb-1">Name</div><div className="text-white">{selectedLead.contact_name}</div></div>
                  <div><div className="text-gray-500 mb-1">Phone</div><div className="text-white">{selectedLead.phone || '-'}</div></div>
                  <div><div className="text-gray-500 mb-1">Email</div><div className="text-white">{selectedLead.email || '-'}</div></div>
                  <div><div className="text-gray-500 mb-1">City</div><div className="text-white">{selectedLead.city || '-'}</div></div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lead Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white" defaultValue={selectedLead.status}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="won">Won</option>
                  </select>
                  <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white" defaultValue={selectedLead.priority || 'medium'}>
                    <option value="hot">Hot Priority</option>
                    <option value="warm">Warm Priority</option>
                    <option value="cold">Cold Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Log Activity</h3>
                <textarea 
                  placeholder="Notes from call or meeting..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/30 h-24 resize-none"
                ></textarea>
                <Button className="w-full bg-white text-black hover:bg-gray-200">Save Activity</Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar text-sm">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1"><label className="text-gray-400">Business Name*</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white" /></div>
                 <div className="space-y-1"><label className="text-gray-400">Contact Name*</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white" /></div>
                 <div className="space-y-1"><label className="text-gray-400">Phone*</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white" /></div>
                 <div className="space-y-1"><label className="text-gray-400">Email</label><input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white" /></div>
                 <div className="space-y-1"><label className="text-gray-400">City</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white" /></div>
                 <div className="space-y-1"><label className="text-gray-400">Business Type</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white">
                     <option>Restaurant</option>
                     <option>Real Estate</option>
                     <option>Hotel</option>
                     <option>Other</option>
                   </select>
                 </div>
               </div>
               <div className="space-y-1 mt-4"><label className="text-gray-400">Notes</label><textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-20 resize-none"></textarea></div>
            </div>
            <div className="p-6 border-t border-white/10 bg-[#0A0A0A] rounded-b-2xl flex justify-end gap-3">
               <Button onClick={() => setShowAddModal(false)} variant="outline" className="bg-transparent border-white/10 text-white">Cancel</Button>
               <Button className="bg-white text-black hover:bg-gray-200">Save Lead</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
