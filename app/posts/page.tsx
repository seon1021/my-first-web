'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPosts, deletePost as deletePostApi, type Post } from '../../lib/posts'
import SearchBar from '../components/SearchBar'
import PostCard from '../components/PostCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(data)
      setFiltered(data)
    } catch (err) {
      console.error('포스트 로드 실패:', err)
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
        await loadPosts()
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

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">로딩 중...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 영역 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-foreground">글 목록</h1>
          <Link href="/posts/new">
            <Button>새 글 작성</Button>
          </Link>
        </div>

        {/* 검색 영역 */}
        <div className="mb-8">
          <SearchBar items={posts} onFilter={setFiltered} />
        </div>

        {/* 글 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">작성된 글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((post: Post) => (
              <div key={post.id} className="relative group">
                <PostCard post={post} />

                {/* 관리 버튼 - 모바일에서도 터치 가능하도록 배치 */}
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
    </section>
  )
}
