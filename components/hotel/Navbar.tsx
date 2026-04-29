"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BedDouble } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';

export const HotelNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Suites', href: '/hotel/rooms' },
    { name: 'Amenities', href: '/hotel/amenities' },
    { name: 'Experience', href: '/hotel/gallery' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' 
        : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/hotel" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all duration-500">
            <BedDouble className="text-primary group-hover:text-black w-5 h-5 transition-colors" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            GrowX <span className="text-primary not-italic">Hotels</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link href="/hotel/rooms">
            <Button size="sm" className="rounded-full px-8 h-12 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/10">
              Reserve
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] bg-black/95 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center items-center gap-8 p-12"
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link 
                  href={link.href}
                  className="text-5xl font-black text-white hover:text-primary transition-colors uppercase italic"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <Link href="/hotel/rooms" className="mt-8" onClick={() => setMobileMenuOpen(false)}>
              <Button size="lg" className="rounded-full px-12 h-16 font-black uppercase tracking-widest">
                Book a Suite
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};



