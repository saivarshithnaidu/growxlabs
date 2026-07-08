"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [sub, setSub] = useState(false);
  if (sub) return <div className="pt-40 text-center text-white min-h-screen"><h1 className="text-5xl font-black">Inquiry Sent</h1></div>;
  return (
    <div className="pt-24 max-w-4xl mx-auto px-6 text-white min-h-screen">
       <h1 className="text-8xl font-black mb-20 uppercase">Contact Advisor</h1>
       <form onSubmit={(e) => { e.preventDefault(); setSub(true); }} className="glass-card p-12 space-y-8">
          <input required placeholder="Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
          <input required placeholder="Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl" />
          <textarea required placeholder="Message" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl h-40" />
          <Button size="lg" className="w-full h-20 rounded-full font-black bg-primary">Send Inquiry</Button>
       </form>
    </div>
  );
}