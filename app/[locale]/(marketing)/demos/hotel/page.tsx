"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Bed, Star, MapPin, Wifi, Coffee, Car, ShieldCheck, Clock, Phone, ChevronRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const ACCENT = "#B8860B";

const AMENITIES = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Coffee, label: "Breakfast" },
  { icon: Car, label: "Valet Parking" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Users, label: "Concierge" },
  { icon: Clock, label: "Late Check-out" },
];

const ROOMS = [
  {
    name: "Deluxe King Room",
    price: "₹4,500",
    unit: "/night",
    tag: "Most Popular",
    beds: "1 King Bed",
    guests: "2 Guests",
    size: "350 sqft",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Premium Suite",
    price: "₹7,200",
    unit: "/night",
    tag: "Best Value",
    beds: "1 King + Lounge",
    guests: "2 Guests",
    size: "520 sqft",
    img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Royal Penthouse",
    price: "₹15,000",
    unit: "/night",
    tag: "Exclusive",
    beds: "2 King + Terrace",
    guests: "4 Guests",
    size: "1,200 sqft",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const FEATURES = [
  {
    title: "Luxury Redefined",
    desc: "Every room is designed for comfort and elegance, with handpicked furnishings and premium amenities.",
    icon: Bed,
  },
  {
    title: "Prime Location",
    desc: "Located in the heart of Bengaluru's financial district, minutes from major tech parks and attractions.",
    icon: MapPin,
  },
  {
    title: "World-Class Service",
    desc: "Our dedicated staff ensures a seamless experience from booking to checkout — every single time.",
    icon: ShieldCheck,
  },
];

const REVIEWS = [
  {
    quote: "Absolutely stunning property. The rooms are immaculate and the staff made us feel right at home.",
    author: "Priya Sharma",
    role: "Business Traveler",
    rating: 5,
  },
  {
    quote: "Best hotel experience in Bengaluru. The rooftop lounge and the breakfast spread are worth every penny.",
    author: "James Mitchell",
    role: "Verified Guest",
    rating: 5,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function HotelDemo() {
  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-screen antialiased">
      <DemoNavbar brand="The Grand Reserve" accent={ACCENT} />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="The Grand Reserve — Luxury Hotel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-32">
          <div className="max-w-2xl space-y-8">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.08] backdrop-blur-sm rounded-full border border-white/[0.08]">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              <span className="text-xs font-medium text-zinc-300">5-Star Luxury · Bengaluru</span>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Your Stay,{" "}
              <span style={{ color: ACCENT }}>Elevated.</span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg">
              Experience world-class hospitality in the heart of Bengaluru. Boutique suites, curated dining, and service that goes beyond expectations.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                className="h-13 px-8 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Book Your Stay
              </Button>
              <Button variant="outline" className="h-13 px-8 rounded-xl text-zinc-300 border-white/10 hover:bg-white/[0.04] text-sm font-semibold">
                <Phone size={16} className="mr-2" /> Call Us
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex flex-wrap gap-6 pt-4">
              {[
                { label: "500+", sub: "Happy Guests" },
                { label: "4.9", sub: "Google Rating" },
                { label: "50+", sub: "Premium Rooms" },
              ].map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-white">{s.label}</p>
                  <p className="text-xs text-zinc-500">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AMENITIES BAR ── */}
      <section className="border-y border-white/[0.04] bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            {AMENITIES.map((a) => (
              <motion.div key={a.label} {...fadeUp} className="flex flex-col items-center gap-2 text-center">
                <div className="h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <a.icon size={18} className="text-zinc-400" />
                </div>
                <span className="text-[11px] font-medium text-zinc-500">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              A Stay Like No Other
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base sm:text-lg">
              From the moment you arrive, every detail is curated to make your experience unforgettable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/60 border border-white/[0.06] rounded-2xl p-8 space-y-5 hover:bg-zinc-800/40 transition-colors group"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                >
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROOMS / GALLERY ── */}
      <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                Our Rooms
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Choose Your Room
              </h2>
            </div>
            <Button variant="outline" className="border-white/[0.08] text-zinc-400 hover:text-white text-sm font-medium h-11 px-6 rounded-xl">
              View All Rooms <ChevronRight size={16} className="ml-1" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.map((r, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group bg-zinc-900/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={r.img}
                    alt={r.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: `${ACCENT}CC` }}
                    >
                      {r.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold tracking-tight">{r.name}</h3>
                    <div className="text-right">
                      <span className="text-lg font-bold" style={{ color: ACCENT }}>
                        {r.price}
                      </span>
                      <span className="text-xs text-zinc-500">{r.unit}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                      <Bed size={12} /> {r.beds}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                      <Users size={12} /> {r.guests}
                    </span>
                  </div>

                  <Button
                    className="w-full h-11 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Book This Room
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              Guest Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              What Our Guests Say
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/60 border border-white/[0.06] rounded-2xl p-8 space-y-6"
              >
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg font-medium leading-relaxed text-zinc-300">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-sm text-white">{r.author}</p>
                  <p className="text-xs text-zinc-500">{r.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp}
            className="relative bg-zinc-900/80 border border-white/[0.06] rounded-3xl p-10 sm:p-16 text-center space-y-8 overflow-hidden"
          >
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20"
              style={{ backgroundColor: ACCENT }}
            />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight relative z-10">
              Ready to{" "}
              <span style={{ color: ACCENT }}>Check In?</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base sm:text-lg relative z-10">
              Book your stay today and enjoy exclusive rates. Limited availability for peak season.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button
                className="h-13 px-10 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Reserve Now
              </Button>
              <span className="text-sm text-zinc-500">or call +91 00000 00000</span>
            </div>
          </motion.div>
        </div>
      </section>

      <DemoFooter brand="The Grand Reserve" accent={ACCENT} />
    </div>
  );
}
