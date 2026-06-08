import { supabase } from './supabase'

export type Profile = {
  id: string
  username?: string
  avatar_url?: string
  role?: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('getProfile error:', JSON.stringify(error))
    return null
  }

  if (!data) {
    // 프로필이 없는 경우 Server Action을 호출하여 서비스 권한(RLS 우회)으로 강제 생성합니다.
    const { createProfileOnServer } = await import('@/app/actions/profile')
    const newProfile = await createProfileOnServer(userId)
    return newProfile
  }

  return data
}

export async function updateProfileAvatar(userId: string, avatarUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)

  if (error) {
    console.error('updateProfileAvatar error:', error)
    return false
  }

  return true
}
