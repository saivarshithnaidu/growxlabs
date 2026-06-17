-- WISH GAME SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.wish_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wish_subscribers ENABLE ROW LEVEL SECURITY;

-- Note: The Next.js API route uses the Supabase service_role key (supabaseAdmin),
-- which bypasses RLS policies automatically. If you ever use client-side direct inserts,
-- you can add policies like:
-- CREATE POLICY "Allow public inserts" ON public.wish_subscribers FOR INSERT WITH CHECK (true);
