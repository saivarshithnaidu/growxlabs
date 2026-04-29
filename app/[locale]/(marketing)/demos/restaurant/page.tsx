"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Utensils, Star, MapPin, Clock, ChevronRight, MessageCircle, ShieldCheck, Zap, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const SERVICES = [
   { title: "Gourmet Architecture", desc: "Plates engineered for high-performance visual impact.", icon: Utensils },
   { title: "Signature Experience", desc: "A dining flow optimized for maximum conversion.", icon: Zap },
   { title: "Secure Operations", desc: "Global standards for food safety and digital bookings.", icon: ShieldCheck }
];

const DISHES = [
   { name: "Truffle Gnocchi", price: "₹650", type: "Luxury Starter", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
   { name: "Wagyu Ribeye", price: "₹2,400", type: "Premium Main", img: "https://images.unsplash.com/photo-1544148103-07d37ce4dcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
   { name: "Chocolate Lava", price: "₹350", type: "Signature Dessert", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

const TESTIMONIAL = {
   quote: "Midnight Culinaria has redefined our expectations of what a premium dining experience feels like in Hyderabad.",
   author: "Rohan Sharma",
   role: "Verified Strategic Diner"
};

export default function RestaurantDemo() {
   return (
      <div className="bg-[#0B0F1A] text-[#DFE5F3] min-h-screen selection:bg-[#6C63FF]/30">
         <DemoNavbar brand="Midnight Culinaria" />
         <DemoBadge />
         <FloatingWhatsApp phone="910000000000" />

         {/* Hero Section */}
         <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
               <Image
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                  alt="Hero"
                  fill
                  className="object-cover brightness-[0.25]"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/20 via-[#0B0F1A]/80 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
               <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] backdrop-blur-3xl rounded-xl border border-white/10 mx-auto"
               >
                  <Utensils size={16} className="text-[#6C63FF]" />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#DFE5F3]/40">Premium Dining</span>
               </motion.div>

               <motion.h1
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] sm:leading-[0.85]"
               >
                  Taste <br /> <span className="text-[#6C63FF]">Infrastructure.</span>
               </motion.h1>

               <motion.p
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg md:text-2xl text-[#9CA3AF] max-w-xl sm:max-w-2xl mx-auto px-4 font-medium"
               >
                  Engineering elite culinary experiences for the high-intent global palate.
               </motion.p>

               <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
               >
                  <Button className="h-12 sm:h-14 md:h-16 px-8 sm:px-12 md:px-16 rounded-xl sm:rounded-2xl bg-[#6C63FF] text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all w-full sm:w-auto">
                     Reserve Your Position
                  </Button>
                  <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#DFE5F3]/20">
                     <div className="h-[1px] w-6 bg-white/10 hidden sm:block" />
                     Available 24/7
                     <div className="h-[1px] w-6 bg-white/10 hidden sm:block" />
                  </div>
               </motion.div>
            </div>
         </section>

         {/* Services Section */}
         <section className="py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {SERVICES.map((s, i) => (
                     <div key={i} className="bg-[#111827] p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white/[0.08] space-y-4 sm:space-y-6 hover:bg-white/[0.02] transition-colors group">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center text-[#6C63FF] group-hover:scale-110 transition-transform">
                           <s.icon size={24} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight">{s.title}</h3>
                        <p className="text-sm sm:text-base text-[#9CA3AF] font-medium leading-relaxed">{s.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Signature Dishes Section */}
         <section className="py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                     <span className="text-[#6C63FF] font-black uppercase tracking-widest text-[10px] sm:text-xs italic">Signature Repository</span>
                     <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter italic">Operational Assets.</h2>
                  </div>
                  <Button variant="outline" className="border-white/[0.08] font-black uppercase text-[10px] tracking-widest h-10 sm:h-12 px-6 sm:px-8 rounded-full w-full sm:w-auto">Full Menu</Button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  {DISHES.map((d, i) => (
                     <div key={i} className="group cursor-pointer space-y-4 sm:space-y-6">
                        <div className="relative aspect-[4/5] rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl">
                           <Image src={d.img} alt={d.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" />
                           <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md rounded-full text-[8px] sm:text-[8px] font-black uppercase tracking-widest">{d.type}</div>
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-60" />
                        </div>
                        <div className="flex justify-between items-center px-1 sm:px-2">
                           <div>
                              <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter group-hover:text-[#6C63FF] transition-colors">{d.name}</h3>
                              <p className="text-[#9CA3AF] text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-1">Limited Release</p>
                           </div>
                           <p className="text-lg sm:text-xl font-black text-[#6C63FF] tracking-tighter">{d.price}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Testimonial Section */}
         <section className="py-16 sm:py-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
               <div className="bg-[#111827] rounded-2xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 lg:p-20 border border-white/[0.08] text-center space-y-8 sm:space-y-12 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#6C63FF]/5 blur-[80px]" />
                  <div className="flex items-center justify-center gap-2">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className="fill-[#6C63FF] text-[#6C63FF]" size={14} />
                     ))}
                  </div>
                  <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-tight leading-tight italic max-w-3xl sm:max-w-4xl mx-auto px-2">
                     "{TESTIMONIAL.quote}"
                  </blockquote>
                  <div className="space-y-2">
                     <p className="font-black uppercase tracking-widest text-xs italic text-[#6C63FF]">{TESTIMONIAL.author}</p>
                     <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9CA3AF]">{TESTIMONIAL.role}</p>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-16 sm:py-20 px-4 sm:px-6 mb-12 sm:mb-20">
            <div className="max-w-7xl mx-auto text-center space-y-8 sm:space-y-10">
               <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter italic leading-tight">
                  Initiate <br /> <span className="text-[#6C63FF]">Reserva.</span>
               </h2>
               <p className="text-base sm:text-lg md:text-xl text-[#9CA3AF] max-w-xl mx-auto font-medium px-4">
                  Slots for premium operational windows are strictly limited. Dispatch your reservation intent now.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <Button className="h-12 sm:h-14 md:h-16 px-10 sm:px-12 md:px-16 rounded-xl bg-[#6C63FF] text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] shadow-2xl shadow-[#6C63FF]/40 border-none hover:scale-105 transition-all w-full sm:w-auto">
                     Secure Protocol
                  </Button>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Available 24/7</div>
               </div>
            </div>
         </section>

         <DemoFooter brand="Midnight Culinaria" />
      </div>
   );
}