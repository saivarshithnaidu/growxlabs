import { createClient } from "@/lib/supabase/server";
import { 
  Award, 
  Search, 
  Download, 
  User, 
  CheckCircle2, 
  FileCheck,
  RefreshCcw,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function CertificateManagement() {
  const supabase = await createClient();
  const { data: certificates } = await supabase
    .from("certificates")
    .select("*, courses(title), clients(name, email)")
    .order("issued_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Registry Admin.</h1>
          <p className="text-white/40 font-medium tracking-tight">Audit and verify globally recognized student credentials.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-14 px-8 border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">
              <RefreshCcw size={16} className="mr-2" /> REGENERATE BATCH
           </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Issued", value: certificates?.length || 0, icon: Award, color: "text-primary" },
           { label: "Active Verifications", value: certificates?.length || 0, icon: ShieldAlert, color: "text-blue-400" },
           { label: "Revoked Logs", value: "0", icon: CheckCircle2, color: "text-[#00A86B]" },
           { label: "Pending Print", value: "0", icon: FileCheck, color: "text-white/20" }
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px]">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("p-3 bg-white/5 rounded-2xl", stat.color)}>
                    <stat.icon size={20} />
                 </div>
              </div>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</h3>
           </div>
         ))}
      </div>

      {/* Certificates Table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
               <input 
                 type="text" 
                 placeholder="Search student name or certificate ID..." 
                 className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-14 pr-6 text-xs text-white focus:border-primary/20 outline-none transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                     <th className="px-10 py-6">Certificate ID</th>
                     <th className="px-10 py-6">Student</th>
                     <th className="px-10 py-6">Mastery Track</th>
                     <th className="px-10 py-6">Issued Date</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {certificates?.map((cert) => (
                     <tr key={cert.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
                              {cert.id}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-black text-[10px] text-primary">
                                 {cert.clients?.name?.charAt(0) || 'S'}
                              </div>
                              <div>
                                 <p className="text-white font-bold text-sm tracking-tight">{cert.clients?.name || 'Unknown Student'}</p>
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{cert.clients?.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20">
                              {cert.courses?.title || 'Unknown Course'}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                              {new Date(cert.issued_at).toLocaleDateString()}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <button className="p-3 text-white/20 hover:text-primary transition-all">
                              <Download size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {!certificates?.length && (
               <div className="py-24 text-center opacity-30 flex flex-col items-center">
                  < Award className="mb-4" size={48} />
                  <p className="text-sm font-medium tracking-tight">No credentials found in the registry.</p>
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
