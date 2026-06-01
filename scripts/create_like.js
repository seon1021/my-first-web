require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const [,, postId, userId] = process.argv
if (!postId || !userId) {
  console.error('Usage: node create_like.js <postId> <userId>')
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
  try {
    const { data, error } = await supabase
      .from('likes')
      .insert([{ post_id: Number(postId) || postId, user_id: userId }])
      .select()
      .single()

    if (error) {
      console.error('insert like error:', JSON.stringify(error))
      process.exit(1)
    }

    console.log('Created like:', data)
    process.exit(0)
  } catch (err) {
    console.error('Unexpected', err)
    process.exit(1)
  }
}

run()
