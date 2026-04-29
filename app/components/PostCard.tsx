import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/lib/posts'

interface PostCardProps {
  post: Post
}

/**
 * 메인 페이지의 글 카드
 * 글 목록에서 반복되는 컴포넌트
 * 제목, 작성일, 미리보기 내용 표시
 */
export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '날짜 없음'
    return new Date(dateString).toLocaleDateString('ko-KR')
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
          <p className="text-foreground line-clamp-3">
            {post.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
