require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const [,, id, email] = process.argv
if (!id || !email) {
  console.error('Usage: node insert_profile.js <id> <email>')
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || (!anon && !service)) {
  console.error('Missing supabase config in .env.local')
  process.exit(1)
}

const keyToUse = service || anon
const supabase = createClient(url, keyToUse)

async function run() {
  const username = email.split('@')[0]
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id, username, avatar_url: null })
      .select()
      .single()

    if (error) {
      console.error('upsert error:', error)
      process.exit(1)
    }

    console.log('Upserted profile:', data)
    process.exit(0)
  } catch (err) {
    console.error('Unexpected', err)
    process.exit(1)
  }
}

run()
