"use client";

import { Mail, Phone } from "lucide-react";
import { Link } from "@/navigation";

export function Footer() {
  const links = {
    services: [
      { name: "Web Engineering", href: "/services" },
      { name: "AI & Automation", href: "/services" },
      { name: "Technical SEO", href: "/services" },
      { name: "Cloud Infrastructure", href: "/services" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "AI Products", href: "/products" },
      { name: "Courses", href: "/courses" },
      { name: "Blog", href: "/blog" },
    ],
    resources: [
      { name: "Client Portal", href: "/client/dashboard" },
      { name: "Project Handover", href: "/handover" },
      { name: "Pricing", href: "/services#subscriptions" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Client Agreement", href: "/client-agreement" },
    ],
  };

  return (
    <footer className="w-full border-t border-[#E5E2DC] bg-white pt-20 pb-10 px-6 md:px-12 xl:px-20 2xl:px-32">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center group" aria-label="GrowXLabsTech home">
              <div className="flex items-center text-xl font-black tracking-tight transition-transform group-hover:scale-[1.02] duration-300">
                <span className="text-[#1A1A1A]">GrowXLabs</span>
                <span className="text-[#355CFF]">.tech</span>
              </div>
            </Link>
            <p className="text-[#6B7280] text-[13px] leading-relaxed max-w-[250px]">
              AI-native agency building websites, automations, and growth systems for ambitious businesses worldwide.
            </p>

            <div className="space-y-2 pt-1">
              <a href="mailto:hello@growxlabs.tech" className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                <Mail size={13} className="text-[#355CFF]" aria-hidden="true" /> hello@growxlabs.tech
              </a>
              <a href="tel:+918790907144" className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                <Phone size={13} className="text-[#355CFF]" aria-hidden="true" /> +91 87909 07144
              </a>

              {/* Horizontal Social Icons */}
              <div className="flex items-center gap-4 pt-3">
                <a 
                  href="https://www.linkedin.com/company/growxlabs-tech/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#6B7280] hover:text-[#355CFF] hover:scale-110 transition-all duration-300"
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
                  className="text-[#6B7280] hover:text-[#355CFF] hover:scale-110 transition-all duration-300"
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
                  className="text-[#6B7280] hover:text-[#355CFF] hover:scale-110 transition-all duration-300"
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
                  className="text-[#6B7280] hover:text-[#355CFF] hover:scale-110 transition-all duration-300"
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
            <h4 className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-[0.1em] mb-5">Services</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#6B7280] hover:text-[#1A1A1A] text-[14px] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-[0.1em] mb-5">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#6B7280] hover:text-[#1A1A1A] text-[14px] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-[0.1em] mb-5">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#6B7280] hover:text-[#1A1A1A] text-[14px] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-[0.1em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#6B7280] hover:text-[#1A1A1A] text-[14px] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E5E2DC] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9CA3AF] text-[13px]">
            Copyright 2026 GrowXLabsTech. All rights reserved.
          </p>
          <p className="text-[#9CA3AF] text-[13px]">
            India, USA, UK, Australia, UAE, Canada, Singapore
          </p>
        </div>
      </div>
    </footer>
  );
}
