import { getPosts, posts as samplePosts, type Post } from '@/lib/posts'
import PostCard from './components/PostCard'

export default async function Home() {
  let data: Post[] = []
  try {
    data = await getPosts()
  } catch (err) {
    console.error('메인 페이지 포스트 로드 실패:', err)
  }

  if (!data || data.length === 0) {
    data = samplePosts
  }

  const preview = data.slice(0, 3)

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단: 왼쪽 큰 타이틀 (액션 버튼 제거됨) */}
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight">BLOG</h1>
        </header>

        {/* 게시글 레이블 */}
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">게시글</span>
        </div>

        {/* 카드 프리뷰: 3열 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {preview.map((post) => (
            <div key={post.id} className="h-72">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
