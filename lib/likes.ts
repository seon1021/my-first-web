import { supabase } from './supabase'

// 런타임에 likes 테이블 사용 가능 여부를 기록합니다.
export let likesAvailable = true
export function isLikesAvailable() {
  return likesAvailable
}

// 로컬 폴백: localStorage 기반 좋아요 저장 (서버 테이블 미존재 시 사용)
function localStorageAvailable() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

function getLocalKeyForUser(userId: string) {
  return `local_likes_user_${userId}`
}

function getLocalLikedSet(userId: string): Set<string> {
  if (!localStorageAvailable()) return new Set()
  try {
    const raw = window.localStorage.getItem(getLocalKeyForUser(userId))
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function setLocalLikedSet(userId: string, set: Set<string>) {
  if (!localStorageAvailable()) return
  try {
    const arr = Array.from(set)
    window.localStorage.setItem(getLocalKeyForUser(userId), JSON.stringify(arr))
  } catch {
    // ignore
  }
}

function getLocalCountKey(postId: string) {
  return `local_likes_count_${postId}`
}

function getLocalCount(postId: string): number {
  if (!localStorageAvailable()) return 0
  try {
    const raw = window.localStorage.getItem(getLocalCountKey(postId))
    if (!raw) return 0
    return Number(raw) || 0
  } catch {
    return 0
  }
}

function setLocalCount(postId: string, count: number) {
  if (!localStorageAvailable()) return
  try {
    window.localStorage.setItem(getLocalCountKey(postId), String(count))
  } catch {
    // ignore
  }
}

export async function getLikesCount(postId: string): Promise<number> {
  // 서버 테이블 사용 불가 시 로컬 폴백
  if (!likesAvailable && localStorageAvailable()) {
    return getLocalCount(postId)
  }

  try {
    const { count, error } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (error) {
      // 테이블이 존재하지 않는 경우는 마이그레이션 미적용 가능성
      if (error.code === 'PGRST205') {
        likesAvailable = false
        console.error('getLikesCount error: likes 테이블을 찾을 수 없습니다. supabase 마이그레이션을 적용하세요.', JSON.stringify(error))
        return 0
      }
      console.error('getLikesCount error:', JSON.stringify(error))
      return 0
    }

    return count || 0
  } catch (err) {
    console.error('getLikesCount unexpected error:', err)
    return 0
  }
}

export async function hasUserLiked(postId: string, userId: string): Promise<boolean> {
  if (!userId) return false
  // 서버 테이블 사용 불가 시 로컬 폴백
  if (!likesAvailable && localStorageAvailable()) {
    const set = getLocalLikedSet(userId)
    return set.has(postId)
  }

  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .limit(1)

    if (error) {
      if (error.code === 'PGRST205') {
        likesAvailable = false
        console.error('hasUserLiked error: likes 테이블을 찾을 수 없습니다. supabase 마이그레이션을 적용하세요.', JSON.stringify(error))
        return false
      }
      console.error('hasUserLiked error:', JSON.stringify(error))
      return false
    }

    return (data && data.length > 0) || false
  } catch (err) {
    console.error('hasUserLiked unexpected error:', err)
    return false
  }
}

export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean; count: number } | null> {
  if (!userId) return null

  try {
    // 서버 테이블 사용 불가 시 로컬 폴백
    if (!likesAvailable && localStorageAvailable()) {
      const set = getLocalLikedSet(userId)
      const had = set.has(postId)
      if (had) {
        set.delete(postId)
        setLocalLikedSet(userId, set)
        // 로컬 카운트 감소
        const newCount = Math.max(0, getLocalCount(postId) - 1)
        setLocalCount(postId, newCount)
        return { liked: false, count: newCount }
      } else {
        set.add(postId)
        setLocalLikedSet(userId, set)
        const newCount = getLocalCount(postId) + 1
        setLocalCount(postId, newCount)
        return { liked: true, count: newCount }
      }
    }

    // 클라이언트에서 직접 DB에 쓰는 대신 서버 API를 호출하도록 변경합니다.
    // 서버는 서비스 역할 키를 사용하여 RLS/외래키 이슈를 안전하게 처리합니다.
    if (typeof window !== 'undefined') {
      try {
        const session = await supabase.auth.getSession()
        const accessToken = session?.data?.session?.access_token
        if (!accessToken) {
          console.error('toggleLike: no access token in session')
          return null
        }

        const resp = await fetch('/api/toggle-like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, accessToken }),
        })

        const json = await resp.json()
        if (!resp.ok) {
          console.error('toggleLike api error:', json)
          return null
        }

        return { liked: json.liked, count: json.count }
      } catch (err) {
        console.error('toggleLike api unexpected error:', err)
        return null
      }
    } else {
      // 서버 환경에서는 기존 방식 유지
      let liked = await hasUserLiked(postId, userId)
      if (liked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)

        if (error) {
          console.error('toggleLike delete error:', error)
          return null
        }
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }])

        if (error) {
          if (error.code === 'PGRST205') {
            likesAvailable = false
            console.error('toggleLike insert error: likes 테이블을 찾을 수 없습니다. supabase 마이그레이션을 적용하세요.', JSON.stringify(error))
          } else {
            console.error('toggleLike insert error:', JSON.stringify(error))
          }
          return null
        }
      }

      const count = await getLikesCount(postId)
      return { liked: !liked, count }
    }
  } catch (err) {
    console.error('toggleLike unexpected error:', err)
    return null
  }
}
