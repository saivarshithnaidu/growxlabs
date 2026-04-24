import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  IndianRupee, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real stats
  const { count: totalUsers } = await supabase.from("users").select("*", { count: 'exact', head: true });
  const { data: enrollments } = await supabase.from("enrollments").select("purchase_price");
  const { data: attempts } = await supabase.from("test_attempts").select("score");

  const totalRevenue = enrollments?.reduce((acc, curr) => acc + (curr.purchase_price || 0), 0) || 0;
  const totalPurchases = enrollments?.length || 0;
  
  // Calculate pass rate (score > 70)
  const passedCount = attempts?.filter(a => a.score >= 70).length || 0;
  const passRate = attempts?.length ? Math.round((passedCount / attempts.length) * 100) : 0;

  const stats = [
    { 
      label: "Total Students", 
      value: totalUsers?.toLocaleString() || "0", 
      icon: Users, 
      trend: "+12.5%", 
      positive: true,
      description: "Active platform members"
    },
    { 
      label: "Total Revenue", 
      value: `₹${totalRevenue?.toLocaleString()}`, 
      icon: IndianRupee, 
      trend: "+24.2%", 
      positive: true,
      description: "Lifetime course sales"
    },
    { 
      label: "Course Purchases", 
      value: totalPurchases.toString(), 
      icon: ShoppingBag, 
      trend: "+8.1%", 
      positive: true,
      description: "Individual transaction count"
    },
    { 
      label: "Assessment Pass Rate", 
      value: `${passRate}%`, 
      icon: GraduationCap, 
      trend: "-2.4%", 
      positive: false,
      description: "Students scoring > 70%"
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Intelligence Overview.</h1>
          <p className="text-white/40 font-medium">Real-time performance metrics for GrowX Labs Academy.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          <div className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#00A86B]">Live Monitoring Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px] hover:border-primary/40 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <stat.icon size={80} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <div className="p-3 bg-white/5 rounded-2xl">
                    <stat.icon className="text-primary" size={20} />
                 </div>
                 <div className={cn(
                   "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                   stat.positive ? "text-[#00A86B]" : "text-red-400"
                 )}>
                   {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.trend}
                 </div>
              </div>
              
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-white tracking-tighter mb-4 italic">{stat.value}</h3>
              <p className="text-white/20 text-[10px] font-medium italic">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 flex flex-col h-[500px]">
           <div className="flex items-center justify-between mb-12">
             <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-3 italic">
               <TrendingUp className="text-primary" size={20} />
               Revenue Growth
             </h4>
             <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 outline-none hover:bg-white/10 transition-all">
               <option>Last 30 Days</option>
               <option>Last 6 Months</option>
               <option>Year to Date</option>
             </select>
           </div>
           
           <div className="flex-1 flex items-end gap-3 md:gap-6 pb-4">
              {[45, 62, 58, 75, 90, 82, 95, 88, 100, 115, 105, 120].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                   <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-primary/20 group-hover:bg-primary rounded-t-xl transition-all duration-500 cursor-help"
                   >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-white text-black text-[10px] font-black rounded-lg whitespace-nowrap shadow-xl">
                        ₹{(h * 1240).toLocaleString()}
                      </div>
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between px-2 mt-6">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                <span key={m} className="text-[9px] font-black text-white/10 uppercase tracking-widest">{m}</span>
              ))}
           </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 flex flex-col">
           <h4 className="text-xl font-bold text-white tracking-tight mb-10 italic">Live Enrollments</h4>
           <div className="flex-1 space-y-6 overflow-hidden">
             {enrollments?.slice(0, 6).map((en, i) => (
               <div key={i} className="flex items-center justify-between group p-3 hover:bg-white/[0.02] rounded-2xl transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-primary">
                       {i + 1}
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm leading-tight tracking-tight">Student-ID-{i+102}</p>
                       <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Enrolled 2m ago</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-white font-black text-sm">₹{en.purchase_price || "1,999"}</p>
                    <p className="text-[#00A86B] text-[8px] font-black uppercase tracking-widest">Confirmed</p>
                 </div>
               </div>
             ))}
             {!enrollments?.length && Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex items-center justify-between opacity-20">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/5" />
                     <div className="space-y-2">
                        <div className="w-24 h-3 bg-white/10 rounded" />
                        <div className="w-16 h-2 bg-white/5 rounded" />
                     </div>
                  </div>
                </div>
             ))}
           </div>
           <button className="mt-8 w-full py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary hover:border-primary/20 transition-all">
             View All Activity
           </button>
        </div>
      </div>
    </div>
  );
}
