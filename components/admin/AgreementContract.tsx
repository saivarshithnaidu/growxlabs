"use client";

import React, { useState } from 'react';
import { Check, Mail, Phone, MapPin, Globe, Printer, ShieldCheck, Pencil, Eye, Save } from 'lucide-react';
import SignaturePad from '@/components/shared/SignaturePad';

interface AgreementProps {
  data?: {
    client_name?: string;
    business_name?: string;
    email?: string;
    phone?: string;
    service_type?: string;
    project_description?: string;
    total_amount?: string | number;
    advance_amount?: string | number;
    start_date?: string;
    delivery_date?: string;
    invoice_no?: string;
  };
  role?: "admin" | "client" | "view";
  initialSignatures?: { client?: string | null, admin?: string | null };
  onSign?: (party: "admin" | "client", signatureDataUrl: string | null) => void;
}

// Editable field wrapper moved OUTSIDE to prevent re-renders losing focus
const EditableText = ({ isEditing, value, onChange, placeholder, className, type = "text" }: {
  isEditing: boolean;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) => {
  if (!isEditing) {
    return <span className={className}>{value || placeholder || "—"}</span>;
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className} bg-yellow-50/80 border-b-2 border-[#00A86B] outline-none px-1 rounded transition-colors text-neutral-900`}
      style={{ minWidth: type === "date" ? 140 : 80, width: "auto", color: "inherit" }}
    />
  );
};

export default function AgreementContract({ data = {}, role = "admin", initialSignatures = {}, onSign }: AgreementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminSig, setAdminSig] = useState<string | null>(initialSignatures.admin || null);
  const [clientSig, setClientSig] = useState<string | null>(initialSignatures.client || null);
  const safeData = data || {};
  const [formData, setFormData] = useState({
    invoiceNumber: safeData.invoice_no || `GX-${new Date().getFullYear()}-001`,
    date: new Date().toLocaleDateString(),
    clientName: safeData.client_name || "",
    businessName: safeData.business_name || "",
    clientEmail: safeData.email || "",
    clientPhone: safeData.phone || "",
    projectName: safeData.service_type || "Digital Transformation Project",
    projectDescription: safeData.project_description || "",
    totalValue: safeData.total_amount || "0",
    advanceAmount: safeData.advance_amount || "0",
    startDate: safeData.start_date || "",
    deliveryDate: safeData.delivery_date || "",
    scope: [
      safeData.project_description || "",
      "",
      "",
      "",
      ""
    ],
    notIncluded: "Content creation, Third-party licensing fees, SEO beyond basic metadata.",
    serviceTypes: {
      website: true,
      automation: false,
      hosting: false,
      bundle: false
    }
  });

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateScope = (index: number, value: string) => {
    setFormData(prev => {
      const newScope = [...prev.scope];
      newScope[index] = value;
      return { ...prev, scope: newScope };
    });
  };

  const toggleService = (key: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: { ...prev.serviceTypes, [key]: !(prev.serviceTypes as any)[key] }
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 print:bg-white print:py-0 print:px-0">
      {/* Control Panel (Hidden on Print) */}
      <div className="max-w-[850px] mx-auto mb-8 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 text-neutral-500">
           <ShieldCheck className="text-green-600 h-5 w-5" />
           <span className="text-xs font-bold uppercase tracking-widest leading-none">Legal Standard Enforcement</span>
        </div>
        <div className="flex gap-3">
          {role === "admin" && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                isEditing
                  ? 'bg-[#00A86B] text-white hover:bg-[#00A86B]/90'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {isEditing ? <><Eye className="h-4 w-4" /> Preview Mode</> : <><Pencil className="h-4 w-4" /> Edit Details</>}
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#00b894] text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Edit Indicator Banner */}
      {isEditing && (
        <div className="max-w-[850px] mx-auto mb-4 px-4 py-3 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-xl flex items-center gap-3 print:hidden">
          <Pencil className="h-4 w-4 text-[#00A86B]" />
          <p className="text-sm font-medium text-[#00A86B]">
            <strong>Edit Mode Active</strong> — Click any highlighted field to edit. Changes update the document in real-time.
          </p>
        </div>
      )}

      {/* The Agreement Page */}
      <div className="max-w-[850px] mx-auto bg-white shadow-2xl print:shadow-none min-h-[1100px] flex flex-col font-sans border border-neutral-200 print:border-none">
        
        {/* HEADER SECTION */}
        <div className="p-12 pb-0 text-center">
           <h1 className="text-3xl font-black tracking-[0.2em] text-[#00b894] mb-2 uppercase">✕ GROWX LABS</h1>
           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              AI-Native Digital Agency | growxlabs.tech | hello@growxlabs.tech
           </p>
           <div className="h-1 bg-[#00b894] w-full mt-6 opacity-20" />
           
           <div className="mt-8">
              <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Client Service Agreement</h2>
              <p className="text-[10px] font-bold text-neutral-400 mt-2 italic">Please read carefully before signing. This is a legally binding agreement.</p>
           </div>
           
           <div className="flex justify-between mt-10 text-[9px] font-black uppercase tracking-widest text-neutral-400 border-y border-neutral-100 py-4">
              <div className="flex gap-2">
                 <span>Agreement ID:</span>
                 <span className="text-neutral-900 tracking-normal">
                   <EditableText isEditing={isEditing} value={formData.invoiceNumber} onChange={(v) => update('invoiceNumber', v)} className="text-neutral-900" />
                 </span>
              </div>
              <div className="flex gap-2">
                 <span>Issue Date:</span>
                 <span className="text-neutral-900 tracking-normal">{formData.date}</span>
              </div>
           </div>
        </div>

        {/* 1. PARTY DETAILS */}
        <div className="px-12 pt-8">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00b894] flex items-center gap-3">
              <span className="bg-[#00b894] text-white px-2 py-0.5 rounded leading-none">1</span>
              Party Details
           </h3>
        </div>
        <div className="grid grid-cols-2 min-h-[176px] border-b border-neutral-100">
           <div className="p-10 border-r border-neutral-100 flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B] mb-4">From: Service Provider</span>
              <h3 className="font-bold text-lg text-[#0D1B4B]">GrowX Labs</h3>
              <div className="mt-2 space-y-1 text-xs text-neutral-500 font-medium leading-tight">
                 <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> hello@growxlabs.tech</p>
                 <p className="flex items-center gap-2"><Globe className="h-3 w-3" /> growxlabs.tech</p>
                 <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Guntur, AP, India</p>
              </div>
           </div>
           <div className="p-10 flex flex-col justify-center bg-neutral-50/50">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B] mb-4 text-right">To: Client Party</span>
              <h3 className="font-bold text-lg text-[#0D1B4B] text-right">
                <EditableText isEditing={isEditing} value={formData.businessName} onChange={(v) => update('businessName', v)} placeholder="Client Business Name" className="font-bold text-lg text-[#0D1B4B]" />
              </h3>
              <div className="mt-2 space-y-1 text-xs text-neutral-500 font-medium text-right leading-tight">
                 <p className="justify-end flex items-center gap-2">
                   <EditableText isEditing={isEditing} value={formData.clientEmail} onChange={(v) => update('clientEmail', v)} placeholder="client@email.com" className="text-neutral-500" />
                   <Mail className="h-3 w-3" />
                 </p>
                 <p className="justify-end flex items-center gap-2">
                   <EditableText isEditing={isEditing} value={formData.clientPhone} onChange={(v) => update('clientPhone', v)} placeholder="+91 XXXXX XXXXX" className="text-neutral-500" />
                   <Phone className="h-3 w-3" />
                 </p>
                 <p className="justify-end flex items-center gap-2 italic">
                   <EditableText isEditing={isEditing} value={formData.clientName} onChange={(v) => update('clientName', v)} placeholder="Authorized Signatory" className="text-neutral-500 italic" />
                   <Check className="h-3 w-3 text-green-600" />
                 </p>
              </div>
           </div>
        </div>

        {/* PROJECT DETAILS BOX */}
        <div className="p-12">
           <div className="mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00b894] flex items-center gap-3">
                 <span className="bg-[#00b894] text-white px-2 py-0.5 rounded leading-none">2</span>
                 Project Specifications
              </h3>
           </div>
           <div className="bg-[#0D1B4B]/[0.02] border border-neutral-100 rounded-3xl p-8 mb-10">
              <div className="grid grid-cols-3 gap-y-10">
                 <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Project Classification</label>
                    <p className="text-xl font-bold text-[#0D1B4B] leading-tight">
                      <EditableText isEditing={isEditing} value={formData.projectName} onChange={(v) => update('projectName', v)} placeholder="Service Type" className="text-xl font-bold text-[#0D1B4B]" />
                    </p>
                 </div>
                 <div className="text-right">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Execution Period</label>
                    <p className="text-sm font-bold text-[#0D1B4B]">
                      <EditableText isEditing={isEditing} value={formData.startDate} onChange={(v) => update('startDate', v)} placeholder="Start Date" type="date" className="text-sm font-bold text-[#0D1B4B]" />
                      {" — "}
                      <EditableText isEditing={isEditing} value={formData.deliveryDate} onChange={(v) => update('deliveryDate', v)} placeholder="End Date" type="date" className="text-sm font-bold text-[#0D1B4B]" />
                    </p>
                 </div>
                 
                 <div className="col-span-3 pt-6 border-t border-dashed border-neutral-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-4">Contracted Services</label>
                    <div className="flex gap-8">
                       {Object.entries(formData.serviceTypes).map(([type, checked]) => (
                         <div key={type} className="flex items-center gap-2.5">
                            <button
                              onClick={() => isEditing && toggleService(type)}
                              className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                checked ? 'bg-[#00A86B] border-[#00A86B]' : 'border-neutral-200'
                              } ${isEditing ? 'cursor-pointer hover:border-[#00A86B]' : ''}`}
                            >
                               {checked && <Check className="text-white h-2.5 w-2.5" strokeWidth={4} />}
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700">{type}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* SCOPE OF WORK */}
           <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-[#0D1B4B] bg-[#00A86B]/10 px-3 py-1 rounded">Scope of Deliverables</h4>
                 <div className="h-px bg-[#00A86B] flex-1 opacity-10" />
              </div>
              <div className="space-y-4">
                 {formData.scope.map((item, i) => (
                   <div key={i} className="flex items-start gap-4">
                      <span className="h-5 w-5 rounded-full bg-[#00A86B] text-white text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                      {isEditing ? (
                        <input
                          value={item}
                          onChange={(e) => updateScope(i, e.target.value)}
                          placeholder={`Deliverable ${i + 1}...`}
                          className="min-h-[2.5rem] border-b border-neutral-100 flex-1 text-sm font-medium text-neutral-900 px-2 bg-yellow-50/80 border-b-2 !border-[#00A86B] outline-none rounded transition-colors"
                        />
                      ) : (
                        <div className="min-h-[2.5rem] border-b border-neutral-100 flex-1 flex items-center text-sm font-medium text-neutral-600 px-2 italic">
                           {item || "—"}
                        </div>
                      )}
                   </div>
                 ))}
                 <div className="pt-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-2 block">Excluded from this agreement</label>
                    {isEditing ? (
                      <textarea
                        value={formData.notIncluded}
                        onChange={(e) => update('notIncluded', e.target.value)}
                        className="w-full p-4 bg-yellow-50/80 border-2 border-[#00A86B] rounded-xl text-[11px] font-medium text-neutral-900 italic leading-relaxed outline-none transition-colors min-h-[60px]"
                      />
                    ) : (
                      <div className="p-4 bg-red-500/[0.03] border border-red-500/10 rounded-xl text-[11px] font-medium text-neutral-500 italic leading-relaxed">
                         {formData.notIncluded}
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* PAYMENT SCHEDULE */}
           <div className="mb-12">
              <div className="mb-6">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00b894] flex items-center gap-3">
                    <span className="bg-[#00b894] text-white px-2 py-0.5 rounded leading-none">3</span>
                    Payment Milestones
                 </h3>
              </div>
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="bg-[#00b894] text-white">
                       <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest">Milestone Breakdown</th>
                       <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest">Allocation</th>
                       <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest">Fee (INR)</th>
                    </tr>
                 </thead>
                 <tbody className="text-xs font-bold text-[#0D1B4B]">
                    <tr className="border-b border-neutral-100">
                       <td className="p-4">Project Kickoff & Resource Allocation (Advance)</td>
                       <td className="p-4 text-right text-neutral-400">50%</td>
                       <td className="p-4 text-right text-[#00A86B] text-base">
                         ₹<EditableText isEditing={isEditing} value={formData.advanceAmount} onChange={(v) => update('advanceAmount', v)} className="text-[#00A86B] text-base font-bold" />
                       </td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                       <td className="p-4">Final Testing & Knowledge Transfer</td>
                       <td className="p-4 text-right text-neutral-400">50%</td>
                       <td className="p-4 text-right text-base">₹{Number(formData.totalValue) - Number(formData.advanceAmount)}</td>
                    </tr>
                    <tr className="bg-neutral-50 border-b-2 border-[#0D1B4B]">
                       <td className="p-4">Total Contract Commitment</td>
                       <td className="p-4 text-right italic font-black text-[#00A86B]">LUMP SUM</td>
                       <td className="p-4 text-right text-xl">
                         ₹<EditableText isEditing={isEditing} value={formData.totalValue} onChange={(v) => update('totalValue', v)} className="text-xl font-bold text-[#0D1B4B]" />
                       </td>
                    </tr>
                    <tr>
                       <td colSpan={3} className="p-4 text-[10px] font-medium text-neutral-400 italic">
                          * Additional revisions beyond the included rounds are billed at ₹2,000/round.
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>

           {/* LEGAL TERMS */}
           <div className="mb-16">
              <div className="mb-8">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-[#00b894] flex items-center gap-3">
                    <span className="bg-[#00b894] text-white px-2 py-0.5 rounded leading-none">4</span>
                    Legal Protocol
                 </h3>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              {[
                { title: "Revision Cycles", desc: "Two rounds of major revisions are included. Substantial scope deviations post-approval will incur supplementary fees." },
                { title: "Intellectual Property", desc: "Global IP rights and source code access transfer to Client only upon complete clearance of all outstanding invoices." },
                 { title: "Client Cooperation", desc: "Client shall provide necessary assets and feedback within 7 business days to maintain the agreed project timeline." },
                 { title: "Confidentiality", desc: "Both parties agree to a 3-year mutual non-disclosure period regarding trade secrets and project specifications." },
                 { title: "Termination", desc: "Either party may terminate with 14 days notice. Work completed until termination date will be payable pro-rata." },
                 { title: "Governance", desc: "This agreement is governed by laws of Guntur, AP, India. All disputes are subject to local jurisdictional courts." }
               ].map((term, i) => (
                 <div key={i} className="relative pl-8">
                    <span className="absolute left-0 top-0 text-[10px] font-black text-[#00A86B] bg-[#00A86B]/10 px-1.5 py-0.5 rounded leading-none italic">{i+1}</span>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0D1B4B] mb-1.5">{term.title}</h5>
                    <p className="text-[10px] leading-relaxed text-neutral-500 font-medium italic">{term.desc}</p>
                 </div>
               ))}
              </div>
           </div>

           {/* SIGNATURE AREA */}
           <div className="grid grid-cols-2 gap-12 pt-12">
              <div className="space-y-4">
                 <SignaturePad 
                   label="Authorized For GrowX Labs" 
                   disabled={role !== "admin"} 
                   initialSignature={adminSig}
                   onSign={(sig) => {
                     setAdminSig(sig);
                     if (onSign) onSign("admin", sig);
                   }}
                 />
                 <div className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest mt-2">Date: {adminSig ? formData.date : "____ / ____ / ________"}</div>
              </div>
              <div className="space-y-4">
                 <SignaturePad 
                   label={`Authorized For ${formData.businessName || "Project Client"}`} 
                   disabled={role !== "client"} 
                   initialSignature={clientSig}
                   onSign={(sig) => {
                     setClientSig(sig);
                     if (onSign) onSign("client", sig);
                   }}
                 />
                 <div className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest mt-2">Date: {clientSig ? formData.date : "____ / ____ / ________"}</div>
              </div>
           </div>
        </div>

        {/* FOOTER BAR */}
        <div className="mt-auto border-t border-neutral-100 p-8 text-center">
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              GrowX Labs | growxlabs.tech | hello@growxlabs.tech | © {new Date().getFullYear()} GrowX Labs. All rights reserved.
           </p>
           <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-neutral-200 mt-3 italic">
              Governed by Indian Contract Act 1872 | Arbitration Locale: Guntur, Andhra Pradesh
           </p>
        </div>
      </div>
      
      {/* Print Specific CSS Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden, [class*="print:hidden"] { display: none !important; }
          @page { margin: 1cm; size: A4; }
          .shadow-2xl { box-shadow: none !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
          .bg-neutral-100 { background: white !important; }
          input, textarea { border: none !important; background: none !important; }
        }
      ` }} />
    </div>
  );
}
