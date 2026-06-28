-- =======================================================
-- CUSTOM BOOKING SCHEDULER DATABASE SCHEMA PATCH
-- =======================================================

-- 1. CREATE BOOKINGS TABLE
-- Stores scheduled meetings and connects them to clients
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed', -- 'confirmed' or 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DBL-BOOKING PREVENTION UNIQUE INDEX
-- This unique index prevents double-bookings for the same date and time slot,
-- allowing multiple entries only if previous bookings were 'cancelled'.
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking 
ON public.bookings (booking_date, time_slot) 
WHERE (status != 'cancelled');

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Note: The Next.js API route uses the Supabase service_role key (supabaseAdmin),
-- which bypasses RLS policies automatically. If you ever use client-side direct inserts,
-- you can enable public inserts:
-- CREATE POLICY "Allow public inserts" ON public.bookings FOR INSERT WITH CHECK (true);
