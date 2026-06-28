"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  Check, 
  AlertCircle, 
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface BookingSchedulerProps {
  onClose: () => void;
}

const AVAILABLE_SLOTS = [
  "10:00 AM",
  "10:45 AM",
  "11:30 AM",
  "01:30 PM",
  "02:15 PM",
  "03:00 PM",
  "03:45 PM",
  "04:30 PM"
];

// Helper to format date safely in local timezone without UTC conversion shifts
const formatDbDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Generates next 14 days skipping Sundays
const getNextAvailableDays = () => {
  const dates = [];
  const current = new Date();
  
  // Booking starts from tomorrow
  current.setDate(current.getDate() + 1);

  while (dates.length < 14) {
    if (current.getDay() !== 0) { // Skip Sundays (0)
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export function BookingScheduler({ onClose }: BookingSchedulerProps) {
  const [step, setStep] = useState(1);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  // Loading states
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dbSetupError, setDbSetupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const days = getNextAvailableDays();
    setAvailableDays(days);
    // Auto-select the first available day
    if (days.length > 0) {
      setSelectedDate(days[0]);
    }
  }, []);

  // Fetch booked slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setDbSetupError(null);
      const dbDateStr = formatDbDate(selectedDate);
      
      try {
        const res = await fetch(`/api/bookings?date=${dbDateStr}`);
        const data = await res.json();
        
        if (res.status === 501 && data.requiresSetup) {
          setDbSetupError(data.error);
        } else if (!res.ok) {
          throw new Error(data.error || "Failed to fetch availability.");
        } else {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch (err: any) {
        console.error("Availability fetch error:", err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset selected slot on date change
  };

  const handleTimeSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setStep(2); // Progress to details form
  };

  const handleBack = () => {
    setStep(1);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedDate || !selectedTimeSlot) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      name,
      email,
      date: formatDbDate(selectedDate),
      timeSlot: selectedTimeSlot,
      notes
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStep(3); // Progress to success state
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Date formatting helpers
  const getFormattedSelectedDate = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between text-white relative p-6 md:p-8 font-sans overflow-hidden">
      
      {/* ═══════════════════════════════════════════════════ */}
      {/* STEP 1: DATE & TIME SELECTOR                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="flex-grow flex flex-col h-full overflow-hidden"
          >
            {/* Header Block */}
            <div className="mb-4 shrink-0">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#C0F0FB] uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 animate-pulse text-[#C0F0FB]" />
                GrowXLabs Booking
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                Book a 30-Min Strategy Call
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C0F0FB]" />
                30 Min · Google Meet Video (Free)
              </p>
            </div>

            {dbSetupError ? (
              <div className="flex-grow flex flex-col items-center justify-center p-4 border border-red-500/20 bg-red-950/20 rounded-xl text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-semibold text-red-200">Database Setup Required</p>
                <p className="text-xs text-red-300/80 max-w-sm leading-relaxed">
                  {dbSetupError}
                </p>
              </div>
            ) : (
              /* Two-Column Selector Grid */
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden min-h-0">
                
                {/* Column 1: Date List */}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-2 block font-semibold">
                    1. Select Date
                  </span>
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                    {availableDays.map((day) => {
                      const isSelected = selectedDate && formatDbDate(day) === formatDbDate(selectedDate);
                      const isTomorrow = (() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return formatDbDate(day) === formatDbDate(tomorrow);
                      })();

                      return (
                        <button
                          key={day.getTime()}
                          onClick={() => handleDateSelect(day)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex justify-between items-center ${
                            isSelected 
                              ? "bg-[#C0F0FB] border-[#C0F0FB] text-black shadow-[0_0_15px_rgba(192,240,251,0.2)]" 
                              : "bg-white/[0.02] border-white/5 hover:border-white/20 text-zinc-300 hover:text-white"
                          }`}
                        >
                          <span>
                            {day.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                          {isTomorrow && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                              isSelected ? "bg-black/10 text-black" : "bg-primary/10 text-primary"
                            }`}>
                              Tomorrow
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Available Slots */}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-2 block font-semibold">
                    2. Select Time (IST)
                  </span>
                  
                  {loadingSlots ? (
                    <div className="flex-1 flex items-center justify-center bg-white/[0.01] border border-white/5 rounded-xl">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C0F0FB]/80" />
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                      {AVAILABLE_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => handleTimeSelect(slot)}
                            className={`w-full py-2.5 rounded-lg border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                              isBooked
                                ? "bg-white/[0.01] border-white/5 text-zinc-600 opacity-40 cursor-not-allowed line-through"
                                : "bg-white/[0.03] border-white/10 hover:border-[#C0F0FB]/35 hover:bg-[#C0F0FB]/5 text-white active:scale-[0.98]"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* STEP 2: INTAKE DETAILS FORM                         */}
        {/* ═══════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="flex-grow flex flex-col justify-between h-full"
          >
            <div>
              {/* Back Nav Link */}
              <button
                type="button"
                onClick={handleBack}
                className="text-xs text-[#C0F0FB] hover:text-[#c0f0fb]/80 font-semibold flex items-center gap-1 mb-4 select-none cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Calendar
              </button>

              <h3 className="text-lg font-bold tracking-tight text-white mb-1">
                Enter Your Details
              </h3>
              <p className="text-xs text-zinc-400 mb-5 leading-snug">
                Booking a strategy session for <strong className="text-white">{getFormattedSelectedDate()}</strong> at <strong className="text-white">{selectedTimeSlot}</strong>.
              </p>

              {/* Form Inputs Container */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">Your Name *</label>
                  <Input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    className="h-10 text-sm bg-white/[0.02] border-white/10 focus:border-[#C0F0FB]/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">Email Address *</label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="h-10 text-sm bg-white/[0.02] border-white/10 focus:border-[#C0F0FB]/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-400">What are we building? (Optional)</label>
                  <Textarea
                    placeholder="Tell us briefly about your product concept, backend needs, or workflow requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={submitting}
                    rows={2.5}
                    className="text-sm bg-white/[0.02] border-white/10 focus:border-[#C0F0FB]/40 resize-none py-2"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Block */}
            <div className="mt-4 pt-2 shrink-0 border-t border-white/5 flex flex-col gap-2">
              {submitError && (
                <div className="text-[11px] text-red-400 flex items-center gap-1.5 bg-red-950/15 border border-red-500/10 px-3 py-2 rounded-lg leading-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={submitting || !name || !email}
                className="w-full h-11 bg-[#C0F0FB] hover:bg-[#c0f0fb]/90 text-black font-bold tracking-wide transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(192,240,251,0.15)]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Securing Slot...
                  </>
                ) : (
                  "Confirm Strategy Call"
                )}
              </Button>
            </div>
          </motion.form>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* STEP 3: SUCCESS BLOCK                               */}
        {/* ═══════════════════════════════════════════════════ */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex-grow flex flex-col justify-between h-full items-center text-center py-6"
          >
            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
              {/* Success Badge */}
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/35 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.15)] text-emerald-400">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Strategy Call Confirmed!</h3>
                <p className="text-xs text-zinc-400">
                  Your meeting has been locked in and added to the queue.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 w-full max-w-sm text-left space-y-1">
                <p className="text-[10px] font-mono tracking-wider uppercase font-semibold text-zinc-500">Meeting Details:</p>
                <p className="text-sm font-bold text-white">30-Min AI Product Consultation</p>
                <p className="text-xs text-zinc-300">📅 {getFormattedSelectedDate()}</p>
                <p className="text-xs text-zinc-300">⏰ {selectedTimeSlot} (Indian Standard Time)</p>
              </div>

              <p className="text-[11px] text-zinc-400 max-w-xs leading-normal">
                A calendar invite with the Google Meet link and detailed receipt has been sent to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-11 border-white/10 hover:border-white/20 text-white font-bold hover:bg-white/5 cursor-pointer mt-4 select-none"
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
