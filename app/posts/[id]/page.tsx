import Link from 'next/link'
import { getPost } from '../../../lib/posts'
import PostDetailHeader from '../../components/PostDetailHeader'
import PostContent from '../../components/PostContent'
import PostSidebar from '../../components/PostSidebar'

export default async function Page({ params }: { params: any }) {
  const { id } = await params
  const post = await getPost(Number(id))

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
        <Link href="/posts" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      {/* 헤더 영역 */}
      <PostDetailHeader
        postId={post.id}
        title={post.title}
        author={post.author}
        createdAt={post.created_at}
      />

      {/* 콘텐츠 + 사이드바 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 본문 영역 (2/3) */}
        <div className="md:col-span-2">
          <PostContent content={post.content} />
        </div>

        {/* 사이드바 (1/3) */}
        <div className="md:col-span-1">
          <PostSidebar postId={post.id} />
        </div>
      </div>
    </article>
  )
}
