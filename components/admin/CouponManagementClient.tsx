"use client";

import { useState } from "react";
import { 
  Plus, 
  Tag, 
  Trash2, 
  Calendar, 
  Percent, 
  IndianRupee,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_purchase: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export function CouponManagementClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase: "",
    expires_at: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCoupons([data, ...coupons]);
      setIsModalOpen(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: "", min_purchase: "", expires_at: "" });
      toast.success("Coupon generated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        body: JSON.stringify({ id, is_active: !currentStatus })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCoupons(coupons.map(c => c.id === id ? data : c));
      toast.success(`Coupon ${!currentStatus ? 'activated' : 'archived'}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Coupon deleted successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter italic">Discount Control.</h1>
          <p className="text-white/40 font-medium tracking-tight uppercase text-xs">Engineer growth through precision monetization incentives.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-black h-16 px-10 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-primary/20 border-none"
        >
          <Plus size={20} strokeWidth={3} />
          GENERATE COUPON
        </Button>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {coupons.map((coupon) => (
            <motion.div 
              key={coupon.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-[#080808] border border-white/5 p-10 rounded-[48px] hover:border-primary/40 transition-all duration-700 relative overflow-hidden shadow-2xl"
            >
               {/* Background Decoration */}
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-all duration-1000 group-hover:opacity-[0.07] group-hover:text-primary">
                  <Tag size={160} />
               </div>

               <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                     <div className="p-5 bg-white/[0.03] rounded-[24px] border border-white/5">
                        {coupon.discount_type === 'percentage' ? <Percent className="text-primary" size={28} /> : <IndianRupee className="text-primary" size={28} />}
                     </div>
                     <button 
                      onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                      className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${
                        coupon.is_active ? "text-primary bg-primary/10 border border-primary/20" : "text-white/20 bg-white/5 border border-white/5"
                      }`}
                     >
                        {coupon.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {coupon.is_active ? "Active" : "Archived"}
                     </button>
                  </div>

                  <div>
                     <h3 className="text-4xl font-black text-white tracking-tighter italic mb-2 uppercase group-hover:text-primary transition-colors">{coupon.code}</h3>
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase rounded-md tracking-widest">
                          {coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : ' OFF'}
                        </span>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                           Discount Incentive
                        </p>
                     </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/20">
                        <span className="flex items-center gap-3"><Calendar size={14} className="text-primary/40" /> Expires</span>
                        <span className="text-white/50">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</span>
                     </div>
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/20">
                        <span className="flex items-center gap-3"><IndianRupee size={14} className="text-primary/40" /> Min Order</span>
                        <span className="text-white/50">₹{coupon.min_purchase.toLocaleString() || 0}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                     <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="flex-1 py-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                     >
                        <Trash2 size={16} />
                        Delete Permanently
                     </button>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {coupons.length === 0 && (
           <div className="md:col-span-3 py-40 border border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center bg-white/[0.01]">
              <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-8">
                <AlertCircle size={40} className="text-white/10" />
              </div>
              <h3 className="text-2xl font-bold italic tracking-tight text-white mb-2">No Active Incentives.</h3>
              <p className="text-white/20 text-sm font-medium uppercase tracking-widest">Create your first discount code to accelerate user conversion.</p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="ghost" 
                className="mt-10 text-primary font-black uppercase text-[10px] tracking-[0.3em] hover:bg-primary/10"
              >
                Launch Generator
              </Button>
           </div>
        )}
      </div>

      {/* Generation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[48px] p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Percent size={200} />
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white tracking-tighter italic mb-8">Generate Incentive.</h2>
                
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Coupon Code</label>
                    <Input 
                      required
                      placeholder="e.g. GROWX50"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="bg-white/5 border-white/5 rounded-2xl h-16 px-6 text-white font-bold placeholder:text-white/10 focus:border-primary/50 transition-all uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Discount Type</label>
                      <select 
                        value={formData.discount_type}
                        onChange={e => setFormData({...formData, discount_type: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 px-6 text-white font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="percentage" className="bg-[#0A0A0A]">Percentage (%)</option>
                        <option value="flat" className="bg-[#0A0A0A]">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Value</label>
                      <Input 
                        required
                        type="number"
                        placeholder="50"
                        value={formData.discount_value}
                        onChange={e => setFormData({...formData, discount_value: e.target.value})}
                        className="bg-white/5 border-white/5 rounded-2xl h-16 px-6 text-white font-bold placeholder:text-white/10 focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Min Purchase (₹)</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={formData.min_purchase}
                        onChange={e => setFormData({...formData, min_purchase: e.target.value})}
                        className="bg-white/5 border-white/5 rounded-2xl h-16 px-6 text-white font-bold placeholder:text-white/10 focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Expiry Date</label>
                      <Input 
                        type="date"
                        value={formData.expires_at}
                        onChange={e => setFormData({...formData, expires_at: e.target.value})}
                        className="bg-white/5 border-white/5 rounded-2xl h-16 px-6 text-white font-bold focus:border-primary/50 transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-20 rounded-[28px] bg-primary text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-white transition-all shadow-2xl shadow-primary/20 mt-6"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Authorize & Deploy Coupon"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
