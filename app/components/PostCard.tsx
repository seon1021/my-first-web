"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/lib/posts'
import { useAuth } from './AuthProvider'
import { getLikesCount, hasUserLiked, toggleLike, isLikesAvailable } from '@/lib/likes'
import { Button } from '@/components/ui/button'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '날짜 없음'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const { user } = useAuth()
  const [likes, setLikes] = useState<number>(0)
  const [liked, setLiked] = useState<boolean>(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const id = String((post as any).id)
        const c = await getLikesCount(id)
        if (mounted) setLikes(c)

        if (user) {
          const h = await hasUserLiked(id, String(user.id))
          if (mounted) setLiked(h)
        }
      } catch (err) {
        console.error('load likes error:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [post, user])

  async function onToggle(e: React.MouseEvent) {
    e.preventDefault()
    if (!user) {
      window.location.href = `/login?next=/posts/${(post as any).id}`
      return
    }

    if (busy) return
    setBusy(true)
    const id = String((post as any).id)
    const res = await toggleLike(id, String(user.id))
    if (res) {
      setLiked(res.liked)
      setLikes(res.count)
    } else {
      console.error('toggleLike returned null for', { postId: id, userId: user.id })
      alert('좋아요 처리에 실패했습니다. 콘솔을 확인하세요.')
    }
    setBusy(false)
  }

  return (
    <Link href={`/posts/${post.id}`} className="block hover:shadow-lg transition-shadow">
      <Card className="h-full cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </CardHeader>
        <CardContent>
          {post.image_url && (
            <div className="mb-3">
              <img src={post.image_url} alt="post thumbnail" className="w-full h-40 object-cover rounded-md" />
            </div>
          )}
          <p className="text-foreground line-clamp-3">{post.content}</p>

          <div className="mt-4 flex items-center gap-2">
            {!isLikesAvailable() ? (
              <div className="text-sm text-muted-foreground">좋아요 기능이 비활성화되었습니다. Supabase 마이그레이션을 적용하세요.</div>
            ) : (
              <>
                <Button size="sm" variant={liked ? 'destructive' : 'outline'} onClick={onToggle}>
                  {liked ? '♥ 좋아요' : '♡ 좋아요'}
                </Button>
                <span className="text-sm text-muted-foreground">{likes}명이 좋아합니다</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
