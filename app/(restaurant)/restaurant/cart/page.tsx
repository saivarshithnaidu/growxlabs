"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from '@/navigation';
import { useCart } from '@/lib/restaurant-context';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-black text-white mb-4">Your cart is empty</h2>
        <Link href="/restaurant/menu">
          <Button size="lg" className="rounded-full px-12 font-black bg-primary">Explore Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-5xl font-black text-white mb-16 tracking-tighter">Your Selection</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
           {cart.map(item => (
             <div key={item.id} className="glass-card flex items-center gap-6 p-6">
                <img src={item.image} className="w-24 h-24 rounded-2xl object-cover" />
                <div className="flex-grow">
                   <h3 className="text-xl font-black text-white">{item.name}</h3>
                   <p className="text-primary font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 rounded-xl p-2 border border-white/10">
                  <button onClick={() => updateQuantity(item.id, -1)} className="text-white"><Minus size={16} /></button>
                  <span className="text-white font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="text-white"><Plus size={16} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500"><Trash2 size={20} /></button>
             </div>
           ))}
        </div>
        <div className="lg:col-span-1">
           <div className="glass-card border-primary/20 bg-primary/5 sticky top-32 p-8">
              <h3 className="text-2xl font-black text-white mb-8">Summary</h3>
              <div className="flex justify-between text-white font-black text-xl mb-10">
                 <span>Total</span>
                 <span className="text-primary">₹{(totalPrice * 1.05).toFixed(0)}</span>
              </div>
              <Link href="/restaurant/checkout">
                <Button className="w-full h-16 rounded-2xl bg-white text-black font-black">Proceed to Checkout</Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
