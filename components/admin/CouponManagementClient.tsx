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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Discount Control</h1>
          <p className="text-white/40 font-medium">Engineer growth through precision monetization incentives.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 h-11 font-medium rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Generate Coupon
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
              className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-all relative overflow-hidden"
            >
               {/* Background Decoration */}
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-all duration-700 group-hover:opacity-[0.05]">
                  <Tag size={120} />
               </div>

               <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        {coupon.discount_type === 'percentage' ? <Percent className="text-white/80" size={24} /> : <IndianRupee className="text-white/80" size={24} />}
                     </div>
                     <button 
                      onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                      className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                        coupon.is_active ? "text-green-500 bg-green-500/10" : "text-white/40 bg-white/5 hover:text-white"
                      }`}
                     >
                        {coupon.is_active ? <CheckCircle2 size={16} /> : <ToggleLeft size={16} />}
                        {coupon.is_active ? "Active" : "Archived"}
                     </button>
                  </div>

                  <div>
                     <h3 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">{coupon.code}</h3>
                     <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-medium rounded-md">
                          {coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : ' OFF'}
                        </span>
                        <p className="text-white/40 text-xs font-medium">
                           Discount Incentive
                        </p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                     <div className="flex items-center justify-between text-xs font-medium text-white/40">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-white/20" /> Expires</span>
                        <span className="text-white/80">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs font-medium text-white/40">
                        <span className="flex items-center gap-2"><IndianRupee size={14} className="text-white/20" /> Min Order</span>
                        <span className="text-white/80">₹{coupon.min_purchase.toLocaleString() || 0}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                     <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="flex-1 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2"
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
           <div className="md:col-span-3 py-24 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center bg-white/[0.01]">
              <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Active Incentives</h3>
              <p className="text-white/40 text-sm font-medium">Create your first discount code to accelerate user conversion.</p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                variant="outline" 
                className="mt-8 text-white font-medium hover:bg-white/5 border-white/10 h-10 px-6"
              >
                Generate Incentive
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
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Percent size={120} />
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">Generate Incentive</h2>
                
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Coupon Code</label>
                    <Input 
                      required
                      placeholder="e.g. GROWX50"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="bg-white/5 border-white/10 rounded-lg h-11 px-4 text-white font-medium placeholder:text-white/20 focus:border-white/30 transition-all uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Discount Type</label>
                      <select 
                        value={formData.discount_type}
                        onChange={e => setFormData({...formData, discount_type: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg h-11 px-4 text-white font-medium outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                      >
                        <option value="percentage" className="bg-[#111]">Percentage (%)</option>
                        <option value="flat" className="bg-[#111]">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Value</label>
                      <Input 
                        required
                        type="number"
                        placeholder="50"
                        value={formData.discount_value}
                        onChange={e => setFormData({...formData, discount_value: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-lg h-11 px-4 text-white font-medium placeholder:text-white/20 focus:border-white/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Min Purchase (₹)</label>
                      <Input 
                        type="number"
                        placeholder="0"
                        value={formData.min_purchase}
                        onChange={e => setFormData({...formData, min_purchase: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-lg h-11 px-4 text-white font-medium placeholder:text-white/20 focus:border-white/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Expiry Date</label>
                      <Input 
                        type="date"
                        value={formData.expires_at}
                        onChange={e => setFormData({...formData, expires_at: e.target.value})}
                        className="bg-white/5 border-white/10 rounded-lg h-11 px-4 text-white font-medium focus:border-white/30 transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] mt-4"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Deploy Coupon"}
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
