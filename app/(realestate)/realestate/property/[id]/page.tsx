"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { properties } from '@/lib/property-data';
import { Button } from '@/components/ui/Button';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  if (!property) return <div className="pt-40 text-white text-center">Not Found</div>;
  return (
    <div className="pt-24 min-h-screen bg-black text-white">
      <div className="h-[70vh] w-full"><img src={property.image} className="w-full h-full object-cover" /></div>
      <div className="max-w-7xl mx-auto px-6 py-20 flex gap-20">
        <div className="flex-grow">
           <h1 className="text-8xl font-black mb-10 uppercase">{property.title}</h1>
           <p className="text-2xl text-white/50 font-light">{property.description}</p>
        </div>
        <div className="w-96 glass-card p-10 bg-white/5 border-white/10 h-fit sticky top-32">
           <p className="text-5xl font-black text-primary mb-8">₹{(property.price / 10000000).toFixed(1)}Cr</p>
           <Button className="w-full h-16 rounded-2xl bg-white text-black font-black">Schedule Visit</Button>
        </div>
      </div>
    </div>
  );
}