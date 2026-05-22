"use client";

import React, { useState } from 'react';
import { Printer, ShieldCheck, Mail, CheckCircle2, Pencil, Eye, Plus, Trash2 } from 'lucide-react';

interface InvoiceProps {
  data?: {
    client_name?: string;
    business_name?: string;
    email?: string;
    amount?: number;
    description?: string;
    invoice_id?: string;
    address?: string;
  };
}

interface LineItem {
  id: number;
  desc: string;
  qty: number;
  rate: number;
}

const EditField = ({ isEditing, value, onChange, placeholder, className, type = "text" }: {
  isEditing: boolean;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) => {
  if (!isEditing) {
    return <span className={`${className} text-[#000] font-bold`}>{value || placeholder || "—"}</span>;
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className} bg-[#e8f8f5] border-b-2 border-[#00b894] outline-none px-1 rounded text-[#000] font-bold`}
      style={{ minWidth: type === "number" ? 60 : 80, color: "#000" }}
    />
  );
};

export default function InvoiceTemplate({ data = {} }: InvoiceProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, desc: data.description || "Digital Services", qty: 1, rate: data.amount || 0 },
  ]);

  const [metadata, setMetadata] = useState({
    invoiceNo: data.invoice_id || `GX-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    clientName: data.client_name || "",
    businessName: data.business_name || "",
    clientEmail: data.email || "",
    clientAddress: data.address || "",
    advancePaid: 0
  });

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const totalPayable = subtotal;
  const balanceDue = totalPayable - metadata.advancePaid;

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: field === 'desc' ? value : Number(value) || 0 } : item
    ));
  };

  const addItem = () => {
    const maxId = Math.max(...items.map(i => i.id), 0);
    setItems(prev => [...prev, { id: maxId + 1, desc: "", qty: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateMeta = (field: string, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-12 px-4 print:bg-white print:py-0 print:px-0" style={{ fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif' }}>
      {/* TOOLBAR */}
      <div className="max-w-[900px] mx-auto mb-8 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 text-[#666]">
           <ShieldCheck className="text-[#00b894] h-5 w-5" />
           <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Invoice Management Console</span>
        </div>
        <div className="flex gap-3">
           <button
             onClick={() => setIsEditing(!isEditing)}
             className={`flex items-center gap-2 px-6 py-3 rounded font-bold transition-all active:scale-95 text-xs ${
               isEditing
                 ? 'bg-[#00b894] text-white'
                 : 'bg-white border border-[#ccc] text-[#222] hover:bg-neutral-50'
             }`}
           >
             {isEditing ? <><Eye size={14} /> Preview</> : <><Pencil size={14} /> Edit Invoice</>}
           </button>
           <button 
             onClick={handlePrint}
             className="flex items-center gap-2 bg-[#222] text-white px-6 py-3 rounded font-bold transition-all active:scale-95 text-xs"
           >
             <Printer size={14} /> Export / Print
           </button>
        </div>
      </div>

      {/* DOCUMENT CONTAINER */}
      <div className="max-w-[900px] mx-auto bg-white shadow-2xl print:shadow-none min-h-[1100px] flex flex-col border border-[#ddd] print:border-none p-10 md:p-20 text-[#000] text-[14px] leading-[1.7]">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-[#00b894] pb-8 mb-12">
           <div className="text-left">
              <h1 className="text-[36px] font-black text-[#00b894] tracking-tight m-0 leading-none">GrowXLabs<span className="text-[#222]">Tech</span></h1>
              <p className="text-[12px] text-[#666] mt-2 m-0 font-medium tracking-wide uppercase">AI-Native Digital Systems Engineering</p>
           </div>
           <div className="text-right space-y-1">
              <p className="text-[11px] font-bold text-[#222]">billing@growxlabs.tech</p>
              <p className="text-[11px] font-medium text-[#666]">growxlabs.tech</p>
           </div>
        </div>

        <div className="mb-12">
           <div className="text-[22px] font-black text-[#000] mb-2 uppercase tracking-[2px]">TAX INVOICE</div>
           <div className="text-[14px] text-[#555] font-bold uppercase tracking-widest">Reference # {metadata.invoiceNo}</div>
        </div>

        {/* ADDRESS MATRIX */}
        <div className="grid grid-cols-2 gap-x-20 mb-12">
           <div className="space-y-4">
              <h3 className="text-[16px] text-[#00b894] border-l-[6px] border-[#00b894] pl-[15px] uppercase font-black tracking-[1px] m-0">Billed From</h3>
              <div className="space-y-1 text-[#000] font-bold">
                 <p className="text-[15px]">GrowXLabsTech Engineering</p>
                 <p>Guntur, Andhra Pradesh, India</p>
                 <p>Email: billing@growxlabs.tech</p>
                 <p className="text-[11px] text-[#666] mt-2 font-normal uppercase tracking-widest">UDYAM: UDYAM-AP-22-0063260</p>
              </div>
           </div>
           <div className="space-y-4">
              <h3 className="text-[16px] text-[#00b894] border-l-[6px] border-[#00b894] pl-[15px] uppercase font-black tracking-[1px] m-0">Billed To</h3>
              <div className="space-y-1 text-[#000] font-bold">
                 <p className="text-[15px]">
                    <EditField isEditing={isEditing} value={metadata.businessName} onChange={(v) => updateMeta('businessName', v)} placeholder="Business Name" />
                 </p>
                 <p>
                    <EditField isEditing={isEditing} value={metadata.clientName} onChange={(v) => updateMeta('clientName', v)} placeholder="Contact Name" />
                 </p>
                 <p>
                    <EditField isEditing={isEditing} value={metadata.clientAddress} onChange={(v) => updateMeta('clientAddress', v)} placeholder="Address" />
                 </p>
                 <p className="text-[#00b894]">
                    <EditField isEditing={isEditing} value={metadata.clientEmail} onChange={(v) => updateMeta('clientEmail', v)} placeholder="Email" />
                 </p>
              </div>
           </div>
        </div>

        {/* INVOICE DETAILS */}
        <div className="grid grid-cols-2 gap-10 bg-[#f9f9f9] p-8 mb-12 border-2 border-[#eee] rounded-xl">
           <div>
              <p className="text-[12px] text-[#666] uppercase font-black m-0 tracking-widest">Invoice Date</p>
              <p className="text-[15px] font-black text-[#000] m-0">{metadata.date}</p>
           </div>
           <div className="text-right">
              <p className="text-[12px] text-red-500 uppercase font-black m-0 tracking-widest">Due Date</p>
              <p className="text-[15px] font-black text-[#000] m-0">{metadata.dueDate}</p>
           </div>
        </div>

        {/* LINE ITEMS */}
        <div className="mb-12">
           <table className="w-full border-collapse border-2 border-[#eee] rounded-lg overflow-hidden">
              <thead>
                 <tr className="bg-[#00b894] text-white">
                    <th className="p-4 text-left text-[13px] font-black border-r border-white/20 w-12 uppercase">No</th>
                    <th className="p-4 text-left text-[13px] font-black border-r border-white/20 uppercase">Description</th>
                    <th className="p-4 text-center text-[13px] font-black border-r border-white/20 w-24 uppercase">Qty</th>
                    <th className="p-4 text-right text-[13px] font-black border-r border-white/20 w-36 uppercase">Rate (₹)</th>
                    <th className="p-4 text-right text-[13px] font-black w-36 uppercase">Total (₹)</th>
                 </tr>
              </thead>
              <tbody className="text-[13px] text-[#000] font-bold">
                 {items.map((item, i) => (
                    <tr key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'} border-b-2 border-[#eee]`}>
                       <td className="p-4 border-r-2 border-[#eee] text-[#666]">0{i+1}</td>
                       <td className="p-4 border-r-2 border-[#eee]">
                          <input 
                            value={item.desc}
                            onChange={(e) => updateItem(item.id, 'desc', e.target.value)}
                            placeholder="Service description..."
                            className={`bg-transparent w-full focus:outline-none font-bold text-[#000] ${isEditing ? 'bg-[#e8f8f5] rounded px-1' : ''}`}
                            readOnly={!isEditing}
                          />
                       </td>
                       <td className="p-4 border-r-2 border-[#eee] text-center">
                          <input 
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                            className={`bg-transparent w-full text-center focus:outline-none font-bold text-[#000] ${isEditing ? 'bg-[#e8f8f5] rounded' : ''}`}
                            readOnly={!isEditing}
                          />
                       </td>
                       <td className="p-4 border-r-2 border-[#eee] text-right">
                          <input 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                            className={`bg-transparent w-full text-right focus:outline-none font-bold text-[#000] ${isEditing ? 'bg-[#e8f8f5] rounded' : ''}`}
                            readOnly={!isEditing}
                          />
                       </td>
                       <td className="p-4 text-right font-black text-[14px]">{(item.qty * item.rate).toLocaleString()}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {isEditing && (
             <button onClick={addItem} className="mt-4 flex items-center gap-1 text-[#00b894] text-[12px] font-black uppercase tracking-widest print:hidden">
               <Plus size={14} /> Add Line Item
             </button>
           )}
        </div>

        {/* SUMMARY */}
        <div className="flex justify-end mb-12">
           <div className="w-80 space-y-3 bg-[#f9f9f9] p-6 rounded-xl border-2 border-[#eee]">
              <div className="flex justify-between text-[14px] text-[#000] font-bold">
                 <span>Subtotal</span>
                 <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] text-[#00b894] font-black">
                 <span>Tax (0% GST)</span>
                 <span>+ ₹0.00</span>
              </div>
              <div className="flex justify-between text-[14px] border-b-2 border-[#ddd] pb-3 text-[#000] font-bold">
                 <span>Advance Paid</span>
                 <span className="text-red-500">
                    - ₹{isEditing ? (
                      <input
                        type="number"
                        value={metadata.advancePaid}
                        onChange={(e) => updateMeta('advancePaid', Number(e.target.value) || 0)}
                        className="bg-[#e8f8f5] text-right w-24 outline-none rounded font-black"
                      />
                    ) : metadata.advancePaid.toLocaleString()}
                 </span>
              </div>
              <div className="flex justify-between text-[22px] font-black pt-2 text-[#000]">
                 <span>Balance Due</span>
                 <span className="underline decoration-[#00b894] decoration-4 underline-offset-4">₹{balanceDue.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* NOTES & SIGNATURE */}
        <div className="grid grid-cols-2 gap-20 mt-auto pt-10 border-t-2 border-[#eee]">
           <div className="space-y-4">
              <h5 className="text-[13px] font-black uppercase tracking-widest text-[#00b894] m-0">Payment Protocol</h5>
              <div className="text-[12px] text-[#000] leading-relaxed font-bold italic space-y-1">
                 <p>Bank Transfer: HDFC Bank | growxlabs@hdfc</p>
                 <p>UPI: growxlabs@ybl</p>
                 <p>Note: Digital receipt is issued instantly upon confirmation.</p>
              </div>
           </div>
           <div className="text-right flex flex-col items-end">
              <div className="w-56 border-b-4 border-[#333] mb-2 flex items-center justify-center">
                 {/* Space for stamp/signature */}
                 <div className="h-16 flex items-center justify-center text-[10px] text-neutral-300 font-bold uppercase tracking-[4px]">Verified</div>
              </div>
              <p className="text-[13px] font-black text-[#000] uppercase m-0">Authorized Signatory</p>
              <p className="text-[11px] text-[#666] font-bold m-0 tracking-widest uppercase">GrowXLabsTech Engineering</p>
           </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t border-[#eee] text-center text-[12px] text-[#aaa] font-bold">
           GrowXLabsTech | growxlabs.tech | hello@growxlabs.tech | © 2025 GrowXLabsTech. All rights reserved.
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1cm; size: A4; }
          .shadow-2xl { box-shadow: none !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
          input, textarea { border: none !important; background: none !important; color: #000 !important; font-weight: bold !important; }
          .bg-[#00b894] { background-color: #00b894 !important; }
          .text-[#00b894] { color: #00b894 !important; }
          .bg-[#e8f8f5] { background-color: #e8f8f5 !important; }
        }
      ` }} />
    </div>
  );
}
