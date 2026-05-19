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
    ],
    resources: [
      { name: "Client Portal", href: "/client/dashboard" },
      { name: "Project Handover", href: "/handover" },
      { name: "Pricing", href: "/pricing" },
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
              <a href="tel:+918185958336" className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
                <Phone size={13} className="text-[#355CFF]" aria-hidden="true" /> +91 81859 58336
              </a>
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
