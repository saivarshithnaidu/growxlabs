"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Bed, Star, MapPin, Wifi, Phone, Coffee, Wind, Car, Users, Camera as Instagram, Share2 as Facebook, Globe as Twitter, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const SERVICES = [
  { title: "Boutique Intel", desc: "Suites engineered for maximum psychological comfort.", icon: Bed },
  { title: "Smart Operations", desc: "Automated check-ins and hyper-fast response times.", icon: Zap },
  { title: "Global Security", desc: "Encrypted privacy and ultra-secure site deployment.", icon: ShieldCheck }
];

const ROOMS = [
  { name: "Executive Suite", price: "₹6,500/night", type: "LUXURY SUITE", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Superior Room", price: "₹4,200/night", type: "PREMIUM STAY", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Penthouse", price: "₹12,000/night", type: "ASSET CLASS", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export default function HotelDemo() {
  return (
    <div className="bg-[#0B0F1A] text-[#DFE5F3] min-h-screen selection:bg-[#6C63FF]/30">
      <DemoNavbar brand="The Grand Reserve" />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* 2. Hero Section - REVERTED TO FULL IMAGE PREMIUM LOOK */}
      <section className="relative h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             alt="Luxury Hero" 
             fill
             className="object-cover brightness-[0.25]" 
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0F1A] via-transparent to-transparent opacity-90" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F1A]/40 to-[#0B0F1A]" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
           <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} className="inline-flex items-center gap-3 px-6 py-3 bg-[#111827]/60 backdrop-blur-3xl rounded-2xl border border-white/10 mx-auto">
              <Bed size={18} className="text-[#6C63FF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DFE5F3]/40">Boutique Hospitality Engineering</span>
           </motion.div>
           <motion.h1 whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} viewport={{ once: true }} className="text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.75] italic">
              Elite <br /> <span className="text-[#6C63FF]">Reserves.</span>
           </motion.h1>
           <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-2xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">
              Where boutique hospitality meets edge engineering. A stay that feels like prime infrastructure.
           </motion.p>
           <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row items-center justify-center gap-10 pt-4">
              <Button className="h-16 px-16 rounded-2xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Book Protocol</Button>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]/40">
                 Bengaluru Financial District
              </div>
           </motion.div>
        </div>
      </section>

      {/* 3. Services / Features */}
      <section className="py-20 px-6 mt-20">
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
            {SERVICES.map((s, i) => (
               <div key={i} className="bg-[#111827] p-8 rounded-[2rem] border border-white/[0.08] space-y-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="h-14 w-14 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center text-[#6C63FF] group-hover:scale-110 transition-transform mx-auto md:mx-0">
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
                  <span className="text-[#6C63FF] font-black uppercase tracking-widest text-xs italic underline underline-offset-8">Unit Repositories</span>
                  <h2 className="text-5xl font-black tracking-tighter italic">Boutique Assets.</h2>
               </div>
               <Button variant="outline" className="border-white/[0.08] font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-full">Full Inventory</Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {ROOMS.map((r, i) => (
                  <div key={i} className="group cursor-pointer space-y-6">
                     <div className="relative aspect-[1/1.25] rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
                        <Image src={r.img} alt={r.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75" />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest">{r.type}</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60" />
                     </div>
                     <div className="flex justify-between items-center px-2">
                        <div>
                           <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-[#6C63FF] transition-colors">{r.name}</h3>
                           <p className="text-[#9CA3AF] text-[10px] uppercase font-black tracking-widest mt-1 italic">Bengaluru Core</p>
                        </div>
                        <p className="text-xl font-black text-[#6C63FF] tracking-tighter">{r.price}</p>
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
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6C63FF]/5 blur-[80px]" />
               <div className="flex items-center justify-center gap-2">
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
                  <Star className="fill-[#6C63FF] text-[#6C63FF]" size={16} />
               </div>
               <blockquote className="text-3xl md:text-5xl font-black tracking-tighter leading-tight italic max-w-4xl mx-auto">
                  "Truly a boutique experience that mirrors the speed and ambition of the city's tech district."
               </blockquote>
               <div className="space-y-4">
                  <div className="px-6 py-2 bg-white/5 rounded-full inline-block text-[10px] font-black uppercase tracking-[0.2em] italic">Sarah Jennings</div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF]">Global Intelligence Visitor</p>
               </div>
            </div>
         </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-20 px-6 mt-20 mb-20">
         <div className="max-w-7xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic">Secure <br /> <span className="text-[#6C63FF]">Access.</span></h2>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto font-medium leading-relaxed">Prime suites in Bengaluru's soul are dispatched daily. Deploy your booking request now.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
               <Button className="h-16 px-16 rounded-xl bg-[#6C63FF] text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all">Check Inventory</Button>
               <div className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] border-l border-white/10 pl-8 hidden md:block italic">Available 24/7</div>
            </div>
         </div>
      </section>

      <DemoFooter brand="The Grand Reserve" />
    </div>
  );
}
