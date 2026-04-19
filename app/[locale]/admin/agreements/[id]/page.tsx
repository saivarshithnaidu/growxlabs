"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AgreementContract from "@/components/admin/AgreementContract";
import { Loader2 } from "lucide-react";

export default function AgreementDetailPage() {
  const { id } = useParams();
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAgreement();
  }, [id]);

  const fetchAgreement = async () => {
    try {
      const res = await fetch(`/api/agreements/detail?id=${id}`);
      const data = await res.json();
      setAgreement(data);
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

  if (!agreement) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-white/40">
        Agreement not found.
      </div>
    );
  }

  return (
    <AgreementContract 
      data={{
        client_name: agreement.clients?.name,
        business_name: agreement.clients?.business_name,
        service_type: agreement.service_type,
        total_amount: agreement.total_amount,
        advance_amount: agreement.advance_amount,
        start_date: agreement.start_date,
        delivery_date: agreement.delivery_date,
        invoice_no: agreement.id.slice(0, 8).toUpperCase()
      }} 
    />
  );
}
