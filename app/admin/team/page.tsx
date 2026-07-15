"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Shield, UserX, Key, Clock, Activity, Loader2, ShieldAlert, Users } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function AdminTeamPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "ADMIN" || role === "CO_ADMIN";

  const [team, setTeam] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
      const res = await fetch(`/api/admin/team?t=${Date.now()}`);
      const data = await res.json();
      setTeam(data.team || []);
      setLogs(data.logs || []);
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

  const totalAgents = team.length;
  const activeSessions = team.reduce(
    (acc, m) => acc + (m.sessions?.filter((s: any) => !s.logout_at).length || 0),
    0
  );
  const pendingTerms = team.filter((m) => !m.accepted_terms).length;

  return (
    <div className="space-y-6 sm:space-y-10 lg:space-y-12">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Team Management</h1>
            <p className="text-neutral-500 text-sm">Manage CRM agents, view session logs, and monitor activity.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#0075de] hover:bg-[#005bab] text-white font-bold tracking-wider uppercase text-[10px] h-10 px-5 rounded-md shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Agent
          </Button>
        </div>
      </Reveal>

      {/* ADMINISTRATIVE STATS OVERVIEW */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* STAT 1: TOTAL AGENTS */}
          <div className="bg-white border border-[#e6e6e6] p-6 rounded-md hover:shadow-sm transition-all duration-200 relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Agents</span>
              <div className="p-2 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md text-neutral-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : totalAgents}
              </span>
              <span className="text-[10px] font-bold text-[#0075de] uppercase tracking-widest">+100% active</span>
            </div>
          </div>

          {/* STAT 2: ACTIVE SESSIONS */}
          <div className="bg-white border border-[#e6e6e6] p-6 rounded-md hover:shadow-sm transition-all duration-200 relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Sessions</span>
              <div className="p-2 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md text-neutral-500">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : activeSessions}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Live Sync
              </span>
            </div>
          </div>

          {/* STAT 3: PENDING AGREEMENTS */}
          <div className="bg-white border border-[#e6e6e6] p-6 rounded-md hover:shadow-sm transition-all duration-200 relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pending Terms</span>
              <div className="p-2 bg-[#f6f5f4] border border-[#e6e6e6] rounded-md text-neutral-500">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : pendingTerms}
              </span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Awaiting signature</span>
            </div>
          </div>

          {/* STAT 4: SECURITY SHIELD */}
          <div className="bg-white border border-[#e6e6e6] p-6 rounded-md hover:shadow-sm transition-all duration-200 relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Security Shield</span>
              <div className="p-2 bg-white border border-[#e6e6e6] rounded-md text-emerald-500">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-neutral-800 tracking-tight leading-none">SECURE</span>
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">TLS 1.3 Certified</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ACTIVITY MONITOR */}
      <Reveal delay={0.1}>
        <div className="bg-[#f6f5f4] border border-[#e6e6e6] p-6 sm:p-8 rounded-md relative overflow-hidden">
           <div className="flex justify-between items-center mb-6 border-b border-[#e6e6e6] pb-4">
             <h2 className="text-xs font-bold text-neutral-800 flex items-center gap-3 tracking-wider uppercase">
                <Activity className="w-4 h-4 text-[#0075de] animate-pulse" />
                Live Terminal Activity
             </h2>
             <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
               <span className="w-1.5 h-1.5 rounded-full bg-[#0075de]" />
               <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Console Active</span>
             </div>
           </div>
           
            <div className="space-y-3 h-40 overflow-y-auto custom-scrollbar pr-2 font-mono text-[12px] leading-relaxed">
               {logs.length === 0 ? (
                  <div className="text-neutral-400 text-center py-10 uppercase tracking-widest text-[10px] font-bold">No terminal logs recorded yet</div>
               ) : (
                 logs.map((log: any) => {
                   const timeStr = log.created_at 
                     ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) 
                     : "--:--:--";
                   
                    let badgeBg = "bg-[#0075de]/10 text-[#0075de] border border-[#0075de]/20";
                    if (log.activity_type === "SYNC") {
                      badgeBg = "bg-emerald-50 text-emerald-600 border border-emerald-200";
                    } else if (log.activity_type === "AUTH") {
                      badgeBg = "bg-purple-50 text-purple-600 border border-purple-200";
                    } else if (log.activity_type === "ALERT") {
                      badgeBg = "bg-red-500/10 text-red-500 border border-red-500/20";
                    }
                   
                   return (
                     <div key={log.id} className="flex items-start gap-4 p-2.5 rounded hover:bg-white/40 transition-colors border border-transparent hover:border-[#e6e6e6]/45">
                        <span className="text-[10px] text-neutral-400 w-12 shrink-0">{timeStr}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${badgeBg}`}>
                          {log.activity_type || "INFO"}
                        </span>
                        <span className="text-neutral-700">
                          {log.notes}
                        </span>
                     </div>
                   );
                 })
               )}
            </div>
        </div>
      </Reveal>

      {/* TEAM LIST */}
      <Reveal delay={0.2}>
        <div className="bg-white border border-[#e6e6e6] rounded-md overflow-hidden">
          <div className="p-6 border-b border-[#e6e6e6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f6f5f4]/40">
            <h2 className="text-xs font-bold text-neutral-800 tracking-wider uppercase">CRM Agents ({team.length})</h2>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="SEARCH AGENTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#f6f5f4] border border-[#e6e6e6] rounded-md pl-10 pr-4 py-2 text-[11px] font-bold tracking-wider text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0075de] focus:bg-white w-full sm:w-72 transition-all duration-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-6 sm:p-8 bg-white">
            {loading ? (
              <div className="col-span-full text-center py-12 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Loading team...</div>
            ) : team.filter(m => 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                m.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
              <div className="col-span-full text-center py-12 text-[10px] font-bold uppercase tracking-widest text-neutral-400">No agents found matching "{searchQuery}"</div>
            ) : team.filter(m => 
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                m.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((member) => (
              <div key={member.id} className="bg-[#f6f5f4]/30 border border-[#e6e6e6] p-6 rounded-md relative hover:border-[#0075de]/30 hover:bg-white transition-all duration-200 group flex flex-col justify-between shadow-sm">
                 {!member.is_active && (
                    <div className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-600 text-[9px] px-2.5 py-0.5 uppercase tracking-widest rounded-full font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Inactive
                    </div>
                 )}
                 <div>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0075de]/10 border border-[#0075de]/20 rounded-md flex items-center justify-center font-bold text-xl text-[#0075de] shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                          {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                          <h3 className="font-bold text-neutral-800 text-base tracking-tight mb-1 truncate">{member.name}</h3>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{member.role === 'crm_agent' ? 'CRM Agent' : member.role}</p>
                      </div>
                   </div>
                   
                   <div className="space-y-3.5 text-sm mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 pb-3 border-b border-[#e6e6e6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</span>
                        <span className="text-neutral-600 font-medium text-xs truncate max-w-full">{member.email}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-[#e6e6e6]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Terms</span>
                        <span className={member.accepted_terms 
                          ? "bg-green-50 border border-green-200 text-green-600 text-[9px] px-2.5 py-0.5 uppercase tracking-widest rounded-full font-bold flex items-center gap-1.5" 
                          : "bg-amber-50 border border-amber-200 text-amber-600 text-[9px] px-2.5 py-0.5 uppercase tracking-widest rounded-full font-bold flex items-center gap-1.5"}>
                            <span className={member.accepted_terms ? "w-1.5 h-1.5 rounded-full bg-green-500" : "w-1.5 h-1.5 rounded-full bg-amber-500"} />
                            {member.accepted_terms ? "Accepted" : "Pending"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sessions</span>
                        <span className="text-neutral-800 font-mono text-xs">{member.sessions?.length || 0}</span>
                      </div>
                   </div>
                 </div>

                 <div className="flex gap-2.5 mt-4">
                    <Button onClick={() => setSelectedMember(member)} variant="outline" size="sm" className="flex-1 bg-white border-[#e6e6e6] hover:bg-neutral-50 text-neutral-600 hover:text-neutral-800 text-[10px] font-bold uppercase tracking-widest h-10 rounded-md transition-all shadow-sm">
                       <Clock className="w-3.5 h-3.5 mr-2" /> Logs
                    </Button>
                    <Button 
                      onClick={() => handleDeactivate(member.id, member.is_active)} 
                      variant="outline" 
                      size="sm" 
                      className={`px-3 bg-white border-[#e6e6e6] hover:bg-neutral-50 ${member.is_active ? 'text-neutral-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50' : 'text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'} transition-all h-10 rounded-md shadow-sm`} 
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
         <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border-l border-[#e6e6e6] h-full flex flex-col animate-in slide-in-from-right-full duration-300 shadow-2xl">
               <div className="p-8 border-b border-[#e6e6e6] flex items-start justify-between bg-[#f6f5f4]/50">
                  <div>
                     <h2 className="text-xl font-bold text-neutral-800 tracking-tight mb-1">{selectedMember.name}</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Session Logs</p>
                  </div>
                  <button onClick={() => setSelectedMember(null)} className="p-2 text-neutral-400 hover:text-neutral-800 bg-[#f6f5f4] hover:bg-neutral-200/50 border border-[#e6e6e6] rounded-md transition-colors">✕</button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-white">
                  {selectedMember.sessions?.length === 0 ? (
                     <div className="text-center py-12 text-[10px] font-bold uppercase tracking-widest text-neutral-400">No session logs found.</div>
                  ) : selectedMember.sessions?.map((session: any, idx: number) => (
                     <div key={idx} className="bg-[#f6f5f4]/30 border border-[#e6e6e6] p-5 rounded-md text-sm hover:border-[#0075de]/30 transition-colors">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#e6e6e6]">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Login</span>
                           <span className="text-neutral-800 font-medium">{new Date(session.login_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Logout</span>
                           <span>{session.logout_at ? <span className="text-neutral-600 font-medium">{new Date(session.logout_at).toLocaleString()}</span> : <span className="text-emerald-600 text-[10px] uppercase tracking-widest font-bold">Active Now</span>}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e6e6e6] rounded-md w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-neutral-800 tracking-tight mb-2">Add CRM Agent</h2>
            <p className="text-neutral-400 text-sm mb-8">Create a new team member account.</p>
            <form onSubmit={handleAddAgent} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-4 py-3 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-4 py-3 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-4 py-3 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Temporary Password</label>
                <input 
                  type="text" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#f6f5f4] border border-[#e6e6e6] rounded-md px-4 py-3 text-neutral-800 focus:outline-none focus:border-[#0075de] focus:bg-white transition-all text-sm" 
                />
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-[#e6e6e6] mt-8">
                 <Button type="button" onClick={() => setShowAddModal(false)} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-700">Cancel</Button>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-[#0075de] hover:bg-[#005bab] text-white text-[10px] font-bold uppercase tracking-widest h-10 px-6 min-w-[120px] rounded-md shadow-sm"
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
