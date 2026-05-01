import { supabaseAdmin } from "@/lib/supabase/admin";
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  Receipt
} from "lucide-react";
import { Link } from "@/navigation";

export default async function OrderManagement() {
  const supabase = supabaseAdmin;
  const { data: orders } = await supabase
    .from("orders")
    .select("*, coupons(code)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Transaction Ledger.</h1>
          <p className="text-white/40 font-medium tracking-tight">Audit and reconcile global monetization activity.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-[#0A0A0A] border border-white/5 h-14 px-8 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
              <Receipt size={18} /> EXPORT CSV
           </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-4">
         {[
           { label: "Total Volume", value: orders?.length || 0 },
           { label: "Gross Revenue", value: `₹${orders?.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.final_amount, 0).toLocaleString()}` },
           { label: "Failed Initiations", value: orders?.filter(o => o.status === 'failed').length || 0 }
         ].map((chip, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 px-8 py-4 rounded-full flex items-center gap-4">
              <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">{chip.label}</span>
              <span className="text-white font-black italic tracking-tighter">{chip.value}</span>
           </div>
         ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
               <input 
                 type="text" 
                 placeholder="Search by Razorpay Order ID or Product..." 
                 className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-14 pr-6 text-xs text-white focus:border-primary/20 outline-none transition-all"
               />
            </div>
            <button className="p-4 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
               <Filter size={18} />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                     <th className="px-10 py-6">Order Identity</th>
                     <th className="px-10 py-6">Status</th>
                     <th className="px-10 py-6">Amount</th>
                     <th className="px-10 py-6">Incentive</th>
                     <th className="px-10 py-6 text-right">Activity</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {orders?.map((order) => (
                     <tr key={order.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-10 py-6">
                           <div>
                              <p className="text-white font-bold text-sm tracking-tight uppercase line-clamp-1">{order.razorpay_order_id}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{order.product_type}: {order.product_id}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                              {order.status === 'paid' && <CheckCircle2 className="text-[#00A86B]" size={14} />}
                              {order.status === 'pending' && <Clock className="text-orange-400" size={14} />}
                              {order.status === 'failed' && <XCircle className="text-red-500" size={14} />}
                              <span className={cn(
                                 "text-[10px] font-black uppercase tracking-widest",
                                 order.status === 'paid' ? "text-[#00A86B]" : order.status === 'pending' ? "text-orange-400" : "text-red-500"
                              )}>
                                 {order.status}
                              </span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-white font-black italic">
                           ₹{order.final_amount?.toLocaleString() || '0'}
                        </td>
                        <td className="px-10 py-6">
                           <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
                              order.coupons?.code ? "text-primary border-primary/20 bg-primary/5" : "text-white/10 border-white/5"
                           )}>
                              {order.coupons?.code || 'None'}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                              {new Date(order.created_at).toLocaleDateString()}
                           </p>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {!orders?.length && (
               <div className="py-24 text-center opacity-30 flex flex-col items-center">
                  <ShoppingBag className="mb-4" size={48} />
                  <p className="text-sm font-medium tracking-tight">The ledger is currently empty.</p>
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
