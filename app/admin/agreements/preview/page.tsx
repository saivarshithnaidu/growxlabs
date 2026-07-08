"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import AgreementContract from "@/components/admin/AgreementContract";
import { Loader2 } from "lucide-react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const subId = searchParams.get("from_onboarding");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!!subId);

  useEffect(() => {
    if (subId) {
      fetch(`/api/admin/onboarding/detail?id=${subId}`)
        .then(res => res.json())
        .then(sub => {
          setData({
            client_name: sub.full_name,
            business_name: sub.business_name,
            email: sub.email,
            phone: sub.phone,
            service_type: sub.plan || "Digital Services",
            project_description: sub.description,
            total_amount: sub.budget?.replace(/[^0-9]/g, '') || "0",
            advance_amount: "0",
            start_date: new Date().toISOString().split('T')[0],
            delivery_date: sub.timeline || ""
          });
          setLoading(false);
        });
    } else {
      setData({
        client_name: "Varshith Engineering",
        business_name: "Varshith Logistics & IT",
        email: "varshith@engineering.com",
        phone: "+91 98765 43210",
        service_type: "Automation Services",
        project_description: "Full-scale warehouse automation with custom Raspberry Pi integration and real-time dashboard tracking.",
        total_amount: 500000,
        advance_amount: 250000,
        start_date: "2026-05-01",
        delivery_date: "2026-06-15"
      });
    }
  }, [subId]);

  if (loading || !data) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8 flex justify-between items-center text-[var(--text-muted)]">
           <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Document Preview Mode</p>
           <p className="text-[10px] font-bold uppercase tracking-widest">Viewing as Admin</p>
        </div>
        <div className="bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-2xl">
          <AgreementContract data={data} />
        </div>
      </div>
    </div>
  );
}

export default function AgreementPreviewPage() {
  return (
    <Suspense fallback={<div className="h-[80vh]" />}>
      <PreviewContent />
    </Suspense>
  );
}
