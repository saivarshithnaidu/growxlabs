"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Plus, MapPin, Mail, Globe, Search } from "lucide-react";
import { Reveal } from "@/components/marketing/Reveal";

const INITIAL_TOOLS = [
  { name: "Apollo.io", type: "Email and contact finder", free: "50 credits/month", bestFor: "Finding business owner emails", link: "https://apollo.io", howTo: "Search by title and city", icon: Mail },
  { name: "Google Maps", type: "Local business finder", free: "Unlimited manual search", bestFor: "Finding local businesses", link: "https://maps.google.com", howTo: "Search 'restaurant [city]'", icon: MapPin },
  { name: "Hunter.io", type: "Email finder", free: "25 searches/month", bestFor: "Finding emails from domain", link: "https://hunter.io", icon: Mail },
  { name: "LinkedIn Sales Nav", type: "B2B lead finder", free: "Trial available", bestFor: "Finding decision makers", link: "https://linkedin.com/sales", icon: Globe },
  { name: "JustDial", type: "Indian business directory", free: "Unlimited", bestFor: "Local Indian businesses", link: "https://justdial.com", howTo: "Search by category and city", icon: Globe },
  { name: "Lusha", type: "Contact data enrichment", free: "5 credits/month", bestFor: "Finding mobile numbers", link: "https://lusha.com", icon: Search },
  { name: "Apify", type: "Automated web scraping", free: "$5 credit", bestFor: "Bulk Google Maps scraping", link: "https://apify.com", icon: Globe },
  { name: "IndiaMART", type: "Indian B2B marketplace", free: "Unlimited browsing", bestFor: "Manufacturing and trade leads", link: "https://indiamart.com", icon: Globe },
  { name: "Sulekha", type: "Indian service directory", free: "Unlimited", bestFor: "Salons, clinics, services", link: "https://sulekha.com", icon: Globe },
  { name: "Skrapp.io", type: "LinkedIn email finder", free: "100 emails/month", bestFor: "LinkedIn profile email extraction", link: "https://skrapp.io", icon: Mail },
  { name: "Snov.io", type: "Email finder and verifier", free: "50 credits/month", bestFor: "Email verification before sending", link: "https://snov.io", icon: Mail },
  { name: "D7 Lead Finder", type: "Automated lead database", free: "Trial", bestFor: "Bulk local business leads", link: "https://d7leadfinder.com", icon: Search },
];

export default function LeadSourcesPage() {
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-12">
      <Reveal y={-20}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Lead Sources & Tools</h1>
            <p className="text-[var(--text-secondary)] text-sm">Reference guide for agents to find and extract leads.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-white text-black hover:bg-gray-200 font-bold tracking-widest uppercase text-[10px] h-10 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Custom Tool
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <Reveal key={idx} delay={idx * 0.05}>
              <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] p-6 rounded-2xl flex flex-col h-full group hover:border-[var(--border-hover)] transition-colors relative">
                <div className="flex items-start justify-between mb-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] transition-colors shadow-inner">
                         <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-white tracking-tight mb-1">{tool.name}</h3>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-primary">{tool.type}</p>
                      </div>
                   </div>
                   <a href={tool.link} target="_blank" rel="noreferrer" className="p-2 bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)] hover:text-white transition-colors border border-[var(--border-subtle)] hover:border-white/20">
                      <ExternalLink className="w-4 h-4" />
                   </a>
                </div>
                
                <div className="space-y-3 flex-1 text-sm mt-2">
                   <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Free Tier</span>
                      <span className="text-green-400 font-medium text-[10px] uppercase tracking-widest">{tool.free}</span>
                   </div>
                   <div className="flex flex-col gap-1 pb-2 border-b border-[var(--border-subtle)]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Best For</span>
                      <span className="text-[var(--text-secondary)]">{tool.bestFor}</span>
                   </div>
                   {tool.howTo && (
                      <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">How To Use</span>
                         <span className="text-[var(--text-secondary)]">{tool.howTo}</span>
                      </div>
                   )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">Add Custom Tool</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Add a new lead generation source to the library.</p>
            <form className="space-y-5">
              <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Tool Name</label><input type="text" className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Category/Type</label><input type="text" className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Website URL</label><input type="text" className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Free Tier Details</label><input type="text" className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">How to use (optional)</label><input type="text" className="w-full bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--border-hover)] transition-colors text-sm" /></div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-[var(--border-subtle)] mt-8">
                 <Button type="button" onClick={() => setShowAddModal(false)} variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white">Cancel</Button>
                 <Button type="button" className="bg-white text-black hover:bg-gray-200 text-[10px] font-bold uppercase tracking-widest h-10 px-6">Save Tool</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
