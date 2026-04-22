-- GrowX Labs LMS Database Schema

-- Courses Table (Metadata)
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    difficulty TEXT,
    duration TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active', -- active, completed
    UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, lesson_id)
);

-- Test Attempts
CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    grade TEXT NOT NULL, -- A, B, C, D, E, F
    attempt_count INTEGER DEFAULT 1,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY, -- GXL-COURSE-YEAR-UNIQUE
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    grade TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pdf_url TEXT,
    verification_code TEXT UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for owner and read)
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Users can manage their own enrollments" ON enrollments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can track their own progress" ON progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own attempts" ON test_attempts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Certificates are viewable by everyone" ON certificates FOR SELECT USING (true);

-- Seed Initial Courses (Required for Foreign Key Integrity)
INSERT INTO courses (id, title, slug, difficulty, duration)
VALUES 
('java-mastery', 'Java Mastery', 'java-mastery', 'Intermediate', '75 Hours'),
('nextjs-fullstack', 'Next.js 15 Full Stack', 'nextjs-fullstack', 'Advanced', '30 Hours'),
('python-mastery', 'Python Mastery', 'python-mastery', 'Advanced', '65 Hours')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
slug = EXCLUDED.slug,
difficulty = EXCLUDED.difficulty,
duration = EXCLUDED.duration;
