-- 1. LEAD SOURCES
CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    tracking_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MARKETING LEADS
CREATE TABLE IF NOT EXISTS marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    name TEXT NOT NULL,
    business_name TEXT,
    status TEXT DEFAULT 'new',
    score INTEGER DEFAULT 0,
    lead_source_id UUID REFERENCES lead_sources(id) ON DELETE SET NULL,
    crm_lead_id UUID, -- References crm_leads.id (created dynamically on sync)
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEAD SCORES
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    score_change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    objective TEXT,
    budget DECIMAL(12,2) DEFAULT 0,
    spent DECIMAL(12,2) DEFAULT 0,
    owner_id UUID, -- References team_members.id
    audience TEXT,
    channels TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    roi DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CAMPAIGN MEMBERS
CREATE TABLE IF NOT EXISTS campaign_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'added',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, lead_id)
);

-- 6. LANDING PAGES
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    template_type TEXT DEFAULT 'product',
    content JSONB DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    analytics JSONB DEFAULT '{"views": 0, "conversions": 0}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FORMS
CREATE TABLE IF NOT EXISTS forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    fields JSONB DEFAULT '[]',
    validation_rules JSONB DEFAULT '{}',
    conditional_logic JSONB DEFAULT '{}',
    spam_protection JSONB DEFAULT '{}',
    webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FORM SUBMISSIONS
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE SET NULL,
    ip_address TEXT,
    submission_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMAIL TEMPLATES
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT,
    body_html TEXT,
    body_text TEXT,
    variables JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EMAIL CAMPAIGNS
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    bounce_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EMAIL SEQUENCES
CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    steps JSONB DEFAULT '[]', -- Delay, template_id, status etc
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EMAIL EVENTS
CREATE TABLE IF NOT EXISTS email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- open, click, bounce, unsubscribe
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SOCIAL ACCOUNTS
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- Instagram, Facebook, LinkedIn, Twitter, YouTube
    account_name TEXT NOT NULL,
    access_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SOCIAL POSTS
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    status TEXT DEFAULT 'draft',
    analytics JSONB DEFAULT '{"likes": 0, "shares": 0, "comments": 0}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CONTENT LIBRARY
CREATE TABLE IF NOT EXISTS content_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- Case Study, Whitepaper, E-book, Testimonial, Portfolio
    content TEXT,
    seo_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TAGS
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. BLOGS
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    body TEXT,
    author_id UUID, -- References team_members.id
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    seo_metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SEO KEYWORDS
CREATE TABLE IF NOT EXISTS seo_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT UNIQUE NOT NULL,
    search_volume INTEGER DEFAULT 0,
    difficulty INTEGER DEFAULT 0,
    position INTEGER DEFAULT 0,
    organic_traffic INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. SEO REPORTS
CREATE TABLE IF NOT EXISTS seo_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url TEXT NOT NULL,
    score INTEGER DEFAULT 100,
    critical_issues JSONB DEFAULT '[]',
    technical_seo JSONB DEFAULT '{}',
    page_speed JSONB DEFAULT '{}',
    indexing_status TEXT DEFAULT 'indexed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. AD ACCOUNTS
CREATE TABLE IF NOT EXISTS ad_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- Google Ads, Meta Ads, LinkedIn Ads
    account_name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AD CAMPAIGNS
CREATE TABLE IF NOT EXISTS ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    budget DECIMAL(12,2) DEFAULT 0,
    spend DECIMAL(12,2) DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. AUDIENCES
CREATE TABLE IF NOT EXISTS audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    segment_rules JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. AUTOMATION WORKFLOWS
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trigger_event TEXT NOT NULL, -- FormSubmitted, LeadScoreChanged, EventRegistered
    status TEXT DEFAULT 'inactive',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. WORKFLOW STEPS
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
    step_type TEXT NOT NULL, -- Email, Delay, Conditional, NotifySales, CreateCRMLead, AssignSalesperson
    step_config JSONB DEFAULT '{}',
    step_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. WORKFLOW RUNS
CREATE TABLE IF NOT EXISTS workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    current_step_id UUID,
    status TEXT DEFAULT 'running', -- running, completed, error
    logs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'online', -- online, offline
    date TIMESTAMPTZ NOT NULL,
    registrations_count INTEGER DEFAULT 0,
    attendance_count INTEGER DEFAULT 0,
    feedback_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. EVENT REGISTRATIONS
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT FALSE,
    certificate_sent BOOLEAN DEFAULT FALSE,
    feedback_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, lead_id)
);

-- 29. SURVEYS
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- CSAT, NPS, Poll, Custom
    questions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 30. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES marketing_leads(id) ON DELETE CASCADE,
    responses JSONB DEFAULT '{}',
    nps_score INTEGER,
    csat_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    size_bytes INTEGER,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. BRAND ASSETS
CREATE TABLE IF NOT EXISTS brand_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type TEXT NOT NULL, -- Logo, Color, Font, Guideline, Template
    value JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. MARKETING NOTIFICATIONS
CREATE TABLE IF NOT EXISTS marketing_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL, -- Campaign Completed, Lead Generated, Budget Exceeded, Email Failed, Workflow Error, Ad Alert
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. ANALYTICS REPORTS
CREATE TABLE IF NOT EXISTS analytics_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type TEXT NOT NULL, -- ROI, Funnel, Attribution, Traffic
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- leads, campaigns
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, field_name)
);

-- 36. ATTACHMENTS
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 37. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- References team_members.id
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    change_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FASTER LOOKUPS
CREATE INDEX IF NOT EXISTS idx_marketing_leads_email ON marketing_leads(email);
CREATE INDEX IF NOT EXISTS idx_marketing_leads_crm ON marketing_leads(crm_lead_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON social_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_marketing_notifications_read ON marketing_notifications(read);
