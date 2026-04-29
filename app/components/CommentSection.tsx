'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { getComments, createComment, deleteComment, type Comment } from '@/lib/comments'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

export default function CommentSection({ postId }: { postId: number }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  async function loadComments() {
    try {
      setLoading(true)
      const data = await getComments(postId)
      setComments(data)
    } catch (err) {
      console.error('댓글 로딩 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || user.email === undefined || !newComment.trim()) return

    try {
      setIsSubmitting(true)
      const comment = await createComment(postId, user.id, user.email, newComment.trim())
      if (comment) {
        setNewComment('')
        await loadComments()
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      alert('댓글 작성을 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (commentId: number) => {
    setDeleteTargetId(commentId)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteTargetId) return

    try {
      setIsDeleting(true)
      const success = await deleteComment(deleteTargetId)
      if (success) {
        await loadComments()
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      alert('댓글 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">댓글 {comments.length > 0 && `(${comments.length})`}</h3>
      
      {/* 댓글 목록 */}
      <div className="space-y-6 mb-8">
        {loading ? (
          <p className="text-muted-foreground text-sm">댓글을 불러오는 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{comment.author_email.split('@')[0]}</p>
                <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              </div>
              
              {/* 내 댓글인 경우 삭제 버튼 표시 */}
              {user && user.id === comment.user_id && (
                <div className="ml-4 shrink-0">
                  <button 
                    onClick={() => openDeleteDialog(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-2 text-sm font-medium text-gray-700">
            {user.email} <span className="font-normal text-gray-500">님으로 댓글 작성</span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 남겨주세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
            rows={3}
            disabled={isSubmitting}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
          <p className="text-gray-600 mb-4 text-sm">댓글을 남기려면 로그인이 필요합니다.</p>
          <Link href="/login">
            <Button variant="outline">로그인하러 가기</Button>
          </Link>
        </div>
      )}

      {/* 삭제 확인 Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>댓글을 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 정밀로 이 댓글을 삭제하시겠습니까?
          </DialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
