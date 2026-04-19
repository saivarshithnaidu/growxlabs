"use client";

import InvoiceTemplate from "@/components/admin/InvoiceTemplate";

export default function InvoicePreviewPage() {
  // Mock data for preview
  const mockData = {
    client_name: "Varshith Engineering",
    business_name: "Varshith Logistics & IT",
    email: "varshith@engineering.com",
    amount: 150000,
    description: "Cloud Architecture Setup & Automation Sprints",
    invoice_id: "INV-2026-8802"
  };

  return <InvoiceTemplate data={mockData} />;
}
