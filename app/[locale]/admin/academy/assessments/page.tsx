import { createClient } from "@/lib/supabase/server";
import { 
  Plus, 
  Search, 
  PenTool, 
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Code
} from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";

export default async function AssessmentManagement() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from("courses").select("id, title");
  const { data: questions } = await supabase
    .from("questions")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Assessment Matrix.</h1>
          <p className="text-white/40 font-medium">Engineer rigorous certification exams for your students.</p>
        </div>
        <Link href="/admin/academy/assessments/new">
          <Button className="bg-primary text-black font-black h-14 px-8 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all">
            <Plus size={20} strokeWidth={3} />
            ADD NEW QUESTION
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Total Questions", value: questions?.length || 0, icon: PenTool, color: "text-primary" },
           { label: "Code-Based Challenges", value: questions?.filter(q => q.type === 'code').length || 0, icon: Code, color: "text-blue-400" },
           { label: "Validated Banks", value: courses?.length || 0, icon: CheckCircle2, color: "text-[#00A86B]" }
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

      {/* Questions Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
               <input 
                 type="text" 
                 placeholder="Filter by question content..." 
                 className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-14 pr-6 text-xs text-white focus:border-primary/20 outline-none transition-all"
               />
            </div>
            <select className="bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 outline-none">
               <option>All Courses</option>
               {courses?.map(c => <option key={c.id}>{c.title}</option>)}
            </select>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                     <th className="px-10 py-6">Course</th>
                     <th className="px-10 py-6">Question Preview</th>
                     <th className="px-10 py-6">Difficulty</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {questions?.map((q) => (
                     <tr key={q.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                              {q.courses?.title || 'Unknown'}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="space-y-1 max-w-md">
                              <p className="text-white font-semibold text-sm tracking-tight line-clamp-1">{q.question_text}</p>
                              <div className="flex gap-2">
                                 {q.type === 'code' && <Code size={12} className="text-blue-400" />}
                                 <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{q.type}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 q.difficulty === 'hard' ? "bg-red-500" : q.difficulty === 'medium' ? "bg-orange-500" : "bg-[#00A86B]"
                              )} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{q.difficulty}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button className="p-3 text-white/20 hover:text-white transition-all">
                              <MoreVertical size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {!questions?.length && (
               <div className="py-20 text-center opacity-30">
                  <AlertCircle className="mx-auto mb-4" size={32} />
                  <p className="text-sm font-medium">The matrix is empty. Proceed to add knowledge probes.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
