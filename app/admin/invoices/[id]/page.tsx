"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvoiceTemplate from "@/components/admin/InvoiceTemplate";
import { Loader2 } from "lucide-react";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/detail?id=${id}`);
      const data = await res.json();
      setInvoice(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-white/20" size={48} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-white/40">
        Invoice not found.
      </div>
    );
  }

  return (
    <InvoiceTemplate 
      data={{
        client_name: invoice.clients?.name,
        business_name: invoice.clients?.business_name,
        email: invoice.clients?.email,
        amount: invoice.amount,
        description: "Professional Services",
        invoice_id: `INV-2026-${invoice.id.slice(0, 4).toUpperCase()}`
      }} 
    />
  );
}
