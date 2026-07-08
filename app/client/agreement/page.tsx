"use client";

import { useEffect, useState } from "react";
import AgreementContract from "@/components/admin/AgreementContract";
import { Loader2 } from "lucide-react";

export default function ClientAgreementPage() {
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    fetchAgreement();
  }, []);

  const fetchAgreement = async () => {
    try {
      const res = await fetch("/api/client/portal-data"); // Assuming portal-data contains agreement
      const data = await res.json();
      // Adjust fetching based on actual portal structure
      const agreementData = data.agreements?.[0]; // Assuming first agreement for now
      setAgreement(agreementData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (party: "admin" | "client", signature: string | null) => {
    setSigning(true);
    try {
      await fetch(`/api/agreements/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementId: agreement.id,
          party,
          signature
        })
      });
      fetchAgreement();
    } catch (e) {
      console.error(e);
    } finally {
      setSigning(false);
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
        No active agreement found for your account.
      </div>
    );
  }

  return (
    <div className="pt-24">
      <AgreementContract 
        role="client"
        onSign={handleSign}
        initialSignatures={{
          admin: agreement.admin_signature,
          client: agreement.client_signature
        }}
        data={{
          client_name: agreement.users?.name,
          business_name: agreement.users?.business_name,
          email: agreement.users?.email,
          phone: agreement.users?.phone,
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
