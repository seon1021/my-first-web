import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { postId, accessToken } = body
    if (!postId || !accessToken) return NextResponse.json({ error: 'postId and accessToken required' }, { status: 400 })

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey)

    // validate token -> get user
    const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'invalid token' }, { status: 401 })
    }

    const userId = userData.user.id

    // ensure profile exists
    await admin.from('profiles').upsert({ id: userId }).throwOnError()

    // toggle like
    const { data: existing } = await admin.from('likes').select('id').eq('post_id', postId).eq('user_id', userId).limit(1)

    if (existing && existing.length > 0) {
      // delete
      await admin.from('likes').delete().eq('post_id', postId).eq('user_id', userId).throwOnError()
    } else {
      await admin.from('likes').insert([{ post_id: postId, user_id: userId }]).throwOnError()
    }

    const { data: countData } = await admin.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', postId)
    const count = countData || 0

    return NextResponse.json({ liked: !(existing && existing.length > 0), count })
  } catch (err: any) {
    console.error('toggle-like API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
