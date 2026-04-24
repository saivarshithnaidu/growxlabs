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
      <div className="h-screen flex items-center justify-center bg-neutral-900">
        <Loader2 className="animate-spin text-[#00b894]" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 min-h-screen py-12">
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="mb-8 flex justify-between items-center text-white/40">
           <p className="text-xs font-bold uppercase tracking-widest">Document Preview Mode</p>
           <p className="text-[10px] italic">Viewing as Admin</p>
        </div>
        <AgreementContract data={data} />
      </div>
    </div>
  );
}

export default function AgreementPreviewPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-neutral-900" />}>
      <PreviewContent />
    </Suspense>
  );
}
