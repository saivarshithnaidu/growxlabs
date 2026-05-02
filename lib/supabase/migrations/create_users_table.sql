-- Create users table for database-only authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Hashed with bcrypt
    role TEXT DEFAULT 'CLIENT', -- 'ADMIN', 'CO_ADMIN', 'CLIENT'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Admin Policy (Admins can do everything)
CREATE POLICY "Admins manage all users" ON users 
FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

-- User Policy (Users can see their own profile)
CREATE POLICY "Users view own profile" ON users 
FOR SELECT USING (
    auth.uid() = id OR (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

-- Insert Default Admin User
-- Password is: GrowXAdmin2026!
INSERT INTO users (name, email, password, role)
VALUES (
    'GrowX Admin', 
    'admin@growxlabs.tech', 
    '$2b$10$ieErAoR7OmFW2nMRVY74mezt/WH7.Hv3eBj/lV6990gA119SpwOp2', 
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE 
SET role = 'ADMIN', password = '$2b$10$ieErAoR7OmFW2nMRVY74mezt/WH7.Hv3eBj/lV6990gA119SpwOp2';

-- Insert Default Co-Admin User
-- Password is: GrowXCoAdmin2026!
INSERT INTO users (name, email, password, role)
VALUES (
    'GrowX Co-Admin', 
    'coadmin@growxlabs.tech', 
    '$2b$10$/xCkP/vbrTbkDNMco9L2R.y2yk3qN8vjarZHipHCoYWQR/S3ASZNK', 
    'CO_ADMIN'
)
ON CONFLICT (email) DO UPDATE 
SET role = 'CO_ADMIN', password = '$2b$10$/xCkP/vbrTbkDNMco9L2R.y2yk3qN8vjarZHipHCoYWQR/S3ASZNK';
