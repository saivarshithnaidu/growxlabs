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


-- =====================================================================
-- PART 2: DATABASE RELATION REPAIRS & SYNCHRONIZATION
-- =====================================================================

-- 0. Insert legacy client placeholder to prevent foreign key check failures
-- on pre-existing invoice records that reference this client ID.
INSERT INTO public.users (id, name, email, password, role)
VALUES (
  '0b18bd93-0371-4ff4-8389-9bbbfcd95dfc', 
  'Legacy Client', 
  'legacy.client@growxlabs.tech', 
  '$2b$10$ieErAoR7OmFW2nMRVY74mezt/WH7.Hv3eBj/lV6990gA119SpwOp2', 
  'CLIENT'
)
ON CONFLICT (id) DO NOTHING;

-- 1. Fix invoices foreign key constraint to reference public.users instead of auth.users
ALTER TABLE public.invoices 
DROP CONSTRAINT IF EXISTS invoices_client_id_fkey;

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. Fix agreements foreign key constraint to reference public.users instead of auth.users
ALTER TABLE public.agreements 
DROP CONSTRAINT IF EXISTS agreements_client_id_fkey;

ALTER TABLE public.agreements 
ADD CONSTRAINT agreements_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 3. Fix projects foreign key constraint to reference public.users instead of auth.users
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_client_id_fkey;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 4. Sync your active Supabase Auth user into the public.users table
-- This links your login email (saivarshith8284@gmail.com) so it works as a valid client.
INSERT INTO public.users (id, name, email, password, role)
VALUES (
  'bcfd2085-a9e6-4445-984b-1a977e85a73d', 
  'Sai Varshith', 
  'saivarshith8284@gmail.com', 
  '$2b$10$ieErAoR7OmFW2nMRVY74mezt/WH7.Hv3eBj/lV6990gA119SpwOp2', 
  'CLIENT'
)
ON CONFLICT (email) DO NOTHING;

