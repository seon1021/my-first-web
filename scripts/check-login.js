require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('env missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run(email, password) {
  try {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) {
      console.log('ERROR:', res.error.message || JSON.stringify(res.error));
      process.exit(2);
    }
    if (res.data && res.data.session) {
      console.log('OK: signed in, session present');
      process.exit(0);
    }
    console.log('ERROR: unexpected response');
    process.exit(3);
  } catch (e) {
    console.error('EXCEPTION:', e.message || e);
    process.exit(4);
  }
}

// Read args but do NOT log them
const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node check-login.js <email> <password>');
  process.exit(1);
}
run(email, password);
