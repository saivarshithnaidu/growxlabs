"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus } from "lucide-react";
import { Badge, Button, CurrencyAmount, DataTable, DataTableColumn } from "@/src/components/ui";
import { EmptyState, ListPage } from "@/src/components/patterns";
import { QuoteGenerator } from "@/components/admin/QuoteGenerator";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

const columns: DataTableColumn<any>[] = [
  { id: "account", header: "Account", sortValue: (q) => q.company?.name || "", cell: (q) => <span className="ds-t-body-strong text-[var(--text-primary)]">{q.company?.name || "N/A"}</span> },
  { id: "deal", header: "Related deal", sortValue: (q) => q.deal?.name || "", cell: (q) => q.deal?.name || "No linked deal" },
  { id: "status", header: "Status", sortValue: (q) => q.status, cell: (q) => <Badge variant="info">{q.status}</Badge> },
  { id: "tax_amount", header: "Tax (GST)", numeric: true, sortValue: (q) => Number(q.tax_amount || 0), cell: (q) => <CurrencyAmount value={q.tax_amount || 0} /> },
  { id: "discount_amount", header: "Discount", numeric: true, sortValue: (q) => Number(q.discount_amount || 0), cell: (q) => <CurrencyAmount value={-Number(q.discount_amount || 0)} signed /> },
  { id: "grand_total", header: "Total price", numeric: true, sortValue: (q) => Number(q.grand_total || 0), cell: (q) => <CurrencyAmount value={q.grand_total || 0} className="ds-t-body-strong text-[var(--text-primary)]" /> },
];

export default function QuotationsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    fetchQuotationsData();
  }, []);

  const fetchQuotationsData = async () => {
    try {
      setLoading(true);
      const [qRes, pRes, dRes, cRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/products"),
        fetch("/api/deals"),
        fetch("/api/companies")
      ]);

      const qData = await qRes.json();
      const pData = await pRes.json();
      const dData = await dRes.json();
      const cData = await cRes.json();

      setQuotations(qData.quotations || []);
      setProducts(pData.products || []);
      setDeals(dData.deals || []);
      setCompanies(cData.companies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuotation = async (formData: any) => {
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowCreator(false);
        fetchQuotationsData();
      } else {
        throw new Error("Failed to create quotation");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  if (showCreator) {
    return (
      <QuoteGenerator
        products={products}
        deals={deals}
        companies={companies}
        onGenerate={handleGenerateQuotation}
        header={{ breadcrumb }}
        onCancel={() => setShowCreator(false)}
      />
    );
  }

  const createAction = <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={() => setShowCreator(true)}>Create quotation</Button>;

  return (
    <ListPage
      header={{
        title: "Quotations & Estimates",
        breadcrumb,
        info: "Create price estimates, manage discounts & GST tax line items.",
        actions: createAction,
      }}
    >
      <DataTable
        label="Quotations"
        columns={columns}
        rows={quotations}
        getRowId={(q) => q.id}
        loading={loading}
        emptyState={<EmptyState icon={<FileText size={24} strokeWidth={1.5} />} title="No quotations found" description="Generate your first quotation to estimate deals for your accounts." action={createAction} />}
      />
    </ListPage>
  );
}
