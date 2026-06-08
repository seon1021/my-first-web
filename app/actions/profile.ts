'use server'

import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/profiles'

export async function createProfileOnServer(userId: string): Promise<Profile | null> {
  // 이 함수는 서버 환경에서 실행되므로 SUPABASE_SERVICE_ROLE_KEY를 사용하여
  // RLS 권한을 무시하고 강제로 프로필을 생성할 수 있습니다.
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId })
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Server action profile insert error:', error)
    return null
  }
  return data
}
