"use client";

import React, { useState } from "react";
import { 
  Building2, Users, CreditCard, FileText, 
  MapPin, Phone, Mail, Award, CheckSquare, Plus, DollarSign, Calendar
} from "lucide-react";
import { ActivityTimeline } from "./ActivityTimeline";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  gst?: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  employees_count?: number;
  annual_revenue?: number;
  status?: string;
  notes?: string;
  owner?: { name: string };
  contacts?: any[];
  deals?: any[];
  documents?: any[];
}

interface Customer360Props {
  company: Company;
  timelineActivities: any[];
  onAddContact?: () => void;
  onAddDeal?: () => void;
}

export function Customer360({ company, timelineActivities, onAddContact, onAddDeal }: Customer360Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "deals" | "timeline" | "documents">("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "deals", label: "Deals", icon: DollarSign },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "documents", label: "Documents", icon: FileText }
  ] as const;

  const totalDealsValue = company.deals?.reduce((acc, curr) => acc + Number(curr.value || 0), 0) || 0;
  const activeDealsCount = company.deals?.filter(d => d.status !== "WON" && d.status !== "LOST").length || 0;

  return (
    <div className="space-y-6">
      {/* 360 Header Profile */}
      <div className="bg-white border border-[#e6e6e6] rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-[#0075de]/5 border border-[#0075de]/10 text-[#0075de] rounded-lg flex items-center justify-center">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-none mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider text-[#a39e98]">
              <span>{company.industry || "General Industry"}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span>{company.city || "Unknown City"}, {company.country || "Global"}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className={cn(
                "px-2 py-0.5 rounded border text-[9px] lowercase font-bold tracking-tight",
                company.status === "active" ? "bg-green-500/10 text-green-600 border-green-200" : "bg-neutral-100 text-neutral-500 border-neutral-300"
              )}>
                {company.status || "prospect"}
              </span>
            </div>
          </div>
        </div>

        {/* Vital KPI Badges */}
        <div className="flex flex-wrap gap-4 border-l md:border-l border-t md:border-t-0 border-[#e6e6e6] pt-4 md:pt-0 pl-0 md:pl-6">
          <div className="text-left">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-1">Total Pipeline</p>
            <h4 className="text-base font-black text-neutral-900 leading-none">₹{totalDealsValue.toLocaleString()}</h4>
          </div>
          <div className="text-left min-w-28">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-1">Active Deals</p>
            <h4 className="text-base font-black text-neutral-900 leading-none">{activeDealsCount}</h4>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-[#e6e6e6] gap-5 pb-0.5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-3.5 text-xs font-bold uppercase tracking-wider bg-transparent outline-none transition-colors border-b-2 cursor-pointer relative",
                isActive 
                  ? "border-[#0075de] text-[#0075de]" 
                  : "border-transparent text-neutral-400 hover:text-neutral-950"
              )}
            >
              <TabIcon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Account Profile</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-medium">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Website</span>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[#0075de] hover:underline font-mono">
                    {company.website || "Not configured"}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Account Owner</span>
                  <span className="text-neutral-900">{company.owner?.name || "Unassigned"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">GST Identification</span>
                  <span className="text-neutral-900 font-mono">{company.gst || "Not set"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">PAN Number</span>
                  <span className="text-neutral-900 font-mono">{company.pan || "Not set"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Address Details</span>
                  <span className="text-neutral-900 flex items-center gap-1">
                    <MapPin size={12} className="text-neutral-400" />
                    {company.address ? `${company.address}, ${company.city}, ${company.state}, ${company.country}` : "No address logged"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">AI Lead Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Employees Volume</span>
                  <span className="text-xs font-bold text-neutral-900">{company.employees_count || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Estimated Annual Revenue</span>
                  <span className="text-xs font-bold text-neutral-900">₹{company.annual_revenue?.toLocaleString() || "0"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Internal Notes Summary</span>
                  <p className="text-xs text-neutral-500 leading-relaxed font-sans mt-1 bg-[#f6f5f4] p-3 rounded border border-[#e6e6e6]/60 whitespace-pre-wrap">
                    {company.notes || "No summary logged."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "contacts" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-3 mb-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Key Contacts</h3>
              {onAddContact && (
                <Button onClick={onAddContact} className="h-8 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 rounded-md">
                  <Plus size={12} className="mr-1" /> Add Contact
                </Button>
              )}
            </div>
            
            {!company.contacts || company.contacts.length === 0 ? (
              <div className="text-center py-12 text-xs font-medium text-neutral-400">No contacts assigned to this company.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e6e6e6] text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      <th className="py-2.5 pl-2">Name</th>
                      <th className="py-2.5">Job Title</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Phone</th>
                      <th className="py-2.5 pr-2 text-right">Decision Maker</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.contacts.map((c) => (
                      <tr key={c.id} className="border-b border-[#e6e6e6]/60 hover:bg-[#f6f5f4]/30 font-medium">
                        <td className="py-3 pl-2 font-bold text-neutral-900">{c.first_name} {c.last_name}</td>
                        <td className="py-3 text-neutral-600">{c.job_title || "General Staff"}</td>
                        <td className="py-3 text-[#0075de] font-mono">{c.email}</td>
                        <td className="py-3 text-neutral-600">{c.phone || "Not set"}</td>
                        <td className="py-3 pr-2 text-right">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                            c.is_decision_maker ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                          )}>
                            {c.is_decision_maker ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {activeTab === "deals" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-3 mb-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Active Deals</h3>
              {onAddDeal && (
                <Button onClick={onAddDeal} className="h-8 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-[#0075de] hover:bg-neutral-50 rounded-md">
                  <Plus size={12} className="mr-1" /> New Deal
                </Button>
              )}
            </div>

            {!company.deals || company.deals.length === 0 ? (
              <div className="text-center py-12 text-xs font-medium text-neutral-400">No deals associated with this account.</div>
            ) : (
              <div className="space-y-3">
                {company.deals.map((d) => (
                  <div key={d.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center justify-between hover:border-[#0075de]/30 transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">{d.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Stage: {d.stage?.name || "new stage"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-neutral-900 block">₹{Number(d.value).toLocaleString()}</span>
                      <span className="text-[9px] font-mono text-neutral-400">{d.expected_close_date || "No expected close"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === "timeline" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-6">Interaction Timeline</h3>
            <ActivityTimeline activities={timelineActivities} />
          </Card>
        )}

        {activeTab === "documents" && (
          <Card className="p-6 border border-[#e6e6e6] bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-3 mb-4">Account Documents</h3>
            {!company.documents || company.documents.length === 0 ? (
              <div className="text-center py-12 text-xs font-medium text-neutral-400">No documents uploaded for this company.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {company.documents.map((doc) => (
                  <div key={doc.id} className="border border-[#e6e6e6] p-4 rounded-md flex items-center gap-3.5 hover:border-[#0075de]/30 transition-all cursor-pointer">
                    <div className="h-10 w-10 bg-neutral-50 rounded border border-[#e6e6e6] flex items-center justify-center text-neutral-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-snug">{doc.title}</h4>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mt-1">Version {doc.version} • {doc.file_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
