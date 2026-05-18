require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('env missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const email = `autotest_node_${Date.now()}@example.com`;
  const password = 'nodeTest123';
  console.log('Trying signUp', email);
  const signUpRes = await supabase.auth.signUp({ email, password });
  console.log('signUpRes:', signUpRes);

  console.log('Trying signIn');
  const signInRes = await supabase.auth.signInWithPassword({ email, password });
  console.log('signInRes:', signInRes);
}

run().catch(e => { console.error('err', e); process.exit(1); });
