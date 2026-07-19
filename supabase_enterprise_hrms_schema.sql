-- Supabase PostgreSQL Enterprise HRMS Schema (Phase 4)

-- ENUMS DEFINITIONS (Safe creation)
DO $$ BEGIN
  CREATE TYPE employment_type_enum AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE candidate_stage_enum AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'ASSESSMENT', 'OFFER', 'HIRED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  head_id UUID, -- References employees(id) (deferred foreign key)
  description TEXT,
  budget DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial departments
INSERT INTO public.departments (name, description, budget) VALUES
  ('Engineering', 'Software developers and architects team', 5000000.00),
  ('Human Resources', 'Talent acquisition and operations', 1000000.00),
  ('Sales & Marketing', 'Brand outreach and account win metrics', 3000000.00)
ON CONFLICT (name) DO NOTHING;

-- 2. DESIGNATIONS
CREATE TABLE IF NOT EXISTS public.designations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  level TEXT, -- Senior, Mid, Lead etc.
  salary_range_min DECIMAL(15, 2) DEFAULT 0.00,
  salary_range_max DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial designations
INSERT INTO public.designations (title, level, salary_range_min, salary_range_max) VALUES
  ('Senior Frontend Engineer', 'Senior', 1200000.00, 2400000.00),
  ('HR Manager', 'Lead', 800000.00, 1500000.00),
  ('SDR Account Manager', 'Mid', 600000.00, 1200000.00)
ON CONFLICT (title) DO NOTHING;

-- 3. EMPLOYEES (Extends team_members or stores complete HR fields)
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT UNIQUE NOT NULL, -- e.g., 'EMP-1001'
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  gender gender_enum,
  dob DATE,
  blood_group TEXT,
  joining_date DATE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE RESTRICT,
  designation_id UUID REFERENCES public.designations(id) ON DELETE RESTRICT,
  reporting_manager_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  employment_type employment_type_enum DEFAULT 'FULL_TIME',
  work_location TEXT, -- Remote, Hybrid, Onsite
  aadhaar_no TEXT UNIQUE,
  pan_no TEXT UNIQUE,
  passport_no TEXT UNIQUE,
  bank_name TEXT,
  bank_account_no TEXT,
  bank_ifsc TEXT,
  current_address TEXT,
  permanent_address TEXT,
  profile_photo_url TEXT,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard corporate employee profile
INSERT INTO public.employees (employee_id, full_name, email, phone, joining_date, department_id, designation_id)
SELECT 
  'EMP-001', 
  'Nishitha HR', 
  'nishitha@growxlabs.tech', 
  '+919876543210', 
  CURRENT_DATE,
  (SELECT id FROM public.departments WHERE name = 'Human Resources' LIMIT 1),
  (SELECT id FROM public.designations WHERE title = 'HR Manager' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.employees WHERE email = 'nishitha@growxlabs.tech');

-- Setup department head references
UPDATE public.departments 
SET head_id = (SELECT id FROM public.employees WHERE email = 'nishitha@growxlabs.tech' LIMIT 1)
WHERE name = 'Human Resources';

-- 4. EMPLOYEE DOCUMENTS
CREATE TABLE IF NOT EXISTS public.employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- OFFER_LETTER, NDA, GOVT_ID, PAYSLIP
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE (Clock timings)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  working_hours DECIMAL(5, 2) DEFAULT 0.00,
  overtime_hours DECIMAL(5, 2) DEFAULT 0.00,
  late_check_in BOOLEAN DEFAULT FALSE,
  gps_coordinates TEXT, -- e.g., '12.9716, 77.5946'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id, work_date)
);

-- 6. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL, -- SICK, CASUAL, EARNED, MATERNITY
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status leave_status_enum DEFAULT 'PENDING',
  approved_by_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEAVE BALANCES
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  allocated INTEGER DEFAULT 12,
  used INTEGER DEFAULT 0,
  remaining INTEGER DEFAULT 12,
  UNIQUE (employee_id, leave_type)
);

-- 8. PAYROLL RUNS
CREATE TABLE IF NOT EXISTS public.payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_month DATE NOT NULL, -- e.g. '2026-07-01'
  gross_salary DECIMAL(15, 2) NOT NULL,
  allowances DECIMAL(15, 2) DEFAULT 0.00,
  bonuses DECIMAL(15, 2) DEFAULT 0.00,
  deductions DECIMAL(15, 2) DEFAULT 0.00, -- PF + ESI + TDS
  net_salary DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, APPROVED, PAID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYROLL ITEMS (Individual payslips per employee)
CREATE TABLE IF NOT EXISTS public.payroll_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID REFERENCES public.payroll(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  basic_salary DECIMAL(15, 2) NOT NULL,
  allowances DECIMAL(15, 2) DEFAULT 0.00,
  pf_deduction DECIMAL(15, 2) DEFAULT 0.00,
  esi_deduction DECIMAL(15, 2) DEFAULT 0.00,
  tds_withheld DECIMAL(15, 2) DEFAULT 0.00,
  net_payable DECIMAL(15, 2) NOT NULL,
  payslip_url TEXT,
  is_disbursed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (payroll_id, employee_id)
);

-- 10. RECRUITMENT JOB OPENINGS
CREATE TABLE IF NOT EXISTS public.recruitment_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  description TEXT,
  requirements TEXT[],
  salary_range TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard job listing
INSERT INTO public.recruitment_jobs (title, department_id, description, requirements) VALUES
  ('React Native App Developer', (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1), 'Build mobile dashboards', ARRAY['React Native', 'Tailwind', 'Next.js'])
ON CONFLICT (title) DO NOTHING;

-- 11. CANDIDATES
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.recruitment_jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  resume_url TEXT,
  stage candidate_stage_enum DEFAULT 'APPLIED',
  score INTEGER DEFAULT 0, -- AI ranking score
  summary TEXT, -- AI interview parsing summaries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard applicant
INSERT INTO public.candidates (full_name, email, phone, stage, score, summary) VALUES
  ('Gopal Reddy', 'gopal.reddy@gmail.com', '+919900887766', 'APPLIED', 88, 'Strong front-end developer with 3 years Javascript experience.')
ON CONFLICT (email) DO NOTHING;

-- 12. CANDIDATE INTERVIEWS
CREATE TABLE IF NOT EXISTS public.candidate_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  interview_date TIMESTAMPTZ NOT NULL,
  interviewer_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  feedback TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. OFFER LETTERS
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  offered_salary DECIMAL(15, 2) NOT NULL,
  joining_date DATE NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, SENT, ACCEPTED, REJECTED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. TRAINING COURSES
CREATE TABLE IF NOT EXISTS public.training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed basic training course
INSERT INTO public.training_courses (title, description, duration_hours) VALUES
  ('GrowXLabs NDA & Security Guidelines', 'Compliance policy and intellectual asset guidelines', 2)
ON CONFLICT (title) DO NOTHING;

-- 15. TRAINING ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.training_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.training_courses(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0, -- 0 to 100 percent
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, employee_id)
);

-- 16. EMPLOYEE PERFORMANCE GOALS (OKRs)
CREATE TABLE IF NOT EXISTS public.hrms_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. EMPLOYEE CORPORATE ASSETS
CREATE TABLE IF NOT EXISTS public.employee_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  asset_name TEXT NOT NULL, -- e.g., 'Macbook Pro M3'
  serial_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'ISSUED', -- ISSUED, RETURNED, DAMAGED
  issued_date DATE NOT NULL,
  returned_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. EMPLOYEE EXIT DETAILS
CREATE TABLE IF NOT EXISTS public.employee_exit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  resignation_date DATE NOT NULL,
  relieving_date DATE NOT NULL,
  notice_period_days INTEGER,
  exit_reason TEXT,
  exit_interview_notes TEXT,
  is_cleared BOOLEAN DEFAULT FALSE, -- final settlement approval
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. HRMS AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.hrms_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- CLOCK_IN, OFFER_SENT, EMPLOYEE_HIRED etc.
  details JSONB,
  performed_by_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
