"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag } from "lucide-react";
import { Badge, Button, CurrencyAmount, DataTable, DataTableColumn, Input, Modal, Select, Textarea } from "@/src/components/ui";
import { EmptyState, FormField, ListPage } from "@/src/components/patterns";
import { useAdminBreadcrumb } from "@/lib/admin-nav";

type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  category: string;
  price: number;
  tax_percentage: number;
  status?: string;
};

const CATEGORIES = ["Services", "Software", "Consulting", "Support"].map((c) => ({ value: c, label: c }));

const columns: DataTableColumn<Product>[] = [
  {
    id: "name",
    header: "Product",
    sortValue: (p) => p.name,
    cell: (p) => (
      <span className="flex min-w-0 flex-col">
        <span className="ds-t-body-strong truncate text-[var(--text-primary)]">{p.name}</span>
        <span className="ds-t-meta truncate text-[var(--text-muted)]">{p.description || "No description provided."}</span>
      </span>
    ),
  },
  { id: "sku", header: "SKU", sortValue: (p) => p.sku, cell: (p) => <span className="ds-t-mono text-[var(--text-secondary)]">{p.sku}</span> },
  { id: "category", header: "Category", sortValue: (p) => p.category, cell: (p) => <Badge variant="neutral" noDot>{p.category}</Badge> },
  { id: "price", header: "Price", numeric: true, sortValue: (p) => Number(p.price), cell: (p) => <CurrencyAmount value={p.price} /> },
  { id: "tax_percentage", header: "GST", numeric: true, sortValue: (p) => Number(p.tax_percentage), cell: (p) => `${p.tax_percentage}%` },
];

export default function ProductsPage() {
  const breadcrumb = useAdminBreadcrumb();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    tax_percentage: 18,
    sku: "",
    description: "",
    category: "Services",
    status: "active"
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: "",
          price: 0,
          tax_percentage: 18,
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          description: "",
          category: "Services",
          status: "active"
        });
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAdd = () => {
    setNewProduct(prev => ({ ...prev, sku: `SKU-${Date.now().toString().slice(-6)}` }));
    setShowAddModal(true);
  };

  return (
    <ListPage
      header={{
        title: "Products Catalog",
        breadcrumb,
        info: "Configure products, SKU catalog numbers, tax values, and subscription values.",
        actions: <Button variant="primary" iconLeft={<Plus size={16} strokeWidth={1.5} />} onClick={openAdd}>Add product</Button>,
      }}
    >
      <DataTable
        label="Products"
        columns={columns}
        rows={products}
        getRowId={(p) => p.id}
        loading={loading}
        emptyState={<EmptyState icon={<Tag size={24} strokeWidth={1.5} />} title="No products configured" description="Get started by creating your first catalog product." action={<Button variant="primary" onClick={openAdd}>Add product</Button>} />}
      />

      <Modal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Configure catalog product"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" form="product-form" variant="primary">Save product</Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleCreateProduct} className="flex flex-col gap-4">
          <FormField label="Product name" required>
            {(f) => <Input {...f} required placeholder="Enterprise Suite License" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />}
          </FormField>
          <FormField label="SKU code" hint="Generated automatically.">
            {(f) => <Input {...f} required readOnly value={newProduct.sku} />}
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Base price (₹)" required>
              {(f) => <Input {...f} type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />}
            </FormField>
            <FormField label="GST tax (%)" required>
              {(f) => <Input {...f} type="number" required value={newProduct.tax_percentage} onChange={e => setNewProduct({ ...newProduct, tax_percentage: Number(e.target.value) })} />}
            </FormField>
          </div>
          <FormField label="Category">
            {(f) => <Select {...f} options={CATEGORIES} value={newProduct.category} onValueChange={(category) => setNewProduct({ ...newProduct, category })} />}
          </FormField>
          <FormField label="Description">
            {(f) => <Textarea {...f} rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Short description details…" />}
          </FormField>
        </form>
      </Modal>
    </ListPage>
  );
}
