-- Create career_applications table
CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    role TEXT,
    experience TEXT,
    tech_stack TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    job_title TEXT,
    company TEXT,
    expected_salary TEXT,
    notice_period TEXT,
    employment_type TEXT,
    motivation TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'shortlisted', 'contacted', 'rejected', 'hired'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit an application)
CREATE POLICY "Allow public insert" ON career_applications 
FOR INSERT WITH CHECK (true);

-- Allow admins and co-admins to view and manage applications
CREATE POLICY "Allow admin manage" ON career_applications 
FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_career_apps_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_apps_created ON career_applications(created_at DESC);
