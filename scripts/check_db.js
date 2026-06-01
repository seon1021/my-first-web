require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || (!anon && !service)) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const keyToUse = service || anon
const supabase = createClient(url, keyToUse)

async function check() {
  try {
    console.log('Checking posts table...')
    const { data: posts, error: err1 } = await supabase.from('posts').select('id, image_url, user_id').limit(5)
    if (err1) console.error('posts select error:', err1.message || err1)
    else console.log('posts select OK, sample row:', posts && posts[0])

    console.log('Checking likes table...')
    const { data: likes, error: err2 } = await supabase.from('likes').select('id, post_id, user_id').limit(5)

    console.log('Checking profiles table...')
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, username').limit(5)
    if (pErr) console.error('profiles select error:', pErr.message || pErr)
    else console.log('profiles sample:', profiles)
    if (err2) console.error('likes select error:', err2.message || err2)
    else console.log('likes select OK, sample row:', likes && likes[0])

    process.exit(0)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

check()
