"use client";

import { motion } from "framer-motion";
import { Utensils, Star, MapPin, Clock, Camera as Instagram, Share2 as Facebook, Globe as Twitter, ChevronRight, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const SERVICES = [
  { title: "Gourmet Architecture", desc: "Plates engineered for high-performance visual impact.", icon: Utensils },
  { title: "Signature Experience", desc: "A dining flow optimized for maximum conversion.", icon: Zap },
  { title: "Secure Operations", desc: "Global standards for food safety and digital bookings.", icon: ShieldCheck }
];

const DISHES = [
  { name: "Truffle Gnocchi", price: "₹650", type: "LUXURY STARTER", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Wagyu Ribeye", price: "₹2,400", type: "PREMIUM MAIN", img: "https://images.unsplash.com/photo-1544148103-07d37ce4dcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Chocolate Lava", price: "₹350", type: "SIGNATURE DESSERT", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export default function RestaurantDemo() {
  return (
    <div className="bg-[#0B0F1A] text-[#DFE5F3] min-h-screen selection:bg-[#6C63FF]/30">
      <DemoNavbar brand="Midnight Culinaria" />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* 2. Hero Section - REVERTED TO FULL IMAGE PREMIUM LOOK */}
      <section className="relative h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             alt="Hero" 
             className="w-full h-full object-cover brightness-[0.2]" 
           />
           <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/20 via-[#0B0F1A]/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-6 py-3 bg-white/[0.02] backdrop-blur-3xl rounded-2xl border border-white/10 mx-auto">
              <Utensils size={18} className="text-[#6C63FF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFE5F3]/40">Premium Dining Architecture</span>
           </motion.div>
           <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] italic">
              Taste <br /> <span className="text-[#6C63FF]">Infrastructure.</span>
           </motion.h1>
           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">
              Engineering elite culinary experiences for the high-intent global palate. Digital-first, flavor-engineered.
           </motion.p>
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Button className="h-16 px-16 rounded-2xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Reserve Your Position</Button>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFE5F3]/20 flex items-center gap-4">
                 <div className="h-[1px] w-8 bg-white/10" />
                 Available 24/7 Operations
                 <div className="h-[1px] w-8 bg-white/10" />
              </div>
           </motion.div>
        </div>
      </section>

      {/* 3. Services / Features */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
               <div key={i} className="bg-[#111827] p-8 rounded-[2rem] border border-white/[0.08] space-y-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="h-14 w-14 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center text-[#6C63FF] group-hover:scale-110 transition-transform">
                     <s.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{s.title}</h3>
                  <p className="text-[#9CA3AF] font-medium leading-relaxed">{s.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* 4. Cards Section (Grid) */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="space-y-4">
                  <span className="text-[#6C63FF] font-black uppercase tracking-widest text-xs italic underline underline-offset-8">Signature Repository</span>
                  <h2 className="text-5xl font-black tracking-tighter italic">Operational Assets.</h2>
               </div>
               <Button variant="outline" className="border-white/[0.08] font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-full">Full Directory</Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {DISHES.map((d, i) => (
                  <div key={i} className="group cursor-pointer space-y-6">
                     <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
                        <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75" />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest">{d.type}</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60" />
                     </div>
                     <div className="flex justify-between items-center px-2">
                        <div>
                           <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-[#6C63FF] transition-colors">{d.name}</h3>
                           <p className="text-[#9CA3AF] text-[10px] uppercase font-black tracking-widest mt-1">Limited Release</p>
                        </div>
                        <p className="text-xl font-black text-[#6C63FF] tracking-tighter">{d.price}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Testimonials / Trust */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto">
            <div className="bg-[#111827] rounded-[3rem] p-12 md:p-20 border border-white/[0.08] text-center space-y-12 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C63FF]/5 blur-[80px]" />
               <div className="flex items-center justify-center gap-2">
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
               </div>
               <blockquote className="text-3xl md:text-5xl font-black tracking-tighter leading-tight italic max-w-4xl mx-auto">
                  "Midnight Culinaria has redefined our expectations of what a premium dining experience feels like in Hyderabad."
               </blockquote>
               <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest text-xs italic text-[#6C63FF]">Rohan Sharma</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF]">Verified Strategic Diner</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 px-6 mt-20 mb-20">
         <div className="max-w-7xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic">Initiate <br /> <span className="text-[#6C63FF]">Reserva.</span></h2>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto font-medium">Slots for premium operational windows are strictly limited. Dispatch your reservation intent now.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <Button className="h-16 px-16 rounded-xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Secure Protocol</Button>
               <div className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Available 24/7 Operations</div>
            </div>
         </div>
      </section>

      <DemoFooter brand="Midnight Culinaria" />
    </div>
  );
}
