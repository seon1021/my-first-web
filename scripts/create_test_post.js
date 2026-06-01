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

async function run() {
  try {
    // 프로필 아이디 확보
    let profileId = null
    const p = await supabase.from('profiles').select('id').limit(1).maybeSingle()
    if (p && p.data && p.data.id) profileId = p.data.id

    if (!profileId) {
      // posts에서 user_id가 있으면 재사용
      const q = await supabase.from('posts').select('user_id').limit(1).maybeSingle()
      if (q && q.data && q.data.user_id) profileId = q.data.user_id
    }

    if (!profileId) {
      console.log('No profile found — creating a test auth user and profile using service role key')
      // create an auth user via admin API
      try {
        const email = `e2e-test-${Date.now()}@example.com`
        const password = `Test!${Date.now()}`
        const res = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        })

        console.log('createUser response debug:', JSON.stringify(res, null, 2))

        if (res.error) {
          console.error('createUser error:', res.error)
          process.exit(1)
        }

        const uid = res.data?.user?.id
        if (!uid) {
          console.error('createUser did not return id')
          process.exit(1)
        }

        // insert profile
        const { data: prof, error: profErr } = await supabase.from('profiles').insert({ id: uid, username: 'e2e_tester' }).select().single()
        if (profErr) {
          console.error('insert profile error:', profErr)
          process.exit(1)
        }

        profileId = prof.id
        console.log('Created test profile with id', profileId)
      } catch (err) {
        console.error('Failed to create test profile:', err)
        process.exit(1)
      }
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('posts')
      .insert([
        {
          title: 'E2E 테스트 포스트 ' + Date.now(),
          content: '자동 생성된 테스트 포스트입니다.',
          author: 'tester',
          image_url: 'https://via.placeholder.com/600x400?text=test',
          user_id: profileId
        }
      ])
      .select()
      .single()

    if (insertErr) {
      console.error('insert post error:', insertErr)
      process.exit(1)
    }

    console.log('Created post:', inserted)

    // 좋아요 생성 (service key가 있어야 RLS를 우회하여 생성 가능)
    const { data: likeData, error: likeErr } = await supabase
      .from('likes')
      .insert([
        {
          post_id: inserted.id,
          user_id: profileId
        }
      ])
      .select()
      .single()

    if (likeErr) {
      console.error('insert like error:', likeErr)
    } else {
      console.log('Created like:', likeData)
    }

    process.exit(0)
  } catch (err) {
    console.error('Unexpected', err)
    process.exit(1)
  }
}

run()
