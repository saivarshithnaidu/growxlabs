-- Extension for GrowX Labs Full LMS Control
-- Corrected for 'clients' table structure and auth.jwt() RLS

-- 1. Assessment Questions Bank
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_answer INTEGER NOT NULL, -- index in options array
    difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
    type TEXT DEFAULT 'mcq', -- mcq, code
    code_template TEXT, -- for code-based questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enhanced Enrollments (adding price for revenue stats)
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS purchase_price INTEGER DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

-- 3. Course Modules (Dynamic Management)
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Course Lessons (Dynamic Management)
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT, -- Markdown or Rich Text
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- 6. Policies (Using JWT role for performance and reliability)
-- Note: This assumes 'role' is stored in the JWT (standard for this project)

CREATE POLICY "Admin All Questions" ON questions FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

CREATE POLICY "Admin All Modules" ON modules FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

CREATE POLICY "Admin All Lessons" ON lessons FOR ALL USING (
    (auth.jwt() ->> 'role') IN ('ADMIN', 'CO_ADMIN')
);

-- Public Read Access
CREATE POLICY "Everyone view Modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Everyone view Lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Everyone view Questions" ON questions FOR SELECT USING (true);
