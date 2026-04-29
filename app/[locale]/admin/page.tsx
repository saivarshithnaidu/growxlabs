import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  IndianRupee, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  GraduationCap,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/Reveal";

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
      description: "Active platform members",
      accent: "blue"
    },
    { 
      label: "Total Revenue", 
      value: `₹${totalRevenue?.toLocaleString()}`, 
      icon: IndianRupee, 
      trend: "+24.2%", 
      positive: true,
      description: "Lifetime course sales",
      accent: "green"
    },
    { 
      label: "Course Purchases", 
      value: totalPurchases.toString(), 
      icon: ShoppingBag, 
      trend: "+8.1%", 
      positive: true,
      description: "Individual transaction count",
      accent: "amber"
    },
    { 
      label: "Pass Rate", 
      value: `${passRate}%`, 
      icon: GraduationCap, 
      trend: "-2.4%", 
      positive: false,
      description: "Students scoring > 70%",
      accent: "purple"
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Overview</h1>
            <p className="text-[var(--text-secondary)] text-sm">Real-time performance metrics for GrowX Labs Academy.</p>
          </div>
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-5 py-2.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">System Monitoring Live</span>
          </div>
        </div>
      </Reveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const accColor = {
            blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            green: "text-primary bg-primary/10 border-primary/20",
            amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
            purple: "text-purple-400 bg-purple-400/10 border-purple-400/20"
          }[stat.accent]!;

          return (
            <Reveal key={i} delay={i * 0.05}>
              <div className="group relative bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 rounded-2xl hover:border-[var(--border-hover)] transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                   <div className={cn("p-2.5 rounded-xl border", accColor)}>
                      <stat.icon size={18} />
                   </div>
                   <div className={cn(
                     "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider",
                     stat.positive ? "text-primary" : "text-red-400"
                   )}>
                     {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                     {stat.trend}
                   </div>
                </div>
                
                <div>
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.1em] mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{stat.value}</h3>
                  <p className="text-[var(--text-tertiary)] text-[10px]">{stat.description}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Reveal className="lg:col-span-2">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl p-8 h-full">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="text-primary" size={18} />
                 </div>
                 <h4 className="text-lg font-semibold text-white tracking-tight">Revenue Trajectory</h4>
               </div>
               <select className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] outline-none hover:border-[var(--border-hover)] transition-all cursor-pointer">
                 <option>Last 30 Days</option>
                 <option>Last 6 Months</option>
                 <option>Annual View</option>
               </select>
             </div>
             
             <div className="h-64 flex items-end gap-2 md:gap-4 pb-2 border-b border-[var(--border-subtle)]">
                {[45, 62, 58, 75, 90, 82, 95, 88, 100, 115, 105, 120].map((h, i) => (
                  <div key={i} className="flex-1 group relative">
                     <div 
                      style={{ height: `${h}%` }} 
                      className="w-full bg-primary/10 group-hover:bg-primary/30 rounded-t-lg transition-all duration-300 cursor-pointer border-x border-t border-transparent group-hover:border-primary/20"
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 bg-white text-black text-[9px] font-bold rounded-md whitespace-nowrap shadow-xl z-20">
                          ₹{(h * 1240).toLocaleString()}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between px-1 mt-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <span key={m} className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{m}</span>
                ))}
             </div>
          </div>
        </Reveal>

        {/* Recent Enrollments */}
        <Reveal>
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl p-8 h-full flex flex-col">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-400/10 rounded-lg">
                   <Activity className="text-blue-400" size={18} />
                </div>
                <h4 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h4>
             </div>
             <div className="flex-1 space-y-5 overflow-hidden">
               {((enrollments?.length ? enrollments : Array.from({length: 6}).map((_, i) => ({ purchase_price: 1999 + (i * 500) }))) as any[]).slice(0, 6).map((en, i) => (
                 <div key={i} className="flex items-center justify-between group p-2 hover:bg-white/[0.02] rounded-xl transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-center font-bold text-[10px] text-[var(--text-secondary)]">
                         {i + 1}
                      </div>
                      <div>
                         <p className="text-white font-semibold text-xs leading-none mb-1">Student #{i+1024}</p>
                         <p className="text-[var(--text-muted)] text-[9px] font-medium uppercase tracking-wider">Confirmed enrollment</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-white font-bold text-xs">₹{en?.purchase_price || "1,999"}</p>
                      <p className="text-[var(--text-muted)] text-[8px] font-medium uppercase tracking-widest">Success</p>
                   </div>
                 </div>
               ))}
             </div>
             <button className="mt-8 w-full py-3 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)] transition-all">
               View Activity Log
             </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
