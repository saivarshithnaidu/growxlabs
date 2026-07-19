-- ============================================================================
-- GROWXLABS ENTERPRISE ADMINISTRATION, SECURITY & GOVERNANCE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor to create all 37 normalized tables
-- ============================================================================

-- 1. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    legal_name TEXT,
    gst_number TEXT,
    pan_number TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    address JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRANCHES
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL,
    location_code TEXT UNIQUE,
    address JSONB DEFAULT '{}',
    is_headquarters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    department_name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    head_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    manager_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'Active', -- Active, Deactivated, Pending, Suspended
    user_type TEXT DEFAULT 'Employee', -- Employee, Client, Partner, Vendor, Admin
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT,
    last_login_at TIMESTAMPTZ,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT UNIQUE NOT NULL, -- Super Admin, Organization Admin, IT Administrator, Security Administrator, Compliance Officer, Department Admin, Manager, Employee, Client, Viewer
    description TEXT,
    is_system_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PERMISSIONS
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code TEXT UNIQUE NOT NULL, -- crm.read, crm.create, pm.manage, finance.export, support.resolve, admin.security
    module TEXT NOT NULL, -- CRM, PM, Finance, HRMS, Marketing, Support, Admin
    action TEXT NOT NULL, -- Create, Read, Update, Delete, Export, Approve, Assign, Support
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROLE PERMISSIONS
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- 9. USER ROLES
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 10. ADMIN SESSIONS
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    browser TEXT,
    os TEXT,
    device_type TEXT DEFAULT 'Desktop',
    geo_location TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DEVICES
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT DEFAULT 'Desktop',
    os_version TEXT,
    ip_address TEXT,
    is_trusted BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LOGIN HISTORY
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    email_attempted TEXT NOT NULL,
    status TEXT NOT NULL, -- Success, Failed_Password, Failed_MFA, Blocked_IP
    ip_address TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    entity_name TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SECURITY EVENTS
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- Threat_Detected, Brute_Force, Suspicious_IP, Password_Expired, Privilege_Escalation
    severity TEXT DEFAULT 'Medium', -- Low, Medium, High, Critical
    description TEXT NOT NULL,
    ip_address TEXT,
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. API KEYS
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name TEXT NOT NULL,
    api_key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT NOT NULL,
    scopes TEXT[] DEFAULT '{}',
    rate_limit_per_min INTEGER DEFAULT 1000,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. OAUTH CLIENTS
CREATE TABLE IF NOT EXISTS oauth_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_id TEXT UNIQUE NOT NULL,
    client_secret_hash TEXT NOT NULL,
    redirect_uris TEXT[] DEFAULT '{}',
    grant_types TEXT[] DEFAULT '{"authorization_code"}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. INTEGRATIONS
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT UNIQUE NOT NULL, -- Google Workspace, Microsoft 365, Slack, Stripe, Razorpay, GitHub, AWS, Gemini, OpenAI
    category TEXT NOT NULL, -- Auth, Storage, Communication, Payment, AI, Cloud
    status TEXT DEFAULT 'Disconnected', -- Connected, Disconnected, Error
    config JSONB DEFAULT '{}',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. WEBHOOKS
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] DEFAULT '{}', -- user.created, lead.qualified, ticket.escalated, invoice.paid
    secret TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. FEATURE FLAGS
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key TEXT UNIQUE NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 100,
    environment TEXT DEFAULT 'Production', -- Development, Staging, Production
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. LICENSES
CREATE TABLE IF NOT EXISTS licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name TEXT NOT NULL, -- Enterprise Platinum, Business Pro, Starter
    total_seats INTEGER DEFAULT 100,
    used_seats INTEGER DEFAULT 0,
    expires_at DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
    billing_cycle TEXT DEFAULT 'Annual',
    amount DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'Active',
    renews_at DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. BACKUPS
CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_name TEXT NOT NULL,
    backup_type TEXT DEFAULT 'Automated', -- Automated, Manual, Disaster_Recovery
    file_size_bytes BIGINT,
    storage_path TEXT,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    category TEXT DEFAULT 'General',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. BRANDING
CREATE TABLE IF NOT EXISTS branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#0075DE',
    secondary_color TEXT DEFAULT '#00A86B',
    dark_theme BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. CUSTOM DOMAINS
CREATE TABLE IF NOT EXISTS custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    domain_name TEXT UNIQUE NOT NULL,
    ssl_status TEXT DEFAULT 'Active', -- Pending, Active, Expired
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. NOTIFICATION TEMPLATES
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT UNIQUE NOT NULL,
    channel TEXT NOT NULL, -- Email, SMS, Push, WhatsApp, Slack, Teams
    subject TEXT,
    body_template TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. WORKFLOW DEFINITIONS
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    module_scope TEXT DEFAULT 'Global', -- Cross-module or specific
    trigger_event TEXT NOT NULL,
    nodes JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. ADMIN WORKFLOW RUNS
CREATE TABLE IF NOT EXISTS admin_workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    triggered_by TEXT,
    status TEXT DEFAULT 'Success',
    execution_logs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. APPROVAL CHAINS
CREATE TABLE IF NOT EXISTS approval_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chain_name TEXT NOT NULL,
    module TEXT NOT NULL, -- Finance, HRMS, Security
    approver_roles TEXT[] DEFAULT '{}',
    min_approvals INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. ENVIRONMENT CONFIGS
CREATE TABLE IF NOT EXISTS environment_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_name TEXT UNIQUE NOT NULL, -- Development, Staging, Production
    variables JSONB DEFAULT '{}',
    deployment_status TEXT DEFAULT 'Healthy',
    last_deployed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. STORAGE FILES
CREATE TABLE IF NOT EXISTS storage_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'Supabase Storage',
    size_bytes BIGINT,
    mime_type TEXT,
    bucket_name TEXT DEFAULT 'assets',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. COMPLIANCE RECORDS
CREATE TABLE IF NOT EXISTS compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework TEXT NOT NULL, -- GDPR, SOC2, ISO27001, HIPAA
    status TEXT DEFAULT 'Compliant',
    audit_date DATE,
    findings JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. CONSENT LOGS
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    consent_type TEXT NOT NULL, -- Terms_of_Service, Privacy_Policy, Cookie_Tracking
    ip_address TEXT,
    accepted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. RETENTION POLICIES
CREATE TABLE IF NOT EXISTS retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT UNIQUE NOT NULL, -- Audit_Logs, Login_History, Customer_Support_Tickets, Invoices
    retention_days INTEGER DEFAULT 365,
    auto_archive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    activity TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 36. ADMIN ATTACHMENTS
CREATE TABLE IF NOT EXISTS admin_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. ADMIN CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS admin_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- Users, Organizations, Roles
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, field_name)
);

-- INDEXES FOR FASTER GOVERNANCE LOOKUPS
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
