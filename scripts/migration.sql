-- ============================================================
-- GrowX Labs: Course Data Migration
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Clean up any existing legacy tables
DROP TABLE IF EXISTS assessment_questions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- ============================================================
-- 1. COURSES TABLE (public metadata)
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  difficulty TEXT NOT NULL,
  duration TEXT NOT NULL,
  become TEXT,
  problem_solved TEXT,
  will_build TEXT,
  for_who TEXT,
  price_inr INTEGER NOT NULL DEFAULT 0,
  final_project_title TEXT,
  final_project_description TEXT,
  final_project_requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COURSE MODULES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS course_modules (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- 3. LESSONS TABLE (protected content)
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  explanation TEXT NOT NULL,
  key_points JSONB NOT NULL,
  code_example TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  use_case TEXT NOT NULL,
  practice_task TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- 4. ASSESSMENT QUESTIONS TABLE (protected content)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  text TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL,
  correct_option_index INTEGER,
  correct_option_indices JSONB,
  explanation TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- INDEXES on foreign keys
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_course_id ON assessment_questions(course_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- ---- courses: public read ----
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- course_modules: public read ----
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on course_modules"
  ON course_modules
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- lessons: service_role only (no direct client access) ----
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role read access on lessons"
  ON lessons
  FOR SELECT
  TO service_role
  USING (true);

-- ---- assessment_questions: service_role only (no direct client access) ----
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role read access on assessment_questions"
  ON assessment_questions
  FOR SELECT
  TO service_role
  USING (true);
