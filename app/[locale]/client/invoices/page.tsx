"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CreditCard, Rocket, CheckCircle2, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { Invoice } from "@/types/lifecycle";
import Script from "next/script";

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await fetch("/api/client/invoices");
    const json = await res.json();
    setInvoices(json || []);
  };

  const handlePayment = async (invoice: Invoice) => {
    setLoading(true);
    // 1. Initialize Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: invoice.amount,
      currency: "USD",
      name: "GrowX Labs",
      description: "Project Advance Payment",
      order_id: invoice.razorpay_order_id,
      handler: function (response: any) {
        // Razorpay success callback
        // The webhook handles the actual update, but we refresh the UI
        window.location.reload();
      },
      prefill: {
        name: "Client Name", // Should come from session
        email: "client@example.com",
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tighter italic">
          Financial Ledger.
        </h1>
        <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed">
          Secure payment orchestration via Razorpay. Track project capitalization 
          and settlements in real-time.
        </p>
      </div>

      <div className="space-y-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="p-10 glass border-white/5 rounded-[2.5rem] bg-white/[0.02]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center space-x-6">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                   <ShieldCheck className={invoice.status === 'paid' ? 'text-green-500' : 'text-primary'} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight">Invoice #{invoice.id.slice(0, 8).toUpperCase()}</h3>
                   <div className="flex items-center space-x-3 mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                      <span>Due: {new Date(invoice.due_date || '').toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className={invoice.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}>{invoice.status.toUpperCase()}</span>
                   </div>
                </div>
              </div>

              <div className="text-right w-full md:w-auto">
                <p className="text-3xl font-black text-white mb-4">${invoice.amount}</p>
                {invoice.status !== 'paid' ? (
                   <Button 
                    onClick={() => handlePayment(invoice)}
                    disabled={loading}
                    className="w-full h-14 px-10 rounded-2xl bg-primary text-white font-black hover:bg-neutral-200 transition-all uppercase tracking-tighter"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : "Secure Pay Now"}
                   </Button>
                ) : (
                   <div className="flex items-center text-green-500 font-black text-xs uppercase tracking-widest justify-end">
                      <CheckCircle2 size={16} className="mr-2" /> Fully Paid
                   </div>
                )}
              </div>
            </div>
            
            {invoice.pdf_url && (
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Financial Audit Document Ready</p>
                 <a href={invoice.pdf_url} className="text-white/40 hover:text-white transition-all text-xs font-bold flex items-center">
                    View PDF <ExternalLink size={14} className="ml-2" />
                 </a>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
