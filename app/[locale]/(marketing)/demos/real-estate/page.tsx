"use client";

import { motion } from "framer-motion";
import { Building2, Home, MapPin, TrendingUp, ArrowUpRight, ShieldCheck, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const SERVICES = [
  { title: "Asset Intelligence", desc: "Engineering high-liquidity real estate portfolios.", icon: Building2 },
  { title: "Strategic Growth", desc: "Properties with highest appreciation vectors in the city.", icon: TrendingUp },
  { title: "Accountable Delivery", desc: "RERA-first approach with full institutional verification.", icon: ShieldCheck }
];

const LISTINGS = [
  { name: "Urban Sky Villa", price: "₹2.4 Cr", type: "LUXURY ASSET", area: "3,200 SQFT", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Neon Heights", price: "₹1.1 Cr", type: "PRIME UNIT", area: "1,850 SQFT", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "The Emerald", price: "₹4.8 Cr", type: "ESTATE CLASS", area: "5,500 SQFT", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export default function RealEstateDemo() {
  return (
    <div className="bg-[#0B0F1A] text-[#DFE5F3] min-h-screen selection:bg-[#6C63FF]/30">
      <DemoNavbar brand="Nexus Prime Realty" />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* 2. Hero Section - REVERTED TO FULL IMAGE PREMIUM LOOK */}
      <section className="relative h-[100vh] flex items-center justify-center pt-24 pb-24 px-6 overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             alt="Real Estate Hero" 
             className="w-full h-full object-cover brightness-[0.2]" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A]/80 via-transparent to-[#0B0F1A]" />
           <div className="absolute inset-0 bg-[#6C63FF]/5 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-3 px-6 py-3 bg-[#111827]/40 backdrop-blur-3xl rounded-2xl border border-white/10 mx-auto">
              <Building2 size={18} className="text-[#6C63FF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFE5F3]/40">Strategic Asset Acquisition Group</span>
           </motion.div>
           <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.75] italic">
              Wealth <br /> <span className="text-[#6C63FF]">Architected.</span>
           </motion.h1>
           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">
              Engineering generational wealth through high-performance real estate infrastructure and elite asset class logic.
           </motion.p>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-center gap-10 pt-8">
              <Button className="h-16 px-16 rounded-2xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Secure Final Asset</Button>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]/20 italic">
                 Institutional Verification Active
                 <div className="h-[1px] w-8 bg-white/10" />
              </div>
           </motion.div>
        </div>
      </section>

      {/* 3. Services / Features */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
               <div key={i} className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/[0.08] space-y-8 hover:bg-white/[0.02] transition-all group">
                  <div className="h-16 w-16 bg-[#6C63FF]/10 rounded-3xl flex items-center justify-center text-[#6C63FF] group-hover:scale-110 transition-transform shadow-lg shadow-[#6C63FF]/5">
                     <s.icon size={32} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black tracking-tight">{s.title}</h3>
                     <p className="text-[#9CA3AF] font-medium leading-relaxed">{s.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* 4. Cards Section (Grid) */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="space-y-6">
                  <span className="text-[#6C63FF] font-black uppercase tracking-widest text-xs italic underline underline-offset-8">Listing Repositories</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none">High-Yield Assets.</h2>
               </div>
               <Button variant="outline" className="border-white/[0.08] font-black uppercase text-[10px] tracking-widest h-14 px-12 rounded-full">Explore Database</Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
               {LISTINGS.map((l, i) => (
                  <div key={i} className="group cursor-pointer space-y-8">
                     <div className="relative aspect-[1/1.25] rounded-[3.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
                        <img src={l.img} alt={l.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75" />
                        <div className="absolute top-8 left-8 px-5 py-2.5 bg-black/60 backdrop-blur-xl border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest">{l.type}</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />
                     </div>
                     <div className="space-y-6 px-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-3xl font-black italic tracking-tighter group-hover:text-[#6C63FF] transition-colors leading-none">{l.name}</h3>
                              <p className="text-[#9CA3AF] text-[10px] uppercase font-black tracking-widest mt-3 italic underline underline-offset-4 decoration-[#6C63FF]/30">Verified Listing</p>
                           </div>
                           <div className="h-12 w-12 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center text-[#9CA3AF] group-hover:bg-[#6C63FF] group-hover:text-white transition-all shadow-xl shadow-[#6C63FF]/10"><ArrowUpRight size={24} /></div>
                        </div>
                        <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] border-t border-white/5 pt-8">
                           <span className="text-[#6C63FF]">{l.price}</span>
                           <span className="h-1 w-1 bg-white/10 rounded-full" />
                           <span className="text-[#9CA3AF]/40 italic">{l.area}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Testimonials / Trust */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto">
            <div className="bg-[#111827] rounded-[4rem] p-16 md:p-24 border border-white/[0.08] text-center space-y-12 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6C63FF]/5 blur-[120px] -z-0" />
               <div className="flex items-center justify-center gap-2">
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={18} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={18} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={18} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={18} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={18} />
               </div>
               <blockquote className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] italic max-w-5xl mx-auto">
                  "Nexus Prime isn't just a real estate group. They are elite wealth engineers. Every deal they present is an asset ready for the future."
               </blockquote>
               <div className="space-y-4">
                  <p className="text-lg font-black text-[#6C63FF] tracking-tighter italic">Vikrant Singh</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-bold">Strategic Portfolio Partner</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 px-6 mt-20 mb-20">
         <div className="max-w-7xl mx-auto text-center space-y-12">
            <h2 className="text-6xl md:text-[9.5rem] font-black tracking-tighter italic leading-[0.8]">Wealth <br /> <span className="text-[#6C63FF]">Unlocked.</span></h2>
            <p className="text-2xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">Early-stage vault access is strictly invitation only. Dispatch your intent to acquire prime infrastructure.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
               <Button className="h-16 px-16 rounded-2xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Acquire Asset</Button>
               <div className="flex items-center gap-4 text-[#9CA3AF]/40">
                  <div className="h-[1px] w-12 bg-white/10" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Institutional Verification Active</p>
                  <div className="h-[1px] w-12 bg-white/10" />
               </div>
            </div>
         </div>
      </section>

      <DemoFooter brand="Nexus Prime Realty" />
    </div>
  );
}
