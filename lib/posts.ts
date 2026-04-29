import { supabase } from './supabase'

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
};

/**
 * 모든 포스트 조회 (내림차순)
 */
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPosts error:', error)
    return []
  }

  return data || []
}

/**
 * 특정 사용자의 포스트 조회 (내림차순)
 */
export async function getPostsByUser(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPostsByUser error:', error)
    return []
  }

  return data || []
}

/**
 * 특정 ID 포스트 조회
 */
export async function getPost(id: number): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getPost error:', error)
    return null
  }

  return data
}

/**
 * 새 포스트 생성
 */
export async function createPost(
  post: Omit<Post, 'id' | 'created_at' | 'updated_at'>,
  userId?: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ ...post, user_id: userId }])
    .select()
    .single()

  if (error) {
    console.error('createPost error:', error)
    return null
  }

  return data
}

/**
 * 포스트 업데이트
 */
export async function updatePost(
  id: number,
  updates: Partial<Omit<Post, 'id' | 'created_at'>>
): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('updatePost error:', error)
    return null
  }

  return data
}

/**
 * 포스트 삭제
 */
export async function deletePost(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deletePost error:', error)
    return false
  }

  return true
}

// 재시작/마이그레이션 중 로컬 더미 데이터 (선택사항)
export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content: "React 19에서 달라진 점...",
    author: "김코딩",
    created_at: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content: "Tailwind CSS 4의 핵심...",
    author: "이디자인",
    created_at: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content: "App Router를 사용하면...",
    author: "박개발",
    created_at: "2026-03-25",
  },
];
