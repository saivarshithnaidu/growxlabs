"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, Info, Search } from 'lucide-react';
import { menuItems } from '@/lib/restaurant-data';
import { useCart } from '@/lib/restaurant-context';
import { Button } from '@/components/ui/Button';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">Our Menu</h1>
        <p className="text-xl text-white/40 max-w-2xl font-light">Explore our curated selection of gourmet dishes, prepared using only the finest ingredients.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-16 border-b border-white/5 pb-10">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search specialties..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card group flex flex-col p-0 overflow-hidden border-white/5"
            >
              <div className="relative h-64 overflow-hidden">
                 <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <span className="text-primary font-black">₹{item.price}</span>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary/60">{item.category}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 leading-none group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed mb-8 line-clamp-2">{item.description}</p>
                
                <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                  <Button 
                    onClick={() => addToCart(item)}
                    className="flex-grow rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all font-black"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
