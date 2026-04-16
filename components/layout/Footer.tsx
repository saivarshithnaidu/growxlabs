import Link from "next/link";
import { Rocket, Shield, Lock, CheckCircle, Globe, Mail } from "lucide-react";

export function Footer() {
  const links = {
    services: [
      { name: "Web Engineering", href: "/services" },
      { name: "Automation (n8n)", href: "/services" },
      { name: "Premium Hosting", href: "/services" },
      { name: "AI Integration", href: "/services" },
    ],
    legal: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Client Agreement", href: "/client-agreement" },
    ],
    operational: [
      { name: "Project Handover", href: "/handover" },
      { name: "AI Products", href: "/products" },
      { name: "Client Portal", href: "/dashboard" },
      { name: "Success Stories", href: "/portfolio" },
    ]
  };

  return (
    <footer className="border-t border-white/5 bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 justify-center md:justify-start">
              <Rocket className="h-6 w-6 text-white" />
              <span className="text-xl font-black text-white tracking-tighter">GrowX Labs</span>
            </Link>
            <p className="text-white/40 text-[13px] leading-relaxed font-light">
              Engineering high-performance ecosystems and autonomous intelligence 
              for modern businesses scaling at the speed of the web.
            </p>
            <div className="pt-4 flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/20 justify-center md:justify-start">
                <Shield size={12} className="text-white/40" />
                <span>HTTPS / TLS Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/20 justify-center md:justify-start">
                <Lock size={12} className="text-white/40" />
                <span>Secure Data Handling</span>
              </div>
            </div>
          </div>

          {/* Nav groups */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Capabilities</h4>
            <ul className="space-y-4">
              {links.services.map(l => (
                <li key={l.name}><Link href={l.href} className="text-white/40 hover:text-white text-sm font-light transition-all">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Legal & Policy</h4>
            <ul className="space-y-4">
              {links.legal.map(l => (
                <li key={l.name}><Link href={l.href} className="text-white/40 hover:text-white text-sm font-light transition-all">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Operational</h4>
            <ul className="space-y-4">
              {links.operational.map(l => (
                <li key={l.name}><Link href={l.href} className="text-white/40 hover:text-white text-sm font-light transition-all">{l.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-6">
            <p className="text-white/20 text-[11px] font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} GrowX Labs India
            </p>
          </div>
          <div className="flex items-center space-x-6 text-[11px] font-bold uppercase tracking-widest">
            <span className="text-white/20">Jurisdiction</span>
            <span className="text-white/60">Guntur, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
