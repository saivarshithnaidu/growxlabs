-- ============================================================================
-- GROWXLABS ENTERPRISE DATABASE OPTIMIZATION & MULTI-TENANCY RLS SCRIPT
-- Run this script in your Supabase SQL Editor
-- ============================================================================

-- 0. ENSURE COLUMNS EXIST BEFORE INDEXING & RLS
ALTER TABLE leads ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 1. COMPOSITE & PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_org_status ON leads(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_invoices_org_status ON invoices(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_org_priority ON tickets(organization_id, priority, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_org_status ON projects(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_team_members_org_email ON team_members(organization_id, email);

-- 2. ROW-LEVEL SECURITY (RLS) MULTI-TENANT ISOLATION POLICIES
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running to avoid duplicate name errors
DROP POLICY IF EXISTS tenant_leads_isolation ON leads;
DROP POLICY IF EXISTS tenant_invoices_isolation ON invoices;
DROP POLICY IF EXISTS tenant_tickets_isolation ON tickets;
DROP POLICY IF EXISTS tenant_projects_isolation ON projects;

-- Create Tenant Isolation Policies
CREATE POLICY tenant_leads_isolation ON leads
    FOR ALL
    USING (organization_id IS NULL OR organization_id = auth.uid());

CREATE POLICY tenant_invoices_isolation ON invoices
    FOR ALL
    USING (organization_id IS NULL OR organization_id = auth.uid());

CREATE POLICY tenant_tickets_isolation ON tickets
    FOR ALL
    USING (organization_id IS NULL OR organization_id = auth.uid());

CREATE POLICY tenant_projects_isolation ON projects
    FOR ALL
    USING (organization_id IS NULL OR organization_id = auth.uid());
