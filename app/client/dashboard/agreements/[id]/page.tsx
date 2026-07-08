"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AgreementContract from "@/components/admin/AgreementContract";
import { Loader2 } from "lucide-react";

export default function ClientAgreementDetailPage() {
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

  const handleSign = async (party: "admin" | "client", signature: string | null) => {
    try {
      await fetch(`/api/agreements/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementId: id,
          party,
          signature
        })
      });
      // Optionally refresh data to show signed status
      fetchAgreement();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00A86B]" size={48} />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AgreementContract 
        role="client"
        onSign={handleSign}
        initialSignatures={{
          admin: agreement.admin_signature,
          client: agreement.client_signature
        }}
        data={{
          client_name: agreement.clients?.name,
          business_name: agreement.clients?.business_name,
          email: agreement.clients?.email,
          phone: agreement.clients?.phone,
          service_type: agreement.service_type,
          project_description: agreement.project_description,
          total_amount: agreement.total_amount,
          advance_amount: agreement.advance_amount,
          start_date: agreement.start_date,
          delivery_date: agreement.delivery_date,
          invoice_no: agreement.id.slice(0, 8).toUpperCase()
        }} 
      />
    </div>
  );
}
