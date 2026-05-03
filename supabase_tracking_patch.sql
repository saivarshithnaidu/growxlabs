-- RUN THIS IN SUPABASE SQL EDITOR TO ADD TRACKING COLUMNS TO LEADS TABLE
-- This adds the columns required to track the source and creator of each lead.

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Unknown',
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS created_by_name TEXT;

-- Optional: If you want to link created_by to team_members
-- ALTER TABLE leads ADD CONSTRAINT fk_leads_created_by FOREIGN KEY (created_by) REFERENCES team_members(id);

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE
    table_name = 'leads'
    AND column_name IN (
        'source',
        'created_by',
        'created_by_name'
    );