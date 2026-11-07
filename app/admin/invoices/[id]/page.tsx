"use client";

import { LogoLoader } from "@/components/ui/LogoLoader";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvoiceTemplate from "@/components/admin/InvoiceTemplate";

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
        <LogoLoader size={48} className="text-white" />
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
