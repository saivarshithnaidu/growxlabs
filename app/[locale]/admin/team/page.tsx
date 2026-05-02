"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Shield, UserX, Key, Clock, Activity, Loader2 } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { toast } from "sonner";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "crm_agent"
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setTeam(data.team || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create agent");

      toast.success("Agent created successfully");
      setShowAddModal(false);
      setFormData({ name: "", email: "", phone: "", password: "", role: "crm_agent" });
      fetchTeam();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this agent?`)) return;

    try {
      const res = await fetch(`/api/admin/team?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Agent ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchTeam();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Team Management</h1>
            <p className="text-[var(--text-secondary)] text-sm">Manage CRM agents, view session logs, and monitor activity.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-white text-black hover:bg-gray-200 font-bold tracking-widest uppercase text-[10px] h-10 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Agent
          </Button>
        </div>
      </Reveal>

      {/* ACTIVITY MONITOR */}
      <Reveal delay={0.1}>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] p-8 rounded-2xl">
           <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              Live Activity Monitor
           </h2>
           <div className="space-y-4 h-40 overflow-y-auto custom-scrollbar pr-4 text-sm">
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-[var(--border-subtle)]">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-16 pt-1 shrink-0">14:02</span>
                 <span className="text-[var(--text-secondary)]"><strong className="text-white font-semibold">Sarah J.</strong> added 5 leads manually.</span>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-[var(--border-subtle)]">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-16 pt-1 shrink-0">13:45</span>
                 <span className="text-[var(--text-secondary)]"><strong className="text-white font-semibold">Michael T.</strong> updated status of "Royal Palace" to <span className="text-primary font-medium">Contacted</span>.</span>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-[var(--border-subtle)]">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-16 pt-1 shrink-0">09:12</span>
                 <span className="text-[var(--text-secondary)]"><strong className="text-white font-semibold">Sarah J.</strong> logged in.</span>
              </div>
           </div>
        </div>
      </Reveal>

      {/* TEAM LIST */}
      <Reveal delay={0.2}>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--surface-2)]">
            <h2 className="text-lg font-bold text-white tracking-tight">CRM Agents ({team.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input 
                type="text" 
                placeholder="SEARCH TEAM..." 
                className="bg-transparent border border-[var(--border-subtle)] rounded-lg pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[var(--border-hover)] w-64 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Loading team...</div>
            ) : team.map((member) => (
              <div key={member.id} className="bg-[var(--surface-2)] border border-[var(--border-subtle)] p-6 rounded-2xl relative hover:border-[var(--border-hover)] transition-all group">
                 {!member.is_active && (
                    <div className="absolute top-4 right-4 bg-red-500/10 text-red-400 text-[9px] px-2 py-1 uppercase tracking-widest rounded-md font-bold">Inactive</div>
                 )}
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 border border-[var(--border-subtle)] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-inner">
                       {member.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-lg tracking-tight mb-1">{member.name}</h3>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{member.role === 'crm_agent' ? 'CRM Agent' : member.role}</p>
                    </div>
                 </div>
                 <div className="space-y-3 text-sm mb-8">
                    <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]"><span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Email</span><span className="text-[var(--text-secondary)] font-medium text-xs">{member.email}</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]"><span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Terms</span>
                       <span className={member.accepted_terms ? "text-green-400 font-medium text-[10px] uppercase tracking-widest" : "text-amber-400 font-medium text-[10px] uppercase tracking-widest"}>
                          {member.accepted_terms ? "Accepted" : "Pending"}
                       </span>
                    </div>
                    <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Sessions</span><span className="text-[var(--text-secondary)] font-medium">{member.sessions?.length || 0}</span></div>
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={() => setSelectedMember(member)} variant="outline" size="sm" className="flex-1 bg-transparent border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white text-[10px] font-bold uppercase tracking-widest h-9">
                       <Clock className="w-3 h-3 mr-2" /> Logs
                    </Button>
                    <Button 
                      onClick={() => handleDeactivate(member.id, member.is_active)} 
                      variant="outline" 
                      size="sm" 
                      className={`px-3 bg-transparent border-[var(--border-subtle)] ${member.is_active ? 'text-[var(--text-muted)] hover:text-red-400 hover:border-red-500/30' : 'text-green-400 border-green-500/30 hover:bg-green-500/10'} transition-colors h-9`} 
                      title={member.is_active ? "Deactivate" : "Activate"}
                    >
                       {member.is_active ? <UserX className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </Button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* SESSION LOGS MODAL */}
      {selectedMember && (
         <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-md bg-[var(--surface-1)] border-l border-[var(--border-subtle)] h-full flex flex-col animate-in slide-in-from-right-full duration-300 shadow-2xl">
               <div className="p-8 border-b border-[var(--border-subtle)] flex items-start justify-between bg-[var(--surface-2)]">
                  <div>
                     <h2 className="text-xl font-bold text-white tracking-tight mb-1">{selectedMember.name}</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Session Logs</p>
                  </div>
                  <button onClick={() => setSelectedMember(null)} className="p-2 text-[var(--text-muted)] hover:text-white transition-colors bg-white/5 rounded-lg border border-transparent hover:border-white/10">✕</button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-[var(--surface-1)]">
                  {selectedMember.sessions?.length === 0 ? (
                     <div className="text-center py-12 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">No session logs found.</div>
                  ) : selectedMember.sessions?.map((session: any, idx: number) => (
                     <div key={idx} className="bg-[var(--surface-2)] border border-[var(--border-subtle)] p-5 rounded-2xl text-sm hover:border-[var(--border-hover)] transition-colors">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--border-subtle)]">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Login</span>
                           <span className="text-white font-medium">{new Date(session.login_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Logout</span>
                           <span>{session.logout_at ? <span className="text-[var(--text-secondary)] font-medium">{new Date(session.logout_at).toLocaleString()}</span> : <span className="text-green-400 text-[10px] uppercase tracking-widest font-bold">Active Now</span>}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Add CRM Agent</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Create a new team member account.</p>
            <form onSubmit={handleAddAgent} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Temporary Password</label>
                <input 
                  type="text" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" 
                />
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-[var(--border-subtle)] mt-8">
                 <Button type="button" onClick={() => setShowAddModal(false)} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white">Cancel</Button>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-white text-black hover:bg-gray-200 text-[10px] font-bold uppercase tracking-widest h-10 px-6 min-w-[120px]"
                 >
                   {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Agent"}
                 </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
