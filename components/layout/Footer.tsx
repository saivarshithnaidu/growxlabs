"use client";
import { Shield, Lock, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

export function Footer() {
  const links = {
    services: [
      { name: "Web Engineering", href: "/services" },
      { name: "Automation (n8n)", href: "/services" },
      { name: "Premium Hosting", href: "/services" },
      { name: "AI Integration", href: "/services" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Client Agreement", href: "/client-agreement" },
    ],
    operational: [
      { name: "Project Handover", href: "/handover" },
      { name: "AI Products", href: "/products" },
      { name: "Client Portal", href: "/client/dashboard" },
      { name: "Portfolio", href: "/portfolio" },
    ]
  };

  return (
    <footer className="w-full border-t border-white/5 bg-black pt-24 pb-12 px-6 md:px-12 xl:px-20 2xl:px-32">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20 text-center md:text-left">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center justify-center md:justify-start group">
              <div className="relative h-10 w-40 transition-transform group-hover:scale-[1.02] duration-300">
                <Image
                  src="/logo.svg"
                  alt="GrowX Labs"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-[#A0A0A0] text-[13px] leading-relaxed">
              We build AI-powered websites and automation systems that help businesses grow faster.
            </p>

            {/* MSME & Contact Details */}
            <div className="space-y-2 pt-2">
              <p className="text-[12px] text-[#A0A0A0]/60">MSME Registered</p>
              <p className="text-[12px] text-[#A0A0A0]/60">UDYAM-AP-22-0063260</p>
              <p className="text-[12px] text-[#A0A0A0]/60">Guntur, Andhra Pradesh, India</p>
            </div>

            <div className="space-y-2 pt-2">
              <a href="mailto:hello@growxlabs.tech" className="flex items-center gap-2 text-[13px] text-[#A0A0A0] hover:text-white transition-colors justify-center md:justify-start">
                <Mail size={12} /> hello@growxlabs.tech
              </a>
              <a href="tel:+919121600000" className="flex items-center gap-2 text-[13px] text-[#A0A0A0] hover:text-white transition-colors justify-center md:justify-start">
                <Phone size={12} /> +91 91216 00000
              </a>
            </div>

            <div className="pt-4 flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/20 justify-center md:justify-start">
                <Shield size={12} className="text-white/30" />
                <span>HTTPS / TLS Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/20 justify-center md:justify-start">
                <Lock size={12} className="text-white/30" />
                <span>Secure Data Handling</span>
              </div>
            </div>
          </div>

          {/* Nav groups */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8">Capabilities</h4>
            <ul className="space-y-4">
              {links.services.map(l => (
                <li key={l.name}><Link href={l.href} className="text-[#A0A0A0] hover:text-white text-sm transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8">Legal & Policy</h4>
            <ul className="space-y-4">
              {links.legal.map(l => (
                <li key={l.name}><Link href={l.href} className="text-[#A0A0A0] hover:text-white text-sm transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8">Operational</h4>
            <ul className="space-y-4">
              {links.operational.map(l => (
                <li key={l.name}><Link href={l.href} className="text-[#A0A0A0] hover:text-white text-sm transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[11px] font-semibold uppercase tracking-widest">
            © 2026 GrowX Labs. All rights reserved.
          </p>
          <p className="text-white/20 text-[11px] font-semibold uppercase tracking-widest">
            Guntur, Andhra Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
