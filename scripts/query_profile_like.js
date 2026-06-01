require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const id = process.argv[2]
if (!id) {
  console.error('Usage: node query_profile_like.js <user_id> [post_id]')
  process.exit(1)
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(url, key)
const postId = process.argv[3]
;(async() => {
  const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (pErr) console.error('profiles select error:', pErr)
  else console.log('profile:', profile)

  if (postId) {
    const { data: like, error: lErr } = await supabase.from('likes').select('*').eq('user_id', id).eq('post_id', Number(postId) || postId)
    if (lErr) console.error('likes select error:', lErr)
    else console.log('likes for post:', like)

    const { data: count, error: cErr } = await supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', Number(postId) || postId)
    if (cErr) console.error('count error:', cErr)
    else console.log('likes count for post', postId, ':', count)
  }
  process.exit(0)
})()
