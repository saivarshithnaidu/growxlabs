"use client";

import { Mail } from "lucide-react";
import { Link, usePathname } from "@/navigation";

export function Footer() {
  const pathname = usePathname();
  const isBlog = pathname?.includes("/blog");

  const links = {
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  };

  // Design tokens based on page context (Marketing / Blog)
  const footerBg = isBlog 
    ? "bg-[#FDFAF7] border-[#E5E2DC]" 
    : "bg-background border-border";

  const logoColor1 = isBlog ? "text-[#111111]" : "text-white";
  const logoColor2 = isBlog ? "text-[#355CFF]" : "text-[#C0F0FB]";

  const textColor = isBlog ? "text-muted-foreground" : "text-[#8C8D91]";
  const headingColor = isBlog ? "text-[#111111]" : "text-white";
  const accentColor = isBlog ? "text-[#355CFF]" : "text-[#C0F0FB]";
  const linkHoverColor = isBlog ? "hover:text-[#111111]" : "hover:text-white";

  const socialLinkClass = isBlog 
    ? "text-muted-foreground hover:text-[#355CFF]" 
    : "text-[#8C8D91] hover:text-[#C0F0FB]";

  return (
    <footer className={`w-full border-t pt-20 pb-10 px-6 md:px-12 xl:px-20 2xl:px-32 transition-colors duration-500 ${footerBg}`}>
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
          <div className="space-y-5">
            <Link href="/" className="flex items-center group" aria-label="GrowXLabsTech home">
              <div className="flex items-center text-xl font-serif tracking-normal transition-transform group-hover:scale-[1.02] duration-300">
                <span className={logoColor1}>GrowX</span>
                <span className={logoColor1}>Labs</span>
                <span className={logoColor2}>.tech</span>
              </div>
            </Link>
            <p className={`text-[13px] leading-relaxed max-w-[285px] ${textColor}`}>
              AI-native software company, product studio and AI engineering lab.
            </p>

            <div className="space-y-2 pt-1">
              <a href="mailto:hello@growxlabs.tech" className={`flex items-center gap-2 text-[13px] hover:text-foreground transition-colors ${textColor}`}>
                <Mail size={13} className={accentColor} aria-hidden="true" /> hello@growxlabs.tech
              </a>

              {/* Horizontal Social Icons */}
              <div className="flex items-center gap-4 pt-3">
                <a 
                  href="https://www.linkedin.com/company/growxlabs-tech/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:scale-110 transition-all duration-300 ${socialLinkClass}`}
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/growxlabs.tech?igsh=MTJ2cmUwaHpibGVreg==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:scale-110 transition-all duration-300 ${socialLinkClass}`}
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/share/1AymTBmSj2/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:scale-110 transition-all duration-300 ${socialLinkClass}`}
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a 
                  href="https://github.com/saivarshithnaidu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`hover:scale-110 transition-all duration-300 ${socialLinkClass}`}
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-[12px] font-sans font-bold uppercase tracking-[0.15em] mb-5 ${headingColor}`}>Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={`text-[14px] transition-colors ${textColor} ${linkHoverColor}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isBlog ? "border-[#E5E2DC]" : "border-[#2B2D31]"}`}>
          <p className={`text-[13px] ${textColor}`}>
            Copyright 2026 GrowXLabsTech. All rights reserved.
          </p>
          <p className={`text-[13px] ${textColor}`}>
            India, USA, UK, Australia, UAE, Canada, Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}

