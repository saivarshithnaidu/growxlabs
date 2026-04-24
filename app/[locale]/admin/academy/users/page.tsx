import { createClient } from "@/lib/supabase/server";
import { 
  GraduationCap, 
  Search, 
  BarChart3, 
  History, 
  UserCheck, 
  MoreVertical,
  Mail,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function StudentManagement() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("clients") // Students are in 'clients' table
    .select("*, enrollments(count), test_attempts(score)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Student Registry.</h1>
          <p className="text-white/40 font-medium tracking-tight">Monitor global talent and track mastery progression.</p>
        </div>
        <button className="bg-white text-black font-black h-14 px-8 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all">
          <Mail size={18} />
          BROADCAST ANNOUNCEMENT
        </button>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Enrolled Students", value: students?.length || 0, icon: GraduationCap, color: "text-primary" },
           { label: "Active Mastery", value: students?.filter(s => (s as any).enrollments?.[0]?.count > 0).length || 0, icon: UserCheck, color: "text-[#00A86B]" },
           { label: "Exam Velocity", value: "High", icon: Zap, color: "text-orange-400" }
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] flex items-center justify-between">
              <div>
                 <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                 <h3 className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</h3>
              </div>
              <div className={cn("p-4 bg-white/5 rounded-2xl", stat.color)}>
                 <stat.icon size={24} />
              </div>
           </div>
         ))}
      </div>

      {/* Student Table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
               <input 
                 type="text" 
                 placeholder="Search by student identity or email..." 
                 className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-14 pr-6 text-xs text-white focus:border-primary/20 outline-none transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                     <th className="px-10 py-6">Student Identity</th>
                     <th className="px-10 py-6">Enrollments</th>
                     <th className="px-10 py-6">Avg Score</th>
                     <th className="px-10 py-6">Last Active</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {students?.map((student) => {
                     const avgScore = (student as any).test_attempts?.length 
                        ? Math.round((student as any).test_attempts.reduce((acc: any, curr: any) => acc + curr.score, 0) / (student as any).test_attempts.length) 
                        : '--';
                     
                     return (
                        <tr key={student.id} className="group hover:bg-white/[0.02] transition-all">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-primary group-hover:scale-110 transition-all">
                                    {student.name?.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-white font-bold text-sm tracking-tight">{student.name}</p>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{student.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                 <History size={14} className="text-primary/40" />
                                 <span className="text-xs font-bold text-white/60">{(student as any).enrollments?.[0]?.count || 0} Tracks</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                                 avgScore === '--' ? "text-white/10 border-white/5" : "text-primary border-primary/20 bg-primary/5"
                              )}>
                                 {avgScore}{avgScore !== '--' ? '%' : ''}
                              </span>
                           </td>
                           <td className="px-10 py-6">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                 {new Date(student.created_at).toLocaleDateString()}
                              </p>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="p-3 text-white/20 hover:text-white transition-all">
                                 <MoreVertical size={18} />
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
