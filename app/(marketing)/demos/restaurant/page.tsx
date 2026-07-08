"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Utensils, Star, MapPin, Clock, ChevronRight, Phone, Flame, Leaf, Wine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNavbar, DemoFooter, FloatingWhatsApp, DemoBadge } from "@/components/demos/SharedDemoUI";

const ACCENT = "#E63946";

const CATEGORIES = [
  { icon: Flame, label: "Tandoor Specials" },
  { icon: Leaf, label: "Vegan Friendly" },
  { icon: Wine, label: "Craft Cocktails" },
  { icon: Utensils, label: "Chef's Table" },
];

const MENU_ITEMS = [
  {
    name: "Truffle Mushroom Risotto",
    price: "₹650",
    desc: "Arborio rice slow-cooked with wild mushrooms and finished with truffle oil.",
    tag: "Chef's Pick",
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Grilled Wagyu Steak",
    price: "₹2,400",
    desc: "Premium A5 Wagyu with roasted vegetables and red wine jus.",
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1544148103-07d37ce4dcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Molten Chocolate Lava Cake",
    price: "₹350",
    desc: "Warm dark chocolate cake with a liquid center, served with vanilla gelato.",
    tag: "Best Seller",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mediterranean Mezze Platter",
    price: "₹550",
    desc: "Hummus, baba ganoush, falafel, and warm pita with pickled vegetables.",
    tag: "Sharing",
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const FEATURES = [
  {
    title: "Farm to Table",
    desc: "We source ingredients daily from local farms, ensuring the freshest flavors in every dish.",
    icon: Leaf,
  },
  {
    title: "Award-Winning Chefs",
    desc: "Our culinary team brings 25+ years of combined experience from Michelin-starred kitchens.",
    icon: Utensils,
  },
  {
    title: "Intimate Atmosphere",
    desc: "Thoughtfully designed spaces for private dining, celebrations, and unforgettable evenings.",
    icon: Wine,
  },
];

const REVIEWS = [
  {
    quote: "The best dining experience in Hyderabad. The wagyu steak was out of this world, and the ambiance is perfect for date nights.",
    author: "Rohan Sharma",
    rating: 5,
  },
  {
    quote: "We hosted our anniversary dinner here and the staff went above and beyond. Impeccable food, impeccable service.",
    author: "Meera & Arjun",
    rating: 5,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function RestaurantDemo() {
  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-screen antialiased">
      <DemoNavbar brand="Midnight Culinaria" accent={ACCENT} />
      <DemoBadge />
      <FloatingWhatsApp phone="910000000000" />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Midnight Culinaria — Fine Dining Restaurant"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-32">
          <div className="max-w-2xl space-y-8">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-card/[0.08] backdrop-blur-sm rounded-full border border-white/[0.08]">
              <Flame size={14} style={{ color: ACCENT }} />
              <span className="text-xs font-medium text-zinc-300">Fine Dining · Hyderabad</span>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Every Dish,{" "}
              <span style={{ color: ACCENT }}>A Story.</span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-lg">
              Savor handcrafted cuisine made with locally sourced ingredients, served in an atmosphere designed for unforgettable evenings.
            </motion.p>

            <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-start gap-4">
              <Button
                className="h-13 px-8 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Reserve a Table
              </Button>
              <Button variant="outline" className="h-13 px-8 rounded-xl text-zinc-300 border-white/10 hover:bg-card/[0.04] text-sm font-semibold">
                <Phone size={16} className="mr-2" /> Call Us
              </Button>
            </motion.div>

            {/* Info Bar */}
            <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex flex-wrap gap-6 pt-4 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Clock size={14} /> Open 12 PM – 12 AM
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Jubilee Hills, Hyderabad
              </span>
              <span className="flex items-center gap-2">
                <Star size={14} className="fill-amber-500 text-amber-500" /> 4.8 on Google
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-y border-white/[0.04] bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <motion.div
                key={c.label}
                {...fadeUp}
                className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-pointer group"
              >
                <c.icon size={18} className="text-zinc-500 group-hover:text-white transition-colors" style={{ color: undefined }} />
                <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{c.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Crafted With Passion
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base sm:text-lg">
              We believe great food starts with great ingredients and a team that pours love into every plate.
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

      {/* ── MENU HIGHLIGHTS ── */}
      <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>
                Menu Highlights
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Signature Dishes
              </h2>
            </div>
            <Button variant="outline" className="border-white/[0.08] text-zinc-400 hover:text-white text-sm font-medium h-11 px-6 rounded-xl">
              Full Menu <ChevronRight size={16} className="ml-1" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {MENU_ITEMS.map((d, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.08 }}
                className="group bg-zinc-900/60 border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-auto overflow-hidden shrink-0">
                  <Image
                    src={d.img}
                    alt={d.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: `${ACCENT}CC` }}
                    >
                      {d.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-bold tracking-tight">{d.name}</h3>
                      <span className="text-lg font-bold shrink-0" style={{ color: ACCENT }}>
                        {d.price}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">{d.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 h-9 rounded-lg text-xs font-semibold border-white/[0.08] text-zinc-400 hover:text-white w-fit"
                  >
                    Order Now
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
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Loved by Foodies
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
                <p className="font-semibold text-sm text-white">{r.author}</p>
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
              Your Table{" "}
              <span style={{ color: ACCENT }}>Awaits.</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base sm:text-lg relative z-10">
              Reserve your spot for an unforgettable dining experience. Walk-ins welcome, reservations preferred.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button
                className="h-13 px-10 rounded-xl text-white text-sm font-semibold border-none hover:opacity-90 shadow-lg"
                style={{ backgroundColor: ACCENT, boxShadow: `0 8px 32px ${ACCENT}40` }}
              >
                Make a Reservation
              </Button>
              <span className="text-sm text-zinc-500">or call +91 00000 00000</span>
            </div>
          </motion.div>
        </div>
      </section>

      <DemoFooter brand="Midnight Culinaria" accent={ACCENT} />
    </div>
  );
}