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
    .single()

  if (error) {
    console.error('getProfile error:', error)
    return null
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
