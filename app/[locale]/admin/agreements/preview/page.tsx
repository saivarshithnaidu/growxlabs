"use client";

import AgreementContract from "@/components/admin/AgreementContract";

export default function AgreementPreviewPage() {
  // Mock data for preview
  const mockData = {
    client_name: "Varshith Engineering",
    business_name: "Varshith Logistics & IT",
    email: "varshith@engineering.com",
    phone: "+91 98765 43210",
    service_type: "Automation Services",
    project_description: "Full-scale warehouse automation with custom Raspberry Pi integration and real-time dashboard tracking.",
    total_value: 500000,
    advance: 250000,
    start_date: "2026-05-01",
    delivery_date: "2026-06-15"
  };

  return <AgreementContract data={mockData} />;
}
