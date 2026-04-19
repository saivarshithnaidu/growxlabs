-- RUN THIS IN SUPABASE SQL EDITOR TO FIX OUTREACH FEATURES
-- This adds the missing columns required for AI Outreach generation and tracking

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS outreach_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS outreach_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS outreach_content JSONB;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('outreach_generated', 'outreach_sent', 'outreach_content');
