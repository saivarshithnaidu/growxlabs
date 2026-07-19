-- ============================================================================
-- GROWXLABS ENTERPRISE AI PLATFORM & AUTOMATION DATABASE SCHEMA
-- Run this in your Supabase SQL Editor to create all 27 normalized tables
-- ============================================================================

-- 1. AI AGENTS
CREATE TABLE IF NOT EXISTS ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name TEXT UNIQUE NOT NULL, -- Sales Agent, CRM Agent, Finance Agent, HR Agent, Support Agent, Project Manager Agent, Developer Agent, Legal Agent, Executive Assistant
    role_description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    model_provider TEXT DEFAULT 'Google Gemini',
    model_name TEXT DEFAULT 'gemini-1.5-flash',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AGENT TOOLS
CREATE TABLE IF NOT EXISTS agent_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL, -- crm_query, create_invoice, send_email, search_knowledge, execute_workflow
    module_target TEXT NOT NULL, -- CRM, PM, Finance, HRMS, Marketing, Support, Admin
    parameters_schema JSONB DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGENT RUNS
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    triggered_by_user TEXT NOT NULL,
    input_prompt TEXT NOT NULL,
    output_response TEXT,
    execution_status TEXT DEFAULT 'Completed', -- Running, Completed, Failed, Pending_Approval
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(8,5) DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENT MEMORY
CREATE TABLE IF NOT EXISTS agent_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    memory_type TEXT DEFAULT 'Long_Term', -- User_Memory, Org_Memory, Project_Memory, Customer_Memory
    memory_key TEXT NOT NULL,
    memory_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AGENT PERMISSIONS
CREATE TABLE IF NOT EXISTS agent_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
    module TEXT NOT NULL, -- CRM, PM, Finance, HRMS, Marketing, Support, Admin
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT FALSE,
    can_execute_actions BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AGENT WORKFLOWS
CREATE TABLE IF NOT EXISTS agent_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    trigger_module TEXT NOT NULL, -- CRM, Projects, Finance, HR, Marketing, Support
    trigger_event TEXT NOT NULL, -- Lead_Qualified, Ticket_Escalated, Invoice_Overdue
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WORKFLOW STEPS
CREATE TABLE IF NOT EXISTS workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES agent_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    step_type TEXT NOT NULL, -- AI_Action, Condition, Delay, Webhook, Notification
    action_name TEXT NOT NULL,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WORKFLOW RUNS
CREATE TABLE IF NOT EXISTS workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES agent_workflows(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Success', -- Success, Failed, Running, Waiting_Approval
    logs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. KNOWLEDGE DOCUMENTS
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_type TEXT NOT NULL, -- PDF, Word, SOP, Invoice, Contract, Meeting_Notes
    category TEXT DEFAULT 'General',
    source_url TEXT,
    content_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. KNOWLEDGE CHUNKS
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EMBEDDINGS
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id UUID REFERENCES knowledge_chunks(id) ON DELETE CASCADE,
    model_name TEXT DEFAULT 'text-embedding-004',
    embedding_vector JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. VECTOR INDEX
CREATE TABLE IF NOT EXISTS vector_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    index_name TEXT UNIQUE NOT NULL,
    dimension INTEGER DEFAULT 768,
    algorithm TEXT DEFAULT 'cosine',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PROMPTS
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- Sales, Marketing, Support, Engineering, HR, Finance
    template_text TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    is_shared BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PROMPT VERSIONS
CREATE TABLE IF NOT EXISTS prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    template_text TEXT NOT NULL,
    change_log TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. MODEL PROVIDERS
CREATE TABLE IF NOT EXISTS model_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT UNIQUE NOT NULL, -- Google Gemini, OpenAI, Anthropic, OpenRouter, Local
    api_endpoint TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MODEL USAGE
CREATE TABLE IF NOT EXISTS model_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    total_calls INTEGER DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    total_cost_usd DECIMAL(12,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. TOKEN USAGE
CREATE TABLE IF NOT EXISTS token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    module TEXT NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost_usd DECIMAL(8,5) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CONVERSATION SESSIONS
CREATE TABLE IF NOT EXISTS conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_title TEXT NOT NULL,
    user_email TEXT NOT NULL,
    agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- user, agent, system
    sender_name TEXT NOT NULL,
    message_text TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. VOICE SESSIONS
CREATE TABLE IF NOT EXISTS voice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    transcript TEXT NOT NULL,
    ai_summary TEXT,
    action_items JSONB DEFAULT '[]',
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. DOCUMENT ANALYSIS
CREATE TABLE IF NOT EXISTS document_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_name TEXT NOT NULL,
    file_type TEXT NOT NULL, -- Invoice, Resume, Contract, Report
    extracted_metadata JSONB DEFAULT '{}',
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AUTOMATION LOGS
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    triggered_by TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    logs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_module TEXT NOT NULL, -- CRM, PM, Finance, HRMS, Support, Marketing
    entity_id TEXT,
    recommendation_text TEXT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.95,
    is_actioned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. SEARCH INDEX
CREATE TABLE IF NOT EXISTS search_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- Lead, Deal, Task, Invoice, Ticket, Document
    entity_id TEXT NOT NULL,
    searchable_text TEXT NOT NULL,
    module TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'Workflow_Complete',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. AI AUDIT LOGS
CREATE TABLE IF NOT EXISTS ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL, -- Prompt_Executed, Tool_Called, Data_Accessed, Workflow_Run
    agent_name TEXT,
    module_target TEXT,
    pii_filtered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. AI CUSTOM FIELDS
CREATE TABLE IF NOT EXISTS ai_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- Agent, Prompt, Knowledge_Doc
    field_name TEXT NOT NULL,
    field_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FASTER AI ENGINE LOOKUPS
CREATE INDEX IF NOT EXISTS idx_ai_agents_name ON ai_agents(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_type ON knowledge_documents(file_type);
CREATE INDEX IF NOT EXISTS idx_token_usage_email ON token_usage(user_email);
CREATE INDEX IF NOT EXISTS idx_search_index_text ON search_index(searchable_text);
