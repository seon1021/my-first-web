import { supabase } from './supabase'

/**
 * 회원가입
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })

  // 자세한 디버그 정보 출력
  try {
    console.debug('signUp response:', JSON.stringify({ data, error }, null, 2))
  } catch (e) {
    console.debug('signUp response (non-serializable):', { data, error })
  }

  if (error) {
    console.error('signUp error:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * 로그인
 */
export async function signIn(email: string, password: string) {
  try {
    const res = await supabase.auth.signInWithPassword({ email, password })

    // 자세한 디버그 정보 출력
    try {
      console.debug('signIn response:', JSON.stringify(res, null, 2))
    } catch (e) {
      console.debug('signIn response (non-serializable):', res)
    }

    const { data, error } = res

    if (error) {
      console.error('signIn error:', error)
      const msg = (error as any)?.message ?? JSON.stringify(error)
      throw new Error(msg)
    }

    return data
  } catch (e: any) {
    console.error('signIn exception:', e)
    const msg = e instanceof Error ? e.message : JSON.stringify(e)
    throw new Error(msg)
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * 현재 로그인된 사용자 조회
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
