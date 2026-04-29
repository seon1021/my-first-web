import { supabase } from './supabase'

export type Comment = {
  id: number;
  post_id: number;
  user_id: string;
  author_email: string;
  content: string;
  created_at?: string;
};

/**
 * 특정 포스트의 모든 댓글 조회 (오름차순 정렬)
 */
export async function getComments(postId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getComments error:', error)
    return []
  }

  return data || []
}

/**
 * 특정 포스트에 댓글 생성
 */
export async function createComment(
  postId: number,
  userId: string,
  authorEmail: string,
  content: string
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, user_id: userId, author_email: authorEmail, content }])
    .select()
    .single()

  if (error) {
    console.error('createComment error:', error)
    return null
  }

  return data
}

/**
 * 특정 댓글 삭제
 */
export async function deleteComment(commentId: number): Promise<boolean> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('deleteComment error:', error)
    return false
  }

  return true
}
