"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Search, Tag, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-neutral-950 tracking-tight leading-none">Products Catalog</h1>
          <p className="text-neutral-500 text-xs">Configure products, SKU catalog numbers, tax values, and subscription values.</p>
        </div>
        <Button 
          onClick={() => {
            setNewProduct(prev => ({ ...prev, sku: `SKU-${Date.now().toString().slice(-6)}` }));
            setShowAddModal(true);
          }}
          className="bg-[#0075de] hover:bg-[#0075de]/90 text-white font-bold tracking-widest uppercase text-[10px] px-6 h-10 rounded-md"
        >
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#0075de] h-6 w-6" />
        </div>
      ) : products.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#e6e6e6] rounded-md bg-white text-center p-6">
          <Tag className="w-10 h-10 text-neutral-300 mb-2" />
          <h4 className="text-sm font-bold text-neutral-850">No products configured</h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">Get started by creating your first catalog product.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p.id} className="p-5 border border-[#e6e6e6] bg-white rounded-lg shadow-sm hover:border-[#0075de]/30 hover:shadow-md transition-all">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="h-10 w-10 bg-neutral-50 border border-[#e6e6e6] rounded flex items-center justify-center text-neutral-450 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 leading-snug">{p.name}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 font-mono">{p.sku}</span>
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 leading-relaxed min-h-10">{p.description || "No description provided."}</p>

              <div className="border-t border-[#e6e6e6]/60 pt-3 mt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{p.category}</span>
                <span className="text-neutral-950 font-mono">₹{Number(p.price).toLocaleString()} <span className="text-[10px] text-neutral-400 font-sans font-medium">({p.tax_percentage}% tax)</span></span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-white border border-[#e6e6e6] w-full max-w-md p-6 shadow-xl rounded-lg space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-[#e6e6e6] pb-2.5">Configure Catalog Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Product Name</span>
                  <Input required placeholder="Enterprise Suite License" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">SKU Code (Auto)</span>
                  <Input required readOnly value={newProduct.sku} className="h-9 text-xs font-mono bg-neutral-50 border-[#e6e6e6]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">Base Price (₹)</span>
                    <Input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase text-neutral-400">GST Tax (%)</span>
                    <Input type="number" required value={newProduct.tax_percentage} onChange={e => setNewProduct({ ...newProduct, tax_percentage: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Category</span>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full h-9 bg-white border border-[#e6e6e6] rounded-md px-2.5 text-xs text-neutral-805"
                  >
                    <option value="Services">Services</option>
                    <option value="Software">Software</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase text-neutral-400">Description</span>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Short description details..."
                    className="w-full text-xs bg-white border border-[#e6e6e6] rounded p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-[#e6e6e6] pt-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="h-9 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#e6e6e6] text-neutral-500 hover:bg-neutral-50 rounded-md px-4">Cancel</Button>
                <Button type="submit" className="h-9 text-[10px] font-bold uppercase tracking-widest bg-[#0075de] text-white hover:bg-[#0075de]/90 rounded-md px-4">Save Product</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
