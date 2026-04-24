import { createClient } from "@/lib/supabase/server";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  IndianRupee, 
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function RevenueTracking() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid");

  const totalRevenue = orders?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0;
  const courseRevenue = orders?.filter(o => o.product_type === 'course').reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0;
  const subRevenue = totalRevenue - courseRevenue;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Revenue Intelligence.</h1>
          <p className="text-white/40 font-medium tracking-tight">Granular analysis of platform-wide financial growth.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#00A86B]/5 border border-[#00A86B]/10 rounded-2xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A86B]">Real-time Calculation</span>
        </div>
      </div>

      {/* High Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[48px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-all duration-700">
               <TrendingUp size={100} className="text-primary" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="p-4 bg-white/5 rounded-2xl w-fit">
                  <IndianRupee className="text-primary" size={24} />
               </div>
               <div>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Gross Yield</p>
                  <h3 className="text-5xl font-black text-white tracking-tighter italic">₹{totalRevenue.toLocaleString()}</h3>
               </div>
            </div>
         </div>

         <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[48px] flex flex-col justify-between">
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Academy Sales</p>
                      <h4 className="text-2xl font-black text-white italic">₹{courseRevenue.toLocaleString()}</h4>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl">
                      <Layers className="text-blue-400" size={18} />
                   </div>
                </div>
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Subscription ARR</p>
                      <h4 className="text-2xl font-black text-white italic">₹{subRevenue.toLocaleString()}</h4>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl">
                      <ArrowUpRight className="text-[#00A86B]" size={18} />
                   </div>
                </div>
            </div>
            <div className="h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                <div 
                   className="h-full bg-primary" 
                   style={{ width: `${(courseRevenue/totalRevenue) * 100 || 0}%` }} 
                />
            </div>
         </div>

         <div className="bg-primary border border-primary p-10 rounded-[48px] flex flex-col justify-center gap-6 group hover:translate-y-[-10px] transition-all duration-500 cursor-pointer">
            <h3 className="text-2xl font-black text-black tracking-tighter italic leading-none transition-transform group-hover:scale-105">OPTIMIZE <br/> MONETIZATION</h3>
            <p className="text-black/60 text-xs font-bold leading-relaxed">Analyze drop-off rates and adjust discount corridors for maximum terminal yield.</p>
            <ArrowRight className="text-black ml-auto" size={24} />
         </div>
      </div>

      {/* Analytics Projection Placeholder */}
      <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[48px] h-[400px] flex flex-col items-center justify-center text-center">
          <BarChart3 className="text-white/5 mb-6" size={64} />
          <h4 className="text-white font-bold tracking-tight">Revenue Projection Engine.</h4>
          <p className="text-white/20 text-xs mt-2">Data modeling in progress. Trends will be visualized once order volume reaches threshold.</p>
      </div>
    </div>
  );
}
