require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(url, key)
;(async()=>{
  const { data, error } = await supabase.from('likes').select('*').order('created_at', {ascending:false}).limit(50)
  if (error) console.error('list likes error:', error)
  else console.log('likes:', data)
  process.exit(0)
})()
