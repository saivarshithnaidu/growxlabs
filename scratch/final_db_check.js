const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDB() {
  const { count: c1, error: e1 } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  const { count: c2, error: e2 } = await supabase.from('crm_leads').select('*', { count: 'exact', head: true });
  
  console.log('--- TABLE COUNTS ---');
  console.log('leads:', c1, e1 ? e1.message : '');
  console.log('crm_leads:', c2, e2 ? e2.message : '');

  const { data: latest, error: le } = await supabase.from('crm_leads').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('--- LATEST CRM LEADS ---');
  console.log(JSON.stringify(latest, null, 2));
}

checkDB();
