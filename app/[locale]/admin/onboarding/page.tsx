"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Target, Calendar, Phone, Mail, Building2, Palette, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OnboardingAdmin() {
   const [submissions, setSubmissions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [selected, setSelected] = useState<any>(null);

   useEffect(() => {
      fetchSubmissions();
   }, []);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const res = await fetch("/api/onboarding/list");
         const data = await res.json();
         setSubmissions(data || []);
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-10">
         <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Onboarding Submissions</h1>
            <p className="text-white/40 font-medium">Review brand DNA and project technical requirements.</p>
         </div>

         <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               {loading ? (
                  <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-xl">
                     <Loader2 className="animate-spin text-white/20" />
                  </div>
               ) : submissions.length > 0 ? (
                  submissions.map((sub) => (
                     <motion.div
                        key={sub.id}
                        onClick={() => setSelected(sub)}
                        className={cn(
                           "p-5 rounded-xl border transition-all cursor-pointer group",
                           selected?.id === sub.id
                              ? "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                        )}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-lg bg-[#00A86B]/10 flex items-center justify-center text-[#00A86B] border border-[#00A86B]/20">
                                 <Building2 size={20} />
                              </div>
                              <div>
                                 <h3 className="text-sm font-bold text-white">{sub.business_name}</h3>
                                 <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{sub.industry}</p>
                              </div>
                           </div>
                           <ChevronRight className={cn("text-white/20 group-hover:text-white/40 transition-all", selected?.id === sub.id && "rotate-90 text-[#00A86B]")} size={16} />
                        </div>
                     </motion.div>
                  ))
               ) : (
                  <div className="h-64 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl">
                     <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No submissions yet</p>
                  </div>
               )}
            </div>

            <div>
               <AnimatePresence mode="wait">
                  {selected ? (
                     <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                     >
                        <Card className="p-8 border-white/5 bg-white/[0.03] space-y-10 rounded-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8">
                              <div className="flex gap-2">
                                 <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: selected.primary_color }} title="Primary Color" />
                                 <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: selected.secondary_color }} title="Secondary Color" />
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#00A86B]/10 border border-[#00A86B]/20">
                                 <div className="h-1.5 w-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B]">Project DNA Verified</span>
                              </div>

                              <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Contact Intel</p>
                                    <div className="space-y-3">
                                       <div className="flex items-center space-x-3 text-white/60">
                                          <Mail size={14} />
                                          <span className="text-sm">{selected.email}</span>
                                       </div>
                                       <div className="flex items-center space-x-3 text-white/60">
                                          <Phone size={14} />
                                          <span className="text-sm">{selected.phone}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Mission Details</p>
                                    <div className="space-y-3">
                                       <div className="flex items-center space-x-3 text-white/60">
                                          <Calendar size={14} />
                                          <span className="text-sm">Launch: {new Date(selected.launch_date).toLocaleDateString()}</span>
                                       </div>
                                       <div className="flex items-center space-x-3 text-[#00A86B] font-bold">
                                          <Target size={14} />
                                          <span className="text-xs uppercase tracking-widest">{selected.primary_goal}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Architecture Required</p>
                              <div className="flex flex-wrap gap-2">
                                 {selected.features?.map((f: string) => (
                                    <span key={f} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                                       {f}
                                    </span>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Target Audience Description</p>
                              <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                                 "{selected.target_audience}"
                              </p>
                           </div>

                           {selected.notes && (
                              <div className="space-y-4">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Engineering Notes</p>
                                 <p className="text-sm text-white/60 leading-relaxed">
                                    {selected.notes}
                                 </p>
                              </div>
                           )}
                        </Card>
                     </motion.div>
                  ) : (
                     <div className="h-full flex items-center justify-center p-12 border border-white/5 border-dashed rounded-3xl opacity-20 grayscale">
                        <div className="text-center space-y-4">
                           <Target size={48} className="mx-auto" />
                           <p className="text-sm font-bold uppercase tracking-[0.3em]">Selection Required</p>
                        </div>
                     </div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
   );
}
