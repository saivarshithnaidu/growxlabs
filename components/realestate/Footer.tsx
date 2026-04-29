"use client";

import { Link } from "@/navigation";
import { Building2 } from "lucide-react";

export const RealEstateFooter = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/realestate" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all duration-500">
                <Building2 className="text-primary group-hover:text-black w-5 h-5 transition-colors" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                GrowX <span className="text-primary not-italic">Estates</span>
              </span>
            </Link>
            <p className="text-white/30 max-w-sm font-light leading-relaxed italic">
              The future of luxury living. We provide data-driven insights and exclusive access to the world's most prestigious real estate portfolios.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/realestate/properties" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Portfolio</Link></li>
              <li><Link href="/realestate/services" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Services</Link></li>
              <li><Link href="/realestate/insights" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Insights</Link></li>
              <li><Link href="/realestate/contact" className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Acquisition</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Global HQ</h4>
            <ul className="space-y-4 text-white/40 text-[10px] font-black uppercase tracking-widest leading-loose">
              <li>estates@growxlabs.com</li>
              <li>+1 (555) 777-1111</li>
              <li>Level 101, Burj Khalifa,<br />Dubai, UAE</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
            © {new Date().getFullYear()} GrowX Labs Real Estate Demo.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
