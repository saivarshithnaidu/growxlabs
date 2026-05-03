"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, MapPin, TrendingUp, ArrowUpRight, ShieldCheck, Star, Phone, ChevronRight, Ruler, BedDouble, Bath, Car } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const ACCENT = "#10B981";

const STATS = [
  { value: "200+", label: "Properties Sold" },
  { value: "₹500 Cr+", label: "Total Value" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15+", label: "Years Experience" },
];

const LISTINGS = [
  {
    name: "Skyline Penthouse",
    price: "₹2.4 Cr",
    location: "Financial District, Hyd",
    beds: 4,
    baths: 3,
    area: "3,200",
    tag: "Premium",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Neon Heights Apartment",
    price: "₹1.1 Cr",
    location: "Gachibowli, Hyd",
    beds: 3,
    baths: 2,
    area: "1,850",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "The Emerald Villa",
    price: "₹4.8 Cr",
    location: "Jubilee Hills, Hyd",
    beds: 5,
    baths: 4,
    area: "5,500",
    tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const FEATURES = [
  {
    title: "Verified Listings",
    desc: "Every property is RERA-verified and legally vetted. No hidden surprises — just transparent, trustworthy deals.",
    icon: ShieldCheck,
  },
  {
    title: "Prime Locations",
    desc: "Handpicked properties in Hyderabad's fastest-growing corridors — close to IT hubs, schools, and hospitals.",
    icon: MapPin,
  },
  {
    title: "Investment Growth",
    desc: "Our portfolio averages 15% YoY appreciation. We help you build wealth through smart real estate choices.",
    icon: TrendingUp,
  },
];

const REVIEWS = [
  {
    quote: "Nexus Prime helped us find our dream home in just 2 weeks. Their team was professional, transparent, and incredibly supportive throughout.",
    author: "Vikrant & Neha Singh",
    role: "Homeowners, Gachibowli",
    rating: 5,
  },
  {
    quote: "As an investor, I've worked with many realtors. Nexus Prime stands out for their market knowledge and genuine commitment to client success.",
    author: "Rajesh Menon",
    role: "Real Estate Investor",
    rating: 5,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function RealEstateDemo() {
  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-screen antialiased">
      <DemoNavbar brand="Nexus Prime Realty" accent={ACCENT} />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Nexus Prime Realty — Premium Properties"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-32">
          <div className="max-w-2xl space-y-8">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.08] backdrop-blur-sm rounded-full border border-white/[0.08]">
              <Building2 size={14} style={{ color: ACCENT }} />
              <span className="text-xs font-medium text-zinc-300">Premium Real Estate · Hyderabad</span>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Find Your{" "}
              <span style={{ color: ACCENT }}>Dream Home.</span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg">
              Discover premium properties in Hyderabad&apos;s most sought-after neighborhoods. RERA-verified, legally vetted, and ready for you.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                className="h-13 px-8 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Browse Properties
              </Button>
              <Button variant="outline" className="h-13 px-8 rounded-xl text-zinc-300 border-white/10 hover:bg-white/[0.04] text-sm font-semibold">
                <Phone size={16} className="mr-2" /> Schedule a Visit
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-white/[0.04] bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <motion.div key={s.label} {...fadeUp} className="text-center space-y-1">
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: ACCENT }}>
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NEXUS ── */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              Why Nexus Prime
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Real Estate, Done Right
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base sm:text-lg">
              We combine deep local expertise with a client-first approach to make buying your next property stress-free.
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

      {/* ── FEATURED PROPERTIES ── */}
      <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                Featured Listings
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Handpicked Properties
              </h2>
            </div>
            <Button variant="outline" className="border-white/[0.08] text-zinc-400 hover:text-white text-sm font-medium h-11 px-6 rounded-xl">
              View All <ChevronRight size={16} className="ml-1" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LISTINGS.map((l, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group bg-zinc-900/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={l.img}
                    alt={l.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: `${ACCENT}CC` }}
                    >
                      {l.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="h-10 w-10 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all cursor-pointer">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{l.name}</h3>
                    <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                      <MapPin size={12} /> {l.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                      <BedDouble size={12} /> {l.beds} Beds
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                      <Bath size={12} /> {l.baths} Baths
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                      <Ruler size={12} /> {l.area} sqft
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                    <span className="text-xl font-bold" style={{ color: ACCENT }}>
                      {l.price}
                    </span>
                    <Button
                      variant="outline"
                      className="h-9 px-4 rounded-lg text-xs font-semibold border-white/[0.08] text-zinc-400 hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
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
              Client Stories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Trusted by Homebuyers
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
              <span style={{ color: ACCENT }}>Move In?</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base sm:text-lg relative z-10">
              Whether you&apos;re buying your first home or expanding your portfolio, our experts are here to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button
                className="h-13 px-10 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Get Free Consultation
              </Button>
              <span className="text-sm text-zinc-500">or call +91 00000 00000</span>
            </div>
          </motion.div>
        </div>
      </section>

      <DemoFooter brand="Nexus Prime Realty" accent={ACCENT} />
    </div>
  );
}
