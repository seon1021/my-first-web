import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PostDetailHeaderProps {
  postId: number
  title: string
  author: string
  createdAt: string | undefined
}

/**
 * 상세 페이지 헤더
 * 글 제목과 메타 정보(작성자, 날짜), 액션 버튼 표시
 */
export default function PostDetailHeader({
  postId,
  title,
  author,
  createdAt,
}: PostDetailHeaderProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '날짜 없음'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  return (
    <div className="border-b pb-6 mb-6">
      {/* 액션 버튼 영역 - 모바일에서 줄 바꿈 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/posts">
          <Button size="sm" variant="outline">
            코드
          </Button>
        </Link>
        <Link href={`/posts/${postId}/edit`}>
          <Button size="sm" variant="outline">
            메모
          </Button>
        </Link>
        <Button size="sm" variant="outline">
          공유
        </Button>
      </div>

      {/* 글 제목 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 break-words">{title}</h1>

      {/* 메타 정보 (작성자, 날짜) */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span className="font-medium">{author}</span>
        <span>•</span>
        <span>{formatDate(createdAt)}</span>
      </div>
    </div>
  )
}

