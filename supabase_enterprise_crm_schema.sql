-- =====================================================================
-- ENTERPRISE CRM DATABASE SCHEMA FOR GROWXLABS
-- =====================================================================

-- Enums
CREATE TYPE deal_stage_enum AS ENUM (
  'NEW_LEAD',
  'QUALIFIED',
  'CONTACTED',
  'MEETING_SCHEDULED',
  'DEMO',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'WON',
  'LOST'
);

CREATE TYPE activity_type_enum AS ENUM (
  'CALL',
  'EMAIL',
  'MEETING',
  'TASK',
  'NOTE',
  'WHATSAPP',
  'SMS',
  'LINKEDIN'
);

CREATE TYPE priority_enum AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH'
);

CREATE TYPE task_status_enum AS ENUM (
  'TODO',
  'IN_PROGRESS',
  'COMPLETED',
  'DEFERRED'
);

CREATE TYPE meeting_outcome_enum AS ENUM (
  'SCHEDULED',
  'COMPLETED',
  'NO_SHOW',
  'RESCHEDULED',
  'CANCELLED'
);

CREATE TYPE document_type_enum AS ENUM (
  'PROPOSAL',
  'CONTRACT',
  'INVOICE',
  'IMAGE',
  'PDF',
  'OTHER'
);

CREATE TYPE quotation_status_enum AS ENUM (
  'DRAFT',
  'SENT',
  'APPROVED',
  'REJECTED',
  'INVOICED'
);

CREATE TYPE crm_role_enum AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'SALES_MANAGER',
  'SALES_EXECUTIVE',
  'BDR',
  'VIEWER'
);

-- 1. COMPANIES (ACCOUNTS)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  gst TEXT,
  pan TEXT,
  address TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  employees_count INTEGER DEFAULT 0,
  annual_revenue DECIMAL(15, 2) DEFAULT 0.00,
  owner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active', -- active, inactive, prospect
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  birthday DATE,
  is_decision_maker BOOLEAN DEFAULT FALSE,
  preferred_communication TEXT DEFAULT 'EMAIL', -- EMAIL, PHONE, WHATSAPP, SMS
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEAL STAGES (For custom stages configuration)
CREATE TABLE IF NOT EXISTS public.deal_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  probability INTEGER NOT NULL, -- 0 to 100
  order_index INTEGER NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default deal stages
INSERT INTO public.deal_stages (name, probability, order_index, is_custom) VALUES
  ('New Lead', 10, 1, FALSE),
  ('Qualified', 20, 2, FALSE),
  ('Contacted', 30, 3, FALSE),
  ('Meeting Scheduled', 40, 4, FALSE),
  ('Demo', 60, 5, FALSE),
  ('Proposal Sent', 70, 6, FALSE),
  ('Negotiation', 80, 7, FALSE),
  ('Won', 100, 8, FALSE),
  ('Lost', 0, 9, FALSE)
ON CONFLICT (name) DO NOTHING;

-- 4. DEALS
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  primary_contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  value DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR', -- INR, USD, EUR
  expected_close_date DATE,
  probability INTEGER, -- 0 to 100
  stage_id UUID REFERENCES public.deal_stages(id) ON DELETE RESTRICT,
  source TEXT,
  competitor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACTIVITIES (Unified Timeline Header)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  type activity_type_enum NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  performed_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EMAILS
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  is_received BOOLEAN DEFAULT FALSE
);

-- 7. CALL LOGS
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  duration_seconds INTEGER,
  recording_url TEXT,
  outcome TEXT -- Answered, Voicemail, Busy, No Answer
);

-- 8. WHATSAPP LOGS
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  status TEXT -- sent, delivered, read
);

-- 9. SMS LOGS
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_text TEXT NOT NULL,
  status TEXT -- sent, failed
);

-- 10. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  priority priority_enum DEFAULT 'MEDIUM',
  status task_status_enum DEFAULT 'TODO',
  due_date DATE,
  reminder_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEETINGS
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  platform TEXT DEFAULT 'GOOGLE_MEET', -- GOOGLE_MEET, ZOOM, TEAMS
  meeting_url TEXT,
  outcome meeting_outcome_enum DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.1 MEETING ATTENDEES (Many-to-Many join table)
CREATE TABLE IF NOT EXISTS public.meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'invited', -- invited, accepted, declined
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  tax_percentage DECIMAL(5, 2) DEFAULT 18.00, -- GST default 18%
  sku TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'active', -- active, inactive
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. QUOTATIONS
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  status quotation_status_enum DEFAULT 'DRAFT',
  total_amount DECIMAL(15, 2) DEFAULT 0.00,
  discount_amount DECIMAL(15, 2) DEFAULT 0.00,
  tax_amount DECIMAL(15, 2) DEFAULT 0.00,
  grand_total DECIMAL(15, 2) DEFAULT 0.00,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.1 QUOTATION LINE ITEMS
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. DOCUMENTS & ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_type document_type_enum DEFAULT 'PDF',
  file_url TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  version INTEGER NOT NULL,
  changes_description TEXT,
  created_by UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  related_type TEXT NOT NULL, -- 'activity', 'comment', 'task'
  related_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. TAGS
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color_code TEXT DEFAULT '#0075de',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tag_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  related_type TEXT NOT NULL, -- 'company', 'contact', 'deal'
  related_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. COMMENTS & MENTIONS
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL, -- Supports rich text and @mentions
  author_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  related_type TEXT NOT NULL, -- 'company', 'contact', 'deal', 'task'
  related_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'assignment', 'mention', 'deal_won', 'meeting_reminder'
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. WORKFLOW AUTOMATION RULES
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL, -- 'lead_created', 'deal_stage_updated', 'task_completed'
  conditions JSONB DEFAULT '{}', -- Match field triggers
  actions JSONB DEFAULT '[]', -- List of actions to execute
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  trigger_record_id UUID NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failed'
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. TIMELINE CHRONOLOGICAL EVENTS (Telemetry Audit Trail)
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'created', 'activity', 'task', 'deal_stage_change', 'status_change'
  description TEXT NOT NULL,
  reference_id UUID, -- References actual activity/task/deal stage run record
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS public.custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  related_type TEXT NOT NULL, -- 'company', 'contact', 'deal'
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- 'text', 'number', 'boolean', 'date'
  default_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_field_id UUID REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  record_id UUID NOT NULL,
  field_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (custom_field_id, record_id)
);

-- ALTER CURRENT ROLE DEFINITIONS ON USERS/TEAM
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS crm_role crm_role_enum DEFAULT 'BDR';

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_companies_owner ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON public.deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_company ON public.deals(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_company ON public.activities(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_quotations_deal ON public.quotations(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_company ON public.documents(company_id);
CREATE INDEX IF NOT EXISTS idx_timeline_company ON public.timeline_events(company_id);
