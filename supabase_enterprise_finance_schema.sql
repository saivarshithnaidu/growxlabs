-- Supabase PostgreSQL Enterprise Finance & Accounting Schema (Phase 3)

-- ENUMS DEFINITIONS (Safe creation)
DO $$ BEGIN
  CREATE TYPE account_type_enum AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status_enum AS ENUM ('DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('UPI', 'CARD', 'BANK_TRANSFER', 'RAZORPAY', 'STRIPE', 'CASH', 'CHEQUE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE finance_approval_type_enum AS ENUM ('EXPENSE', 'PURCHASE', 'INVOICE', 'REFUND', 'BUDGET');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1. CHART OF ACCOUNTS
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- e.g., '1010' for Cash, '4010' for Revenue
  name TEXT NOT NULL,
  type account_type_enum NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed basic Chart of Accounts
INSERT INTO public.chart_of_accounts (code, name, type, balance, description) VALUES
  ('1010', 'Cash & Bank Balances', 'ASSET', 500000.00, 'Cash in hand and bank accounts'),
  ('1200', 'Accounts Receivable', 'ASSET', 0.00, 'Outstanding client invoices'),
  ('1500', 'Office Equipment', 'ASSET', 150000.00, 'Company computers and furniture'),
  ('2010', 'Accounts Payable', 'LIABILITY', 0.00, 'Outstanding vendor bills'),
  ('2200', 'GST Payable', 'LIABILITY', 0.00, 'Tax liabilities due to government'),
  ('3010', 'Retained Earnings', 'EQUITY', 650000.00, 'Accumulated earnings retained'),
  ('4010', 'SaaS Licensing Revenue', 'INCOME', 0.00, 'Income from SaaS product licenses'),
  ('4020', 'Consulting & Setup Fees', 'INCOME', 0.00, 'Income from professional setup services'),
  ('5010', 'Employee Salaries', 'EXPENSE', 0.00, 'Staff payroll payments'),
  ('5020', 'Cloud Infrastructure', 'EXPENSE', 0.00, 'AWS/GCP infrastructure costs'),
  ('5030', 'Travel & Entertainment', 'EXPENSE', 0.00, 'Employee business travel claims')
ON CONFLICT (code) DO NOTHING;

-- 2. JOURNAL ENTRIES
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  reference TEXT, -- Invoice number, receipt code etc.
  description TEXT,
  posted_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JOURNAL ITEMS (Double-entry line items: debits must equal credits)
CREATE TABLE IF NOT EXISTS public.journal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.chart_of_accounts(id) ON DELETE RESTRICT,
  debit DECIMAL(15, 2) DEFAULT 0.00 CHECK (debit >= 0),
  credit DECIMAL(15, 2) DEFAULT 0.00 CHECK (credit >= 0),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_debit_credit CHECK (
    (debit > 0 AND credit = 0) OR 
    (credit > 0 AND debit = 0)
  )
);

-- 4. ESTIMATES
CREATE TABLE IF NOT EXISTS public.estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_number TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  subtotal DECIMAL(15, 2) DEFAULT 0.00,
  tax_amount DECIMAL(15, 2) DEFAULT 0.00,
  discount_amount DECIMAL(15, 2) DEFAULT 0.00,
  grand_total DECIMAL(15, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, APPROVED, REJECTED, CONVERTED
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  project_id UUID, -- References public.projects(id) ON DELETE SET NULL (defined in Phase 2)
  subtotal DECIMAL(15, 2) DEFAULT 0.00,
  tax_amount DECIMAL(15, 2) DEFAULT 0.00,
  discount_amount DECIMAL(15, 2) DEFAULT 0.00,
  grand_total DECIMAL(15, 2) DEFAULT 0.00,
  status invoice_status_enum DEFAULT 'DRAFT',
  due_date DATE NOT NULL,
  payment_terms TEXT, -- NET 30, NET 15 etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INVOICE ITEMS
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(15, 2) DEFAULT 0.00,
  cgst DECIMAL(5, 2) DEFAULT 9.00, -- CGST (Central GST)
  sgst DECIMAL(5, 2) DEFAULT 9.00, -- SGST (State GST)
  igst DECIMAL(5, 2) DEFAULT 0.00, -- IGST (Integrated GST)
  discount DECIMAL(15, 2) DEFAULT 0.00,
  total_price DECIMAL(15, 2) NOT NULL
);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  payment_method payment_method_enum NOT NULL,
  transaction_id TEXT, -- Razorpay/Stripe token reference
  payment_date DATE NOT NULL,
  status payment_status_enum DEFAULT 'COMPLETED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VENDORS
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gst TEXT,
  pan TEXT,
  email TEXT,
  phone TEXT,
  bank_name TEXT,
  bank_account_no TEXT,
  bank_ifsc TEXT,
  outstanding_balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- TRAVEL,INFRASTRUCTURE,SALARY etc.
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  project_id UUID, -- References projects table
  amount DECIMAL(15, 2) NOT NULL,
  gst_paid DECIMAL(15, 2) DEFAULT 0.00,
  payment_method payment_method_enum DEFAULT 'BANK_TRANSFER',
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  approved_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PURCHASE ORDERS
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, BILLED
  delivery_status TEXT DEFAULT 'PENDING', -- PENDING, SHIPPED, DELIVERED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. VENDOR BILLS
CREATE TABLE IF NOT EXISTS public.vendor_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'UNPAID', -- UNPAID, PAID, OVERDUE
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BANK ACCOUNTS
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT UNIQUE NOT NULL,
  ifsc_code TEXT NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BANK TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL, -- positive for deposit, negative for withdrawal
  is_reconciled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BUDGETS
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  project_id UUID, -- Maps to projects
  monthly_limit DECIMAL(15, 2) NOT NULL,
  actual_spend DECIMAL(15, 2) DEFAULT 0.00,
  month_year DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (department, project_id, month_year)
);

-- 15. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  billing_interval TEXT NOT NULL, -- MONTHLY, QUARTERLY, YEARLY
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, CANCELLED
  next_billing_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FINANCIAL CONTRACTS
CREATE TABLE IF NOT EXISTS public.financial_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  payment_terms TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ASSETS
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  purchase_cost DECIMAL(15, 2) NOT NULL,
  purchase_date DATE NOT NULL,
  depreciation_rate DECIMAL(5, 2) NOT NULL, -- annual percent
  current_value DECIMAL(15, 2) NOT NULL,
  assigned_to_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ASSET DEPRECIATION LOGS
CREATE TABLE IF NOT EXISTS public.asset_depreciation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  depreciation_date DATE NOT NULL,
  depreciation_amount DECIMAL(15, 2) NOT NULL,
  posted_journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.finance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- INVOICE_PAID, JOURNAL_POSTED etc.
  details JSONB,
  performed_by_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. APPROVAL REQUESTS
CREATE TABLE IF NOT EXISTS public.finance_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_type finance_approval_type_enum NOT NULL,
  record_id UUID NOT NULL, -- references expense_id, po_id etc.
  status approval_status_enum DEFAULT 'PENDING',
  approver_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
