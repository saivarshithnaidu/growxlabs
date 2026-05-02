const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCRMLeads() {
  const { data, error } = await supabase.from('crm_leads').select('*').limit(1);
  if (error) {
    console.error('Error fetching crm_leads:', error);
  } else {
    console.log('Columns in crm_leads:', data.length > 0 ? Object.keys(data[0]) : 'No data');
  }
}

checkCRMLeads();
