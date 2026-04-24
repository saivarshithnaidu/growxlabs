-- Drop existing table to ensure clean state (if no production data exists)
DROP TABLE IF EXISTS certificates CASCADE;

-- Create certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cert_id TEXT UNIQUE NOT NULL, -- GXL-YYYY-XXXX
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    course_name TEXT NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date DATE,
    grade TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Admin Policy (Full access)
CREATE POLICY "Admins manage all certificates" ON certificates 
FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

-- Public Policy (Anyone can verify a certificate by cert_id)
CREATE POLICY "Public view certificates" ON certificates 
FOR SELECT USING (true);

-- Index for fast lookup by cert_id
CREATE INDEX idx_certificates_cert_id ON certificates(cert_id);
