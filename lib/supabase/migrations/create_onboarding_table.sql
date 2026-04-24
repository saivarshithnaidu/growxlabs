CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_type TEXT,
    description TEXT,
    target_audience TEXT,
    city TEXT,
    plan TEXT,
    features TEXT[], -- Array of strings for multi-select
    budget TEXT,
    timeline TEXT,
    domain TEXT,
    payment_gateway TEXT,
    notes TEXT,
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE onboarding_submissions ENABLE ROW LEVEL SECURITY;

-- Admin Policy
CREATE POLICY admin_onboarding ON onboarding_submissions FOR ALL USING (auth.jwt() ->> 'role' IN ('ADMIN', 'CO_ADMIN'));
