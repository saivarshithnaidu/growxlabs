const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  const { count: crmLeadsCount } = await supabase.from('crm_leads').select('*', { count: 'exact', head: true });
  
  console.log('Leads count:', leadsCount);
  console.log('CRM Leads count:', crmLeadsCount);
}

check();
