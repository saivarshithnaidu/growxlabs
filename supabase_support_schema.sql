-- ============================================================================
-- GROWXLABS ENTERPRISE CUSTOMER SUPPORT & CUSTOMER SUCCESS DATABASE SCHEMA
-- Run this in your Supabase SQL Editor to create all 37 normalized tables
-- ============================================================================

-- 1. SUPPORT AGENTS
CREATE TABLE IF NOT EXISTS support_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- References users.id or team_members.id
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'Support Agent',
    is_active BOOLEAN DEFAULT TRUE,
    max_active_tickets INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TICKET CATEGORIES
CREATE TABLE IF NOT EXISTS ticket_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TICKET PRIORITIES
CREATE TABLE IF NOT EXISTS ticket_priorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- Low, Medium, High, Urgent
    response_hours INTEGER DEFAULT 24,
    resolution_hours INTEGER DEFAULT 72,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TICKET STATUSES
CREATE TABLE IF NOT EXISTS ticket_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- New, Assigned, In Progress, Waiting For Customer, Escalated, Resolved, Closed
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SLA POLICIES
CREATE TABLE IF NOT EXISTS sla_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name TEXT NOT NULL,
    description TEXT,
    first_response_time_mins INTEGER DEFAULT 60,
    resolution_time_mins INTEGER DEFAULT 1440,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    customer_id UUID, -- References users.id
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    company_name TEXT,
    project_id UUID, -- References projects.id
    priority TEXT DEFAULT 'Medium',
    severity TEXT DEFAULT 'Minor',
    category_id UUID REFERENCES ticket_categories(id) ON DELETE SET NULL,
    assigned_agent_id UUID REFERENCES support_agents(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'New',
    source TEXT DEFAULT 'Website', -- Website, Email, WhatsApp, Phone, Live Chat, Portal, API
    attachments TEXT[] DEFAULT '{}',
    due_date TIMESTAMPTZ,
    resolution TEXT,
    root_cause TEXT,
    internal_notes TEXT,
    tags TEXT[] DEFAULT '{}',
    sla_policy_id UUID REFERENCES sla_policies(id) ON DELETE SET NULL,
    sla_breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TICKET COMMENTS
CREATE TABLE IF NOT EXISTS ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    author_id UUID,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TICKET ATTACHMENTS
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TICKET SLAS
CREATE TABLE IF NOT EXISTS ticket_slas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    response_due TIMESTAMPTZ,
    resolution_due TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    is_violated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ESCALATIONS
CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    escalated_by UUID,
    escalated_to_role TEXT NOT NULL, -- Manager, Engineering, Technical Specialist
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CUSTOMER SUCCESS
CREATE TABLE IF NOT EXISTS customer_success (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID UNIQUE, -- References users.id
    customer_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    csm_id UUID REFERENCES support_agents(id) ON DELETE SET NULL,
    contract_value DECIMAL(12,2) DEFAULT 0,
    stage TEXT DEFAULT 'Active',
    nps_score INTEGER,
    csat_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CUSTOMER HEALTH
CREATE TABLE IF NOT EXISTS customer_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_success_id UUID REFERENCES customer_success(id) ON DELETE CASCADE,
    health_score INTEGER DEFAULT 80, -- 0 to 100
    churn_risk TEXT DEFAULT 'Low', -- Low, Medium, High, Critical
    product_adoption_score INTEGER DEFAULT 75,
    usage_frequency TEXT DEFAULT 'Daily',
    health_factors JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CONTRACTS
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_success_id UUID REFERENCES customer_success(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    total_value DECIMAL(12,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. RENEWALS
CREATE TABLE IF NOT EXISTS renewals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    renewal_date DATE NOT NULL,
    projected_amount DECIMAL(12,2) DEFAULT 0,
    stage TEXT DEFAULT 'Upcoming', -- Upcoming, Contacted, Negotiating, Renewed, Churned
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CUSTOMER ONBOARDING
CREATE TABLE IF NOT EXISTS customer_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_success_id UUID REFERENCES customer_success(id) ON DELETE CASCADE,
    kickoff_meeting BOOLEAN DEFAULT FALSE,
    account_setup BOOLEAN DEFAULT FALSE,
    data_migration BOOLEAN DEFAULT FALSE,
    training_completed BOOLEAN DEFAULT FALSE,
    go_live BOOLEAN DEFAULT FALSE,
    success_review BOOLEAN DEFAULT FALSE,
    overall_progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. KNOWLEDGE CATEGORIES
CREATE TABLE IF NOT EXISTS knowledge_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. KNOWLEDGE ARTICLES
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES knowledge_categories(id) ON DELETE SET NULL,
    author_id UUID,
    status TEXT DEFAULT 'Published',
    views INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ARTICLE FEEDBACK
CREATE TABLE IF NOT EXISTS article_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
    helpful BOOLEAN NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. LIVE CHAT SESSIONS
CREATE TABLE IF NOT EXISTS live_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name TEXT,
    visitor_email TEXT,
    agent_id UUID REFERENCES support_agents(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Active', -- Active, Transferred, Closed
    channel TEXT DEFAULT 'Website',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 20. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- visitor, agent, bot
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. CUSTOMER FEEDBACK
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. NPS SURVEYS
CREATE TABLE IF NOT EXISTS nps_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT NOT NULL,
    score INTEGER CHECK (score BETWEEN 0 AND 10),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. CSAT SURVEYS
CREATE TABLE IF NOT EXISTS csat_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    rating_score INTEGER CHECK (rating_score BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. FEATURE REQUESTS
CREATE TABLE IF NOT EXISTS feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    votes INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Under Review', -- Under Review, Planned, In Progress, Completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. COMMUNITY POSTS
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. COMMUNITY COMMENTS
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'Release Notes', -- Release Notes, Maintenance, Feature Update
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. CUSTOMER ASSETS
CREATE TABLE IF NOT EXISTS customer_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- Domain, Hosting, SSL, License, Server
    details JSONB DEFAULT '{}',
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. SUPPORT LOGS
CREATE TABLE IF NOT EXISTS support_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    agent_name TEXT,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. REMOTE SESSIONS
CREATE TABLE IF NOT EXISTS remote_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    session_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Scheduled', -- Scheduled, Active, Completed
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. SUPPORT NOTIFICATIONS
CREATE TABLE IF NOT EXISTS support_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- New Ticket, Ticket Assigned, SLA Breach, Customer Reply, Renewal Reminder, Escalation Alert
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. SUPPORT AUTOMATION RULES
CREATE TABLE IF NOT EXISTS support_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name TEXT NOT NULL,
    trigger_event TEXT NOT NULL,
    conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. SUPPORT WORKFLOW RUNS
CREATE TABLE IF NOT EXISTS support_workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES support_automation_rules(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. SUPPORT AUDIT LOGS
CREATE TABLE IF NOT EXISTS support_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. SUPPORT CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS support_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name TEXT UNIQUE NOT NULL,
    field_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 36. SUPPORT ATTACHMENTS
CREATE TABLE IF NOT EXISTS support_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. SUPPORT BUSINESS HOURS
CREATE TABLE IF NOT EXISTS support_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FASTER TICKETING LOOKUPS
CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_email ON tickets(customer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_agent ON tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_live_chat_sessions_status ON live_chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_customer_health_score ON customer_health(health_score);
CREATE INDEX IF NOT EXISTS idx_renewals_date ON renewals(renewal_date);
