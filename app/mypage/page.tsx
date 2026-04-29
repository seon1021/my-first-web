'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../components/AuthProvider'
import { getPostsByUser, deletePost as deletePostApi, type Post } from '@/lib/posts'
import PostCard from '../components/PostCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

export default function MyPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // 인증 로딩 완료 후 유저가 없으면 로그인으로 리다이렉트
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadMyPosts()
    }
  }, [user])

  async function loadMyPosts() {
    if (!user) return
    try {
      setLoading(true)
      const data = await getPostsByUser(user.id)
      setPosts(data)
    } catch (err) {
      console.error('내 글 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  const openDeleteDialog = (id: number) => {
    setDeleteTargetId(id)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteTargetId) return

    try {
      setIsDeleting(true)
      const success = await deletePostApi(deleteTargetId)
      if (success) {
        await loadMyPosts()
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (err) {
      console.error('포스트 삭제 실패:', err)
      alert('포스트 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteTargetId(null)
    }
  }

  if (authLoading || (!user && loading)) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center text-muted-foreground">
        로딩 중...
      </div>
    )
  }

  if (!user) {
    return null // useEffect에서 리다이렉트 처리됨
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">{user.email}</span> 님, 환영합니다.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">내가 작성한 글</h2>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          총 {posts.length}건
        </span>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">목록을 불러오는 중...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-lg text-muted-foreground mb-4">작성된 글이 없습니다.</p>
          <Link href="/posts/new">
            <Button>첫 글 작성하러 가기</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: Post) => (
            <div key={post.id} className="relative group">
              <PostCard post={post} />

              {/* 관리 버튼 */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Link href={`/posts/${post.id}/edit`}>
                  <Button size="sm" variant="outline">
                    수정
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteDialog(post.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 삭제 확인 Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>글을 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 정말로 이 글을 삭제하시겠습니까?
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
