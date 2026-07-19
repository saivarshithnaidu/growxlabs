-- Supabase PostgreSQL Enterprise Project Management Schema (Phase 2)

-- ENUMS DEFINITIONS
CREATE TYPE project_status_enum AS ENUM (
  'PLANNING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE project_priority_enum AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE project_health_enum AS ENUM (
  'ON_TRACK',
  'AT_RISK',
  'OFF_TRACK'
);

CREATE TYPE pm_role_enum AS ENUM (
  'PROJECT_MANAGER',
  'DEVELOPER',
  'DESIGNER',
  'QA',
  'DEVOPS',
  'BUSINESS_ANALYST',
  'CLIENT_VIEWER',
  'INTERNAL_VIEWER'
);

CREATE TYPE sprint_status_enum AS ENUM (
  'FUTURE',
  'ACTIVE',
  'COMPLETED'
);

CREATE TYPE task_priority_enum AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE task_status_enum AS ENUM (
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'TESTING',
  'BLOCKED',
  'DONE'
);

CREATE TYPE bug_severity_enum AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'BLOCKER'
);

CREATE TYPE bug_status_enum AS ENUM (
  'NEW',
  'CONFIRMED',
  'RESOLVED',
  'CLOSED'
);

CREATE TYPE approval_type_enum AS ENUM (
  'CLIENT',
  'MANAGER',
  'DEPLOYMENT',
  'QA',
  'DESIGN'
);

CREATE TYPE approval_status_enum AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

-- 1. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  project_manager_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  status project_status_enum DEFAULT 'PLANNING',
  priority project_priority_enum DEFAULT 'MEDIUM',
  budget DECIMAL(15, 2) DEFAULT 0.00,
  estimated_hours DECIMAL(10, 2) DEFAULT 0.00,
  actual_hours DECIMAL(10, 2) DEFAULT 0.00,
  start_date DATE,
  end_date DATE,
  health project_health_enum DEFAULT 'ON_TRACK',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  role pm_role_enum DEFAULT 'DEVELOPER',
  assigned_hours_per_week DECIMAL(6, 2) DEFAULT 40.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, team_member_id)
);

-- 3. MILESTONES
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, DELAYED
  owner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EPICS
CREATE TABLE IF NOT EXISTS public.epics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TODO', -- TODO, IN_PROGRESS, DONE
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SPRINTS
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_date DATE,
  end_date DATE,
  status sprint_status_enum DEFAULT 'FUTURE',
  capacity_story_points INTEGER DEFAULT 0,
  completed_story_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  epic_id UUID REFERENCES public.epics(id) ON DELETE SET NULL,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  priority task_priority_enum DEFAULT 'MEDIUM',
  status task_status_enum DEFAULT 'TODO',
  story_points INTEGER DEFAULT 0,
  due_date DATE,
  estimated_hours DECIMAL(6, 2) DEFAULT 0.00,
  actual_hours DECIMAL(6, 2) DEFAULT 0.00,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  recurrence_rule TEXT, -- CRON syntax for recurring tasks
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBTASKS
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TASK DEPENDENCIES
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  successor_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'FS', -- FS (Finish-to-Start), SS, FF, SF
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (predecessor_id, successor_id)
);

-- 9. TIMESHEETS
CREATE TABLE IF NOT EXISTS public.timesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED
  approved_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TIME LOGS
CREATE TABLE IF NOT EXISTS public.time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timesheet_id UUID REFERENCES public.timesheets(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  hours_logged DECIMAL(4, 2) NOT NULL,
  description TEXT,
  is_timer_running BOOLEAN DEFAULT FALSE,
  timer_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BUGS
CREATE TABLE IF NOT EXISTS public.bugs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  severity bug_severity_enum DEFAULT 'MEDIUM',
  priority task_priority_enum DEFAULT 'MEDIUM',
  environment TEXT, -- Staging, Production, Chrome, etc.
  reporter_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  developer_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  steps_to_reproduce TEXT,
  expected_result TEXT,
  actual_result TEXT,
  status bug_status_enum DEFAULT 'NEW',
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'ARCHITECTURE', -- REQUIREMENTS, DESIGN, ARCHITECTURE, CONTRACTS, MINUTES
  current_version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. DOCUMENT VERSIONS
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MEETINGS
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  meeting_type TEXT NOT NULL, -- STANDUP, SPRINT_PLANNING, RETROSPECTIVE, CLIENT
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. MEETING NOTES
CREATE TABLE IF NOT EXISTS public.meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  transcript TEXT,
  summary TEXT,
  action_items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DELIVERABLES
CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- WEBSITE, MOBILE_APP, BACKEND, API, DESIGN, DEPLOYMENT, DOCS
  status TEXT DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, READY, APPROVED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. APPROVALS
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  deliverable_id UUID REFERENCES public.deliverables(id) ON DELETE CASCADE,
  approval_type approval_type_enum DEFAULT 'QA',
  status approval_status_enum DEFAULT 'PENDING',
  approver_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. REPOSITORIES
CREATE TABLE IF NOT EXISTS public.repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'GITHUB', -- GITHUB, GITLAB, BITBUCKET
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. PULL REQUESTS
CREATE TABLE IF NOT EXISTS public.pull_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
  pr_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN', -- OPEN, MERGED, CLOSED
  author TEXT,
  branch TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. DEPLOYMENTS
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  environment TEXT DEFAULT 'STAGING', -- PRODUCTION, STAGING, PREVIEW
  commit_hash TEXT,
  status TEXT DEFAULT 'SUCCESS', -- SUCCESS, FAILED, RUNNING
  triggered_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  logs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. PROJECT CALENDAR
CREATE TABLE IF NOT EXISTS public.project_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- SPRINT, MILESTONE, MEETING, LEAVE
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. LABELS
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL, -- HEX code
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, name)
);

-- 23. CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS public.custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- TEXT, NUMBER, DATE, BOOLEAN
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. CUSTOM FIELD VALUES
CREATE TABLE IF NOT EXISTS public.custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  record_id UUID NOT NULL, -- maps to task_id or project_id
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. RISKS
CREATE TABLE IF NOT EXISTS public.risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  probability_score INTEGER DEFAULT 50, -- 0 to 100
  impact_score INTEGER DEFAULT 50, -- 0 to 100
  mitigation_plan TEXT,
  status TEXT DEFAULT 'IDENTIFIED', -- IDENTIFIED, MITIGATED, OCCURRED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. PROJECT REPORTS
CREATE TABLE IF NOT EXISTS public.project_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- SUMMARY, SPRINT_VELOCITY, RESOURCE_UTILIZATION
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  bug_id UUID REFERENCES public.bugs(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- PROJECT_CREATED, TASK_ADDED, COMMENT_ADDED, FILE_UPLOADED, BUG_LOGGED, DEPLOYED, COMPLETED
  title TEXT NOT NULL,
  description TEXT,
  performed_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. TASK COMMENTS
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.task_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. TASK CHECKLISTS
CREATE TABLE IF NOT EXISTS public.task_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. PROJECT NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.project_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. BUG COMMENTS
CREATE TABLE IF NOT EXISTS public.bug_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bug_id UUID REFERENCES public.bugs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
