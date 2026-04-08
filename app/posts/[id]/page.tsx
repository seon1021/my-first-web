import Link from 'next/link'
import { posts, type Post } from '../../../lib/posts'

export default async function Page({ params }: { params: any }) {
  const { id } = await params
  const post: Post | undefined = posts.find((p) => p.id === Number(id))

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
        <Link href="/posts" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <article className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.author} • {post.date}</p>
      <div className="prose dark:prose-invert mb-8">{post.content}</div>
      <Link href="/posts" className="inline-block text-blue-600 hover:underline">목록으로 돌아가기</Link>
    </article>
  )
}
